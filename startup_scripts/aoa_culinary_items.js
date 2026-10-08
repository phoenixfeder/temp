// AoA KubeJS: aoa_culinary_items.js
//
// Two gate intermediates for the Ascension Eternal Steak build.
//
// Justification under kubejs/AGENTS.md rule 2 (no fake items unless the
// architecture needs them): both are recipe-gate intermediates on a real
// cross-mod chain. Neither is decorative, and no existing item fills either
// role. The chain is:
//
//   10000 cooked beef  --Neutronium Compressor-->  aoa:beef_singularity
//   beef singularity + Avaritia food tier + EC catalyst
//                      --Extreme Crafting-->       aoa:maillard_core
//   maillard cores + everlasting beef + infinity catalysts + reactor core
//                      --Extreme Crafting-->       artifacts:eternal_steak
//
// Why not an Extended Crafting singularity for the first step:
//   EC singularities are NOT distinct items. SingularityUtils
//   .getItemForSingularity returns a single extendedcrafting:singularity stack
//   carrying a ModDataComponentTypes.SINGULARITY_ID data component. A JSON
//   recipe key cannot reference that without a component ingredient. Avaritia's
//   avaritia:compressor recipe type produces a real registered item id, so the
//   whole chain stays plain JSON. Verified by javap, 2026-08-13.
//
// Both items are inert: no food value, no abilities, no use on their own. They
// exist to be consumed by the next recipe up.

const AOACulinaryComponent = Java.loadClass('net.minecraft.network.chat.Component')

const AOA_CULINARY_ITEMS = [
  {
    id: 'beef_singularity',
    name: 'Beef Singularity',
    tooltip: 'A herd compressed to a point. Do not think about it too hard.'
  },
  {
    id: 'maillard_core',
    name: 'Maillard Core',
    tooltip: 'The browning reaction, held still and made solid.'
  }
]

StartupEvents.registry('item', event => {
  AOA_CULINARY_ITEMS.forEach(function (entry) {
    event.create('aoa:' + entry.id)
      .displayName(AOACulinaryComponent.literal(entry.name))
      .maxStackSize(64)
      .texture('aoa:item/' + entry.id)
      .tooltip(AOACulinaryComponent.literal(entry.tooltip))
  })
})
