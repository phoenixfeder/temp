// AoA KubeJS: boss_progression_proof.js
// Batch 5 - P1 Boss Proof and Combat Cheese Hardening.
//
// Boss proof authority is quest-proof first where a wrapper exists.
// Stage grants live in FTB Quests AStages command rewards, not here.
// Non-player deaths lose capstone proof drops and capture output.

const AOA_BOSS_PROOF = {
  // ============================================================================
  // REQUIRED SPINE BOSSES (Route 2: guaranteed proof drop on real-player kill)
  // ============================================================================

  // Otherworldly occult-lane proof (boss locked otherworldly in aoa_astages_08_mob_boss_restrictions.js).
  'cataclysm:maledictus': {
    proof: 'cataclysm:cursium_ingot',
    guaranteeProofDrop: true,
    strip: [
      'cataclysm:cursium_ingot',
      'cataclysm:music_disc_maledictus',
      'cataclysm:maledictus_spawn_egg'
    ]
  },

  // Industrial Revolution capstone proof.
  'bosses_of_mass_destruction:obsidilith': {
    proof: 'bosses_of_mass_destruction:obsidian_heart',
    guaranteeProofDrop: true,
    strip: [
      'bosses_of_mass_destruction:obsidian_heart',
      'bosses_of_mass_destruction:obsidilith_spawn_egg'
    ]
  },

  // Industrial Revolution co-required Qliphoth exam (boss-ladder BL1, 2026-07-02).
  // Core is a guaranteed single-roll drop; guarantee it on real-player kills and
  // strip the proof/trophy on non-player kills so the IR capstone fan-in is not bypassable.
  // 2026-07-25: deferredDrop marks a boss that drops its loot from tickDeath instead of
  // die(). Those bosses are EXEMPT from the removeLoot/re-add guarantee below. The
  // guarantee re-adds the proof under killedByPlayer(), which reads LAST_DAMAGE_PLAYER,
  // and dropFromLootTable only sets that when lastHurtByPlayerTime > 0. Malkuth's death
  // animation is 249 ticks and the counter is cleared at 100, so the re-added entry never
  // rolls while the native entry has already been removed. Their native entity tables
  // already give every proof item its own unconditional rolls:1.0 pool, so the entity
  // drops strip above is the only gate they need.
  'fdbosses:chesed': {
    proof: 'fdbosses:lightning_core',
    guaranteeProofDrop: true,
    deferredDrop: true,
    strip: [
      'fdbosses:lightning_core',
      'fdbosses:phase_sphere',
      'fdbosses:chesed_trophy',
      'fdbosses:chesed_spawn_egg'
    ]
  },

  // Gilded Age co-required Qliphoth exam (boss-ladder BL1, 2026-07-02).
  // deferredDrop: see the 2026-07-25 note on fdbosses:chesed above.
  'fdbosses:malkuth': {
    proof: 'fdbosses:fire_and_ice_core',
    guaranteeProofDrop: true,
    deferredDrop: true,
    strip: [
      'fdbosses:fire_and_ice_core',
      'fdbosses:malkuth_fist',
      'fdbosses:malkuth_trophy',
      'fdbosses:malkuth_spawn_egg'
    ]
  },

  // Atomic judgment and consequence exam.
  'fdbosses:geburah': {
    proof: 'fdbosses:justice_core',
    guaranteeProofDrop: true,
    strip: [
      'fdbosses:justice_core',
      'fdbosses:divine_gear',
      'fdbosses:geburah_trophy',
      'fdbosses:polished_justicestone',
      'fdbosses:geburah_spawn_egg'
    ]
  },

  // Gilded -> Atomic Astral proof component.
  'astral_dimension:void_titan': {
    proof: 'astral_dimension:void_boots_helmet',
    guaranteeProofDrop: true,
    strip: [
      'astral_dimension:void_boots_helmet',
      'astral_dimension:titan_helmet_upgrade_template',
      'astral_dimension:astral_amulet',
      'astral_dimension:void_titan_present',
      'astral_dimension:void_titan_spawn_egg'
    ]
  },

  // Atomic horror-biotech containment spine.
  'macabre:valamon': {
    proof: 'macabre:valamon_heart',
    guaranteeProofDrop: true,
    strip: [
      'macabre:valamon_heart',
      'macabre:valamon_pack',
      'macabre:valamon_spawn_egg'
    ]
  },
  'macabre:gomoria': {
    proof: 'macabre:gomoria_heart',
    guaranteeProofDrop: true,
    strip: [
      'macabre:gomoria_heart',
      'macabre:gomoria_pack',
      'macabre:gomoria_spawn_egg'
    ]
  },
  'macabre:gargamaw': {
    proof: 'macabre:gargamaw_heart',
    guaranteeProofDrop: true,
    strip: [
      'macabre:gargamaw_heart',
      'macabre:gargamaw_pack',
      'macabre:gargamaw_spawn_egg'
    ]
  },
  'macabre:baal': {
    proof: 'macabre:baal_heart',
    guaranteeProofDrop: true,
    strip: [
      'macabre:baal_heart',
      'macabre:baal_pack',
      'macabre:baal_spawn_egg'
    ]
  },
  // Macabre 0.9.2: Morphegor is the required 5th Atomic prophet, same heart-proof pattern.
  // Its heart is required for the perturbation, so keep the proof reliable on real-player kills
  // and stripped on non-player kills. Dead God and Meshuggeneh are kill-only MQT-task proofs
  // (no inventory proof item); they are hardened against capture via the apothic_spawners
  // blacklist rather than a LootJS entry here, per this file's kill-only convention.
  'macabre:morphegor': {
    proof: 'macabre:morphegor_heart',
    guaranteeProofDrop: true,
    strip: [
      'macabre:morphegor_heart',
      'macabre:morphegor_pack',
      'macabre:morphegor_spawn_egg'
    ]
  },

  // ============================================================================
  // QUESTED OPTIONAL SIDE BOSSES (Route 5: strip non-player/capture outputs)
  // ============================================================================
  // Future optional candidates belong here only after canon assigns an FTBQ
  // optional task: Cataclysm Harbinger/Ignis/Ender Guardian/Netherite
  // Monstrosity/Ancient Remnant/Revenant/Clawdian/Ender Golem, BFB roster,
  // BOMD Lich/Void Blossom/Gauntlet, and fdbosses Malkuth/Chesed.
  // PROMOTED to REQUIRED Ascension apex (boss-ladder BL4, 2026-07-02): asc6 scylla
  // node uses an item task on essence_of_the_storm, which is a guaranteed single-roll
  // entity drop. Guarantee it on real-player kills so the Ascension fan-in is not
  // RNG-blocked, and strip it on non-player kills so the gate is not bypassable.
  'cataclysm:scylla': {
    proof: 'cataclysm:essence_of_the_storm',
    guaranteeProofDrop: true,
    strip: [
      'cataclysm:essence_of_the_storm',
      'cataclysm:astrape',
      'cataclysm:lacrima',
      'cataclysm:storm_eye',
      'cataclysm:ceraunus',
      'cataclysm:music_disc_scylla',
      'cataclysm:scylla_spawn_egg'
    ]
  },

  // ============================================================================
  // REQUIRED - ATOMIC ALEX'S CAVES APEX BOSSES (boss-ladder BL4, 2026-07-02)
  // ============================================================================
  // Tremorzilla (promoted required) is kill-only in at7 (its item task is the
  // obtainable tremorzilla_egg summon item), so it needs no LootJS guarantee. The
  // two co-required AC apex bosses below feed the Atomic capstone fan-in via at7
  // quest dependencies (geburah -> luxtructosaurus -> watcher -> tremorzilla ->
  // atomic grant 4358010000010003). Both carry a single item-proof task, so
  // guarantee the proof on real-player kills and strip it on non-player kills.
  // Watcher's occult_gem is a 0-1 roll (not natively guaranteed) so the LootJS
  // addLoot(killedByPlayer) makes it reliable; Luxtructosaurus's tectonic_shard is
  // a bulk 7-11 drop, guaranteed either way but normalized here for consistency.
  'alexscaves:watcher': {
    proof: 'alexscaves:occult_gem',
    guaranteeProofDrop: true,
    strip: [
      'alexscaves:occult_gem',
      'alexscaves:dark_tatters',
      'alexscaves:spawn_egg_watcher'
    ]
  },
  'alexscaves:luxtructosaurus': {
    proof: 'alexscaves:tectonic_shard',
    guaranteeProofDrop: true,
    strip: [
      'alexscaves:tectonic_shard',
      'alexscaves:spawn_egg_luxtructosaurus'
    ]
  },

  // ============================================================================
  // DEMOTED - RENAISSANCE REALM LITERACY OPTIONAL DEPTH (Route 5)
  // ============================================================================
  // Eternal Starlight remains side-depth proof-only content unless later promoted.
  'eternal_starlight:the_gatekeeper': {
    proof: 'eternal_starlight:orb_of_prophecy',
    guaranteeProofDrop: false,
    strip: [
      'eternal_starlight:orb_of_prophecy',
      'eternal_starlight:book',
      'eternal_starlight:music_disc_optimized_option',
      'eternal_starlight:the_gatekeeper_spawn_egg'
    ]
  },
  'eternal_starlight:starlight_golem': {
    proof: 'eternal_starlight:oxidized_alloy_furnace',
    guaranteeProofDrop: false,
    strip: [
      'eternal_starlight:oxidized_alloy_furnace',
      'eternal_starlight:oxidized_golem_steel_ingot',
      'eternal_starlight:forge_armor_trim_smithing_template',
      'eternal_starlight:energy_sword',
      'eternal_starlight:music_disc_mechanical_fossil',
      'eternal_starlight:starlight_golem_spawn_egg'
    ]
  },
  'eternal_starlight:permafrost': {
    proof: 'eternal_starlight:coldsnap',
    guaranteeProofDrop: false,
    strip: [
      'eternal_starlight:coldsnap',
      'eternal_starlight:frozen_tube',
      'eternal_starlight:oxidized_golem_steel_nugget',
      'eternal_starlight:permafrost_spawn_egg'
    ]
  },
  'eternal_starlight:lunar_monstrosity': {
    proof: 'eternal_starlight:soul_dew',
    guaranteeProofDrop: false,
    strip: [
      'eternal_starlight:soul_dew',
      'eternal_starlight:moonring_bow',
      'eternal_starlight:tenacious_petal',
      'eternal_starlight:tenacious_vine',
      'eternal_starlight:lunar_monstrosity_spawn_egg'
    ]
  },

  // ============================================================================
  // REQUIRED - Otherworldly -> Ascension boss proof, owned by OW6 planning.
  // ============================================================================
  // The staged FTBQ plan checks both the kill and tidal_claws. Guarantee the
  // proof on real-player kills so the required OW gate is not RNG-blocked.
  'cataclysm:the_leviathan': {
    proof: 'cataclysm:tidal_claws',
    guaranteeProofDrop: true,
    strip: [
      'cataclysm:tidal_claws',
      'cataclysm:abyssal_egg',
      'cataclysm:music_disc_the_leviathan',
      'cataclysm:the_leviathan_spawn_egg'
    ]
  },

  // ============================================================================
  // REQUIRED - RENAISSANCE DIMENSION/EXPLORATION BOSSES (boss-ladder BL2, 2026-07-02)
  // ============================================================================
  // Nine Renaissance required bosses feed their own dimension chapter's proof-grant
  // quest (which already fans into the Renaissance age grant 0B0310A0000000F0).
  // Each item-proof drop is a guaranteed single-roll entity drop, so guarantee it on
  // real-player kills and strip proof/utility drops on non-player kills to keep the
  // chapter fan-in un-bypassable. Kill-only bosses (starlight_golem, gatekeeper) use an
  // MQT kill task as their proof; no LootJS guarantee is needed there.

  // Nether threshold: Ignis (ignitium_ingot).
  'cataclysm:ignis': {
    proof: 'cataclysm:ignitium_ingot',
    guaranteeProofDrop: true,
    strip: [
      'cataclysm:ignitium_ingot',
      'cataclysm:music_disc_ignis',
      'cataclysm:ignis_spawn_egg'
    ]
  },
  // Nether threshold: The Harbinger (witherite_block).
  'cataclysm:the_harbinger': {
    proof: 'cataclysm:witherite_block',
    guaranteeProofDrop: true,
    strip: [
      'cataclysm:witherite_block',
      'cataclysm:music_disc_the_harbinger',
      'cataclysm:the_harbinger_spawn_egg'
    ]
  },
  // Nether threshold: Nether Gauntlet. Native blazing_eye drops from a death-spawned
  // chest table, not the entity table, so move it onto the real-player kill path (see
  // the addTableModifier below) exactly like Obsidilith's heart.
  'bosses_of_mass_destruction:gauntlet': {
    proof: 'bosses_of_mass_destruction:blazing_eye',
    guaranteeProofDrop: true,
    strip: [
      'bosses_of_mass_destruction:blazing_eye',
      'bosses_of_mass_destruction:gauntlet_spawn_egg'
    ]
  },
  // Aether literacy: Valkyrie Queen (silver_dungeon_key).
  'aether:valkyrie_queen': {
    proof: 'aether:silver_dungeon_key',
    guaranteeProofDrop: true,
    strip: [
      'aether:silver_dungeon_key',
      'aether:valkyrie_queen_spawn_egg'
    ]
  },
  // Undergarden descent: Forgotten Guardian (forgotten_nugget).
  'undergarden:forgotten_guardian': {
    proof: 'undergarden:forgotten_nugget',
    guaranteeProofDrop: true,
    strip: [
      'undergarden:forgotten_nugget',
      'undergarden:forgotten_guardian_spawn_egg'
    ]
  },

  // ============================================================================
  // REQUIRED - OTHERWORLDLY DIMENSION/APEX BOSSES (boss-ladder BL3, 2026-07-02)
  // ============================================================================
  // Nine Otherworldly required bosses feed their own OW chapter's grant node,
  // which already fans into the OW capstone / ascension grant 4256010000010006.
  // Six carry a guaranteed single-roll item drop, guaranteed on real-player kills
  // and stripped on non-player kills so the OW fan-in cannot be bypassed. The two
  // Eternal Starlight bosses (permafrost, lunar_monstrosity) have empty loot tables
  // and stay MQT kill-task proofs (their Route 5 entries already exist above); the
  // Leviathan (OW capstone) is guaranteed above. No LootJS is needed for kill-only.

  // ow3 dragon technology: Ender Guardian (gauntlet_of_guard). End apex, dragon-adjacent.
  'cataclysm:ender_guardian': {
    proof: 'cataclysm:gauntlet_of_guard',
    guaranteeProofDrop: true,
    strip: [
      'cataclysm:gauntlet_of_guard',
      'cataclysm:music_disc_ender_guardian',
      'cataclysm:ender_guardian_spawn_egg'
    ]
  },
  // ow3 dragon technology: Underworld Knight (knight_sword). High arena boss.
  'block_factorys_bosses:underworld_knight': {
    proof: 'block_factorys_bosses:knight_sword',
    guaranteeProofDrop: true,
    strip: [
      'block_factorys_bosses:knight_sword',
      'block_factorys_bosses:underworld_knight_spawn_egg'
    ]
  },
  // g1 the golden workshop: Sun Spirit (gold_dungeon_key). Aether Gold apex.
  'aether:sun_spirit': {
    proof: 'aether:gold_dungeon_key',
    guaranteeProofDrop: true,
    strip: [
      'aether:gold_dungeon_key',
      'aether:sun_altar',
      'aether:sun_spirit_spawn_egg'
    ]
  },
  // g1 the golden workshop: Eye of the Storm (brass_dungeon_key). Deep Aether apex.
  'deep_aether:eots_controller': {
    proof: 'deep_aether:brass_dungeon_key',
    guaranteeProofDrop: true,
    strip: [
      'deep_aether:brass_dungeon_key',
      'deep_aether:eots_controller_spawn_egg'
    ]
  },
  // ow6 beyond the veil: Sirok the Sandworm (sandworm_gauntlet). Desert arena apex.
  'block_factorys_bosses:sandworm': {
    proof: 'block_factorys_bosses:sandworm_gauntlet',
    guaranteeProofDrop: true,
    strip: [
      'block_factorys_bosses:sandworm_gauntlet',
      'block_factorys_bosses:sandworm_spawn_egg'
    ]
  },
  // ow6 beyond the veil: Void Worm (void_worm_eye). End-void apex.
  'alexsmobs:void_worm': {
    proof: 'alexsmobs:void_worm_eye',
    guaranteeProofDrop: true,
    strip: [
      'alexsmobs:void_worm_eye',
      'alexsmobs:void_worm_mandible',
      'alexsmobs:void_worm_spawn_egg'
    ]
  }

  // ============================================================================
  // DEFERRED
  // ============================================================================
  // Future required bosses belong above only after live FTBQ or canon assigns
  // them a Route 2 proof role. Draconic Guardian is intentionally absent:
  // live FTBQ uses the More Quest Types kill task as the proof.
  // Bosses never grant age stages here.
}

