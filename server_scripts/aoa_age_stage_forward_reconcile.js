// AoA KubeJS: aoa_age_stage_forward_reconcile.js
//
// Repairs age stages lost to the AStages 2.3.2 offline-player cache erasure
// bug. On login, this compares the player's current stage state with the FTB
// team's completion state for the nine allowlisted age-grant quests.
//
// This is deliberately narrow:
//   - adds an age stage only when its exact grant quest is complete
//   - acts only on the logging-in player
//   - never removes a stage, changes a quest, or replays a quest reward
//   - emits no player-facing chat

;(function () {
  const LOG_PREFIX = '[AoA Age Stage Forward Reconcile]'
  const LOGIN_DELAY_TICKS = 40
  const ADD_STAGE_SIGNATURE =
    'addStageToPlayer(net.minecraft.world.entity.player.Player,java.lang.String)'
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

  // Bind the exact overload instead of relying on Rhino's aggregate overloaded
  // NativeJavaMethod dispatcher. Presence is checked by truthiness; typeof is
  // logged as runtime evidence only and never disables this script.
  const addStageToPlayer = AStages[ADD_STAGE_SIGNATURE]
  const playerHasStage = AStages[HAS_STAGE_SIGNATURE]

  console.info(
    LOG_PREFIX +
      ' API probe aggregate_add_type=' + typeof AStages.addStageToPlayer +
      ' exact_add_type=' + typeof addStageToPlayer +
      ' exact_add_present=' + (addStageToPlayer ? 'true' : 'false')
  )

  if (!addStageToPlayer) {
    fail('Required AStages overload unavailable: ' + ADD_STAGE_SIGNATURE)
  }
  if (!playerHasStage) {
    fail('Required AStages method unavailable: ' + HAS_STAGE_SIGNATURE)
  }

  const TeamData = loadRequiredClass('dev.ftb.mods.ftbquests.quest.TeamData')
  const QuestObjectBase = loadRequiredClass('dev.ftb.mods.ftbquests.quest.QuestObjectBase')
  const ServerQuestFile = loadRequiredClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile')

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

  function addMissingStage(player, stage) {
    try {
      addStageToPlayer(player, stage)
    } catch (error) {
      fail('Stage add failed for ' + stage, error)
    }

    if (!hasStage(player, stage)) {
      fail('Stage add returned without satisfying the postcondition for ' + stage)
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

    // Resolve every allowlisted quest before making the first mutation. Any
    // quest-ID drift aborts the entire pass loudly.
    var grants = resolveAllowlist()
    var pending = []

    for (var i = 0; i < grants.length; i++) {
      var grant = grants[i]
      if (!isQuestComplete(teamData, grant)) continue
      if (hasStage(player, grant.stage)) continue

      pending.push(grant)
    }

    var repaired = []
    for (var j = 0; j < pending.length; j++) {
      var pendingGrant = pending[j]

      addMissingStage(player, pendingGrant.stage)
      repaired.push(pendingGrant.stage)
    }

    if (repaired.length > 0) {
      console.info(
        LOG_PREFIX + ' player=' + player.username +
        ' restored=' + repaired.join(',')
      )
    }
  }

  PlayerEvents.loggedIn(function (event) {
    var player = event.player
    var server = event.server
    if (!player || !server) {
      fail('Login event did not provide both player and server')
    }

    // Capture only immutable identity and the server. Re-resolve the live
    // player after FTB Teams/FTB Quests have completed their login wiring.
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
