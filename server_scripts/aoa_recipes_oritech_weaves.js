// AoA KubeJS: aoa_recipes_oritech_weaves.js
// Cross-mod recipe weaves that rewrite distinctive, low-volume Oritech items
// so other installed mods' age-appropriate items matter at Atomic and Ascension.
// All ingredient IDs verified against installed jar lang files on 2026-05-13.
// Per-weave intent: AoA_Architecture_Vault/07 Cross-Mod Weaves/oritech.md

ServerEvents.recipes(event => {
  // --- Weave 1: Arcane Augment Station (Atomic) ---------------------------
  // The native crystal/lens/ender_eye recipe ignores the item's "arcane" name.
  // Replace with a ritual ring: Neo Vitae hellforged dust, Malum eldritch
  // spirit, and a Theurgy mercury shard around the Gilded
  // simple_augment_station as the central upgrade base.
  event.remove({ id: 'oritech:crafting/augment/arcane' })

  event.shaped('oritech:arcane_augment_station', [
    'DMD',
    'SCS',
    'PEP'
  ], {
    D: 'neovitae:hellforged_dust',
    M: 'theurgy:mercury_shard',
    S: 'malum:eldritch_spirit',
    C: 'oritech:simple_augment_station',
    P: '#oritech:plating',
    E: 'minecraft:ender_eye'
  }).id('aoa:oritech_weaves/arcane_augment_station_ritual')

  // --- Weave 2: Enchantment Catalyst Block (Atomic) -----------------------
  // Both native catalyst routes treat the catalyst as plain industrial output.
  // Replace with an Apothic graduation: Apothic Enchanting hellshelves +
  // Apotheosis Godforged Pearl as the rarity heart, on an enchanting table.
  event.remove({ id: 'oritech:crafting/catalyst' })
  event.remove({ id: 'oritech:crafting/catalyst_alt' })

  event.shaped('oritech:enchantment_catalyst_block', [
    'HHH',
    'SGS',
    'ATA'
  ], {
    H: 'apothic_enchanting:hellshelf',
    S: 'apothic_enchanting:sightshelf',
    // Apotheosis 8.6.1 renamed the rarity materials; the mythic material item
    // is godforged_pearl (rarities/mythic.json). The old id silently failed
    // the whole recipe, leaving the catalyst uncraftable post-remove.
    G: 'apotheosis:godforged_pearl',
    A: 'oritech:adamant_ingot',
    T: 'minecraft:enchanting_table'
  }).id('aoa:oritech_weaves/enchantment_catalyst_apothic')

  // --- Weave 6: Unstable Container (Ascension) ----------------------------
  // Native is a vanilla shaped recipe that ignores Ascension prestige systems.
  // Replace with a convergence using AvaritiaNeo crystal matrix and neutronium
  // ingots, Draconic Evolution chaotic core, Modular Force Fields fortron
  // capacitor, with one piece of native Oritech (flux gate) as anchor.
  // NOTE: infinity_ingot intentionally excluded — it is downstream of this
  // craft in Ascension and would create a cycle.
  event.remove({ id: 'oritech:crafting/unstablecontainer' })

  event.shaped('oritech:unstable_container', [
    'CDC',
    'FNF',
    'COC'
  ], {
    C: 'avaritia:crystal_matrix_ingot',
    D: 'draconicevolution:chaotic_core',
    F: 'modularforcefields:fortroncapacitor',
    N: 'avaritia:neutronium_ingot',
    O: 'oritech:flux_gate'
  }).id('aoa:oritech_weaves/unstable_container_convergence')
})