function aoaEventSource(event) {
  if (!event) return null
  try {
    if (event.source) return event.source
  } catch (ignored) {}
  try {
    if (event.getSource) return event.getSource()
  } catch (ignored) {}
  return null
}

function aoaSourceEntity(source) {
  if (!source) return null
  try {
    if (source.entity) return source.entity
  } catch (ignored) {}
  try {
    if (source.getEntity) return source.getEntity()
  } catch (ignored) {}
  return null
}

function aoaEntityTypeId(entity) {
  if (!entity) return ''
  try {
    if (entity.type) return String(entity.type)
  } catch (ignored) {}
  try {
    if (entity.getType) return String(entity.getType())
  } catch (ignored) {}
  try {
    if (entity.isPlayer && entity.isPlayer()) return 'minecraft:player'
  } catch (ignored) {}
  try {
    const className = String(entity.getClass().getName())
    if (className.indexOf('ServerPlayer') !== -1 || className.indexOf('.Player') !== -1) {
      return 'minecraft:player'
    }
  } catch (ignored) {}
  return ''
}

// 2026-07-25 - deferred-drop kill attribution (fdbosses Chesed and Malkuth).
// Neither boss drops loot from die(). Each clears an internal dropLoot flag, then calls
// dropAllDeathLoot(level, damageSources().generic()) from tickDeath once its death
// animation ends. NeoForge fires LivingDropsEvent inside dropAllDeathLoot, so the drops
// event arrives with a generic source carrying no entity at all and every legitimate kill
// read as a non-player kill. That stripped the proof drops (lightning_core,
// fire_and_ice_core, both trophies) on 100 percent of real kills and closed the IR and
// Gilded gates.
// getKillCredit() alone does not cover this. LivingEntity.baseTick() clears both
// lastHurtByPlayer and lastHurtByMob after 100 ticks, and Malkuth's death animation runs
// 249 ticks, so its credit is already gone when the deferred drop fires. Chesed's runs 57
// ticks and is still inside the window. So record the killer on the death event, where the
// real damage source is still attached, and read that record back on the drops event.
// Sources that DO carry an entity keep their original behaviour untouched.
// CAUTION: die() fires an EMPTY drops event before the deferred real one. In
// dropAllDeathLoot the shouldDropLoot() gate only skips dropFromLootTable and
// dropCustomDeathLoot; captureDrops and CommonHooks.onLivingDrops run unconditionally
// after it, and KubeJS posts the event with no empty-list guard. So a deferred boss
// produces TWO drops events: an empty one at death carrying the real source, then the
// populated one 57 or 249 ticks later carrying the generic source. Only the second one
// may consume the record, or the first evicts it before it is ever read.
const AOA_DEFERRED_PLAYER_KILL = {}
const AOA_DEFERRED_TTL_MILLIS = 600000

