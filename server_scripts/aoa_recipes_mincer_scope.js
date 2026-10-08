// AoA KubeJS: aoa_recipes_mincer_scope.js
// Owner ruling 2026-07-31: scope Farm & Charm's mincer to food and utility work.
// Removes ONLY the METAL ore-multiplication mincer recipes: every jar recipe
// whose output is a metal/mineral nugget, raw form, or dust multiplied out of
// an ore block (iron, gold, copper, redstone, emerald). These recipes turn a
// hand-cranked kitchen grinder into a free ore doubler-to-quintupler and
// undercut the pack's real ore-processing spines (Create crushing, IR/MI).
//
// KEPT on purpose (do not add here):
//   - MEAT / STONE / WOOD / seed-duplication / flour recipes (the mincer's
//     actual food-and-farm job; m2_hearth_and_homestead's mincer quest and
//     the ren_harvest flour line depend on this kept set)
//   - ingot -> nugget reversions (gold_nugget_from_gold_ingot 1->9,
//     iron_nugget_from_iron_ingot 1->9, raw_copper_from_copper_ingot 1->1):
//     exact-value conversions, no gain
//   - horse-armor salvage (diamond/gold/iron/leather from horse armor):
//     net-loss recycling, not multiplication
//   - lapis_from_lapis_ore / lapis_from_deepslate_lapis_ore: jar yields 5/6
//     sit inside vanilla lapis ore's own 4-9 drop range, so they multiply
//     nothing
//
// Every id below verified byte-exact against
// mods/letsdo-farm_and_charm-neoforge-1.1.23.jar data/farm_and_charm/recipe/mincer/.

ServerEvents.recipes(event => {
  const ORE_MULTIPLICATION_IDS = [
    // iron: ore -> raw_iron x3 / iron_nugget x5 (vanilla ore drops 1 raw iron)
    'farm_and_charm:mincer/iron_nugget_from_iron_ore',
    'farm_and_charm:mincer/iron_nugget_from_deepslate_iron_ore',
    'farm_and_charm:mincer/raw_iron_from_iron_ore',
    'farm_and_charm:mincer/raw_iron_from_deepslate_iron_ore',
    // gold: ore -> raw_gold x3 (both *_nugget_from_*_gold_ore ids also output raw_gold x3)
    'farm_and_charm:mincer/gold_nugget_from_gold_ore',
    'farm_and_charm:mincer/gold_nugget_from_deepslate_gold_ore',
    'farm_and_charm:mincer/raw_gold_from_gold_ore',
    'farm_and_charm:mincer/raw_gold_from_deepslate_gold_ore',
    // copper: ore -> raw_copper x5/x6 (above vanilla's 2-5 average)
    'farm_and_charm:mincer/raw_copper_from_copper_ore',
    'farm_and_charm:mincer/raw_copper_from_deepslate_copper_ore',
    // redstone: ore -> redstone dust x5/x6 (deepslate beats vanilla's 4-5 drop)
    'farm_and_charm:mincer/redstone_dust_from_redstone_ore',
    'farm_and_charm:mincer/redstone_dust_from_deepslate_redstone_ore',
    // emerald: ore -> emerald x2/x3 (vanilla ore drops exactly 1)
    'farm_and_charm:mincer/emerald_from_emerald_ore',
    'farm_and_charm:mincer/emerald_from_deepslate_emerald_ore'
  ]

  ORE_MULTIPLICATION_IDS.forEach(id => {
    event.remove({ id: id })
  })
})
