// AoA KubeJS: aoa_apotheosis_team_reconcile.js
//
// FTB Quests records the Apotheosis advancement rewards once per team, but
// Minecraft advancement progress belongs to individual players. Reconcile the
// five world tiers from their exact completed team quests when a player joins
// an existing FTB team or a tier quest completes.

;(function () {
  const LOG_PREFIX = '[AoA Apotheosis Team Reconcile]'
  const RECONCILE_DELAY_TICKS = 1

  // (Apotheosis world tier, exact live FTB Quests grant quest ID)
  const TIER_GRANTS = [
    ['haven', '097AED7C91033D5E'],
    ['frontier', '0B03101000000039'],
    ['ascent', '0B0310A0000000F0'],
    ['summit', '4954631000000000'],
    ['pinnacle', '5057011000000004']
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

  const TeamData = loadRequiredClass('dev.ftb.mods.ftbquests.quest.TeamData')
  const QuestObjectBase = loadRequiredClass('dev.ftb.mods.ftbquests.quest.QuestObjectBase')
  const ServerQuestFile = loadRequiredClass('dev.ftb.mods.ftbquests.quest.ServerQuestFile')

  function normalizedQuestCode(value) {
    return String(value || '').trim().replace(/^#/, '').toUpperCase()
  }

  function resolveGrants() {
    var questFile = ServerQuestFile.INSTANCE
    if (!questFile) {
      fail('ServerQuestFile.INSTANCE is unavailable during reconciliation')
    }

    var resolved = []
    for (var i = 0; i < TIER_GRANTS.length; i++) {
      var tier = TIER_GRANTS[i][0]
      var expectedCode = TIER_GRANTS[i][1]
      var quest

      try {
        quest = questFile.getQuest(QuestObjectBase.parseCodeString(expectedCode))
      } catch (error) {
        fail('Could not resolve quest ' + expectedCode + ' for tier ' + tier, error)
      }

      if (!quest) {
        fail('Grant quest is missing: ' + expectedCode + ' for tier ' + tier)
      }

      var actualCode
      try {
        actualCode = normalizedQuestCode(quest.getCodeString())
      } catch (error) {
        fail('Could not read resolved quest code for ' + expectedCode, error)
      }

      if (actualCode !== expectedCode) {
        fail(
          'Quest ID round-trip mismatch for tier ' + tier +
          ': expected ' + expectedCode + ', got ' + actualCode
        )
      }

      resolved.push({ tier: tier, code: expectedCode, id: quest.getId() })
    }

    return resolved
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

    var grants = resolveGrants()
    var restored = []

    for (var i = 0; i < grants.length; i++) {
      var grant = grants[i]
      var complete

      try {
        complete = teamData.getCompletedTime(grant.id).isPresent()
      } catch (error) {
        fail('Completion check failed for quest ' + grant.code, error)
      }

      if (!complete) continue

      var changed = player.server.runCommandSilent(
        'advancement grant ' + player.username + ' only apotheosis:progression/' + grant.tier
      )
      if (changed > 0) restored.push(grant.tier)
    }

    if (restored.length > 0) {
      console.info(
        LOG_PREFIX + ' player=' + player.username +
        ' restored=' + restored.join(',')
      )
    }
  }

  function scheduleReconcile(player, delayTicks) {
    if (!player || !player.server) {
      fail('Reconcile event did not provide a server player')
    }

    var server = player.server
    var playerUuid = player.uuid
    try {
      server.scheduleInTicks(delayTicks, function () {
        var livePlayer = server.getPlayer(playerUuid)
        if (!livePlayer) return
        reconcilePlayer(livePlayer)
      })
    } catch (error) {
      fail('Could not schedule reconciliation', error)
    }
  }

  if (typeof FTBTeamsEvents === 'undefined') {
    fail('Required FTB Teams KubeJS event group is unavailable')
  }

  FTBTeamsEvents.playerJoinedParty(function (event) {
    scheduleReconcile(event.entity, RECONCILE_DELAY_TICKS)
  })

  if (typeof FTBQuestsEvents === 'undefined') {
    fail('Required FTB Quests KubeJS event group is unavailable')
  }

  FTBQuestsEvents.completed('#aoa_main', function (event) {
    var quest = event.object
    if (!quest) return

    var questCode = normalizedQuestCode(quest.getCodeString())
    var isTierGrant = false
    for (var i = 0; i < TIER_GRANTS.length; i++) {
      if (TIER_GRANTS[i][1] === questCode) {
        isTierGrant = true
        break
      }
    }
    if (!isTierGrant) return

    var onlineMembers = event.onlineMembers
    if (!onlineMembers) {
      fail('Tier quest ' + questCode + ' completed without online member data')
    }

    for (var j = 0; j < onlineMembers.size(); j++) {
      scheduleReconcile(onlineMembers.get(j), RECONCILE_DELAY_TICKS)
    }
  })
})()
