// AoA KubeJS/LootJS: strip generated maps from loot containers.
//
// Prior crash evidence hit LootrAPI.postProcess -> Clavis -> LootTable.getRandomItems
// -> ExplorationMapFunction.run -> findNearestMapStructure. Keep maps out of chest
// loot so opening/converting loot containers cannot trigger structure-map searches.

LootJS.modifiers(event => {
  event.addTableModifier(LootType.CHEST)
    .removeLoot('minecraft:filled_map')
    .removeLoot('minecraft:map')
})

// Vanilla-tier tools from structure or mob loot bypass AoA's early Overgeared
// curriculum. Players should make these through knapping/forging, not find them.
const AOA_VANILLA_TOOL_LOOT_BYPASSES = [
  'minecraft:wooden_axe',
  'minecraft:wooden_hoe',
  'minecraft:wooden_pickaxe',
  'minecraft:wooden_shovel',
  'minecraft:wooden_sword',
  'minecraft:stone_axe',
  'minecraft:stone_hoe',
  'minecraft:stone_pickaxe',
  'minecraft:stone_shovel',
  'minecraft:stone_sword',
  'minecraft:iron_axe',
  'minecraft:iron_hoe',
  'minecraft:iron_pickaxe',
  'minecraft:iron_shovel',
  'minecraft:iron_sword',
  'minecraft:golden_axe',
  'minecraft:golden_hoe',
  'minecraft:golden_pickaxe',
  'minecraft:golden_shovel',
  'minecraft:golden_sword',
  'minecraft:diamond_axe',
  'minecraft:diamond_hoe',
  'minecraft:diamond_pickaxe',
  'minecraft:diamond_shovel',
  'minecraft:diamond_sword',
  'minecraft:netherite_axe',
  'minecraft:netherite_hoe',
  'minecraft:netherite_pickaxe',
  'minecraft:netherite_shovel',
  'minecraft:netherite_sword',
  'actually_division:stone_aiot',
  'actually_division:wooden_aiot',
  'actuallyadditions:stone_aiot',
  'actuallyadditions:wooden_aiot',
  'mekanismtools:stone_paxel',
  'mekanismtools:wood_paxel'
]

LootJS.modifiers(event => {
  ;[LootType.CHEST, LootType.ENTITY].forEach(type => {
    const vanillaToolLoot = event.addTableModifier(type)
    AOA_VANILLA_TOOL_LOOT_BYPASSES.forEach(item => vanillaToolLoot.removeLoot(item))
  })
})
