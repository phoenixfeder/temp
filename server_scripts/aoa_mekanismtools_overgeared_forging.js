// AoA KubeJS: aoa_mekanismtools_overgeared_forging.js
// Routes ALL MekanismTools tools and armor through the Overgeared forging
// system as the SOLE crafting route. The vanilla MekanismTools grid recipes
// for swords/axes/pickaxes/shovels/hoes and helmet/chestplate/leggings/boots
// (all six material sets: bronze, steel, lapis_lazuli, osmium,
// refined_glowstone, refined_obsidian) are removed and replaced with
// overgeared:forging recipes that forge the finished item directly from the
// cold material ingots on the Smithing Anvil.
//
// NOT touched here (they already inherit the forging gate / ingot stage lock):
//   - Paxels (mekanismtools:paxel recipes consume the forged axe+pickaxe+shovel)
//   - Shields (grid recipes consume the stage-locked material ingot directly)
//
// Age discipline: every MekanismTools gear item is independently stage-locked in
// aoa_astages_01_item_restrictions.js, so the crafting route never affects the
// age gate. Forging inputs are the same material ingot the vanilla recipe used,
// which is always obtainable at or before the gear's own age. No softlock.
//
// Recipe ids: aoa:overgeared/mekanismtools/<item_name>
// Field set copied from real jar forging recipes (see data/overgeared/recipe/
// steel_plate.json for the direct-to-item MISC/forging template). MISC category
// is used because these output the finished gear directly (no separate tool-head
// or assembly step exists for MekanismTools gear).

