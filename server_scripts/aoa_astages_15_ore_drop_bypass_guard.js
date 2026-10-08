// AoA KubeJS: aoa_astages_15_ore_drop_bypass_guard.js
//
// Closes the AoE-tool bypass of the AStages ore disguise.
// Design: docs/superpowers/specs/2026-08-09-astages-ore-aoe-bypass-design.md
//
// WHY THIS EXISTS
// AStages hides an ore by swapping the BlockState on the VANILLA break path
// (mixins on ServerPlayerGameMode, BlockBehaviour#getDestroyProgress, and the
// BlockEvent.BreakEvent constructor). Nothing hooks Level#destroyBlock,
// Block#playerDestroy, or Block#dropResources.
//
// Silent Gear's AoE handler (IAoeTool$BreakHandler#onBlockBreakEvent) does not
// use that path: for each extra position it re-reads level.getBlockState(pos) -
// the RAW ore state - and calls Block.playerDestroy directly, firing no
// per-neighbour BreakEvent. The real ore loot table then rolls. Verified in
// bytecode against silent-gear-1.21.1-neoforge-4.2.1.1.jar, 2026-08-09.
//
// AStages DOES listen to BlockDropsEvent (OreServerEvents#onBlockBroken), it
// DOES resolve the correct AOreRestriction from the raw state, and it then
// corrects ONLY setDroppedExperience - it never touches event.getDrops(). On
// the vanilla path the drops were already right, so XP was the only gap
// upstream noticed. This script finishes that job on the same event.
//
// Report the omission upstream; do not wait for it.

