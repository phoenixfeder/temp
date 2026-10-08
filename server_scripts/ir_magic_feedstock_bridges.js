// AoA KubeJS: ir_magic_feedstock_bridges.js
// IR magic-feedstock cross-mod bridges (2026-06-02).
//
// Purpose: make the ir_magic_feedstock_and_spectrum_network domain REAL -- magic
// outputs must feed an Industrial Revolution machine, not just be collected.
// These are remove+replace recipes that KEEP each item's native industrial
// ingredients and ADD a magic feedstock, so the magic route becomes the only
// route (a genuine proof) without bypassing any machine spine.
//
// The third IR magic bridge, the Neo Vitae-fed Oritech foundry, already lives in
// ir_native_capstone_recipes.js and is intentionally NOT duplicated here.
//
// Sanctioned bridges already consumed elsewhere (do NOT reuse as inputs):
//   hallowed_gold_ingot (core5), mercury_catalyst (core5; also gilded_age-locked),
//   component_iron (machine_frame),
//   rs_engineering (Aureal Foundry), soul_stained_steel_ingot (ender_io_soul).
// The feedstocks used here -- #malum:spirits and spectrum:onyx_shard -- are
// fresh, distinctive, and Renaissance-tier (<= IR). No future-age inputs, no
// recipe loops, no boss-proof items, no bulk staples.
//
// Targets are low-volume, vanilla crafting-table items (verified against the live
// jars) and are NOT quested in any other chapter, so remove+replace is conflict-free.

ServerEvents.recipes(event => {
  // --- Spirit-Bound Agitator (Malum -> PneumaticCraft) ---------------------
  // Native recipe: 8x compressed_iron framing a minecraft:ghast_tear core.
  // A bound Malum spirit animates the pneumatic agitator in place of the tear,
  // turning captured spirit-work into an industrial mechanism. Keeps the
  // compressed-iron pressure frame; swaps only the animating core to magic.
  event.remove({ output: 'pneumaticcraft:spawner_agitator' })
  event.shaped('pneumaticcraft:spawner_agitator', [
    'III',
    'ISI',
    'III'
  ], {
    I: '#c:ingots/compressed_iron',
    S: '#malum:spirits'
  }).id('aoa:ir_magic_feedstock/spirit_bound_agitator')

  // --- Resonant Logic Director (Spectrum -> Integrated Dynamics) -----------
  // Native recipe: chorus + menril crystal chunks + diamond. A Spectrum
  // onyx shard takes one menril slot so the logic network is tuned by
  // structured light -- the chapter's "spectrum network" made literal. Keeps
  // chorus/menril/diamond (Integrated Dynamics identity); adds the Spectrum
  // onyx requirement. Do not use resonance_shard: that drop is Hummingstone
  // hymn-only in Atomic-locked Deeper Down and hardlocked IR -> Gilded.
  event.remove({ output: 'integrateddynamics:logic_director' })
  event.shaped(Item.of('integrateddynamics:logic_director', 4), [
    'CMC',
    'CDC',
    'CRC'
  ], {
    C: 'integrateddynamics:crystalized_chorus_chunk',
    M: 'integrateddynamics:crystalized_menril_chunk',
    D: '#c:gems/diamond',
    R: 'spectrum:onyx_shard'
  }).id('aoa:ir_magic_feedstock/resonant_logic_director')
})
