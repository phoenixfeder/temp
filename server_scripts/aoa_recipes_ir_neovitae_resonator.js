// AoA KubeJS: aoa_recipes_ir_neovitae_resonator.js
// Owner ruling 2026-08-16 (IR confirmation campaign, resonator ruling in
// docs/audits/ir_confirmation_campaign_synthesis_2026-08-16.md; evidence in
// docs/audits/ir_confirm_ir_magic_feedstock_and_spectrum_network_hostile_2026-08-16.md
// P1-1): lower the Hellfire Forge minimum-Spiritus floor on the resonator line to
// 1024 so the Industrial Revolution ask can actually be completed.
//
// The defect, verified against neovitae-1.21.1-1.1.9.jar:
//   - data/neovitae/recipe/hellfire_forge/{resonator,primitive_resonator,
//     hellforged_resonator}.json all carry "minDrain": 1200.0.
//   - The hellfire_forge codec binds Codec.DOUBLE.fieldOf("minDrain") to the recipe's
//     minSpiritus field. hasEnoughSpiritus reads the SEATED GEM:
//     getGem().getOrDefault(SPIRITUS_AMOUNT, 0.0) >= minSpiritus, and assemble returns
//     ItemStack.EMPTY below that floor.
//   - data/neovitae/data_maps/item/spiritus_gem_max.json caps gems at
//     petty 64 / lesser 256 / common 1024 / greater 4096 / grand 16384. The Common gem
//     (cap 1024) is the highest tier legal at Industrial Revolution; Greater and Grand
//     are gilded_age (aoa_astages_01m_magic.js).
//   - SpiritusHelper.fillSpiritus clamps a fill to min(amount, max - current), so 1024
//     is a hard ceiling on a Common gem, not a soft one. The only writer of the
//     per-stack SPIRITUS_MAX override is ForgeSpiritusInfusionRecipe.assemble, which
//     copies the gem's own data-map value, so infusing a tool does not raise the cap.
// A 1200 floor was therefore unreachable by every route at IR, while required quest
// 49540B100000001A (ir_magic_feedstock_and_spectrum_network) asks for one Hellforged
// Resonator and the chapter's own prose treats it as the Athanor toolkit.
//
// 1024.0 is exact, not marginal: a full Common gem lands on exactly 1024.0 because
// fillSpiritus computes current + (1024.0 - current), which is exact in IEEE 754 at
// this magnitude, and the check is >=.
//
// Shape follows the pack precedent for NeoVitae remediation
// (aoa_recipes_neovitae_parts.js, owner-approved 2026-07-31) and the existing
// neovitae:hellfire_forge authoring idiom in aoa_goety_weaves.js: remove the jar
// recipe by id, then re-add it with identical type, inputs, drain and output, and only
// minDrain changed. Nothing else about the recipes moves.
//
// All three tiers are patched because all three share the 1200 floor and all three are
// members of #neovitae:athanor_tool/resonator, so the cheapest tier must not stay
// unreachable while the most expensive one becomes craftable. Only
// neovitae:hellforged_resonator is quest-asked today.

ServerEvents.recipes(event => {

  // -- Tier 1: neovitae:resonator ---------------------------------------------
  event.remove({ id: 'neovitae:hellfire_forge/resonator' })
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { tag: 'neovitae:vitae_stone' },
      { tag: 'c:ingots/copper' },
      { item: 'neovitae:raw_crystal_shard' }
    ],
    drain: 100.0,
    minDrain: 1024.0,
    output: { count: 1, id: 'neovitae:resonator' }
  }).id('aoa:neovitae/resonator_common_gem_floor')

  // -- Tier 2: neovitae:primitive_crystalline_resonator ------------------------
  event.remove({ id: 'neovitae:hellfire_forge/primitive_resonator' })
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { tag: 'c:gems/amethyst' },
      { tag: 'c:ingots' },
      { item: 'neovitae:raw_crystal_shard' },
      { item: 'neovitae:tau_oil' }
    ],
    drain: 200.0,
    minDrain: 1024.0,
    output: { count: 1, id: 'neovitae:primitive_crystalline_resonator' }
  }).id('aoa:neovitae/primitive_resonator_common_gem_floor')

  // -- Tier 3: neovitae:hellforged_resonator (the IR quest ask) ----------------
  event.remove({ id: 'neovitae:hellfire_forge/hellforged_resonator' })
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { tag: 'c:gems/amethyst' },
      { tag: 'c:ingots/gold' },
      { item: 'neovitae:raw_crystal_shard' },
      { item: 'neovitae:ingot_hellforged' }
    ],
    drain: 400.0,
    minDrain: 1024.0,
    output: { count: 1, id: 'neovitae:hellforged_resonator' }
  }).id('aoa:neovitae/hellforged_resonator_common_gem_floor')

})
