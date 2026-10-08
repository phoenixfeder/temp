// AoA KubeJS: aoa_oil_spine_weaves.js
// Cross-mod oil / petrochem weaves that deepen the unified IR->Gilded oil spine
// (owner = tfmg crude; immersivepetroleum held this role until it was retired from
// the oil spine, and its jar is no longer installed). Each makes one mod's
// intermediate a feed for another mod's machine, so the petrochem mods feel
// integrated rather than parallel.
// ADDITIVE only (no native removals) -> worst case for a schema slip is a logged
// no-op, never a softlock. Companion to ir2_fuel_engine_interchange.js (fuel/crude
// tag unification).
//
// Every recipe below is mirrored field-for-field from a live native recipe of the
// same type (dumped 2026-06-05) and only swaps in the cross-mod feed:
//   W1 <- chemicalscience butane_reformer_ptal.json   (catalytic_reformer_recipe)
//   W5 <- pneumaticcraft gasoline.json                (thermo_plant)
//   W6 <- modern_industrialization diethyl_ether_diesel_boost.json (mixer)
//   MI-bridge <- oritech biodiesel.json               (refinery)
// No fluid/intermediate here carries an AStages item-lock (gating lives on the
// MACHINES, all IR/Gilded), so widening these routes cannot bypass progression.
//
// TFMG LEDGER (2026-07-16 program): after Immersive Petroleum retires from the oil spine,
// the bulk c:naphtha volume that W1/W5 consume is supplied by TFMG (+ MI) refining, not IP.
// TFMG ships tfmg:naphtha inside c:naphtha in-jar (verified 2026-07-17), so W1/W5 keep
// working with no recipe change. This file also carries the Overgeared -> TFMG crankshaft
// forge hook (plan 13 §12) at the END of the recipes block below.

