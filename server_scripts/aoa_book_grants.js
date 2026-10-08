// AoA KubeJS: aoa_book_grants.js
//
// Grants per-age guide/reference books to players.
//
// Behavior:
//   - Dark Ages stage is granted at world entry by FTB Quest 3400000000009000
//     in Stone Water, Weather, and Wounds. All players should have `dark_ages`
//     after their first login reconcile.
//   - Every age book: granted when the player gains the matching stage
//     (AStageEvents.added), and again on login as catch-up if they earned the
//     stage while offline.
//   - Per-book persistent-data flags ensure each grant fires at most once.
//   - A short delay before /give lets Modonomicon book registration settle.
//   - If a grant fails (full inventory, etc.), the flag stays set; recover via
//     aoa_book_recipes.js or admin /give.
//
// AStages is the gating authority. This script READS stages via
// AStages.playerHasStage but never grants, revokes, or mutates stage state.

;(function () {
  if (typeof AStages === 'undefined') return

  // (stage, bookId, persistentDataFlag, delayTicks)
  const AGE_BOOKS = [
    ['dark_ages',             'aoa:dark_ages_manual',        'gotDarkAgesManual',               40],
    ['medieval_times',        'aoa:medieval_codex',          'gotMedievalCodex',                 40],
    ['the_renaissance',       'aoa:renaissance_compendium',  'gotRenaissanceCompendium',         40],
    ['industrial_revolution', 'aoa:industrial_codex',        'gotIndustrialCodex',               40],
    ['gilded_age',            'aoa:gilded_ledger',           'gotGildedLedger',                  40],
    ['atomic',                'aoa:atomic_dossier',          'gotAtomicDossier',                 40],
    ['otherworldly',          'aoa:otherworldly_codex',      'gotOtherworldlyCodex',             40],
    ['ascension',             'aoa:ascension_codex',         'gotAscensionCodex',                40]
  ]

  function bookItemString(bookId) {
    return 'modonomicon:modonomicon[modonomicon:book_id="' + bookId + '"]'
  }

  function grantBook(player, server, bookId, flagName, delayTicks) {
    if (player.persistentData[flagName]) return

    // Mark intent immediately so a server crash mid-delay does not double-grant.
    player.persistentData[flagName] = true

    server.scheduleInTicks(delayTicks, function () {
      const livePlayer = server.getPlayer(player.uuid)
      if (!livePlayer) return
      livePlayer.give(Item.of(bookItemString(bookId)))
    })
  }

  function grantBookForStage(player, server, stage, bookId, flagName, delayTicks) {
    if (!AStages.playerHasStage(player, stage)) return
    grantBook(player, server, bookId, flagName, delayTicks)
  }

  function migrateLegacyDarkAgesFlag(player) {
    if (player.persistentData['gotDarkAgesManualModonomicon'] && !player.persistentData['gotDarkAgesManual']) {
      player.persistentData['gotDarkAgesManual'] = true
    }
  }

  // Catch-up for players who earned a stage while offline.
  PlayerEvents.loggedIn(function (event) {
    const player = event.player
    const server = event.server
    migrateLegacyDarkAgesFlag(player)
    AGE_BOOKS.forEach(function (row) {
      grantBookForStage(player, server, row[0], row[1], row[2], row[3])
    })
  })

  // Immediate grant when an age stage is awarded in-session.
  if (typeof AStageEvents !== 'undefined') {
    AGE_BOOKS.forEach(function (row) {
      AStageEvents.added(row[0], function (event) {
        const player = event.player
        if (!player || !player.server) return
        grantBookForStage(player, player.server, row[0], row[1], row[2], row[3])
      })
    })
  }
})()
