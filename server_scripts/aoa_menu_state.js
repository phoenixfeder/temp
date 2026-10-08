// AOA MENU STATE — NON-AUTHORITY ONLY
// Mirrors the local player's earned age ladder into a small JSON file that the
// FancyMenu title layout reads (galaxy band ignition + era caption). Writes
// only on integrated (singleplayer/LAN-host) servers: on a dedicated server
// the file would sit server-side where no menu can see it, and multiple
// players would thrash it. A missing file is a valid state (day-one art).
//
// APIs used (all verified live in this pack):
//   AStageEvents.added(stage, fn)            - aoa_book_grants.js:76
//   AStages.playerHasStage(player, stage)    - aoa_age_advancement_shim.js:16
//   PlayerEvents.loggedIn + scheduleInTicks  - aoa_age_stage_forward_reconcile.js

;(function () {
  if (typeof AStageEvents === 'undefined' || typeof AStages === 'undefined') return

  const LOG_PREFIX = '[AoA MenuState]'
  const LOGIN_DELAY_TICKS = 100
  const AGES = [
    ['dark_ages', 'Dark Ages'],
    ['medieval_times', 'Medieval Times'],
    ['the_renaissance', 'The Renaissance'],
    ['industrial_revolution', 'Industrial Revolution'],
    ['gilded_age', 'Gilded Age'],
    ['atomic', 'Atomic'],
    ['otherworldly', 'Otherworldly'],
    ['ascension', 'Ascension']
  ]

  function isIntegrated(server) {
    try {
      if (typeof server.isDedicatedServer === 'function') return !server.isDedicatedServer()
      if (typeof server.isSingleplayer === 'function') return server.isSingleplayer()
    } catch (ignored) {}
    // Unknown server shape: do not write rather than write wrongly.
    return false
  }

  function writeState(player) {
    if (!player) return
    const server = player.server
    if (!server || !isIntegrated(server)) return

    var count = 0
    var era = ''
    for (var i = 0; i < AGES.length; i++) {
      var has = false
      try {
        has = AStages.playerHasStage(player, AGES[i][0])
      } catch (error) {
        console.warn(LOG_PREFIX + ' stage check failed for ' + AGES[i][0] + ': ' + error)
        return
      }
      if (has) {
        count++
        era = AGES[i][1]
      }
    }

    var state = { count: count, stage: count > 0 ? AGES[count - 1][0] : '', era: era }
    try {
      if (typeof JsonIO !== 'undefined' && typeof JsonIO.write === 'function') {
        JsonIO.write('config/fancymenu/aoa_state.json', state)
      } else {
        var Files = Java.loadClass('java.nio.file.Files')
        var Paths = Java.loadClass('java.nio.file.Paths')
        var path = Paths.get('config', 'fancymenu', 'aoa_state.json')
        Files.createDirectories(path.getParent())
        Files.writeString(path, JSON.stringify(state))
      }
    } catch (error) {
      console.warn(LOG_PREFIX + ' could not write aoa_state.json: ' + error)
      return
    }
    console.info(LOG_PREFIX + ' player=' + player.username + ' count=' + count + ' era=' + era)
  }

  AGES.forEach(function (row) {
    AStageEvents.added(row[0], function (event) {
      writeState(event.player)
    })
  })

  // Login catch-up: covers grants earned while this script was absent, and
  // refreshes the file after pack updates. Delay matches the reconcile scripts
  // so FTB Teams / AStages login wiring has settled first.
  PlayerEvents.loggedIn(function (event) {
    var player = event.player
    var server = event.server
    if (!player || !server) return
    var playerUuid = player.uuid
    try {
      server.scheduleInTicks(LOGIN_DELAY_TICKS, function () {
        var livePlayer = server.getPlayer(playerUuid)
        if (livePlayer) writeState(livePlayer)
      })
    } catch (error) {
      console.warn(LOG_PREFIX + ' could not schedule login write: ' + error)
    }
  })
})()
