ServerEvents.recipes(event => {
  const plateFallbacks = [
  ['copper', 'immersiveengineering:plate_copper'],
    ['aluminum', 'immersiveengineering:plate_aluminum'],
    ['lead', 'immersiveengineering:plate_lead'],
    ['silver', 'immersiveengineering:plate_silver'],
    ['nickel', 'immersiveengineering:plate_nickel'],
    ['uranium', 'immersiveengineering:plate_uranium'],
    ['steel', 'immersiveengineering:plate_steel'],
    ['constantan', 'immersiveengineering:plate_constantan'],
    ['electrum', 'immersiveengineering:plate_electrum']
  ]

  for (const [metal, plate] of plateFallbacks) {
    event.shapeless(
      Item.of(plate),
      [`#c:ingots/${metal}`]
    ).id(`kubejs:ie/${metal}_plate_fallback`)
  }
})
