// AoA KubeJS: magic_spine_bridges.js
// Magic-to-industry feedstock bridge: Oritech Foundry consumes Neo Vitae Hellforged feedstock.
// See aoa_recipes_ir_magic_feedstock_bridges.js for the full bridge portfolio.

ServerEvents.recipes(event => {
  // Oritech Core 5 stays an Oritech advanced-computing milestone, but now
  // consumes Neo Vitae Hellforged feedstock alongside Theurgy and Malum inputs.
  event.remove({ id: 'oritech:crafting/core5' })

  event.shaped('oritech:machine_core_5', [
    'DAD',
    'HCM',
    'DAD'
  ], {
    A: 'oritech:adamant_ingot',
    C: 'oritech:advanced_computing_engine',
    D: '#aoa:magic_feedstock',
    H: 'malum:hallowed_gold_ingot',
    M: 'theurgy:mercury_catalyst'
  }).id('aoa:magic_spine/oritech_machine_core_5')
})
