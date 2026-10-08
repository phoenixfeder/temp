;(function () {
  if (typeof AStages === 'undefined') return

  function configureLootRestriction(restriction) {
    return restriction
  }

  // An unresolved id throws straight out of the restrict* call and aborts this
  // ENTIRE script, which silently disarms every loot gate below it. That is not
  // theoretical: on 2026-08-27 a single bogus supplementaries:bomb_spiky took the
  // whole file offline (KubeJS reported 103/104 scripts loaded) and every loot
  // bypass restriction here was inactive in a build that otherwise looked healthy.
  // Guard per entry, exactly like the aoa_astages_01* item-lock files do, so one
  // bad id degrades to a warning instead of a dead gate layer.
  function restrictLootItems(restriction, items) {
    items.forEach(function (item) {
      if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
        console.warn('[AoA AStages loot] Skipped missing item ' + item)
        return
      }
      try { restriction.restrictItems(item) }
      catch (e) { console.warn('[AoA AStages loot] Skipped item ' + item + ': ' + e) }
    })
    return restriction
  }

  function restrictLootTags(restriction, tags) {
    tags.forEach(function (tag) {
      try { restriction.restrictTags(tag) }
      catch (e) { console.warn('[AoA AStages loot] Skipped tag ' + tag + ': ' + e) }
    })
    return restriction
  }

  function restrictLootTables(restriction, tables) {
    tables.forEach(function (table) {
      try { restriction.restrictForLootTables(table) }
      catch (e) { console.warn('[AoA AStages loot] Skipped table ' + table + ': ' + e) }
    })
    return restriction
  }

  function restrictedStackCount(stack) {
    try {
      if (stack && stack.count) return stack.count
    } catch (ignored) {}
    try {
      if (stack && stack.getCount) return stack.getCount()
    } catch (ignored) {}
    return 1
  }

  function setReplacement(restriction, replacementItem, fixedCount) {
    return restriction.replacer(function (stack) {
      return Item.of(replacementItem, fixedCount || restrictedStackCount(stack))
    })
  }

  function tableLootLock(id, stage, items, tables) {
    const restriction = configureLootRestriction(AStages.addRestrictionForLoot(id, stage))
    restrictLootItems(restriction, items)
    restrictLootTables(restriction, tables)
    return restriction
  }

  function tableLootReplacementLock(id, stage, items, tables, replacementItem, fixedCount) {
    setReplacement(tableLootLock(id, stage, items, tables), replacementItem, fixedCount)
  }

  function itemReplacementLock(id, stage, items, replacementItem, fixedCount) {
    const restriction = AStages.addRestrictionForLoot(id, stage).applyEverywhere()
    restrictLootItems(restriction, items)
    setReplacement(restriction, replacementItem, fixedCount)
  }

  function tagReplacementLock(id, stage, tags, replacementItem, fixedCount) {
    const restriction = AStages.addRestrictionForLoot(id, stage).applyEverywhere()
    restrictLootTags(restriction, tags)
    setReplacement(restriction, replacementItem, fixedCount)
  }

  tableLootLock(
    'aoa/loot/p1_9/backpack_basic_automation',
    'the_renaissance',
    [
      'sophisticatedbackpacks:pickup_upgrade',
      'sophisticatedbackpacks:magnet_upgrade'
    ],
    [
      'sophisticatedbackpacks:inject/chests/simple_dungeon',
      'sophisticatedbackpacks:inject/chests/abandoned_mineshaft',
      'sophisticatedbackpacks:inject/chests/desert_pyramid'
    ]
  )

  tableLootLock(
    'aoa/loot/p1_9/backpack_advanced_automation',
    'industrial_revolution',
    [
      'sophisticatedbackpacks:advanced_magnet_upgrade'
    ],
    [
      'sophisticatedbackpacks:inject/chests/end_city_treasure',
      'sophisticatedbackpacks:inject/chests/woodland_mansion',
      'sophisticatedbackpacks:inject/chests/shipwreck_treasure'
    ]
  )

  tableLootLock(
    'aoa/loot/p1_9/ore_block_jackpots',
    'the_renaissance',
    [
      'minecraft:diamond_ore',
      'minecraft:deepslate_diamond_ore'
    ],
    [
      'apothic_enchanting:boon_stone_drops',
      'minecolonies:miner/lucky_ore4',
      'minecolonies:miner/lucky_ore5',
      'terralith:underground/chest'
    ]
  )

  tableLootLock(
    'aoa/loot/p1_9/emerald_ore_jackpots',
    'the_renaissance',
    [
      'minecraft:emerald_ore',
      'minecraft:deepslate_emerald_ore'
    ],
    [
      'apothic_enchanting:boon_stone_drops',
      'ati_structures:chests/vegetation',
      'minecolonies:miner/lucky_ore4',
      'minecolonies:miner/lucky_ore5',
      'mvs:mineshaft/rare'
    ]
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/proof/obsidilith_chest',
    'obsidilith_defeated',
    ['bosses_of_mass_destruction:obsidian_heart'],
    ['bosses_of_mass_destruction:chests/obsidilith'],
    'minecraft:flint',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_sword_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_sword'],
    'minecraft:iron_sword'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_pickaxe_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_pickaxe'],
    'minecraft:iron_pickaxe'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_axe_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_axe'],
    'minecraft:iron_axe'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_shovel_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_shovel'],
    'minecraft:iron_shovel'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_hoe_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_hoe'],
    'minecraft:iron_hoe'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_helmet_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_helmet'],
    'minecraft:iron_helmet'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_chestplate_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_chestplate'],
    'minecraft:iron_chestplate'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_leggings_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_leggings'],
    'minecraft:iron_leggings'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_boots_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_boots'],
    'minecraft:iron_boots'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_horse_armor_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_horse_armor'],
    'minecraft:iron_horse_armor'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_raw_pre_medieval',
    'medieval_times',
    ['minecraft:diamond'],
    'minecraft:iron_ingot'
  )

  itemReplacementLock(
    'aoa/loot/replacer/diamond_block_pre_renaissance',
    'the_renaissance',
    ['minecraft:diamond_block'],
    'minecraft:iron_block',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/emerald_currency_pre_renaissance',
    'the_renaissance',
    [
      'minecraft:emerald',
      'minecraft:emerald_block'
    ],
    'minecraft:gold_nugget'
  )

  itemReplacementLock(
    'aoa/loot/replacer/end_crystal_pre_renaissance',
    'the_renaissance',
    ['minecraft:end_crystal'],
    'minecraft:glass',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/enchanting_table_pre_renaissance',
    'the_renaissance',
    ['minecraft:enchanting_table'],
    'minecraft:bookshelf',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_sword_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_sword'],
    'minecraft:iron_sword'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_pickaxe_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_pickaxe'],
    'minecraft:iron_pickaxe'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_axe_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_axe'],
    'minecraft:iron_axe'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_shovel_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_shovel'],
    'minecraft:iron_shovel'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_hoe_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_hoe'],
    'minecraft:iron_hoe'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_helmet_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_helmet'],
    'minecraft:iron_helmet'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_chestplate_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_chestplate'],
    'minecraft:iron_chestplate'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_leggings_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_leggings'],
    'minecraft:iron_leggings'
  )

  itemReplacementLock(
    'aoa/loot/replacer/netherite_boots_pre_ir',
    'industrial_revolution',
    ['minecraft:netherite_boots'],
    'minecraft:iron_boots'
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/rpg/archers_archery_range',
    'medieval_times',
    [
      'archers:composite_longbow',
      'archers:archer_armor_head',
      'archers:archer_armor_chest',
      'archers:archer_armor_legs',
      'archers:archer_armor_feet'
    ],
    ['archers:chests/archery_range'],
    'minecraft:string'
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/rpg/paladins_village_monk',
    'medieval_times',
    [
      'paladins:acolyte_wand',
      'paladins:paladin_armor_head',
      'paladins:paladin_armor_chest',
      'paladins:paladin_armor_legs',
      'paladins:paladin_armor_feet',
      'paladins:priest_robe_head',
      'paladins:priest_robe_chest',
      'paladins:priest_robe_legs',
      'paladins:priest_robe_feet',
      'runes:healing_stone'
    ],
    ['paladins:chests/village_monk'],
    'minecraft:string'
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/rpg/rogues_barracks',
    'medieval_times',
    [
      'rogues:iron_dagger',
      'rogues:iron_double_axe',
      'rogues:iron_glaive',
      'rogues:iron_sickle',
      'rogues:rogue_armor_head',
      'rogues:rogue_armor_chest',
      'rogues:rogue_armor_legs',
      'rogues:rogue_armor_feet',
      'rogues:warrior_armor_head',
      'rogues:warrior_armor_chest',
      'rogues:warrior_armor_legs',
      'rogues:warrior_armor_feet'
    ],
    ['rogues:chests/barracks'],
    'minecraft:string'
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/rpg/wizards_village_wizard',
    'medieval_times',
    [
      'wizards:wand_novice',
      'wizards:staff_wizard',
      'wizards:wizard_robe_head',
      'wizards:wizard_robe_chest',
      'wizards:wizard_robe_legs',
      'wizards:wizard_robe_feet',
      'runes:arcane_stone',
      'runes:fire_stone',
      'runes:frost_stone'
    ],
    ['wizards:chests/village_wizard'],
    'minecraft:string'
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/rpg/jewelry_shop',
    'medieval_times',
    [
      'jewelry:copper_ring',
      'jewelry:iron_ring',
      'jewelry:gold_ring',
      'jewelry:emerald_necklace'
    ],
    ['jewelry:chests/jewelry_shop'],
    'minecraft:string'
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_unusualend_void_totem_pre_gilded',
    'gilded_age',
    ['unusualend:void_totem'],
    'minecraft:ender_pearl',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_unusualend_pearlescent_pre_ir',
    'industrial_revolution',
    [
      'unusualend:pearlescent_ingot',
      'unusualend:pearlescent_block',
      'unusualend:pearlescent_axe',
      'unusualend:pearlescent_hoe',
      'unusualend:pearlescent_pickaxe',
      'unusualend:pearlescent_shovel',
      'unusualend:pearlescent_sword',
      'unusualend:pearlescent_ring',
      'unusualend:pearlescent_infuser',
      'unusualend:prismatic_mirror'
    ],
    'minecraft:prismarine_shard'
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_unusualend_templates_pre_otherworldly',
    'otherworldly',
    [
      'unusualend:pearlescent_upgrade_smithing_template',
      'unusualend:ancient_armor_trim_smithing_template'
    ],
    'minecraft:paper',
    1
  )

  tableLootReplacementLock(
    'aoa/loot/replacer/r5_unusualend_end_city_additional_loots',
    'otherworldly',
    [
      'unusualend:pearlescent_upgrade_smithing_template',
      'unusualend:ancient_armor_trim_smithing_template'
    ],
    [
      'unusualend:chests/end_city_additional_loots',
      'minecraft:chests/end_city_treasure'
    ],
    'minecraft:paper',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_netherex_netherite_horse_armor_pre_ir',
    'industrial_revolution',
    ['netherex:netherite_horse_armor'],
    'minecraft:iron_horse_armor',
    1
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_aquaculture_neptunium_pre_ir',
    'industrial_revolution',
    [
      'aquaculture:neptunes_bounty',
      'aquaculture:neptunium_ingot',
      'aquaculture:neptunium_nugget',
      'aquaculture:neptunium_block',
      'aquaculture:neptunium_pickaxe',
      'aquaculture:neptunium_sword',
      'aquaculture:neptunium_shovel',
      'aquaculture:neptunium_axe',
      'aquaculture:neptunium_hoe',
      'aquaculture:neptunium_helmet',
      'aquaculture:neptunium_chestplate',
      'aquaculture:neptunium_leggings',
      'aquaculture:neptunium_boots',
      'aquaculture:neptunium_fishing_rod',
      'aquaculture:neptunium_bow',
      'aquaculture:neptunium_fillet_knife'
    ],
    'minecraft:prismarine_shard'
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_supplementaries_explosives_pre_ir',
    'industrial_revolution',
    [
      'supplementaries:bomb',
      'supplementaries:bomb_blue',
      'supplementaries:cannonball'
    ],
    'minecraft:clay_ball'
  )

  itemReplacementLock(
    'aoa/loot/replacer/r5_spectrum_archaeology_pre_renaissance',
    'the_renaissance',
    [
      'spectrum:nightdew_sprout',
      'spectrum:weeping_gala_sprig'
    ],
    'minecraft:wheat_seeds'
  )

  // Aether entry is Renaissance, but Gold Dungeon, Gravitite/Phoenix rewards,
  // Sun Spirit rewards, and Valkyrie gear are later depth. Prevent dungeon
  // chests or boss drops from handing Gilded/IR Aether rewards forward early.
  itemReplacementLock(
    'aoa/loot/replacer/aether_gilded_rewards_pre_gilded',
    'gilded_age',
    [
      'aether:aerogel',
      'aether:enchanted_gravitite',
      'aether:gravitite_ore',
      'aether:sun_altar',
      'aether:ice_pendant',
      'aether:phoenix_bow',
      'aether:gravitite_axe',
      'aether:gravitite_boots',
      'aether:gravitite_chestplate',
      'aether:gravitite_gloves',
      'aether:gravitite_helmet',
      'aether:gravitite_leggings',
      'aether:gravitite_pickaxe',
      'aether:gravitite_sword',
      'aether:ice_ring',
      'aether:iron_bubble',
      'aether:life_shard',
      'aether:pig_slayer',
      'aether:vampire_blade',
      'aether:phoenix_boots',
      'aether:phoenix_chestplate',
      'aether:phoenix_gloves',
      'aether:phoenix_helmet',
      'aether:phoenix_leggings',
      'aether:gold_dungeon_key',
    ],
    'minecraft:gold_ingot'
  )

  // AStages applies loot restrictions after LootJS. The Valkyrie Queen's
  // guaranteed silver key AND the victory_medal fight-trigger are required
  // Renaissance items (the medal is given to the Queen by right-click USE to start
  // the fight, and drops from lesser Valkyries in the Silver Dungeon), so both must
  // unlock with the chapter rather than being replaced by the later Valkyrie gear lock.
  itemReplacementLock(
    'aoa/loot/replacer/aether_silver_dungeon_key_pre_renaissance',
    'the_renaissance',
    ['aether:silver_dungeon_key', 'aether:victory_medal'],
    'minecraft:iron_ingot'
  )

  itemReplacementLock(
    'aoa/loot/replacer/aether_valkyrie_gear_pre_ir',
    'industrial_revolution',
    [
      'aether:valkyrie_boots',
      'aether:valkyrie_chestplate',
      'aether:valkyrie_gloves',
      'aether:valkyrie_helmet',
      'aether:valkyrie_leggings'
    ],
    'minecraft:iron_ingot'
  )

  // Astral Dimension is Gilded authorization content. These exact rewards can
  // appear through Astral chests or entity drops; replace them if any path leaks
  // before the Gilded stage opens.
  itemReplacementLock(
    'aoa/loot/replacer/astral_dimension_rewards_pre_gilded',
    'gilded_age',
    [
      'astral_dimension:amethyst_key',
      'astral_dimension:astral_dimension',
      'astral_dimension:astral_stone',
      'astral_dimension:astranite_armor_boots',
      'astral_dimension:astranite_armor_chestplate',
      'astral_dimension:astranite_armor_leggings',
      'astral_dimension:astranite_block',
      'astral_dimension:astranite_ingot',
      'astral_dimension:astranite_pickaxe',
      'astral_dimension:astranite_sword',
      'astral_dimension:bouncy_boots',
      'astral_dimension:decay_charge',
      'astral_dimension:lucid_rock',
      'astral_dimension:lucid_upgrade_smithing_template',
      'astral_dimension:raw_astranite',
      'astral_dimension:tormented_boots',
      'astral_dimension:tormented_chestplate',
      'astral_dimension:tormented_helmet',
      'astral_dimension:tormented_leggings',
      'astral_dimension:void_fang',
      'astral_dimension:void_gem',
      'astral_dimension:void_shards'
    ],
    'minecraft:amethyst_shard'
  )

  itemReplacementLock(
    'aoa/loot/replacer/deep_aether_gilded_gear_pre_gilded',
    'gilded_age',
    [
      'deep_aether:skyjade_boots',
      'deep_aether:skyjade_chestplate',
      'deep_aether:skyjade_helmet',
      'deep_aether:skyjade_leggings',
      'deep_aether:stormforged_boots',
      'deep_aether:stormforged_chestplate',
      'deep_aether:stormforged_helmet',
      'deep_aether:stormforged_leggings',
      'deep_aether:aercloud_necklace',
      'deep_aether:brass_dungeon_key',
      'deep_aether:skyjade',
      'deep_aether:bio_crystal',
      'deep_aether:golden_swet_ball',
      'deep_aether:gravitite_ring'
    ],
    'minecraft:amethyst_shard'
  )

  itemReplacementLock(
    'aoa/loot/replacer/nautec_gilded_rewards_pre_gilded',
    'gilded_age',
    [
      'nautec:aquarine_steel_compound',
      'nautec:aquarine_steel_ingot',
      'nautec:damaged_aquatic_chip'
    ],
    'minecraft:prismarine_shard'
  )

  itemReplacementLock(
    'aoa/loot/replacer/industrial_utility_rewards_pre_ir',
    'industrial_revolution',
    [
      'ae2:fluix_crystal',
      'modern_industrialization:basic_machine_hull',
      'pneumaticcraft:advanced_pressure_tube',
      'pneumaticcraft:capacitor',
      'pneumaticcraft:heat_pipe',
      'pneumaticcraft:ingot_iron_compressed',
      'pneumaticcraft:pressure_tube',
      'pneumaticcraft:transistor',
      'pneumaticcraft:vortex_tube'
    ],
    'minecraft:iron_ingot'
  )

  itemReplacementLock(
    'aoa/loot/replacer/renaissance_utility_rewards_pre_renaissance',
    'the_renaissance',
    [
      'sophisticatedbackpacks:diamond_backpack',
      'sophisticatedbackpacks:feeding_upgrade'
    ],
    'minecraft:leather'
  )

  itemReplacementLock(
    'aoa/loot/replacer/iron_casing_pre_gilded',
    'gilded_age',
    ['actuallyadditions:iron_casing'],
    'minecraft:iron_ingot'
  )

  itemReplacementLock(
    'aoa/loot/replacer/bfb_keys_pre_renaissance',
    'the_renaissance',
    [
      'block_factorys_bosses:ancient_trial_key',
      'block_factorys_bosses:underworld_arena_key'
    ],
    'minecraft:iron_nugget',
    1
  )

  // Alex's Caves stays sparse/optional, but these cave materials and relic
  // drops can bypass Atomic hazard/material pacing through blocks, mobs,
  // chests, or Deep One barter before the Atomic stage opens.
  itemReplacementLock(
    'aoa/loot/replacer/alexscaves_atomic_materials_pre_atomic',
    'atomic',
    [
      'alexscaves:uranium_rod',
      'alexscaves:fissile_core',
      'alexscaves:azure_neodymium_ingot',
      'alexscaves:scarlet_neodymium_ingot',
      'alexscaves:raw_azure_neodymium',
      'alexscaves:raw_scarlet_neodymium',
      'alexscaves:telecore',
      'alexscaves:notor_gizmo',
      'alexscaves:magic_conch',
      'alexscaves:ortholance',
      'alexscaves:sea_staff',
      'alexscaves:gazing_pearl',
      'alexscaves:occult_gem',
      'alexscaves:desolate_dagger'
    ],
    'minecraft:cobblestone'
  )

  tagReplacementLock(
    'aoa/loot/replacer/radioactive_material_tags',
    'atomic',
    [
      'c:raw_materials/uranium',
      'c:ingots/uranium',
      'c:nuggets/uranium',
      'c:dusts/uranium',
      'c:plates/uranium',
      'c:storage_blocks/uranium',
      'c:storage_blocks/raw_uranium',
      'c:raw_materials/thorium',
      'c:ingots/thorium',
      'c:nuggets/thorium',
      'c:dusts/thorium',
      'c:plates/thorium',
      'c:storage_blocks/thorium',
      'c:storage_blocks/raw_thorium',
      'c:dusts/fissile',
      'c:dusts/plutonium',
      'c:fuel_rods/heuo2',
      'c:fuel_rods/leuo2',
      'c:fuel_rods/plutonium',
      'c:fuel_rods/spent',
      'c:nuggets/polonium',
      'c:oxide/actinium',
      'c:oxide/plutonium',
      'c:oxides/plutonium',
      'c:pellets/actinium225',
      'c:pellets/lifht4puf3',
      'c:pellets/plutonium',
      'c:pellets/polonium',
      'c:pellets/uranium235',
      'c:pellets/uranium238',
      'c:salts/fissile',
      'c:yellow_cake_uranium'
    ],
    'minecraft:cobblestone'
  )

  itemReplacementLock(
    'aoa/loot/replacer/hazmat_suits_pre_atomic',
    'atomic',
    [
      'mekanism:hazmat_mask',
      'mekanism:hazmat_gown',
      'mekanism:hazmat_pants',
      'mekanism:hazmat_boots',
      'nuclearscience:hazmathelmet',
      'nuclearscience:hazmatplate',
      'nuclearscience:hazmatlegs',
      'nuclearscience:hazmatboots',
      'nuclearscience:reinforcedhazmathelmet',
      'nuclearscience:reinforcedhazmatplate',
      'nuclearscience:reinforcedhazmatlegs',
      'nuclearscience:reinforcedhazmatboots',
      'alexscaves:hazmat_mask',
      'alexscaves:hazmat_chestplate',
      'alexscaves:hazmat_leggings',
      'alexscaves:hazmat_boots'
    ],
    'minecraft:leather'
  )

  tagReplacementLock(
    'aoa/loot/replacer/create_nuclear_hazmat_pre_atomic',
    'atomic',
    ['createnuclear:all_anti_radiation_armors'],
    'minecraft:leather'
  )

  itemReplacementLock(
    'aoa/loot/replacer/oritech_radioactive_items',
    'atomic',
    [
      'oritech:raw_uranium',
      'oritech:uranium_dust',
      'oritech:uranium_gem',
      'oritech:uranium_pellet',
      'oritech:small_uranium_pellet',
      'oritech:plutonium_pellet'
    ],
    'minecraft:cobblestone'
  )

  tagReplacementLock(
    'aoa/loot/replacer/otherworldly_material_tags',
    'otherworldly',
    [
      'c:raw_materials/corronium',
      'c:ingots/corronium',
      'c:nuggets/corronium',
      'c:dusts/corronium',
      'c:plates/corronium',
      'c:storage_blocks/corronium',
      'c:storage_blocks/raw_corronium',
      'c:raw_materials/desh',
      'c:ingots/desh',
      'c:nuggets/desh',
      'c:dusts/desh',
      'c:plates/desh',
      'c:storage_blocks/desh',
      'c:storage_blocks/raw_desh',
      'c:raw_materials/ostrum',
      'c:ingots/ostrum',
      'c:nuggets/ostrum',
      'c:dusts/ostrum',
      'c:plates/ostrum',
      'c:storage_blocks/ostrum',
      'c:storage_blocks/raw_ostrum',
      'c:raw_materials/solerium',
      'c:ingots/solerium',
      'c:nuggets/solerium',
      'c:dusts/solerium',
      'c:plates/solerium',
      'c:storage_blocks/solerium',
      'c:storage_blocks/raw_solerium',
      'c:raw_materials/tharsite',
      'c:ingots/tharsite',
      'c:nuggets/tharsite',
      'c:dusts/tharsite',
      'c:plates/tharsite',
      'c:storage_blocks/tharsite',
      'c:storage_blocks/raw_tharsite'
    ],
    'minecraft:prismarine_shard'
  )

  itemReplacementLock(
    'aoa/loot/replacer/ad_astra_otherworldly_items',
    'otherworldly',
    [
      'ad_astra:raw_desh',
      'ad_astra:raw_ostrum',
      'ad_astra:raw_calorite',
      'ad_astra:desh_ingot',
      'ad_astra:ostrum_ingot',
      'ad_astra:calorite_ingot',
      'ad_astra:ice_shard'
    ],
    'minecraft:prismarine_shard'
  )

  // Goety learned-spell scrolls leak into structure chests (vanilla and
  // Goety's own) before the Renaissance dark-arts stage opens (haunting ->
  // crypt_book/crypt_tomb, warred -> ancient_city/stronghold_library,
  // ravaging -> woodland_mansion, front/buried -> desert_pyramid, floral ->
  // jungle_temple, mistral -> shrine_treasure).
  // dark_scroll and bygone_scroll ship no loot entry but are covered here for
  // scroll-family completeness. Replace any pre-Renaissance drop with paper.
  itemReplacementLock(
    'aoa/loot/replacer/goety_scrolls_pre_renaissance',
    'the_renaissance',
    [
      'goety:haunting_scroll',
      'goety:warred_scroll',
      'goety:ravaging_scroll',
      'goety:front_scroll',
      'goety:floral_scroll',
      'goety:buried_scroll',
      'goety:mistral_scroll',
      'goety:dark_scroll',
      'goety:bygone_scroll'
    ],
    'minecraft:paper',
    1
  )

  // Goety forbidden upgrade materials leak heavily (forbidden_piece in 17 tables
  // incl. archaeology/buried_ritual and crypt chests, forbidden_fragment in
  // crypt_tomb). forbidden_scroll ships no loot entry but rides the same Gilded
  // gate. Replace any pre-Gilded drop with an amethyst shard.
  itemReplacementLock(
    'aoa/loot/replacer/goety_forbidden_materials_pre_gilded',
    'gilded_age',
    [
      'goety:forbidden_piece',
      'goety:forbidden_fragment',
      'goety:forbidden_scroll'
    ],
    'minecraft:amethyst_shard'
  )

  // Goety cursed paladin armour set and the frozen_blade drop from the crypt_tomb
  // chest. Replace any pre-Gilded drop with iron, matching the netherite/valkyrie
  // gear replacement convention above.
  itemReplacementLock(
    'aoa/loot/replacer/goety_cursed_paladin_pre_gilded',
    'gilded_age',
    [
      'goety:cursed_paladin_helmet',
      'goety:cursed_paladin_chestplate',
      'goety:cursed_paladin_leggings',
      'goety:cursed_paladin_boots',
      'goety:frozen_blade'
    ],
    'minecraft:iron_ingot'
  )
})()