function aoaNowMillis() {
  try {
    return Date.now()
  } catch (ignored) {}
  return 0
}

// Bounded without a tick poller: eviction rides the death event, which is the only
// thing that ever adds to the map.
function aoaEvictStaleKillCredit(now) {
  if (!now) return
  Object.keys(AOA_DEFERRED_PLAYER_KILL).forEach(key => {
    if (now - AOA_DEFERRED_PLAYER_KILL[key] > AOA_DEFERRED_TTL_MILLIS) {
      delete AOA_DEFERRED_PLAYER_KILL[key]
    }
  })
}

function aoaEventEntity(event) {
  if (!event) return null
  try {
    if (event.entity) return event.entity
  } catch (ignored) {}
  try {
    if (event.getEntity) return event.getEntity()
  } catch (ignored) {}
  return null
}

function aoaEntityUuid(entity) {
  if (!entity) return ''
  try {
    if (entity.uuid) return String(entity.uuid)
  } catch (ignored) {}
  try {
    if (entity.getUUID) return String(entity.getUUID())
  } catch (ignored) {}
  return ''
}

function aoaKillCredit(entity) {
  if (!entity) return null
  try {
    if (entity.getKillCredit) return entity.getKillCredit()
  } catch (ignored) {}
  return null
}

function aoaIsRealPlayerKill(event) {
  const sourceEntity = aoaSourceEntity(aoaEventSource(event))
  if (sourceEntity) return aoaEntityTypeId(sourceEntity) === 'minecraft:player'

  // Null-entity source only: deferred-drop boss. Prefer the killer recorded at death
  // time, then fall back to the entity's own kill credit if the death hook never ran.
  const entity = aoaEventEntity(event)
  const uuid = aoaEntityUuid(entity)
  if (uuid && AOA_DEFERRED_PLAYER_KILL[uuid]) return true
  return aoaEntityTypeId(aoaKillCredit(entity)) === 'minecraft:player'
}

