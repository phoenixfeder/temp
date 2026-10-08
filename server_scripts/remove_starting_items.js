// AoA KubeJS: remove_starting_items.js
// NeoForge 1.21.1 / KubeJS 2101.x
//
// Most starter guide items should be disabled in their owning mod configs.
// This script is only the small fallback for starter items that do not expose
// a reliable config toggle in the live config tree.

const EXACT_STARTING_ITEMS = [
  'patchouli:guide_book[patchouli:book="kubejs:first_days_field_guide"]'
]

// Books a mod auto-grants on first join that we suppress -- but ONLY on first
// join, so a later, legitimately crafted copy is never destroyed. Theurgy's
// Hermetica auto-gives and exposes no config toggle (theurgy-server.toml has
// none), so it is cleared across the same first-join delayed ticks used to
// catch grant timing, and never on subsequent logins or respawns. Previously
// it lived in EXACT_STARTING_ITEMS and was wiped every login/respawn, which
// also destroyed crafted copies -- Theurgy is book-driven, so that erased the
// player's progression guide.
const FIRST_JOIN_ONLY_ITEMS = [
  'modonomicon:modonomicon[modonomicon:book_id="theurgy:the_hermetica"]'
]

const BASE_STARTING_ITEMS = [
  'alchemists_garden:overgrown_letter'
]

const ONE_TICK_STARTING_ITEMS = [
  'occultism:dictionary_of_spirits'
]

const FLAG_FIRST_JOIN_SCRUB = 'starterBooksScrubbed'
const SCRUB_ALL_PATCHOULI_ON_FIRST_JOIN = false

function clearItem(player, item) {
  const itemId = item.split('[')[0]
  if (!Item.exists(itemId)) return
  player.server.runCommandSilent(`clear "${player.username}" ${item}`)
}

function clearNormalStartingItems(player) {
  for (const item of EXACT_STARTING_ITEMS) clearItem(player, item)
  for (const item of BASE_STARTING_ITEMS) clearItem(player, item)
}

function clearOneTickStartingItems(player) {
  for (const item of ONE_TICK_STARTING_ITEMS) clearItem(player, item)
}

function clearFirstJoinOnlyItems(player) {
  for (const item of FIRST_JOIN_ONLY_ITEMS) clearItem(player, item)
}

function clearAllPatchouliBooks(player) {
  clearItem(player, 'patchouli:guide_book')
}

PlayerEvents.loggedIn(event => {
  const player = event.player
  const pData = player.persistentData
  const server = event.server
  const isFirst = !pData.getBoolean(FLAG_FIRST_JOIN_SCRUB)

  if (isFirst) {
    pData.putBoolean(FLAG_FIRST_JOIN_SCRUB, true)
  }

  clearNormalStartingItems(player)
  if (isFirst) clearFirstJoinOnlyItems(player)
  if (isFirst && SCRUB_ALL_PATCHOULI_ON_FIRST_JOIN) clearAllPatchouliBooks(player)

  for (const delay of [5, 20, 40, 100, 200]) {
    server.scheduleInTicks(delay, () => {
      clearNormalStartingItems(player)
      if (isFirst) clearFirstJoinOnlyItems(player)
      if (isFirst && SCRUB_ALL_PATCHOULI_ON_FIRST_JOIN) clearAllPatchouliBooks(player)
    })
  }

  // Occultism has no live config toggle for the custom Dictionary of Spirits
  // starter book. Run once for new players so fresh-world grants are removed
  // without deleting later, legitimately crafted copies on every login.
  if (isFirst) server.scheduleInTicks(1, () => clearOneTickStartingItems(player))
})

PlayerEvents.respawned(event => {
  const player = event.player
  const server = event.server

  clearNormalStartingItems(player)
  for (const delay of [5, 20, 40, 100, 200]) {
    server.scheduleInTicks(delay, () => clearNormalStartingItems(player))
  }
})
