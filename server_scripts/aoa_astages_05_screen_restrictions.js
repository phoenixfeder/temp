;(function () {
  if (typeof AStages === 'undefined') return

  const screenLocks = [
    ["the_renaissance", "minecraft:enchantment", "minecraft:enchanting_table"],
    ["the_renaissance", "minecraft:beacon", "minecraft:beacon"],
  ]

  screenLocks.forEach(function (entry) {
    const id = 'aoa/screen/' + entry[0] + '/' + entry[1].replace(/[^a-zA-Z0-9_]/g, '_')
    AStages.addRestrictionForScreen(id, entry[0], entry[1])
  })
})()
