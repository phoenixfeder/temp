// ============================================================================
//  ATO material conflict cleanup
// ============================================================================
//
//  Intent:
//    - AllTheOres is the canonical common-metal output layer.
//    - Duplicate furnace/blast-furnace outputs should not make Polymorph
//      load-bearing.
//    - Unique progression materials stay unique and must not satisfy generic
//      common-metal tags by accident.
//
//  KubeJS target:
//    NeoForge 1.21.1, KubeJS 2101.7.2-build.363.
//
//  Policy:
//    - Exact recipe removals are used for same-input furnace/blast duplicates
//      where an ATO recipe already exists.
//    - Common tagged outputs are replaced by ATO equivalents by exact output
//      item pair, not by mod-wide removal.
//    - Biosteel and manganin are preserved as unique materials and removed
//      from misleading generic steel/constantan tags.
// ============================================================================

const ATO_FURNACE_DUPLICATE_REMOVALS = [
  'chemicalscience:blasting/ingotnickel_from_dust',
  'chemicalscience:blasting/ingotplatinum_from_crushedore',
  'chemicalscience:blasting/ingotzinc_from_dust',
  'chemicalscience:smelting/nickel_ingot_from_dust',
  'chemicalscience:smelting/zinc_ingot_from_dust',
  'create:blasting/ingot_aluminum_compat_immersiveengineering',
  'create:blasting/ingot_lead_compat_immersiveengineering',
  'create:blasting/ingot_lead_compat_mekanism',
  'create:blasting/ingot_nickel_compat_immersiveengineering',
  'create:blasting/ingot_osmium_compat_mekanism',
  'create:blasting/ingot_silver_compat_immersiveengineering',
  'create:blasting/ingot_tin_compat_mekanism',
  'create:blasting/ingot_uranium_compat_immersiveengineering',
  'create:blasting/ingot_uranium_compat_mekanism',
  'create:smelting/ingot_aluminum_compat_immersiveengineering',
  'create:smelting/ingot_lead_compat_immersiveengineering',
  'create:smelting/ingot_lead_compat_mekanism',
  'create:smelting/ingot_nickel_compat_immersiveengineering',
  'create:smelting/ingot_osmium_compat_mekanism',
  'create:smelting/ingot_silver_compat_immersiveengineering',
  'create:smelting/ingot_tin_compat_mekanism',
  'create:smelting/ingot_uranium_compat_immersiveengineering',
  'create:smelting/ingot_uranium_compat_mekanism',
  'createnuclear:blasting/lead_ingot_for_lead',
  'createnuclear:blasting/lead_ingot_for_raw_lead',
  'createnuclear:smelting/lead_ingot_for_lead',
  'createnuclear:smelting/lead_ingot_for_raw_lead',
  'createoritechcompat:blasting/nickel_ingot_from_crushed',
  'createoritechcompat:blasting/platinum_ingot_from_crushed',
  'createoritechcompat:smelting/nickel_ingot_from_crushed',
  'createoritechcompat:smelting/platinum_ingot_from_crushed',
  'electrodynamics:blasting/aluminum_ingot_from_dust',
  'electrodynamics:blasting/bronze_ingot_from_dust',
  'electrodynamics:blasting/lead_ingot_from_dust',
  'electrodynamics:blasting/lead_ingot_from_ore',
  'electrodynamics:blasting/lead_ingot_from_raw_ore',
  'electrodynamics:blasting/silver_ingot_from_dust',
  'electrodynamics:blasting/silver_ingot_from_ore',
  'electrodynamics:blasting/silver_ingot_from_raw_ore',
  'electrodynamics:blasting/steel_ingot_from_dust',
  'electrodynamics:blasting/tin_ingot_from_dust',
  'electrodynamics:blasting/tin_ingot_from_ore',
  'electrodynamics:blasting/tin_ingot_from_raw_ore',
  'electrodynamics:smelting/aluminum_ingot_from_dust',
  'electrodynamics:smelting/bronze_ingot_from_dust',
  'electrodynamics:smelting/lead_ingot_from_dust',
  'electrodynamics:smelting/lead_ingot_from_ore',
  'electrodynamics:smelting/lead_ingot_from_raw_ore',
  'electrodynamics:smelting/silver_ingot_from_dust',
  'electrodynamics:smelting/silver_ingot_from_ore',
  'electrodynamics:smelting/silver_ingot_from_raw_ore',
  'electrodynamics:smelting/steel_ingot_from_dust',
  'electrodynamics:smelting/tin_ingot_from_dust',
  'electrodynamics:smelting/tin_ingot_from_ore',
  'electrodynamics:smelting/tin_ingot_from_raw_ore',
  'occultism:blasting/silver_ingot_from_dust',
  'occultism:blasting/silver_ingot_from_ore',
  'occultism:blasting/silver_ingot_from_raw',
  'occultism:smelting/silver_ingot_from_dust',
  'occultism:smelting/silver_ingot_from_ore',
  'occultism:smelting/silver_ingot_from_raw',
  'oritech:blasting/compat/create/crushed_nickel_to_nickel_ingot',
  'oritech:blasting/compat/create/crushed_platinum_to_platinum_ingot'
]

