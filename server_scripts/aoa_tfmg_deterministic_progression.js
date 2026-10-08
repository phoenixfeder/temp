// AoA: deterministic first-magnet bootstrap.
// Fixed TFMG sequenced-assembly replacements live under kubejs/data/tfmg/recipe.

;(function () {
  if (typeof Platform === 'undefined' || !Platform.isLoaded('tfmg') || typeof NativeEvents === 'undefined') return

  const EventPriority = Java.loadClass('net.neoforged.bus.api.EventPriority')
  const LightningEvent = Java.loadClass('net.neoforged.neoforge.event.entity.EntityStruckByLightningEvent')
  const ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
  const ItemStack = Java.loadClass('net.minecraft.world.item.ItemStack')
  const TFMGItems = Java.loadClass('com.drmangotea.tfmg.registry.TFMGItems')
  const TFMGBlocks = Java.loadClass('com.drmangotea.tfmg.registry.TFMGBlocks')

  NativeEvents.onEvent(EventPriority.HIGHEST, LightningEvent, event => {
    const entity = event.getEntity()
    if (!(entity instanceof ItemEntity)) return

    const source = entity.getItem()
    if (!source.is(TFMGItems.MAGNETIC_ALLOY_INGOT.get())) return

    if (!entity.level().isClientSide() &&
        entity.level().getBlockState(entity.blockPosition().below()).is(TFMGBlocks.COKE_OVEN.get())) {
      entity.setItem(new ItemStack(TFMGItems.MAGNET.get(), source.getCount()))
    }

    // Suppress TFMG's random conversion everywhere, including away from the Coke Oven.
    event.setCanceled(true)
  })
})()
