// AoA KubeJS: aoa_astages_01c_pneumaticcraft.js
// Machine Staging Contract pass (2026-05-28) -- PneumaticCraft + Applied Pneumatics.
//
// PneumaticCraft is the pack's IR pressure mini-spine. Every machine routes
// through the IR pressure substrate (compressed_iron, pressure_tube, PCB), so
// recipe ceiling = IR and IR placement is softlock-free. These were ungated;
// adding explicit locks closes loot/trade/reward leakage. Digital-logic / drone
// programming blocks sit at Gilded (PneumaticCraft's automation surface).
// Applied Pneumatics ME bridge blocks gate on AE2 cores/pattern providers = Gilded
// (sibling of me_pressure_interface_block already locked in the main file).
//
// Held for user placement decision (NOT locked here): smart_chest, reinforced_chest,
// tag_workbench, security_station, sentry_turret (storage/defense IR-vs-Gilded).

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages pnc] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages pnc] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // --- PneumaticCraft IR (pressure machines / vessels / processing / generators / utility) ---
    ["industrial_revolution", "pneumaticcraft:advanced_air_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:liquid_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:advanced_liquid_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:thermal_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:electrostatic_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:solar_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:flux_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:manual_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:electric_compressor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:pneumatic_dynamo", "block_item"],
    ["industrial_revolution", "pneumaticcraft:pneumatic_generator", "block_item"],
    ["industrial_revolution", "pneumaticcraft:advanced_pressure_tube", "block_item"],
    ["industrial_revolution", "pneumaticcraft:reinforced_pressure_tube", "block_item"],
    ["industrial_revolution", "pneumaticcraft:tube_junction", "block_item"],
    ["industrial_revolution", "pneumaticcraft:reinforced_pressure_chamber_valve", "block_item"],
    ["industrial_revolution", "pneumaticcraft:etching_tank", "block_item"],
    ["industrial_revolution", "pneumaticcraft:uv_light_box", "block_item"],
    ["industrial_revolution", "pneumaticcraft:fluid_mixer", "block_item"],
    ["industrial_revolution", "pneumaticcraft:vacuum_pump", "block_item"],
    ["industrial_revolution", "pneumaticcraft:gas_lift", "block_item"],
    ["industrial_revolution", "pneumaticcraft:charging_station", "block_item"],
    ["industrial_revolution", "pneumaticcraft:aerial_interface", "block_item"],
    ["industrial_revolution", "pneumaticcraft:air_cannon", "block_item"],
    ["industrial_revolution", "pneumaticcraft:vortex_tube", "block_item"],
    ["industrial_revolution", "pneumaticcraft:heat_sink", "block_item"],
    ["industrial_revolution", "pneumaticcraft:heat_pipe", "block_item"],
    ["industrial_revolution", "pneumaticcraft:thermal_lagging", "block_item"],
    ["industrial_revolution", "pneumaticcraft:kerosene_lamp", "block_item"],
    ["industrial_revolution", "pneumaticcraft:small_tank", "block_item"],
    ["industrial_revolution", "pneumaticcraft:medium_tank", "block_item"],
    ["industrial_revolution", "pneumaticcraft:large_tank", "block_item"],
    ["industrial_revolution", "pneumaticcraft:huge_tank", "block_item"],
    ["industrial_revolution", "pneumaticcraft:liquid_hopper", "block_item"],
    ["industrial_revolution", "pneumaticcraft:omnidirectional_hopper", "block_item"],
    ["industrial_revolution", "pneumaticcraft:assembly_controller", "block_item"],
    ["industrial_revolution", "pneumaticcraft:assembly_platform", "block_item"],
    ["industrial_revolution", "pneumaticcraft:assembly_drill", "block_item"],
    ["industrial_revolution", "pneumaticcraft:assembly_laser", "block_item"],
    ["industrial_revolution", "pneumaticcraft:assembly_io_unit_import", "block_item"],
    ["industrial_revolution", "pneumaticcraft:assembly_io_unit_export", "block_item"],
    ["industrial_revolution", "pneumaticcraft:spawner_extractor", "block_item"],
    ["industrial_revolution", "pneumaticcraft:pressurized_spawner", "block_item"],
    ["industrial_revolution", "pneumaticcraft:vacuum_trap", "block_item"],
    ["industrial_revolution", "pneumaticcraft:drill_pipe", "block_item"],
    ["industrial_revolution", "pneumaticcraft:elevator_base", "block_item"],
    ["industrial_revolution", "pneumaticcraft:elevator_frame", "block_item"],
    ["industrial_revolution", "pneumaticcraft:elevator_caller", "block_item"],
    ["industrial_revolution", "pneumaticcraft:pneumatic_door_base", "block_item"],
    ["industrial_revolution", "pneumaticcraft:pneumatic_door", "block_item"],
    // --- PneumaticCraft Gilded (digital logic / drone programming / smart-storage + automated defense) ---
    ["gilded_age", "pneumaticcraft:programmer", "block_item"],
    ["gilded_age", "pneumaticcraft:programmable_controller", "block_item"],
    ["gilded_age", "pneumaticcraft:drone_interface", "block_item"],
    ["gilded_age", "pneumaticcraft:universal_sensor", "block_item"],
    ["gilded_age", "pneumaticcraft:smart_chest", "block_item"],
    ["gilded_age", "pneumaticcraft:security_station", "block_item"],
    ["gilded_age", "pneumaticcraft:sentry_turret", "block_item"],
    // reinforced_chest + tag_workbench left ungated (QoL/storage, per overscope policy).
    // --- Applied Pneumatics Gilded (AE2 bridge) ---
    ["gilded_age", "appliedpneumatics:me_temperature_interface", "block_item"],
    ["gilded_age", "appliedpneumatics:me_amadron_process_station", "block_item"],
    ["gilded_age", "appliedpneumatics:me_amadron_extended_process_station", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
