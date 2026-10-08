// AoA KubeJS: aoa_astages_01q_silentgear.js
// SOLE Silent Gear lock file. Merged 2026-07-26 (TFMG port task P1.3, ruling R-B): the
// port's separate aoa_astages_01r_silentgear.js was absorbed here and NOT copied. Two
// reasons it cannot ship as its own file: CC's 01r ordinal already belongs to Goety
// (aoa_astages_01r_goety.js), and two live SG lock files would stack most-restrictive-wins
// and silently up-tier the 16 alloy ids below. Do not re-create a second SG lock file.
//
// R-B tier resolution (2026-07-23 owner ruling WINS on all 16 double-locked ids):
//   blaze_gold     the_renaissance        (port file said industrial_revolution)
//   crimson_steel  industrial_revolution  (port file said gilded_age)
//   azure_electrum gilded_age             (port file said atomic)
//   tyrian_steel   gilded_age             (port file said atomic)
// aoa_forging_spine_recipes.js is reconciled to THESE tiers, not the port's -- each of the
// four alloys keeps one native production route whose inputs are legal at the tier above.
//
// Absorbed from the port file: the four station locks at the bottom of the list. NOT
// absorbed: its the_renaissance locks on blueprint_paper, blueprint_package, template_board,
// rough_rod and stone_anvil. Those are base-tier kit craftable at Medieval forge level
// (blueprint_paper = 4 paper + blue dye; template_board = a knife on logs; stone_anvil =
// cobblestone + dirt; blueprint_package has no recipe and can be granted on first spawn), so
// locking them past medieval_times would strand the entry rung. Gilded contract clause 7.
//
// Scope: the material item forms verified below (silentgear/silentgear_materials/*
// crafting.ingredient + assets/silentgear/models/item/* as registration evidence, plus
// sgearmetalworks lang keys for the molten bucket items), plus the four crafting STATIONS
// absorbed from the port file. Early SG tiers (wood/stone/iron/copper/diamond-class parts,
// blueprints/templates, the stone anvil and the salvager) stay ungated per canon -- SG is
// optional equipment flavor at the low end.
//
// Tier evidence (silentgear_materials/<id>.json properties.silentgear:main.harvest_tier
// .level_hint, cross-checked against vanilla iron=2/diamond=3/netherite=4):
//   crimson_iron   level_hint 3, durability 420   -> nether ore family, Renaissance entry
//   blaze_gold     level_hint 2, durability 69    -> nether alloy (blaze_rod + gold), Renaissance
//   azure_silver   level_hint 3, durability 197   -> End ore family; the ore block needs a
//                  netherite-tier pickaxe (owner ruling 2026-08-08), Industrial Revolution
//   crimson_steel  level_hint 4, durability 2400  -> netherite-parity alloy, Industrial Revolution
//   azure_electrum level_hint 4, durability 1259  -> netherite-parity+ alloy, Gilded Age
//   tyrian_steel   level_hint 4, durability 3652  -> top alloy, Gilded Age
// crimson_steel/azure_electrum/tyrian_steel are alloys (recipe/alloying/metal/*) with no
// raw/ore forms -- only ingot/nugget/dust/block exist. blaze_gold is likewise an alloy
// (recipe/alloying/metal/blaze_gold_ingot.json) with no ore/raw forms. crimson_iron and
// azure_silver are mined -- both have full ore/raw/raw_block/ingot/nugget/dust/block sets;
// crimson_iron additionally has a blackstone-host ore variant. No "chunk" item exists for
// any of these despite a leftover crimson_iron_chunks.png texture -- omitted per canon
// (no lock for forms that were not actually registered).
//
// sgearmetalworks (Silent Gear Metalworks, castable forms via Productive Metalworks
// foundries) registers its OWN molten-bucket items for each of these six alloys
// (item.sgearmetalworks.molten_<material>_bucket, confirmed via its en_us.json lang
// keys) -- casting is a real production-shortcut bypass around the mined/smelted route,
// so each bucket is locked at the SAME age as its solid material. sgearmetalworks also
// ships "raw_<alloy>" melting recipes for the three alloys with no raw ore (azure_electrum,
// blaze_gold, tyrian_steel, crimson_steel); each is neoforge:tag_empty-gated on a
// c:storage_blocks/raw_<alloy> tag that no item populates, so those recipes never fire --
// no corresponding item exists to lock.
//
// Explicitly reviewed and NOT locked here (owner-review flags):
//   - silentgear:dimerald (harvest_tier level_hint 3, durability 1776): diamond-class,
//     not netherite-parity. Stays with the other diamond-class SG parts per canon.
//   - silentgear:high_carbon_steel (level_hint 2): iron-class, stays ungated.
//   - silentgear:crude_alloy / alloy_ingot / hybrid_gem / super_alloy: generic
//     salvage-fallback items with EMPTY properties.silentgear:main (no combat/tool
//     stats) -- not a rushable power tier.
//   - titanium/enderium/signalum/lumium/osmium/platinum/uranium/refined_obsidian/
//     bismuth_steel/aluminum_steel/redstone_alloy/compressed_iron/refined_iron/
//     refined_glowstone: SG's generic tag-compat material system. Their crafting
//     ingredient is a bare c:ingots/<name> tag pointing at ANOTHER mod's ingot (not a
//     silentgear:/sgearmetalworks: item), so locking them is out of this script's
//     namespace scope and would duplicate whatever stage lock that source mod's own
//     ingot already carries. Flagged for owner awareness; several (titanium, enderium)
//     are already netherite-parity (level_hint 4) if that source mod's lock is missing.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages sgear] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages sgear] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // --- crimson_iron (nether ore family) -> the_renaissance ---
    ["the_renaissance", "silentgear:crimson_iron_ore", "block_item"],
    ["the_renaissance", "silentgear:blackstone_crimson_iron_ore", "block_item"],
    ["the_renaissance", "silentgear:raw_crimson_iron", "item"],
    ["the_renaissance", "silentgear:raw_crimson_iron_block", "block_item"],
    ["the_renaissance", "silentgear:crimson_iron_ingot", "item"],
    ["the_renaissance", "silentgear:crimson_iron_nugget", "item"],
    ["the_renaissance", "silentgear:crimson_iron_dust", "item"],
    ["the_renaissance", "silentgear:crimson_iron_block", "block_item"],
    ["the_renaissance", "sgearmetalworks:molten_crimson_iron_bucket", "item"],
    // --- blaze_gold (nether alloy, no ore/raw forms) -> the_renaissance ---
    ["the_renaissance", "silentgear:blaze_gold_ingot", "item"],
    ["the_renaissance", "silentgear:blaze_gold_nugget", "item"],
    ["the_renaissance", "silentgear:blaze_gold_dust", "item"],
    ["the_renaissance", "silentgear:blaze_gold_block", "block_item"],
    ["the_renaissance", "sgearmetalworks:molten_blaze_gold_bucket", "item"],
    // --- azure_silver (End ore family) -> industrial_revolution ---
    // Retiered from the_renaissance 2026-08-08: mining the ore is proven to need a
    // netherite-tier pickaxe, and netherite parity is IR+ (standing owner ruling).
    ["industrial_revolution", "silentgear:azure_silver_ore", "block_item"],
    ["industrial_revolution", "silentgear:raw_azure_silver", "item"],
    ["industrial_revolution", "silentgear:raw_azure_silver_block", "block_item"],
    ["industrial_revolution", "silentgear:azure_silver_ingot", "item"],
    ["industrial_revolution", "silentgear:azure_silver_nugget", "item"],
    ["industrial_revolution", "silentgear:azure_silver_dust", "item"],
    ["industrial_revolution", "silentgear:azure_silver_block", "block_item"],
    ["industrial_revolution", "sgearmetalworks:molten_azure_silver_bucket", "item"],
    // --- crimson_steel (netherite-parity alloy, no ore/raw forms) -> industrial_revolution ---
    ["industrial_revolution", "silentgear:crimson_steel_ingot", "item"],
    ["industrial_revolution", "silentgear:crimson_steel_nugget", "item"],
    ["industrial_revolution", "silentgear:crimson_steel_dust", "item"],
    ["industrial_revolution", "silentgear:crimson_steel_block", "block_item"],
    ["industrial_revolution", "sgearmetalworks:molten_crimson_steel_bucket", "item"],
    // --- azure_electrum (top alloy, no ore/raw forms) -> gilded_age ---
    ["gilded_age", "silentgear:azure_electrum_ingot", "item"],
    ["gilded_age", "silentgear:azure_electrum_nugget", "item"],
    ["gilded_age", "silentgear:azure_electrum_dust", "item"],
    ["gilded_age", "silentgear:azure_electrum_block", "block_item"],
    ["gilded_age", "sgearmetalworks:molten_azure_electrum_bucket", "item"],
    // --- tyrian_steel (top alloy, no ore/raw forms) -> gilded_age ---
    ["gilded_age", "silentgear:tyrian_steel_ingot", "item"],
    ["gilded_age", "silentgear:tyrian_steel_nugget", "item"],
    ["gilded_age", "silentgear:tyrian_steel_dust", "item"],
    ["gilded_age", "silentgear:tyrian_steel_block", "block_item"],
    ["gilded_age", "sgearmetalworks:molten_tyrian_steel_bucket", "item"],
    // --- crafting stations (absorbed from the port's 01r file, 2026-07-26) ---
    // Each station's tier is at or after every input its live recipe needs, so none of
    // these strands its own craft. Recipes verified in silent-gear-4.2.1.1 and, where
    // aoa_forging_spine_recipes.js replaces them, in that script:
    //   material_grader   forging-spine recipe = c:ingots/steel + c:gems/quartz +
    //                     c:ingots/iron + advanced_upgrade_base. Grading is the Renaissance
    //                     rung of the forge spine; the native recipe's c:ingots/blaze_gold
    //                     is Renaissance too, so the tier holds either way.
    //   alloy_forge       forging-spine recipe = c:ingots/steel + blackstone +
    //                     c:storage_blocks/iron (the native one needs crimson_steel, which
    //                     is IR, so the replacement is what makes this craftable at IR).
    //                     Asked by ir_pneumaticcraft_pressure_plastic, an IR chapter.
    //   metal_press       native recipe needs c:ingots/tyrian_steel (gilded_age) -- Atomic
    //                     is after it, no strand.
    //   starlight_charger native recipe needs c:storage_blocks/blaze_gold (the_renaissance)
    //                     -- Otherworldly is after it, no strand.
    ["the_renaissance", "silentgear:material_grader", "block_item"],
    ["industrial_revolution", "silentgear:alloy_forge", "block_item"],
    ["atomic", "silentgear:metal_press", "block_item"],
    ["otherworldly", "silentgear:starlight_charger", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
