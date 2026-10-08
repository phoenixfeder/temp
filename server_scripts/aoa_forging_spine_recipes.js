// AoA KubeJS: aoa_forging_spine_recipes.js
// Cross-age forge spine for Silent Gear 4.2.1.1, Silent Gear Metalworks 1.5.0,
// Overgeared 1.6.16, PneumaticCraft 8.2.23, and Oritech 1.2.10.
//
// Design:
// - Renaissance: PMW casts SG parts; Silent Gear grades and assembles them;
//   Overgeared finishes the completed gear without erasing its components.
// - IR: PneumaticCraft supplies enhanced pressure routes for Blaze Gold and
//   Crimson Steel after their native Silent Gear acquisition paths.
// - Atomic: Oritech's Atomic Forge supplies the later enhanced route for Azure
//   Electrum, then Tyrian Steel, after their earlier native acquisition paths.
// - Otherworldly: Spectrum and Neo Vitae extend the charger's compiled tier 3.
// - Ascension: awakened draconium fills Silent Gear's supported tier-5 grader slot.
//
// No custom items and no stage mutation. AStages policy lives in
// aoa_astages_01q_silentgear.js (single merged SG lock file, ruling R-B 2026-07-26).
//
// ---------------------------------------------------------------------------
// NATIVE ROUTE PRESERVATION (2026-07-26, architect ruling, task P1.3)
// ---------------------------------------------------------------------------
// This script was authored against the port's own SG tiering (blaze_gold=IR,
// crimson_steel=Gilded, azure_electrum/tyrian_steel=Atomic), which lines up with the
// four station recipes below. Ruling R-B keeps the pack's 2026-07-23 tiering instead:
// blaze_gold=Renaissance, crimson_steel=IR, azure_electrum/tyrian_steel=Gilded. Under
// that tiering every station route below sits at least one age AFTER the alloy it makes:
//
//   blaze_gold     Renaissance  <- pressure chamber, IR (chamber walls locked IR)
//   crimson_steel  IR           <- reinforced chamber + a token minted by g5 quest
//                                  1A26071800003001, and pneumaticcraft:programmer is
//                                  locked gilded_age by aoa_astages_01c_pneumaticcraft.js
//   azure_electrum Gilded       <- Oritech Atomic Forge, atomic
//   tyrian_steel   Gilded       <- Oritech Atomic Forge + prometheum_ingot, atomic
//
// Removing every native route therefore left all four alloys unlocked one to two ages
// before anything could make them. So each alloy KEEPS exactly one native production
// route whose inputs are all legal at or before its own tier, and the station recipes
// stay as the enhanced, higher-yield path:
//
//   blaze_gold     KEEP silentgear:blaze_gold_ingot        1 gold + 4 blaze powder -> 1
//                       (station: 1 gold + 2 blaze powder -> 1, half the powder)
//   crimson_steel  KEEP silentgear:crimson_steel_ingot     4 crimson_iron + 2 blaze rod
//                       + magma cream -> 1; crimson_iron is Renaissance, the rest is
//                       unlocked, so the whole recipe is IR-legal
//                       (station: crimson_iron BLOCK + 2 blaze rod + magma cream +
//                        token -> 3, i.e. 3 ingots per 9 vs 1 per 4)
//   azure_electrum KEEP silentgear:azure_electrum_ingot    4 azure_silver + 2 gold +
//                       1 ender pearl -> 1; azure_silver is Industrial Revolution
//                       (station: azure_silver BLOCK + pressure plate + pearl -> 3)
//   tyrian_steel   KEEP silentgear:alloying/metal/tyrian_steel_ingot. Tyrian is the one
//                       alloy with NO crafting-table recipe in the jar, so its Alloy
//                       Forge alloying recipe is its only native route. The Alloy Forge
//                       is locked industrial_revolution, and the recipe's inputs
//                       (crimson_steel IR, azure_electrum Gilded, crushed_shulker_shell
//                       and netherite_scrap both unlocked) are all Gilded-legal.
//
// What still gets removed: the generic Alloy Forge alloying recipes for the three alloys
// that DO have a crafting-table route, and all four Productive Metalworks molten alloying
// recipes (the Medieval-foundry casting shortcut). Neither strands anything -- the PMW
// ingot->molten melting recipes survive, so the sgearmetalworks molten buckets are still
// obtainable, and they carry zero quest asks.
//
// ---------------------------------------------------------------------------
// GUARDS
// ---------------------------------------------------------------------------
// Every block below is Platform.isLoaded / Item.exists guarded in the same idiom as
// aoa_oil_single_source.js and ir2_fuel_tag_unification.js, so the script is a clean
// no-op on any instance missing a jar rather than an unresolvable-recipe error source.

