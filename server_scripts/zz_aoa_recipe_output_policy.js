// ============================================================================
//  AoA Recipe Output Ownership Policy (runtime guard)
// ============================================================================
//
//  Purpose:
//    Defend a small, curated set of vanilla output IDs from being silently
//    re-published by foreign mods. Every recipe whose `result.id` matches a
//    policy entry is checked at server boot against the entry's allowed
//    recipe-ID namespaces; foreign-namespace recipes are removed.
//
//  Policy classification:
//    - AOA_OWNED_ONLY:
//        Only AoA / Overgeared / KubeJS-authored routes survive. Used for
//        the Overgeared substrate (stone, iron, golden tool & armor tiers).
//    - VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED:
//        Vanilla recipe survives; foreign mod recipes outputting the same
//        item are removed. Used for outputs the pack wants players to craft
//        through vanilla means (diamond tools, netherite gear). AoA-owned
//        re-publishing under the `minecraft:` recipe ID (as
//        early_diamond_progression_restore.js does) is also accepted because
//        the recipe ID namespace is `minecraft:`.
//    - VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED:
//        Same as above, but an explicit `aoa:` or `overgeared:` route is
//        also allowed. Used for diamond armor, which may receive an
//        Overgeared armor hybrid recipe in a future pass.
//
//  This script runs LAST (zz_ prefix) so prior cleanup scripts have
//  already done their explicit removals. The guard is a generalized
//  safety net for outputs that should never have alt routes.
//
//  Outputs NOT listed here are out of policy — the guard does NOT touch
//  them, even if they happen to be vanilla items. That preserves
//  legitimate compat recipes (Create crushing producing iron_nugget,
//  Mekanism enrichment producing redstone, mod food-byproducts producing
//  vanilla porkchop, etc.). Adding a new output to the policy is a
//  deliberate decision.
//
//  Source of truth: this table is mirrored verbatim in
//  `tools/aoa_recipe_output_audit.py`. The audit script verifies drift on
//  every release.
// ============================================================================

const POLICY_STATUS = {
  AOA_OWNED_ONLY:                                              'AOA_OWNED_ONLY',
  VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED:                      'VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED',
  VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED: 'VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED'
}

const ALLOWED_NAMESPACES_FOR_STATUS = {
  AOA_OWNED_ONLY: ['minecraft', 'aoa', 'overgeared', 'kubejs'],
  VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED: ['minecraft'],
  VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED: ['minecraft', 'aoa', 'overgeared']
}

// Keep table sorted by output ID for diff stability with the Python mirror.
const AOA_RECIPE_OUTPUT_POLICY = {
  // --- Stone tier (AoA-owned via Overgeared knapped-head route) -----------
  'minecraft:stone_axe':     POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:stone_hoe':     POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:stone_pickaxe': POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:stone_shovel':  POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:stone_sword':   POLICY_STATUS.AOA_OWNED_ONLY,

  // --- Iron tier (AoA-owned via Overgeared head/blade or plate forging) ---
  'minecraft:iron_axe':        POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_hoe':        POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_pickaxe':    POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_shovel':     POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_sword':      POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_helmet':     POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_chestplate': POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_leggings':   POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:iron_boots':      POLICY_STATUS.AOA_OWNED_ONLY,

  // --- Golden tier (AoA-owned via Overgeared head/blade or plate forging) -
  'minecraft:golden_axe':        POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_hoe':        POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_pickaxe':    POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_shovel':     POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_sword':      POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_helmet':     POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_chestplate': POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_leggings':   POLICY_STATUS.AOA_OWNED_ONLY,
  'minecraft:golden_boots':      POLICY_STATUS.AOA_OWNED_ONLY,

  // --- Diamond tools (vanilla recipe restored; foreign mods blocked) ------
  'minecraft:diamond_axe':     POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_hoe':     POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_pickaxe': POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_shovel':  POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_sword':   POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,

  // --- Diamond armor (vanilla allowed; AoA hybrid pre-approved if added) -
  'minecraft:diamond_helmet':     POLICY_STATUS.VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_chestplate': POLICY_STATUS.VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_leggings':   POLICY_STATUS.VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:diamond_boots':      POLICY_STATUS.VANILLA_ALLOWED_OR_AOA_HYBRID_ALLOWED_FOREIGN_OUTPUT_BLOCKED,

  // --- Netherite tier (vanilla smithing-transform chain; foreign blocked) -
  'minecraft:netherite_axe':        POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_hoe':        POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_pickaxe':    POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_shovel':     POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_sword':      POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_helmet':     POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_chestplate': POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_leggings':   POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED,
  'minecraft:netherite_boots':      POLICY_STATUS.VANILLA_ALLOWED_FOREIGN_OUTPUT_BLOCKED
}

function namespaceOf(recipeId) {
  const s = String(recipeId)
  const colon = s.indexOf(':')
  return colon < 0 ? s : s.substring(0, colon)
}

ServerEvents.recipes(event => {
  const removalQueue = []
  const survivors = {}

  Object.keys(AOA_RECIPE_OUTPUT_POLICY).forEach(output => {
    survivors[output] = []
  })

  Object.keys(AOA_RECIPE_OUTPUT_POLICY).forEach(output => {
    const status = AOA_RECIPE_OUTPUT_POLICY[output]
    const allowed = ALLOWED_NAMESPACES_FOR_STATUS[status]

    event.forEachRecipe({ output: output }, recipe => {
      const id = String(recipe.getId())
      const ns = namespaceOf(id)
      if (allowed.indexOf(ns) < 0) {
        removalQueue.push({ id: id, output: output, status: status, namespace: ns })
      } else {
        survivors[output].push({ id: id, namespace: ns })
      }
    })
  })

  removalQueue.forEach(entry => {
    event.remove({ id: entry.id })
    console.warn('[AoA RecipeOwnership] removed ' + entry.id +
      ' outputting ' + entry.output + ' (status=' + entry.status + ', namespace=' + entry.namespace + ')')
  })

  Object.keys(AOA_RECIPE_OUTPUT_POLICY).forEach(output => {
    const status = AOA_RECIPE_OUTPUT_POLICY[output]
    const list = survivors[output] || []
    if (list.length === 0) {
      console.warn('[AoA RecipeOwnership] ALERT_NO_RECIPE: ' + output + ' (status=' + status + ')')
      return
    }
    const counts = {}
    list.forEach(s => { counts[s.namespace] = (counts[s.namespace] || 0) + 1 })
    const summary = Object.keys(counts).map(ns => ns + '(' + counts[ns] + ')').join(', ')
    if (status === POLICY_STATUS.AOA_OWNED_ONLY && list.length > 1) {
      console.warn('[AoA RecipeOwnership] MULTI_ROUTE: ' + output + ' -> ' + summary + ' (status=' + status + ')')
    }
  })

  console.warn('[AoA RecipeOwnership] policy pass complete: ' +
    Object.keys(AOA_RECIPE_OUTPUT_POLICY).length + ' curated outputs, ' +
    removalQueue.length + ' recipes removed')
})
