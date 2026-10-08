;(function () {
  if (typeof AStages === 'undefined') return

  const Component = Java.loadClass('net.minecraft.network.chat.Component')

  function safeId(id) {
    return id.replace(/[^a-zA-Z0-9_]/g, '_')
  }

  function messageSupplier(message) {
    return function () {
      return Component.literal(message)
    }
  }

  // These native one-shot encounters delete or deactivate their trigger even
  // when an EntityJoinLevelEvent cancellation rejects the boss. Let the boss
  // join, then keep it invulnerable and uninteractable until its legal stage.
  const encounterSafeBosses = {
    "fdbosses:chesed": true,
    "fdbosses:malkuth": true,
    "fdbosses:geburah": true,
    "block_factorys_bosses:infernal_dragon": true,
    "block_factorys_bosses:kraken": true,
  }

  function lockBoss(stage, entity, reason, attackMessage, interactionMessage) {
    const restriction = AStages.addRestrictionForMob('aoa/mob_boss/p1_9/' + stage + '/' + safeId(entity), stage, entity)

    if (!encounterSafeBosses[entity]) restriction.disableOverallSpawning()

    restriction.disableAttack()
      .disableRightClick()

    if (attackMessage) restriction.attackMessage(messageSupplier(attackMessage))
    if (interactionMessage || attackMessage) {
      restriction.interactionMessage(messageSupplier(interactionMessage || attackMessage))
    }
  }

  function lockEncounterSpawner(stage, entity, interactionMessage) {
    const restriction = AStages.addRestrictionForMob(
      'aoa/mob_boss_spawner/p1_9/' + stage + '/' + safeId(entity),
      stage,
      entity
    )
      .disableAttack()
      .disableRightClick()

    if (interactionMessage) restriction.interactionMessage(messageSupplier(interactionMessage))
  }

  const bossLocks = [
    ["otherworldly", "cataclysm:maledictus", "Otherworldly occult-lane boss (Cataclysm apex 2); Frosted Prison structure stays Renaissance-open for its cursed metals", "An ancient curse repels your weapon. You are not yet ready."],
    ["industrial_revolution", "cataclysm:ender_guardian", "End boss tier"],
    ["industrial_revolution", "cataclysm:netherite_monstrosity", "Nether boss tier", "The monstrosity ignores your feeble strikes."],
    ["gilded_age", "cataclysm:ancient_remnant", "late Cataclysm boss tier"],
    ["gilded_age", "cataclysm:the_harbinger", "Gilded Ancient Factory required boss (BL2); arena structure is gilded_age locked"],
    ["otherworldly", "cataclysm:ignis", "Otherworldly power-lane boss (Cataclysm apex 1); Burning Arena structure is atomic-locked", "Flames consume your weapon before it connects."],
    ["gilded_age", "astral_dimension:void_titan", "Astral Dimension Gilded proof boss"],
    ["gilded_age", "astral_dimension:angel_boss", "Astral Dimension Gilded boss belt"],
    ["gilded_age", "astral_dimension:tower_of_malice", "Astral Dimension Gilded boss belt"],
    ["gilded_age", "astral_dimension:helioos", "Astral Dimension Gilded boss belt"],
    ["gilded_age", "astral_dimension:undoing", "Astral Dimension Gilded boss belt"],
    ["gilded_age", "astral_dimension:amethyst_knight", "Astral Dimension boss-tier safety lock"],
    ["otherworldly", "cataclysm:the_leviathan", "Otherworldly proof boss", "The beast's scales are impervious to your current arms."],
    ["otherworldly", "cataclysm:scylla", "late Cataclysm ocean boss tier"],
    ["ascension", "draconicevolution:draconic_guardian", "Ascension final boss", "The Chaos Dragon does not answer to an unfinished age."],

    ["the_renaissance", "bosses_of_mass_destruction:lich", "BOMD boss", "The lich phases through your attack. It does not consider you a threat."],
    ["the_renaissance", "bosses_of_mass_destruction:void_blossom", "BOMD boss"],
    ["the_renaissance", "bosses_of_mass_destruction:gauntlet", "Renaissance Nether required boss (BL2)"],
    ["industrial_revolution", "bosses_of_mass_destruction:obsidilith", "Gilded handoff proof boss", "The obsidian heart pulses, but your strikes pass through harmlessly."],

    // Qliphoth boss-tier gates per age (boss-ladder BL1, 2026-07-02): Chesed = IR co-required
    // exam, Malkuth = Gilded co-required exam, Geburah stays the Atomic exam.
    ["gilded_age", "fdbosses:malkuth", "FDBosses boss tier", "The fallen king's judgment finds you unprepared."],
    ["industrial_revolution", "fdbosses:chesed", "FDBosses boss tier", "Mercy stays your hand, or perhaps its power stays it for you."],
    ["atomic", "fdbosses:geburah", "Atomic exam boss", "Judgment finds you unworthy. Return when you have proven containment."],

    // Vanilla apex mob gate: Deep Dark loot/combat is Industrial-tier content.
    ["industrial_revolution", "minecraft:warden", "Deep-dark apex", "The Warden does not acknowledge the unproven."],

    ["atomic", "macabre:valamon", "Macabre Atomic containment boss", "The Pit will not recognize you before Atomic containment."],
    ["atomic", "macabre:gomoria", "Macabre Atomic containment boss", "The Pit will not recognize you before Atomic containment."],
    ["atomic", "macabre:gargamaw", "Macabre Atomic containment boss", "The Pit will not recognize you before Atomic containment."],
    ["atomic", "macabre:baal", "Macabre Atomic containment boss", "The Pit will not recognize you before Atomic containment."],
    ["atomic", "macabre:valamon_spawner", "Macabre false-idol spawner", "The false idol refuses to wake before Atomic containment."],
    ["atomic", "macabre:gomoria_spawner", "Macabre false-idol spawner", "The false idol refuses to wake before Atomic containment."],
    ["atomic", "macabre:gargamaw_spawner", "Macabre false-idol spawner", "The false idol refuses to wake before Atomic containment."],
    ["atomic", "macabre:baal_spawner", "Macabre false-idol spawner", "The false idol refuses to wake before Atomic containment."],
    // Macabre 0.9.2: Morphegor is the required 5th Atomic prophet. Dead God / Meshuggeneh / Shadow
    // are the Otherworldly finale (Dead God -> dead_god_egg -> Limbo -> Shadows -> Meshuggeneh).
    ["atomic", "macabre:morphegor", "Macabre Atomic containment boss", "The Pit will not recognize you before Atomic containment."],
    ["atomic", "macabre:morphegor_spawner", "Macabre false-idol spawner", "The false idol refuses to wake before Atomic containment."],
    ["otherworldly", "macabre:dead_god", "Macabre Otherworldly finale boss", "The Dead God sleeps beyond reach until you have passed into the Otherworldly."],
    ["otherworldly", "macabre:meshuggeneh", "Macabre Otherworldly terminal boss", "The thing in Limbo does not stir for the unascended."],
    ["otherworldly", "macabre:shadow", "Macabre Limbo shade", "Limbo's shades do not answer before the Otherworldly."],

    ["medieval_times", "mowziesmobs:naga", "Mowzie boss/miniboss"],
    ["medieval_times", "mowziesmobs:ferrous_wroughtnaut", "Mowzie iron-mastery boss"],
    ["medieval_times", "mowziesmobs:frostmaw", "Medieval hunt boss", "The frostmaw sleeps until a worthy hunter arrives."],
    ["gilded_age", "mowziesmobs:umvuthi", "Mowzie boss", "The sun chief's divine aura deflects your attack."],

    ["the_renaissance", "block_factorys_bosses:underworld_knight", "Block Factory boss"],
    ["otherworldly", "block_factorys_bosses:sandworm", "Otherworldly required boss (ow6)"],
    ["otherworldly", "block_factorys_bosses:infernal_dragon", "Otherworldly dragon-technology lane boss (ow3); Dragon Tower is a surface structure, so the mob lock is the gate", "The dragon's fire answers your strike. You are not yet ready."],
    ["industrial_revolution", "block_factorys_bosses:yeti", "Block Factory boss"],
    ["otherworldly", "block_factorys_bosses:kraken", "Block Factory boss"],

    ["the_renaissance", "aether:slider", "Aether dungeon boss"],
    ["the_renaissance", "aether:valkyrie_queen", "Renaissance Aether required boss (BL2)"],
    ["gilded_age", "aether:sun_spirit", "Gilded Aether culmination boss"],
    ["gilded_age", "deep_aether:eots_controller", "Deep Aether culmination boss"],
    ["industrial_revolution", "deeperdarker:stalker", "Otherside elite mob"],
  ]

  // FDBosses structures embed dossier entities. Gate the dossier interaction,
  // not the boss join, because the native spawner deactivates after one attempt.
  const encounterSpawnerLocks = [
    ["industrial_revolution", "fdbosses:chesed_boss_spawner", "The arena dossier remains sealed until the Industrial Revolution."],
    ["gilded_age", "fdbosses:malkuth_boss_spawner", "The fallen king's dossier remains sealed until the Gilded Age."],
    ["atomic", "fdbosses:geburah_boss_spawner", "The arena dossier remains sealed until Atomic containment."],
  ]

  bossLocks.forEach(function (entry) {
    lockBoss(entry[0], entry[1], entry[2], entry[3], entry[4])
  })

  encounterSpawnerLocks.forEach(function (entry) {
    lockEncounterSpawner(entry[0], entry[1], entry[2])
  })
})()
