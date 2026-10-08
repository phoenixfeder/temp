// AoA Industrial native bridge anchors.
// Recipe concept names stay descriptive only; the physical outputs are native
// installed-mod items, not custom aoa:* capstone objects.

ServerEvents.recipes(event => {
  event.remove({ id: 'oritech:crafting/frame' })
  event.remove({ id: 'oritech:crafting/foundry' })

  // Sanctified Machine Frame: ir_factory_discipline support component.
  event.shaped(Item.of('oritech:machine_frame_block', 16), [
    'BIB',
    'NCN',
    'BSB'
  ], {
    B: 'minecraft:iron_bars',
    I: '#c:plates/iron',
    N: '#c:ingots/nickel',
    C: 'immersiveengineering:component_iron',
    S: '#c:ingots/steel'
  }).id('aoa:ir_factory_discipline/sanctified_machine_frame')

  // Aureal Foundry: ir_magic_feedstock milestone anchor.
  event.shaped(Item.of('oritech:foundry_block'), [
    'FCF',
    'RMD',
    'EFE'
  ], {
    F: '#c:ingots/copper',
    C: 'minecraft:cauldron',
    R: 'immersiveengineering:rs_engineering',
    M: 'oritech:motor',
    D: '#aoa:magic_feedstock',
    E: '#c:ingots/electrum'
  }).id('aoa:ir_magic_feedstock/aureal_foundry')
})
