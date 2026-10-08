// AoA: deterministic Medieval summon paths for bosses without reliable live routes.

;(function () {
  const BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  const ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')
  const MobSpawnType = Java.loadClass('net.minecraft.world.entity.MobSpawnType')
  const InteractionHand = Java.loadClass('net.minecraft.world.InteractionHand')
  const Direction = Java.loadClass('net.minecraft.core.Direction')

  function itemId(stack) {
    return stack.isEmpty() ? '' : String(BuiltInRegistries.ITEM.getKey(stack.getItem()))
  }

  function tryRitual(event, mainId, offId, entityId, consumeMain) {
    if (event.getLevel().isClientSide() ||
        event.getHand() !== InteractionHand.MAIN_HAND ||
        event.getFacing() !== Direction.UP) return

    const player = event.getPlayer()
    const main = event.getItem()
    const off = player.getOffhandItem()
    if (itemId(main) !== mainId || itemId(off) !== offId) return

    event.cancel()
    if (!player.stages.has('medieval_times')) return

    const base = event.getBlock().getUp()
    if (!base.getBlockState().isAir() || !base.getUp().getBlockState().isAir()) return

    const key = ResourceLocation.parse(entityId)
    if (!BuiltInRegistries.ENTITY_TYPE.containsKey(key)) {
      console.error('[AoA summon] Missing entity ' + entityId)
      return
    }

    const spawned = BuiltInRegistries.ENTITY_TYPE.get(key)
      .spawn(event.getLevel(), base.getPos(), MobSpawnType.MOB_SUMMONED)
    if (spawned === null) return

    if (!player.getAbilities().instabuild) {
      if (consumeMain) main.shrink(1)
      off.shrink(1)
    }
  }

  if (Platform.isLoaded('born_in_chaos_v1')) {
    BlockEvents.rightClicked('minecraft:soul_sand', event => {
      tryRitual(
        event,
        'born_in_chaos_v1:orbofthe_summoner',
        'born_in_chaos_v1:dark_metal_ingot',
        'born_in_chaos_v1:nightmare_stalker',
        false
      )
    })
  }

  if (Platform.isLoaded('monsterplus')) {
    BlockEvents.rightClicked('minecraft:chiseled_deepslate', event => {
      tryRitual(
        event,
        'monsterplus:dark_essence',
        'monsterplus:crystal_shard',
        'monsterplus:ancient_hero',
        true
      )
    })
  }
})()

if (Platform.isLoaded('monsterplus')) {
  LootJS.modifiers(event => {
    const modifier = event.addEntityModifier('monsterplus:ancient_hero')
    modifier.removeLoot('minecraft:diamond')
    modifier.removeLoot('minecraft:emerald')
    modifier.removeLoot('minecraft:netherite_scrap')
  })
}