// ATO owns common-alloy synthesis and processing; remove only IE routes with
// verified ATO counterparts. Legacy IE block and nugget conversions remain as
// migration sinks for existing items.
const IE_ALLOY_DUPLICATE_REMOVALS = [
  'immersiveengineering:alloysmelter/brass',
  'immersiveengineering:alloysmelter/bronze',
  'immersiveengineering:alloysmelter/constantan',
  'immersiveengineering:alloysmelter/electrum',
  'immersiveengineering:alloysmelter/invar',
  'immersiveengineering:arcfurnace/alloy_brass',
  'immersiveengineering:arcfurnace/alloy_bronze',
  'immersiveengineering:arcfurnace/alloy_constantan',
  'immersiveengineering:arcfurnace/alloy_electrum',
  'immersiveengineering:arcfurnace/alloy_invar',
  'immersiveengineering:arcfurnace/dust_brass',
  'immersiveengineering:arcfurnace/dust_bronze',
  'immersiveengineering:arcfurnace/dust_constantan',
  'immersiveengineering:arcfurnace/dust_electrum',
  'immersiveengineering:arcfurnace/dust_invar',
  'immersiveengineering:crusher/ingot_brass',
  'immersiveengineering:crusher/ingot_bronze',
  'immersiveengineering:crusher/ingot_constantan',
  'immersiveengineering:crusher/ingot_electrum',
  'immersiveengineering:crusher/ingot_invar',
  'immersiveengineering:metalpress/gear_brass',
  'immersiveengineering:metalpress/gear_bronze',
  'immersiveengineering:metalpress/gear_constantan',
  'immersiveengineering:metalpress/gear_electrum',
  'immersiveengineering:metalpress/gear_invar',
  'immersiveengineering:metalpress/plate_brass',
  'immersiveengineering:metalpress/plate_bronze',
  'immersiveengineering:metalpress/plate_constantan',
  'immersiveengineering:metalpress/plate_electrum',
  'immersiveengineering:metalpress/plate_invar',
  'immersiveengineering:metalpress/rod_brass',
  'immersiveengineering:metalpress/rod_bronze',
  'immersiveengineering:metalpress/rod_constantan',
  'immersiveengineering:metalpress/rod_electrum',
  'immersiveengineering:metalpress/rod_invar',
  'immersiveengineering:crafting/constantan_mix',
  'immersiveengineering:crafting/electrum_mix',
  'immersiveengineering:smelting/ingot_constantan_from_dust',
  'immersiveengineering:smelting/ingot_constantan_from_dust_from_blasting',
  'immersiveengineering:smelting/ingot_electrum_from_dust',
  'immersiveengineering:smelting/ingot_electrum_from_dust_from_blasting'
]

