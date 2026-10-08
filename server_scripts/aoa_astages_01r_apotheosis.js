// AoA KubeJS: aoa_astages_01r_apotheosis.js
// Apotheosis hard-gating program (owner-approved 2026-08-02, design:
// docs/audits/apotheosis_gating_design_2026-08-02.md).
//
// The affix/gem POWER axis is already hard-gated by the world-tier advancement
// overrides in kubejs/data/apotheosis/advancement/progression/*.json (impossible
// criterion, granted by the age-gate quests: haven=Medieval, frontier=Ren,
// ascent=IR, summit=Gilded, pinnacle=Atomic). This file gates the ECONOMY
// stations and runes so the crafting surface tracks the same ladder.
// Deliberately NOT locked: gems (purity is tier-weighted), the five rarity
// materials (drop-gated by tier), potion charms, salvaged smithing templates
// (recipes pruned elsewhere). Every id verified in Apotheosis-1.21.1-8.6.1.jar.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages Apoth] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages Apoth] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // === the_renaissance: gem economy opens with the enchanting line ===
    ["the_renaissance", "apotheosis:gem_cutting_table", "block_item"],
    ["the_renaissance", "apotheosis:gem_case", "block_item"],
    ["the_renaissance", "apotheosis:sigil_of_socketing", "item"],
    // === industrial_revolution: reforging + salvage economy ===
    ["industrial_revolution", "apotheosis:simple_reforging_table", "block_item"],
    ["industrial_revolution", "apotheosis:salvaging_table", "block_item"],
    ["industrial_revolution", "apotheosis:sigil_of_rebirth", "item"],
    ["industrial_revolution", "apotheosis:sigil_of_withdrawal", "item"],
    ["industrial_revolution", "apotheosis:sigil_of_unnaming", "item"],
    ["industrial_revolution", "apotheosis:spawner_rune", "item"],
    ["industrial_revolution", "apotheosis:spawner_chain", "item"],
    ["industrial_revolution", "apotheosis:frontier_spawner_upgrade_rune", "item"],
    // === gilded_age: full reforging (epic/mythic) + spawner shaping ===
    ["gilded_age", "apotheosis:reforging_table", "block_item"],
    ["gilded_age", "apotheosis:ascent_spawner_upgrade_rune", "item"],
    ["gilded_age", "apotheosis:spawn_range_spawner_rune", "item"],
    ["gilded_age", "apotheosis:redstone_control_spawner_rune", "item"],
    ["gilded_age", "apotheosis:ignore_light_spawner_rune", "item"],
    ["gilded_age", "apotheosis:initial_health_spawner_rune", "item"],
    ["gilded_age", "apotheosis:silent_spawner_rune", "item"],
    ["gilded_age", "apotheosis:youthful_spawner_rune", "item"],
    ["gilded_age", "apotheosis:burning_spawner_rune", "item"],
    ["gilded_age", "apotheosis:no_ai_spawner_rune", "item"],
    ["gilded_age", "apotheosis:ignore_conditions_spawner_rune", "item"],
    ["gilded_age", "apotheosis:ignore_players_spawner_rune", "item"],
    ["gilded_age", "apotheosis:echoing_spawner_rune", "item"],
    ["gilded_age", "apotheosis:infused_spawner_rune", "item"],
    // === atomic: augmenting + the mythic economy ===
    ["atomic", "apotheosis:augmenting_table", "block_item"],
    ["atomic", "apotheosis:sigil_of_enhancement", "item"],
    ["atomic", "apotheosis:summit_spawner_upgrade_rune", "item"],
    ["atomic", "apotheosis:ender_gem_case", "block_item"],
    // === otherworldly: apex ===
    ["otherworldly", "apotheosis:pinnacle_spawner_upgrade_rune", "item"],
    ["otherworldly", "apotheosis:boss_summoner", "item"]
  ]
  itemLocks.forEach(function (row) { softItemLock(row[0], row[1], row[2]) })
})()
