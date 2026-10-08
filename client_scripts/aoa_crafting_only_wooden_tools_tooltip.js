// ============================================================================
//  Crafting-only wooden tools: red always-visible tooltip
// ============================================================================
//
//  Companion to:
//    - kubejs/server_scripts/aoa_crafting_only_wooden_tools.js  (re-adds recipes)
//    - kubejs/startup_scripts/aoa_crafting_only_wooden_tools_stats.js (neuters)
//
//  Vanilla wooden tools are re-added ONLY as crafting ingredients (FarmersDelight
//  cooking pot, MineColonies huts, etc.). This tooltip makes that explicit so a
//  player who crafts one does not think it is a real tool.
//
//  API verified against kubejs-neoforge-2101.7.2-build.368
//  (dev/latvian/mods/kubejs/item/ModifyItemTooltipsKubeEvent and
//   dev/latvian/mods/kubejs/text/action/TextActionBuilder):
//    - ItemEvents.modifyTooltips(event) { event.modify(ingredient, builder => ...) }
//    - builder.add(Component)   (TextActionBuilder.add)
//  modifyTooltips adds unconditionally (no shift gate), so the lines are always
//  visible. Text.red(...) yields a red Component.
// ============================================================================

const CRAFTING_ONLY_WOODEN_TOOLS = [
  'minecraft:wooden_pickaxe',
  'minecraft:wooden_axe',
  'minecraft:wooden_shovel',
  'minecraft:wooden_hoe',
  'minecraft:wooden_sword'
]

const CRAFTING_ONLY_LINES = [
  'Wooden tools exist for CRAFTING purposes only.',
  'They are not meant to be used for mining or combat.',
  'Follow the Overgeared path to obtain proper tools.',
  'For more info, check the questline.'
]

ItemEvents.modifyTooltips(event => {
  CRAFTING_ONLY_WOODEN_TOOLS.forEach(id => {
    event.modify(id, builder => {
      CRAFTING_ONLY_LINES.forEach(line => {
        builder.add(Text.red(line))
      })
    })
  })
})
