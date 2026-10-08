// AoA KubeJS: aoa_oil_single_source.js
// SINGLE OIL SOURCE: crude oil is extracted ONLY by the TFMG pumpjack / oil-well spine.
// TFMG (Create: The Factory Must Grow) is the SOLE owner of crude going forward. Every
// other mod's oil "spawning" is removed or converted to consume TFMG crude, and the two
// legacy pumpjack mods (Create Diesel Generators, Immersive Petroleum) are RETIRED from
// the spine: their producer recipes are removed here (quest-graph-first retirement), and
// already-formed rigs are grandfathered until the owner pulls the jars.
// 2026-08-25: the owner pulled the CDG jar (IP was already absent); dead CDG refs in this
// file -- the pumpjack/oil-scanner producer-recipe removals below -- were stripped.
//
// Owner / entry: tfmg oil_deposit/oil_well worldgen -> tfmg pumpjack (IR). TFMG feeds the
// shared c:crude_oil tag (see ir2_fuel_engine_interchange.js), so every downstream
// refinery (MI, Oritech, PneumaticCraft, ChemicalScience, IE) runs off TFMG crude.
//
// GUARD: everything past the ChemicalScience ore removals is gated on the TFMG jar
// (Platform.isLoaded). On any instance where TFMG is not yet installed the file degrades
// to those two removals -- a safe near-no-op that leaves the legacy oil spine intact until
// TFMG is present to replace it. (Per plan 13 §10 the scripts and the TFMG jar ship in the
// SAME build, so in practice this guard is always satisfied where the retirement runs.)
//
// Lockdown ledger (verified 2026-07-17; nothing removed here is a live quest task):
//   * ChemicalScience oil-ore worldgen .... cancelled in aoa_remove_passive_oil.json (biome modifier)
//   * ChemicalScience crude-from-ore ....... removed below (2 Electrodynamics recipes; unconditional)
//   * Modern Industrialization rig ......... was a from-NOTHING crude producer; converted to a
//                                            crude/heavy PROCESSOR that consumes TFMG crude below
//   * Oritech oil-spring worldgen .......... cancelled in the biome modifier; still_oil now from
//                                            TFMG crude (conversion below)
//   * PneumaticCraft oil lakes ............. already off (its config blacklists overworld/nether/end)
//   * Ad Astra ocean oil_well ............. CANCELLED 2026-08-30 in
//                                            kubejs/data/ad_astra/tags/worldgen/biome/has_structure/oil_well.json
//                                            (empty biome set). Ad Astra places it in OVERWORLD oceans, not in
//                                            space, so it was a passive IR-age crude source. Rocket fuel is
//                                            unaffected: the Fuel Refinery reads the ad_astra:oil tag, which
//                                            includes #c:crude_oil, and tfmg:crude_oil is in that tag.
//   * Create Diesel Generators pumpjack .... RETIRED: kinetic-pumpjack + oil-scanner producer
//                                            recipes were removed here until the jar was
//                                            pulled 2026-08-25; formed rigs grandfathered
//   * Immersive Petroleum seismic/derrick .. RETIRED: seismic locator recipe removed with NO
//                                            replacement (reservoir tier unreachable going forward);
//                                            IP crude worldgen off; derrick/pumpjack are IE-style
//                                            in-world multiblocks with NO datapack crafting recipe
//                                            in-jar (verified 2026-07-17), so nothing to remove for
//                                            them -- formed rigs grandfathered until jar removal
//   * TFMG oil_deposit/oil_well ............ the ONLY crude source. TFMG places its wells via
//                                            create:config_filter worldgen -- the Create config
//                                            must not disable it (smoke S1).

