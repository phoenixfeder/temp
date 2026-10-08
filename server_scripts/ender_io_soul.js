// AoA KubeJS: ender_io_soul.js
// Theme: Malum soul economy injected into Ender IO alloy progression.
// NeoForge 1.21.1 / KubeJS 2101.x.

ServerEvents.recipes(event => {
  // ---- Soularium: require soul-stained steel ingot ------------------------
  event.remove({ type: 'enderio:alloy_smelting', output: 'enderio:soularium_ingot' })

  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 5600,
    experience: 0.3,
    inputs: [
      { count: 1, item: 'minecraft:soul_sand' },
      { count: 1, tag: 'c:ingots/gold' },
      { count: 1, item: 'malum:soul_stained_steel_ingot' }
    ],
    output: { count: 1, id: 'enderio:soularium_ingot' }
  }).id('aoa:ender_io_soul/soularium_from_soul_sand_and_soul_stained_steel')

  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 5600,
    experience: 0.3,
    inputs: [
      { count: 1, item: 'minecraft:soul_soil' },
      { count: 1, tag: 'c:ingots/gold' },
      { count: 1, item: 'malum:soul_stained_steel_ingot' }
    ],
    output: { count: 1, id: 'enderio:soularium_ingot' }
  }).id('aoa:ender_io_soul/soularium_from_soul_soil_and_soul_stained_steel')

  // ---- Dark Steel: require soul-stained steel ingot ----------------------
  event.remove({ type: 'enderio:alloy_smelting', output: 'enderio:dark_steel_ingot' })

  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 3200,
    experience: 0.3,
    inputs: [
      { count: 1, item: 'malum:soul_stained_steel_ingot' },
      { count: 1, tag: 'c:dusts/coal' },
      { count: 1, tag: 'c:obsidians' }
    ],
    output: { count: 1, id: 'enderio:dark_steel_ingot' }
  }).id('aoa:ender_io_soul/dark_steel_with_soul_stained_steel')
})
