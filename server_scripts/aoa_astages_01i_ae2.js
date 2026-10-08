// AoA KubeJS: aoa_astages_01i_ae2.js
// Machine Staging Contract pass (2026-05-28) -- Applied Energistics 2 family
// (ae2, advanced_ae, extendedae, megacells, expandedae).
//
// 2026-05-30 canon: AE2 starts in Industrial Revolution. inscriber + fluix
// produce the processors there; the ME network spine (controller/drive/crafting CPU)
// opens with that stage. Molecular assembler/pattern provider/wireless stay later.
// Spatial storage -> Atomic. The
// quantum tier (advanced_ae, needs ae2:singularity) -> Otherworldly. extendedae
// mastery/matrix layer -> Atomic. Lower Mega/Expanded tiers -> Gilded, with the 256M crafting-storage exception -> Atomic.
// Biggest bypasses closed: ae2:controller/drive/crafting_unit (network core) and
// advanced_ae:reaction_chamber (quantum-alloy production machine) were ungated.
// Decorative quartz/sky_stone/fluix building blocks, cable color variants, budding/
// growth blocks, and cell media (housing-is-the-gate) left ungated.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages ae2] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages ae2] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // === ae2 ME network spine -> Industrial Revolution ===
    ["industrial_revolution", "ae2:controller", "block_item"],
    ["industrial_revolution", "ae2:drive", "block_item"],
    ["industrial_revolution", "ae2:chest", "block_item"],
    ["industrial_revolution", "ae2:io_port", "block_item"],
    ["industrial_revolution", "ae2:condenser", "block_item"],
    ["industrial_revolution", "ae2:cell_workbench", "block_item"],
    ["industrial_revolution", "ae2:energy_cell", "block_item"],
    ["industrial_revolution", "ae2:dense_energy_cell", "block_item"],
    ["industrial_revolution", "ae2:energy_acceptor", "block_item"],
    ["industrial_revolution", "ae2:crystal_resonance_generator", "block_item"],
    ["industrial_revolution", "ae2:crafting_unit", "block_item"],
    ["industrial_revolution", "ae2:crafting_accelerator", "block_item"],
    ["industrial_revolution", "ae2:crafting_monitor", "block_item"],
    ["industrial_revolution", "ae2:1k_crafting_storage", "block_item"],
    ["industrial_revolution", "ae2:4k_crafting_storage", "block_item"],
    ["industrial_revolution", "ae2:16k_crafting_storage", "block_item"],
    ["industrial_revolution", "ae2:64k_crafting_storage", "block_item"],
    ["industrial_revolution", "ae2:256k_crafting_storage", "block_item"],
    // === ae2 spatial storage -> Atomic ===
    ["atomic", "ae2:spatial_pylon", "block_item"],
    ["atomic", "ae2:spatial_io_port", "block_item"],
    ["atomic", "ae2:spatial_anchor", "block_item"],
    // === advanced_ae: reaction_chamber gateway -> Gilded; quantum tier (needs ae2:singularity, OW) -> Otherworldly ===
    ["gilded_age", "advanced_ae:reaction_chamber", "block_item"],
    ["otherworldly", "advanced_ae:quantum_accelerator", "block_item"],
    ["otherworldly", "advanced_ae:quantum_multi_threader", "block_item"],
    ["otherworldly", "advanced_ae:quantum_storage_128", "block_item"],
    ["otherworldly", "advanced_ae:quantum_storage_256", "block_item"],
    ["otherworldly", "advanced_ae:data_entangler", "block_item"],
    ["otherworldly", "advanced_ae:quantum_structure", "block_item"],
    ["otherworldly", "advanced_ae:quantum_infusion_block", "block_item"],
    // === extendedae mastery/upgrade layer -> Atomic (matrix_crafter already atomic) ===
    // C4 softlock fix (2026-06-04): crystal_assembler builds appliedpneumatics:me_amadron_extended_process_station,
    // demanded required at Gilded (g3). machine_frame down-tiered with it (it is crystal_assembler's only atomic
    // crafting ingredient); the other mastery machines below keep their own atomic block locks, so the tier holds.
    ["gilded_age", "extendedae:crystal_assembler", "block_item"],
    ["gilded_age", "extendedae:machine_frame", "block_item"],
    ["atomic", "extendedae:circuit_cutter", "block_item"],
    ["atomic", "extendedae:caner", "block_item"],
    ["atomic", "extendedae:crystal_fixer", "block_item"],
    ["atomic", "extendedae:ingredient_buffer", "block_item"],
    ["atomic", "extendedae:ex_inscriber", "block_item"],
    ["atomic", "extendedae:ex_drive", "block_item"],
    ["atomic", "extendedae:ex_interface", "block_item"],
    ["atomic", "extendedae:ex_io_port", "block_item"],
    ["atomic", "extendedae:ex_charger", "block_item"],
    ["atomic", "extendedae:ex_emc_interface", "block_item"],
    ["atomic", "extendedae:oversize_interface", "block_item"],
    ["atomic", "extendedae:assembler_matrix_frame", "block_item"],
    ["atomic", "extendedae:assembler_matrix_glass", "block_item"],
    ["atomic", "extendedae:assembler_matrix_wall", "block_item"],
    ["atomic", "extendedae:assembler_matrix_pattern", "block_item"],
    ["atomic", "extendedae:assembler_matrix_speed", "block_item"],
    // === megacells scaled storage/network -> Gilded; 256M crafting storage -> Atomic ===
    ["gilded_age", "megacells:mega_crafting_unit", "block_item"],
    ["gilded_age", "megacells:mega_crafting_accelerator", "block_item"],
    ["gilded_age", "megacells:mega_crafting_monitor", "block_item"],
    ["gilded_age", "megacells:mega_interface", "block_item"],
    ["gilded_age", "megacells:mega_pattern_provider", "block_item"],
    ["gilded_age", "megacells:mega_energy_cell", "block_item"],
    ["gilded_age", "megacells:cell_dock", "block_item"],
    ["gilded_age", "megacells:1m_crafting_storage", "block_item"],
    ["gilded_age", "megacells:4m_crafting_storage", "block_item"],
    ["gilded_age", "megacells:16m_crafting_storage", "block_item"],
    ["gilded_age", "megacells:64m_crafting_storage", "block_item"],
    ["atomic", "megacells:256m_crafting_storage", "block_item"],
    ["gilded_age", "megacells:mega_fluid_cell_housing", "item"],
    ["gilded_age", "megacells:mega_chemical_cell_housing", "item"],
    ["gilded_age", "megacells:mega_experience_cell_housing", "item"],
    ["gilded_age", "megacells:bulk_item_cell", "item"],
    // === expandedae scaled autocrafting -> Gilded (full accelerator ladder, explicit per locking-style) ===
    ["gilded_age", "expandedae:exp_crafting_unit", "block_item"],
    ["atomic", "expandedae:exp_io_port", "block_item"],
    ["gilded_age", "expandedae:exp_pattern_provider", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_2", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_4", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_8", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_16", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_32", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_64", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_128", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_256", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_512", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_1k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_2k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_4k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_8k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_16k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_32k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_64k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_128k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_256k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_512k", "block_item"],
    ["gilded_age", "expandedae:exp_crafting_accelerator_1m", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