const ATO_COMMON_OUTPUT_REPLACEMENTS = [
  // Ad Astra steel joins the ATO layer (2026-08-30). Safe because every Ad
  // Astra steel consumer reads a tag that already accepts the c: equivalent:
  // ad_astra:steel_ingots = [ad_astra:steel_ingot, #c:ingots/steel], and the
  // plate, block and nugget tags follow the same shape. alltheores:steel_* is
  // a member of each of those c: tags, so the compressor, the NASA Workbench,
  // the rocket parts and the space suits all keep working on ATO steel.
  //
  // ad_astra:steel_rod is deliberately NOT unified. 29 Ad Astra recipes name
  // it as an exact item rather than through ad_astra:steel_rods, including
  // steel_tank (a tier one rocket component), desh/ostrum/calorite tank,
  // fan, vent, oxygen_gear and engine_frame. Replacing its output would strand
  // all of them. Same reasoning keeps iron_rod and the steel_plating decor set
  // out of the list.
  ['ad_astra:steel_ingot', 'alltheores:steel_ingot'],
  ['ad_astra:steel_block', 'alltheores:steel_block'],
  ['ad_astra:steel_nugget', 'alltheores:steel_nugget'],
  ['ad_astra:steel_plate', 'alltheores:steel_plate'],
  ['modern_industrialization:aluminum_block', 'alltheores:aluminum_block'],
  ['modern_industrialization:aluminum_dust', 'alltheores:aluminum_dust'],
  ['modern_industrialization:aluminum_gear', 'alltheores:aluminum_gear'],
  ['modern_industrialization:aluminum_ingot', 'alltheores:aluminum_ingot'],
  ['modern_industrialization:aluminum_nugget', 'alltheores:aluminum_nugget'],
  ['modern_industrialization:aluminum_plate', 'alltheores:aluminum_plate'],
  ['modern_industrialization:aluminum_rod', 'alltheores:aluminum_rod'],
  ['create:raw_zinc', 'alltheores:raw_zinc'],
  ['create:raw_zinc_block', 'alltheores:raw_zinc_block'],
  ['create:zinc_block', 'alltheores:zinc_block'],
  ['create:zinc_ingot', 'alltheores:zinc_ingot'],
  ['create:zinc_nugget', 'alltheores:zinc_nugget'],
  // Alloyed was removed from the pack; its six bronze/steel replacement pairs are gone.
  ['chemicalscience:block_platinum', 'alltheores:platinum_block'],
  ['chemicalscience:dust_nickel', 'alltheores:nickel_dust'],
  ['chemicalscience:dust_platinum', 'alltheores:platinum_dust'],
  ['chemicalscience:dust_zinc', 'alltheores:zinc_dust'],
  ['chemicalscience:ingot_nickel', 'alltheores:nickel_ingot'],
  ['chemicalscience:ingot_platinum', 'alltheores:platinum_ingot'],
  ['chemicalscience:ingot_zinc', 'alltheores:zinc_ingot'],
  ['create:brass_block', 'alltheores:brass_block'],
  ['create:brass_ingot', 'alltheores:brass_ingot'],
  ['create:brass_nugget', 'alltheores:brass_nugget'],
  ['createaddition:electrum_block', 'alltheores:electrum_block'],
  ['createaddition:electrum_ingot', 'alltheores:electrum_ingot'],
  ['createaddition:electrum_nugget', 'alltheores:electrum_nugget'],
  ['createnuclear:lead_block', 'alltheores:lead_block'],
  ['createnuclear:lead_ingot', 'alltheores:lead_ingot'],
  ['createnuclear:lead_nugget', 'alltheores:lead_nugget'],
  ['createnuclear:steel_block', 'alltheores:steel_block'],
  ['createnuclear:steel_ingot', 'alltheores:steel_ingot'],
  ['createnuclear:steel_nugget', 'alltheores:steel_nugget'],
  ['createnuclear:uranium_powder', 'alltheores:uranium_dust'],
  ['electrodynamics:dustaluminum', 'alltheores:aluminum_dust'],
  ['electrodynamics:dustbronze', 'alltheores:bronze_dust'],
  ['electrodynamics:dustlead', 'alltheores:lead_dust'],
  ['electrodynamics:dustsilver', 'alltheores:silver_dust'],
  ['electrodynamics:duststeel', 'alltheores:steel_dust'],
  ['electrodynamics:dusttin', 'alltheores:tin_dust'],
  ['electrodynamics:ingotaluminum', 'alltheores:aluminum_ingot'],
  ['electrodynamics:ingotbronze', 'alltheores:bronze_ingot'],
  ['electrodynamics:ingotlead', 'alltheores:lead_ingot'],
  ['electrodynamics:ingotsilver', 'alltheores:silver_ingot'],
  ['electrodynamics:ingotsteel', 'alltheores:steel_ingot'],
  ['electrodynamics:ingottin', 'alltheores:tin_ingot'],
  ['electrodynamics:nuggetsilver', 'alltheores:silver_nugget'],
  ['electrodynamics:nuggetsteel', 'alltheores:steel_nugget'],
  ['electrodynamics:nuggettin', 'alltheores:tin_nugget'],
  ['electrodynamics:resourceblockaluminum', 'alltheores:aluminum_block'],
  ['electrodynamics:resourceblockbronze', 'alltheores:bronze_block'],
  ['electrodynamics:resourceblocklead', 'alltheores:lead_block'],
  ['electrodynamics:resourceblocksilver', 'alltheores:silver_block'],
  ['electrodynamics:resourceblocksteel', 'alltheores:steel_block'],
  ['electrodynamics:resourceblocktin', 'alltheores:tin_block'],
  ['enderio:powdered_tin', 'alltheores:tin_dust'],
  ['immersiveengineering:dust_aluminum', 'alltheores:aluminum_dust'],
  ['immersiveengineering:dust_constantan', 'alltheores:constantan_dust'],
  ['immersiveengineering:dust_electrum', 'alltheores:electrum_dust'],
  ['immersiveengineering:dust_lead', 'alltheores:lead_dust'],
  ['immersiveengineering:dust_nickel', 'alltheores:nickel_dust'],
  ['immersiveengineering:dust_silver', 'alltheores:silver_dust'],
  ['immersiveengineering:dust_steel', 'alltheores:steel_dust'],
  ['immersiveengineering:dust_uranium', 'alltheores:uranium_dust'],
  ['immersiveengineering:ingot_aluminum', 'alltheores:aluminum_ingot'],
  ['immersiveengineering:ingot_constantan', 'alltheores:constantan_ingot'],
  ['immersiveengineering:ingot_electrum', 'alltheores:electrum_ingot'],
  ['immersiveengineering:ingot_lead', 'alltheores:lead_ingot'],
  ['immersiveengineering:ingot_nickel', 'alltheores:nickel_ingot'],
  ['immersiveengineering:ingot_silver', 'alltheores:silver_ingot'],
  ['immersiveengineering:ingot_steel', 'alltheores:steel_ingot'],
  ['immersiveengineering:ingot_uranium', 'alltheores:uranium_ingot'],
  ['immersiveengineering:nugget_aluminum', 'alltheores:aluminum_nugget'],
  ['immersiveengineering:nugget_constantan', 'alltheores:constantan_nugget'],
  ['immersiveengineering:nugget_electrum', 'alltheores:electrum_nugget'],
  ['immersiveengineering:nugget_lead', 'alltheores:lead_nugget'],
  ['immersiveengineering:nugget_nickel', 'alltheores:nickel_nugget'],
  ['immersiveengineering:nugget_silver', 'alltheores:silver_nugget'],
  ['immersiveengineering:nugget_steel', 'alltheores:steel_nugget'],
  ['immersiveengineering:nugget_uranium', 'alltheores:uranium_nugget'],
  ['immersiveengineering:storage_aluminum', 'alltheores:aluminum_block'],
  ['immersiveengineering:storage_constantan', 'alltheores:constantan_block'],
  ['immersiveengineering:storage_electrum', 'alltheores:electrum_block'],
  ['immersiveengineering:storage_lead', 'alltheores:lead_block'],
  ['immersiveengineering:storage_nickel', 'alltheores:nickel_block'],
  ['immersiveengineering:storage_silver', 'alltheores:silver_block'],
  ['immersiveengineering:storage_steel', 'alltheores:steel_block'],
  ['immersiveengineering:storage_uranium', 'alltheores:uranium_block'],
  ['mekanism:block_bronze', 'alltheores:bronze_block'],
  ['mekanism:block_lead', 'alltheores:lead_block'],
  ['mekanism:block_osmium', 'alltheores:osmium_block'],
  ['mekanism:block_steel', 'alltheores:steel_block'],
  ['mekanism:block_tin', 'alltheores:tin_block'],
  ['mekanism:block_uranium', 'alltheores:uranium_block'],
  ['mekanism:dust_bronze', 'alltheores:bronze_dust'],
  ['mekanism:dust_lead', 'alltheores:lead_dust'],
  ['mekanism:dust_osmium', 'alltheores:osmium_dust'],
  ['mekanism:dust_steel', 'alltheores:steel_dust'],
  ['mekanism:dust_tin', 'alltheores:tin_dust'],
  ['mekanism:dust_uranium', 'alltheores:uranium_dust'],
  ['mekanism:ingot_bronze', 'alltheores:bronze_ingot'],
  ['mekanism:ingot_lead', 'alltheores:lead_ingot'],
  ['mekanism:ingot_osmium', 'alltheores:osmium_ingot'],
  ['mekanism:ingot_steel', 'alltheores:steel_ingot'],
  ['mekanism:ingot_tin', 'alltheores:tin_ingot'],
  ['mekanism:ingot_uranium', 'alltheores:uranium_ingot'],
  ['mekanism:nugget_bronze', 'alltheores:bronze_nugget'],
  ['mekanism:nugget_lead', 'alltheores:lead_nugget'],
  ['mekanism:nugget_osmium', 'alltheores:osmium_nugget'],
  ['mekanism:nugget_steel', 'alltheores:steel_nugget'],
  ['mekanism:nugget_tin', 'alltheores:tin_nugget'],
  ['mekanism:nugget_uranium', 'alltheores:uranium_nugget'],
  ['modern_industrialization:bronze_block', 'alltheores:bronze_block'],
  ['modern_industrialization:bronze_dust', 'alltheores:bronze_dust'],
  ['modern_industrialization:bronze_ingot', 'alltheores:bronze_ingot'],
  ['modern_industrialization:bronze_nugget', 'alltheores:bronze_nugget'],
  ['modern_industrialization:electrum_block', 'alltheores:electrum_block'],
  ['modern_industrialization:electrum_dust', 'alltheores:electrum_dust'],
  ['modern_industrialization:electrum_ingot', 'alltheores:electrum_ingot'],
  ['modern_industrialization:electrum_nugget', 'alltheores:electrum_nugget'],
  ['modern_industrialization:invar_block', 'alltheores:invar_block'],
  ['modern_industrialization:invar_dust', 'alltheores:invar_dust'],
  ['modern_industrialization:invar_ingot', 'alltheores:invar_ingot'],
  ['modern_industrialization:invar_nugget', 'alltheores:invar_nugget'],
  ['modern_industrialization:iridium_block', 'alltheores:iridium_block'],
  ['modern_industrialization:iridium_dust', 'alltheores:iridium_dust'],
  ['modern_industrialization:iridium_ingot', 'alltheores:iridium_ingot'],
  ['modern_industrialization:iridium_nugget', 'alltheores:iridium_nugget'],
  ['modern_industrialization:lead_block', 'alltheores:lead_block'],
  ['modern_industrialization:lead_dust', 'alltheores:lead_dust'],
  ['modern_industrialization:lead_ingot', 'alltheores:lead_ingot'],
  ['modern_industrialization:lead_nugget', 'alltheores:lead_nugget'],
  ['modern_industrialization:nickel_block', 'alltheores:nickel_block'],
  ['modern_industrialization:nickel_dust', 'alltheores:nickel_dust'],
  ['modern_industrialization:nickel_ingot', 'alltheores:nickel_ingot'],
  ['modern_industrialization:nickel_nugget', 'alltheores:nickel_nugget'],
  ['modern_industrialization:platinum_block', 'alltheores:platinum_block'],
  ['modern_industrialization:platinum_dust', 'alltheores:platinum_dust'],
  ['modern_industrialization:platinum_ingot', 'alltheores:platinum_ingot'],
  ['modern_industrialization:platinum_nugget', 'alltheores:platinum_nugget'],
  ['modern_industrialization:silver_block', 'alltheores:silver_block'],
  ['modern_industrialization:silver_dust', 'alltheores:silver_dust'],
  ['modern_industrialization:silver_ingot', 'alltheores:silver_ingot'],
  ['modern_industrialization:silver_nugget', 'alltheores:silver_nugget'],
  ['modern_industrialization:steel_block', 'alltheores:steel_block'],
  ['modern_industrialization:steel_dust', 'alltheores:steel_dust'],
  ['modern_industrialization:steel_ingot', 'alltheores:steel_ingot'],
  ['modern_industrialization:steel_nugget', 'alltheores:steel_nugget'],
  ['modern_industrialization:tin_block', 'alltheores:tin_block'],
  ['modern_industrialization:tin_dust', 'alltheores:tin_dust'],
  ['modern_industrialization:tin_ingot', 'alltheores:tin_ingot'],
  ['modern_industrialization:tin_nugget', 'alltheores:tin_nugget'],
  ['modern_industrialization:uranium_block', 'alltheores:uranium_block'],
  ['modern_industrialization:uranium_dust', 'alltheores:uranium_dust'],
  ['modern_industrialization:uranium_ingot', 'alltheores:uranium_ingot'],
  ['modern_industrialization:uranium_nugget', 'alltheores:uranium_nugget'],
  ['occultism:silver_block', 'alltheores:silver_block'],
  ['occultism:silver_dust', 'alltheores:silver_dust'],
  ['occultism:silver_ingot', 'alltheores:silver_ingot'],
  ['occultism:silver_nugget', 'alltheores:silver_nugget'],
  ['oritech:electrum_block', 'alltheores:electrum_block'],
  ['oritech:electrum_dust', 'alltheores:electrum_dust'],
  ['oritech:electrum_ingot', 'alltheores:electrum_ingot'],
  ['oritech:nickel_block', 'alltheores:nickel_block'],
  ['oritech:nickel_dust', 'alltheores:nickel_dust'],
  ['oritech:nickel_ingot', 'alltheores:nickel_ingot'],
  ['oritech:nickel_nugget', 'alltheores:nickel_nugget'],
  ['oritech:platinum_block', 'alltheores:platinum_block'],
  ['oritech:platinum_dust', 'alltheores:platinum_dust'],
  ['oritech:platinum_ingot', 'alltheores:platinum_ingot'],
  ['oritech:platinum_nugget', 'alltheores:platinum_nugget'],
  ['oritech:steel_block', 'alltheores:steel_block'],
  ['oritech:steel_dust', 'alltheores:steel_dust'],
  ['oritech:steel_ingot', 'alltheores:steel_ingot'],
  ['oritech:uranium_dust', 'alltheores:uranium_dust'],
  ['overgeared:steel_block', 'alltheores:steel_block'],
  ['overgeared:steel_ingot', 'alltheores:steel_ingot'],
  ['overgeared:steel_nugget', 'alltheores:steel_nugget'],
  ['projectred_exploration:silver_block', 'alltheores:silver_block'],
  ['projectred_exploration:silver_ingot', 'alltheores:silver_ingot'],
  ['projectred_exploration:tin_block', 'alltheores:tin_block'],
  ['projectred_exploration:tin_ingot', 'alltheores:tin_ingot']
]

