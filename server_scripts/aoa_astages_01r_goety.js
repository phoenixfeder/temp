// AoA KubeJS: aoa_astages_01r_goety.js
// Goety Dark-Arts Integration (Task 1) -- the AStages gating surface for the
// Goety necromancy ladder. Mirrors the item-lock idiom of aoa_astages_01m_magic.js
// (soft-item policy + addRestrictionForItem, [stage, item, kind] triples).
//
// Age placement of the Goety ladder:
//   the_renaissance      -> the dark_altar/pedestal ritual apparatus, the wand +
//                           focus economy (dark_wand, empty_focus), the two altar
//                           emeralds (soul_emerald, magic_emerald), and the learned
//                           spell scrolls (haunting/warred/ravaging/front/floral/
//                           buried/mistral/dark/bygone).
//   industrial_revolution -> the mid-mod alloy/automation beat (necro_brazier,
//                           dark_ingot, philosophers_stone per owner ruling D4,
//                           animation_core, animator).
//   gilded_age           -> the forbidden/arca upgrade economy (arca, arca_compass,
//                           forbidden_piece/fragment/scroll), the cursed paladin
//                           armour set, and the prestige curios/weapons
//                           (frozen_blade, unholy_blood, malefic_helm, infernal_tome,
//                           crone_hat, warlock_sash).
//   otherworldly         -> the lichdom capstone reagents (undeath_potion,
//                           terminus_scroll).
//
// UNLOCKED BY DESIGN (Medieval entry, do NOT gate): goety:totem_of_roots,
// goety:cursed_infuser, goety:witch_cauldron. These are the pre-altar entry
// apparatus and stay available with the Medieval chapter. goety:soul_absorber
// is also left unlocked, but its craft is a ritual whose chain (hunger_core ->
// empty_focus plus the Dark Altar) only opens at the Renaissance in practice.
//
// Registers NO stages and grants NO stages -- KubeJS only registers restrictions
// (owner ruling D3a). Consumes the existing stage ids from
// aoa_astages_00_register_stages.js verbatim. Most-restrictive-wins across all
// aoa_astages_*.js files, so these locks only ever add restriction; the whole
// Goety ladder is Renaissance+ content, so every lock sits at or after its recipe
// ceiling and cannot softlock.
//
// Verification notes (jar: goety-3.0.5.jar, item models + lang, 2026-07-23):
//   * goety:pedestal is the real registry id (NOT goety:dark_pedestal). Like the
//     dark_altar it ships a base id plus 10 material variants. All 11 pedestal
//     variants are locked here to match the 11 dark_altar variants, so a player
//     cannot bypass the altar apparatus by crafting a material-variant pedestal.
//     goety:pedestal_dummy (an internal item-form placeholder) is left out.
//   * goety:warped_wand does NOT exist in goety-3.0.5 (only goety:dark_wand is
//     registered; the sole "warped" items are warped_wartful_egg and
//     nether_robe_warped). It is OMITTED. See the task report NEEDS_VERIFICATION.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages goety] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages goety] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // --- the_renaissance: dark altar ritual apparatus ---
    ["the_renaissance", "goety:dark_altar", "block_item"],
    ["the_renaissance", "goety:dark_altar_stone", "block_item"],
    ["the_renaissance", "goety:dark_altar_deepslate", "block_item"],
    ["the_renaissance", "goety:dark_altar_blackstone", "block_item"],
    ["the_renaissance", "goety:dark_altar_nether_brick", "block_item"],
    ["the_renaissance", "goety:dark_altar_end_stone", "block_item"],
    ["the_renaissance", "goety:dark_altar_ominous_stone", "block_item"],
    ["the_renaissance", "goety:dark_altar_highrock", "block_item"],
    ["the_renaissance", "goety:dark_altar_marble", "block_item"],
    ["the_renaissance", "goety:dark_altar_prismarine", "block_item"],
    ["the_renaissance", "goety:dark_altar_crypt_stone", "block_item"],
    // Pedestals hold ingredients around the altar for multi-item rituals. Same
    // base + 10 material variants as the altar; all locked for bypass symmetry.
    ["the_renaissance", "goety:pedestal", "block_item"],
    ["the_renaissance", "goety:pedestal_stone", "block_item"],
    ["the_renaissance", "goety:pedestal_deepslate", "block_item"],
    ["the_renaissance", "goety:pedestal_blackstone", "block_item"],
    ["the_renaissance", "goety:pedestal_nether_brick", "block_item"],
    ["the_renaissance", "goety:pedestal_end_stone", "block_item"],
    ["the_renaissance", "goety:pedestal_ominous_stone", "block_item"],
    ["the_renaissance", "goety:pedestal_highrock", "block_item"],
    ["the_renaissance", "goety:pedestal_marble", "block_item"],
    ["the_renaissance", "goety:pedestal_prismarine", "block_item"],
    ["the_renaissance", "goety:pedestal_crypt_stone", "block_item"],
    // --- the_renaissance: wand + focus + emerald economy ---
    ["the_renaissance", "goety:dark_wand", "item"],
    ["the_renaissance", "goety:empty_focus", "item"],
    ["the_renaissance", "goety:soul_emerald", "item"],
    ["the_renaissance", "goety:magic_emerald", "item"],
    // --- the_renaissance: learned spell scrolls ---
    ["the_renaissance", "goety:haunting_scroll", "item"],
    ["the_renaissance", "goety:warred_scroll", "item"],
    ["the_renaissance", "goety:ravaging_scroll", "item"],
    ["the_renaissance", "goety:front_scroll", "item"],
    ["the_renaissance", "goety:floral_scroll", "item"],
    ["the_renaissance", "goety:buried_scroll", "item"],
    ["the_renaissance", "goety:mistral_scroll", "item"],
    ["the_renaissance", "goety:dark_scroll", "item"],
    ["the_renaissance", "goety:bygone_scroll", "item"],
    // --- industrial_revolution: alloy + automation beat ---
    ["industrial_revolution", "goety:necro_brazier", "block_item"],
    ["industrial_revolution", "goety:dark_ingot", "item"],
    // Dark-alloy products are bench crafts from dark_ingot with no lock of their
    // own; the Vizier's 100% treasure_pouch drop can roll dark_ingot at Ren, so
    // the whole product family locks at the ingot's IR tier (finding 6 of
    // goety_questline_verification_2026-08-05; coverage completed 2026-08-08 --
    // the original fix locked only pickaxe+shovel, 2 of 12 products).
    ["industrial_revolution", "goety:dark_pickaxe", "item"],
    ["industrial_revolution", "goety:dark_shovel", "item"],
    ["industrial_revolution", "goety:dark_sword", "item"],
    ["industrial_revolution", "goety:dark_axe", "item"],
    ["industrial_revolution", "goety:dark_hoe", "item"],
    ["industrial_revolution", "goety:dark_metal_scythe", "item"],
    ["industrial_revolution", "goety:dark_helmet", "item"],
    ["industrial_revolution", "goety:dark_chestplate", "item"],
    ["industrial_revolution", "goety:dark_leggings", "item"],
    ["industrial_revolution", "goety:dark_boots", "item"],
    ["industrial_revolution", "goety:dark_metal_block", "block_item"],
    ["industrial_revolution", "goety:dark_anvil", "block_item"],
    ["industrial_revolution", "goety:philosophers_stone", "item"],
    ["industrial_revolution", "goety:animation_core", "item"],
    ["industrial_revolution", "goety:animator", "block_item"],
    // --- gilded_age: forbidden + arca upgrade economy ---
    ["gilded_age", "goety:arca", "block_item"],
    ["gilded_age", "goety:arca_compass", "item"],
    ["gilded_age", "goety:forbidden_piece", "item"],
    ["gilded_age", "goety:forbidden_fragment", "item"],
    ["gilded_age", "goety:forbidden_scroll", "item"],
    ["gilded_age", "goety:cursed_paladin_helmet", "item"],
    ["gilded_age", "goety:cursed_paladin_chestplate", "item"],
    ["gilded_age", "goety:cursed_paladin_leggings", "item"],
    ["gilded_age", "goety:cursed_paladin_boots", "item"],
    ["gilded_age", "goety:frozen_blade", "item"],
    ["gilded_age", "goety:unholy_blood", "item"],
    ["gilded_age", "goety:malefic_helm", "item"],
    ["gilded_age", "goety:infernal_tome", "item"],
    ["gilded_age", "goety:crone_hat", "item"],
    ["gilded_age", "goety:warlock_sash", "item"],
    // --- otherworldly: lichdom capstone reagents ---
    ["otherworldly", "goety:undeath_potion", "item"],
    ["otherworldly", "goety:terminus_scroll", "item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
