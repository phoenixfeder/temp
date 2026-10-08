// AoA KubeJS: aoa_astages_01q_tfmg.js
// Machine Staging Contract pass (2026-07-17) -- Create: The Factory Must Grow (tfmg).
//
// Ownership (owner-approved 2026-07-16, TFMG integration program): TFMG owns the
// Industrial Revolution industrial-steel / crude-oil / refining / combustion surface
// AND the FIRST electrical generation tier (current, motors). Its late high-current /
// transformer / advanced-engine / semiconductor surface is Gilded.
//
// Same soft-item-lock pattern as aoa_astages_01g_create_family.js: Item.exists guard
// (so this script is a no-op when the TFMG jar is absent), plus the ore-like interaction
// allowance carried over verbatim for consistency. Per the staging
// philosophy RAW STONES/ORES STAY UNLOCKED (bauxite/galena/lignite/fireclay/*_ore are
// never locked here); the machines carry the gate.
//
// NO new AStages stages -- registry in aoa_astages_00_register_stages.js is closed.
// Every stage below is an existing age stage (industrial_revolution / gilded_age).
//
// NOTE (verifier 30 finding 1.1, re-confirmed against tfmg-1.2.2.jar this pass):
// tfmg:large_transformer is a formed multiblock with NO item form (jar ships
// assets/tfmg/blockstates/large_transformer.json but no models/item/large_transformer
// entry), so an item lock would silently no-op. It is deliberately absent from the list
// below. Its buildable item-form components large_coil and large_switch ARE locked at
// gilded_age, which holds the multiblock.

;(function () {
  if (typeof AStages === 'undefined') return
  // Ore blocks are disguised as plain stone in-world; AStages' RightClickBlock hook
  // tests the TARGET block against BLOCK_INTERACTIONS, so locking interaction on a
  // hidden ore breaks placing a torch/block against it. Allow interaction for ore-like
  // ids only; machines stay guarded. (No ore is locked here -- helper kept for parity
  // with 01g.)
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
      console.warn('[AoA AStages tfmg] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item), aoaOreLikeId(item)) }
    catch (e) { console.warn('[AoA AStages tfmg] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // === IR: heat / steel (chain B) ===
    ["industrial_revolution", "tfmg:coke_oven", "block_item"],
    ["industrial_revolution", "tfmg:blast_furnace_hatch", "block_item"],
    ["industrial_revolution", "tfmg:blast_furnace_output", "block_item"],
    ["industrial_revolution", "tfmg:blast_furnace_reinforcement", "block_item"],
    ["industrial_revolution", "tfmg:blast_stove", "block_item"],
    ["industrial_revolution", "tfmg:firebox", "block_item"],
    ["industrial_revolution", "tfmg:casting_basin", "block_item"],
    // === IR: oil extraction + distillation ===
    ["industrial_revolution", "tfmg:surface_scanner", "block_item"],
    ["industrial_revolution", "tfmg:pumpjack_base", "block_item"],
    ["industrial_revolution", "tfmg:pumpjack_crank", "block_item"],
    ["industrial_revolution", "tfmg:pumpjack_hammer", "block_item"],
    ["industrial_revolution", "tfmg:pumpjack_hammer_head", "block_item"],
    ["industrial_revolution", "tfmg:pumpjack_hammer_connector", "block_item"],
    ["industrial_revolution", "tfmg:pumpjack_hammer_part", "block_item"],
    ["industrial_revolution", "tfmg:large_pumpjack_hammer_head", "block_item"],
    ["industrial_revolution", "tfmg:large_pumpjack_hammer_connector", "block_item"],
    ["industrial_revolution", "tfmg:large_pumpjack_hammer_part", "block_item"],
    ["industrial_revolution", "tfmg:steel_distillation_controller", "block_item"],
    ["industrial_revolution", "tfmg:steel_distillation_output", "block_item"],
    ["industrial_revolution", "tfmg:flarestack", "block_item"],
    // === IR: combustion ===
    ["industrial_revolution", "tfmg:regular_engine", "block_item"],
    ["industrial_revolution", "tfmg:simple_large_engine", "block_item"],
    ["industrial_revolution", "tfmg:engine_gearbox", "block_item"],
    ["industrial_revolution", "tfmg:exhaust", "block_item"],
    ["industrial_revolution", "tfmg:air_intake", "block_item"],
    // === IR: first electrical generation / current / motors ===
    ["industrial_revolution", "tfmg:winding_machine", "block_item"],
    ["industrial_revolution", "tfmg:generator", "block_item"],
    ["industrial_revolution", "tfmg:electric_motor", "block_item"],
    ["industrial_revolution", "tfmg:polarizer", "block_item"],
    ["industrial_revolution", "tfmg:magnetic_alloy_ingot", "item"],
    ["industrial_revolution", "tfmg:magnet", "item"],
    ["industrial_revolution", "tfmg:accumulator", "block_item"],
    ["industrial_revolution", "tfmg:electric_pump", "block_item"],
    ["industrial_revolution", "tfmg:cable_connector", "block_item"],
    ["industrial_revolution", "tfmg:electric_post", "block_item"],
    ["industrial_revolution", "tfmg:electrical_switch", "block_item"],
    // === IR: chemical vat family (aluminum line is IR chain B7 -- do NOT gild) ===
    ["industrial_revolution", "tfmg:steel_chemical_vat", "block_item"],
    ["industrial_revolution", "tfmg:cast_iron_chemical_vat", "block_item"],
    ["industrial_revolution", "tfmg:electrode_holder", "block_item"],
    ["industrial_revolution", "tfmg:machine_input", "block_item"],
    ["industrial_revolution", "tfmg:industrial_mixer", "block_item"],
    // === GILDED: late high-current / advanced engines / fireproof vat (chain F) ===
    // large_transformer is EXCLUDED (no item form; its item-form parts large_coil +
    // large_switch below hold the multiblock).
    ["gilded_age", "tfmg:transformer", "block_item"],
    ["gilded_age", "tfmg:large_switch", "block_item"],
    ["gilded_age", "tfmg:large_coil", "block_item"],
    ["gilded_age", "tfmg:large_engine", "block_item"],
    ["gilded_age", "tfmg:radial_engine", "block_item"],
    ["gilded_age", "tfmg:turbine_engine", "block_item"],
    ["gilded_age", "tfmg:fireproof_chemical_vat", "block_item"],
    // === IR: semiconductor electronics ===
    // circuit_board / transistor_item / capacitor_item stay UNGATED (do NOT gild them);
    // the IR generator itself consumes capacitor_item. The doped/etched/coated tier is IR, not Gilded.
    // NOTE 2026-08-27: the original rationale cited quest 1A2607170000050E's engine_controller
    // recipe ancestry. tfmg 1.2.4b-community removed the engine_controller block entirely (no
    // registration, no blockstate, no name key), so that ancestry no longer exists and its lock
    // line was dropped above. IR placement now rests on the generator / winding_machine line
    // in the same chapter. Owner should confirm that is still the intended justification.
    ["industrial_revolution", "tfmg:n_semiconductor", "item"],
    ["industrial_revolution", "tfmg:p_semiconductor", "item"],
    ["industrial_revolution", "tfmg:etched_circuit_board", "item"],
    ["industrial_revolution", "tfmg:coated_circuit_board", "item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
