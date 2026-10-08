;(function () {
  if (typeof NativeEvents === 'undefined') return

  const EventPriority = Java.loadClass('net.neoforged.bus.api.EventPriority')
  const LivingIncomingDamageEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')
  const MobEffectApplicableEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable')
  const MobEffectApplicableResult = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Applicable$Result')
  const MobEffectAddedEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.MobEffectEvent$Added')
  const EquipmentSlot = Java.loadClass('net.minecraft.world.entity.EquipmentSlot')

  const CANONICAL_REINFORCED_HAZMAT = [
    [EquipmentSlot.HEAD, 'nuclearscience:reinforcedhazmathelmet'],
    [EquipmentSlot.CHEST, 'nuclearscience:reinforcedhazmatplate'],
    [EquipmentSlot.LEGS, 'nuclearscience:reinforcedhazmatlegs'],
    [EquipmentSlot.FEET, 'nuclearscience:reinforcedhazmatboots']
  ]

  const RADIATION_EFFECTS = [
    'effect.voltaic.radiation',
    'effect.nuclearscience.radiation',
    'effect.createnuclear.radiation',
    'effect.alexscaves.irradiated'
  ]

  function stackId(stack) {
    if (!stack || stack.isEmpty()) return ''
    return String(stack.getItem().builtInRegistryHolder().getRegisteredName())
  }

  function hasCanonicalHazmat(entity) {
    if (!entity || typeof entity.getItemBySlot !== 'function') return false
    return CANONICAL_REINFORCED_HAZMAT.every(function (entry) {
      return stackId(entity.getItemBySlot(entry[0])) === entry[1]
    })
  }

  function isRadiationDamage(source) {
    if (!source) return false
    const msgId = String(source.getMsgId ? source.getMsgId() : '')
    return msgId.indexOf('radiation') !== -1 || msgId.indexOf('irradiat') !== -1
  }

  function effectDescription(effectInstance) {
    if (!effectInstance) return ''
    try {
      return String(effectInstance.getDescriptionId())
    } catch (ignored) {}
    return ''
  }

  function isRadiationEffect(effectInstance) {
    const description = effectDescription(effectInstance)
    return RADIATION_EFFECTS.indexOf(description) !== -1
  }

  function clearRadiationEffect(entity, effectInstance) {
    if (!entity || !effectInstance || typeof entity.removeEffect !== 'function') return
    try {
      entity.removeEffect(effectInstance.getEffect())
    } catch (ignored) {}
  }

  NativeEvents.onEvent(EventPriority.HIGHEST, LivingIncomingDamageEvent, function (event) {
    if (!hasCanonicalHazmat(event.getEntity())) return
    if (!isRadiationDamage(event.getSource())) return
    if (typeof event.setAmount === 'function') event.setAmount(0)
    event.setCanceled(true)
  })

  NativeEvents.onEvent(EventPriority.HIGHEST, MobEffectApplicableEvent, function (event) {
    if (!hasCanonicalHazmat(event.getEntity())) return
    if (isRadiationEffect(event.getEffectInstance())) {
      event.setResult(MobEffectApplicableResult.DO_NOT_APPLY)
    }
  })

  NativeEvents.onEvent(EventPriority.HIGHEST, MobEffectAddedEvent, function (event) {
    const entity = event.getEntity()
    const effect = event.getEffectInstance()
    if (hasCanonicalHazmat(entity) && isRadiationEffect(effect)) clearRadiationEffect(entity, effect)
  })
})()