;(function () {
  if (typeof BlockEvents === 'undefined') return
  if (typeof AStages === 'undefined') return

  const oreDisguiseTable = global.aoaOreDisguiseTable
  if (!oreDisguiseTable) {
    console.error('[AoA OreGuard] global.aoaOreDisguiseTable missing - startup_scripts/aoa_astages_reload_guard.js did not run. Guard NOT armed.')
    return
  }

  // ---------------------------------------------------------------------
  // Stage lookup
  // ---------------------------------------------------------------------
  // AStages exposes playerHasStage as BOTH (Player, String) and (String, Player).
  // The explicit-signature form is the pack's established disambiguation idiom
  // (aoa_age_stage_forward_reconcile.js:18-19). Plain-form callers also exist
  // (aoa_age_advancement_shim.js:35), so fall back to it rather than refusing.
  const HAS_STAGE_SIGNATURE =
    'playerHasStage(net.minecraft.world.entity.player.Player,java.lang.String)'
  const playerHasStage = AStages[HAS_STAGE_SIGNATURE] || AStages.playerHasStage

  if (!playerHasStage) {
    // Deliberate fail-CLOSED-on-registration. The alternative - arming the
    // guard while unable to read stages - would treat every player as
    // unstaged and delete ore drops server-wide. A reopened minor exploit
    // beats a P0.
    console.error('[AoA OreGuard] AStages.playerHasStage is unavailable; the AStages API changed. Guard NOT armed - the AoE ore bypass stays open. Fix this before shipping.')
    return
  }

  function hasStage(player, stage) {
    try {
      return playerHasStage(player, stage) === true
    } catch (e) {
      // Unknown state is NOT "player lacks the stage" - that direction would
      // eat legitimate drops. Report having it, i.e. do not interfere.
      console.warn('[AoA OreGuard] playerHasStage threw for stage ' + stage + ': ' + e)
      return true
    }
  }

  // ---------------------------------------------------------------------
  // Disguise -> drop map
  // ---------------------------------------------------------------------
  // Every entry resolved from that block's OWN loot table (17 from mods/, the
  // vanilla 7 from Install/versions/1.21.1/1.21.1.jar), 2026-08-09. Nothing
  // here is recalled from memory. 26 disguises are used by script 06; a
  // 24-entry draft of this map silently omitted dreadrock and tremblecrust,
  // which is why the load-time census below is mandatory rather than nice.
  //
  // silk: the drop when the tool has Silk Touch. A silk pickaxe on real stone
  // yields stone, so a silk hammer on a hidden ore must too - otherwise the
  // anomaly is itself the tell.
  const COBBLED = {
    'minecraft:stone': 'minecraft:cobblestone',
    'minecraft:deepslate': 'minecraft:cobbled_deepslate',
    'deeperdarker:gloomslate': 'deeperdarker:cobbled_gloomslate',
    'deeperdarker:sculk_stone': 'deeperdarker:cobbled_sculk_stone',
    'eternal_starlight:grimstone': 'eternal_starlight:cobbled_grimstone',
    'eternal_starlight:voidstone': 'eternal_starlight:cobbled_voidstone',
    'spectrum:blackslag': 'spectrum:cobbled_blackslag'
  }

  // Drop themselves, no silk-touch branch in their loot table.
  const SELF_DROPPING = [
    'minecraft:andesite',
    'minecraft:diorite',
    'minecraft:tuff',
    'minecraft:netherrack',
    'minecraft:end_stone',
    'aether:holystone',
    'astral_dimension:astral_stone',
    'eternal_starlight:eternal_ice',
    'eternal_starlight:haze_ice',
    'eternal_starlight:nightfall_mud',
    'eternal_starlight:packed_nightfall_mud',
    'ad_astra:glacio_stone',
    'ad_astra:mars_stone',
    'ad_astra:mercury_stone',
    'ad_astra:moon_stone',
    'ad_astra:venus_stone',
    'undergarden:depthrock',
    'undergarden:shiverstone',
    'undergarden:dreadrock',
    'undergarden:tremblecrust'
  ]

  const DISGUISE_DROPS = {}
  Object.keys(COBBLED).forEach(function (block) {
    DISGUISE_DROPS[block] = { normal: COBBLED[block], silk: block }
  })
  SELF_DROPPING.forEach(function (block) {
    DISGUISE_DROPS[block] = { normal: block, silk: block }
  })

  function itemExists(id) {
    try {
      return typeof Item === 'undefined' || Item.exists(id)
    } catch (e) {
      return false
    }
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  function isFakePlayer(entity) {
    // AStages exempts fake players itself (EventGuards#isValidPlayer does an
    // explicit `instanceof FakePlayer`). Match that: a Create deployer or
    // block-breaker holds no stages, so without this check the guard would
    // treat legitimate automation as permanently unstaged and eat its drops.
    try {
      return entity.fake === true
    } catch (e) {
      return false
    }
  }

  function hasSilkTouch(tool) {
    if (!tool) return false
    try {
      if (tool.hasEnchantment('minecraft:silk_touch', 1)) return true
    } catch (ignored) {}
    try {
      var enchantments = tool.enchantments
      if (enchantments && String(enchantments).indexOf('silk_touch') >= 0) return true
    } catch (ignored) {}
    // Fails toward the cobbled drop. Worst case a silk-touch player gets
    // cobblestone instead of stone: cosmetic, and never a leak.
    return false
  }

  // Highest-priority row whose stage the player LACKS, mirroring AStages'
  // descending-priority ordering (ARestriction#compareTo negates
  // Integer.compare). Five ores carry two rows - mekanism uranium x2 and
  // oritech nickel x2 / platinum - where the early row disguises as stone and
  // the later row as a trace material (tuff/andesite/diorite). Collapsing
  // those to one row either leaks the ore or shows the wrong rock.
  function pickRow(rows, player) {
    var best = null
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i]
      if (hasStage(player, row.stage)) continue
      if (best === null ||
          row.priority > best.priority ||
          (row.priority === best.priority && row.replacement < best.replacement)) {
        best = row
      }
    }
    return best
  }

  function handleDrops(oreId, event) {
    var entity = event.entity
    if (!entity) return
    try {
      if (entity.player !== true) return
    } catch (e) {
      return
    }
    if (isFakePlayer(entity)) return

    var rows = oreDisguiseTable[oreId]
    if (!rows || rows.length === 0) return

    var row = pickRow(rows, entity)
    if (row === null) return // player holds every stage for this ore

    var drop = DISGUISE_DROPS[row.replacement]

    // Remove first, add second. If the removal fails we must NOT add, or the
    // player gets the disguise drop stacked on top of the real ore.
    try {
      event.removeItem('*')
    } catch (e) {
      console.error('[AoA OreGuard] failed to strip drops for ' + oreId + ': ' + e)
      return
    }

    if (!drop) {
      // Unmapped disguise: strip and warn. Fails toward "no leak", never
      // toward passing the real ore through.
      console.warn('[AoA OreGuard] no drop mapping for disguise ' + row.replacement + ' (ore ' + oreId + '); drops stripped with no replacement')
      return
    }

    var dropId = hasSilkTouch(event.tool) ? drop.silk : drop.normal
    try {
      event.addItem(Item.of(dropId))
    } catch (e) {
      console.error('[AoA OreGuard] failed to add ' + dropId + ' for ' + oreId + ': ' + e)
    }

    // Never call event.setXp(...): AStages' own BlockDropsEvent listener owns
    // the XP correction and both run at NORMAL priority, so the order between
    // them is unspecified.
    // Never call event.cancel(): BlockDropsEvent is cancellable, and cancelling
    // voids XP and hides the event from other listeners.
  }

  function makeHandler(oreId) {
    // Factory, so each listener captures its own id. Registering per-ore
    // avoids having to re-derive the block id from the event at runtime.
    return function (event) { handleDrops(oreId, event) }
  }

  // ---------------------------------------------------------------------
  // Registration + load-time census
  // ---------------------------------------------------------------------
  const oreIds = Object.keys(oreDisguiseTable)
  var rowCount = 0
  var registered = 0
  const unmappedDisguises = {}
  const missingDropItems = {}

  oreIds.forEach(function (oreId) {
    var rows = oreDisguiseTable[oreId]
    rowCount += rows.length

    rows.forEach(function (row) {
      var drop = DISGUISE_DROPS[row.replacement]
      if (!drop) {
        unmappedDisguises[row.replacement] = true
        return
      }
      if (!itemExists(drop.normal)) missingDropItems[drop.normal] = true
      if (!itemExists(drop.silk)) missingDropItems[drop.silk] = true
    })

    try {
      BlockEvents.drops(oreId, makeHandler(oreId))
      registered++
    } catch (e) {
      console.error('[AoA OreGuard] could not register drops listener for ' + oreId + ': ' + e)
    }
  })

  console.info('[AoA OreGuard] armed: ' + registered + ' listeners over ' + oreIds.length +
    ' distinct ores (' + rowCount + ' disguise rows, ' +
    Object.keys(DISGUISE_DROPS).length + ' mapped disguises)')

  const unmappedList = Object.keys(unmappedDisguises)
  if (unmappedList.length > 0) {
    console.error('[AoA OreGuard] ' + unmappedList.length + ' disguise block(s) have no drop mapping; their ores will strip to nothing: ' + unmappedList.sort().join(', '))
  }

  const missingList = Object.keys(missingDropItems)
  if (missingList.length > 0) {
    console.error('[AoA OreGuard] ' + missingList.length + ' mapped drop item(s) do not resolve: ' + missingList.sort().join(', '))
  }

  if (registered !== oreIds.length) {
    console.error('[AoA OreGuard] registration incomplete: ' + registered + ' of ' + oreIds.length + ' ores armed')
  }
})()
