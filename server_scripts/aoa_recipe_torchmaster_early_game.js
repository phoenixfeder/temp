// AoA KubeJS: aoa_recipe_torchmaster_early_game.js
// Replace Torchmaster's native Mega Torch recipe with an early Medieval route.
//
// Verified against:
//   mods/torchmaster-neoforge-1.21.1-21.1.9.jar!
//     data/torchmaster/recipe/megatorch.json
//   kubejs/server_scripts/aoa_astages_06_ore_restrictions.js
//
// The Mega Torch keeps its native 64-block radius and natural-spawn behavior.
// Iron and redstone keep this utility out of the Dark Ages without requiring
// diamonds or gold storage blocks.

ServerEvents.recipes(event => {
  event.remove({ output: 'torchmaster:megatorch' })

  event.shaped('torchmaster:megatorch', [
    'TTT',
    'IRI',
    'ILI'
  ], {
    T: 'minecraft:torch',
    I: '#c:ingots/iron',
    R: 'minecraft:redstone',
    L: '#minecraft:logs'
  }).id('aoa:medieval/torchmaster_megatorch')
})