const ATO_TAG_POLICY_REMOVALS = [
  // Plastics are owner-scoped branch materials, not a global material pool.
  ['c:plastic', 'chemicalscience:polymer_propylene'],
  ['c:plastic', 'chemicalscience:polymer_styrene'],
  ['c:plastic', 'chemicalscience:polymer_vinylchloride'],
  ['c:plastic', 'electrodynamics:sheetplastic'],
  ['c:plastics', 'oritech:plastic_sheet'],

  // Silicon currently mixes storage/network and electronics identities.
  ['c:silicon', 'ae2:silicon'],
  ['c:silicon', 'enderio:silicon'],
  ['c:silicon', 'oritech:silicon'],
  ['c:silicon', 'refinedstorage:silicon'],
  ['c:dusts/silicon', 'chemicalscience:dust_silicon'],
  ['c:dusts/silicon', 'modern_industrialization:silicon_dust'],

  // ProjectRed/BetterNether/Mekanism identity gems must not feed ATO gem processing.
  ['c:gems/ruby', 'betternether:nether_ruby'],
  ['c:gems/ruby', 'projectred_core:ruby'],
  ['c:gems/sapphire', 'projectred_core:sapphire'],
  ['c:gems/peridot', 'projectred_core:peridot'],
  ['c:gems/fluorite', 'mekanism:fluorite_gem'],

  // Nuclear rods are not generic early rod inputs.
  ['c:rods/uranium', 'modern_industrialization:uranium_rod'],

  // astral_dimension identity materials must stay distinct. Astranite,
  // Lucid, and Void are Otherworldly-tier materials with their own role;
  // they should never satisfy generic c: tier tags or be unified into
  // generic ingot/gem pools. (Astral gold is a true gold equivalent and
  // is intentionally not removed from c:ingots/gold.)
  ['c:ingots/astranite',     'astral_dimension:astranite_ingot'],
  ['c:storage_blocks/astranite', 'astral_dimension:astranite_block'],
  ['c:raw_materials/astranite',  'astral_dimension:raw_astranite'],
  ['c:storage_blocks/raw_astranite', 'astral_dimension:raw_astranite_block'],
  ['c:ingots/lucid',         'astral_dimension:lucid_ingot'],
  ['c:storage_blocks/lucid', 'astral_dimension:block_of_lucid'],
  ['c:gems/void',            'astral_dimension:void_shards'],
  ['c:gems/void',            'astral_dimension:void_gem'],
  ['c:gems/void',            'astral_dimension:pure_void']
]

