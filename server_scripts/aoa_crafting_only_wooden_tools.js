// ============================================================================
//  Crafting-only wooden tools (re-add recipes, deliberately annoying)
// ============================================================================
//
//  Why this exists:
//    early_overgeared_progression_cleanup.js removes the vanilla wooden tool
//    recipes (minecraft:wooden_axe/hoe/pickaxe/shovel/sword) because Overgeared
//    is the canonical early tool path. That is correct for tools you MINE with.
//    But several installed mods consume a vanilla wooden tool as a crafting
//    INGREDIENT, so removing the recipe outright hardlocks those recipes.
//
//    Real consumers verified in mod jars (data/*/recipe/*.json, ingredient
//    slots, not results) at authoring time:
//      - farmersdelight:cooking_pot        (needs a wooden tool)  <- core early item
//      - minecolonies:blockhutminer / blockhutlumberjack / blockhutsawmill /
//        blockhutfarmer                    (hut blocks use wooden tools)
//      - mekanismtools:wood_paxel          (output itself removed by cleanup,
//                                            but listed for completeness)
//      - actuallyadditions:wooden_aiot, actually_division:wooden_aiot
//                                           (outputs removed by cleanup)
//    The FarmersDelight cooking pot and MineColonies huts are the load-bearing
//    justification: they are early-game and otherwise unobtainable.
//
//  Design:
//    The re-added recipes are intentionally MORE annoying than vanilla so they
//    never become a real tool source:
//      - sticks are replaced with PLANKS (any planks, #minecraft:planks)
//      - the plank tool-head slots are replaced with LOGS (any log,
//        #minecraft:logs)
//    The resulting tools are neutered in startup + client scripts:
//      - durability 1 (setMaxDamage) and mining speed ~0.01 (setSpeed) so they
//        cannot circumvent Overgeared progression, and
//      - a red always-visible tooltip explaining they are crafting-only.
//    See kubejs/startup_scripts/aoa_crafting_only_wooden_tools_stats.js and
//    kubejs/client_scripts/aoa_crafting_only_wooden_tools_tooltip.js.
//
//  Namespace / load-order notes:
//    - Recipe IDs live under aoa:crafting_only/* so zz_aoa_recipe_output_policy.js
//      would allow them anyway (aoa is an allowed namespace), though wooden
//      outputs are not in that policy table at all.
//    - early_overgeared_progression_cleanup.js removes by the recipe ID
//      minecraft:wooden_* (and by minecraft: output only for STONE tools, not
//      wooden). Our aoa: recipe IDs are not matched by either removal, so these
//      recipes survive regardless of script load order.
//
//  #minecraft:logs and #minecraft:planks are standard vanilla item tags.
// ============================================================================

// [output, layout] where layout uses:
//   'L' = #minecraft:logs   (the annoying stand-in for planks/heads)
//   'P' = #minecraft:planks (the annoying stand-in for sticks)
const CRAFTING_ONLY_WOODEN_TOOLS = [
  ['minecraft:wooden_pickaxe', ['LLL', ' P ', ' P ']],
  ['minecraft:wooden_axe',     ['LL ', 'LP ', ' P ']],
  ['minecraft:wooden_shovel',  ['L', 'P', 'P']],
  ['minecraft:wooden_hoe',     ['LL', ' P', ' P']],
  ['minecraft:wooden_sword',   ['L', 'L', 'P']]
]

ServerEvents.recipes(event => {
  CRAFTING_ONLY_WOODEN_TOOLS.forEach(([output, pattern]) => {
    const name = output.substring(output.indexOf(':') + 1)
    event.shaped(
      Item.of(output),
      pattern,
      {
        L: '#minecraft:logs',
        P: '#minecraft:planks'
      }
    ).id('aoa:crafting_only/' + name)
  })
})
