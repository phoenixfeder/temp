// AoA KubeJS: aoa_book_open_guard.js
//
// Validates AoA Modonomicon books have a known book_id component. Per-age books
// are not stage-gated for opening — players receive them on age unlock and may
// read them immediately. Unknown or malformed book data is still rejected.

;(function () {
  const KNOWN_AOA_BOOKS = {
    'aoa:dark_ages_manual': true,
    'aoa:medieval_codex': true,
    'aoa:renaissance_compendium': true,
    'aoa:industrial_codex': true,
    'aoa:gilded_ledger': true,
    'aoa:atomic_dossier': true,
    'aoa:otherworldly_codex': true,
    'aoa:ascension_codex': true
  }

  ItemEvents.rightClicked(function (event) {
    const stack = event.item
    if (!stack || stack.id !== 'modonomicon:modonomicon') return

    let bookId = null
    try {
      const components = stack.componentsPatch || stack.components
      if (components && typeof components.get === 'function') {
        const raw = components.get('modonomicon:book_id')
        if (raw) bookId = String(raw)
      }
    } catch (e) {
      // Fall through to string parse below
    }
    if (!bookId) {
      var stackText = String(stack)
      var match = stackText.match(/modonomicon:book_id\s*=\s*"?([^"\],]+)"?/)
      if (match) bookId = match[1]
    }
    if (!bookId) {
      event.cancel()
      event.player.tell('This Modonomicon has no book data. Use a named AoA guide book instead.')
      return
    }

    if (bookId.indexOf('aoa:') === 0 && !KNOWN_AOA_BOOKS[bookId]) {
      event.cancel()
      event.player.tell('This AoA guide book points at unknown book data.')
    }
  })
})()
