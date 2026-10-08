;(function () {
  if (typeof AStages === 'undefined') return

  // Ore blocks are disguised as plain stone in-world by the ore-visibility swap,
  // and AStages' RightClickBlock hook tests the TARGET block against the
  // BLOCK_INTERACTIONS attribute. Locking interaction on a hidden ore made placing
  // a torch/block against it fail ("You don't know how to use the <ore>"). Allow
  // block interaction for ore-like ids only; machines/items stay guarded.
  // (Omitted arg => stays locked.)
  function aoaOreLikeId(id) {
    return /_ore$|:ore[a-z_]|deepslateore|rawore/.test(id)
  }
  function applySoftItemPolicy(restriction, allowBlockInteraction) {
    var configured = restriction
      .allowInventoryStorage()
      .allowContainerStorage()
      .allowPickup()
    if (allowBlockInteraction !== true) configured.disableBlockInteraction()
    // AStages 2.5 defaults keep locked entries hidden in EMI and conceal their names.
    return configured
  }

  function lockItem(stage, item, reason) {
    if (typeof Item !== 'undefined' && typeof Item.exists === 'function' && !Item.exists(item)) {
      console.warn('[AoA AStages bypass] Skipped missing item ' + item + ' (stage=' + stage + ', reason=' + reason + ')')
      return
    }
    const id = 'aoa/item/p1_9/' + stage + '/' + item.replace(/[^a-zA-Z0-9_]/g, '_')
    try {
      applySoftItemPolicy(AStages.addRestrictionForItem(id, stage, item), aoaOreLikeId(item))
    } catch (e) {
      console.warn('[AoA AStages bypass] Skipped missing item ' + item + ' (stage=' + stage + ', reason=' + reason + '): ' + e)
    }
  }

  const itemLocks = [
    ["atomic", "alltheores:uranium_ore", "tighten uranium ore item to Atomic"],
    ["atomic", "alltheores:deepslate_uranium_ore", "tighten uranium ore item to Atomic"],
    ["atomic", "alltheores:nether_uranium_ore", "tighten uranium ore item to Atomic"],
    ["atomic", "alltheores:end_uranium_ore", "tighten uranium ore item to Atomic"],
    ["atomic", "alltheores:other_uranium_ore", "tighten uranium ore item to Atomic"],
    ["atomic", "mekanism:uranium_ore", "tighten uranium ore item to Atomic"],
    ["atomic", "mekanism:deepslate_uranium_ore", "tighten uranium ore item to Atomic"],
    ["industrial_revolution", "oritech:nickel_ore", "Oritech ore chain"],
    ["industrial_revolution", "oritech:deepslate_nickel_ore", "Oritech ore chain"],
    ["atomic", "oritech:deepslate_uranium_ore", "Oritech uranium"],
    ["gilded_age", "oritech:deepslate_platinum_ore", "Oritech platinum"],
    ["otherworldly", "oritech:endstone_platinum_ore", "Oritech End platinum"],

    ["the_renaissance", "actually_division:diamond_aiot", "diamond multi-tool follows diamond unlock"],
    ["industrial_revolution", "actually_division:emerald_sword", "emerald gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_pickaxe", "emerald gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_axe", "emerald gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_shovel", "emerald gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_hoe", "emerald gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_aiot", "emerald multi-tool above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_armor_helmet", "emerald armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_armor_chestplate", "emerald armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_armor_leggings", "emerald armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:emerald_armor_boots", "emerald armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:netherite_aiot", "netherite multi-tool follows netherite unlock"],
    ["industrial_revolution", "actually_division:obsidian_sword", "obsidian gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_pickaxe", "obsidian gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_axe", "obsidian gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_shovel", "obsidian gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_hoe", "obsidian gear above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_aiot", "obsidian multi-tool above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_helmet", "obsidian armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_chestplate", "obsidian armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_leggings", "obsidian armor above vanilla diamond"],
    ["industrial_revolution", "actually_division:obsidian_boots", "obsidian armor above vanilla diamond"],

    ["the_renaissance", "sophisticatedbackpacks:pickup_upgrade", "backpack auto-pickup bypass"],
    ["the_renaissance", "sophisticatedbackpacks:magnet_upgrade", "backpack magnet bypass"],
    ["the_renaissance", "sophisticatedbackpacks:deposit_upgrade", "backpack deposit bypass"],
    ["the_renaissance", "sophisticatedbackpacks:refill_upgrade", "backpack refill bypass"],
    ["the_renaissance", "sophisticatedbackpacks:restock_upgrade", "backpack restock bypass"],
    ["the_renaissance", "sophisticatedbackpacks:feeding_upgrade", "backpack auto-feeding bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_pickup_upgrade", "advanced backpack auto-pickup bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_magnet_upgrade", "advanced backpack magnet bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_deposit_upgrade", "advanced backpack deposit bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_refill_upgrade", "advanced backpack refill bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_restock_upgrade", "advanced backpack restock bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_feeding_upgrade", "advanced backpack feeding bypass"],
    ["industrial_revolution", "sophisticatedbackpacks:crafting_upgrade", "portable crafting automation"],
    ["industrial_revolution", "sophisticatedbackpacks:smelting_upgrade", "portable processing"],
    ["industrial_revolution", "sophisticatedbackpacks:auto_smelting_upgrade", "portable processing"],
    ["industrial_revolution", "sophisticatedbackpacks:blasting_upgrade", "portable processing"],
    ["industrial_revolution", "sophisticatedbackpacks:auto_blasting_upgrade", "portable processing"],
    ["industrial_revolution", "sophisticatedbackpacks:smoking_upgrade", "portable processing"],
    ["industrial_revolution", "sophisticatedbackpacks:auto_smoking_upgrade", "portable processing"],
    ["industrial_revolution", "sophisticatedbackpacks:compacting_upgrade", "portable compression"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_compacting_upgrade", "portable compression"],
    ["industrial_revolution", "sophisticatedbackpacks:void_upgrade", "void/filter automation"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_void_upgrade", "void/filter automation"],
    ["industrial_revolution", "sophisticatedbackpacks:tool_swapper_upgrade", "tool automation"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_tool_swapper_upgrade", "tool automation"],
    ["industrial_revolution", "sophisticatedbackpacks:pump_upgrade", "portable fluid automation"],
    ["industrial_revolution", "sophisticatedbackpacks:advanced_pump_upgrade", "portable fluid automation"],
    ["the_renaissance", "sophisticatedbackpacks:diamond_backpack", "diamond-tier storage"],
    ["gilded_age", "sophisticatedbackpacks:stack_upgrade_tier_3", "high capacity logistics"],
    ["gilded_age", "sophisticatedbackpacks:stack_upgrade_tier_4", "high capacity logistics"],
    ["gilded_age", "sophisticatedbackpacks:netherite_backpack", "late storage tier"],
    ["otherworldly", "sophisticatedbackpacks:inception_upgrade", "nested-storage bypass risk"],
    ["otherworldly", "sophisticatedbackpacks:infinity_upgrade", "infinite storage"],
    ["otherworldly", "sophisticatedbackpacks:survival_infinity_upgrade", "infinite storage"],
    ["otherworldly", "sophisticatedbackpacks:stack_upgrade_omega_tier", "omega storage"],
    ["otherworldly", "sophisticatedbackpacks:everlasting_upgrade", "late durability/storage utility"],

    ["medieval_times", "sophisticatedstorage:pickup_upgrade", "storage pickup bypass"],
    ["the_renaissance", "sophisticatedstorage:magnet_upgrade", "storage magnet bypass"],
    ["the_renaissance", "sophisticatedstorage:advanced_pickup_upgrade", "advanced storage pickup bypass"],
    ["the_renaissance", "sophisticatedstorage:advanced_magnet_upgrade", "advanced storage magnet bypass"],
    ["the_renaissance", "sophisticatedstorage:hopper_upgrade", "storage automation"],
    ["the_renaissance", "sophisticatedstorage:advanced_hopper_upgrade", "storage automation"],
    ["the_renaissance", "sophisticatedstorage:crafting_upgrade", "storage crafting"],
    ["the_renaissance", "sophisticatedstorage:smelting_upgrade", "storage processing"],
    ["the_renaissance", "sophisticatedstorage:auto_smelting_upgrade", "storage processing"],
    ["the_renaissance", "sophisticatedstorage:blasting_upgrade", "storage processing"],
    ["the_renaissance", "sophisticatedstorage:auto_blasting_upgrade", "storage processing"],
    ["the_renaissance", "sophisticatedstorage:smoking_upgrade", "storage processing"],
    ["the_renaissance", "sophisticatedstorage:auto_smoking_upgrade", "storage processing"],
    ["the_renaissance", "sophisticatedstorage:compacting_upgrade", "storage compression"],
    ["the_renaissance", "sophisticatedstorage:advanced_compacting_upgrade", "storage compression"],
    ["the_renaissance", "sophisticatedstorage:void_upgrade", "void/filter automation"],
    ["the_renaissance", "sophisticatedstorage:advanced_void_upgrade", "void/filter automation"],
    ["the_renaissance", "sophisticatedstorage:storage_link", "networked storage link"],
    ["the_renaissance", "sophisticatedstorage:diamond_chest", "diamond-tier storage"],
    ["the_renaissance", "sophisticatedstorage:diamond_barrel", "diamond-tier storage"],
    // Portable shulker storage is industrial_revolution: minecraft:shulker_shell is
    // locked to IR in aoa_astages_01, and every route to this box consumes shells.
    // Leaving this at the_renaissance would advertise an unlock the ingredient
    // forbids. The diamond chest and barrel above stay Renaissance; they need no shells.
    ["industrial_revolution", "sophisticatedstorage:diamond_shulker_box", "diamond-tier storage"],
    ["gilded_age", "sophisticatedstorage:stack_upgrade_tier_3", "high capacity logistics"],
    ["gilded_age", "sophisticatedstorage:stack_upgrade_tier_4", "high capacity logistics"],
    ["gilded_age", "sophisticatedstorage:stack_upgrade_tier_5", "high capacity logistics"],
    ["gilded_age", "sophisticatedstorage:netherite_chest", "late storage tier"],
    ["gilded_age", "sophisticatedstorage:netherite_barrel", "late storage tier"],
    ["gilded_age", "sophisticatedstorage:netherite_shulker_box", "late storage tier"],
    ["otherworldly", "sophisticatedstorage:infinity_upgrade", "infinite storage"],
    ["otherworldly", "sophisticatedstorage:survival_infinity_upgrade", "infinite storage"],
    ["otherworldly", "sophisticatedstorage:stack_upgrade_omega_tier", "omega storage"],

    ["gilded_age", "industrialforegoing:mob_duplicator", "mob simulation/capture bypass"],
    ["gilded_age", "industrialforegoing:mob_crusher", "non-player boss-drop bypass"],
    ["gilded_age", "industrialforegoing:mob_slaughter_factory", "non-player boss-drop bypass"],
    ["gilded_age", "industrialforegoing:mob_imprisonment_tool", "mob capture bypass"],
    ["atomic", "industrialforegoing:infinity_backpack", "late storage bypass"],
    ["atomic", "industrialforegoing:infinity_launcher", "late combat bypass"],
    ["atomic", "industrialforegoing:infinity_nuke", "late combat bypass"],

    ["atomic", "mekanism_lasers:basic_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:basic_toggleable_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:advanced_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:advanced_toggleable_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:elite_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:elite_toggleable_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:ultimate_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:ultimate_toggleable_laser", "boss cheese laser"],
    ["atomic", "mekanism_lasers:laser_splitter", "boss cheese laser"],
    ["atomic", "mekanism_lasers:laser_stopper", "boss cheese laser"],
    ["atomic", "mekanism_lasers:remote_control", "boss cheese laser"],
    ["atomic", "mekanism_turrets:basic_laser_turret", "automated combat bypass"],
    ["atomic", "mekanism_turrets:advanced_laser_turret", "automated combat bypass"],
    ["atomic", "mekanism_turrets:elite_laser_turret", "automated combat bypass"],
    ["atomic", "mekanism_turrets:ultimate_laser_turret", "automated combat bypass"],
    ["atomic", "mekanism_turrets:electric_fence", "automated combat bypass"],

    ["atomic", "ballistix:grenadeanvil", "combat bypass"],
    ["atomic", "ballistix:grenadeattractive", "combat bypass"],
    ["atomic", "ballistix:grenadechemical", "combat bypass"],
    ["atomic", "ballistix:grenadecondensive", "combat bypass"],
    ["atomic", "ballistix:grenadedebilitation", "combat bypass"],
    ["atomic", "ballistix:grenadeincendiary", "combat bypass"],
    ["atomic", "ballistix:grenadeinfestive", "combat bypass"],
    ["atomic", "ballistix:grenaderepulsive", "combat bypass"],
    ["atomic", "ballistix:grenadeshrapnel", "combat bypass"],
    ["atomic", "ballistix:laserturret", "automated combat bypass"],
    ["atomic", "ballistix:railgunturret", "automated combat bypass"],
    ["atomic", "ballistix:samturret", "automated combat bypass"],
    ["atomic", "ballistix:ciwsturret", "automated combat bypass"],
    ["atomic", "ballistix:aamissile", "missile bypass"],
    ["atomic", "ballistix:aamissilemk2", "missile bypass"],
    ["atomic", "ballistix:missiletier2", "missile bypass"],
    ["atomic", "ballistix:missiletier3", "missile bypass"],
    ["atomic", "ballistix:missilecluster", "missile bypass"],
    ["atomic", "ballistix:thermobaric", "late explosive bypass"],
    ["otherworldly", "ballistix:antimatter", "late explosive bypass"],
    ["otherworldly", "ballistix:largeantimatter", "late explosive bypass"],
    ["atomic", "ballistix:minecartthermobaric", "late explosive bypass"],
    ["otherworldly", "ballistix:minecartdarkmatter", "late explosive bypass"],
    ["otherworldly", "ballistix:minecartantimatter", "late explosive bypass"],
    ["otherworldly", "ballistix:minecartlargeantimatter", "late explosive bypass"],

    ["gilded_age", "refurbished_furniture:post_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:package", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:oak_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:spruce_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:birch_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:jungle_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:acacia_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:dark_oak_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:mangrove_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:cherry_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:crimson_mail_box", "cross-dimensional item transfer"],
    ["gilded_age", "refurbished_furniture:warped_mail_box", "cross-dimensional item transfer"],

    ["industrial_revolution", "waystones:white_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:orange_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:magenta_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:light_blue_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:yellow_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:lime_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:pink_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:gray_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:light_gray_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:cyan_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:purple_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:blue_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:brown_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:green_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:red_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:black_portstone", "portable cross-dimensional warp"],
    ["industrial_revolution", "waystones:sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:orange_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:magenta_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:light_blue_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:yellow_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:lime_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:pink_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:gray_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:light_gray_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:cyan_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:purple_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:blue_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:brown_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:green_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:red_sharestone", "shared cross-dimensional warp"],
    ["industrial_revolution", "waystones:black_sharestone", "shared cross-dimensional warp"],
    ["medieval_times", "waystones:sandy_waystone", "waystone variant"],
    ["medieval_times", "waystones:mossy_waystone", "waystone variant"],
    ["medieval_times", "waystones:deepslate_waystone", "waystone variant"],
    ["medieval_times", "waystones:blackstone_waystone", "waystone variant"],
    ["medieval_times", "waystones:end_stone_waystone", "waystone variant"],
    ["industrial_revolution", "waystones:warp_plate", "cross-dimensional warp surface"],
    ["industrial_revolution", "waystones:warp_stone", "portable warp"],
    ["industrial_revolution", "waystones:warp_scroll", "portable warp"],
    ["industrial_revolution", "waystones:return_scroll", "portable warp"],
    ["industrial_revolution", "waystones:bound_scroll", "portable warp"],
    ["industrial_revolution", "waystones:attuned_shard", "portable warp"],
    ["industrial_revolution", "waystones:crumbling_attuned_shard", "portable warp"],

    ["the_renaissance", "quark:backpack", "portable storage pacing"],
    ["the_renaissance", "quark:backpack_locked", "portable storage pacing"],
    ["the_renaissance", "quark:crate", "portable storage pacing"],
    ["the_renaissance", "quark:magnet", "magnet logistics bypass"],
    ["the_renaissance", "quark:pickarang", "early reach/mining bypass"],
    ["industrial_revolution", "quark:flamerang", "ranged fire/combat bypass"],
    ["industrial_revolution", "quark:pipe", "item routing automation"],
    ["industrial_revolution", "quark:encased_pipe", "item routing automation"],

    ["the_renaissance", "supplementaries:rope_arrow", "early vertical mobility bypass"],
    ["the_renaissance", "supplementaries:bomb", "explosive progression bypass"],
    ["the_renaissance", "supplementaries:bomb_blue", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannonball", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_oak", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_spruce", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_birch", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_jungle", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_acacia", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_dark_oak", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_mangrove", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_boat_cherry", "explosive progression bypass"],
    ["medieval_times", "supplementaries:cannon_raft_bamboo", "explosive progression bypass"],

    // C2 stage-row reconciliation (2026-06-02, Cross-Age Split Ledger row 11):
    // Modular Force Fields containment is canon Atomic (chapter at5_threshold_of_war,
    // proof at_mff_containment_complete). These rows previously sat at gilded_age --
    // out of step with canon and with the rest of file 07's combat/bypass entries
    // (mekanism lasers/turrets, ballistix all = atomic). AStages is most-restrictive-
    // wins, so interdictionmatrix was already effectively Atomic via its 01k lock;
    // tightening here makes the lock literally match canon and lifts the (machine-
    // inert) field modules off gilded. No softlock: no Gilded chapter uses MFF.
    ["atomic", "modularforcefields:interdictionmatrix", "field boss/area bypass; MFF containment = Atomic"],
    ["atomic", "modularforcefields:moduleupgradeantihostile", "field boss/area bypass; MFF containment = Atomic"],
    ["atomic", "modularforcefields:moduleupgradeantipersonnel", "field boss/area bypass; MFF containment = Atomic"],
    ["atomic", "modularforcefields:moduleupgradeantispawn", "field boss/area bypass; MFF containment = Atomic"],
    ["atomic", "modularforcefields:moduleupgradeconfiscate", "field boss/area bypass; MFF containment = Atomic"],
    ["atomic", "modularforcefields:moduleupgradedisintegration", "field boss/area bypass; MFF containment = Atomic"],
    ["atomic", "modularforcefields:moduleupgradeshock", "field boss/area bypass; MFF containment = Atomic"],

    // Trivializer locks (owner rulings 2026-07-25; scope reduced 2026-08-08 when
    // The Long Night was decommissioned and its duels re-aged). Boss-drop and
    // boss-tier gear that outclasses the age it is obtained in. Soft policy keeps
    // the tooltip and item name visible; pickup and inventory storage stay open.
    // Helvar's Sword is the Underworld Knight boss proof consumed by
    // boss_progression_proof.js; its kill quest now lives in ow3_dragon_technology,
    // where the Gilded lock is long past. The lock stays to stop a stray world
    // drop trivializing Renaissance combat.
    ["gilded_age", "block_factorys_bosses:knight_sword", "boss-drop weapon outclasses Renaissance combat"],
    // Undergarden Forgotten tier: the six tools plus the smithing template that creates
    // them. undergarden:forgotten_nugget is deliberately NOT locked -- it is the Forgotten
    // Guardian boss proof in boss_progression_proof.js. The ingot and block forms stay
    // free too; with the gear locked they are inert.
    ["gilded_age", "undergarden:forgotten_sword", "Forgotten tier outclasses Renaissance gear"],
    ["gilded_age", "undergarden:forgotten_pickaxe", "Forgotten tier outclasses Renaissance gear"],
    ["gilded_age", "undergarden:forgotten_axe", "Forgotten tier outclasses Renaissance gear"],
    ["gilded_age", "undergarden:forgotten_shovel", "Forgotten tier outclasses Renaissance gear"],
    ["gilded_age", "undergarden:forgotten_hoe", "Forgotten tier outclasses Renaissance gear"],
    ["gilded_age", "undergarden:forgotten_battleaxe", "Forgotten tier outclasses Renaissance gear"],
    ["gilded_age", "undergarden:forgotten_upgrade_smithing_template", "Forgotten smithing upgrade gates the tier"],
  ]

  itemLocks.forEach(function (entry) {
    lockItem(entry[0], entry[1], entry[2])
  })
})()