ServerEvents.recipes(event => {
  ATO_FURNACE_DUPLICATE_REMOVALS.forEach(id => {
    event.remove({ id: id })
  })

  IE_ALLOY_DUPLICATE_REMOVALS.forEach(id => {
    event.remove({ id: id })
  })

  // replaceOutput has to resolve both ids to real items, so a single entry from an
  // uninstalled mod aborts this handler and every cleanup below it. Skip missing ids
  // the same way the AStages soft locks do, and say so in the log.
  ATO_COMMON_OUTPUT_REPLACEMENTS.forEach(([from, to]) => {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function') {
      if (!Item.exists(from)) {
        console.warn('[AoA ATO] Skipped missing replacement source ' + from)
        return
      }
      if (!Item.exists(to)) {
        console.warn('[AoA ATO] Skipped missing replacement target ' + to + ' (source ' + from + ')')
        return
      }
    }
    event.replaceOutput({ output: from }, from, to)
  })
})

ServerEvents.tags('item', event => {
  // Oritech biosteel is its own Oritech material, not generic steel.
  event.remove('c:ingots/steel', 'oritech:biosteel_ingot')
  event.remove('c:dusts/steel', 'oritech:biosteel_dust')
  event.remove('c:storage_blocks/steel', 'oritech:biosteel_block')

  // Chemical Science manganin is its own alloy, not generic constantan.
  event.remove('c:ingots/constantan', 'chemicalscience:ingot_manganin')

  ATO_TAG_POLICY_REMOVALS.forEach(([tag, item]) => {
    event.remove(tag, item)
  })
})
