// ============================================================================
//  Crafting-only wooden tools: neutered stats
// ============================================================================
//
//  The vanilla wooden tools are re-added as crafting ingredients only (see
//  kubejs/server_scripts/aoa_crafting_only_wooden_tools.js). To stop them from
//  becoming a real tool source that bypasses the Overgeared path, we cripple
//  them here:
//    - setMaxDamage(1): a single use of durability, so they break almost
//      immediately if used to mine or fight.
//    - setSpeed(0.01f) on the tool tier: mining speed near zero, so they cannot
//      practically break blocks even for that one use.
//
//  API verified against kubejs-neoforge-2101.7.2-build.368
//  (dev/latvian/mods/kubejs/item/ItemModificationKubeEvent$ItemModifications
//   and dev/latvian/mods/kubejs/item/MutableToolTier):
//    - ItemEvents.modification(event) { event.modify(id, m => { ... }) }
//    - m.setMaxDamage(int)
//    - m.setTier(tier => tier.setSpeed(float))   (MutableToolTier.setSpeed)
//  setTier throws if the item is not a tiered/tool item; all five vanilla
//  wooden tools are TieredItem, so this is safe.
// ============================================================================

const CRAFTING_ONLY_WOODEN_TOOLS = [
  'minecraft:wooden_pickaxe',
  'minecraft:wooden_axe',
  'minecraft:wooden_shovel',
  'minecraft:wooden_hoe',
  'minecraft:wooden_sword'
]

ItemEvents.modification(event => {
  CRAFTING_ONLY_WOODEN_TOOLS.forEach(id => {
    event.modify(id, m => {
      m.setMaxDamage(1)
      m.setTier(tier => {
        tier.setSpeed(0.01)
      })
    })
  })
})