function aoaSourcePlayer(event) {
  const entity = aoaSourceEntity(aoaEventSource(event))
  return aoaEntityTypeId(entity) === 'minecraft:player' ? entity : null
}

function aoaDropItemId(drop) {
  if (!drop) return ''

  let stack = null
  try {
    if (drop.item) stack = drop.item
  } catch (ignored) {}
  if (!stack) {
    try {
      if (drop.getItem) stack = drop.getItem()
    } catch (ignored) {}
  }
  if (!stack) return ''

  try {
    if (stack.id) return String(stack.id)
  } catch (ignored) {}
  try {
    if (stack.item && stack.item.id) return String(stack.item.id)
  } catch (ignored) {}
  try {
    if (stack.getId) return String(stack.getId())
  } catch (ignored) {}
  try {
    if (stack.getItem && stack.getItem().id) return String(stack.getItem().id)
  } catch (ignored) {}

  return ''
}

function aoaShouldStripDrop(id, bossProof) {
  if (!id) return false
  return bossProof.strip.indexOf(id) !== -1 || id.endsWith('_spawn_egg') || id === 'minecraft:spawn_egg'
}

function aoaStripDrops(event, bossProof, includeProofDrops) {
  let drops = null
  try {
    if (event.getDrops) drops = event.getDrops()
  } catch (ignored) {}
  if (!drops) {
    try {
      if (event.drops) drops = event.drops
    } catch (ignored) {}
  }
  if (!drops || !drops.size || !drops.get || !drops.remove) return

  for (let i = drops.size() - 1; i >= 0; i--) {
    const drop = drops.get(i)
    const id = aoaDropItemId(drop)
    const isCaptureOutput = id.endsWith('_spawn_egg') || id === 'minecraft:spawn_egg'
    if ((includeProofDrops && aoaShouldStripDrop(id, bossProof)) || isCaptureOutput) {
      drops.remove(i)
    }
  }
}

