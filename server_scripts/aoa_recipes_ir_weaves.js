// AoA KubeJS: aoa_recipes_ir_weaves.js
// Cross-mod recipe weaves for the INDUSTRIAL REVOLUTION (first-factory age).
// Routes magic/logic feedstock through early-tech machines so already-required IR mods
// feel interdependent. Companion to ir_magic_feedstock_bridges.js -- does NOT duplicate
// its targets (spawner_agitator, logic_director) or reuse its reserved feedstocks
// (#malum:spirits, spectrum:onyx_shard, hallowed_gold, mercury).
//
// Verified 2026-06-04 against jar lang + live native recipe JSON + AStages
// (.aoa_recipe_audit/locks.json + craft_age.json): every added feedstock resolves to
// age <= industrial_revolution; one native crafting_shaped route per output =>
// one event.remove({output}) per weave; every output stays craftable at IR.
//
ServerEvents.recipes(event => {
  // --- I1 Photolithography Exposure (spectrum -> pneumaticcraft) -----------
  // The UV light box exposes PCB blueprints; a Spectrum neolith tile supplies the
  // structured-light emitter in place of one of the three redstone lamps -- Spectrum's
  // "network of light" literally driving the digital-logistics PCB pipeline.
  event.remove({ output: 'pneumaticcraft:uv_light_box' })
  event.shaped('pneumaticcraft:uv_light_box', [
    'LNL',
    'IBT',
    'III'
  ], {
    L: 'minecraft:redstone_lamp',
    N: 'spectrum:neolith',
    I: '#c:ingots/compressed_iron',
    B: 'pneumaticcraft:pcb_blueprint',
    T: 'pneumaticcraft:pressure_tube'
  }).id('aoa:ir_weaves/photolithography_exposure')

  // --- I2 Survey Rig Logic Core (integrateddynamics -> immersiveengineering) ---
  // The sample drill reads underground ore veins; an Integrated Dynamics menril torch
  // crowns it as the survey/logic beacon, replacing the lower guard fence (grid is full).
  event.remove({ output: 'immersiveengineering:sample_drill' })
  event.shaped('immersiveengineering:sample_drill', [
    'sfs',
    'sfs',
    'eTe'
  ], {
    s: 'immersiveengineering:steel_scaffolding_standard',
    f: 'immersiveengineering:steel_fence',
    e: 'immersiveengineering:light_engineering',
    T: 'integrateddynamics:menril_torch'
  }).id('aoa:ir_weaves/survey_rig_logic_core')

  // --- I5 Resonant Materializer (spectrum -> integrateddynamics) -----------
  // The materializer turns logic variables into matter; a Spectrum neolith core re-grounds
  // the projection in structured light instead of redstone. Forms a matched pair with the
  // shipped Resonant Logic Director (ir_magic_feedstock_bridges.js).
  event.remove({ output: 'integrateddynamics:materializer' })
  event.shaped('integrateddynamics:materializer', [
    'CVC',
    'CVC',
    'CNC'
  ], {
    C: 'integrateddynamics:crystalized_menril_chunk',
    V: 'integrateddynamics:variable',
    N: 'spectrum:neolith'
  }).id('aoa:ir_weaves/resonant_materializer')

  // --- I9 Alchemical Etching Bath (theurgy -> pneumaticcraft) --------------
  // The etching tank dissolves PCB material in acid; a Theurgy sal-ammoniac crystal (a real
  // alchemical solvent salt) seeds the bath, displacing one obsidian shoulder. The native
  // small_tank is matched by plain item id (intentionally more lenient than the native
  // strict-empty-component matcher -- never a softlock, never a bypass).
  event.remove({ output: 'pneumaticcraft:etching_tank' })
  event.shaped('pneumaticcraft:etching_tank', [
    'XGO',
    'WTW',
    'SSS'
  ], {
    X: 'theurgy:sal_ammoniac_crystal',
    G: '#c:glass_panes',
    O: '#c:obsidians',
    W: 'pneumaticcraft:reinforced_brick_wall',
    T: 'pneumaticcraft:small_tank',
    S: 'pneumaticcraft:reinforced_brick_slab'
  }).id('aoa:ir_weaves/alchemical_etching_bath')

  // --- I11 Bound-Spirit Squeezer (malum -> integrateddynamics) -------------
  // Crushed Malum soulstone is bound beside the diamond head, lending spirit-pressure to
  // the mechanical squeeze. Keeps battery/squeezer/diamond/obsidian; soulstone seats in a
  // native empty cell.
  event.remove({ output: 'integrateddynamics:mechanical_squeezer' })
  event.shaped('integrateddynamics:mechanical_squeezer', [
    'CD ',
    'BSB',
    ' O '
  ], {
    C: 'malum:crushed_soulstone',
    D: '#c:gems/diamond',
    B: 'integrateddynamics:energy_battery',
    S: 'integrateddynamics:squeezer',
    O: '#c:obsidians'
  }).id('aoa:ir_weaves/bound_spirit_squeezer')
})
