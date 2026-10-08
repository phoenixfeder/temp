// AoA KubeJS: aoa_relics_peaceful_entity_bridge.js
//
// Relics classifies MobCategory.MISC living entities as hostile for harmful
// abilities when no explicit category matches. Vanilla villagers and MineColonies
// civilians use MISC, so Starfall shockwaves and similar relic AoE can kill them
// even with only "hostile mobs" enabled.
//
// Upstream fix belongs in Relics TargetingUtils.resolveOption(). Until then,
// cancel only Relics-attributed damage to protected civilian entities.

;(function () {
  if (typeof NativeEvents === 'undefined') return

  const EventPriority = Java.loadClass('net.neoforged.bus.api.EventPriority')
  const LivingIncomingDamageEvent = Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')

  const RELICS_ENTITY_PACKAGE = 'it.hurts.sskirillss.relics.entities'
  const RELICS_ENTITY_ID_PREFIX = 'relics:'

  const PROTECTED_ENTITY_IDS = {
    'minecraft:villager': true,
    'minecraft:snow_golem': true,
    'minecolonies:citizen': true,
    'minecolonies:visitor': true
  }

  function entityRegistryId(entity) {
    if (!entity) return ''
    try {
      return String(entity.getType().builtInRegistryHolder().getRegisteredName())
    } catch (ignored) {}
    return ''
  }

  function entityClassName(entity) {
    if (!entity) return ''
    try {
      return String(entity.getClass().getName())
    } catch (ignored) {}
    return ''
  }

  function isProtectedEntity(entity) {
    const id = entityRegistryId(entity)
    return !!(id && PROTECTED_ENTITY_IDS[id])
  }

  function isRelicsEntity(entity) {
    if (!entity) return false

    const id = entityRegistryId(entity)
    if (id && id.indexOf(RELICS_ENTITY_ID_PREFIX) === 0) return true

    const className = entityClassName(entity)
    return className.indexOf(RELICS_ENTITY_PACKAGE) === 0
  }

  function sourceEntity(source, getterName) {
    if (!source || typeof source[getterName] !== 'function') return null
    try {
      return source[getterName]()
    } catch (ignored) {}
    return null
  }

  function traceRelicsEntity(entity, seen, depth) {
    if (!entity || depth > 4) return false
    if (seen.has(entity)) return false
    seen.add(entity)

    if (isRelicsEntity(entity)) return true

    if (typeof entity.getOwner === 'function') {
      try {
        if (traceRelicsEntity(entity.getOwner(), seen, depth + 1)) return true
      } catch (ignored) {}
    }

    if (typeof entity.getVehicle === 'function') {
      try {
        if (traceRelicsEntity(entity.getVehicle(), seen, depth + 1)) return true
      } catch (ignored) {}
    }

    return false
  }

  function isRelicsAttributedDamage(source) {
    if (!source) return false

    const seen = new Set()
    const candidates = [
      sourceEntity(source, 'getDirectEntity'),
      sourceEntity(source, 'getEntity'),
      sourceEntity(source, 'getImmediate')
    ]

    for (let i = 0; i < candidates.length; i++) {
      if (traceRelicsEntity(candidates[i], seen, 0)) return true
    }

    return false
  }

  NativeEvents.onEvent(EventPriority.HIGHEST, LivingIncomingDamageEvent, function (event) {
    const target = event.getEntity()
    if (!isProtectedEntity(target)) return
    if (!isRelicsAttributedDamage(event.getSource())) return

    if (typeof event.setAmount === 'function') event.setAmount(0)
    event.setCanceled(true)
  })
})()
