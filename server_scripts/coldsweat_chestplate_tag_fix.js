// ============================================================================
//  Cold Sweat chestplate armor-tag fix
// ============================================================================
//
//  Bug: Cold Sweat 2.4.2 ships its chestplates in `minecraft:body_armor`
//  (see ColdSweat-2.4.2.jar -> data/minecraft/tags/item/body_armor.json).
//  `minecraft:body_armor` is NOT a real item tag in 1.21.1. The vanilla chest
//  tag is `minecraft:chest_armor`. Verified against all 128 item tags in
//  client-1.21.1-official.jar: no body_armor.json exists.
//
//  Effect of the bug: the three Cold Sweat chestplates sit in zero vanilla
//  armor tags, so they never reach
//      #minecraft:chest_armor
//        -> #minecraft:enchantable/chest_armor
//        -> #minecraft:enchantable/armor       (Protection, Thorns, ...)
//        -> #minecraft:enchantable/durability  (Unbreaking, Mending, ...)
//        -> #minecraft:trimmable_armor
//  Result in game: the chestplates take NO enchantments at the table or the
//  anvil, and cannot be trimmed. Helmets, leggings and boots are unaffected;
//  Cold Sweat tags those correctly.
//
//  This is not a balance decision. The Chameleon armor material declares an
//  enchantment value of 15 (ModArmorMaterials, same value as leather and
//  netherite), so the pieces were always meant to be enchantable.
//
//  Fix: add the three chestplates to `minecraft:chest_armor`. Everything
//  downstream (enchantability, trims) is inherited from that one tag.
//
//  Scope: Cold Sweat only. Does not touch the mod's own insulation tags.
// ============================================================================

ServerEvents.tags('item', event => {

  event.add('minecraft:chest_armor', 'cold_sweat:chameleon_chestplate')
  event.add('minecraft:chest_armor', 'cold_sweat:goat_fur_chestplate')
  event.add('minecraft:chest_armor', 'cold_sweat:hoglin_chestplate')

})