ServerEvents.recipes(event => {
  if (typeof Platform === 'undefined' || !Platform.isLoaded('silentgear')) return

  // Silent Gear ships 50 recipes that convert ordinary tools directly into
  // modular gear. They bypass blueprint paper, casts, and the Renaissance
  // workshop entry, so conversion is disabled while native SG assembly stays.
  event.remove({ type: 'silentgear:conversion' })

  // Productive Metalworks molten alloying: the Medieval-foundry casting shortcut
  // around the mined/smelted route. The ingot->molten melting recipes are untouched,
  // so every molten form (and its sgearmetalworks bucket) is still reachable.
  // These four recipes live in the productivemetalworks namespace but are SHIPPED BY
  // sgearmetalworks (data/productivemetalworks/recipe/alloying/* inside that jar), so
  // sgearmetalworks is the correct guard.
  if (Platform.isLoaded('sgearmetalworks')) {
    event.remove({ id: 'productivemetalworks:alloying/molten_blaze_gold' })
    event.remove({ id: 'productivemetalworks:alloying/molten_crimson_steel' })
    event.remove({ id: 'productivemetalworks:alloying/molten_tyrian_steel' })
    event.remove({ id: 'productivemetalworks:alloying/molten_azure_electrum' })
  }

  // Native Silent Gear makes both stations from alloys this pack introduces
  // later. Carry Medieval Productive Metalworks steel forward so the Grader
  // is Renaissance-legal and the Alloy Forge is Industrial-legal.
  if (typeof Item !== 'undefined' && Item.exists('silentgear:advanced_upgrade_base')) {
    event.remove({ id: 'silentgear:material_grader' })
    event.custom({
      type: 'minecraft:crafting_shaped',
      category: 'misc',
      key: {
        '#': { item: 'silentgear:advanced_upgrade_base' },
        I: { tag: 'c:ingots/iron' },
        Q: { tag: 'c:gems/quartz' },
        S: { tag: 'c:ingots/steel' }
      },
      pattern: [
        'QIQ',
        'I#I',
        'SSS'
      ],
      result: {
        count: 1,
        id: 'silentgear:material_grader'
      }
    }).id('silentgear:material_grader')
  }

  if (typeof Item !== 'undefined' && Item.exists('silentgear:alloy_forge')) {
    event.remove({ id: 'silentgear:alloy_forge' })
    event.custom({
      type: 'minecraft:crafting_shaped',
      category: 'misc',
      key: {
        '#': { item: 'minecraft:blackstone' },
        S: { tag: 'c:ingots/steel' },
        I: { tag: 'c:storage_blocks/iron' }
      },
      pattern: [
        'S#S',
        'S S',
        '#I#'
      ],
      result: {
        count: 1,
        id: 'silentgear:alloy_forge'
      }
    }).id('silentgear:alloy_forge')
  }

  // Pressure-chamber alloy routes. PneumaticCraft only; the neoforge:components
  // strict ingredient below is authored against PNC 8.2.23.
  if (Platform.isLoaded('pneumaticcraft')) {
    event.custom({
      type: 'pneumaticcraft:pressure_chamber',
      inputs: [
        { count: 1, tag: 'c:ingots/gold' },
        { count: 2, item: 'minecraft:blaze_powder' }
      ],
      pressure: 3.0,
      results: [
        { count: 1, id: 'silentgear:blaze_gold_ingot' }
      ]
    }).id('aoa:forging_spine/pressure_chamber/blaze_gold')

    event.custom({
      type: 'pneumaticcraft:pressure_chamber',
      inputs: [
        { count: 1, tag: 'c:storage_blocks/crimson_iron' },
        { count: 2, item: 'minecraft:blaze_rod' },
        { count: 1, item: 'minecraft:magma_cream' },
        // Quest 3001 issues this component-marked calibration token. A plain
        // auto-crafted Programmer does not satisfy the component ingredient.
        // This is the enhanced route, not the only one -- see the preserved
        // silentgear:crimson_steel_ingot crafting recipe.
        {
          count: 1,
          type: 'neoforge:components',
          components: {
            'minecraft:custom_data': {
              aoa_crimson_calibration: true
            }
          },
          items: 'pneumaticcraft:programmer',
          strict: true
        }
      ],
      pressure: 8.0,
      results: [
        { count: 3, id: 'silentgear:crimson_steel_ingot' },
        {
          count: 1,
          id: 'pneumaticcraft:programmer',
          components: {
            'minecraft:custom_data': {
              aoa_crimson_calibration: true
            }
          }
        }
      ]
    }).id('aoa:forging_spine/pressure_chamber/crimson_steel')

    // Remove native alloy-forge routes only after their pressure replacements
    // are registered for this loaded PneumaticCraft version.
    event.remove({ id: 'silentgear:alloying/metal/blaze_gold_ingot' })
    event.remove({ id: 'silentgear:alloying/metal/crimson_steel_ingot' })
  }

  // Atomic Forge alloy routes. Oritech only; prometheum_ingot is the Atomic-tier
  // input that makes the Tyrian route the late, deterministic one.
  if (Platform.isLoaded('oritech') && typeof Item !== 'undefined' &&
      Item.exists('oritech:prometheum_ingot')) {
    event.custom({
      type: 'oritech:atomic_forge',
      ingredients: [
        { tag: 'c:storage_blocks/azure_silver' },
        // One light weighted pressure plate is exactly two gold ingots and fits
        // the Atomic Forge's verified three-input layout as a contact plate.
        { item: 'minecraft:light_weighted_pressure_plate' },
        { tag: 'c:ender_pearls' }
      ],
      results: [
        { count: 3, id: 'silentgear:azure_electrum_ingot' }
      ],
      time: 300
    }).id('aoa:forging_spine/atomic_forge/azure_electrum')

    event.custom({
      type: 'oritech:atomic_forge',
      ingredients: [
        { item: 'silentgear:crimson_steel_ingot' },
        { item: 'silentgear:azure_electrum_ingot' },
        { item: 'oritech:prometheum_ingot' }
      ],
      results: [
        { count: 2, id: 'silentgear:tyrian_steel_ingot' }
      ],
      time: 400
    }).id('aoa:forging_spine/atomic_forge/tyrian_steel')

    // Remove Azure Electrum's native alloy-forge route only with the complete
    // Oritech replacement set and its verified Prometheum input.
    event.remove({ id: 'silentgear:alloying/metal/azure_electrum_ingot' })
  }

  // Overgeared reads forging quality from the top-level component on the item
  // being used. Silent Gear keeps arbitrary part components nested when it
  // constructs new gear, so finishing a part would make its quality inert.
  // Finish the 33 assembled equipment items instead. AoA Core's Overgeared
  // bridge honors transfer_nbt by copying the complete 1.21 data-component map.
  if (Platform.isLoaded('overgeared') && Platform.isLoaded('aoacore')) {
    // Overgeared 1.6.16 rejects any inserted blueprint when a recipe has no
    // blueprint types. Map the five tool types supported by the live config;
    // blueprints remain optional, but a matching inserted blueprint now works.
    var blueprintByGear = {
      'silentgear:axe': 'axe',
      'silentgear:hoe': 'hoe',
      'silentgear:pickaxe': 'pickaxe',
      'silentgear:shovel': 'shovel',
      'silentgear:sword': 'sword'
    }
    var assembledGear = [
      'silentgear:arrow',
      'silentgear:axe',
      'silentgear:boots',
      'silentgear:bow',
      'silentgear:bracelet',
      'silentgear:chestplate',
      'silentgear:crossbow',
      'silentgear:dagger',
      'silentgear:excavator',
      'silentgear:fishing_rod',
      'silentgear:hammer',
      'silentgear:helmet',
      'silentgear:hoe',
      'silentgear:katana',
      'silentgear:knife',
      'silentgear:leggings',
      'silentgear:mace',
      'silentgear:machete',
      'silentgear:mattock',
      'silentgear:necklace',
      'silentgear:paxel',
      'silentgear:pickaxe',
      'silentgear:prospector_hammer',
      'silentgear:ring',
      'silentgear:saw',
      'silentgear:shears',
      'silentgear:shield',
      'silentgear:shovel',
      'silentgear:sickle',
      'silentgear:slingshot',
      'silentgear:spear',
      'silentgear:sword',
      'silentgear:trident'
    ]

    // Rhino: declare loop-body locals with var, never const/let (redeclaration trap
    // on a callback invoked once per element).
    assembledGear.forEach(function (gear) {
      if (typeof Item !== 'undefined' && !Item.exists(gear)) {
        console.warn('[AoA forging spine] Skipped missing gear ' + gear)
        return
      }
      var path = gear.substring(gear.indexOf(':') + 1)
      var recipe = {
        type: 'overgeared:forging',
        category: 'MISC',
        tier: 'iron',
        hammering: 2,
        has_quality: true,
        needs_minigame: true,
        has_polishing: true,
        need_quenching: false,
        show_notification: false,
        pattern: ['#Q'],
        key: {
          '#': {
            item: gear,
            transfer_nbt: true
          },
          Q: {
            item: 'minecraft:quartz'
          }
        },
        result: {
          id: gear,
          count: 1
        }
      }
      var blueprintType = blueprintByGear[gear]
      if (blueprintType) recipe.blueprint = [blueprintType]
      event.custom(recipe).id('aoa:forging_spine/overgeared_finish/' + path)
    })
  }
})

