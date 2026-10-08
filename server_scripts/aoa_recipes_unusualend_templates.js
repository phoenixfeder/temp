// AoA KubeJS: aoa_recipes_unusualend_templates.js
// Owner-approved remediation 2026-08-05 (unusualend_template_hostile_verify
// _2026-08-05.md, F1 CONFIRMED-BOUNDED): required ow6 quest 4256010000020006
// asks BOTH unusualend smithing templates, whose first copies are loot-only in
// unusualend-2.3 (jar recipes are duplication-only; 913-class bytecode sweep +
// 577-jar cross-mod scan found no other producer) - and that quest's sole
// dependent is the ascension age-grant quest. Loot-only on a required ask
// violates the 2026-07-22 ruling, so these pack recipes author a deterministic
// first copy in the mod's own idiom: the jar's duplication recipes bind each
// template to a material pair (diamond+ancient_shard / prismalite+pearlescent
// ingot); the first-copy recipe is that same 3x3 with the template slot filled
// by a second unit of the bound material, yielding 1 (duplication, at 2 per
// craft, stays the efficient scaling path). Chest loot remains a bonus source.
// Containment note (corrected 2026-08-08): AStages item locks do NOT block
// crafting (astages_craft_lock_hostile_verify_2026-08-06.md) -- item locks
// alone never contained the craft. Containment is now three-layer: the
// finished pearlescent tools and both templates stay OW item-locked
// (aoa_astages_01_item_restrictions.js, unusualend pearlescent block; the
// template rows sit at the end of that block -- line numbers drift, search
// the ids), the pre-OW loot strip (aoa_astages_09, unusualend End-city block)
// still applies, and -- owner ruling 2026-08-08, come-back item 8 -- both
// first-copy recipe ids below plus the jar's two duplication recipe ids are
// OW recipe-locked in aoa_astages_14_recipe_restrictions.js. The formerly
// open ruling on gating the recipe ids is settled: gated.
// Ids verified against unusualend-2.3.jar recipe JSONs: ancient_shard,
// prismalite_gem, pearlescent_ingot, both template ids.
ServerEvents.recipes(event => {
  event.shaped('unusualend:ancient_armor_trim_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:diamond',
    b: 'unusualend:ancient_shard',
    c: 'unusualend:ancient_shard'
  }).id('aoa:crafting/ancient_trim_template_first_copy')

  event.shaped('unusualend:pearlescent_upgrade_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'unusualend:prismalite_gem',
    b: 'unusualend:pearlescent_ingot',
    c: 'unusualend:pearlescent_ingot'
  }).id('aoa:crafting/pearlescent_template_first_copy')
})
