// AoA KubeJS: aoa_simulated_engine_assembly_info.js
// Explains the restored Create: Simulated assembly route in EMI.

RecipeViewerEvents.addInformation('item', function (event) {
  event.add('simulated:engine_assembly', [
    'Start with a Tin Plate and complete eight loops of Mechanical Saw cutting followed by Mechanical Press pressing.',
    'Follow the Sequenced Assembly recipe shown in EMI. The Tin Plate input avoids the Create Deco recipes that also use the Mechanical Saw.'
  ])

  event.add('simulated:red_portable_engine', [
    'Craft an Engine Assembly first through its eight-loop Create Sequenced Assembly recipe.',
    'Then combine it vertically with an Iron Sheet above and a Blast Furnace below.'
  ])
})