ServerEvents.tags('item', event => {
  if (typeof Platform === 'undefined' || !Platform.isLoaded('silentgear')) return
  if (typeof Item === 'undefined' || typeof Item.exists !== 'function') return

  // Silent Gear 4.2.1.1 compiles exactly three Starlight Charger tiers.
  var tier3 = ['spectrum:moonstone_core', 'neovitae:ingot_hellforged'].filter(function (id) {
    return Item.exists(id)
  })
  if (tier3.length > 0) event.add('silentgear:starlight_charger_catalysts/tier3', tier3)

  // The Material Grader compiles and reads all five tier tags.
  if (Item.exists('draconicevolution:awakened_draconium_ingot')) {
    event.add('silentgear:grader_catalysts/tier5', [
      'draconicevolution:awakened_draconium_ingot'
    ])
  }
})

LootJS.modifiers(event => {
  if (typeof Platform === 'undefined' || !Platform.isLoaded('silentgear')) return

  // Silent Gear injects both alloys into Nether structure loot. Remove those
  // rolls so the age-owned pressure recipes remain a controlled enhanced route.
  var netherTables = [
    'minecraft:chests/bastion_bridge',
    'minecraft:chests/bastion_treasure',
    'minecraft:chests/nether_bridge',
    'minecraft:chests/ruined_portal'
  ]
  netherTables.forEach(function (table) {
    event.addTableModifier(table)
      .removeLoot('silentgear:blaze_gold_ingot')
      .removeLoot('silentgear:blaze_gold_nugget')
      .removeLoot('silentgear:crimson_steel_ingot')
      .removeLoot('silentgear:crimson_steel_dust')
  })
})
