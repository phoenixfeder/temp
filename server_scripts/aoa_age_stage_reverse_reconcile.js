// AoA KubeJS: aoa_age_stage_reverse_reconcile.js
//
// Intended recovery direction:
//   player holds an allowlisted age stage + team grant quest is incomplete
//   -> mark only that exact quest complete with TeamData.setCompleted.
//
// IMPORTANT: FTB Quests 2101.1.27 auto-claims unclaimed auto-enabled rewards
// for completed quests during a later login. Direct setCompleted does not
// replay rewards immediately, but a later login can still replay the native
// astages:player reward and re-expose offline teammates to the AStages 2.3.2
// erasure bug. The normal enable flag therefore has a second fail-closed
// interlock. Production ships with both flags false.

;(function () {
  const LOG_PREFIX = '[AoA Age Stage Reverse Reconcile]'
  const LOGIN_DELAY_TICKS = 40
  const REVERSE_HEAL_ENABLED = false
  const REVERSE_HEAL_REWARD_REPLAY_RISK_ACKNOWLEDGED = false
  const HAS_STAGE_SIGNATURE =
    'playerHasStage(net.minecraft.world.entity.player.Player,java.lang.String)'

  // (stage, exact live FTB Quests grant quest ID)
  const AGE_GRANTS = [
    ['dark_ages', '3400000000009000'],
    ['medieval_times', '097AED7C91033D5E'],
    ['the_renaissance', '6D7E8F901A2B1054'],
    ['industrial_revolution', '0B0310A0000000F0'],
    ['gilded_age', '4954631000000000'],
    ['atomic', '5057011000000004'],
    ['otherworldly', '4358010000010003'],
    ['ascension', '4256010000010006'],
    ['aoa_complete', '4153010000010002']
  ]

  function fail(message, cause) {
    var detail = cause ? ': ' + cause : ''
    var fullMessage = LOG_PREFIX + ' ' + message + detail
    console.error(fullMessage)
    throw new Error(fullMessage)
  }

  if (!REVERSE_HEAL_ENABLED) {
    console.info(LOG_PREFIX + ' disabled; no login mutation handler registered')
    return
  }

  if (!REVERSE_HEAL_REWARD_REPLAY_RISK_ACKNOWLEDGED) {
    fail(
      'Refusing to enable: FTB Quests can auto-claim and replay this quest\'s ' +
      'rewards on a later login. Keep reverse healing disabled.'
    )
  }

  function loadRequiredClass(className) {
    try {
      return Java.loadClass(className)
    } catch (error) {
      return fail('Required class unavailable: ' + className, error)
    }
  }

  if (typeof AStages === 'undefined') {
    fail('Required AStages KubeJS binding is unavailable')
  }

  const playerHasStage = AStages[HAS_STAGE_SIGNATURE]
  if (!playerHasStage) {
    fail('Required AStages method unavailable: ' + HAS_STAGE_SIGNATURE)
  }

  const TeamData = loadRequiredClass('dev.ftb.mods.ftbquests.quest.TeamData')
  const QuestObjectBase = loadRequiredClass('dev.ftb.mods.ftbquests.quest.QuestObjectBase')
  const ServerQuestFile = loadRequiredClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile')
  const JavaDate = loadRequiredClass('java.util.Date')

  function normalizedQuestCode(value) {
    return String(value || '').trim().replace(/^#/, '').toUpperCase()
  }

  function resolveAllowlist() {
    var questFile = ServerQuestFile.INSTANCE
    if (!questFile) {
      fail('ServerQuestFile.INSTANCE is unavailable during login reconcile')
    }

    var resolved = []
    for (var i = 0; i < AGE_GRANTS.length; i++) {
      var stage = AGE_GRANTS[i][0]
      var expectedCode = AGE_GRANTS[i][1]
      var parsedId
      var quest

      try {
        parsedId = QuestObjectBase.parseCodeString(expectedCode)
        quest = questFile.getQuest(parsedId)
      } catch (error) {
        fail('Could not resolve quest ' + expectedCode + ' for stage ' + stage, error)
      }

      if (!quest) {
        fail('Allowlisted quest is missing: ' + expectedCode + ' for stage ' + stage)
      }

      var actualCode
      try {
        actualCode = normalizedQuestCode(quest.getCodeString())
      } catch (error) {
        fail('Could not read resolved quest code for ' + expectedCode, error)
      }

      if (actualCode !== expectedCode) {
        fail(
          'Quest ID round-trip mismatch for stage ' + stage +
          ': expected ' + expectedCode + ', got ' + actualCode
        )
      }

      resolved.push({
        stage: stage,
        code: expectedCode,
        id: quest.getId()
      })
    }

    return resolved
  }

  function isQuestComplete(teamData, grant) {
    try {
      return teamData.getCompletedTime(grant.id).isPresent()
    } catch (error) {
      return fail('Completion check failed for quest ' + grant.code, error)
    }
  }

  function hasStage(player, stage) {
    try {
      return playerHasStage(player, stage)
    } catch (error) {
      return fail('Stage check failed for ' + stage, error)
    }
  }

  function reconcilePlayer(player) {
    var teamData
    try {
      teamData = TeamData.get(player)
    } catch (error) {
      fail('TeamData lookup failed for ' + player.username, error)
    }

    if (!teamData) {
      fail('TeamData lookup returned null for ' + player.username)
    }
    if (teamData.isLocked()) {
      fail('TeamData is locked for ' + player.username)
    }

    // Resolve all nine IDs before the first mutation.
    var grants = resolveAllowlist()
    var pending = []

    for (var i = 0; i < grants.length; i++) {
      var grant = grants[i]
      if (!hasStage(player, grant.stage)) continue
      if (isQuestComplete(teamData, grant)) continue

      pending.push(grant)
    }

    var repaired = []
    for (var j = 0; j < pending.length; j++) {
      var pendingGrant = pending[j]

      var changed
      try {
        changed = teamData.setCompleted(pendingGrant.id, new JavaDate())
      } catch (error) {
        fail('setCompleted failed for quest ' + pendingGrant.code, error)
      }

      if (!changed) {
        fail('setCompleted returned false for incomplete quest ' + pendingGrant.code)
      }
      if (!isQuestComplete(teamData, pendingGrant)) {
        fail('setCompleted returned without satisfying quest ' + pendingGrant.code)
      }

      // setCompleted marks TeamData dirty and immediately sends
      // ObjectCompletedMessage to online team members. Persist each repair
      // before attempting another so a later failure cannot strand an
      // already-synced completion only in memory.
      try {
        teamData.saveIfChanged()
      } catch (error) {
        fail('Immediate TeamData persistence failed for quest ' + pendingGrant.code, error)
      }

      repaired.push(pendingGrant.stage + ':' + pendingGrant.code)
    }

    if (repaired.length === 0) return

    console.info(
      LOG_PREFIX + ' player=' + player.username +
      ' completed=' + repaired.join(',')
    )
  }

  PlayerEvents.loggedIn(function (event) {
    var player = event.player
    var server = event.server
    if (!player || !server) {
      fail('Login event did not provide both player and server')
    }

    var playerUuid = player.uuid
    try {
      server.scheduleInTicks(LOGIN_DELAY_TICKS, function () {
        var livePlayer = server.getPlayer(playerUuid)
        if (!livePlayer) return
        reconcilePlayer(livePlayer)
      })
    } catch (error) {
      fail('Could not schedule login reconcile', error)
    }
  })
})()
