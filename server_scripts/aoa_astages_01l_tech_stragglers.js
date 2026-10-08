// AoA KubeJS: aoa_astages_01l_tech_stragglers.js
// Machine Staging Contract pass (2026-05-28) -- tech stragglers
// (enderio, assemblyline, immeng/Immersive-Energistics, productivemetalworks).
//
// EnderIO: void_chassis machines -> IR; ensouled/soul_stained_steel machines -> Gilded.
// (Conduits share one block_item distinguished by data -> NOT item-lockable per tier;
// left ungated, gated by alloy tier. EnderIO alloy ingots are a future tag follow-up.)
// AssemblyLine conveyors/robotics -> IR. immeng IE<->AE2 bridge -> Gilded.
// 2026-05-30 canon: productivemetalworks foundry -> Medieval; all 16 color
// variants of each foundry block locked since any color builds a working foundry.
// blastcraft: blastcompressor already locked (atomic; flagged as possibly over-gated).
// All ages >= recipe ceiling -> no softlock.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages strag] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages strag] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    ["industrial_revolution", "enderio:sag_mill", "block_item"],
    ["industrial_revolution", "enderio:alloy_smelter", "block_item"],
    ["industrial_revolution", "enderio:stirling_generator", "block_item"],
    ["industrial_revolution", "enderio:vat", "block_item"],
    ["industrial_revolution", "enderio:painting_machine", "block_item"],
    ["industrial_revolution", "enderio:impulse_hopper", "block_item"],
    ["industrial_revolution", "enderio:drain", "block_item"],
    ["industrial_revolution", "enderio:wired_charger", "block_item"],
    ["industrial_revolution", "enderio:fluid_tank", "block_item"],
    ["industrial_revolution", "enderio:pressurized_fluid_tank", "block_item"],
    ["industrial_revolution", "enderio:vacuum_chest", "block_item"],
    ["industrial_revolution", "enderio:xp_vacuum", "block_item"],
    ["industrial_revolution", "enderio:enchanter", "block_item"],
    ["industrial_revolution", "enderio:travel_anchor", "block_item"],
    ["industrial_revolution", "enderio:basic_capacitor_bank", "block_item"],
    ["gilded_age", "enderio:soul_engine", "block_item"],
    ["gilded_age", "enderio:soul_binder", "block_item"],
    ["gilded_age", "enderio:slice_and_splice", "block_item"],
    ["gilded_age", "enderio:farming_station", "block_item"],
    ["gilded_age", "enderio:xp_obelisk", "block_item"],
    ["gilded_age", "enderio:attractor_obelisk", "block_item"],
    ["gilded_age", "enderio:aversion_obelisk", "block_item"],
    ["gilded_age", "enderio:inhibitor_obelisk", "block_item"],
    ["gilded_age", "enderio:relocator_obelisk", "block_item"],
    ["gilded_age", "enderio:weather_obelisk", "block_item"],
    ["industrial_revolution", "assemblyline:conveyorbelt", "block_item"],
    ["industrial_revolution", "assemblyline:sorterbelt", "block_item"],
    ["industrial_revolution", "assemblyline:blockbreaker", "block_item"],
    ["industrial_revolution", "assemblyline:blockplacer", "block_item"],
    ["industrial_revolution", "assemblyline:detector", "block_item"],
    ["industrial_revolution", "assemblyline:farmer", "block_item"],
    ["industrial_revolution", "assemblyline:mobgrinder", "block_item"],
    ["industrial_revolution", "assemblyline:rancher", "block_item"],
    ["gilded_age", "immeng:connector_me", "block_item"],
    ["gilded_age", "immeng:connector_me_relay", "block_item"],
    ["gilded_age", "immeng:wirecoil_me_dense", "item"],
    ["medieval_times", "productivemetalworks:casting_table", "block_item"],
    ["medieval_times", "productivemetalworks:casting_basin", "block_item"],
    ["medieval_times", "productivemetalworks:foundry_tap", "block_item"],
    ["medieval_times", "productivemetalworks:powered_heating_coil", "block_item"],
    ["medieval_times", "productivemetalworks:high_powered_heating_coil", "block_item"],
    ["medieval_times", "productivemetalworks:liquid_heating_coil", "block_item"],
    ["medieval_times", "productivemetalworks:white_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:white_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:white_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:white_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:white_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:orange_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:orange_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:orange_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:orange_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:orange_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:magenta_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:magenta_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:magenta_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:magenta_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:magenta_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:light_blue_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:light_blue_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:light_blue_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:light_blue_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:light_blue_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:yellow_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:yellow_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:yellow_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:yellow_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:yellow_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:lime_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:lime_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:lime_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:lime_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:lime_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:pink_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:pink_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:pink_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:pink_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:pink_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:gray_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:gray_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:gray_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:gray_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:gray_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:light_gray_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:light_gray_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:light_gray_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:light_gray_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:light_gray_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:cyan_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:cyan_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:cyan_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:cyan_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:cyan_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:purple_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:purple_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:purple_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:purple_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:purple_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:blue_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:blue_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:blue_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:blue_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:blue_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:brown_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:brown_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:brown_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:brown_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:brown_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:green_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:green_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:green_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:green_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:green_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:red_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:red_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:red_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:red_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:red_foundry_window", "block_item"],
    ["medieval_times", "productivemetalworks:black_foundry_controller", "block_item"],
    ["medieval_times", "productivemetalworks:black_foundry_drain", "block_item"],
    ["medieval_times", "productivemetalworks:black_foundry_tank", "block_item"],
    ["medieval_times", "productivemetalworks:black_foundry_capacitor", "block_item"],
    ["medieval_times", "productivemetalworks:black_foundry_window", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
