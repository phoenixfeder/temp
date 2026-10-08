;(function () {
  if (typeof AStages === 'undefined') return

  const mobSpawnLocks = [
    // Malkuth's summoned warriors remain Gilded-owned. The three Qliphoth bosses
    // use encounter-safe locks in aoa_astages_08_mob_boss_restrictions.js.
    ["gilded_age", "fdbosses:fire_malkuth_warrior", "mod_spawn:fdbosses"],
    ["gilded_age", "fdbosses:ice_malkuth_warrior", "mod_spawn:fdbosses"],
    ["the_renaissance", "born_in_chaos_v1:diamond_termite", "exact_spawn"],
    ["medieval_times", "born_in_chaos_v1:nightmare_stalker", "exact_spawn"],
    ["medieval_times", "monsterplus:ancient_hero", "exact_spawn"],
    // Medieval gets an early ZoNiEx taste; progression-drop carriers stay Renaissance.
    ["medieval_times", "zoniex:blood_eagle", "mod_spawn:zoniex"],
    ["the_renaissance", "zoniex:brutaliser", "mod_spawn:zoniex"],
    ["the_renaissance", "zoniex:disemboweler", "mod_spawn:zoniex"],
    ["medieval_times", "zoniex:skin_crawler", "mod_spawn:zoniex"],
    ["the_renaissance", "zoniex:spine_wrencher", "mod_spawn:zoniex"],
    ["medieval_times", "zoniex:tormented_zombie", "mod_spawn:zoniex"],
    ["the_renaissance", "block_factorys_bosses:dragon_guard_sword", "bfb_key_source"],
    ["the_renaissance", "block_factorys_bosses:flaming_skeleton_guard_fireball", "bfb_key_source"],
    ["the_renaissance", "block_factorys_bosses:flaming_skeleton_guard_sword", "bfb_key_source"],
    ["the_renaissance", "block_factorys_bosses:soul_knight_wither_skeleton", "bfb_key_source"],
    ["the_renaissance", "block_factorys_bosses:soul_skeleton", "bfb_key_source"],
  ]

  mobSpawnLocks.forEach(function (entry) {
    const id = 'aoa/mob_spawn/' + entry[0] + '/' + entry[1].replace(/[^a-zA-Z0-9_]/g, '_')
    AStages.addRestrictionForMob(id, entry[0], entry[1]).disableOverallSpawning()
  })

  const postBossEcologyLocks = [
    // Keep Renaissance proof stages inert; broad ecology locks stay age-owned.
    ["the_renaissance", "maledictus", "cataclysm:ender_golem"],
    ["the_renaissance", "maledictus", "cataclysm:ignited_revenant"],
    ["the_renaissance", "maledictus", "cataclysm:ignited_berserker"],

    // Obsidilith proof lets stronger End-adjacent Cataclysm ecology appear.
    ["obsidilith_defeated", "obsidilith", "cataclysm:endermaptera"],

    // Tremorzilla proof awakens verified irradiated Alex's Caves ecology.
    ["tremorzilla_defeated", "tremorzilla", "alexscaves:gammaroach"],
    ["tremorzilla_defeated", "tremorzilla", "alexscaves:nucleeper"],
    ["tremorzilla_defeated", "tremorzilla", "alexscaves:magnetron"],
    ["tremorzilla_defeated", "tremorzilla", "alexscaves:radgill"],
  ]

  postBossEcologyLocks.forEach(function (entry) {
    const id = 'aoa/mob_eco/post_' + entry[1] + '/' + entry[2].replace(/[^a-zA-Z0-9_]/g, '_')
    AStages.addRestrictionForMob(id, entry[0], entry[2]).disableOverallSpawning()
  })
})()
