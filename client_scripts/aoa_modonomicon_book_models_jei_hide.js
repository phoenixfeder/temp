// AoA KubeJS: aoa_modonomicon_book_models_jei_hide.js
//
// Hides the three Modonomicon book model-anchor items from JEI / REI / EMI.
// These items only exist so Minecraft bakes their inventory models for
// Modonomicon's BookOverrideModel to use as per-book textures. They are
// never used in gameplay; the modonomicon:modonomicon item with per-book
// NBT is what reaches player inventories.
//
// See aoa_modonomicon_book_models.js (startup) for the registration and
// the architectural reason for the indirection.
//
// API verified against kubejs-neoforge-2101.7.2:
//   - Event holder: RecipeViewerEvents
//   - Method: removeEntries(entryType, callback)
//   - Per-item removal: event.remove(itemIdOrPredicate)
//   - Generic across JEI/REI/EMI — one script covers all viewers.

RecipeViewerEvents.removeEntries('item', event => {
  event.remove('aoa:dark_ages_manual')
  event.remove('aoa:medieval_codex')
  event.remove('aoa:renaissance_compendium')
  event.remove('aoa:gilded_ledger')
  event.remove('aoa:atomic_dossier')
  event.remove('aoa:industrial_codex')
  event.remove('aoa:otherworldly_codex')
  event.remove('aoa:ascension_codex')
})
