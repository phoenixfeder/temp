// Neo Vitae cross-mod recipe weaves (2026-06-26)
// Schemas extracted from native NV recipes (recon-verified). Two weaves REPLACE a single
// native route (NV1, NV2); NV3 is an intentional ADDITIVE optional alternate.
ServerEvents.recipes(event => {

  // ── NV1 — Spirit-Fed Sentient Forge (Malum -> NV) ───────────────────────────
  // REPLACE the single native sentient_axe transform: now also requires a Malum Arcane Spirit.
  // (hellfire_forge_transform schema: transformInput, catalysts[], drain, minDrain, output{count,id})
  event.remove({ output: 'neovitae:sentient_axe' })
  event.custom({
    type: 'neovitae:hellfire_forge_transform',
    transformInput: { item: 'minecraft:iron_axe' },
    catalysts: [ { item: 'neovitae:spiritus_gem_petty' }, { item: 'malum:arcane_spirit' } ],
    drain: 0.0,
    minDrain: 0.0,
    output: { count: 1, id: 'neovitae:sentient_axe' }
  }).id('aoa:neovitae/sentient_axe_spiritbound')

  // ── NV2 — Calcined Salt Catalyst (Theurgy -> NV) ────────────────────────────
  // REPLACE the single native raw_spiritus_catalyst forge recipe: swap the filler potato for a
  // Theurgy alchemical salt. Native inputs were [c:crops/nether_wart, neovitae:tau_oil,
  // c:dusts/sulfur, minecraft:potato]; drain 20 / minDrain 400.
  // (hellfire_forge schema: inputs[], drain, minDrain, output{count,id})
  event.remove({ output: 'neovitae:raw_spiritus_catalyst' })
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { tag: 'c:crops/nether_wart' },
      { item: 'neovitae:tau_oil' },
      { tag: 'c:dusts/sulfur' },
      { tag: 'theurgy:alchemical_salts' }
    ],
    drain: 20.0,
    minDrain: 400.0,
    output: { count: 1, id: 'neovitae:raw_spiritus_catalyst' }
  }).id('aoa:neovitae/raw_spiritus_catalyst_salted')

  // ── NV3 — Otherworld Bloom Flask (Occultism -> NV) ──────────────────────────
  // ADDITIVE (alchemy_flask's only native route is an ara_vitae_recipe on a DIFFERENT machine,
  // so this alchemy-table route is genuinely new, not a duplicate -> no remove needed).
  // (alchemytable schema: "input" is a singular key with an array value, output{count,id}, syphon, ticks, upgradeLevel)
  event.custom({
    type: 'neovitae:alchemytable',
    input: [
      { item: 'neovitae:simple_catalyst' },
      { item: 'occultism:otherworld_essence' }
    ],
    output: { count: 1, id: 'neovitae:alchemy_flask' },
    syphon: 500,
    ticks: 200,
    upgradeLevel: 1
  }).id('aoa:neovitae/otherworld_bloom_flask')

})
