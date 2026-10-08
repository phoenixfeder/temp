// AoA Atomic Age cross-mod weaves (2026-06-10).
// A1 "Yellowcake Interchange" — the nuclear-ladder bridge pinned by
// 22_CANON_nuclear_ladder.md: Mekanism's enrichment line feeds Nuclear
// Science's Nuclear Boiler by joining mekanism:yellow_cake_uranium to the
// c:yellow_cake_uranium tag (stock tag holds only nuclearscience:yellowcake).
// One tag line, no recipe ids touched, no CT collision (CT is greenfield).
// Taught in prose at at3 "Chemical Extractor" / "Nuclear Boiler" and in the
// Atomic Modonomicon book.

// A1b (2026-07-10 nuclear chain, bridge B1): Create Nuclear's yellowcake joins
// the same tag. CN's own enrichment chain consumes the literal item, not the
// tag, so CN is untouched; this only lets CN surplus feed the NS Nuclear
// Boiler / MSR pre-processor (both consume c:yellow_cake_uranium). Taught in
// quest at3 "Yellowcake Interchange".

ServerEvents.tags('item', event => {
  event.remove('c:fuel_rods/heuo2', 'nuclearscience:fuelleuo2')
  event.remove('c:fuel_rods/leuo2', 'nuclearscience:fuelheuo2')
  event.add('c:fuel_rods/heuo2', 'nuclearscience:fuelheuo2')
  event.add('c:fuel_rods/leuo2', 'nuclearscience:fuelleuo2')
  event.add('c:yellow_cake_uranium', 'mekanism:yellow_cake_uranium')
  event.add('c:yellow_cake_uranium', 'createnuclear:yellowcake')
})

// A2 (2026-07-10 nuclear chain, bridge B2): plutonium interchange. Joins
// Mekanism and Nuclear Science plutonium into the shared c:dusts/plutonium
// MOX lane (Oritech + MI dusts are in the tag natively). No back-conversion
// path exists, so no route is removed and no age is skipped. Taught in quests
// convergence "Plutonium Stockpile" and at3 "The MOX Program".
//
// A3 (2026-07-10 nuclear chain, bridge B3): D-T fuel interchange. MI fluids
// fill NS cells (the atomic first-light fuel); NS cells decant into Mekanism's
// chemical system (the OW scale-up). The c:deuterium / c:tritium FLUID tags
// already contain both mods' fluids in-jar (redteam D3), so no tag ops here.
// Recipe field shapes mirror stock jar data (redteam D4): flat input for
// mekanism types; NS extractor uses fluidinputs tag + iteminputs ingredient.
// Taught in quests at3 "Twin Gases" and ow6 "Fusion Fuel Program".

ServerEvents.recipes(event => {
  // B2: Mekanism pellet -> canonical dust (Crusher)
  event.custom({
    type: 'mekanism:crushing',
    input: { count: 1, item: 'mekanism:pellet_plutonium' },
    output: { count: 1, id: 'modern_industrialization:plutonium_dust' },
    id: 'aoa:weave/atomic/pu_pellet_to_dust'
  })
  // B2: Nuclear Science Pu-239 -> canonical dust (MI Macerator)
  event.custom({
    type: 'modern_industrialization:macerator',
    eu: 2, duration: 200,
    item_inputs: [{ item: 'nuclearscience:plutonium239', amount: 1 }],
    item_outputs: [{ item: 'modern_industrialization:plutonium_dust', amount: 1 }],
    id: 'aoa:weave/atomic/pu239_to_dust'
  })
  // B3: fill empty NS cell from 1000 mB c:deuterium (NS Chemical Extractor).
  // ticks/usagepertick mirror the stock NS cell-fill energy profile.
  event.custom({
    type: 'nuclearscience:chemical_extractor_recipe',
    fluidinputs: [{ amount: 1000, tag: 'c:deuterium' }],
    group: 'nuclearscience',
    iteminputs: [{ count: 1, ingredient: { item: 'nuclearscience:cellempty' } }],
    output: { count: 1, id: 'nuclearscience:celldeuterium' },
    ticks: 400, usagepertick: 750.0,
    id: 'aoa:weave/atomic/fill_cell_deuterium'
  })
  // B3: fill empty NS cell from 1000 mB c:tritium
  event.custom({
    type: 'nuclearscience:chemical_extractor_recipe',
    fluidinputs: [{ amount: 1000, tag: 'c:tritium' }],
    group: 'nuclearscience',
    iteminputs: [{ count: 1, ingredient: { item: 'nuclearscience:cellempty' } }],
    output: { count: 1, id: 'nuclearscience:celltritium' },
    ticks: 400, usagepertick: 750.0,
    id: 'aoa:weave/atomic/fill_cell_tritium'
  })
  // B3: decant NS cell -> Mekanism chemical (cell consumed)
  event.custom({
    type: 'mekanism:chemical_conversion',
    input: { count: 1, item: 'nuclearscience:celldeuterium' },
    output: { amount: 1000, id: 'mekanismgenerators:deuterium' },
    id: 'aoa:weave/atomic/cell_to_mek_deuterium'
  })
  event.custom({
    type: 'mekanism:chemical_conversion',
    input: { count: 1, item: 'nuclearscience:celltritium' },
    output: { amount: 1000, id: 'mekanismgenerators:tritium' },
    id: 'aoa:weave/atomic/cell_to_mek_tritium'
  })
})
