// AoA KubeJS: aoa_recipes_capstone_convergence.js
// "Convergence capstones": a chapter's signature required machine is re-authored so
// its recipe pulls one DISTINCTIVE part from each major mod in that chapter -- the
// chapter's mods literally converge into one object, so every mod feels load-bearing.
// (Generalizes the 2-mod weaves + ir_native_capstone_recipes.js to the whole chapter.)
//
// Only applied where the red-team confirmed it fits WITHOUT grind/softlock:
//   * output has exactly ONE native crafting_shaped route (clean remove),
//   * 4-6 DISTINCTIVE parts (no bare staples), every part age <= the chapter's age,
//   * no cycle (no part's craft chain needs the output),
//   * the output is a real required quest item that stays craftable.
// Chapters that are single-mod-dominant, boss/dimension capstones, or whose parts
// are atomic+/machine-only were intentionally SKIPPED (see docs).
//
// Verified 2026-06-05 vs jar lang (existence), .aoa_recipe_audit/locks.json +
// craft_age.json (ages), and native-recipe dumps (single route).
//
// CONSTRAINT (clause-11 re-cut, 2026-07-26): no convergence here may leave its output
// sole-routed through a retired-jar item -- the petrochemical slot below runs on TFMG
// feedstock (crude owner since 2026-07-16) and stays guarded so remove + re-add no-op
// together on any instance without the TFMG jar. 2026-08-25: the second, CDG-output
// convergence (C2) was RETIRED entirely when that jar was pulled -- see below.

ServerEvents.recipes(event => {

  // --- C1  ir_power_motion_and_grid -> Power-Grid Convergence  [IR] ----------
  // powergrid:circuit_design_table is the power chapter's design gateway. Re-author
  // it as the convergence of every IR power mod: Create C&A tesla coil, Create
  // Electro Energetics alternator rotor, Electrodynamics combustion chamber, Oritech generator,
  // IE LV capacitor -- around the native Create electron tube + schematic identity.
  // (All parts age <= 3.)
  event.remove({ output: 'powergrid:circuit_design_table' })
  event.shaped('powergrid:circuit_design_table', [
    'TES',
    'AOB',
    'GPP'
  ], {
    T: 'createaddition:tesla_coil',
    E: 'create:electron_tube',
    S: 'create:empty_schematic',
    A: 'electroenergetics:alternator_rotor',
    O: 'oritech:basic_generator_block',
    B: 'electrodynamics:combustionchamber',
    G: 'immersiveengineering:capacitor_lv',
    P: '#minecraft:planks'
  }).id('aoa:capstone_convergence/power_grid')

  // --- C2  ir_create_industrial_addons -> Diesel-Refinery Convergence [RETIRED] --
  // RETIRED 2026-08-25 (R-A2 op 4 executed): this weave's OUTPUT was the CDG
  // distillation-controller brain, so pulling that jar made the guarded remove+re-add
  // permanently dead -- the Item.exists test on that output can never pass again. One
  // INPUT part was another pulled jar's vein-finder, i.e. capability-class vein-mining
  // affordance the owner removed deliberately: NO substitute weave was designed and the
  // loss is accepted. The pre-existing layered-magnet age inversion dies with the block.
  // See git history for the guard + shaped recipe ('aoa:capstone_convergence/diesel_refinery').

  // --- C4  g5_empire_of_iron -> Heavy-Industry Convergence  [GILDED] ---------
  // CONSTRAINT: centrifuge is a required Gilded ask, so it must stay craftable without
  // any legacy-petroleum jar present.
  // modern_industrialization:centrifuge is the Empire of Iron chapter's signature
  // machine. Convergence of Gilded heavy industry: Actually Additions advanced coil,
  // BlastCraft blast compressor, Industrialization Overdrive pyrolyse oven, Immersive
  // Engineering heavy engineering, TFMG asphalt mixture -- around the native MI machine
  // hull + motor identity. (All parts age <= 4; no atomic+ ingredient.)
  // Feedstock re-cut 2026-07-26 off the retired IP asphalt onto tfmg:asphalt_mixture
  // (VERIFIED-JAR tfmg-1.2.0 data/tfmg/recipe/mixing/asphalt_mixture.json: create:mixing
  // sand + tfmg:bitumen + gravel -> 16; slag variant -> 32). Effective age
  // industrial_revolution, legal in this gilded_age chapter. Guarded on Item.exists so the
  // remove and the re-add no-op together without the TFMG jar.
  if (typeof Item !== 'undefined' && Item.exists('tfmg:asphalt_mixture')) {
    event.remove({ output: 'modern_industrialization:centrifuge' })
    event.shaped('modern_industrialization:centrifuge', [
      'ABP',
      'EHS',
      'LHL'
    ], {
      A: 'actuallyadditions:advanced_coil',
      B: 'blastcraft:blastcompressor',
      P: 'industrialization_overdrive:pyrolyse_oven',
      E: 'immersiveengineering:heavy_engineering',
      H: 'modern_industrialization:basic_machine_hull',
      S: 'tfmg:asphalt_mixture',
      L: 'modern_industrialization:large_motor'
    }).id('aoa:capstone_convergence/heavy_industry')
  }

})
