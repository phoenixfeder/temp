// ============================================================================
//  Early Overgeared progression cleanup
// ============================================================================
//
//  Intent:
//    - Overgeared is the canonical early tool and armor path.
//    - Wooden tools are not part of AoA's start; stone tools must come through
//      knapped Overgeared heads, not vanilla plank/cobble grids.
//    - Copper gear must come from Overgeared, not side-mod grid recipes.
//    - Vanilla iron/gold/diamond tools and iron armor must not be shortcut by
//      Apotheosis smithing upgrades before players work through heated ingots,
//      forged heads, and the Overgeared tier ladder.
//
//  Keep:
//    - Overgeared copper tools, copper armor, heated iron, and forged tool heads.
//    - Overgeared stone tool assembly from knapped heads.
//    - Mod-specific later hammers such as the MI forge hammer; those are not
//      vanilla-tier tool replacements and are quested in their own chapters.
// ============================================================================

const VANILLA_WOODEN_TOOL_RECIPES = [
  'minecraft:wooden_axe',
  'minecraft:wooden_hoe',
  'minecraft:wooden_pickaxe',
  'minecraft:wooden_shovel',
  'minecraft:wooden_sword'
]

const VANILLA_STONE_TOOL_RECIPE_IDS = [
  'minecraft:stone_axe',
  'minecraft:stone_hoe',
  'minecraft:stone_pickaxe',
  'minecraft:stone_shovel',
  'minecraft:stone_sword'
]

const VANILLA_STONE_TOOL_OUTPUTS = [
  'minecraft:stone_axe',
  'minecraft:stone_hoe',
  'minecraft:stone_pickaxe',
  'minecraft:stone_shovel',
  'minecraft:stone_sword'
]

const NON_OVERGEARED_WOOD_AND_STONE_TOOL_RECIPES = [
  'actually_division:stone_aiot_recipe',
  'actually_division:wooden_aiot_recipe',
  'actuallyadditions:stone_aiot',
  'actuallyadditions:wooden_aiot',
  'mekanismtools:stone_paxel',
  'mekanismtools:wood_paxel',
  'quark:tweaks/crafting/utility/better_stone_tools/axe',
  'quark:tweaks/crafting/utility/better_stone_tools/hoe',
  'quark:tweaks/crafting/utility/better_stone_tools/pickaxe',
  'quark:tweaks/crafting/utility/better_stone_tools/shovel',
  'quark:tweaks/crafting/utility/better_stone_tools/sword'
]

const NON_OVERGEARED_WOOD_AND_STONE_TOOL_OUTPUTS = [
  'actually_division:stone_aiot',
  'actually_division:wooden_aiot',
  'actuallyadditions:stone_aiot',
  'actuallyadditions:wooden_aiot',
  'mekanismtools:stone_paxel',
  'mekanismtools:wood_paxel'
]

// 2026-08-25: eleven pulled-jar copper-gear rows that used to sit in this list were
// deleted as no-ops -- the Create Crafts & Additions jar is gone from mods/, so those
// recipes never registered and these anti-bypass removals had nothing left to blunt.
// The capability affordances they guarded against (early exoskeleton/propeller gear
// side-stepping the Overgeared ladder) died WITH the jar; see git history for the rows.
const NON_OVERGEARED_COPPER_GEAR_RECIPES = [
  'alltheores:copper_ore_hammer',
  'create:crafting/appliances/copper_diving_boots',
  'create:crafting/appliances/copper_diving_helmet'
]

const NON_OVERGEARED_VANILLA_TIER_UPGRADES = [
  'apotheosis:smithing/upgrade_chainmail_boots_to_iron_boots',
  'apotheosis:smithing/upgrade_chainmail_chestplate_to_iron_chestplate',
  'apotheosis:smithing/upgrade_chainmail_helmet_to_iron_helmet',
  'apotheosis:smithing/upgrade_chainmail_leggings_to_iron_leggings',
  'apotheosis:smithing/upgrade_golden_axe_to_diamond_axe',
  'apotheosis:smithing/upgrade_golden_hoe_to_diamond_hoe',
  'apotheosis:smithing/upgrade_golden_pickaxe_to_diamond_pickaxe',
  'apotheosis:smithing/upgrade_golden_shovel_to_diamond_shovel',
  'apotheosis:smithing/upgrade_golden_sword_to_diamond_sword',
  'apotheosis:smithing/upgrade_iron_axe_to_golden_axe',
  'apotheosis:smithing/upgrade_iron_hoe_to_golden_hoe',
  'apotheosis:smithing/upgrade_iron_pickaxe_to_golden_pickaxe',
  'apotheosis:smithing/upgrade_iron_shovel_to_golden_shovel',
  'apotheosis:smithing/upgrade_iron_sword_to_golden_sword',
  'apotheosis:smithing/upgrade_stone_axe_to_iron_axe',
  'apotheosis:smithing/upgrade_stone_hoe_to_iron_hoe',
  'apotheosis:smithing/upgrade_stone_pickaxe_to_iron_pickaxe',
  'apotheosis:smithing/upgrade_stone_shovel_to_iron_shovel',
  'apotheosis:smithing/upgrade_stone_sword_to_iron_sword',
  'titanium:test_serializer/dirt_to_used'
]

