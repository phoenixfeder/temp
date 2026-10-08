// AoA KubeJS: aoa_modonomicon_book_models.js
//
// Registers three placeholder "model anchor" items so Modonomicon's
// BookOverrideModel can resolve per-book custom textures.
//
// Why this exists:
//   Modonomicon's BookOverrideModel resolves a book's `model` field via
//   ModelResourceLocation(model, "inventory") and asks the model manager
//   to bake it. That MRL only resolves if the model is tied to a real
//   registered item (or registered via ModelEvent.RegisterAdditional,
//   which KubeJS 2101 does not expose). Modonomicon itself only
//   registers its 6 built-in book item IDs (modonomicon, modonomicon_*,
//   leaflet) — none of our custom AoA book IDs.
//
//   By registering these three placeholder items in the aoa: namespace,
//   their inventory models auto-bake. We then point each book.json's
//   `model` field at the corresponding item ID. Modonomicon's MRL lookup
//   succeeds and the custom texture renders.
//
// Player visibility:
//   - Hidden from JEI via aoa_modonomicon_book_models_jei_hide.js
//   - Players never craft or pick up these items in normal gameplay.
//     Book grants (aoa_book_grants.js) and recipes (aoa_book_recipes.js)
//     still produce the standard modonomicon:modonomicon item with the
//     per-book NBT — those are what reaches inventories.
//   - These exist purely as model-bakery anchors. Items show up in the
//     creative search under the aoa tab; that is the only side effect.

const AOAModonomiconComponent = Java.loadClass('net.minecraft.network.chat.Component')

const BOOK_ICON_ITEMS = [
  { id: 'dark_ages_manual',        name: 'Dark Ages Manual (model anchor)' },
  { id: 'medieval_codex',          name: 'Medieval Codex (model anchor)' },
  { id: 'renaissance_compendium',  name: 'Renaissance Compendium (model anchor)' },
  { id: 'gilded_ledger',           name: 'Gilded Ledger (model anchor)' },
  { id: 'atomic_dossier',          name: 'Atomic Dossier (model anchor)' },
  { id: 'industrial_codex',        name: 'Industrial Codex (model anchor)' },
  { id: 'otherworldly_codex',      name: 'Otherworldly Codex (model anchor)' },
  { id: 'ascension_codex',         name: 'Ascension Dossier (model anchor)' }
]

StartupEvents.registry('item', event => {
  BOOK_ICON_ITEMS.forEach(book => {
    event.create('aoa:' + book.id)
      .displayName(AOAModonomiconComponent.literal(book.name))
      .maxStackSize(1)
      .texture('aoa:item/' + book.id)
      .tooltip(AOAModonomiconComponent.literal('Internal model anchor for Modonomicon book texture. Not used in gameplay.'))
  })
})
