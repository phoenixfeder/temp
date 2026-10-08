// AoA KubeJS: aoa_astages_01e_oritech.js
// Machine Staging Contract pass (2026-05-28) -- Oritech + Oritech Things.
//
// Oritech machine blocks do NOT craft from machine_core; they use explicit
// intermediates, so each machine is floored to the production machine of its
// latest-gated intermediate:
//   IR     = motor / magnetic_coil / electrum / steel / plating hand-crafts
//   Gilded = needs processing_unit or enderic_lens/compound
//   Atomic = needs flux_gate, superconductor, duratium, advanced_computing_engine,
//            super_ai_chip, heisenberg_compensator, overcharged_crystal, or machine_extender
// All proposed ages are >= recipe ceiling -> no softlock. These were ungated
// (pure BYPASS). Existing Oritech locks (atomic_forge, laser_arm, augment stations,
// accelerator_controller, deep_drill, quarry_addon, processing_unit, enderic_lens,
// biosteel, simple_augment_station, unstable_container, black_hole_block) are
// left untouched. oritechthings:addon_block_capacitor_tier_4 already locked in main file.
// duratium_ingot item-locked here to close the createoritechcompat heated-mixing
// stockpile window (machine consumers are already Atomic-locked, so low severity).
//
// 2026-08-16 owner ruling RS-IR-1 (docs/audits/ir_confirmation_campaign_synthesis_2026-08-16.md,
// P0-1): oritech:centrifuge_block re-stages gilded_age -> industrial_revolution.
// The centrifuge was the ONLY machine running the recipe type that makes
// oritech:carbon_fibre_strands, which the refinery chain needs, so a gilded-locked
// centrifuge dead-ended the IR refinery quest and 295 quests behind it. The block is
// genuinely IR-legal: data/oritech/recipe/crafting/centrifugealt.json builds it from
// oritech:motor + c:ingots/copper + c:storage_blocks/iron + glass bottles, none of
// which is gated past IR. The gilded route (crafting/centrifuge.json) still needs
// oritech:processing_unit, which stays gilded_age
// (aoa_astages_01_item_restrictions.js:211) and is untouched here. The rest of the
// Gilded automation tier (assembler, placer, fertilizer, machine_core_4, ...) stays
// at gilded_age. oritech:centrifuge_block is the only centrifuge id in the jar: there
// is no separate item form, no fluid-variant block, and oritechthings ships none.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages oritech] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages oritech] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // ---- Oritech IR (basic/analog processing + early power + addon upgrades) ----
    ["industrial_revolution", "oritech:machine_core_2", "block_item"],
    ["industrial_revolution", "oritech:machine_core_3", "block_item"],
    ["industrial_revolution", "oritech:pulverizer_block", "block_item"],
    ["industrial_revolution", "oritech:powered_furnace_block", "block_item"],
    ["industrial_revolution", "oritech:foundry_block", "block_item"],
    ["industrial_revolution", "oritech:pump_block", "block_item"],
    ["industrial_revolution", "oritech:treefeller_block", "block_item"],
    ["industrial_revolution", "oritech:cooler_block", "block_item"],
    ["industrial_revolution", "oritech:small_tank_block", "block_item"],
    ["industrial_revolution", "oritech:small_storage_block", "block_item"],
    // RS-IR-1: centrifuge sits ahead of the refinery in the IR Oritech lane; it feeds
    // the refinery's carbon_fibre_strands. Built via centrifugealt.json at IR.
    ["industrial_revolution", "oritech:centrifuge_block", "block_item"],
    ["industrial_revolution", "oritech:refinery_module_block", "block_item"],
    ["industrial_revolution", "oritech:refinery_block", "block_item"],
    ["industrial_revolution", "oritech:industrial_glass_block", "block_item"],
    ["industrial_revolution", "oritech:charger_block", "block_item"],
    ["industrial_revolution", "oritech:pipe_booster_block", "block_item"],
    ["industrial_revolution", "oritech:basic_generator_block", "block_item"],
    ["industrial_revolution", "oritech:lava_generator_block", "block_item"],
    ["industrial_revolution", "oritech:steam_engine_block", "block_item"],
    ["industrial_revolution", "oritech:machine_efficiency_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_speed_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_capacitor_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_acceptor_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_fluid_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_silk_touch_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_redstone_addon", "block_item"],
    ["industrial_revolution", "oritech:machine_burst_addon", "block_item"],
    ["industrial_revolution", "oritech:steam_boiler_addon", "block_item"],
    // ---- Oritech Gilded (digital/automation: processing_unit / enderic tier) ----
    ["gilded_age", "oritech:machine_core_4", "block_item"],
    ["gilded_age", "oritech:assembler_block", "block_item"],
    ["gilded_age", "oritech:placer_block", "block_item"],
    ["gilded_age", "oritech:fertilizer_block", "block_item"],
    ["gilded_age", "oritech:crop_filter_addon", "block_item"],
    ["gilded_age", "oritech:machine_yield_addon", "block_item"],
    ["gilded_age", "oritech:machine_inventory_proxy_addon", "block_item"],
    ["gilded_age", "oritech:capacitor_addon_extender", "block_item"],
    ["gilded_age", "oritech:large_storage_block", "block_item"],
    ["gilded_age", "oritech:reactor_controller", "block_item"],
    ["gilded_age", "oritech:fuel_generator_block", "block_item"],
    // ---- Oritech Atomic (atomic_forge / flux_gate / superconductor / particle tier) ----
    // Nuclear reactor build parts (bypass fix 2026-07-02: parts were ungated, letting a
    // uranium fission reactor be hand-built pre-Atomic; controller stays gilded as preview,
    // the working multiblock completes at Atomic where its quest lives).
    ["atomic", "oritech:reactor_rod", "block_item"],
    ["atomic", "oritech:reactor_double_rod", "block_item"],
    ["atomic", "oritech:reactor_quad_rod", "block_item"],
    ["atomic", "oritech:reactor_wall", "block_item"],
    ["atomic", "oritech:reactor_vent", "block_item"],
    ["atomic", "oritech:reactor_heat_pipe", "block_item"],
    ["atomic", "oritech:reactor_reflector", "block_item"],
    ["atomic", "oritech:reactor_condenser", "block_item"],
    ["atomic", "oritech:reactor_energy_port", "block_item"],
    ["atomic", "oritech:reactor_fuel_port", "block_item"],
    ["atomic", "oritech:reactor_redstone_port", "block_item"],
    ["atomic", "oritech:reactor_absorber_port", "block_item"],
    ["atomic", "oritech:machine_core_5", "block_item"],
    ["atomic", "oritech:machine_core_7", "block_item"],
    ["atomic", "oritech:machine_extender", "block_item"],
    ["atomic", "oritech:fragment_forge_block", "block_item"],
    ["atomic", "oritech:enchanter_block", "block_item"],
    ["atomic", "oritech:destroyer_block", "block_item"],
    ["atomic", "oritech:augment_application_block", "block_item"],
    ["atomic", "oritech:drone_port_block", "block_item"],
    ["atomic", "oritech:bio_generator_block", "block_item"],
    ["atomic", "oritech:big_solar_panel_block", "block_item"],
    ["atomic", "oritech:particle_collector_block", "block_item"],
    ["atomic", "oritech:accelerator_motor", "block_item"],
    ["atomic", "oritech:accelerator_ring", "block_item"],
    ["atomic", "oritech:accelerator_sensor", "block_item"],
    ["atomic", "oritech:machine_processing_addon", "block_item"],
    ["atomic", "oritech:machine_ultimate_addon", "block_item"],
    ["atomic", "oritech:spawner_controller_block", "block_item"],
    // duratium_ingot + machine_extender: progression audit (2026-06-15) -> Atomic with atomic-tier Oritech quests.
    ["atomic", "oritech:duratium_ingot", "item"],
    // ---- oritechthings: addon tiers 2-9 (machine_extender->duratium->atomic_forge => Atomic floor); capacitor_tier_4 already locked in main file ----
    ["atomic", "oritechthings:addon_block_capacitor_tier_2", "block_item"],
    ["atomic", "oritechthings:addon_block_capacitor_tier_3", "block_item"],
    ["atomic", "oritechthings:addon_block_capacitor_tier_5", "block_item"],
    ["atomic", "oritechthings:addon_block_capacitor_tier_6", "block_item"],
    ["atomic", "oritechthings:addon_block_capacitor_tier_7", "block_item"],
    ["atomic", "oritechthings:addon_block_capacitor_tier_8", "block_item"],
    ["atomic", "oritechthings:addon_block_capacitor_tier_9", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_2", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_3", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_4", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_5", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_6", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_7", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_8", "block_item"],
    ["atomic", "oritechthings:addon_block_speed_tier_9", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_2", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_3", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_4", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_5", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_6", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_7", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_8", "block_item"],
    ["atomic", "oritechthings:addon_block_processing_tier_9", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_2", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_3", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_4", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_5", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_6", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_7", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_8", "block_item"],
    ["atomic", "oritechthings:addon_block_acceptor_tier_9", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_2", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_3", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_4", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_5", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_6", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_7", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_8", "block_item"],
    ["atomic", "oritechthings:addon_block_efficiency_tier_9", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_2", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_3", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_4", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_5", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_6", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_7", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_8", "block_item"],
    ["atomic", "oritechthings:addon_block_efficient_speed_tier_9", "block_item"],
    // ---- oritechthings: cross-dimensional addon + accelerator parts + advanced laser targeting ----
    ["atomic", "oritechthings:addon_block_cross_dimensional", "block_item"],
    ["atomic", "oritechthings:accelerator_magnetic_field", "block_item"],
    ["atomic", "oritechthings:particle_accelerator_speed_sensor", "block_item"],
    ["atomic", "oritechthings:advanced_target_designator", "item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
