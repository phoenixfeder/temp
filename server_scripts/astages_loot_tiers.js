;(function () {
  if (typeof AStages === 'undefined') {
    // AStages owns stage-aware loot restrictions; skip if the API is unavailable.
    return
  }

  const lootIntegrationBuckets = [
    'lootintegrations:chests/easy',
    'lootintegrations:chests/medium',
    'lootintegrations:chests/hard',
    'lootintegrations:chests/nether',
    'lootintegrations:chests/village',
    'lootintegrations:chests/water'
  ]

  const generatedLootTables = lootIntegrationBuckets.concat([
    'ae2:gameplay/hero_of_the_village/fluix_researcher_gifts',
    'alexsmobs:gameplay/transmutation_table_rare',
    'apothic_enchanting:boon_stone_drops',
    'astral_dimension:chests/astral_dungeon_loot',
    'ati_structures:chests/vegetation',
    'incendium:sanctum/lower_loot',
    'oritechthings:entities/amethyst_fish'
  ])

  const majorGemLootTags = [
    'c:gems/diamond',
    'c:gems/emerald'
  ]

  const renaissanceGemLootTags = [
    'c:gems/certus_quartz',
    'c:gems/fluix',
    'c:gems/ambrosium',
    'c:gems/zanite',
    'c:gems/skyjade',
    'c:gems/starlit_diamond',
    'c:gems/starcore',
    'c:gems/utherium',
    'c:gems/regalium',
    'c:gems/arcane_crystal',
    'c:gems/corrupted_arcane_crystal',
    'c:gems/sal_ammoniac'
  ]

  const renaissanceGemLootItems = []

  function configureLootRestriction(restriction) {
    // Keep AStages restrictions focused on generated/container loot only.
    // Normal block drops like ore mining stay out of this generated/container loot layer.
    restrictLootTables(restriction, generatedLootTables)
    return restriction
  }

  function restrictLootTags(restriction, tags) {
    tags.forEach(tag => restriction.restrictTags(tag))
    return restriction
  }

  // Before medieval: keep early treasure from handing out major gem skips.
  // Do NOT gate normal ore drops, low-tier metals, or broad progression here.
  restrictLootTags(
    configureLootRestriction(AStages.addRestrictionForLoot('pack/loot/requires_medieval_times', 'medieval_times')),
    majorGemLootTags
  )

  // Before renaissance: no diamond/emerald or known late-gem jackpot spikes.
  restrictLootItems(
    restrictLootTags(
      configureLootRestriction(AStages.addRestrictionForLoot('pack/loot/requires_the_renaissance', 'the_renaissance')),
      majorGemLootTags.concat(renaissanceGemLootTags)
    ),
    renaissanceGemLootItems
  )

  // Before renaissance: no advanced tech materials/components.
  configureLootRestriction(AStages.addRestrictionForLoot('pack/loot/requires_the_renaissance_advanced', 'the_renaissance'))
    .restrictTags(
      'c:alloys',
      'c:circuits'
    )

  // Before renaissance: no golden-food jackpot spikes.
  configureLootRestriction(AStages.addRestrictionForLoot('pack/loot/requires_the_renaissance_endgame', 'the_renaissance'))
    .restrictTags(
      'c:foods/golden'
    )

  function restrictLootItems(restriction, items) {
    items.forEach(item => restriction.restrictItems(item))
    return restriction
  }

  function restrictLootTables(restriction, tables) {
    tables.forEach(table => restriction.restrictForLootTables(table))
    return restriction
  }

  function configureTableLootRestriction(id, stage, items, tables) {
    const restriction = configureLootRestriction(AStages.addRestrictionForLoot(id, stage))
    restrictLootItems(restriction, items)
    restrictLootTables(restriction, tables)
    return restriction
  }

  configureTableLootRestriction(
    'aoa/loot/requires_atomic_fluxite',
    'atomic',
    ['oritech:fluxite'],
    ['oritechthings:entities/amethyst_fish'].concat(lootIntegrationBuckets)
  )

  configureTableLootRestriction(
    'aoa/loot/requires_gilded_astral_eye',
    'gilded_age',
    ['astral_dimension:astral_eye'],
    ['astral_dimension:chests/astral_dungeon_loot'].concat(lootIntegrationBuckets)
  )

  configureTableLootRestriction(
    'aoa/loot/requires_renaissance_emerald_spikes',
    'the_renaissance',
    [
      'minecraft:deepslate_emerald_ore',
      'minecraft:emerald',
      'minecraft:emerald_block',
      'minecraft:emerald_ore'
    ],
    [
      'ati_structures:chests/vegetation',
      'alexsmobs:gameplay/transmutation_table_rare',
      'incendium:sanctum/lower_loot',
      'apothic_enchanting:boon_stone_drops'
    ].concat(lootIntegrationBuckets)
  )

  configureTableLootRestriction(
    'aoa/loot/requires_industrial_sky_stone',
    'industrial_revolution',
    ['ae2:sky_stone_block'],
    ['ae2:gameplay/hero_of_the_village/fluix_researcher_gifts'].concat(lootIntegrationBuckets)
  )

  // lootintegrations_cataclysm injects raw Cataclysm boss loot into vanilla
  // chest pools with no age gate (cataclysm_questline_verification_2026-08-05
  // F1). Tier each proof/trophy item to the age of the boss that drops it.
  configureTableLootRestriction(
    'aoa/loot/requires_industrial_cataclysm_proofs',
    'industrial_revolution',
    [
      'cataclysm:gauntlet_of_guard',
      'cataclysm:infernal_forge',
      'cataclysm:monstrous_horn'
    ],
    lootIntegrationBuckets
  )

  configureTableLootRestriction(
    'aoa/loot/requires_gilded_cataclysm_proofs',
    'gilded_age',
    [
      'cataclysm:remnant_skull',
      'cataclysm:sandstorm_in_a_bottle',
      'cataclysm:witherite_block'
    ],
    lootIntegrationBuckets
  )

  configureTableLootRestriction(
    'aoa/loot/requires_otherworldly_cataclysm_proofs',
    'otherworldly',
    [
      'cataclysm:abyssal_egg',
      'cataclysm:ignitium_ingot',
      'cataclysm:tidal_claws'
    ],
    lootIntegrationBuckets
  )
})()
