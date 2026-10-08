// AoA KubeJS: aoa_goety_nightshade_route.js
// Owner-approved remediation 2026-08-05 (goety_nightshade_hostile_verify
// _2026-08-05.md, claim 1 CONFIRMED): goety:nightshade_blossom is a mandatory
// Undeath Potion ingredient, but goety-3.1.0 ships NO acquisition route for it
// or its seeds - the mod's own guidebook mechanic (boline on grass/ferns) is
// absent from the compiled code (SickleItem has no seed-drop logic; no loot
// modifier, mixin, worldgen feature, trade, or cross-mod route in a 577-jar
// sweep; the crop's seeds only drop from the crop). Without a route the whole
// OW tail (Undeath Potion -> become_lich -> dark_anvil) is dead.
// Fix per the audit: deterministic seed injection into Goety's own structure
// chests (LootJS deterministic-progression rule, kubejs/AGENTS.md section 6).
// Crypt and graveyard are the mod's core necromancy structures - a guaranteed
// seed stack per chest makes the route deterministic and thematic; the crop
// then self-sustains (crop drops its own seeds, per its jar loot table).
// Ids verified against goety-3.1.0.jar: nightshade_seeds (models/item),
// chests/crypt_loot + chests/graveyard_loot (data/goety/loot_table/chests/).
LootJS.modifiers(event => {
  ;['goety:chests/crypt_loot', 'goety:chests/graveyard_loot'].forEach(table => {
    event.addTableModifier(table)
      .addLoot(LootEntry.of(Item.of('goety:nightshade_seeds', 2)))
  })
})
