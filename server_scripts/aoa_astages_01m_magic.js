// AoA KubeJS: aoa_astages_01m_magic.js
// Machine Staging Contract pass (2026-05-28) -- magic cluster apparatus
// (theurgy, occultism, spectrum, malum, actuallyadditions, psi).
//
// Magic apparatus lives at the_renaissance (magic literacy age) with the existing
// magic locks (calcination_oven, spirit_altar, spectrum pedestal/nodes, AA iron_casing/
// basic_coil). occultism is tiered by its summoning books: foliot apparatus -> Renaissance,
// djinni automation -> IR, marid -> OW. psi programmer joins cad_assembler at IR.
// mahoutsukai = spell-circle/conduit flavor, no craftable processing apparatus -> nothing to gate.
// All ages >= recipe ceiling -> no softlock. Ritual reagents/curios/decor left ungated.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages magic] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages magic] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    ["the_renaissance", "theurgy:pyromantic_brazier", "block_item"],
    ["the_renaissance", "theurgy:liquefaction_cauldron", "block_item"],
    ["the_renaissance", "theurgy:distiller", "block_item"],
    ["the_renaissance", "theurgy:fermentation_vat", "block_item"],
    ["the_renaissance", "theurgy:incubator", "block_item"],
    ["the_renaissance", "theurgy:incubator_mercury_vessel", "block_item"],
    ["the_renaissance", "theurgy:incubator_salt_vessel", "block_item"],
    // Re-tiered IR -> Renaissance (2026-07-20): the incubator needs all three vessels;
    // this one follows the incubator quest. Its recipe (c:stones + c:ingots/copper +
    // theurgy:alchemical_sulfurs) is fully Renaissance.
    ["the_renaissance", "theurgy:incubator_sulfur_vessel", "block_item"],
    ["industrial_revolution", "theurgy:caloric_flux_emitter", "block_item"],
    ["industrial_revolution", "theurgy:sulfuric_flux_emitter", "block_item"],
    ["the_renaissance", "theurgy:sal_ammoniac_accumulator", "block_item"],
    ["the_renaissance", "theurgy:sal_ammoniac_tank", "block_item"],
    ["the_renaissance", "theurgy:reformation_source_pedestal", "block_item"],
    ["the_renaissance", "theurgy:reformation_target_pedestal", "block_item"],
    // Re-tiered IR -> Renaissance (2026-07-20): the trio's recipe (c:ingots/gold +
    // theurgy:alchemical_sulfurs + minecraft:blackstone) is fully Renaissance, so the
    // craft lock sits at Ren. The array only RUNS at Gilded (mercury_catalyst, 01:217);
    // the quests deliberately span Ren -> IR -> Gilded.
    ["the_renaissance", "theurgy:reformation_result_pedestal", "block_item"],
    ["the_renaissance", "theurgy:logistics_connector_node", "block_item"],
    ["the_renaissance", "theurgy:logistics_item_extractor", "block_item"],
    ["the_renaissance", "theurgy:logistics_item_inserter", "block_item"],
    ["the_renaissance", "theurgy:logistics_fluid_extractor", "block_item"],
    ["the_renaissance", "theurgy:logistics_fluid_inserter", "block_item"],
    ["the_renaissance", "occultism:storage_controller_base", "block_item"],
    ["industrial_revolution", "occultism:stable_wormhole", "block_item"],
    // Retiered IR -> otherworldly 2026-08-05: the mineshaft/extractor quests
    // moved to ow6 (iesnium relocation), no <=IR quest references them, and the
    // djinni miner pool yields OW/Atomic-tier ores an IR player should not see
    // (occultism_questline_verification_2026-08-05.md F3).
    ["otherworldly", "occultism:dimensional_mineshaft", "block_item"],
    ["otherworldly", "occultism:dimensional_extractor", "block_item"],
    ["industrial_revolution", "occultism:spirit_grindstone", "block_item"],
    ["industrial_revolution", "occultism:storage_controller", "block_item"],
    ["otherworldly", "occultism:iesnium_anvil", "block_item"],
    ["the_renaissance", "spectrum:titration_barrel", "block_item"],
    ["the_renaissance", "spectrum:particle_spawner", "block_item"],
    ["the_renaissance", "spectrum:color_picker", "block_item"],
    ["industrial_revolution", "spectrum:enchanter", "block_item"],
    ["gilded_age", "spectrum:spirit_instiller", "block_item"],
    ["industrial_revolution", "spectrum:cinderhearth", "block_item"],
    ["industrial_revolution", "spectrum:crystal_apothecary", "block_item"],
    ["atomic", "spectrum:crystallarieum", "block_item"],
    ["industrial_revolution", "spectrum:fusion_shrine_basalt", "block_item"],
    ["the_renaissance", "spectrum:fusion_shrine_calcite", "block_item"],
    ["industrial_revolution", "malum:spirit_crucible", "block_item"],
    ["industrial_revolution", "malum:spirit_catalyzer", "block_item"],
    ["gilded_age", "actuallyadditions:advanced_coil", "item"],
    ["gilded_age", "actuallyadditions:atomic_reconstructor", "block_item"],
    ["gilded_age", "actuallyadditions:empowerer", "block_item"],
    ["gilded_age", "actuallyadditions:energizer", "block_item"],
    ["gilded_age", "actuallyadditions:enervator", "block_item"],
    ["gilded_age", "actuallyadditions:crusher", "block_item"],
    ["gilded_age", "actuallyadditions:crusher_double", "block_item"],
    ["gilded_age", "actuallyadditions:powered_furnace", "block_item"],
    ["gilded_age", "actuallyadditions:coal_generator", "block_item"],
    ["gilded_age", "actuallyadditions:oil_generator", "block_item"],
    ["gilded_age", "actuallyadditions:bio_reactor", "block_item"],
    ["gilded_age", "actuallyadditions:leaf_generator", "block_item"],
    ["gilded_age", "actuallyadditions:heat_collector", "block_item"],
    ["gilded_age", "actuallyadditions:lava_factory_controller", "block_item"],
    ["gilded_age", "actuallyadditions:canola_press", "block_item"],
    ["gilded_age", "actuallyadditions:fermenting_barrel", "block_item"],
    ["gilded_age", "actuallyadditions:battery_box", "block_item"],
    ["gilded_age", "actuallyadditions:laser_relay", "block_item"],
    ["gilded_age", "actuallyadditions:laser_relay_advanced", "block_item"],
    ["gilded_age", "actuallyadditions:laser_relay_extreme", "block_item"],
    ["gilded_age", "actuallyadditions:breaker", "block_item"],
    ["gilded_age", "actuallyadditions:placer", "block_item"],
    ["gilded_age", "actuallyadditions:farmer", "block_item"],
    ["gilded_age", "actuallyadditions:vertical_digger", "block_item"],
    ["gilded_age", "actuallyadditions:long_range_breaker", "block_item"],
    ["gilded_age", "actuallyadditions:ranged_collector", "block_item"],
    ["gilded_age", "actuallyadditions:fluid_collector", "block_item"],
    ["gilded_age", "actuallyadditions:item_interface", "block_item"],
    ["gilded_age", "actuallyadditions:hopping_item_interface", "block_item"],
    ["gilded_age", "actuallyadditions:phantom_breaker", "block_item"],
    ["gilded_age", "actuallyadditions:phantom_placer", "block_item"],
    ["gilded_age", "actuallyadditions:phantom_itemface", "block_item"],
    ["gilded_age", "actuallyadditions:phantom_liquiface", "block_item"],
    ["gilded_age", "actuallyadditions:phantom_energyface", "block_item"],
    ["industrial_revolution", "psi:programmer", "block_item"],
    // --- Neo Vitae magic spine (2026-06-26) ---
    // Renaissance entry: altar economy
    ["the_renaissance", "neovitae:ara_vitae", "block_item"],
    // Ritual system pacing re-expressed as stage locks (owner ruling 2026-07-31,
    // replaces the retired crystal_level:2 datamap gating which was Creative-only
    // and killed four rituals). NOTE (corrected 2026-07-31, bytecode-verified):
    // opening the ritual floor at Ren does NOT make raw_spiritus a Ren item. The
    // forsaken_soul ritual is crystal_level 1 = Awakened crystal, whose recipe is
    // altar minTier 4 (hellforged_block capstones, IR), and ritual_stone/MRS
    // ingredients (tabula_robur, tier-2 orb) are IR-locked anyway. Earliest
    // raw_spiritus is Industrial. These Ren entries are inert-but-harmless
    // (nothing leaks early); real pacing stays on activation_cost values.
    ["the_renaissance", "neovitae:master_ritual_stone", "block_item"],
    ["the_renaissance", "neovitae:ritual_stone", "block_item"],
    ["the_renaissance", "neovitae:activation_crystal_weak", "item"],
    ["the_renaissance", "neovitae:ritual_diviner", "item"],
    ["the_renaissance", "neovitae:incense_altar", "block_item"],
    ["the_renaissance", "neovitae:tabula_vitae", "block_item"],
    ["the_renaissance", "neovitae:blood_orb_weak", "item"],
    ["the_renaissance", "neovitae:blood_orb_apprentice", "item"],
    ["the_renaissance", "neovitae:blood_pearl", "item"],
    ["the_renaissance", "neovitae:bloodstone", "block_item"],
    ["the_renaissance", "neovitae:blood_stained_glass", "block_item"],
    ["the_renaissance", "neovitae:blood_tank", "block_item"],
    // Renaissance core station (re-tiered IR -> Renaissance 2026-07-20). The Hellfire
    // Forge is Neo Vitae's busiest production station (98 recipes) and BACK-GATED the
    // Renaissance blood_tank -- a hard softlock under the old Industrial lock. Its
    // recipe (iron + tabula_rasa + vitae_stone) is fully Renaissance. The BASIC Spiritus
    // entry tier (petty/lesser gems: redstone/gold/glass/lapis + diamond) rides with it
    // so the Renaissance NV loop is real. Advanced Spiritus (routing, common+ gems,
    // tabula bridge, hellforged chain, sentient gear, high orbs) stays Industrial+,
    // gated by its own ingredients. Overrides the 2026-07-16 "keep IR" ruling.
    ["the_renaissance", "neovitae:hellfire_forge", "block_item"],
    ["the_renaissance", "neovitae:spiritus_gem_petty", "item"],
    ["the_renaissance", "neovitae:spiritus_gem_lesser", "item"],
    // Industrial: Spiritus routing/automation + common gem
    ["industrial_revolution", "neovitae:vas_maleficum", "block_item"],
    ["industrial_revolution", "neovitae:spira_infernalis", "block_item"],
    ["industrial_revolution", "neovitae:crystallarium_maleficum", "block_item"],
    ["industrial_revolution", "neovitae:spiritus_gem_common", "item"],
    ["industrial_revolution", "neovitae:teleposer", "block_item"],
    ["industrial_revolution", "neovitae:tabula_robur", "item"],
    ["industrial_revolution", "neovitae:tabula_animata", "item"],
    ["industrial_revolution", "neovitae:tabula_spiritus", "item"],
    // Gilded: high orbs, Sentient gear
    ["gilded_age", "neovitae:blood_orb_archmage", "item"],
    // Industrial: Hellforged chain (dungeon-sourced at IR, supports Sentient later)
    ["industrial_revolution", "neovitae:ingot_hellforged", "item"],
    ["industrial_revolution", "neovitae:hellforged_dust", "item"],
    ["industrial_revolution", "neovitae:hellforged_parts", "item"],
    ["industrial_revolution", "neovitae:hellforged_resonator", "item"],
    ["industrial_revolution", "neovitae:hellforged_block", "block_item"],
    // Athanor beat re-tiered Gilded -> Industrial (2026-07-21, owner ruling): the
    // Athanor is mid-mod content (craftable at the magician orb, 3rd of 6 on the NV
    // ladder), not Gilded (Oritech/AE2) tech. The shard it produces rides the Demon
    // Realm (neovitae:dungeon) strong_tau feedstock, already IR-gated in
    // aoa_astages_03. Routes verified IR-legal: athanor_block = iron + tabula_animata
    // (IR) + magician orb + vitae_stone; magician/master orbs build on tier-2/3 altars
    // raised with Renaissance pillars (malum/spectrum, no bloodstone bootstrap);
    // bloodstone_brick = vitae_stone + shard; demonite_trim_ingot = Hellfire Forge
    // (Renaissance) on ingot_hellforged (IR) + weak_blood_shard. Supersedes the
    // 2026-07-17 Athanor ruling and the 2026-07-20 shard/demonite -> Gilded retier.
    ["industrial_revolution", "neovitae:athanor", "block_item"],
    ["industrial_revolution", "neovitae:weak_blood_shard", "item"],
    ["industrial_revolution", "neovitae:bloodstone_brick", "block_item"],
    ["industrial_revolution", "neovitae:blood_orb_magician", "item"],
    ["industrial_revolution", "neovitae:blood_orb_master", "item"],
    ["industrial_revolution", "neovitae:demonite_trim_ingot", "item"],
    ["gilded_age", "neovitae:spiritus_gem_greater", "item"],
    ["gilded_age", "neovitae:spiritus_gem_grand", "item"],
    // Sentient armor down-tiered Gilded -> IR (2026-07-02, J_neovitae_curve fix):
    // jar makes sentient armor from reagent_binding + an iron piece on an Alchemy
    // Array (corrected 2026-07-31: the reagent is Tabula Vitae work at upgradeLevel
    // 3, i.e. a seated Magus orb, which is IR-locked above; no gem in the recipe). These are required IR-chapter nodes (ir_magic_feedstock
    // 49540B100000001B-1E) that the player physically could not complete at IR under
    // the old Gilded lock.
    ["industrial_revolution", "neovitae:sentient_helmet", "item"],
    ["industrial_revolution", "neovitae:sentient_plate", "item"],
    ["industrial_revolution", "neovitae:sentient_leggings", "item"],
    ["industrial_revolution", "neovitae:sentient_boots", "item"],
    // Sentient tools stay Gilded: only OW6 (optional depth) quests them; no IR node does.
    ["gilded_age", "neovitae:sentient_sword", "item"],
    ["gilded_age", "neovitae:sentient_pickaxe", "item"],
    ["gilded_age", "neovitae:sentient_axe", "item"],
    // Atomic: apex orb + explosives + deep reagents
    ["atomic", "neovitae:blood_orb_transcendent", "item"],
    ["atomic", "neovitae:hellforged_explosive_cell", "item"],
    ["atomic", "neovitae:crystal_cluster", "block_item"],
    ["atomic", "neovitae:crystal_cluster_brick", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
