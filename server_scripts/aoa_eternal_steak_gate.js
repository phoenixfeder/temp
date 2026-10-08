// AoA KubeJS: aoa_eternal_steak_gate.js
//
// Closes the Dark Ages route to infinite food.
//
// The defect:
//   artifacts:everlasting_beef dropped from cows and mooshrooms at 0.2% and
//   generated as structure loot, and the Artifacts jar ships three cooking
//   recipes that convert it straight into artifacts:eternal_steak:
//     data/artifacts/recipe/eternal_steak_campfire.json  (600 ticks)
//     data/artifacts/recipe/eternal_steak_furnace.json   (200 ticks)
//     data/artifacts/recipe/eternal_steak_smoker.json    (100 ticks)
//   Both items are infinite food on a 15 second cooldown. A player could hold
//   the Otherworldly Dyson boss reward before leaving their first spawn valley,
//   which made stone_food_and_farming_pressures, m2_hearth_and_homestead, and
//   ren_harvest_and_hearth decorative.
//
// The fix has four parts. This script is part two.
//   1. config/artifacts/items.toml (and the configureddefaults mirror):
//      dropRate 0.0, generateAsLoot false.
//   2. THIS FILE: remove the three cook recipes.
//   3. kubejs/data/aoa/recipe/: the beef is now the Otherworldly boss reward,
//      and the steak is an Ascension Extreme Crafting build.
//   4. AStages: beef -> otherworldly, steak -> ascension.
//
// Why removing the recipes is sufficient (bytecode-proven, 2026-08-13):
//   reliquified_artifacts mixes into AbstractFurnaceBlockEntity and
//   CampfireBlockEntity and references EVERLASTING_BEEF in both, which raised
//   the question of whether the conversion is code-driven and would survive
//   recipe removal. It is not. AbstractFurnaceBlockEntityMixin declares
//   reliquified_artifacts$preserveRelicData, injected on canBurn. Read from
//   javap, its guards run in this order:
//     - if the RecipeHolder argument is null, return (instruction 0-16)
//     - if the original canBurn is false, return
//     - if the input is not ModItems.EVERLASTING_BEEF, return
//     - if the recipe is not an AbstractCookingRecipe, return
//     - if recipe.assemble(...) is not ModItems.ETERNAL_STEAK, return
//     - only then transmuteCopy the input, preserving Relics components
//   It is a component-preservation rider on an existing recipe, not an
//   independent conversion. With the recipes gone the RecipeHolder is null and
//   the injection returns immediately. No mixin of our own is required.
//
// Removal is by exact recipe id rather than by output. Removing by
// { output: 'artifacts:eternal_steak' } would also delete the new Ascension
// Extreme Crafting recipe if script load order ever changed.

ServerEvents.recipes(event => {
  const AOA_STEAK_COOK_RECIPES = [
    'artifacts:eternal_steak_campfire',
    'artifacts:eternal_steak_furnace',
    'artifacts:eternal_steak_smoker'
  ]

  AOA_STEAK_COOK_RECIPES.forEach(function (id) {
    event.remove({ id: id })
  })
})
