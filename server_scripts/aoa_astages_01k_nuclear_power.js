// AoA KubeJS: aoa_astages_01k_nuclear_power.js
// Machine Staging Contract pass (2026-05-28) -- nuclear / power / strategic-force cluster
// (createnuclear, nuclearscience, chemicalscience, electrodynamics, powergrid,
//  modularforcefields, ballistix, hostile_neural_industrialization).
//
// Era anchors: reactors / fuel cycle / radiochemistry / force-fields / ballistic
// payloads = Atomic; ballistix thermobaric/antimatter/darkmatter = Otherworldly.
// electrodynamics splits IR (basic c:circuits/basic processing + simple generators)
// / Gilded (c:circuits/advanced crushers/chemistry) / Atomic (elite/ultimate, gated
// by c:circuits/elite|ultimate which are already atomic-locked). chemicalscience
// petrochem column = Gilded (oil-doc precedent, same cracking tier as IP coker).
// powergrid is wholly analog/vintage electric -> IR. voltaic = library (no blocks).
// Ores (file 06), turrets/missiles/grenades/minecarts (file 07), and
// reactor_controller/fissionreactorcore/MFF focusmatrix/electrodynamics circuits
// (file 01) already handled; this is additive.
//
// 2026-08-16 correction, owner ruling RS-IR-2 (docs/audits/
// ir_confirmation_campaign_synthesis_2026-08-16.md, cluster S-1). The line that used
// to stand here -- "All ages >= recipe ceiling -> no softlock" -- was FALSE for the
// electrodynamics triple tier. Three triple recipes require #c:circuits/elite
// (machine_electric_furnace_triple.json, machine_electric_arc_furnace_triple.json,
// machine_mineral_grinder_triple.json, all read from
// electrodynamics-1.21.1-1.0.12.jar), and that tag has exactly two members pack-wide,
// both atomic-locked (aoa_astages_01_item_restrictions.js:1463 plus
// aoa_astages_01p_gap_closure.js:327). Those three blocks were nevertheless staged at
// industrial_revolution here, so their ingredient was hidden from EMI in the very age
// that asked for them. New truth: TRIPLE tier = atomic, matching the elite-circuit
// lock. wiremilltriple moves with them by ruling (its own recipe needs only
// #c:circuits/advanced, but its quest moves to atomic with the lane). The double
// tier and every base machine stay at IR; electrodynamics:compressor also stays at IR
// (machine_compressor.json needs only #c:circuits/basic, pressuregauge, motor,
// #c:plates/stainlesssteel, compressoraddontank, mechanicalvalve -- no elite circuit).
// Note: chemicalscience ships an alternate arcfurnacetriple recipe that hard-codes the
// literal electrodynamics:circuitelite, so the atomic floor holds on both routes.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages nuc] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages nuc] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    ["atomic", "createnuclear:reactor_casing", "block_item"],
    ["atomic", "createnuclear:reactor_core", "block_item"],
    ["atomic", "createnuclear:reactor_cooler", "block_item"],
    ["atomic", "createnuclear:reactor_frame", "block_item"],
    ["atomic", "createnuclear:reactor_input", "block_item"],
    ["atomic", "createnuclear:reactor_output", "block_item"],
    ["atomic", "createnuclear:reinforced_glass", "block_item"],
    ["atomic", "createnuclear:raw_uranium_block", "block_item"],
    ["atomic", "createnuclear:uranium", "block_item"],
    ["atomic", "createnuclear:reactor_blueprint_item", "item"],
    ["atomic", "createnuclear:raw_uranium", "item"],
    ["atomic", "createnuclear:uranium_bucket", "item"],
    ["atomic", "createnuclear:uranium_rod", "item"],
    ["atomic", "createnuclear:yellowcake", "item"],
    ["atomic", "createnuclear:enriched_yellowcake", "item"],
    ["atomic", "nuclearscience:fissioncontrolrod", "block_item"],
    ["atomic", "nuclearscience:fissioninterface", "block_item"],
    ["atomic", "nuclearscience:controlrodmodule", "block_item"],
    ["atomic", "nuclearscience:fusionreactorcore", "block_item"],
    ["atomic", "nuclearscience:fusioninterface", "block_item"],
    ["atomic", "nuclearscience:msreactorcore", "block_item"],
    ["atomic", "nuclearscience:mscontrolrod", "block_item"],
    ["atomic", "nuclearscience:msinterface", "block_item"],
    ["atomic", "nuclearscience:msrfuelpreprocessor", "block_item"],
    ["atomic", "nuclearscience:moltensaltsupplier", "block_item"],
    ["atomic", "nuclearscience:freezeplug", "block_item"],
    ["atomic", "nuclearscience:nuclearboiler", "block_item"],
    ["atomic", "nuclearscience:turbine", "block_item"],
    ["atomic", "nuclearscience:heatexchanger", "block_item"],
    ["atomic", "nuclearscience:steamfunnel", "block_item"],
    ["atomic", "nuclearscience:gascentrifuge", "block_item"],
    ["atomic", "nuclearscience:fuelreprocessor", "block_item"],
    ["atomic", "nuclearscience:chemicalextractor", "block_item"],
    ["atomic", "nuclearscience:radioactiveprocessor", "block_item"],
    ["atomic", "nuclearscience:radioisotopegenerator", "block_item"],
    ["atomic", "nuclearscience:atomicassembler", "block_item"],
    ["atomic", "nuclearscience:particleinjector", "block_item"],
    ["atomic", "nuclearscience:cloudchamber", "block_item"],
    ["atomic", "nuclearscience:falloutscrubber", "block_item"],
    ["atomic", "nuclearscience:electromagnet", "block_item"],
    ["atomic", "nuclearscience:electromagneticbooster", "block_item"],
    ["atomic", "nuclearscience:electromagneticdiode", "block_item"],
    ["atomic", "nuclearscience:electromagneticgateway", "block_item"],
    ["atomic", "nuclearscience:electromagneticswitch", "block_item"],
    ["atomic", "nuclearscience:quantumcapacitor", "block_item"],
    ["atomic", "nuclearscience:logisticscontroller", "block_item"],
    ["atomic", "nuclearscience:supplymodule", "block_item"],
    ["atomic", "nuclearscience:monitormodule", "block_item"],
    ["atomic", "nuclearscience:thermometermodule", "block_item"],
    ["atomic", "nuclearscience:siren", "block_item"],
    ["atomic", "nuclearscience:chunkloader", "block_item"],
    ["atomic", "nuclearscience:teleporter", "block_item"],
    ["atomic", "chemicalscience:chemical_bench_controller", "block_item"],
    ["atomic", "chemicalscience:circuitmaker", "block_item"],
    ["gilded_age", "chemicalscience:catalytic_reformer", "block_item"],
    ["gilded_age", "chemicalscience:fractionating_column", "block_item"],
    ["gilded_age", "chemicalscience:hds_unit", "block_item"],
    ["gilded_age", "chemicalscience:steam_cracker", "block_item"],
    ["gilded_age", "chemicalscience:redox_furnace_controller", "block_item"],
    ["atomic", "chemicalscience:organicsolarpanel", "block_item"],
    ["atomic", "chemicalscience:spincoater", "block_item"],
    ["atomic", "electrodynamics:quarry", "block_item"],
    ["atomic", "electrodynamics:lathe", "block_item"],
    ["atomic", "electrodynamics:energizedalloyer", "block_item"],
    ["atomic", "electrodynamics:reinforcedalloyer", "block_item"],
    ["atomic", "electrodynamics:chemicalcrystallizer", "block_item"],
    ["atomic", "electrodynamics:motorcomplex", "block_item"],
    ["atomic", "electrodynamics:mineralwasher", "block_item"],
    ["atomic", "electrodynamics:electrolosischamber", "block_item"],
    ["atomic", "electrodynamics:chargerhv", "block_item"],
    ["atomic", "electrodynamics:carbynebatterybox", "block_item"],
    // RS-IR-2 (2026-08-16): the triple tier moves IR -> atomic. The first three
    // recipes require #c:circuits/elite, whose only two members are atomic-locked;
    // wiremilltriple needs only #c:circuits/advanced but moves with the lane so the
    // whole triple row lands in the same age as its quests.
    ["atomic", "electrodynamics:electricfurnacetriple", "block_item"],
    ["atomic", "electrodynamics:electricarcfurnacetriple", "block_item"],
    ["atomic", "electrodynamics:mineralgrindertriple", "block_item"],
    ["atomic", "electrodynamics:wiremilltriple", "block_item"],
    ["industrial_revolution", "electrodynamics:electricfurnace", "block_item"],
    ["industrial_revolution", "electrodynamics:electricfurnacedouble", "block_item"],
    ["industrial_revolution", "electrodynamics:electricarcfurnace", "block_item"],
    ["industrial_revolution", "electrodynamics:electricarcfurnacedouble", "block_item"],
    ["industrial_revolution", "electrodynamics:mineralgrinder", "block_item"],
    ["industrial_revolution", "electrodynamics:mineralgrinderdouble", "block_item"],
    ["industrial_revolution", "electrodynamics:wiremill", "block_item"],
    ["industrial_revolution", "electrodynamics:wiremilldouble", "block_item"],
    ["industrial_revolution", "electrodynamics:solarpanel", "block_item"],
    ["industrial_revolution", "electrodynamics:advancedsolarpanel", "block_item"],
    ["industrial_revolution", "electrodynamics:thermoelectricgenerator", "block_item"],
    ["industrial_revolution", "electrodynamics:hydroelectricgenerator", "block_item"],
    ["industrial_revolution", "electrodynamics:windmill", "block_item"],
    ["industrial_revolution", "electrodynamics:coalgenerator", "block_item"],
    ["industrial_revolution", "electrodynamics:combustionchamber", "block_item"],
    ["industrial_revolution", "electrodynamics:compressor", "block_item"],
    ["industrial_revolution", "electrodynamics:decompressor", "block_item"],
    ["industrial_revolution", "electrodynamics:upgradetransformer", "block_item"],
    ["industrial_revolution", "electrodynamics:downgradetransformer", "block_item"],
    ["industrial_revolution", "electrodynamics:advancedupgradetransformer", "block_item"],
    ["industrial_revolution", "electrodynamics:advanceddowngradetransformer", "block_item"],
    ["industrial_revolution", "electrodynamics:thermoelectricmanipulator", "block_item"],
    ["industrial_revolution", "electrodynamics:logisticalmanager", "block_item"],
    ["industrial_revolution", "electrodynamics:fermentationplant", "block_item"],
    ["industrial_revolution", "electrodynamics:batterybox", "block_item"],
    ["industrial_revolution", "electrodynamics:lithiumbatterybox", "block_item"],
    ["gilded_age", "electrodynamics:mineralcrusher", "block_item"],
    ["gilded_age", "electrodynamics:mineralcrusherdouble", "block_item"],
    ["gilded_age", "electrodynamics:mineralcrushertriple", "block_item"],
    ["gilded_age", "electrodynamics:chemicalmixer", "block_item"],
    ["gilded_age", "electrodynamics:chemicalreactor", "block_item"],
    ["gilded_age", "electrodynamics:electrolyticseparator", "block_item"],
    ["gilded_age", "electrodynamics:advancedcompressor", "block_item"],
    ["gilded_age", "electrodynamics:advanceddecompressor", "block_item"],
    ["gilded_age", "electrodynamics:advancedthermoelectricmanipulator", "block_item"],
    ["gilded_age", "electrodynamics:oxidationfurnace", "block_item"],
    ["gilded_age", "electrodynamics:chargerlv", "block_item"],
    ["gilded_age", "electrodynamics:chargermv", "block_item"],
    ["atomic", "modularforcefields:biometricidentifier", "block_item"],
    ["atomic", "modularforcefields:fortroncapacitor", "block_item"],
    ["atomic", "modularforcefields:interdictionmatrix", "block_item"],
    ["atomic", "ballistix:obsidian", "block_item"],
    ["atomic", "ballistix:anvil", "block_item"],
    ["atomic", "ballistix:attractive", "block_item"],
    ["atomic", "ballistix:repulsive", "block_item"],
    ["atomic", "ballistix:condensive", "block_item"],
    ["atomic", "ballistix:breaching", "block_item"],
    ["atomic", "ballistix:shrapnel", "block_item"],
    ["atomic", "ballistix:fragmentation", "block_item"],
    ["atomic", "ballistix:incendiary", "block_item"],
    ["atomic", "ballistix:chemical", "block_item"],
    ["atomic", "ballistix:debilitation", "block_item"],
    ["atomic", "ballistix:contagious", "block_item"],
    ["atomic", "ballistix:infestive", "block_item"],
    ["atomic", "ballistix:rejuvination", "block_item"],
    ["atomic", "ballistix:endothermic", "block_item"],
    ["atomic", "ballistix:exothermic", "block_item"],
    ["atomic", "ballistix:emp", "block_item"],
    ["atomic", "ballistix:sonic", "block_item"],
    ["atomic", "ballistix:hypersonic", "block_item"],
    ["atomic", "ballistix:ender", "block_item"],
    ["atomic", "ballistix:antigravity", "block_item"],
    ["atomic", "ballistix:nuclear", "block_item"],
    ["atomic", "ballistix:launcherplatformtier1", "block_item"],
    ["atomic", "ballistix:launcherplatformtier2", "block_item"],
    ["atomic", "ballistix:launcherplatformtier3", "block_item"],
    ["atomic", "ballistix:launchercontrolpaneltier1", "block_item"],
    ["atomic", "ballistix:launchercontrolpaneltier2", "block_item"],
    ["atomic", "ballistix:launchercontrolpaneltier3", "block_item"],
    ["atomic", "ballistix:launchersupportframetier1", "block_item"],
    ["atomic", "ballistix:launchersupportframetier2", "block_item"],
    ["atomic", "ballistix:launchersupportframetier3", "block_item"],
    ["atomic", "ballistix:vls", "block_item"],
    ["atomic", "ballistix:radargun", "item"],
    ["atomic", "ballistix:radar", "block_item"],
    ["atomic", "ballistix:firecontrolradar", "block_item"],
    ["atomic", "ballistix:esmtower", "block_item"],
    ["atomic", "ballistix:proximitydetector", "block_item"],
    ["atomic", "ballistix:airraidsiren", "block_item"],
    ["atomic", "ballistix:thermobaric", "block_item"],
    ["otherworldly", "ballistix:antimatter", "block_item"],
    ["otherworldly", "ballistix:largeantimatter", "block_item"],
    ["otherworldly", "ballistix:darkmatter", "block_item"],
    ["industrial_revolution", "powergrid:generator_housing", "block_item"],
    ["industrial_revolution", "powergrid:vertical_generator_housing", "block_item"],
    ["industrial_revolution", "powergrid:generator_induction_rotor", "block_item"],
    ["industrial_revolution", "powergrid:generator_commutator", "block_item"],
    ["industrial_revolution", "powergrid:generator_vertical_commutator", "block_item"],
    ["industrial_revolution", "powergrid:generator_clutch", "block_item"],
    ["industrial_revolution", "powergrid:constant_speed_motor", "block_item"],
    ["industrial_revolution", "powergrid:circuit_design_table", "block_item"],
    ["industrial_revolution", "powergrid:punch_card_reader", "block_item"],
    ["industrial_revolution", "powergrid:crt", "block_item"],
    ["industrial_revolution", "powergrid:carbon_pile", "block_item"],
    ["industrial_revolution", "powergrid:carbon_pile_coil", "block_item"],
    ["industrial_revolution", "powergrid:basin_heater", "block_item"],
    ["industrial_revolution", "powergrid:battery", "block_item"],
    ["industrial_revolution", "powergrid:transformer_small", "block_item"],
    ["industrial_revolution", "powergrid:transformer_medium", "block_item"],
    ["industrial_revolution", "powergrid:contactor", "block_item"],
    ["industrial_revolution", "powergrid:variac", "block_item"],
    ["industrial_revolution", "powergrid:rheostat", "block_item"],
    ["atomic", "hostile_neural_industrialization:prediction_machine_casing", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
