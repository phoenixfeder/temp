// AoA KubeJS: Farmer's Delight cooking pot — medieval Overgeared alignment
//
// Vanilla FD recipe hard-requires minecraft:wooden_shovel, but AoA removes all
// wooden tool recipes (early_overgeared_progression_cleanup.js). Iron ingots
// are medieval_times-gated, so this craft belongs in Medieval, not Dark Ages.
//
// Swap: wooden_shovel -> stone_shovel (assembled via overgeared:stone_shovel_head + stick).

ServerEvents.recipes(event => {
  event.remove({ id: 'farmersdelight:cooking_pot' })

  event.shaped('farmersdelight:cooking_pot', [
    'bSb',
    'iWi',
    'iii'
  ], {
    S: 'minecraft:stone_shovel',
    W: '#c:buckets/water',
    b: 'minecraft:brick',
    i: '#c:ingots/iron'
  }).id('aoa:medieval/farmersdelight_cooking_pot')
})
