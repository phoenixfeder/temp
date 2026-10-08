// AoA KubeJS: aoa_astages_01o_dimensions_space.js
// Machine Staging Contract pass (2026-05-28) -- dimensions/bosses final sweep.
//
// The dimension/boss mods are content/gear/decor (gated by files 01/03/08 + ores 06);
// this sweep found only TWO functional-machine leaks worth gating:
//   Ad Astra space-infrastructure machines -> Otherworldly. BYPASS: craftable from
//     common c:ingots/steel in IR/Gilded, but Ad Astra dims/rocket/ores are all
//     already Otherworldly, so the whole space-machine + cable/pipe/tank/bank network
//     belongs at Otherworldly (kept coherent as one space-tier family).
//   astral_dimension supreme_altar + astranite_cauldron -> Gilded (gap-fill; the rest
//     of astral_dimension is already gilded-locked; ceiling = gilded, no softlock).
// All other swept mods (aether/undergarden/deeperdarker/nether mods/eternal_starlight/
// cataclysm/BOMD/fdbosses/macabre/unusualend/reliquified_artifacts/
// blastcraft) = INFO, no functional machine apparatus to gate. enderscape not installed.

;(function () {
  if (typeof AStages === 'undefined') return
  function applySoftItemPolicy(r) {
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return r.allowInventoryStorage().allowContainerStorage().allowPickup().disableBlockInteraction()
  }
  function softItemLock(stage, item, kind) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages dim] Skipped missing item ' + item + ' (stage=' + stage + ')'); return
    }
    var id = 'aoa/item/' + kind + '/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try { applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item)) }
    catch (e) { console.warn('[AoA AStages dim] Skipped ' + item + ': ' + e) }
  }
  var itemLocks = [
    // Ad Astra replaced Stellaris as the space mod (2026-08-30). Same policy:
    // the whole space-machine and cable/pipe network is one Otherworldly family.
    ["otherworldly", "ad_astra:coal_generator", "block_item"],
    ["otherworldly", "ad_astra:solar_panel", "block_item"],
    ["otherworldly", "ad_astra:fuel_refinery", "block_item"],
    ["otherworldly", "ad_astra:oxygen_distributor", "block_item"],
    ["otherworldly", "ad_astra:oxygen_loader", "block_item"],
    ["otherworldly", "ad_astra:water_pump", "block_item"],
    ["otherworldly", "ad_astra:compressor", "block_item"],
    ["otherworldly", "ad_astra:energizer", "block_item"],
    ["otherworldly", "ad_astra:cryo_freezer", "block_item"],
    ["otherworldly", "ad_astra:etrionic_blast_furnace", "block_item"],
    ["otherworldly", "ad_astra:gravity_normalizer", "block_item"],
    ["otherworldly", "ad_astra:nasa_workbench", "block_item"],
    ["otherworldly", "ad_astra:launch_pad", "block_item"],
    ["otherworldly", "ad_astra:airlock", "block_item"],
    ["otherworldly", "ad_astra:steel_cable", "block_item"],
    ["otherworldly", "ad_astra:desh_cable", "block_item"],
    ["otherworldly", "ad_astra:cable_duct", "block_item"],
    ["otherworldly", "ad_astra:desh_fluid_pipe", "block_item"],
    ["otherworldly", "ad_astra:ostrum_fluid_pipe", "block_item"],
    ["otherworldly", "ad_astra:fluid_pipe_duct", "block_item"],
    ["otherworldly", "ad_astra:gas_tank", "item"],
    ["otherworldly", "ad_astra:large_gas_tank", "item"],
    ["otherworldly", "ad_astra:desh_tank", "item"],
    ["otherworldly", "ad_astra:ostrum_tank", "item"],
    ["gilded_age", "astral_dimension:supreme_altar", "block_item"],
    ["gilded_age", "astral_dimension:astranite_cauldron", "block_item"],
  ]
  itemLocks.forEach(function (e) { softItemLock(e[0], e[1], e[2]) })
})()