Object.keys(AOA_BOSS_PROOF).forEach(entityId => {
  // Record the killer while the real damage source is still attached, so a deferred
  // drop (see the 2026-07-25 note above) can still be attributed to the player.
  EntityEvents.death(entityId, event => {
    aoaEvictStaleKillCredit(aoaNowMillis())
    const uuid = aoaEntityUuid(aoaEventEntity(event))
    if (!uuid) return
    if (aoaEntityTypeId(aoaSourceEntity(aoaEventSource(event))) === 'minecraft:player') {
      AOA_DEFERRED_PLAYER_KILL[uuid] = aoaNowMillis() || 1
    } else {
      delete AOA_DEFERRED_PLAYER_KILL[uuid]
    }
  })

  EntityEvents.drops(entityId, event => {
    const bossProof = AOA_BOSS_PROOF[entityId]
    const realPlayerKill = aoaIsRealPlayerKill(event)
    aoaStripDrops(event, bossProof, !realPlayerKill)

    // Consume the record on the deferred pass only. The empty drops event that die()
    // fires carries a real source entity, so it must leave the map alone.
    if (!aoaSourceEntity(aoaEventSource(event))) {
      const uuid = aoaEntityUuid(aoaEventEntity(event))
      if (uuid) delete AOA_DEFERRED_PLAYER_KILL[uuid]
    }
  })
})

