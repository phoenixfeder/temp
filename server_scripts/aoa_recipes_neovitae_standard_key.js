// AoA KubeJS: aoa_recipes_neovitae_standard_key.js
// Owner-approved remediation 2026-08-05 (neovitae_p1_hostile_verify_2026-08-05.md
// claim 2): neovitae:standard_key has NO production route in neovitae-1.21.1-1.1.6
// or any of the 577 installed jars - jar code only CONSUMES it (DungeonSealMenu
// shrink(1)), leaving the optional at7 ask loot-only, which violates the standing
// no-loot-only-asks ruling (2026-07-22). The mod itself crafts simple_key and
// mine_entrance_key in the hellfire forge (jar data/neovitae/recipe/hellfire_forge/),
// so this pack recipe extends that ladder one rung: simple key + hellforged reagent
// upcraft, tiered between simple_key (drain 10 / min 100) and mine_entrance_key
// (drain 128 / min 512). Chest loot remains a bonus source.
// Ids verified against the 1.1.6 jar: simple_key, ingot_hellforged,
// corrupted_tiny_dust (all appear in the jar's own hellfire_forge recipes).
ServerEvents.recipes(event => {
  event.custom({
    type: 'neovitae:hellfire_forge',
    drain: 64.0,
    inputs: [
      { item: 'neovitae:simple_key' },
      { item: 'neovitae:ingot_hellforged' },
      { item: 'neovitae:corrupted_tiny_dust' }
    ],
    minDrain: 512.0,
    output: {
      count: 1,
      id: 'neovitae:standard_key'
    }
  }).id('aoa:hellfire_forge/standard_key')
})
