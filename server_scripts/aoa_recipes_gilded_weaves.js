// AoA KubeJS: aoa_recipes_gilded_weaves.js
// Cross-mod recipe weaves for the GILDED AGE (advanced-industry / oceanic-biotech /
// refinery age). Binds already-required Gilded mods through distinctive controllers.
//
// Verified 2026-06-04 against jar lang + live native recipe JSON + AStages
// (.aoa_recipe_audit/locks.json + craft_age.json): every added feedstock resolves to
// age <= gilded_age (NO atomic+ ingredient -- the documented Gilded failure mode);
// one native crafting_shaped route per output => one event.remove({output}) per weave;
// no cycle (each feedstock chain is independent of its output); every output stays
// craftable at Gilded (all are live FTBQ item tasks).
//
// Most native grids are full 3x3, so one duplicated native ingredient is reduced by 1 to
// seat the feedstock; every native key still appears >= 1x (identity preserved).
//
// CONSTRAINT (clause-11 re-cut, 2026-07-26): no weave here may leave its output sole-routed
// through an Immersive Petroleum item -- IP is retired from the oil spine, so the two
// petrochemical weaves below run on TFMG feedstock and are guarded so remove + re-add no-op
// together on any instance without the TFMG jar.

ServerEvents.recipes(event => {
  // --- G1 Biotic Reactor Vessel (enderio -> nautec) -----------------------
  // EnderIO pulsating crystals seed the prismarine bio-reactor's living core, keeping its
  // metabolism "alive" (replacing two of the four polished-prismarine filler blocks).
  event.remove({ output: 'nautec:bio_reactor' })
  event.shaped('nautec:bio_reactor', [
    'CCC',
    'PAP',
    'XLX'
  ], {
    C: 'minecraft:prismarine_crystals',
    P: 'nautec:polished_prismarine',
    A: 'nautec:aquatic_chip',
    L: 'nautec:laser_channeling_coil',
    X: 'enderio:pulsating_crystal'
  }).id('aoa:gilded_weaves/biotic_reactor_vessel')

  // --- G3 Petrochemical Laser Lens (tfmg -> industrialforegoing) ----------
  // CONSTRAINT: ore_laser_base is a hard ancestor of the atomic age grant, so it must stay
  // craftable with the Immersive Petroleum jar ABSENT.
  // TFMG bitumen tars/seals the ore-laser optics housing (replacing one iron ore and one
  // diamond gear) -- the refinery age fuels the mining laser. Feedstock re-cut 2026-07-26
  // from immersivepetroleum:bitumen (a 7% distillation-tower byproduct of a mod retired from
  // the oil spine) to tfmg:bitumen, which has a deterministic route: create:compacting,
  // heat_requirement "heated", 1000 mB tfmg:heavy_oil (VERIFIED-JAR tfmg-1.2.0
  // data/tfmg/recipe/compacting/bitumen.json; tfmg:heavy_oil is the primary 120/340 cut of
  // data/tfmg/recipe/distillation/crude_oil.json). Effective age industrial_revolution (TFMG
  // pumpjack + steel_distillation_controller @ IR, Create press/basin @ medieval_times), so
  // it is legal in this gilded_age chapter. Guarded on Item.exists so the remove and the
  // re-add no-op together and the native IF recipe survives without the TFMG jar.
  if (typeof Item !== 'undefined' && Item.exists('tfmg:bitumen')) {
    event.remove({ output: 'industrialforegoing:ore_laser_base' })
    event.shaped('industrialforegoing:ore_laser_base', [
      'pfp',
      'Zmb',
      'grZ'
    ], {
      p: '#c:plastics',
      f: 'minecraft:diamond_pickaxe',
      b: '#c:ores/iron',
      m: '#industrialforegoing:machine_frame/advanced',
      g: '#c:gears/diamond',
      r: '#c:dusts/redstone',
      Z: 'tfmg:bitumen'
    }).id('aoa:gilded_weaves/petrochemical_laser_lens')
  }

  // --- G4 Predictive Simulation Core (nautec -> hostilenetworks) ----------
  // A NauTec aquatic chip drives the hostile-network prediction core, making the oceanic
  // logic substrate load-bearing across chapters. Native grid had two free cells (no loss).
  event.remove({ output: 'hostilenetworks:sim_chamber' })
  event.shaped('hostilenetworks:sim_chamber', [
    'AP ',
    'EOE',
    'LCL'
  ], {
    P: '#c:glass_panes',
    E: 'minecraft:ender_pearl',
    O: '#c:obsidians',
    L: '#c:gems/lapis',
    C: 'minecraft:comparator',
    A: 'nautec:aquatic_chip'
  }).id('aoa:gilded_weaves/predictive_simulation_core')

  // --- G5 Soul-Charged Slaughter Laser (enderio -> industrialforegoingsouls) ---
  // EnderIO grains of infinity ground the soul-slaughter laser's focus (replacing one
  // plastic and one diamond gear) so the dark beam channels without dissipating.
  event.remove({ output: 'industrialforegoingsouls:soul_laser_base' })
  event.shaped('industrialforegoingsouls:soul_laser_base', [
    'ZBA',
    'CDC',
    'GSZ'
  ], {
    A: '#c:plastics',
    B: 'minecraft:sculk_shrieker',
    C: 'minecraft:iron_bars',
    D: '#industrialforegoing:machine_frame/advanced',
    G: '#c:gears/diamond',
    S: 'minecraft:sculk_catalyst',
    Z: 'enderio:grains_of_infinity'
  }).id('aoa:gilded_weaves/soul_charged_slaughter_laser')

  // --- G7 Strain Mutator Manifold (pneumaticcraft -> nautec) --------------
  // A PneumaticCraft vortex tube regulates the strain-mutator's thermal manifold (replacing
  // one dark-prismarine pillar) -- hot/cold cycling stresses the bacterial strains.
  event.remove({ output: 'nautec:mutator' })
  event.shaped('nautec:mutator', [
    'DCD',
    'PBP',
    'VCD'
  ], {
    D: 'nautec:dark_prismarine_pillar',
    C: 'nautec:bacterial_containment_shield',
    P: 'nautec:petri_dish',
    B: 'nautec:eas_bucket',
    V: 'pneumaticcraft:vortex_tube'
  }).id('aoa:gilded_weaves/strain_mutator_manifold')

  // --- G8 Catalytic Reformer Stack (tfmg -> chemicalscience) --------------
  // CONSTRAINT: catalytic_reformer is a required Gilded ask, so it must stay craftable with
  // the Immersive Petroleum jar ABSENT.
  // TFMG asphalt mixture lines the catalytic reformer's coking stack (replacing one steel
  // plate), unifying the Gilded petrochem mods (TFMG + Electrodynamics + ChemSci) into one
  // refinery. Feedstock re-cut 2026-07-26 from immersivepetroleum:asphalt to
  // tfmg:asphalt_mixture: create:mixing sand + tfmg:bitumen + gravel -> 16, or tfmg:slag +
  // bitumen + gravel -> 32 (VERIFIED-JAR tfmg-1.2.0 data/tfmg/recipe/mixing/
  // asphalt_mixture.json and asphalt_mixture_from_slag.json). The asphalt BLOCK
  // (tfmg:asphalt) ships no crafting recipe -- it is poured from liquid asphalt with the
  // concrete hose -- so asphalt_mixture is the correct item-form substitute. Effective age
  // industrial_revolution, legal in this gilded_age chapter. Guarded on Item.exists so the
  // remove and the re-add no-op together without the TFMG jar.
  if (typeof Item !== 'undefined' && Item.exists('tfmg:asphalt_mixture')) {
    event.remove({ output: 'chemicalscience:catalytic_reformer' })
    event.shaped('chemicalscience:catalytic_reformer', [
      'ZTP',
      'GMG',
      'PCP'
    ], {
      P: '#c:plates/steel',
      T: 'electrodynamics:titaniumheatcoil',
      G: 'electrodynamics:tanksteel',
      M: 'electrodynamics:pressuregauge',
      C: '#c:circuits/advanced',
      Z: 'tfmg:asphalt_mixture'
    }).id('aoa:gilded_weaves/catalytic_reformer_stack')
  }
  // --- G11 Manganese-Aluminum Ingot (chemicalscience -> create) ----------
  // Chemical Science's native Atomic alloyer routes use 9 aluminum ingots plus
  // 1 manganese ingot -> 9 manganese-aluminum ingots. Create 6.0.10's Basin
  // serializer accepts repeated item ingredients, so keep the native 9:1:9
  // economics without depending on the Atomic Electrodynamics alloyer.
  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/aluminum' },
      { tag: 'c:ingots/manganese' }
    ],
    results: [{ count: 9, id: 'chemicalscience:ingot_manganesealuminum' }]
  }).id('aoa:gilded_weaves/manganese_aluminum_ingot')

  // --- G11 Manganese-Aluminum Rod (chemicalscience -> create) ------------
  // Chemical Science's native Atomic Lathe route is 2 manganese-aluminum ingots
  // -> 1 rod plus 2 nuggets. Create's installed Basin serializer accepts up to
  // 64 item inputs, so this conservative Gilded route keeps the 2 -> 1 rod
  // economics while omitting the Lathe-only nugget byproduct. The native Lathe
  // recipe remains untouched as the later parallel route.
  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { tag: 'c:ingots/manganesealuminum' },
      { tag: 'c:ingots/manganesealuminum' }
    ],
    results: [{ count: 1, id: 'chemicalscience:rod_manganesealuminum' }]
  }).id('aoa:gilded_weaves/manganese_aluminum_rod')

  // --- G12 Required Gilded refinery catalyst alternates -------------------
  // The required refinery outputs use molybdenum-sulfur for HDS,
  // silica-alumina for heavy-oil reforming, and platinum/rhodium-silica for
  // the two naphtha reforming outputs. The native ruthenium-sulfur HDS branch
  // is an optional parallel route whose only precursor path is Atomic, so it
  // is intentionally not presented as a Gilded alternate.
  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { item: 'chemicalscience:support_catalyst' },
      { tag: 'c:dusts/molybdenum' },
      { tag: 'c:dusts/sulfur' },
      { tag: 'c:dusts/cobalt' }
    ],
    results: [{ count: 1, id: 'chemicalscience:molybdenum_sulfur_catalyst' }]
  }).id('aoa:gilded_weaves/molybdenum_sulfur_catalyst')

  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { item: 'chemicalscience:support_catalyst' },
      { tag: 'c:dusts/platinum' }
    ],
    results: [{ count: 1, id: 'chemicalscience:platinum_silica_catalyst' }]
  }).id('aoa:gilded_weaves/platinum_silica_catalyst')

  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { item: 'chemicalscience:support_catalyst' },
      { tag: 'c:dusts/rhodium' }
    ],
    results: [{ count: 1, id: 'chemicalscience:rhodium_silica_catalyst' }]
  }).id('aoa:gilded_weaves/rhodium_silica_catalyst')

  event.custom({
    type: 'create:mixing',
    heat_requirement: 'heated',
    ingredients: [
      { item: 'chemicalscience:support_catalyst' },
      { tag: 'c:dusts/silica' },
      { tag: 'c:dusts/alumina' }
    ],
    results: [{ count: 1, id: 'chemicalscience:silica_alumina_catalyst' }]
  }).id('aoa:gilded_weaves/silica_alumina_catalyst')

  // --- G9 Advanced Workbench Logic Bed (oritech -> extendedcrafting) [2026-06-09] ---
  // The Golden Workshop's advanced table seats an Oritech processing unit where the stock
  // recipe used a black iron slate, so the Gilded crafting cap is wired to the Gilded
  // silicon/electronics lane (gilded_oritech_electronics). Single native route verified
  // (data/extendedcrafting/recipe/advanced_table.json); all other ingredients unchanged
  // and <= gilded_age. Quest 4757011000000002 (g1) teaches the seam.
  event.remove({ output: 'extendedcrafting:advanced_table' })
  event.shaped('extendedcrafting:advanced_table', [
    'BAB',
    'CIC',
    'BPB'
  ], {
    B: 'extendedcrafting:advanced_component',
    A: 'extendedcrafting:advanced_catalyst',
    C: 'extendedcrafting:basic_table',
    I: '#c:storage_blocks/gold',
    P: 'oritech:processing_unit'
  }).id('aoa:gilded_weaves/advanced_workbench_logic_bed')

  // --- G10 Etched Aquatic Chip (basic circuits -> nautec) [2026-08-16] ---
  // Owner ruling 4A (docs/audits/gilded_ruling_queue_verification_2026-08-16.md item 4):
  // nautec:damaged_aquatic_chip was loot-only (45% buried-treasure loot modifier), yet it
  // is a required g6 ask (quest 4D5001100000011C) and feeds nautec:aquatic_chip -> the g6
  // NauTec bundle quest plus weaves G1 (bio_reactor) and G4 (sim_chamber). This adds a
  // deterministic fallback WITHOUT touching the loot route: an etching-acid bath corrodes
  // a working basic circuit into the salt-damaged chip -- the same drop-item-into-acid
  // mechanic the chapter already teaches on quest 4D50011000000134 (Etching Tools).
  // Serializer VERIFIED in nautec-1.21.1-NeoForge-0.4.1.jar: NTRecipes registers
  // "item_etching"; runtime consumer NTEvents$Game -> ItemEtching.processItemEtching
  // transforms a dropped ItemEntity sitting in nautec:etching_acid (fixed ~100-tick
  // counter; the JSON duration field is display metadata). JEI category ships
  // (ItemEtchingRecipeCategory). Ingredient codec = IngredientWithCount wrapping vanilla
  // Ingredient.CODEC, so the tag form is legal. #c:circuits/basic has exactly two members
  // pack-wide (electrodynamics:circuitbasic, no stage lock; mekanism:basic_control_circuit,
  // IR-staged at aoa_astages_01_item_restrictions.js:287) -- both legal at gilded_age, the
  // chip's own stage (aoa_astages_01_item_restrictions.js:245). No native recipe exists
  // for the output (full jar recipe sweep: buried treasure is its only jar source), so no
  // event.remove is needed and no existing etching input collides (rusty_crate,
  // rusty_gear, ancient_valve). NauTec is a required Gilded mod, so no Item.exists guard
  // (matches weaves G1/G4/G7).
  event.custom({
    type: 'nautec:item_etching',
    duration: 200,
    ingredient: { tag: 'c:circuits/basic' },
    result: { count: 1, id: 'nautec:damaged_aquatic_chip' }
  }).id('aoa:gilded_weaves/etched_aquatic_chip')
})
