// AoA KubeJS: aoa_recipes_neovitae_parts.js
// Owner-approved remediation 2026-07-31 (neovitae_questline_audit_2026-07-31.md P1.1):
// neovitae:hellforged_parts has NO recipe in neovitae-1.21.1-1.1.2 - its only sources
// are foreman treasure (15%) and mine chest tables, while the required quest
// 0B03102000000046 asks for it and its own prose says "craft from the ingot".
// The Athanor reversion route is circular (needs a Reinforced Rune, which needs parts).
// This pack recipe makes the prose true and the ask deterministic. Chest loot remains
// a bonus source. Upstream precedent: FTB-Modpack-Issues #2259 requests exactly this.
// 2026-07-31 fix: the ingot's registered id is neovitae:ingot_hellforged (jar lang +
// NVItems bytecode); the earlier neovitae:hellforged_ingot string never resolved and
// the recipe failed to register (logs/kubejs/server.log 18:20:43 error).
ServerEvents.recipes(event => {
  event.shaped('2x neovitae:hellforged_parts', [
    'II',
    'II'
  ], {
    I: 'neovitae:ingot_hellforged'
  }).id('aoa:crafting/hellforged_parts_from_ingots')
})
