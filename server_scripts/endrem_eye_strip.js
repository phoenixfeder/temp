// AoA KubeJS: endrem_eye_strip.js
// Theme: Strip most vanilla EndRem eye sources; keep only verified controlled routes.
// Exceptions (kept vanilla): Exotic Eye (ocean craft), Guardian Eye (Elder Guardian kill), Witch Eye (witch_pupil craft).
// Also stripped via config: Cryptic Eye (enchanting) + Evil Eye (villager trade) —
//   see config/EndRemastered-NeoForge/endrem.json: IS_CRYPTIC_EYE_OBTAINABLE/IS_EVIL_EYE_OBTAINABLE = false.

ServerEvents.recipes(event => {
  // Exotic Eye (ocean-item craft) remains visible; its native recipe is the verified legal route.

  // Undead Eye (undead_soul + ghast_tear + bone + rotten_flesh + phantom_membrane) → quest-only
  event.remove({ id: 'endrem:undead_eye' })

  // NOTE: endrem:witch_eye recipe is intentionally NOT removed — vanilla craft is kept.
})

LootJS.modifiers(event => {
  // Structure chests — EndRem injects eyes via datapack loot tables + GLMs (confirmed in jar).
  // LootJS removeLoot runs after injection, so these strip successfully.
  event.addTableModifier('minecraft:chests/desert_pyramid').removeLoot('endrem:old_eye')
  event.addTableModifier('minecraft:chests/nether_bridge').removeLoot('endrem:nether_eye')
  event.addTableModifier('minecraft:chests/igloo_chest').removeLoot('endrem:cold_eye')
  event.addTableModifier('minecraft:chests/jungle_temple').removeLoot('endrem:rogue_eye')
  event.addTableModifier('minecraft:chests/buried_treasure').removeLoot('endrem:black_eye')
  event.addTableModifier('minecraft:chests/shipwreck_treasure').removeLoot('endrem:black_eye')
  event.addTableModifier('minecraft:chests/abandoned_mineshaft').removeLoot('endrem:lost_eye')
  event.addTableModifier('minecraft:chests/simple_dungeon').removeLoot('endrem:lost_eye')
  event.addTableModifier('minecraft:chests/simple_dungeon').removeLoot('endrem:old_eye')
  event.addTableModifier('minecraft:chests/pillager_outpost').removeLoot('endrem:corrupted_eye')
  event.addTableModifier('minecraft:chests/bastion_treasure').removeLoot('endrem:cursed_eye')
  event.addTableModifier('minecraft:chests/woodland_mansion').removeLoot('endrem:magical_eye')

  // Mob drops — Magical Eye on Evoker, Wither Eye on Wither boss.
  event.addEntityModifier('minecraft:evoker').removeLoot('endrem:magical_eye')
  event.addEntityModifier('minecraft:wither').removeLoot('endrem:wither_eye')

  // NOTE: Elder Guardian → Guardian Eye is intentionally NOT stripped (vanilla source kept).
  // NOTE: Witch → witch_pupil drop is NOT stripped — witch_pupil is the craft ingredient for witch_eye.
})

// TODO [VERIFY]: In-game confirmation pass —
//   1. Loot chests of each structure; confirm no EndRem eyes spawn.
//   2. Kill an Evoker/Wither; confirm no magical_eye/wither_eye drop.
//   3. Elder Guardian + witch_pupil craft must STILL drop their eyes.
//   4. Attempt to craft exotic_eye and undead_eye → recipes must be gone.
//   5. Enchant books many times and check Master Cleric trades → no cryptic/evil eyes.
