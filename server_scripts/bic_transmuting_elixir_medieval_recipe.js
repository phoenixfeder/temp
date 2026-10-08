// AoA Medieval — Transmuting Elixir recipe rewrite
//
// The stock Born in Chaos recipe (born_in_chaos_v1:transmuting_elixirkraft)
// is a shapeless 9-ingredient bag that demands:
//   - minecraft:diamond       (Renaissance-stage-locked per aoa_astages_01)
//   - minecraft:chorus_fruit  (End dimension only)
//   - minecraft:sculk_catalyst (Deep Dark, mechanically Renaissance+)
//   - minecraft:blaze_powder  (Nether, generally not accessible Medieval)
//   - minecraft:torchflower   (Sniffer breeding / Trail Ruins)
//   - minecraft:turtle_scute
//   - born_in_chaos_v1:chaos_component
//   - born_in_chaos_v1:holiday_candy
//   - born_in_chaos_v1:intoxicating_decoction
//
// Transmuting Elixir is required on the path to the elokosa_paw_gibbous
// validator (quest 6D7E8F901A2B102C) which feeds the "Mowzie's Trial"
// gate that ROUTES INTO Renaissance. So the gate is paradoxically locked
// behind Renaissance-tier loot. This swap keeps the "chaos transmutation"
// theme but uses materials already produced on this chapter's quest path.

ServerEvents.recipes(event => {
  event.remove({ id: "born_in_chaos_v1:transmuting_elixirkraft" });

  event.shapeless(
    Item.of("born_in_chaos_v1:transmuting_elixir"),
    [
      // chaos backbone (kept from stock)
      "born_in_chaos_v1:chaos_component",
      "born_in_chaos_v1:holiday_candy",
      "born_in_chaos_v1:intoxicating_decoction",
      // ghost-dust replaces sculk_catalyst (player crafts in quest 1025)
      "born_in_chaos_v1:spiritual_dust",
      // dark metal replaces diamond (already on this chapter's path, quest 101F)
      "born_in_chaos_v1:dark_metal_ingot",
      // bestial fire replaces blaze_powder (quest 1022 line)
      "born_in_chaos_v1:nightmare_claw",
      // hide replaces turtle_scute (quest 1022 line)
      "born_in_chaos_v1:monster_skin",
      // grove relic replaces chorus_fruit (quest 1016, Mowzie's)
      "mowziesmobs:foliaath_seed",
      // grove relic replaces torchflower (quest 1014, Mowzie's)
      "mowziesmobs:naga_fang"
    ]
  ).id("aoa:medieval/transmuting_elixir_from_chapter_path");
});
