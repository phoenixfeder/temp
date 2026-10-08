// ============================================================================
//  Early Diamond progression restore
// ============================================================================
//
//  Intent:
//    - Diamond tools and armor are crafted via vanilla recipes, gated by
//      AStages stage restrictions (`aoa_astages_01_item_restrictions.js`).
//    - Overgeared 1.6.14 ships its own `data/minecraft/recipe/diamond_*.json`
//      files inside the jar, all of which are `air -> air` no-ops that
//      effectively delete vanilla diamond crafting. That deletion was the
//      root cause of the diamond "empty slot" failure mode where any other
//      mod shipping `minecraft:diamond_*` could silently become the only
//      route.
//    - This script removes Overgeared's air recipes and re-publishes the
//      vanilla diamond patterns under their original `minecraft:diamond_*`
//      recipe IDs. The recipe ID namespace stays `minecraft:` so the
//      `zz_aoa_recipe_output_policy.js` runtime guard accepts them under
//      VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED.
//
//  Scope:
//    - 5 diamond tools (axe, hoe, pickaxe, shovel, sword) — vanilla shaped.
//    - 4 diamond armor pieces (helmet, chestplate, leggings, boots) —
//      vanilla shaped. No Overgeared armor hybrid in this pass (Overgeared
//      has no diamond_plate item). If a clean hybrid is authored later,
//      these can be replaced with an `aoa:overgeared_diamond_*_armor`
//      route — the policy entry already allows it.
//    - Netherite gear is untouched: Overgeared only overrides
//      `minecraft:netherite_ingot` (forging minigame), and the vanilla
//      smithing-transform chain to upgrade diamond -> netherite stays alive.
// ============================================================================

const OVERGEARED_DIAMOND_NOOP_RECIPES = [
  'minecraft:diamond_axe',
  'minecraft:diamond_hoe',
  'minecraft:diamond_pickaxe',
  'minecraft:diamond_shovel',
  'minecraft:diamond_sword',
  'minecraft:diamond_helmet',
  'minecraft:diamond_chestplate',
  'minecraft:diamond_leggings',
  'minecraft:diamond_boots'
]

ServerEvents.recipes(event => {
  OVERGEARED_DIAMOND_NOOP_RECIPES.forEach(id => event.remove({ id: id }))

  // Vanilla diamond tool patterns (1.21 reference values).
  event.shaped('minecraft:diamond_pickaxe', [
    'XXX',
    ' # ',
    ' # '
  ], { X: 'minecraft:diamond', '#': 'minecraft:stick' }).id('minecraft:diamond_pickaxe')

  event.shaped('minecraft:diamond_axe', [
    'XX',
    'X#',
    ' #'
  ], { X: 'minecraft:diamond', '#': 'minecraft:stick' }).id('minecraft:diamond_axe')

  event.shaped('minecraft:diamond_shovel', [
    'X',
    '#',
    '#'
  ], { X: 'minecraft:diamond', '#': 'minecraft:stick' }).id('minecraft:diamond_shovel')

  event.shaped('minecraft:diamond_hoe', [
    'XX',
    ' #',
    ' #'
  ], { X: 'minecraft:diamond', '#': 'minecraft:stick' }).id('minecraft:diamond_hoe')

  event.shaped('minecraft:diamond_sword', [
    'X',
    'X',
    '#'
  ], { X: 'minecraft:diamond', '#': 'minecraft:stick' }).id('minecraft:diamond_sword')

  // Vanilla diamond armor patterns (1.21 reference values).
  event.shaped('minecraft:diamond_helmet', [
    'XXX',
    'X X'
  ], { X: 'minecraft:diamond' }).id('minecraft:diamond_helmet')

  event.shaped('minecraft:diamond_chestplate', [
    'X X',
    'XXX',
    'XXX'
  ], { X: 'minecraft:diamond' }).id('minecraft:diamond_chestplate')

  event.shaped('minecraft:diamond_leggings', [
    'XXX',
    'X X',
    'X X'
  ], { X: 'minecraft:diamond' }).id('minecraft:diamond_leggings')

  event.shaped('minecraft:diamond_boots', [
    'X X',
    'X X'
  ], { X: 'minecraft:diamond' }).id('minecraft:diamond_boots')
})
