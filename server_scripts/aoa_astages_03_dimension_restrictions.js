;(function () {
  if (typeof AStages === 'undefined') return

  const dimensionLocks = [
    ["the_renaissance", "minecraft:the_nether"],
    ["the_renaissance", "minecraft:the_end"],
    ["industrial_revolution", "deeperdarker:otherside"],
    ["the_renaissance", "eternal_starlight:starlight"],
    ["the_renaissance", "aether:the_aether"],
    ["industrial_revolution", "undergarden:undergarden"],
    ["gilded_age", "astral_dimension:astral_dimension"],
    ["gilded_age", "astral_dimension:setback"],
    ["atomic", "spectrum:deeper_down"],
    // Ad Astra replaced Stellaris as the space mod (2026-08-30). Every Ad Astra
    // dimension is gated here; moon_orbit, glacio and glacio_orbit had no
    // Stellaris counterpart and were previously ungated.
    ["otherworldly", "ad_astra:earth_orbit"],
    ["otherworldly", "ad_astra:moon"],
    ["otherworldly", "ad_astra:moon_orbit"],
    ["otherworldly", "ad_astra:mars"],
    ["otherworldly", "ad_astra:mars_orbit"],
    ["otherworldly", "ad_astra:venus"],
    ["otherworldly", "ad_astra:venus_orbit"],
    ["otherworldly", "ad_astra:mercury"],
    ["otherworldly", "ad_astra:mercury_orbit"],
    ["otherworldly", "ad_astra:glacio"],
    ["otherworldly", "ad_astra:glacio_orbit"],
    ["otherworldly", "the_afterdark:afterdark"],
    ["atomic", "macabre:the_pit"],
    // Macabre 0.9.2 Limbo: reachable only after the Otherworldly Dead God (via the dead_god_egg),
    // so it is Otherworldly-tier, not Atomic. The Pit is re-enterable — entry via
    // crystalized_blood auto-grants a cracked_crystalized_blood return ticket
    // (bytecode-verified 2026-07-25).
    ["otherworldly", "macabre:limbo"],
    ["industrial_revolution", "neovitae:dungeon"],
  ]

  dimensionLocks.forEach(function (entry) {
    const id = 'aoa/dimension/' + entry[0] + '/' + entry[1].replace(/[^a-zA-Z0-9_]/g, '_')
    AStages.addRestrictionForDimension(id, entry[0], entry[1])
  })
})()