LootJS.modifiers(event => {
  Object.keys(AOA_BOSS_PROOF).forEach(entityId => {
    const bossProof = AOA_BOSS_PROOF[entityId]
    if (!bossProof.guaranteeProofDrop) return
    // Deferred-drop bosses would LOSE their proof to this guarantee, not gain it.
    // See the 2026-07-25 note on fdbosses:chesed.
    if (bossProof.deferredDrop) return

    const modifier = event.addEntityModifier(entityId)
    modifier.removeLoot(bossProof.proof)
    modifier.addLoot(
      LootEntry.of(Item.of(bossProof.proof, 1))
        .when(condition => condition.killedByPlayer())
    )
  })

  // Obsidilith's native proof is a structure/arena chest table. Move the heart
  // to the real-player kill path above so opening an arena chest is never proof.
  event.addTableModifier('bosses_of_mass_destruction:chests/obsidilith')
    .removeLoot('bosses_of_mass_destruction:obsidian_heart')

  // Nether Gauntlet's native proof (blazing_eye) is a death-spawned arena chest table.
  // Move it onto the real-player kill path above so opening the chest is never proof.
  event.addTableModifier('bosses_of_mass_destruction:chests/gauntlet')
    .removeLoot('bosses_of_mass_destruction:blazing_eye')
})

