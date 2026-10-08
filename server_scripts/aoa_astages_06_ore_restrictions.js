;(function () {
  if (typeof AStages === 'undefined') return

  const STONE = 'minecraft:stone'
  const DEEPSLATE = 'minecraft:deepslate'
  const TUFF = 'minecraft:tuff'
  const ANDESITE = 'minecraft:andesite'
  const DIORITE = 'minecraft:diorite'
  const NETHERRACK = 'minecraft:netherrack'
  const END_STONE = 'minecraft:end_stone'

  const seenOres = {}
  const seenItems = {}
  const seenTags = {}
  const lootItemsByStage = {}
  const lootTagsByStage = {}

  // Mirror of every ore-disguise row, consumed by
  // aoa_astages_15_ore_drop_bypass_guard.js. Declared in
  // startup_scripts/aoa_astages_reload_guard.js because KubeJS rejects global
  // ASSIGNMENT in server scripts; mutation is fine, which is why this clears
  // in place. Without the clear, a row deleted from this file would linger in
  // the table until the next client launch.
  const oreDisguiseTable = global.aoaOreDisguiseTable
  if (oreDisguiseTable) {
    Object.keys(oreDisguiseTable).forEach(function (key) { delete oreDisguiseTable[key] })
  } else {
    console.error('[AoA AStages] global.aoaOreDisguiseTable was not initialized by startup_scripts/aoa_astages_reload_guard.js - the AoE drop guard will not arm')
  }

  function safeId(value) {
    return value.replace(/[^a-zA-Z0-9_]/g, '_')
  }

  function applyOreItemPolicy(restriction) {
    // AStages 2.5 defaults keep ore items unusable, hidden in EMI, and anonymous,
    // while block interaction remains allowed so players can place against the
    // disguised ore block. The ore restriction itself still blocks harvesting.
    return restriction
      .allowInventoryStorage()
      .allowContainerStorage()
      .allowPickup()
  }

  function addLootItem(stage, item) {
    if (!lootItemsByStage[stage]) lootItemsByStage[stage] = {}
    lootItemsByStage[stage][item] = true
  }

  function addLootTag(stage, tag) {
    if (!lootTagsByStage[stage]) lootTagsByStage[stage] = {}
    lootTagsByStage[stage][tag] = true
  }

  function softItemLock(stage, item, kind) {
    const key = stage + '|' + item
    if (seenItems[key]) return
    seenItems[key] = true

    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages ore] Skipped missing item ' + item + ' (' + kind + ', stage=' + stage + ')')
      return
    }
    const id = 'aoa/ore_item/' + kind + '/' + stage + '/' + safeId(item)
    try {
      applyOreItemPolicy(AStages.addRestrictionForItem(id, stage, item))
    } catch (e) {
      console.warn('[AoA AStages ore] Skipped item ' + item + ' (' + kind + ', stage=' + stage + '): ' + e)
      return
    }
    // Only record for the loot layer once the lock actually registered, so the
    // addRestrictionForLoot loop below can never receive an unresolvable id.
    addLootItem(stage, item)
  }

  function softTagLock(stage, tag, kind) {
    const key = stage + '|' + tag
    if (seenTags[key]) return
    seenTags[key] = true

    const id = 'aoa/ore_tag/' + kind + '/' + stage + '/' + safeId(tag)
    try {
      applyOreItemPolicy(AStages.addRestrictionForTag(id, stage, tag))
    } catch (e) {
      console.warn('[AoA AStages ore] Skipped tag ' + tag + ' (' + kind + ', stage=' + stage + '): ' + e)
      return
    }
    addLootTag(stage, tag)
  }

  function addOreRestriction(stage, ore, replacement, options) {
    options = options || {}
    const id = options.id || 'aoa/ore_visibility/' + stage + '/' + safeId(ore)
    const key = id
    if (seenOres[key]) return
    seenOres[key] = true

    // Per-row guard. KubeJS coerces these id strings into BlockState, and
    // BlockWrapper.parseBlockState THROWS IllegalArgumentException on an
    // unresolvable id rather than falling back to air (bytecode-verified in
    // kubejs-neoforge-2101.7.2-build.374). This file is one IIFE whose LAST
    // statement is the addRestrictionForLoot loop, so a single bad id used to
    // take out the ore-loot bypass layer for EVERY stage and leave
    // global.aoaOreDisguiseTable half-populated for file 15's AoE drop guard.
    // That exact loss already happened once here (commit d5ff996d).
    // Skip only the offending row, and say so loudly. Never wrap the whole file
    // in one try/catch - that just recreates first-throw-kills-the-rest.
    var restriction
    try {
      restriction = AStages.addRestrictionForOre(id, stage, ore, replacement)
        .matchAllBlockStates()
        .affectPlayerActions()
    } catch (e) {
      console.warn('[AoA AStages ore] Skipped missing ore ' + ore + ' -> ' + replacement + ' (stage=' + stage + '): ' + e)
      return
    }

    if (typeof options.priority === 'number') restriction.setPriority(options.priority)
    if (options.lockOreItem !== false) softItemLock(stage, ore, 'silk_touch_block')

    // Record the row for the AoE drop guard. Rhino: var, not const/let - this
    // runs inside forEach callbacks.
    if (oreDisguiseTable) {
      var rows = oreDisguiseTable[ore]
      if (!rows) { rows = []; oreDisguiseTable[ore] = rows }
      rows.push({
        stage: stage,
        replacement: replacement,
        // AStages orders applicable restrictions by DESCENDING priority
        // (ARestriction.compareTo negates Integer.compare). Rows without an
        // explicit priority are the only row for their ore, so 0 is safe.
        priority: (typeof options.priority === 'number') ? options.priority : 0
      })
    }
  }

  function addLayeredOreRestriction(finalStage, originalOre, earlyStage, earlyReplacement, earlyPriority, finalTraceReplacement, finalTracePriority, companionItems, companionTags) {
    addOreRestriction(earlyStage, originalOre, earlyReplacement, {
      id: 'aoa/ore_reveal/pre_' + earlyStage + '/' + safeId(originalOre),
      priority: earlyPriority,
      lockOreItem: false
    })
    addOreRestriction(finalStage, originalOre, finalTraceReplacement, {
      id: 'aoa/ore_reveal/pre_' + finalStage + '/' + safeId(originalOre),
      priority: finalTracePriority
    })
    ;(companionItems || []).forEach(function (item) {
      softItemLock(finalStage, item, 'layered_companion')
    })
    ;(companionTags || []).forEach(function (tag) {
      softTagLock(finalStage, tag, 'material')
    })
  }

  function addPrefixedOreSet(stage, namespace, material, prefixes) {
    prefixes.forEach(function (entry) {
      addOreRestriction(stage, namespace + ':' + entry[0] + material + '_ore', entry[1])
    })
  }

  function addAllTheOres(stage, materials) {
    const prefixes = [['', STONE], ['deepslate_', DEEPSLATE], ['nether_', NETHERRACK], ['end_', END_STONE], ['other_', STONE]]
    materials.forEach(function (material) {
      addPrefixedOreSet(stage, 'alltheores', material, prefixes)
    })
  }

  function addMekanism(stage, materials) {
    const prefixes = [['', STONE], ['deepslate_', DEEPSLATE]]
    materials.forEach(function (material) {
      addPrefixedOreSet(stage, 'mekanism', material, prefixes)
    })
  }

  function addModernIndustrialization(stage, materials) {
    const prefixes = [['', STONE], ['deepslate_', DEEPSLATE]]
    materials.forEach(function (material) {
      addPrefixedOreSet(stage, 'modern_industrialization', material, prefixes)
    })
  }

  function addCreate(stage, materials) {
    const prefixes = [['', STONE], ['deepslate_', DEEPSLATE]]
    materials.forEach(function (material) {
      addPrefixedOreSet(stage, 'create', material, prefixes)
    })
  }

  function addEvolvedMekanism(stage, materials) {
    const prefixes = [
      ['netherrack_', NETHERRACK],
      ['end_stone_', END_STONE],
      ['holystone_', 'aether:holystone'],
      ['depthrock_', 'undergarden:depthrock'],
      ['shiverstone_', 'undergarden:shiverstone']
    ]
    materials.forEach(function (material) {
      addPrefixedOreSet(stage, 'evolvedmekanism', material, prefixes)
    })
  }

  function addElectrodynamics(stage, materials) {
    materials.forEach(function (material) {
      addOreRestriction(stage, 'electrodynamics:ore' + material, STONE)
      addOreRestriction(stage, 'electrodynamics:deepslateore' + material, DEEPSLATE)
    })
  }

  function addChemicalSciencePlanet(stage, materials) {
    const planets = [
      ['moon', 'ad_astra:moon_stone'],
      ['mars', 'ad_astra:mars_stone'],
      ['venus', 'ad_astra:venus_stone'],
      ['mercury', 'ad_astra:mercury_stone']
    ]
    materials.forEach(function (material) {
      planets.forEach(function (planet) {
        addOreRestriction(stage, 'chemicalscience:ore_' + material + '_' + planet[0], planet[1])
      })
    })
  }

  // Ad Astra replaced Stellaris (2026-08-30). Every ore Ad Astra generates off
  // Earth is listed here, host block included, so this is the single planet-ore
  // row. Do not re-add per-planet rows further down the file.
  function addAdAstra(stage) {
    const planetOres = [
      ['ad_astra:moon_desh_ore', 'ad_astra:moon_stone'],
      ['ad_astra:moon_iron_ore', 'ad_astra:moon_stone'],
      ['ad_astra:moon_ice_shard_ore', 'ad_astra:moon_stone'],
      ['ad_astra:moon_cheese_ore', 'ad_astra:moon_stone'],
      ['ad_astra:mars_ostrum_ore', 'ad_astra:mars_stone'],
      ['ad_astra:mars_iron_ore', 'ad_astra:mars_stone'],
      ['ad_astra:mars_ice_shard_ore', 'ad_astra:mars_stone'],
      ['ad_astra:mars_diamond_ore', 'ad_astra:mars_stone'],
      ['ad_astra:venus_calorite_ore', 'ad_astra:venus_stone'],
      ['ad_astra:venus_gold_ore', 'ad_astra:venus_stone'],
      ['ad_astra:venus_coal_ore', 'ad_astra:venus_stone'],
      ['ad_astra:venus_diamond_ore', 'ad_astra:venus_stone'],
      ['ad_astra:mercury_iron_ore', 'ad_astra:mercury_stone'],
      ['ad_astra:glacio_iron_ore', 'ad_astra:glacio_stone'],
      ['ad_astra:glacio_coal_ore', 'ad_astra:glacio_stone'],
      ['ad_astra:glacio_copper_ore', 'ad_astra:glacio_stone'],
      ['ad_astra:glacio_lapis_ore', 'ad_astra:glacio_stone'],
      ['ad_astra:glacio_ice_shard_ore', 'ad_astra:glacio_stone'],
      ['ad_astra:deepslate_desh_ore', DEEPSLATE],
      ['ad_astra:deepslate_ostrum_ore', DEEPSLATE],
      ['ad_astra:deepslate_calorite_ore', DEEPSLATE],
      ['ad_astra:deepslate_ice_shard_ore', DEEPSLATE]
    ]
    planetOres.forEach(function (entry) {
      addOreRestriction(stage, entry[0], entry[1])
    })
  }

  function addUndergarden(stage) {
    const ores = [
      ['undergarden:depthrock_cloggrum_ore', 'undergarden:depthrock'],
      ['undergarden:depthrock_diamond_ore', 'undergarden:depthrock'],
      ['undergarden:depthrock_regalium_ore', 'undergarden:depthrock'],
      ['undergarden:depthrock_utherium_ore', 'undergarden:depthrock'],
      ['undergarden:shiverstone_cloggrum_ore', 'undergarden:shiverstone'],
      ['undergarden:shiverstone_diamond_ore', 'undergarden:shiverstone'],
      ['undergarden:shiverstone_froststeel_ore', 'undergarden:shiverstone'],
      ['undergarden:shiverstone_regalium_ore', 'undergarden:shiverstone'],
      ['undergarden:shiverstone_utherium_ore', 'undergarden:shiverstone'],
      ['undergarden:dreadrock_rogdorium_ore', 'undergarden:dreadrock'],
      ['undergarden:dreadrock_utherium_ore', 'undergarden:dreadrock'],
      ['undergarden:tremblecrust_utherium_ore', 'undergarden:tremblecrust']
    ]
    ores.forEach(function (entry) {
      addOreRestriction(stage, entry[0], entry[1])
    })
  }

  function addAether(stage) {
    ;['ambrosium', 'zanite'].forEach(function (material) {
      addOreRestriction(stage, 'aether:' + material + '_ore', 'aether:holystone')
    })
  }

  function addSourceMaterialTags(stage, material) {
    ;['ores', 'raw_materials', 'ingots'].forEach(function (family) {
      softTagLock(stage, 'c:' + family + '/' + material, 'material')
    })
  }

  function addAdvancedMaterialTags(stage, material) {
    ;['ores', 'raw_materials', 'ingots', 'nuggets', 'dusts', 'dirty_dusts', 'impuredusts', 'crushed_raw_materials', 'clumps', 'crystals', 'shards', 'plates', 'gears', 'rods'].forEach(function (family) {
      softTagLock(stage, 'c:' + family + '/' + material, 'material')
    })
    softTagLock(stage, 'c:storage_blocks/' + material, 'material')
    softTagLock(stage, 'c:storage_blocks/raw_' + material, 'material')
  }

  function addDirectItems(stage, items, kind) {
    items.forEach(function (item) {
      softItemLock(stage, item, kind)
    })
  }

  function addAuditV4OreRows(stage, replacement, ores) {
    ores.forEach(function (ore) {
      addOreRestriction(stage, ore, replacement, { id: 'aoa/ore_visibility/v4_audit/' + stage + '/' + safeId(ore) })
    })
  }

  function addOreGatingAuditV4Fixes() {
    // Coal and copper stay visible before medieval_times: entering_the_iron_era requires them before it awards that stage.
    const intentionallyOpenVanillaStarterOres = [
      'minecraft:coal_ore',
      'minecraft:copper_ore',
      'minecraft:deepslate_coal_ore',
      'minecraft:deepslate_copper_ore',
    ]
    intentionallyOpenVanillaStarterOres.forEach(function (ore) { seenOres['vanilla_policy_open|' + ore] = true })

    // Draconic Evolution base+wyvern tier moved ascension->otherworldly (see
    // aoa_astages_01n_ascension.js); these ore rows were missed in that move,
    // which hardlocked ow3_dragon_technology (the chapter needs draconium at OW
    // while the ore stayed disguised until ascension). Retiered 2026-07-02.
    addAuditV4OreRows('otherworldly', 'minecraft:deepslate', [
      'draconicevolution:deepslate_draconium_ore',
    ])

    addAuditV4OreRows('otherworldly', 'minecraft:end_stone', [
      'draconicevolution:end_draconium_ore',
    ])

    addAuditV4OreRows('otherworldly', 'minecraft:netherrack', [
      'draconicevolution:nether_draconium_ore',
    ])

    addAuditV4OreRows('otherworldly', 'minecraft:stone', [
      'draconicevolution:overworld_draconium_ore',
    ])

    addAuditV4OreRows('atomic', STONE, [
      'macabre:blood_clot_ore',
      'macabre:fat_ore',
      'macabre:ferrum_ore',
      'macabre:plasma_ore',
      'macabre:abhorrent_ore',
      'macabre:vilore',
    ])

    addAuditV4OreRows('atomic', 'minecraft:deepslate', [
      'alltheores:deepslate_fluorite_ore',
      'createnuclear:deepslate_uranium_ore',
      'immersiveengineering:deepslate_ore_uranium',
    ])

    addAuditV4OreRows('atomic', 'minecraft:end_stone', [
      'alltheores:end_fluorite_ore',
    ])

    addAuditV4OreRows('atomic', 'minecraft:netherrack', [
      'alltheores:nether_fluorite_ore',
    ])

    addAuditV4OreRows('atomic', 'minecraft:stone', [
      'alexscaves:radrock_uranium_ore',
      'alltheores:fluorite_ore',
      'alltheores:other_fluorite_ore',
      'chemicalscience:ore_fluorite_mars',
      'chemicalscience:ore_fluorite_mercury',
      'chemicalscience:ore_fluorite_moon',
      'chemicalscience:ore_fluorite_venus',
      'chemicalscience:ore_monazite_mars',
      'chemicalscience:ore_monazite_mercury',
      'chemicalscience:ore_monazite_moon',
      'chemicalscience:ore_monazite_venus',
      'create_new_age:thorium_ore',
      'createnuclear:uranium_ore',
      'immersiveengineering:ore_uranium',
    ])

    addAuditV4OreRows('gilded_age', 'minecraft:deepslate', [
      'alltheores:deepslate_iridium_ore',
    ])

    addAuditV4OreRows('gilded_age', 'minecraft:end_stone', [
      'alltheores:end_iridium_ore',
    ])

    addAuditV4OreRows('gilded_age', 'minecraft:netherrack', [
      'alltheores:nether_iridium_ore',
    ])

    addAuditV4OreRows('gilded_age', 'minecraft:stone', [
      'alltheores:iridium_ore',
      'alltheores:other_iridium_ore',
      'astral_dimension:astranite_ore',
      'astral_dimension:void_ore',
      'modern_industrialization:iridium_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'deeperdarker:gloomslate', [
      'deeperdarker:gloomslate_redstone_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'deeperdarker:sculk_stone', [
      'deeperdarker:sculk_stone_redstone_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'eternal_starlight:eternal_ice', [
      'eternal_starlight:eternal_ice_redstone_ore',
      'eternal_starlight:eternal_ice_saltpeter_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'eternal_starlight:grimstone', [
      'eternal_starlight:grimstone_redstone_ore',
      'eternal_starlight:grimstone_saltpeter_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'eternal_starlight:haze_ice', [
      'eternal_starlight:haze_ice_redstone_ore',
      'eternal_starlight:haze_ice_saltpeter_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'minecraft:deepslate', [
      'alltheores:deepslate_salt_ore',
      'alltheores:deepslate_sulfur_ore',
      'chemicalscience:ore_deepslate_arsenopyrite',
      'chemicalscience:ore_deepslate_cooperite',
      'chemicalscience:ore_deepslate_magnesium',
      'chemicalscience:ore_deepslate_pyrolusite',
      'chemicalscience:ore_deepslate_silicon',
      'chemicalscience:ore_deepslate_sourcerock',
      'chemicalscience:ore_deepslate_wolframite',
      'createpropulsion:deepslate_platinum_ore',
      'electrodynamics:deepslateorechromium',
      'electrodynamics:deepslateorelithium',
      'electrodynamics:deepslateoremolybdenum',
      'electrodynamics:deepslateoreniter',
      'electrodynamics:deepslateoresalt',
      'electrodynamics:deepslateoresulfur',
      'electrodynamics:deepslateoresylvite',
      'electrodynamics:deepslateoretitanium',
      'electrodynamics:deepslateorevanadium',
      'immersiveengineering:deepslate_ore_aluminum',
      'modern_industrialization:deepslate_lignite_coal_ore',
      'modern_industrialization:deepslate_salt_ore',
      'projectred_exploration:deepslate_electrotine_ore',
      'projectred_exploration:deepslate_tin_ore',
      'theurgy:deepslate_sal_ammoniac_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'minecraft:end_stone', [
      'alltheores:end_salt_ore',
      'alltheores:end_sulfur_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'minecraft:netherrack', [
      'alltheores:nether_salt_ore',
      'alltheores:nether_sulfur_ore',
      'betternether:nether_redstone_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'minecraft:stone', [
      'alltheores:other_salt_ore',
      'alltheores:other_sulfur_ore',
      'alltheores:salt_ore',
      'alltheores:sulfur_ore',
      'chemicalscience:ore_aluminum_mars',
      'chemicalscience:ore_aluminum_mercury',
      'chemicalscience:ore_aluminum_moon',
      'chemicalscience:ore_aluminum_venus',
      'chemicalscience:ore_arsenopyrite',
      'chemicalscience:ore_arsenopyrite_mars',
      'chemicalscience:ore_arsenopyrite_mercury',
      'chemicalscience:ore_arsenopyrite_moon',
      'chemicalscience:ore_arsenopyrite_venus',
      'chemicalscience:ore_chromium_mars',
      'chemicalscience:ore_chromium_mercury',
      'chemicalscience:ore_chromium_moon',
      'chemicalscience:ore_chromium_venus',
      'chemicalscience:ore_cooperite',
      'chemicalscience:ore_cooperite_mars',
      'chemicalscience:ore_cooperite_mercury',
      'chemicalscience:ore_cooperite_moon',
      'chemicalscience:ore_cooperite_venus',
      'chemicalscience:ore_lithium_mars',
      'chemicalscience:ore_lithium_mercury',
      'chemicalscience:ore_lithium_moon',
      'chemicalscience:ore_lithium_venus',
      'chemicalscience:ore_magnesium',
      'chemicalscience:ore_magnesium_mars',
      'chemicalscience:ore_magnesium_mercury',
      'chemicalscience:ore_magnesium_moon',
      'chemicalscience:ore_magnesium_venus',
      'chemicalscience:ore_molybdenum_mars',
      'chemicalscience:ore_molybdenum_mercury',
      'chemicalscience:ore_molybdenum_moon',
      'chemicalscience:ore_molybdenum_venus',
      'chemicalscience:ore_niter_mars',
      'chemicalscience:ore_niter_mercury',
      'chemicalscience:ore_niter_moon',
      'chemicalscience:ore_niter_venus',
      'chemicalscience:ore_pyrolusite',
      'chemicalscience:ore_pyrolusite_mars',
      'chemicalscience:ore_pyrolusite_mercury',
      'chemicalscience:ore_pyrolusite_moon',
      'chemicalscience:ore_pyrolusite_venus',
      'chemicalscience:ore_salt_mars',
      'chemicalscience:ore_salt_mercury',
      'chemicalscience:ore_salt_moon',
      'chemicalscience:ore_salt_venus',
      'chemicalscience:ore_silicon',
      'chemicalscience:ore_silicon_mars',
      'chemicalscience:ore_silicon_mercury',
      'chemicalscience:ore_silicon_moon',
      'chemicalscience:ore_silicon_venus',
      'chemicalscience:ore_sourcerock',
      'chemicalscience:ore_sulfur_mars',
      'chemicalscience:ore_sulfur_mercury',
      'chemicalscience:ore_sulfur_moon',
      'chemicalscience:ore_sulfur_venus',
      'chemicalscience:ore_sylvite_mars',
      'chemicalscience:ore_sylvite_mercury',
      'chemicalscience:ore_sylvite_moon',
      'chemicalscience:ore_sylvite_venus',
      'chemicalscience:ore_tin_mars',
      'chemicalscience:ore_tin_mercury',
      'chemicalscience:ore_tin_moon',
      'chemicalscience:ore_tin_venus',
      'chemicalscience:ore_titanium_mars',
      'chemicalscience:ore_titanium_mercury',
      'chemicalscience:ore_titanium_moon',
      'chemicalscience:ore_titanium_venus',
      'chemicalscience:ore_vanadium_mars',
      'chemicalscience:ore_vanadium_mercury',
      'chemicalscience:ore_vanadium_moon',
      'chemicalscience:ore_vanadium_venus',
      'chemicalscience:ore_wolframite',
      'chemicalscience:ore_wolframite_mars',
      'chemicalscience:ore_wolframite_mercury',
      'chemicalscience:ore_wolframite_moon',
      'chemicalscience:ore_wolframite_venus',
      'createpropulsion:platinum_ore',
      'electrodynamics:orechromium',
      'electrodynamics:orelithium',
      'electrodynamics:oremolybdenum',
      'electrodynamics:oreniter',
      'electrodynamics:oresalt',
      'electrodynamics:oresulfur',
      'electrodynamics:oresylvite',
      'electrodynamics:oretitanium',
      'electrodynamics:orevanadium',
      'immersiveengineering:ore_aluminum',
      'modern_industrialization:lignite_coal_ore',
      'modern_industrialization:salt_ore',
      'projectred_exploration:electrotine_ore',
      'projectred_exploration:tin_ore',
      'theurgy:sal_ammoniac_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'spectrum:blackslag', [
      'spectrum:blackslag_redstone_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'deeperdarker:gloomslate', [
      'deeperdarker:gloomslate_gold_ore',
      'deeperdarker:gloomslate_iron_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'deeperdarker:sculk_stone', [
      'deeperdarker:sculk_stone_gold_ore',
      'deeperdarker:sculk_stone_iron_ore',
    ])

    addAuditV4OreRows('medieval_times', 'minecraft:deepslate', [
      'minecraft:deepslate_gold_ore',
      'minecraft:deepslate_iron_ore',
      'minecraft:deepslate_redstone_ore',
    ])

    addAuditV4OreRows('medieval_times', 'minecraft:stone', [
      'alexscaves:galena_iron_ore',
      'alexscaves:guanostone_redstone_ore',
      'minecraft:gold_ore',
      'minecraft:iron_ore',
      'minecraft:redstone_ore',
    ])

    addAuditV4OreRows('medieval_times', 'minecraft:netherrack', [
      'malum:cthonic_gold_ore',
      'minecraft:nether_gold_ore',
    ])

    addAuditV4OreRows('medieval_times', 'spectrum:blackslag', [
      'spectrum:blackslag_gold_ore',
      'spectrum:blackslag_iron_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'undergarden:depthrock', [
      'undergarden:depthrock_gold_ore',
      'undergarden:depthrock_iron_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'undergarden:shiverstone', [
      'undergarden:shiverstone_iron_ore',
    ])

    // astral_dimension ores live inside the Gilded-gated dimension.
    // The ore SOURCE stage wins over the material-output stage (gold being
    // generic doesn't promote the Astral source block to Medieval). Keeping
    // these aligned with the dimension gate in
    // aoa_astages_03_dimension_restrictions.js.
    addAuditV4OreRows('gilded_age', 'astral_dimension:astral_stone', [
      'astral_dimension:astral_gold_ore',
      'astral_dimension:astral_coal_ore',
    ])

    addAuditV4OreRows('otherworldly', 'eternal_starlight:voidstone', [
      'eternal_starlight:voidstone_deepsilver_ore',
      'eternal_starlight:voidstone_malarite_ore',
      'eternal_starlight:voidstone_redstone_ore',
      'eternal_starlight:voidstone_saltpeter_ore',
      'eternal_starlight:voidstone_starcore_ore',
      'eternal_starlight:voidstone_starlit_diamond_ore',
    ])

    // Better End ores unlock with the End itself (the_renaissance, astages_03):
    // ender_dust and thallasium are hard inputs of the Ren/IR terminite and
    // crystalite quest asks (end_cluster_bundle_verification_2026-08-05 BE-1).
    // Do NOT fold these back into the otherworldly row below - iesnium
    // must stay OW.
    addAuditV4OreRows('the_renaissance', 'minecraft:stone', [
      'betterend:amber_ore',
      'betterend:ender_ore',
      'betterend:thallasium_ore',
    ])

    addAuditV4OreRows('otherworldly', 'minecraft:stone', [
      'occultism:iesnium_ore',
      'occultism:iesnium_ore_natural',
    ])

    addAuditV4OreRows('gilded_age', 'aether:holystone', [
      'deep_aether:skyjade_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'deeperdarker:gloomslate', [
      'deeperdarker:gloomslate_coal_ore',
      'deeperdarker:gloomslate_copper_ore',
      'deeperdarker:gloomslate_diamond_ore',
      'deeperdarker:gloomslate_emerald_ore',
      'deeperdarker:gloomslate_lapis_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'deeperdarker:sculk_stone', [
      'deeperdarker:sculk_stone_coal_ore',
      'deeperdarker:sculk_stone_copper_ore',
      'deeperdarker:sculk_stone_diamond_ore',
      'deeperdarker:sculk_stone_emerald_ore',
      'deeperdarker:sculk_stone_lapis_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'eternal_starlight:eternal_ice', [
      'eternal_starlight:eternal_ice_deepsilver_ore',
      'eternal_starlight:eternal_ice_starcore_ore',
      'eternal_starlight:eternal_ice_starlit_diamond_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'eternal_starlight:grimstone', [
      'eternal_starlight:grimstone_deepsilver_ore',
      'eternal_starlight:grimstone_malarite_ore',
      'eternal_starlight:grimstone_starcore_ore',
      'eternal_starlight:grimstone_starlit_diamond_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'eternal_starlight:haze_ice', [
      'eternal_starlight:haze_ice_deepsilver_ore',
      'eternal_starlight:haze_ice_starcore_ore',
      'eternal_starlight:haze_ice_starlit_diamond_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'eternal_starlight:nightfall_mud', [
      'eternal_starlight:nightfall_mud_deepsilver_ore',
      'eternal_starlight:nightfall_mud_malarite_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'eternal_starlight:packed_nightfall_mud', [
      'eternal_starlight:packed_nightfall_mud_deepsilver_ore',
      'eternal_starlight:packed_nightfall_mud_malarite_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'minecraft:deepslate', [
      'alltheores:deepslate_cinnabar_ore',
      'alltheores:deepslate_peridot_ore',
      'alltheores:deepslate_ruby_ore',
      'alltheores:deepslate_sapphire_ore',
      'born_in_chaos_v1:infected_deepslate_diamond_ore',
      'createnuclear:deepslate_lead_ore',
      'immersiveengineering:deepslate_ore_lead',
      'immersiveengineering:deepslate_ore_nickel',
      'immersiveengineering:deepslate_ore_silver',
      'malum:deepslate_soulstone_ore',
      'minecraft:deepslate_lapis_ore',
      'occultism:silver_ore_deepslate',
      'spectrum:deepslate_amethyst_ore',
      'spectrum:deepslate_azurite_ore',
      'spectrum:deepslate_citrine_ore',
      'spectrum:deepslate_malachite_ore',
      'spectrum:deepslate_moonstone_ore',
      'spectrum:deepslate_onyx_ore',
      'spectrum:deepslate_shimmerstone_ore',
      'spectrum:deepslate_topaz_ore',
      'projectred_exploration:deepslate_peridot_ore',
      'projectred_exploration:deepslate_ruby_ore',
      'projectred_exploration:deepslate_sapphire_ore',
      'projectred_exploration:deepslate_silver_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'minecraft:end_stone', [
      'alltheores:end_cinnabar_ore',
      'alltheores:end_peridot_ore',
      'alltheores:end_ruby_ore',
      'alltheores:end_sapphire_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'minecraft:netherrack', [
      'alltheores:nether_cinnabar_ore',
      'alltheores:nether_peridot_ore',
      'alltheores:nether_ruby_ore',
      'alltheores:nether_sapphire_ore',
      'betternether:cincinnasite_ore',
      'betternether:nether_lapis_ore',
      'betternether:nether_ruby_ore',
      // stratine industrial_revolution -> the_renaissance (2026-07-31): Spectrum's
      // midgame advancement chain (collect_stratine, upstream of the quested
      // craft_pigment_palette advancement) is a hard ancestor of the IR age grant.
      // An IR-locked stratine ore made that gate circular. Stratine is a nether
      // ore and vanilla Nether is Renaissance in this pack.
      'spectrum:stratine_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'minecraft:stone', [
      'abyssal_decor:seabrass_ore',
      'alexscaves:coprolith_coal_ore',
      'alltheores:cinnabar_ore',
      'alltheores:other_cinnabar_ore',
      'alltheores:other_peridot_ore',
      'alltheores:other_ruby_ore',
      'alltheores:other_sapphire_ore',
      'alltheores:peridot_ore',
      'alltheores:ruby_ore',
      'alltheores:sapphire_ore',
      'born_in_chaos_v1:infected_diamond_ore',
      'chemicalscience:ore_lead_mars',
      'chemicalscience:ore_lead_mercury',
      'chemicalscience:ore_lead_moon',
      'chemicalscience:ore_lead_venus',
      'chemicalscience:ore_silver_mars',
      'chemicalscience:ore_silver_mercury',
      'chemicalscience:ore_silver_moon',
      'chemicalscience:ore_silver_venus',
      'createnuclear:lead_ore',
      'immersiveengineering:ore_lead',
      'immersiveengineering:ore_nickel',
      'immersiveengineering:ore_silver',
      'malum:soulstone_ore',
      'minecraft:lapis_ore',
      'occultism:silver_ore',
      'spectrum:amethyst_ore',
      'spectrum:azurite_ore',
      'spectrum:citrine_ore',
      'spectrum:malachite_ore',
      'spectrum:moonstone_ore',
      'spectrum:onyx_ore',
      'spectrum:paltaeria_ore',
      'spectrum:shimmerstone_ore',
      'spectrum:topaz_ore',
      'projectred_exploration:peridot_ore',
      'projectred_exploration:ruby_ore',
      'projectred_exploration:sapphire_ore',
      'projectred_exploration:silver_ore',
    ])

    addAuditV4OreRows('the_renaissance', 'spectrum:blackslag', [
      'spectrum:blackslag_amethyst_ore',
      'spectrum:blackslag_azurite_ore',
      'spectrum:blackslag_citrine_ore',
      'spectrum:blackslag_coal_ore',
      'spectrum:blackslag_copper_ore',
      'spectrum:blackslag_diamond_ore',
      'spectrum:blackslag_emerald_ore',
      'spectrum:blackslag_lapis_ore',
      'spectrum:blackslag_malachite_ore',
      'spectrum:blackslag_moonstone_ore',
      'spectrum:blackslag_onyx_ore',
      'spectrum:blackslag_shimmerstone_ore',
      'spectrum:blackslag_topaz_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'undergarden:depthrock', [
      'undergarden:depthrock_coal_ore',
    ])

    addAuditV4OreRows('industrial_revolution', 'undergarden:shiverstone', [
      'undergarden:shiverstone_coal_ore',
    ])
  }

  addOreRestriction('the_renaissance', 'minecraft:diamond_ore', STONE)
  addOreRestriction('the_renaissance', 'minecraft:deepslate_diamond_ore', DEEPSLATE)
  addOreRestriction('the_renaissance', 'minecraft:emerald_ore', STONE)
  addOreRestriction('the_renaissance', 'minecraft:deepslate_emerald_ore', DEEPSLATE)
  addOreRestriction('industrial_revolution', 'minecraft:ancient_debris', NETHERRACK)

  addAllTheOres('industrial_revolution', ['aluminum', 'tin'])
  addAllTheOres('the_renaissance', ['lead', 'nickel', 'silver', 'osmium', 'platinum'])
  // R5 Prompt 04: zinc moves to Medieval so the brass route is not circular.
  addAllTheOres('medieval_times', ['zinc'])
  addAllTheOres('atomic', ['uranium'])

  addMekanism('industrial_revolution', ['tin', 'lead', 'osmium'])
  addMekanism('atomic', ['fluorite'])

  addEvolvedMekanism('industrial_revolution', ['tin', 'lead', 'osmium'])
  addEvolvedMekanism('atomic', ['fluorite', 'uranium'])

  addModernIndustrialization('industrial_revolution', ['antimony', 'bauxite', 'tin', 'tungsten'])
  addOreRestriction('industrial_revolution', 'modern_industrialization:titanium_ore', STONE)
  addModernIndustrialization('the_renaissance', ['lead', 'nickel'])
  addOreRestriction('the_renaissance', 'modern_industrialization:platinum_ore', STONE)
  addModernIndustrialization('atomic', ['monazite', 'uranium'])

  // R5 Prompt 04: Create zinc must be available for Medieval brass.
  addCreate('medieval_times', ['zinc'])

  addElectrodynamics('industrial_revolution', ['aluminum', 'tin'])
  addElectrodynamics('the_renaissance', ['lead', 'silver'])
  addElectrodynamics('atomic', ['fluorite', 'monazite', 'thorium', 'uranium'])

  addChemicalSciencePlanet('atomic', ['thorium', 'uranium'])

  const ORITECH_NICKEL_ITEMS = [
    'oritech:raw_nickel',
    'oritech:raw_nickel_block',
    'oritech:nickel_dust',
    'oritech:small_nickel_dust',
    'oritech:nickel_clump',
    'oritech:small_nickel_clump',
    'oritech:nickel_gem',
    'oritech:nickel_ingot',
    'oritech:nickel_nugget',
    'oritech:nickel_block'
  ]

  const ORITECH_PLATINUM_ITEMS = [
    'oritech:raw_platinum',
    'oritech:raw_platinum_block',
    'oritech:platinum_dust',
    'oritech:small_platinum_dust',
    'oritech:platinum_clump',
    'oritech:small_platinum_clump',
    'oritech:platinum_gem',
    'oritech:platinum_ingot',
    'oritech:platinum_nugget',
    'oritech:platinum_block'
  ]

  addLayeredOreRestriction('atomic', 'mekanism:uranium_ore', 'industrial_revolution', STONE, 30, TUFF, 20, [], ['c:ores/uranium', 'c:raw_materials/uranium', 'c:ingots/uranium', 'c:dusts/uranium'])
  addLayeredOreRestriction('atomic', 'mekanism:deepslate_uranium_ore', 'industrial_revolution', DEEPSLATE, 30, TUFF, 20, [], ['c:ores/uranium', 'c:raw_materials/uranium', 'c:ingots/uranium', 'c:dusts/uranium'])

  addLayeredOreRestriction('gilded_age', 'oritech:nickel_ore', 'industrial_revolution', STONE, 30, ANDESITE, 20, ORITECH_NICKEL_ITEMS, [])
  addLayeredOreRestriction('gilded_age', 'oritech:deepslate_nickel_ore', 'industrial_revolution', DEEPSLATE, 30, ANDESITE, 20, ORITECH_NICKEL_ITEMS, [])
  addLayeredOreRestriction('gilded_age', 'oritech:deepslate_platinum_ore', 'industrial_revolution', DEEPSLATE, 30, DIORITE, 20, ORITECH_PLATINUM_ITEMS, [])
  addOreRestriction('otherworldly', 'oritech:endstone_platinum_ore', END_STONE)
  addOreRestriction('atomic', 'oritech:deepslate_uranium_ore', DEEPSLATE)

  addAdAstra('otherworldly')
  addUndergarden('industrial_revolution')
  addAether('the_renaissance')
  addOreRestriction('gilded_age', 'aether:gravitite_ore', 'aether:holystone')
  addOreGatingAuditV4Fixes()

  ;['iron', 'gold'].forEach(function (material) { addSourceMaterialTags('medieval_times', material) })
  softTagLock('medieval_times', 'c:ores/redstone', 'material')
  ;['diamond'].forEach(function (material) { addAdvancedMaterialTags('the_renaissance', material) })
  ;['emerald'].forEach(function (material) { addAdvancedMaterialTags('the_renaissance', material) })
  ;['aluminum', 'antimony', 'bauxite', 'netherite', 'tin', 'titanium', 'tungsten'].forEach(function (material) { addAdvancedMaterialTags('industrial_revolution', material) })
  ;['lead', 'nickel', 'osmium', 'platinum', 'silver'].forEach(function (material) { addAdvancedMaterialTags('the_renaissance', material) })
  ;['zinc'].forEach(function (material) { addAdvancedMaterialTags('medieval_times', material) })
  ;['fluorite', 'monazite', 'thorium', 'uranium'].forEach(function (material) { addAdvancedMaterialTags('atomic', material) })
  ;['corronium', 'desh', 'neptunium', 'ostrum', 'plutonium', 'solerium', 'tharsite'].forEach(function (material) { addAdvancedMaterialTags('otherworldly', material) })

  // Neo Vitae hellforged material tags — defense-in-depth (dungeon gated at industrial_revolution)
  softTagLock('industrial_revolution', 'c:raw_materials/hellforged', 'material')
  softTagLock('industrial_revolution', 'c:dusts/hellforged', 'material')
  softTagLock('industrial_revolution', 'c:fragments/hellforged', 'material')
  softTagLock('industrial_revolution', 'c:gravels/hellforged', 'material')
  softTagLock('industrial_revolution', 'c:ingots/hellforged', 'material')

  addDirectItems('the_renaissance', ['minecraft:diamond', 'minecraft:diamond_block'], 'vanilla_drop')
  addDirectItems('the_renaissance', ['minecraft:emerald', 'minecraft:emerald_block'], 'vanilla_drop')
  addDirectItems('medieval_times', ['minecraft:raw_iron', 'minecraft:iron_ingot', 'minecraft:iron_nugget', 'minecraft:iron_block'], 'vanilla_drop')
  addDirectItems('medieval_times', ['minecraft:raw_gold', 'minecraft:gold_ingot', 'minecraft:gold_nugget', 'minecraft:gold_block'], 'vanilla_drop')
  addDirectItems('medieval_times', ['minecraft:redstone', 'minecraft:redstone_block'], 'vanilla_drop')
  addDirectItems('industrial_revolution', ['minecraft:netherite_scrap', 'minecraft:netherite_ingot', 'minecraft:netherite_block'], 'vanilla_drop')
  ;['c:crushed_raw_materials/netherite_scrap', 'c:dusts/netherite_scrap', 'c:impuredusts/netherite'].forEach(function (tag) {
    softTagLock('industrial_revolution', tag, 'netherite')
  })

  addDirectItems('gilded_age', ORITECH_PLATINUM_ITEMS, 'oritech_platinum')
  addDirectItems('atomic', ['oritech:raw_uranium', 'oritech:uranium_dust', 'oritech:uranium_gem', 'oritech:uranium_pellet', 'oritech:small_uranium_pellet', 'oritech:plutonium_pellet'], 'oritech_radioactive')

  // Ad Astra materials that only exist off Earth. ad_astra:steel_ingot is
  // deliberately absent: steel builds the NASA Workbench and the rocket parts
  // that get you off Earth, so gating it at otherworldly is a circular lock.
  addDirectItems('otherworldly', [
    'ad_astra:raw_desh',
    'ad_astra:raw_ostrum',
    'ad_astra:raw_calorite',
    'ad_astra:desh_ingot',
    'ad_astra:ostrum_ingot',
    'ad_astra:calorite_ingot',
    'ad_astra:desh_block',
    'ad_astra:ostrum_block',
    'ad_astra:calorite_block',
    'ad_astra:desh_nugget',
    'ad_astra:ice_shard',
    'ad_astra:cheese'
  ], 'ad_astra_space_ore')

  Object.keys(lootItemsByStage).forEach(function (stage) {
    // Per-stage guard: one stage failing must not cost the remaining stages
    // their loot bypass. This is the layer that was silently lost in d5ff996d.
    var restriction
    try {
      restriction = AStages.addRestrictionForLoot('aoa/ore_loot/' + stage, stage)
        .applyEverywhere()
    } catch (e) {
      console.warn('[AoA AStages ore] Skipped loot restriction for stage ' + stage + ': ' + e)
      return
    }

    Object.keys(lootItemsByStage[stage]).sort().forEach(function (item) {
      restriction.restrictItems(item)
    })

    Object.keys(lootTagsByStage[stage] || {}).sort().forEach(function (tag) {
      restriction.restrictTags(tag)
    })
  })
})()
