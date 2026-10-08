// AoA KubeJS: aoa_astages_01g_create_family.js
// Machine Staging Contract pass (2026-05-28) -- Create family.
//
// Base Create processing layer split (user 2026-05-28; re-staged 2026-07-31):
// andesite kinetics + brass alloying + basic brass machines (brass_casing,
// crushing_wheel, mechanical_press -- locked in aoa_astages_01_item_restrictions.js)
// -> Medieval; precision side (rotation_speed_controller, clockwork_bearing,
// flywheel here; mechanical_arm, mechanical_saw, mechanical_crafter,
// mechanical_drill, portable_storage_interface in 01_item_restrictions)
// + factory-logistics + displays -> Renaissance
// (Renaissance already owns steam_engine + trains). Addons:
//   createaddition (SU<->FE electric)    -> IR  (annex AFTER TFMG first current)
//   create_new_age electric tier (incl. reinforced/netherite/advanced-solar) -> GILDED
//   create_new_age nuclear reactor chain -> Atomic (was FULLY UNGATED)
//   railways train infrastructure        -> Renaissance
// Decor/cosmetic/bulk-component (cogwheels/shafts/casings/copycats/framed) left ungated.
//
// OWNERSHIP MAP UPDATE (2026-07-16 TFMG integration program): TFMG owns IR industrial
// steel, crude oil, refining, combustion, and the FIRST electrical generation tier
// (locked in aoa_astages_01q_tfmg.js). Create: New Age is therefore demoted to LATE
// GILDED magnetics / high-current + the thorium experiment that bridges to Create
// Nuclear (Atomic). All create_new_age electric-tier locks below moved IR -> gilded_age
// (owner-approved); only the F6 thorium-bridge ask (fluxuated_magnetite) lives at Gilded
// while the reactor block stays Atomic.
//

