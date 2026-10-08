// AoA M1 - Medieval-legal wrench recipe
// Stock Create wrench uses c:plates/gold. Gold and the Mechanical Press both
// unlock at Medieval per aoa_astages_06 and aoa_astages_01 respectively, but
// the vanilla recipe is brass-plated; zinc is Medieval as well
// (aoa_astages_06_ore_restrictions.js:781-798), so brass is Medieval-feasible
// but a long detour this early. Use andesite alloy so the first Create
// control tool follows the visible M1 shaft/cog path with materials any Medieval
// player has on hand.

ServerEvents.recipes(event => {
  event.remove({ id: "create:crafting/kinetics/wrench" });

  event.shaped(
    Item.of("create:wrench"),
    [
      "AA ",
      "AP ",
      "  S"
    ],
    {
      A: "create:andesite_alloy",
      P: "create:cogwheel",
      S: "#c:rods/wooden"
    }
  ).id("aoa:m1/wrench_from_andesite_alloy");
});
