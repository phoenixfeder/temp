;(function () {
  if (typeof AStages === 'undefined') return

  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const Component = Java.loadClass('net.minecraft.network.chat.Component')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

  const navigationBlocks = {
    torch: block('minecraft:torch'),
    wallTorch: block('minecraft:wall_torch'),
    soulTorch: block('minecraft:soul_torch'),
    cobblestone: block('minecraft:cobblestone'),
    dirt: block('minecraft:dirt'),
    ladder: block('minecraft:ladder'),
  }

  // Player graves are not structure loot; death can place them inside age-gated dungeons.
  const playerGraveBlocks = {
    graveSimple: block('tombstone:grave_simple'),
    graveNormal: block('tombstone:grave_normal'),
    graveCross: block('tombstone:grave_cross'),
    graveOriginal: block('tombstone:grave_original'),
    subarakiGrave: block('tombstone:subaraki_grave'),
  }

  function safeId(id) {
    return id.replace(/[^a-zA-Z0-9_]/g, '_')
  }

  function resourceLocation(id) {
    return ResourceLocation.parse(id)
  }

  function block(id) {
    return BuiltInRegistries.BLOCK.get(resourceLocation(id))
  }

  function messageFunction(message) {
    return function () {
      return Component.literal(message)
    }
  }

  function lockStructure(stage, ageLabel, structureId) {
    const restrictionId = 'aoa/structure/' + safeId(structureId) + '_pre_' + stage

    AStages.addRestrictionForStructure(restrictionId, stage, resourceLocation(structureId))
      .allowPlaceableBlocks(
        navigationBlocks.torch,
        navigationBlocks.wallTorch,
        navigationBlocks.soulTorch,
        navigationBlocks.cobblestone,
        navigationBlocks.dirt,
        navigationBlocks.ladder
      )
      .allowBreakableBlocks(
        navigationBlocks.torch,
        navigationBlocks.wallTorch,
        navigationBlocks.soulTorch,
        navigationBlocks.cobblestone,
        navigationBlocks.dirt,
        navigationBlocks.ladder,
        playerGraveBlocks.graveSimple,
        playerGraveBlocks.graveNormal,
        playerGraveBlocks.graveCross,
        playerGraveBlocks.graveOriginal,
        playerGraveBlocks.subarakiGrave
      )
      .allowInteractableBlocks(
        playerGraveBlocks.graveSimple,
        playerGraveBlocks.graveNormal,
        playerGraveBlocks.graveCross,
        playerGraveBlocks.graveOriginal,
        playerGraveBlocks.subarakiGrave
      )
      .interactMessage(messageFunction('The mechanisms within this structure require ' + ageLabel + ' knowledge to operate.'))
      .attackMessage(messageFunction('The guardian of this place is beyond your current ability to challenge.'))
  }

  const structureLocks = [
    ['the_renaissance', 'Renaissance', 'cataclysm:cursed_pyramid'],
    ['the_renaissance', 'Renaissance', 'cataclysm:frosted_prison'],
    ['industrial_revolution', 'Industrial Revolution', 'cataclysm:ruined_citadel'],
    ['industrial_revolution', 'Industrial Revolution', 'cataclysm:soul_black_smith'],
    ['gilded_age', 'Gilded Age', 'cataclysm:ancient_factory'],
    ['atomic', 'Atomic', 'cataclysm:burning_arena'],
    ['otherworldly', 'Otherworldly', 'cataclysm:acropolis'],
    ['otherworldly', 'Otherworldly', 'cataclysm:sunken_city'],

    ['the_renaissance', 'Renaissance', 'bosses_of_mass_destruction:lich_tower'],
    ['industrial_revolution', 'Industrial Revolution', 'bosses_of_mass_destruction:obsidilith_arena'],

    ['the_renaissance', 'Renaissance', 'aether:bronze_dungeon'],
    ['the_renaissance', 'Renaissance', 'aether:silver_dungeon'],
    ['gilded_age', 'Gilded Age', 'aether:gold_dungeon'],
    ['gilded_age', 'Gilded Age', 'deep_aether:brass_dungeon'],
  ]

  structureLocks.forEach(function (entry) {
    lockStructure(entry[0], entry[1], entry[2])
  })
})()