const ASTRAL_VANILLA_STONE_TOOL_RECIPES = [
  'astral_dimension:astralstoneaxerecipe',
  'astral_dimension:astralstonehoerecipe',
  'astral_dimension:astralstonepickaxerecipe',
  'astral_dimension:astralstoneshovelrecipe',
  'astral_dimension:astralstoneswordrecipe'
]

// astral_dimension ships grid recipes whose result.id is a vanilla item
// (minecraft:furnace, crafting_table, smoker, glass, stick) using
// dimension-only ingredients. The dimension itself is gated at Gilded,
// so practical leak risk is low — but the pack's policy is "one authorized
// route per progression-relevant vanilla output", so we remove these alt
// paths even when their inputs are gated. Decorative/cosmetic alt paths
// (dyes from astral plants, signs, bone_meal from fish bones, porkchop)
// are intentionally left alone — they're not progression-critical and the
// inputs are dimension-gated.
const ASTRAL_VANILLA_OUTPUT_EXTRA_RECIPES = [
  'astral_dimension:astralstonefurnacerecipe',
  'astral_dimension:luminous_crafting_table_recipe',
  'astral_dimension:soggy_crafting_table',
  'astral_dimension:tormented_crafting_table_recipe',
  'astral_dimension:wisteria_crafting_table',
  'astral_dimension:luminous_smoker_recipe',
  'astral_dimension:soggy_smoker_recipe',
  'astral_dimension:tormented_smoker_recipe',
  'astral_dimension:wisteria_smoker_recipe',
  'astral_dimension:lunar_soil_glass_recipe',
  'astral_dimension:soul_stick_recipe'
]

const AOA_STONE_TOOL_ASSEMBLY_RECIPES = [
  ['minecraft:stone_axe', 'overgeared:stone_axe_head', 'aoa:overgeared_stone_axe'],
  ['minecraft:stone_hoe', 'overgeared:stone_hoe_head', 'aoa:overgeared_stone_hoe'],
  ['minecraft:stone_pickaxe', 'overgeared:stone_pickaxe_head', 'aoa:overgeared_stone_pickaxe'],
  ['minecraft:stone_shovel', 'overgeared:stone_shovel_head', 'aoa:overgeared_stone_shovel'],
  ['minecraft:stone_sword', 'overgeared:stone_sword_blade', 'aoa:overgeared_stone_sword']
]

ServerEvents.recipes(event => {
  VANILLA_WOODEN_TOOL_RECIPES.forEach(id => event.remove({ id: id }))
  VANILLA_STONE_TOOL_RECIPE_IDS.forEach(id => event.remove({ id: id }))
  VANILLA_STONE_TOOL_OUTPUTS.forEach(output => event.remove({ output: output, type: 'minecraft:crafting_shaped' }))
  NON_OVERGEARED_WOOD_AND_STONE_TOOL_RECIPES.forEach(id => event.remove({ id: id }))
  NON_OVERGEARED_WOOD_AND_STONE_TOOL_OUTPUTS.forEach(output => event.remove({ output: output }))
  NON_OVERGEARED_COPPER_GEAR_RECIPES.forEach(id => event.remove({ id: id }))
  NON_OVERGEARED_VANILLA_TIER_UPGRADES.forEach(id => event.remove({ id: id }))
  ASTRAL_VANILLA_STONE_TOOL_RECIPES.forEach(id => event.remove({ id: id }))
  ASTRAL_VANILLA_OUTPUT_EXTRA_RECIPES.forEach(id => event.remove({ id: id }))

  // Critical Dark Ages tool path: own stable AoA IDs after removing vanilla/foreign outputs.
  AOA_STONE_TOOL_ASSEMBLY_RECIPES.forEach(([output, head, id]) => {
    event.shapeless(
      Item.of(output),
      [
        head,
        'minecraft:stick'
      ]
    ).id(id)
  })
})
