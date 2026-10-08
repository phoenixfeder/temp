// AoA KubeJS: aoa_book_recipes.js
//
// Shaped crafting recipes for per-age guide/reference books. Each book is granted
// automatically by aoa_book_grants.js when the player gains its age stage; these
// recipes are the recovery path if a player loses their book.
//
// Pattern matches vanilla book crafting (3 paper + leather), with leather replaced
// by one age-locked material. Outputs are modonomicon books (NBT book_id), so they
// do not conflict with minecraft:book. Each bottom-slot ingredient is unique, so
// these recipes do not override one another.

ServerEvents.recipes(function (event) {

  function bookItem(bookId) {
    return Item.of('modonomicon:modonomicon[modonomicon:book_id="' + bookId + '"]')
  }

  function vanillaBookRecipe(bookId, recipeId, materialKey, materialId) {
    var keys = { P: 'minecraft:paper' }
    keys[materialKey] = materialId
    event.shaped(
      bookItem(bookId),
      ['P', 'P', materialKey],
      keys
    ).id(recipeId)
  }

  // Dark Ages Manual — empty blueprint (Overgeared staple; avoids leather vs vanilla book polymorph fights).
  vanillaBookRecipe('aoa:dark_ages_manual', 'aoa:books/dark_ages_manual', 'B', 'overgeared:empty_blueprint')

  // Medieval Codex — iron ingot is loot-gated to medieval_times.
  vanillaBookRecipe('aoa:medieval_codex', 'aoa:books/medieval_codex', 'I', 'minecraft:iron_ingot')

  // Renaissance Compendium — silver ingot is gated to the_renaissance.
  vanillaBookRecipe('aoa:renaissance_compendium', 'aoa:books/renaissance_compendium', 'S', 'alltheores:silver_ingot')

  // Industrial Codex — tin ingot is gated to industrial_revolution.
  vanillaBookRecipe('aoa:industrial_codex', 'aoa:books/industrial_codex', 'T', 'alltheores:tin_ingot')

  // Gilded Ledger — oritech platinum ingot is gated to gilded_age.
  vanillaBookRecipe('aoa:gilded_ledger', 'aoa:books/gilded_ledger', 'G', 'oritech:platinum_ingot')

  // Atomic Dossier — uranium ingot is gated to atomic.
  vanillaBookRecipe('aoa:atomic_dossier', 'aoa:books/atomic_dossier', 'U', 'alltheores:uranium_ingot')

  // Otherworldly Codex — draconium ingot is gated to otherworldly.
  vanillaBookRecipe('aoa:otherworldly_codex', 'aoa:books/otherworldly_codex', 'D', 'draconicevolution:draconium_ingot')

  // Ascension Codex — awakened draconium ingot is gated to ascension.
  vanillaBookRecipe('aoa:ascension_codex', 'aoa:books/ascension_codex', 'A', 'draconicevolution:awakened_draconium_ingot')

})