ServerEvents.recipes(event => {

  // --- ChemicalScience: no crude from its oil ore (UNCONDITIONAL) ------------
  // The oil ore no longer generates (biome modifier); also remove the two recipes that
  // wash/mix c:ores/oil into chemicalscience:crudeoil. ChemSci refineries still run off
  // the shared c:crude_oil tag, so the mod stays fully usable on TFMG crude. (These
  // predate the TFMG program and remove from-nothing oil regardless of owner, so they run
  // unconditionally.)
  event.remove({ id: 'chemicalscience:fluiditem2fluid/chemical_mixer/crudeoil' })
  event.remove({ id: 'chemicalscience:fluiditem2fluid/mineral_washer/crudeoil' })

  // Everything below establishes TFMG as the sole crude owner and retires the legacy
  // pumpjack mods. Gate on the TFMG jar so the file is a safe near-no-op without it.
  if (typeof Platform === 'undefined' || !Platform.isLoaded('tfmg')) return

  // --- Modern Industrialization: rig PRODUCER -> distillery INTAKE -----------
  // Native rig made 500 mB crude from an aluminum_drill + EU (oil from nothing). Remove it
  // and route TFMG crude through MI's fluid-capable distillery to output MI's crude form.
  // The oil_drilling_rig recipe type rejects fluid inputs at datapack parse time, so the
  // distillery is the smallest valid MI-side bridge that keeps the rig from spawning oil.
  event.remove({ id: 'modern_industrialization:oil/crude_oil' })
  event.custom({
    type: 'modern_industrialization:distillery',
    eu: 8,
    duration: 200,
    fluid_inputs: [
      { fluid: 'tfmg:crude_oil', amount: 500 }
    ],
    fluid_outputs: [
      { fluid: 'modern_industrialization:crude_oil', amount: 500 }
    ]
  }).id('aoa:oil_single_source/mi_distills_tfmg_crude')

  // Second MI intake (W-T3): TFMG heavy_oil -> MI heavy_fuel, so MI's Gilded chemistry
  // starts from the TFMG feedstock. Both fluid ids VERIFIED-JAR 2026-07-17
  // (tfmg:heavy_oil in tfmg c:tags/fluid/heavy_oil.json; modern_industrialization:heavy_fuel
  // in MI c:tags/fluid/heavy_fuel.json).
  event.custom({
    type: 'modern_industrialization:distillery',
    eu: 8,
    duration: 200,
    fluid_inputs: [
      { fluid: 'tfmg:heavy_oil', amount: 500 }
    ],
    fluid_outputs: [
      { fluid: 'modern_industrialization:heavy_fuel', amount: 500 }
    ]
  }).id('aoa:oil_single_source/mi_heavy_fuel_from_tfmg_heavy_oil')

  // --- Oritech: still_oil from TFMG crude (spring removed) -------------------
  // oritech:still_oil only ever came from the oil_spring (now cancelled) and feeds two
  // recipes (liquid_fuel, turbofuel). Route it off TFMG crude so they keep working.
  event.custom({
    type: 'oritech:refinery',
    fluidInput: { amount: 100, fluid: 'tfmg:crude_oil' },
    fluidOutputs: [ { amount: 100, fluid: 'oritech:still_oil' } ],
    ingredients: [ { item: 'oritech:clay_catalyst_beads' } ],
    results: [],
    time: 80
  }).id('aoa:oil_single_source/tfmg_crude_to_oritech_still_oil')

  // --- RETIREMENT: legacy survey locator (NO replacement) --------------------
  // 2026-08-25: both legacy petroleum jars are now pulled from mods/, so the former
  // event.remove for the IP survey locator became a dead no-op and was deleted; see git
  // history. The loss stands: the reservoir tier stays unreachable going forward, and
  // already-placed hardware remains grandfathered until broken.

  // --- RETIREMENT: Create Diesel Generators kinetic pumpjack -----------------
  // Remove the producer recipes so the CDG kinetic pumpjack + oil scanner can no longer be
  // built new. (One pumpjack-bearing variant ships no crafting recipe/model in
  // CDG 1.3.14 -- guarded with Item.exists so the removal is a no-op if the item is not
  // registered, per the plan's remove list.) Formed rigs grandfathered.
  // 2026-08-25: CDG jar pulled from mods/ -- the event.remove calls for pumpjack_bearing,
  // pumpjack_bearing_b, pumpjack_head, pumpjack_hole and oil_scanner were deleted as dead
  // refs; see git history for the removed block.

})
