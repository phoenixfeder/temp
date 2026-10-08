// AoA KubeJS: aoa_recipes_betterend_templates.js
// Owner-ratified come-back item 8 (2026-08-08 ruling wave, deferred to this
// session): first-copy crafting recipes for all 8 BetterEnd smithing templates
// on the unusualend precedent (aoa_recipes_unusualend_templates.js). Basis is
// BE-4 in docs/audits/reaudit_end_cluster_2026-08-06.md: every jar route to a
// FIRST template is loot (End Village template chest JSON plus the code-layer
// LootTableUtil injection into minecraft:chests/end_city_treasure); the jar's
// copy_* recipes are duplication-only (each consumes an existing template).
// Loot-only production under quest asks (terminite sword/pickaxe at Ren,
// aeternium armor x4 at IR) violates the 2026-07-22 no-loot-only ruling.
// Formula, same as unusualend: each jar duplication recipe binds a template to
// a ring material (#) and a center catalyst (C) in a 3x3 '#S#/#C#/###' with S
// the existing template. The first-copy recipe is that same 3x3 with the S
// slot filled by a second unit of C, yielding 1. Duplication (2 per craft)
// stays the efficient scaling path; chest loot remains a bonus source.
// Containment: these recipe ids and the jar copy_* ids are stage-locked per
// tier in aoa_astages_14_recipe_restrictions.js (owner ruling 2026-08-08).
// All ids and material pairs verified against BetterEnd-21.0.32.jar
// data/betterend/recipe/copy_*.json (this jar replaced the 21.0.31 build the
// 2026-08-05/06 audits hashed; the copy_* pairs are unchanged).
ServerEvents.recipes(event => {
  // ---- Renaissance tier: templates consumed by thallasium/terminite gear ----
  event.shaped('betterend:thallasium_upgrade_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:stick',
    b: 'betterend:thallasium_ingot',
    c: 'betterend:thallasium_ingot'
  }).id('aoa:crafting/betterend_thallasium_upgrade_template_first_copy')

  event.shaped('betterend:terminite_upgrade_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:stick',
    b: 'betterend:terminite_ingot',
    c: 'betterend:terminite_ingot'
  }).id('aoa:crafting/betterend_terminite_upgrade_template_first_copy')

  event.shaped('betterend:handle_attachment_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:stick',
    b: 'minecraft:diamond',
    c: 'minecraft:diamond'
  }).id('aoa:crafting/betterend_handle_attachment_template_first_copy')

  event.shaped('betterend:tool_assembly_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:stick',
    b: 'minecraft:iron_block',
    c: 'minecraft:iron_block'
  }).id('aoa:crafting/betterend_tool_assembly_template_first_copy')

  // ---- Industrial Revolution tier: templates consumed by aeternium gear ----
  // (betterend:netherite_upgrade_smithing_template smiths ONLY the mod's own
  // netherite_hammer, never vanilla netherite upgrades, so no vanilla bypass.)
  event.shaped('betterend:leather_handle_attachment_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:diamond',
    b: 'minecraft:leather',
    c: 'minecraft:leather'
  }).id('aoa:crafting/betterend_leather_handle_attachment_template_first_copy')

  event.shaped('betterend:plate_upgrade_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:diamond',
    b: 'minecraft:iron_ingot',
    c: 'minecraft:iron_ingot'
  }).id('aoa:crafting/betterend_plate_upgrade_template_first_copy')

  event.shaped('betterend:aeternium_upgrade_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:diamond',
    b: 'minecraft:lapis_block',
    c: 'minecraft:lapis_block'
  }).id('aoa:crafting/betterend_aeternium_upgrade_template_first_copy')

  event.shaped('betterend:netherite_upgrade_smithing_template', [
    'aba',
    'aca',
    'aaa'
  ], {
    a: 'minecraft:diamond',
    b: 'minecraft:netherrack',
    c: 'minecraft:netherrack'
  }).id('aoa:crafting/betterend_netherite_upgrade_template_first_copy')
})
