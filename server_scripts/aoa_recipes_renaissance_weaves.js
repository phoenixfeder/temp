// AoA KubeJS: aoa_recipes_renaissance_weaves.js
// Cross-mod recipe weaves for THE RENAISSANCE (the magic + dimensional-threshold age).
// Each weave rewrites a distinctive, low-volume output to ADD a cross-mod magic/dimension
// feedstock while preserving the output's native identity, so already-required Renaissance
// mods feel woven together instead of collected side-by-side.
//
// Verified 2026-06-04 against installed jar lang (item existence) + the live native recipe
// JSON (pattern/keys), and AStages via .aoa_recipe_audit/locks.json + craft_age.json:
//   * every added feedstock resolves to age <= the_renaissance,
//   * no cycle (no Theurgy feedstock feeds a Theurgy-machine output),
//   * each output has exactly ONE native crafting_shaped route, so a single
//     event.remove({output}) fully gates the weave with no bypass,
//   * every output stays craftable at Renaissance (all are live FTBQ item tasks).

ServerEvents.recipes(event => {
  // --- R2 Sculk-Bone Resonator (eternal_starlight -> deeperdarker) ---------
  // The sonorous staff channels sound through the dark; an Eternal Starlight thioquartz
  // shard tunes the sculk-bone resonance, linking the two Renaissance "resonance" dimensions.
  // Thioquartz seats in a native empty cell -- full Deeper Dark identity kept.
  event.remove({ output: 'deeperdarker:sonorous_staff' })
  event.shaped('deeperdarker:sonorous_staff', [
    ' CH',
    ' BC',
    'BT '
  ], {
    B: 'deeperdarker:sculk_bone',
    C: 'deeperdarker:soul_crystal',
    H: 'deeperdarker:heart_of_the_deep',
    T: 'eternal_starlight:thioquartz_shard'
  }).id('aoa:ren_weaves/sculk_bone_resonator')

  // --- R5 Soulstone Reformation (malum -> theurgy) ------------------------
  // The reformation pedestal re-bodies dispersed alchemical sulfur into matter; a Malum
  // refined soulstone is the anchor it binds the soul to. Keeps the sulfur/iron/blackstone
  // identity (the center iron becomes the soulstone core).
  event.remove({ output: 'theurgy:reformation_source_pedestal' })
  event.shaped('theurgy:reformation_source_pedestal', [
    'sSs',
    'iMi',
    'sss'
  ], {
    S: '#theurgy:alchemical_sulfurs',
    i: '#c:ingots/iron',
    s: 'minecraft:blackstone',
    M: 'malum:refined_soulstone'
  }).id('aoa:ren_weaves/soulstone_reformation')

  // --- R8 Gem dust bootstrap (Apotheosis gating program, 2026-08-02) -------
  // gem_dust's only jar sources are salvaging recipes, but the salvaging table
  // and gem cutting table both COST gem dust to craft; the pack previously
  // broke that loop with a random Ren loot-table roll. Deterministic first
  // source: crush any affix gem (mob drops from haven tier onward).
  event.shapeless('apotheosis:gem_dust', ['apotheosis:gem', 'minecraft:flint'])
    .id('aoa:ren_weaves/gem_dust_bootstrap')
})

// --- R7 Theurgy reaches the Aether (tag bridge, 2026-06-09) ----------------
// Theurgy ships skyroot/blueberry Alchemical Sulfur liquefaction recipes gated on
// `neoforge:not(tag_empty)` for c:logs/skyroot and c:crops/blueberry. Nothing in the
// pack fills either tag, so both recipes silently never load and the two optional
// ren_aether_literacy sulfur quests were uncompletable. Bridge the Aether items in.
ServerEvents.tags('item', event => {
  event.add('c:logs/skyroot', '#aether:skyroot_logs')
  event.add('c:crops/blueberry', 'aether:blue_berry')
  event.add('c:logs/lunar', '#eternal_starlight:lunar_logs')
  // c:logs/echo was empty pack-wide, so Theurgy's echo-sulfur liquefaction never
  // loaded (2026-08-02 prose audit). Echo trees generate only in the Otherside,
  // so the echo sulfur quest lives in ir_deeper_darker_otherside, not Ren.
  event.add('c:logs/echo', '#deeperdarker:echo_logs')
})