;(function () {
  if (typeof AStages === 'undefined') return
  // Ore blocks are disguised as plain stone in-world; AStages' RightClickBlock
  // hook tests the TARGET block against BLOCK_INTERACTIONS, so locking interaction
  // on a hidden ore broke placing a torch/block against it. Allow interaction for
  // ore-like ids only; machines stay guarded. (Omitted arg => stays locked.)
  function aoaOreLikeId(id) {
    return /_ore$|:ore[a-z_]|deepslateore|rawore/.test(id)
  }
  function applySoftItemPolicy(r, allowBlockInteraction) {
    var configured = r.allowInventoryStorage().allowContainerStorage().allowPickup()
    if (allowBlockInteraction !== true) configured.disableBlockInteraction()
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return configured
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages create] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item), aoaOreLikeId(item)) }
    catch (e) { console.warn('[AoA AStages create] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // === base create: pure-andesite kinetic machines -> Medieval (user split; brass ===
    // === alloying + basic brass machines are ALSO Medieval, in 01_item_restrictions) ===
    ["medieval_times", "create:mechanical_mixer", "block_item"],
    ["medieval_times", "create:encased_fan", "block_item"],
    ["medieval_times", "create:mechanical_bearing", "block_item"],
    ["medieval_times", "create:windmill_bearing", "block_item"],
    ["medieval_times", "create:gantry_carriage", "block_item"],
    ["medieval_times", "create:mechanical_piston", "block_item"],
    ["medieval_times", "create:sticky_mechanical_piston", "block_item"],
    ["medieval_times", "create:hose_pulley", "block_item"],
    ["medieval_times", "create:cart_assembler", "block_item"],
    ["medieval_times", "create:chain_conveyor", "block_item"],
    // === base create: precision + factory-logistics + displays -> Renaissance (user ===
    // === split; arm/saw/crafter/drill/PSI locks live in 01_item_restrictions) ===
    ["the_renaissance", "create:rotation_speed_controller", "block_item"],
    ["the_renaissance", "create:clockwork_bearing", "block_item"],
    ["the_renaissance", "create:flywheel", "block_item"],
    ["the_renaissance", "create:elevator_pulley", "block_item"],
    ["the_renaissance", "create:mechanical_roller", "block_item"],
    ["the_renaissance", "create:display_board", "block_item"],
    ["the_renaissance", "create:display_link", "block_item"],
    ["the_renaissance", "create:packager", "block_item"],
    ["the_renaissance", "create:repackager", "block_item"],
    ["the_renaissance", "create:stock_link", "block_item"],
    ["the_renaissance", "create:stock_ticker", "block_item"],
    ["the_renaissance", "create:redstone_requester", "block_item"],
    ["the_renaissance", "create:factory_gauge", "block_item"],
    ["the_renaissance", "create:package_frogport", "block_item"],
    // === createaddition IR (SU<->FE electric; siblings of IR-locked alternator) ===
    ["industrial_revolution", "createaddition:electric_motor", "block_item"],
    ["industrial_revolution", "createaddition:modular_accumulator", "block_item"],
    ["industrial_revolution", "createaddition:tesla_coil", "block_item"],
    ["industrial_revolution", "createaddition:portable_energy_interface", "block_item"],
    ["industrial_revolution", "createaddition:digital_adapter", "block_item"],
    ["industrial_revolution", "createaddition:redstone_relay", "block_item"],
    ["industrial_revolution", "createaddition:connector", "block_item"],
    ["industrial_revolution", "createaddition:large_connector", "block_item"],
    ["industrial_revolution", "createaddition:small_light_connector", "block_item"],
    // === create_new_age electric tier -> GILDED (relocated IR -> gilded_age 2026-07-16, ===
    // === owner-approved: TFMG now owns IR first-current; New Age is late-Gilded magnetics) ===
    ["gilded_age", "create_new_age:basic_energiser", "block_item"],
    ["gilded_age", "create_new_age:basic_motor", "block_item"],
    ["gilded_age", "create_new_age:basic_motor_extension", "block_item"],
    ["gilded_age", "create_new_age:advanced_motor", "block_item"],
    ["gilded_age", "create_new_age:advanced_motor_extension", "block_item"],
    ["gilded_age", "create_new_age:advanced_energiser", "block_item"],
    ["gilded_age", "create_new_age:reinforced_motor", "block_item"],
    ["gilded_age", "create_new_age:reinforced_energiser", "block_item"],
    ["gilded_age", "create_new_age:generator_coil", "block_item"],
    ["gilded_age", "create_new_age:carbon_brushes", "block_item"],
    ["gilded_age", "create_new_age:heat_pipe", "block_item"],
    ["gilded_age", "create_new_age:heater", "block_item"],
    ["gilded_age", "create_new_age:redstone_magnet", "block_item"],
    ["gilded_age", "create_new_age:layered_magnet", "block_item"],
    ["gilded_age", "create_new_age:netherite_magnet", "block_item"],
    ["gilded_age", "create_new_age:basic_solar_heating_plate", "block_item"],
    ["gilded_age", "create_new_age:advanced_solar_heating_plate", "block_item"],
    ["gilded_age", "create_new_age:electrical_connector", "block_item"],
    // F6/31 bridge asks (Gilded): the fluxuated magnetite -> thorium experiment feeds the
    // Create Nuclear (Atomic) bridge; copper_wire is the F-chain winding stock.
    ["gilded_age", "create_new_age:fluxuated_magnetite", "item"],
    ["gilded_age", "create_new_age:copper_wire", "item"],
    // === create_new_age ATOMIC nuclear subsystem (thorium reactor chain was fully ungated) ===
    ["atomic", "create_new_age:reactor_casing", "block_item"],
    ["atomic", "create_new_age:reactor_fuel_acceptor", "block_item"],
    ["atomic", "create_new_age:reactor_rod", "block_item"],
    ["atomic", "create_new_age:reactor_heat_vent", "block_item"],
    ["atomic", "create_new_age:reactor_glass", "block_item"],
    ["atomic", "create_new_age:heat_pump", "block_item"],
    ["atomic", "create_new_age:thorium_ore", "block_item"],
    ["atomic", "create_new_age:thorium", "item"],
    ["atomic", "create_new_age:radioactive_thorium", "item"],
    ["atomic", "create_new_age:nuclear_fuel", "item"],
    // === railways (Steam'n'Rails) Renaissance train infrastructure ===
    ["the_renaissance", "railways:semaphore", "block_item"],
    ["the_renaissance", "railways:handcar", "block_item"],
    ["the_renaissance", "railways:link_and_pin", "block_item"],
    ["the_renaissance", "railways:portable_fuel_interface", "block_item"],
    // === create_aquatic_ambitions -> Gilded (Create ocean-tech addon; matches g6 quest placement) ===
    // Keystone material + rod + Conduit Cage. Channeling outputs (spiky_shell/nautilus_shard)
    // come only from the awakened Cage, so gating these three holds the whole addon to Gilded.
    ["gilded_age", "create_aquatic_ambitions:prismarine_alloy", "item"],
    ["gilded_age", "create_aquatic_ambitions:prismarine_alloy_rod", "item"],
    ["gilded_age", "create_aquatic_ambitions:prismarine_alloy_block", "block_item"],
    ["gilded_age", "create_aquatic_ambitions:mechanical_conduit", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
