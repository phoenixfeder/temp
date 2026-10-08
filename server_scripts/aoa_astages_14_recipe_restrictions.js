// AoA KubeJS: aoa_astages_14_recipe_restrictions.js
// Per-recipe stage locks. Owner ruling 2026-08-08 (come-back item 8): the
// smithing-template recipes of unusualend and betterend are stage-locked to
// their chapter's age. This settles the UE-1 craft-leak finding
// (docs/audits/reaudit_end_cluster_2026-08-06.md): AoA item locks never block
// crafting (astages_craft_lock_hostile_verify_2026-08-06.md -- no craft
// attribute on item restrictions), so acquisition containment for craftable
// templates has to live on the RECIPE surface. AStages enforces recipe
// restrictions through seven RECIPE_INSTANCE mixins (ACraftingMenu,
// ACrafterMenu, ACrafterBlock, ASmithingMenu, AStonecutterMenu,
// AAbstractFurnaceBlockEntity, ACampfireBlock); re-verified present in the
// live astages-2.5.0-1.21.1.jar. The 2.5 update preserves this recipe API;
// item visibility remains separate and never substitutes for these craft gates.
// Each tier locks BOTH the AoA-authored first-copy recipe ids and the jar's
// duplication recipe ids: locking only the first copies would let a player
// who looted one template multiply it below the stage.
// Duplication recipe ids verified in unusualend-2.3.jar
// (data/unusualend/recipe/ancient_trim_duplication.json,
// pearlescent_upgrade_duplication.json) and BetterEnd-21.0.32.jar
// (data/betterend/recipe/copy_*.json). All are minecraft:crafting_shaped,
// so RecipeType.CRAFTING is the correct restriction type for every id here.

;(function () {
  if (typeof AStages === 'undefined') return

  var CRAFTING
  try {
    CRAFTING = Java.loadClass('net.minecraft.world.item.crafting.RecipeType').CRAFTING
  } catch (e) {
    console.error('[AoA AStages recipe locks] could not resolve RecipeType.CRAFTING: ' + e)
    return
  }

  function softRecipeLock(stage, recipeId) {
    var id = 'aoa/recipe/' + stage + '/' + recipeId.replace(/[^a-zA-Z0-9_]/g, '_')
    try {
      AStages.addRestrictionForRecipe(id, stage, CRAFTING, recipeId)
    } catch (e) {
      console.warn('[AoA AStages recipe locks] Skipped ' + recipeId + ': ' + e)
    }
  }

  var recipeLocks = [
    // unusualend templates: chapter ow6_beyond_the_veil = otherworldly.
    // Closes UE-1 (a Renaissance player in the End could craft both
    // otherworldly-locked templates three ages early).
    ['otherworldly', 'aoa:crafting/ancient_trim_template_first_copy'],
    ['otherworldly', 'aoa:crafting/pearlescent_template_first_copy'],
    ['otherworldly', 'unusualend:ancient_trim_duplication'],
    ['otherworldly', 'unusualend:pearlescent_upgrade_duplication'],

    // betterend Renaissance templates: consumed by thallasium/terminite gear
    // (ren_end_threshold). Near-inert today (the End itself opens at Ren) but
    // keeps lock symmetry against reward/loot leaks of the catalysts.
    ['the_renaissance', 'aoa:crafting/betterend_thallasium_upgrade_template_first_copy'],
    ['the_renaissance', 'aoa:crafting/betterend_terminite_upgrade_template_first_copy'],
    ['the_renaissance', 'aoa:crafting/betterend_handle_attachment_template_first_copy'],
    ['the_renaissance', 'aoa:crafting/betterend_tool_assembly_template_first_copy'],
    ['the_renaissance', 'betterend:copy_thallasium_upgrade'],
    ['the_renaissance', 'betterend:copy_terminite_upgrade'],
    ['the_renaissance', 'betterend:copy_handle_attachment'],
    ['the_renaissance', 'betterend:copy_tool_assembly'],

    // betterend Industrial Revolution templates: consumed by aeternium-tier
    // gear (ir_netherite_citadel_obsidilith). Real containment: a Renaissance
    // player can loot these templates from End City treasure but cannot craft
    // or duplicate them until IR.
    ['industrial_revolution', 'aoa:crafting/betterend_leather_handle_attachment_template_first_copy'],
    ['industrial_revolution', 'aoa:crafting/betterend_plate_upgrade_template_first_copy'],
    ['industrial_revolution', 'aoa:crafting/betterend_aeternium_upgrade_template_first_copy'],
    ['industrial_revolution', 'aoa:crafting/betterend_netherite_upgrade_template_first_copy'],
    ['industrial_revolution', 'betterend:copy_leather_handle_attachment'],
    ['industrial_revolution', 'betterend:copy_plate_upgrade'],
    ['industrial_revolution', 'betterend:copy_aeternium_upgrade'],
    ['industrial_revolution', 'betterend:copy_netherite_upgrade'],

    // Occultism bound-book age bypass (2026-08-13): item locks on unbound
    // djinni/afrit/marid do not stop crafting, and bookshelf empty+dye binding
    // skips the unbound item entirely. Recipe-lock the table crafts so EMI and
    // the crafting grid match the age. Do NOT lock occultism:crafting/bound_book_of_binding
    // (one special recipe binds every tier, including Renaissance foliot).
    // Bound-book item locks in aoa_astages_01 close the bookshelf/bowl output path.
    ['industrial_revolution', 'occultism:crafting/book_of_binding_djinni'],
    ['industrial_revolution', 'occultism:crafting/book_of_binding_djinni_from_empty'],
    ['gilded_age', 'occultism:crafting/book_of_binding_afrit'],
    ['gilded_age', 'occultism:crafting/book_of_binding_afrit_from_empty'],
    ['otherworldly', 'occultism:crafting/book_of_binding_marid'],
    ['otherworldly', 'occultism:crafting/book_of_binding_marid_from_empty']
  ]

  recipeLocks.forEach(function (e) { softRecipeLock(e[0], e[1]) })
})()
