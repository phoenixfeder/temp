// AoA KubeJS: aoa_astages_00_register_stages.js
// Registers each AoA stage with AStages via customizeStage() plus a no-op marker
// restriction on minecraft:barrier.
// Barrier is unobtainable in survival, so the restriction is invisible to players.
// This silences the astages-common.toml missing-stage warning ("Enable Warning"
// pre-2.3.x, "Enable Missing Stage Warning" under [Notifications] on 2.3.x) for
// any stage with no real item lock - notably aoa_complete and the functional
// boss proofs, which are pure progression markers.
// If a future admin task involves real barrier-block restrictions, switch the
// marker item to a different unobtainable id (e.g. minecraft:structure_void).

;(function () {
  if (typeof AStages === 'undefined') return

  // Visible age-transition banners. Proof stages are silent native
  // astages:player rewards and do not need banner text.
  const STAGE_BANNERS = {
    dark_ages: { title: 'Dark Ages', sub: 'Age Unlocked' },
    medieval_times: { title: 'Medieval Times', sub: 'Age Unlocked' },
    the_renaissance: { title: 'The Renaissance', sub: 'Age Unlocked' },
    industrial_revolution: { title: 'Industrial Revolution', sub: 'Age Unlocked' },
    gilded_age: { title: 'Gilded Age', sub: 'Age Unlocked' },
    atomic: { title: 'Atomic', sub: 'Age Unlocked' },
    otherworldly: { title: 'Otherworldly', sub: 'Age Unlocked' },
    ascension: { title: 'Ascension', sub: 'Age Unlocked' },
    aoa_complete: { title: 'Ascension of Ages', sub: 'The climb is complete' }
  }
  const STAGE_ICONS = {
    dark_ages: 'minecraft:campfire',
    medieval_times: 'overgeared:copper_smithing_hammer',
    the_renaissance: 'spectrum:guidebook',
    industrial_revolution: 'modern_industrialization:steel_dust',
    gilded_age: 'bosses_of_mass_destruction:obsidian_heart',
    atomic: 'mekanism:atomic_disassembler',
    otherworldly: 'ad_astra:tier_1_rocket',
    ascension: 'minecraft:nether_star',
    aoa_complete: 'avaritia:infinity_ingot'
  }

  // AStages keeps its stage registry across KubeJS /reload. The startup script
  // initializes these globals once per client launch; this server script only
  // reads them because KubeJS rejects global assignment in server scripts.
  const customized = global.aoaAStagesCustomized
  const markersRegistered = global.aoaAStagesMarkersRegistered
  if (!customized || !markersRegistered) {
    console.error('[AoA AStages] reload guards were not initialized by startup_scripts/aoa_astages_reload_guard.js')
    return
  }

  function registerStage(stage) {
    if (!customized[stage]) {
      try {
        if (typeof AStages.customizeStage === 'function') {
          // Rhino rejects const/let inside functions invoked per-stage
          // ("redeclaration of var") -- use var here.
          var stageObject = AStages.customizeStage(stage)
          customized[stage] = true

          var banner = STAGE_BANNERS[stage]
          if (banner && stageObject && typeof stageObject.titleOnAdd === 'function') {
            var titleComponent = Text.gold(banner.title)
            stageObject.titleOnAdd(function () { return titleComponent })
            if (typeof stageObject.subTitleOnAdd === 'function') {
              var subComponent = Text.gray(banner.sub)
              stageObject.subTitleOnAdd(function () { return subComponent })
            }
          }

          var icon = STAGE_ICONS[stage]
          if (icon && stageObject && typeof stageObject.icon === 'function') {
            stageObject.icon(Item.of(icon))
          }
        }
      } catch (e) {
        console.warn('[AoA AStages] customizeStage failed for ' + stage + ': ' + e)
      }
    }

    if (!markersRegistered[stage]) {
      var id = 'aoa/marker/' + stage
      try {
        AStages.addRestrictionForItem(id, stage, 'minecraft:barrier')
        markersRegistered[stage] = true
      } catch (e) {
        console.warn('[AoA AStages] marker restriction failed for ' + stage + ': ' + e)
      }
    }
  }

  const stages = [
    // ---- The 9 public ages: the progression spine ----
    // Granted by the FTBQ age quests (auto: "enabled") and consumed by
    // aoa_astages_01..13. These are the only stages that gate age content.
    'dark_ages', 'medieval_times', 'the_renaissance',
    'industrial_revolution', 'gilded_age', 'atomic',
    'otherworldly', 'ascension', 'aoa_complete',

    // ---- Functional boss proofs (NOT dead markers -- do not strip) ----
    // These two gate post-boss mob ecology and loot. Removing either leaves the
    // dependent locks permanently closed (mobs never spawn, loot never unlocks):
    //   obsidilith_defeated  -> aoa_astages_04_mob_restrictions.js
    //                           aoa_astages_09_loot_bypass_restrictions.js
    //   tremorzilla_defeated -> aoa_astages_04_mob_restrictions.js
    'obsidilith_defeated',
    'tremorzilla_defeated'
  ]
  stages.forEach(registerStage)
})()
