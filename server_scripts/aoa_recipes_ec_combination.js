// AoA KubeJS: aoa_recipes_ec_combination.js
// Extended Crafting COMBINATION recipes (Crafting Core + Pedestal ring).
//
// Why this file exists (2026-07-11 finale hardlock fix):
//   * extendedcrafting:the_ultimate_ingot ships RECIPE-LESS by mod design; packs
//     are expected to author its route. This pack never did, so asc7's required
//     the_ultimate_block task (quest 4153010000010001) was a confirmed HARDLOCK
//     gating asc_archive_of_ages_complete, asc_capstone_complete and aoa_complete.
//     Evidence: AoA redo/30_workflow/night_run_2026-07-10/12_finale_verification.md
//   * The combination system is enabled in extendedcrafting-common.toml and is
//     already taught by required asc1 quest 5449010000010001 ("Crafting Core",
//     place_block) and the ascension_codex "Fusion Crafting" page, but had an
//     EMPTY recipe pool. This recipe makes every teaching surface true.
//
// Recipe JSON schema verified against ExtendedCrafting-1.21.1-7.0.8.jar,
// CombinationRecipe$Serializer codec (decompiled 2026-07-11):
//   type "extendedcrafting:combination"
//   input       -> single nonempty Ingredient (the item on the Crafting Core)
//   ingredients -> Ingredient list (the items on the surrounding Pedestals)
//   result      -> ItemStack ({ id, count })
//   power_cost  -> int, REQUIRED (total FE consumed over the craft)
//   power_rate  -> int, OPTIONAL (FE/t drain; defaults to the config powerRate=500)
//
// Balance intent (PROVISIONAL, easy to retune -- see RETUNE NOTE in
// AoA redo/30_workflow/night_run_2026-07-10/13_finale_fix.md):
//   One grand fusion converts the pack's single most expensive item (the
//   Ultimate Singularity: one of EVERY registered singularity, each 10,000
//   materials + 5,000,000 FE in the Quantum Compressor) plus an 8-item pedestal
//   ring into exactly one block's worth (9) of The Ultimate Ingots, so asc7
//   needs the fusion performed once. 5,000,000 FE matches the default
//   singularity power cost and the Crafting Core's default capacity.
//
// All ingredient IDs jar-verified (EC 7.0.8 lang/models, AvaritiaNeo 1.3.1
// models/recipes) and already part of the tasked asc1/asc2 economy:
//   extendedcrafting:ultimate_singularity  asc1 quest 5449010000020005
//   extendedcrafting:crystaltine_ingot     asc1 (crystaltine line), jar grid recipe
//   extendedcrafting:ender_star            asc1, Ender Crafter recipe in jar
//   extendedcrafting:flux_star             asc1, Flux Crafter recipe in jar
//   avaritia:neutronium_ingot              asc2, Neutron Collector chain in jar
// None are from the_ultimate family, so there is no circular dependency.
// All are AStages-locked at `ascension` or earlier (aoa_astages_01n_ascension.js),
// which the asc7 player already holds. No cross-age or economy bypass:
// the_ultimate_ingot previously had ZERO routes, so this adds an in-edge
// without replacing or undercutting any existing recipe.

ServerEvents.recipes(event => {

  // --- The Ultimate Ingot via Combination Crafting (finale unlock) ----------
  // Center: Ultimate Singularity on the Crafting Core.
  // Ring:   8 pedestals: 2x Crystaltine Ingot, 2x Neutron Ingot,
  //         2x Ender Star, 2x Flux Star.
  // Yield:  9 ingots = exactly one The Ultimate Block (jar 3x3 recipe).
  event.custom({
    type: 'extendedcrafting:combination',
    power_cost: 5000000,
    input: { item: 'extendedcrafting:ultimate_singularity' },
    ingredients: [
      { item: 'extendedcrafting:crystaltine_ingot' },
      { item: 'avaritia:neutronium_ingot' },
      { item: 'extendedcrafting:ender_star' },
      { item: 'extendedcrafting:flux_star' },
      { item: 'extendedcrafting:crystaltine_ingot' },
      { item: 'avaritia:neutronium_ingot' },
      { item: 'extendedcrafting:ender_star' },
      { item: 'extendedcrafting:flux_star' }
    ],
    result: { id: 'extendedcrafting:the_ultimate_ingot', count: 9 }
  }).id('aoa:ec_combination/the_ultimate_ingot')

  // No further combination recipes on purpose: every other ascension-tier
  // candidate output already has a native route, so any addition here would be
  // an alternate route around an existing crafter (ender/flux/table bypass).
  // If the system should grow later, add recipes for NEW outputs only.
})