ServerEvents.recipes(event => {
  // bronze_sword
  event.remove({ output: 'mekanismtools:bronze_sword', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#", "#"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_sword', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_sword')

  // bronze_shovel
  event.remove({ output: 'mekanismtools:bronze_shovel', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_shovel', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_shovel')

  // bronze_hoe
  event.remove({ output: 'mekanismtools:bronze_hoe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_hoe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_hoe')

  // bronze_axe
  event.remove({ output: 'mekanismtools:bronze_axe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##", "# "],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_axe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_axe')

  // bronze_pickaxe
  event.remove({ output: 'mekanismtools:bronze_pickaxe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_pickaxe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_pickaxe')

  // bronze_helmet
  event.remove({ output: 'mekanismtools:bronze_helmet', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_helmet', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_helmet')

  // bronze_chestplate
  event.remove({ output: 'mekanismtools:bronze_chestplate', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "###", "###"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_chestplate', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_chestplate')

  // bronze_leggings
  event.remove({ output: 'mekanismtools:bronze_leggings', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #", "# #"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_leggings', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_leggings')

  // bronze_boots
  event.remove({ output: 'mekanismtools:bronze_boots', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "# #"],
    key: { "#": { "tag": "c:ingots/bronze" } },
    result: { id: 'mekanismtools:bronze_boots', count: 1 }
  }).id('aoa:overgeared/mekanismtools/bronze_boots')

  // steel_sword
  event.remove({ output: 'mekanismtools:steel_sword', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#", "#"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_sword', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_sword')

  // steel_shovel
  event.remove({ output: 'mekanismtools:steel_shovel', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_shovel', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_shovel')

  // steel_hoe
  event.remove({ output: 'mekanismtools:steel_hoe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_hoe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_hoe')

  // steel_axe
  event.remove({ output: 'mekanismtools:steel_axe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##", "# "],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_axe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_axe')

  // steel_pickaxe
  event.remove({ output: 'mekanismtools:steel_pickaxe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_pickaxe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_pickaxe')

  // steel_helmet
  event.remove({ output: 'mekanismtools:steel_helmet', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_helmet', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_helmet')

  // steel_chestplate
  event.remove({ output: 'mekanismtools:steel_chestplate', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "###", "###"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_chestplate', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_chestplate')

  // steel_leggings
  event.remove({ output: 'mekanismtools:steel_leggings', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #", "# #"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_leggings', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_leggings')

  // steel_boots
  event.remove({ output: 'mekanismtools:steel_boots', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "# #"],
    key: { "#": { "tag": "c:ingots/steel" } },
    result: { id: 'mekanismtools:steel_boots', count: 1 }
  }).id('aoa:overgeared/mekanismtools/steel_boots')

  // lapis_lazuli_sword
  event.remove({ output: 'mekanismtools:lapis_lazuli_sword', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#", "#"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_sword', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_sword')

  // lapis_lazuli_shovel
  event.remove({ output: 'mekanismtools:lapis_lazuli_shovel', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_shovel', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_shovel')

  // lapis_lazuli_hoe
  event.remove({ output: 'mekanismtools:lapis_lazuli_hoe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_hoe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_hoe')

  // lapis_lazuli_axe
  event.remove({ output: 'mekanismtools:lapis_lazuli_axe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##", "# "],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_axe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_axe')

  // lapis_lazuli_pickaxe
  event.remove({ output: 'mekanismtools:lapis_lazuli_pickaxe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_pickaxe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_pickaxe')

  // lapis_lazuli_helmet
  event.remove({ output: 'mekanismtools:lapis_lazuli_helmet', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_helmet', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_helmet')

  // lapis_lazuli_chestplate
  event.remove({ output: 'mekanismtools:lapis_lazuli_chestplate', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "###", "###"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_chestplate', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_chestplate')

  // lapis_lazuli_leggings
  event.remove({ output: 'mekanismtools:lapis_lazuli_leggings', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #", "# #"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_leggings', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_leggings')

  // lapis_lazuli_boots
  event.remove({ output: 'mekanismtools:lapis_lazuli_boots', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "# #"],
    key: { "#": { "tag": "c:gems/lapis" } },
    result: { id: 'mekanismtools:lapis_lazuli_boots', count: 1 }
  }).id('aoa:overgeared/mekanismtools/lapis_lazuli_boots')

  // osmium_sword
  event.remove({ output: 'mekanismtools:osmium_sword', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#", "#"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_sword', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_sword')

  // osmium_shovel
  event.remove({ output: 'mekanismtools:osmium_shovel', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_shovel', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_shovel')

  // osmium_hoe
  event.remove({ output: 'mekanismtools:osmium_hoe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_hoe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_hoe')

  // osmium_axe
  event.remove({ output: 'mekanismtools:osmium_axe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##", "# "],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_axe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_axe')

  // osmium_pickaxe
  event.remove({ output: 'mekanismtools:osmium_pickaxe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_pickaxe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_pickaxe')

  // osmium_helmet
  event.remove({ output: 'mekanismtools:osmium_helmet', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_helmet', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_helmet')

  // osmium_chestplate
  event.remove({ output: 'mekanismtools:osmium_chestplate', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "###", "###"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_chestplate', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_chestplate')

  // osmium_leggings
  event.remove({ output: 'mekanismtools:osmium_leggings', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #", "# #"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_leggings', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_leggings')

  // osmium_boots
  event.remove({ output: 'mekanismtools:osmium_boots', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "# #"],
    key: { "#": { "tag": "c:ingots/osmium" } },
    result: { id: 'mekanismtools:osmium_boots', count: 1 }
  }).id('aoa:overgeared/mekanismtools/osmium_boots')

  // refined_glowstone_sword
  event.remove({ output: 'mekanismtools:refined_glowstone_sword', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#", "#"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_sword', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_sword')

  // refined_glowstone_shovel
  event.remove({ output: 'mekanismtools:refined_glowstone_shovel', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_shovel', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_shovel')

  // refined_glowstone_hoe
  event.remove({ output: 'mekanismtools:refined_glowstone_hoe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_hoe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_hoe')

  // refined_glowstone_axe
  event.remove({ output: 'mekanismtools:refined_glowstone_axe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##", "# "],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_axe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_axe')

  // refined_glowstone_pickaxe
  event.remove({ output: 'mekanismtools:refined_glowstone_pickaxe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_pickaxe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_pickaxe')

  // refined_glowstone_helmet
  event.remove({ output: 'mekanismtools:refined_glowstone_helmet', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_helmet', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_helmet')

  // refined_glowstone_chestplate
  event.remove({ output: 'mekanismtools:refined_glowstone_chestplate', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "###", "###"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_chestplate', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_chestplate')

  // refined_glowstone_leggings
  event.remove({ output: 'mekanismtools:refined_glowstone_leggings', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #", "# #"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_leggings', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_leggings')

  // refined_glowstone_boots
  event.remove({ output: 'mekanismtools:refined_glowstone_boots', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "# #"],
    key: { "#": { "tag": "c:ingots/refined_glowstone" } },
    result: { id: 'mekanismtools:refined_glowstone_boots', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_glowstone_boots')

  // refined_obsidian_sword
  event.remove({ output: 'mekanismtools:refined_obsidian_sword', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#", "#"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_sword', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_sword')

  // refined_obsidian_shovel
  event.remove({ output: 'mekanismtools:refined_obsidian_shovel', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["#"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_shovel', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_shovel')

  // refined_obsidian_hoe
  event.remove({ output: 'mekanismtools:refined_obsidian_hoe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_hoe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_hoe')

  // refined_obsidian_axe
  event.remove({ output: 'mekanismtools:refined_obsidian_axe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["##", "# "],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_axe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_axe')

  // refined_obsidian_pickaxe
  event.remove({ output: 'mekanismtools:refined_obsidian_pickaxe', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 4,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_pickaxe', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_pickaxe')

  // refined_obsidian_helmet
  event.remove({ output: 'mekanismtools:refined_obsidian_helmet', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_helmet', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_helmet')

  // refined_obsidian_chestplate
  event.remove({ output: 'mekanismtools:refined_obsidian_chestplate', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "###", "###"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_chestplate', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_chestplate')

  // refined_obsidian_leggings
  event.remove({ output: 'mekanismtools:refined_obsidian_leggings', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["###", "# #", "# #"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_leggings', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_leggings')

  // refined_obsidian_boots
  event.remove({ output: 'mekanismtools:refined_obsidian_boots', type: 'minecraft:crafting_shaped' })
  event.custom({
    type: 'overgeared:forging',
    category: 'MISC',
    tier: 'iron',
    hammering: 5,
    has_quality: false,
    needs_minigame: false,
    show_notification: false,
    pattern: ["# #", "# #"],
    key: { "#": { "tag": "c:ingots/refined_obsidian" } },
    result: { id: 'mekanismtools:refined_obsidian_boots', count: 1 }
  }).id('aoa:overgeared/mekanismtools/refined_obsidian_boots')
})
