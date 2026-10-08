// AoA KubeJS: aoa_astages_01j_storage.js
// Machine Staging Contract pass (2026-05-28) -- Refined Storage + storage networks
// (refinedstorage, extrastorage, extradisks, cabletiers, refinedstorage_mekanism_integration, sophisticatedstorage).
//
// 2026-05-30 canon: Refined Storage starts in Industrial Revolution
// (processor_binding + network entry). RS autocrafting -> Gilded (already).
// Tiered: cabletiers elite=Industrial Revolution / ultra=Gilded / mega=Atomic; extradisks INFINITE
// storage -> Atomic (the bypass tier; finite tiers left ungated as QoL); RS-mek chemical
// storage Gilded, 8192b Atomic. SophStorage automation upgrades already gated in file 07;
// only its controller-network IO added here at Renaissance. Finite storage disks/parts and
// SophStorage QoL chests/barrels/backpacks left ungated per overscope policy.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages storage] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages storage] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // === refinedstorage network entry -> Industrial Revolution ===
    ["industrial_revolution", "refinedstorage:controller", "block_item"],
    ["industrial_revolution", "refinedstorage:grid", "block_item"],
    ["industrial_revolution", "refinedstorage:crafting_grid", "block_item"],
    ["industrial_revolution", "refinedstorage:disk_drive", "block_item"],
    ["industrial_revolution", "refinedstorage:detector", "block_item"],
    ["industrial_revolution", "refinedstorage:security_manager", "block_item"],
    ["industrial_revolution", "refinedstorage:storage_monitor", "block_item"],
    ["industrial_revolution", "refinedstorage:portable_grid", "block_item"],
    // === extrastorage autocrafter ladder (RS autocrafting = Gilded; netherite -> Atomic) ===
    ["gilded_age", "extrastorage:iron_crafter", "block_item"],
    ["gilded_age", "extrastorage:gold_crafter", "block_item"],
    ["gilded_age", "extrastorage:diamond_crafter", "block_item"],
    ["atomic", "extrastorage:netherite_crafter", "block_item"],
    ["atomic", "extrastorage:advanced_importer", "block_item"],
    // === extradisks INFINITE storage tier -> Atomic (genuine infinite-storage bypass) ===
    ["atomic", "extradisks:withering_processor", "item"],
    ["atomic", "extradisks:infinite_item_storage_part", "item"],
    ["atomic", "extradisks:infinite_item_storage_disk", "item"],
    ["atomic", "extradisks:infinite_item_storage_block", "block_item"],
    ["atomic", "extradisks:infinite_fluid_storage_part", "item"],
    ["atomic", "extradisks:infinite_fluid_storage_disk", "item"],
    ["atomic", "extradisks:infinite_fluid_storage_block", "block_item"],
    ["atomic", "extradisks:infinite_chemical_storage_part", "item"],
    ["atomic", "extradisks:infinite_chemical_storage_disk", "item"],
    ["atomic", "extradisks:infinite_chemical_storage_block", "block_item"],
    // === cabletiers ladder (elite=IR, ultra=Gilded, mega=Atomic; autocrafters follow Gilded) ===
    ["industrial_revolution", "cabletiers:elite_exporter", "block_item"],
    ["industrial_revolution", "cabletiers:elite_constructor", "block_item"],
    ["industrial_revolution", "cabletiers:elite_destructor", "block_item"],
    ["industrial_revolution", "cabletiers:elite_interface", "block_item"],
    ["industrial_revolution", "cabletiers:elite_disk_interface", "block_item"],
    ["gilded_age", "cabletiers:elite_autocrafter", "block_item"],
    ["gilded_age", "cabletiers:ultra_importer", "block_item"],
    ["gilded_age", "cabletiers:ultra_exporter", "block_item"],
    ["gilded_age", "cabletiers:ultra_constructor", "block_item"],
    ["gilded_age", "cabletiers:ultra_destructor", "block_item"],
    ["gilded_age", "cabletiers:ultra_interface", "block_item"],
    ["gilded_age", "cabletiers:ultra_disk_interface", "block_item"],
    ["gilded_age", "cabletiers:ultra_autocrafter", "block_item"],
    ["atomic", "cabletiers:mega_importer", "block_item"],
    ["atomic", "cabletiers:mega_exporter", "block_item"],
    ["atomic", "cabletiers:mega_constructor", "block_item"],
    ["atomic", "cabletiers:mega_destructor", "block_item"],
    ["atomic", "cabletiers:mega_interface", "block_item"],
    ["atomic", "cabletiers:mega_disk_interface", "block_item"],
    ["atomic", "cabletiers:mega_autocrafter", "block_item"],
    // === refinedstorage_mekanism_integration chemical storage (64b -> Atomic; 256b+ -> Gilded) ===
    ["atomic", "refinedstorage_mekanism_integration:64b_chemical_storage_block", "block_item"],
    ["atomic", "refinedstorage_mekanism_integration:64b_chemical_storage_disk", "item"],
    ["gilded_age", "refinedstorage_mekanism_integration:256b_chemical_storage_part", "item"],
    ["gilded_age", "refinedstorage_mekanism_integration:256b_chemical_storage_block", "block_item"],
    ["gilded_age", "refinedstorage_mekanism_integration:256b_chemical_storage_disk", "item"],
    ["gilded_age", "refinedstorage_mekanism_integration:1024b_chemical_storage_part", "item"],
    ["gilded_age", "refinedstorage_mekanism_integration:1024b_chemical_storage_block", "block_item"],
    ["gilded_age", "refinedstorage_mekanism_integration:1024b_chemical_storage_disk", "item"],
    ["atomic", "refinedstorage_mekanism_integration:8192b_chemical_storage_part", "item"],
    ["atomic", "refinedstorage_mekanism_integration:8192b_chemical_storage_block", "block_item"],
    ["atomic", "refinedstorage_mekanism_integration:8192b_chemical_storage_disk", "item"],
    // === sophisticatedstorage controller-network IO -> Renaissance (matches controller; file 07 gates sophisticatedbackpacks: upgrades plus sophisticatedstorage: upgrades/link/diamond+netherite tiers) ===
    ["the_renaissance", "sophisticatedstorage:storage_io", "block_item"],
    ["the_renaissance", "sophisticatedstorage:storage_input", "block_item"],
    ["the_renaissance", "sophisticatedstorage:storage_output", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
