// AoA KubeJS: aoa_astral_boss_buffs.js
// Difficulty correction for the Astral dimension boss ladder.
//
// 2026-07-19 owner ruling ("buff the trivial ones to fair, do not remove them"):
// astral_dimension:void_titan ships from astral_dimension-neoforge-1.21.1-2.3 with
// 250 max health, 3 attack damage and 1.2 armor. That is a sponge next to the
// gilded_age gear the Astral chapter hands out before the fight, and the titan is a
// required dependency of the atomic capstone. Raise it to 600 max health so the
// fight reads as a boss instead of a chore.
//
// 2026-07-25 correction: the ATTACK_DAMAGE attribute is not touched. Jar truth is
// that the Titan's melee hit comes from its projectile, which hardcodes
// setBaseDamage(12.0) independent of the entity's attack attribute. Scaling that
// attribute did nothing and only misled future readers of this file. This buff
// is HP-only by design.
//
// Only void_titan is touched here. Every other Astral entity keeps its shipped stats.
//
// The buff is applied once per entity and recorded in that entity's persistent data.
// EntityEvents.spawned also fires when a chunk reloads an entity that already exists,
// and LivingEntity saves attribute base values with the entity, so a second pass is
// harmless but pointless: it would just reset max health to the same value.

;(function () {
  const TARGET_ENTITY = 'astral_dimension:void_titan'
  const BUFF_FLAG = 'aoaAstralTitanBuffed'
  const TARGET_MAX_HEALTH = 600.0

  let Attributes = null
  try {
    Attributes = Java.loadClass('net.minecraft.world.entity.ai.attributes.Attributes')
  } catch (e) {
    console.warn('[AoA Astral] Attributes class unavailable, void_titan buff is inactive: ' + e)
    return
  }
  if (!Attributes) return

  function eventEntity(event) {
    try {
      if (event.entity) return event.entity
    } catch (ignored) {}
    try {
      if (event.getEntity) return event.getEntity()
    } catch (ignored) {}
    return null
  }

  function attributeInstance(entity, attribute) {
    try {
      if (!attribute || !entity.getAttribute) return null
      return entity.getAttribute(attribute)
    } catch (e) {
      return null
    }
  }

  EntityEvents.spawned(TARGET_ENTITY, event => {
    const entity = eventEntity(event)
    if (!entity) return

    // Server side only. Attribute writes on a client copy would desync and never save.
    // This check must stay outside the try/catch below: if it throws, we must not
    // fall through to applying the buff on what might be a client-side entity.
    let level = null
    try {
      level = event.level
    } catch (ignored) {}
    if (level && level.isClientSide()) return

    let data = null
    try {
      data = entity.persistentData
    } catch (e) {
      return
    }
    if (!data || !data.getBoolean || !data.putBoolean) return
    if (data.getBoolean(BUFF_FLAG)) return

    const health = attributeInstance(entity, Attributes.MAX_HEALTH)
    if (!health) return

    try {
      health.setBaseValue(TARGET_MAX_HEALTH)
      if (entity.setHealth) entity.setHealth(TARGET_MAX_HEALTH)
      data.putBoolean(BUFF_FLAG, true)
    } catch (e) {
      console.warn('[AoA Astral] void_titan buff failed to apply: ' + e)
    }
  })
})()
