// AoA KubeJS: aoa_astages_01f_industrial_foregoing.js
// Machine Staging Contract pass (2026-05-28) -- Industrial Foregoing (+ Souls).
//
// IF is plastic + machine-frame gated; the whole fleet is Gilded automation (user
// call 2026-05-28: whole IF fleet -> Gilded). The 25 previously IR-locked IF
// machines were flipped to gilded_age in the main file (that also fixes 6 hard
// softlocks: advanced/supreme frames need pink_slime/ether_gas from Gilded-only
// machines). This file locks the ~60 previously-UNGATED IF machines/generators/
// storage/frames. Tiered exceptions (user): black-hole advanced -> Atomic, supreme
// -> Otherworldly; supreme-frame mycelial gens (netherstar/meatallurgic/halitosis/
// reactor) -> Atomic. dark_glass / pink_slime_block / mechanical_dirt left ungated
// (decor/resource). laser_drill/ore+fluid_laser_base/hydroponic sims already locked.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages IF] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages IF] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // --- Industrial Foregoing Gilded (plastic+frame automation home; whole-fleet decision 2026-05-28) ---
    ["gilded_age", "industrialforegoing:dissolution_chamber", "block_item"],
    ["gilded_age", "industrialforegoing:latex_processing_unit", "block_item"],
    ["gilded_age", "industrialforegoing:fermentation_station", "block_item"],
    ["gilded_age", "industrialforegoing:bioreactor", "block_item"],
    ["gilded_age", "industrialforegoing:sludge_refiner", "block_item"],
    ["gilded_age", "industrialforegoing:sewage_composter", "block_item"],
    ["gilded_age", "industrialforegoing:sewer", "block_item"],
    ["gilded_age", "industrialforegoing:water_condensator", "block_item"],
    ["gilded_age", "industrialforegoing:potion_brewer", "block_item"],
    ["gilded_age", "industrialforegoing:washing_factory", "block_item"],
    ["gilded_age", "industrialforegoing:spores_recreator", "block_item"],
    ["gilded_age", "industrialforegoing:stasis_chamber", "block_item"],
    ["gilded_age", "industrialforegoing:enchantment_sorter", "block_item"],
    ["gilded_age", "industrialforegoing:hydroponic_bed", "block_item"],
    ["gilded_age", "industrialforegoing:mob_detector", "block_item"],
    ["gilded_age", "industrialforegoing:infinity_charger", "block_item"],
    ["gilded_age", "industrialforegoing:conveyor", "block_item"],
    ["gilded_age", "industrialforegoing:animal_feeder", "block_item"],
    ["gilded_age", "industrialforegoing:animal_rancher", "block_item"],
    ["gilded_age", "industrialforegoing:animal_baby_separator", "block_item"],
    // IF generators (Gilded)
    ["gilded_age", "industrialforegoing:pitiful_generator", "block_item"],
    ["gilded_age", "industrialforegoing:biofuel_generator", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_furnace", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_culinary", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_frosty", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_pink", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_crimed", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_death", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_disenchantment", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_ender", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_explosive", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_magma", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_potion", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_rocket", "block_item"],
    ["gilded_age", "industrialforegoing:mycelial_slimey", "block_item"],
    // IF mycelial high-tier (supreme-frame + exotic fuel) -> Atomic
    ["atomic", "industrialforegoing:mycelial_netherstar", "block_item"],
    ["atomic", "industrialforegoing:mycelial_meatallurgic", "block_item"],
    ["atomic", "industrialforegoing:mycelial_halitosis", "block_item"],
    ["atomic", "industrialforegoing:mycelial_reactor", "block_item"],
    // IF black-hole storage (tiered: base/low Gilded, advanced Atomic, supreme OW)
    ["gilded_age", "industrialforegoing:black_hole_controller", "block_item"],
    ["gilded_age", "industrialforegoing:common_black_hole_unit", "block_item"],
    ["gilded_age", "industrialforegoing:pity_black_hole_unit", "block_item"],
    ["gilded_age", "industrialforegoing:simple_black_hole_unit", "block_item"],
    ["gilded_age", "industrialforegoing:common_black_hole_tank", "block_item"],
    ["gilded_age", "industrialforegoing:pity_black_hole_tank", "block_item"],
    ["gilded_age", "industrialforegoing:simple_black_hole_tank", "block_item"],
    ["atomic", "industrialforegoing:advanced_black_hole_unit", "block_item"],
    ["atomic", "industrialforegoing:advanced_black_hole_tank", "block_item"],
    ["otherworldly", "industrialforegoing:supreme_black_hole_unit", "block_item"],
    ["otherworldly", "industrialforegoing:supreme_black_hole_tank", "block_item"],
    // IF machine frames (tier tokens) -> Gilded
    ["gilded_age", "industrialforegoing:machine_frame_pity", "block_item"],
    ["gilded_age", "industrialforegoing:machine_frame_simple", "block_item"],
    ["gilded_age", "industrialforegoing:machine_frame_advanced", "block_item"],
    ["gilded_age", "industrialforegoing:machine_frame_supreme", "block_item"],
    // Industrial Foregoing Souls
    ["gilded_age", "industrialforegoingsouls:soul_network_pipe", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
