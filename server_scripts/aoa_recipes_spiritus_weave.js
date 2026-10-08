// AoA KubeJS: aoa_recipes_spiritus_weave.js
// Condensed Ruin weave (owner request 2026-07-31): the aspected Spiritus crystals
// are "spirits too" -- so obtainable Malum and Theurgy spirit materials can condense
// one directly. ADDITIVE alternate route to neovitae:spiritus_ruina_shard; the
// mod-native route (Crystallarium raw cluster -> Ruina Catalyst + Animus Mote
// transmute -> harvest) is deliberately untouched: no event.remove here.
// IR anchor: base_spiritus_soul_ruina only drops from Ruina-aspected Demon Realm
// mobs, and dimension neovitae:dungeon is industrial_revolution-locked
// (aoa_astages_03_dimension_restrictions.js) -- the recipe cannot fire pre-IR.
// Schema precedent: aoa_recipes_neovitae_weaves.js NV2 (neovitae:hellfire_forge
// custom type: inputs[], drain, minDrain, output{count,id}); cost sits between the
// native catalyst tier (20/400) and the native crystal tier (100/1200).
ServerEvents.recipes(event => {
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { item: 'neovitae:base_spiritus_soul_ruina' },
      { item: 'malum:wicked_spirit' },
      { item: 'malum:wicked_spirit' },
      { tag: 'theurgy:alchemical_salts' }
    ],
    drain: 50.0,
    minDrain: 800.0,
    output: { count: 1, id: 'neovitae:spiritus_ruina_shard' }
  }).id('aoa:neovitae/spiritus_ruina_shard_condensed')
})