ServerEvents.recipes(event => {

  // ==========================================================================
  // W1 - IP/MI naphtha -> ChemicalScience benzene (catalytic reformer)  [GILDED]
  // ==========================================================================
  // ChemSci's liquid-naphtha cracker is the catalytic_reformer (the steam_cracker
  // is gas-fed). Native rhodium/platinum routes crack a light fraction to an
  // aromatic; this adds a c:naphtha -> benzene route so the naphtha that IP and MI
  // produce in bulk finally has a high-value aromatic sink. Structure mirrors the
  // native butane reformer exactly (tag fluid in, silica catalyst, aromatic out,
  // coke/methane/hydrogen byproducts).
  event.custom({
    type: 'chemicalscience:catalytic_reformer_recipe',
    group: 'chemicalscience',
    fluidinputs: [ { amount: 50, tag: 'c:naphtha' } ],
    iteminputs: [ { count: 1, ingredient: { item: 'chemicalscience:rhodium_silica_catalyst' } } ],
    output: { amount: 25, id: 'chemicalscience:benzene' },
    itembi: [ { chance: 0.05, item: { count: 1, id: 'electrodynamics:coalcoke' } } ],
    fluidbi: [ { amount: 15, chance: 1.0, fluid: 'chemicalscience:toluene' } ],
    gasbi: [ { amount: 5, chance: 1.0, gas: 'electrodynamics:hydrogen', pressure: 1, temp: 293 } ],
    ticks: 120,
    usagepertick: 400.0
  }).id('aoa:oil_spine/naphtha_aromatic_reforming')

  // ==========================================================================
  // W2 - MI heavy_fuel -> IP coker   ===> KILLED (verified) <===
  // ==========================================================================
  // The IP coker is ITEM-fed (item bitumen + hardcoded water -> petcoke item),
  // with no heavy_fuel fluid port, and no other pack machine turns a heavy_fuel
  // FLUID into solid fuel. A "heavy_fuel -> bitumen" pre-step would be backwards.
  // Intentionally not authored.

  // ==========================================================================
  // W5 - naphtha -> PneumaticCraft gasoline (thermo plant)  [eff. GILDED]
  // ==========================================================================
  // The TPP natively makes gasoline from c:kerosene @ 2.0 bar / 573K. This adds a
  // parallel route from c:naphtha (holds IP/MI/Oritech naphtha after the
  // interchange script), so MI's deep-refined naphtha feeds the PNC fuel economy.
  // Structure is the native gasoline.json verbatim with the input tag swapped.
  event.custom({
    type: 'pneumaticcraft:thermo_plant',
    inputs: {
      fluid: { amount: 100, tag: 'c:naphtha' },
      item: []
    },
    outputs: {
      fluid_output: { amount: 80, id: 'pneumaticcraft:gasoline' }
    },
    pressure: 2.0,
    temperature: { min: 573 }
  }).id('aoa:oil_spine/naphtha_to_gasoline_thermo_plant')

  // ==========================================================================
  // W6 - ChemSci benzene -> MI boosted_diesel (mixer)  [GILDED]
  // ==========================================================================
  // MI natively boosts diesel in the MIXER with its own diethyl_ether. This adds a
  // cross-mod route using ChemicalScience benzene as the octane booster in place of
  // diethyl_ether, so ChemSci aromatics feed MI's premium engine fuel. MI fluids are
  // id-pinned (0/409 use a tag), so diesel is the specific modern_industrialization
  // fluid. Mirrors diethyl_ether_diesel_boost.json (mixer; eu/duration/fluid_inputs/
  // fluid_outputs).
  event.custom({
    type: 'modern_industrialization:mixer',
    eu: 12,
    duration: 300,
    fluid_inputs: [
      { fluid: 'modern_industrialization:diesel', amount: 1000 },
      { fluid: 'chemicalscience:benzene', amount: 250 }
    ],
    fluid_outputs: [
      { fluid: 'modern_industrialization:boosted_diesel', amount: 1100 }
    ]
  }).id('aoa:oil_spine/aromatic_boosted_diesel')

  // ==========================================================================
  // MI-BRIDGE - owner crude -> MI crude   ===> LIVES IN SINGLE-SOURCE SCRIPT <===
  // ==========================================================================
  // The owner-crude -> MI-crude conversion now lives in aoa_oil_single_source.js
  // on the MI distillery. The MI oil drilling rig recipe type rejects fluid inputs,
  // so its native from-nothing crude recipe stays removed and the distillery handles
  // MI-side crude intake instead. (Was previously an oritech:refinery bridge.)

  // ==========================================================================
  // OVERGEARED -> TFMG crankshaft forge hook (plan 13 §12, resolves 34 C3 / W-T5)
  // ==========================================================================
  // The TFMG crankshaft is a one-per-engine-bank milestone part, so it earns a single
  // forged joint without taxing bulk commons. Native recipe (VERIFIED-JAR
  // tfmg-1.2.0.jar data/tfmg/recipe/crafting/materials/crankshaft.json): shaped,
  // A=tfmg:rebar, B=#c:plates/aluminum, pattern ABA/BAB (3 rebar + 3 aluminum plates).
  // Re-add under an aoa: id with ONE aluminum-plate slot swapped to overgeared:steel_plate
  // (overgeared forging output, Medieval-legal input into an IR recipe -- legal direction).
  // The rest of the BOM is identical (3 rebar + 2 aluminum plates + 1 steel plate).
  // Guarded on Item.exists so both remove + re-add no-op cleanly without the TFMG /
  // Overgeared jars.
  if (typeof Item !== 'undefined' &&
      Item.exists('tfmg:crankshaft') && Item.exists('tfmg:rebar') &&
      Item.exists('overgeared:steel_plate')) {
    event.remove({ id: 'tfmg:crafting/materials/crankshaft' })
    event.shaped('tfmg:crankshaft', [
      'ABA',
      'CAB',
      '   '
    ], {
      A: 'tfmg:rebar',
      B: '#c:plates/aluminum',
      C: 'overgeared:steel_plate'
    }).id('aoa:weaves/tfmg_crankshaft_forged')
  }

})
