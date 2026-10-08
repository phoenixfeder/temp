// AoA KubeJS: aoa_astages_01n_ascension.js
// Machine Staging Contract pass (2026-05-28) -- apex / late-tier crafting
// (draconicevolution, avaritia [Re:Avaritia], extendedcrafting).
//
// Draconic Evolution TIER SPLIT (user 2026-05-28): base + wyvern draconium tier
// (machines, basic/wyvern crystals, draconium ore/dust/core) -> Otherworldly;
// awakened / draconic / chaotic / reactor tier -> Ascension. (draconium_ingot was
// moved ascension->otherworldly in the main file to match.) Avaritia stays
// Ascension prestige (entry compression tables have no recipe -> must item-lock).
// Extended Crafting TIERED (user): basic table/auto/handheld/frame/pedestal -> IR;
// advanced table/auto/ender+flux crafters/alternators -> Gilded; elite/ultimate +
// cores/compressor/crystaltine/enhanced -> Ascension.
// All ages >= recipe ceiling; each tier ladder shares a stage so in-stage order holds.

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
      console.warn('[AoA AStages asc] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item), aoaOreLikeId(item)) }
    catch (e) { console.warn('[AoA AStages asc] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    ["otherworldly", "draconicevolution:crafting_core", "block_item"],
    ["otherworldly", "draconicevolution:basic_crafting_injector", "block_item"],
    ["otherworldly", "draconicevolution:wyvern_crafting_injector", "block_item"],
    ["otherworldly", "draconicevolution:energy_core", "block_item"],
    ["otherworldly", "draconicevolution:energy_core_stabilizer", "block_item"],
    ["otherworldly", "draconicevolution:energy_pylon", "block_item"],
    ["otherworldly", "draconicevolution:particle_generator", "block_item"],
    ["otherworldly", "draconicevolution:generator", "block_item"],
    ["otherworldly", "draconicevolution:grinder", "block_item"],
    ["otherworldly", "draconicevolution:energy_transfuser", "block_item"],
    ["otherworldly", "draconicevolution:draconium_chest", "block_item"],
    ["otherworldly", "draconicevolution:potentiometer", "block_item"],
    ["otherworldly", "draconicevolution:disenchanter", "block_item"],
    ["otherworldly", "draconicevolution:dislocation_inhibitor", "block_item"],
    ["otherworldly", "draconicevolution:celestial_manipulator", "block_item"],
    ["otherworldly", "draconicevolution:basic_io_crystal", "block_item"],
    ["otherworldly", "draconicevolution:wyvern_io_crystal", "block_item"],
    ["otherworldly", "draconicevolution:basic_relay_crystal", "block_item"],
    ["otherworldly", "draconicevolution:wyvern_relay_crystal", "block_item"],
    ["otherworldly", "draconicevolution:basic_wireless_crystal", "block_item"],
    ["otherworldly", "draconicevolution:wyvern_wireless_crystal", "block_item"],
    ["otherworldly", "draconicevolution:draconium_block", "block_item"],
    ["otherworldly", "draconicevolution:overworld_draconium_ore", "block_item"],
    ["otherworldly", "draconicevolution:nether_draconium_ore", "block_item"],
    ["otherworldly", "draconicevolution:end_draconium_ore", "block_item"],
    ["otherworldly", "draconicevolution:deepslate_draconium_ore", "block_item"],
    ["otherworldly", "draconicevolution:draconium_core", "item"],
    ["otherworldly", "draconicevolution:wyvern_core", "item"],
    ["otherworldly", "draconicevolution:wyvern_energy_core", "item"],
    ["otherworldly", "draconicevolution:draconium_dust", "item"],
    ["otherworldly", "draconicevolution:draconium_nugget", "item"],
    // wyvern finished gear -> Otherworldly (2026-06-04): was ingredient-gated via wyvern_core only; mirrors the chaotic-gear hardening. (no wyvern_staff exists.)
    ["otherworldly", "draconicevolution:wyvern_sword", "item"],
    ["otherworldly", "draconicevolution:wyvern_pickaxe", "item"],
    ["otherworldly", "draconicevolution:wyvern_axe", "item"],
    ["otherworldly", "draconicevolution:wyvern_shovel", "item"],
    ["otherworldly", "draconicevolution:wyvern_hoe", "item"],
    ["otherworldly", "draconicevolution:wyvern_bow", "item"],
    ["otherworldly", "draconicevolution:wyvern_capacitor", "item"],
    ["ascension", "draconicevolution:awakened_crafting_injector", "block_item"],
    ["ascension", "draconicevolution:chaotic_crafting_injector", "block_item"],
    ["ascension", "draconicevolution:reactor_core", "block_item"],
    ["ascension", "draconicevolution:reactor_injector", "block_item"],
    ["ascension", "draconicevolution:reactor_stabilizer", "block_item"],
    ["ascension", "draconicevolution:draconic_io_crystal", "block_item"],
    ["ascension", "draconicevolution:draconic_relay_crystal", "block_item"],
    ["ascension", "draconicevolution:draconic_wireless_crystal", "block_item"],
    ["ascension", "draconicevolution:awakened_draconium_block", "block_item"],
    ["ascension", "draconicevolution:chaos_crystal", "block_item"],
    ["ascension", "draconicevolution:awakened_core", "item"],
    ["ascension", "draconicevolution:draconic_energy_core", "item"],
    ["ascension", "draconicevolution:chaotic_energy_core", "item"],
    ["ascension", "draconicevolution:awakened_draconium_dust", "item"],
    ["ascension", "draconicevolution:awakened_draconium_ingot", "item"],
    ["ascension", "draconicevolution:awakened_draconium_nugget", "item"],
    ["ascension", "draconicevolution:chaos_shard", "item"],
    ["ascension", "draconicevolution:large_chaos_frag", "item"],
    ["ascension", "draconicevolution:medium_chaos_frag", "item"],
    ["ascension", "draconicevolution:small_chaos_frag", "item"],
    ["ascension", "draconicevolution:reactor_prt_focus_ring", "item"],
    ["ascension", "draconicevolution:reactor_prt_in_rotor", "item"],
    ["ascension", "draconicevolution:reactor_prt_out_rotor", "item"],
    ["ascension", "draconicevolution:reactor_prt_rotor_full", "item"],
    ["ascension", "draconicevolution:reactor_prt_stab_frame", "item"],
    // D (2026-06-04): ungated finished Chaotic apex gear -> Ascension (chaotic tier per file header; was ingredient-gated via chaotic_core only).
    ["ascension", "draconicevolution:chaotic_staff", "item"],
    ["ascension", "draconicevolution:chaotic_sword", "item"],
    ["ascension", "draconicevolution:chaotic_pickaxe", "item"],
    ["ascension", "draconicevolution:chaotic_axe", "item"],
    ["ascension", "draconicevolution:chaotic_shovel", "item"],
    ["ascension", "draconicevolution:chaotic_hoe", "item"],
    ["ascension", "draconicevolution:chaotic_bow", "item"],
    ["ascension", "draconicevolution:chaotic_capacitor", "item"],
    ["ascension", "avaritia:compressed_crafting_table", "block_item"],
    ["ascension", "avaritia:double_compressed_crafting_table", "block_item"],
    ["ascension", "avaritia:extreme_crafting_table", "block_item"],
    ["ascension", "avaritia:compressor", "block_item"],
    ["ascension", "avaritia:infinity_chest", "block_item"],
    ["ascension", "avaritia:neutron_collector", "block_item"],
    ["ascension", "avaritia:neutronium_block", "block_item"],
    ["ascension", "avaritia:infinity_block", "block_item"],
    ["ascension", "avaritia:crystal_matrix_block", "block_item"],
    ["ascension", "avaritia:neutron_pile", "item"],
    ["ascension", "avaritia:neutron_nugget", "item"],
    ["ascension", "avaritia:neutronium_ingot", "item"],
    ["ascension", "avaritia:diamond_lattice", "item"],
    ["ascension", "avaritia:endest_pearl", "item"],
    ["ascension", "avaritia:crystal_matrix_ingot", "item"],
    ["ascension", "avaritia:infinity_catalyst", "item"],
    ["ascension", "avaritia:iron_singularity", "item"],
    ["ascension", "avaritia:gold_singularity", "item"],
    ["ascension", "avaritia:lapis_singularity", "item"],
    ["ascension", "avaritia:redstone_singularity", "item"],
    ["ascension", "avaritia:quartz_singularity", "item"],
    ["ascension", "avaritia:diamond_singularity", "item"],
    ["ascension", "avaritia:emerald_singularity", "item"],
    ["ascension", "avaritia:copper_singularity", "item"],
    ["ascension", "avaritia:amethyst_singularity", "item"],
    ["ascension", "avaritia:netherite_singularity", "item"],
    ["ascension", "avaritia:infinity_singularity", "item"],
    ["ascension", "avaritia:cosmic_meatballs", "item"],
    ["ascension", "avaritia:ultimate_stew", "item"],
    ["ascension", "avaritia:record_fragment", "item"],
    ["ascension", "avaritia:matter_cluster", "item"],
    ["industrial_revolution", "extendedcrafting:basic_table", "block_item"],
    ["industrial_revolution", "extendedcrafting:basic_auto_table", "block_item"],
    ["industrial_revolution", "extendedcrafting:handheld_table", "block_item"],
    ["industrial_revolution", "extendedcrafting:frame", "block_item"],
    ["industrial_revolution", "extendedcrafting:pedestal", "block_item"],
    ["ascension", "extendedcrafting:advanced_table", "block_item"],
    ["gilded_age", "extendedcrafting:advanced_auto_table", "block_item"],
    ["gilded_age", "extendedcrafting:ender_crafter", "block_item"],
    ["gilded_age", "extendedcrafting:auto_ender_crafter", "block_item"],
    ["gilded_age", "extendedcrafting:flux_crafter", "block_item"],
    ["gilded_age", "extendedcrafting:auto_flux_crafter", "block_item"],
    ["gilded_age", "extendedcrafting:ender_alternator", "block_item"],
    ["gilded_age", "extendedcrafting:flux_alternator", "block_item"],
    ["ascension", "extendedcrafting:crafting_core", "block_item"],
    ["ascension", "extendedcrafting:compressor", "block_item"],
    ["ascension", "extendedcrafting:elite_table", "block_item"],
    ["ascension", "extendedcrafting:elite_auto_table", "block_item"],
    ["ascension", "extendedcrafting:ultimate_auto_table", "block_item"],
    ["ascension", "extendedcrafting:the_ultimate_block", "block_item"],
    ["ascension", "extendedcrafting:crystaltine_block", "block_item"],
    ["ascension", "extendedcrafting:enhanced_ender_ingot_block", "block_item"],
    ["ascension", "extendedcrafting:enhanced_redstone_ingot_block", "block_item"],
    ["ascension", "extendedcrafting:elite_catalyst", "item"],
    ["ascension", "extendedcrafting:elite_component", "item"],
    ["ascension", "extendedcrafting:ultimate_catalyst", "item"],
    ["ascension", "extendedcrafting:ultimate_component", "item"],
    ["ascension", "extendedcrafting:the_ultimate_catalyst", "item"],
    ["ascension", "extendedcrafting:the_ultimate_component", "item"],
    ["ascension", "extendedcrafting:crystaltine_ingot", "item"],
    ["ascension", "extendedcrafting:crystaltine_component", "item"],
    ["ascension", "extendedcrafting:crystaltine_catalyst", "item"],
    ["ascension", "extendedcrafting:enhanced_ender_ingot", "item"],
    ["ascension", "extendedcrafting:enhanced_ender_component", "item"],
    ["ascension", "extendedcrafting:enhanced_ender_catalyst", "item"],
    ["ascension", "extendedcrafting:enhanced_redstone_ingot", "item"],
    ["ascension", "extendedcrafting:enhanced_redstone_component", "item"],
    ["ascension", "extendedcrafting:enhanced_redstone_catalyst", "item"],

    // ---- Eternal Steak build (see aoa_eternal_steak_gate.js) ----
    // The steak is infinite food. It used to be a campfire cook away from a
    // 0.2% cow drop, which made the Dark Ages, Medieval, and Renaissance
    // cooking chapters decorative. Its only route is now the Extreme Crafting
    // recipe in kubejs/data/aoa/recipe/eternal_steak.json. The two AoA
    // intermediates are locked with it; both are gate items with no other use.
    // The raw everlasting_beef sits one age earlier, as the Otherworldly
    // Dyson boss reward, and is locked in aoa_astages_01_item_restrictions.js.
    ["ascension", "artifacts:eternal_steak", "item"],
    ["ascension", "aoa:beef_singularity", "item"],
    ["ascension", "aoa:maillard_core", "item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
