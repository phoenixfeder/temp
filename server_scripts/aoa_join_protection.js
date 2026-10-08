// AoA KubeJS: aoa_join_protection.js
//
// Protects a player while their client finishes joining. Protection ends when
// real client input or an interaction proves they are active, with a five-minute
// maximum for clients that never finish loading. Protected Overworld players
// are removed from the vanilla sleep-percentage calculation.
//
// Only deliberate player action releases the guard. Passive events the player
// did not cause - mob knockback, fall damage, chunk loads settling the entity -
// must never release it, so activity is read from look direction, movement
// input, sneak, and interaction events. Position is deliberately NOT an
// activity signal: knockback and falling move the player without any input.

;(function () {
  const GameRules = Java.loadClass('net.minecraft.world.level.GameRules')

  const ARMING_TICKS = 100
  const MAX_PROTECTION_TICKS = 6000
  const LOOK_DELTA_DEGREES = 1
  const ACTIVE_FLAG = 'aoaJoinProtectionActive'
  const PREVIOUS_FLAG = 'aoaJoinProtectionWasInvulnerable'
  const SLEEP_MANAGED_FLAG = 'aoaJoinProtectionSleepManaged'
  const SLEEP_BASE_FLAG = 'aoaJoinProtectionSleepBase'
  const SLEEP_APPLIED_FLAG = 'aoaJoinProtectionSleepApplied'
  const LOG_PREFIX = '[AoA Join Protection] '

  var protectedPlayers = {}
  // Mirrors the live entry count so the per-player tick can bail in one compare
  // when nobody is protected, which is almost always the case.
  var protectedCount = 0

  function playerKey(player) {
    if (!player) return null
    try {
      if (player.uuid) return String(player.uuid)
      if (typeof player.getUUID === 'function') return String(player.getUUID())
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not read player UUID: ' + error)
    }
    return null
  }

  function playerName(player) {
    if (!player) return 'unknown player'
    try {
      if (player.username) return String(player.username)
      if (typeof player.getName === 'function') {
        var name = player.getName()
        if (name != null) return String(name.getString ? name.getString() : name)
      }
    } catch (error) {}
    return 'unknown player'
  }

  function readBoolean(data, key) {
    if (!data) return false
    try {
      if (typeof data.getBoolean === 'function') return data.getBoolean(key)
      return Boolean(data[key])
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not read persistent flag ' + key + ': ' + error)
      return false
    }
  }

  function writeBoolean(data, key, value) {
    if (!data) return
    if (typeof data.putBoolean === 'function') data.putBoolean(key, value)
    else data[key] = value
  }

  function readInt(data, key) {
    if (!data) return 0
    try {
      if (typeof data.getInt === 'function') return data.getInt(key)
      return Number(data[key]) || 0
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not read persistent value ' + key + ': ' + error)
      return 0
    }
  }

  function writeInt(data, key, value) {
    if (!data) return
    if (typeof data.putInt === 'function') data.putInt(key, value)
    else data[key] = value
  }

  function removeFlag(data, key) {
    if (!data) return
    if (typeof data.remove === 'function') data.remove(key)
    else delete data[key]
  }

  function clearSleepMarkers(data) {
    removeFlag(data, SLEEP_MANAGED_FLAG)
    removeFlag(data, SLEEP_BASE_FLAG)
    removeFlag(data, SLEEP_APPLIED_FLAG)
  }

  function isInvulnerable(player) {
    try {
      if (typeof player.isInvulnerable === 'function') return player.isInvulnerable()
      return Boolean(player.invulnerable)
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not read invulnerability for ' + playerName(player) + ': ' + error)
      return false
    }
  }

  function setInvulnerable(player, value) {
    if (!player) return false
    try {
      if (typeof player.setInvulnerable === 'function') player.setInvulnerable(value)
      else player.invulnerable = value
      return true
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not set invulnerability for ' + playerName(player) + ': ' + error)
      return false
    }
  }

  function isSpectator(player) {
    try {
      return typeof player.isSpectator === 'function' ? player.isSpectator() : false
    } catch (error) {
      return false
    }
  }

  // Rhino bean-maps Java getters onto properties, so a zero-argument getter can
  // arrive as either a function or a plain value depending on the call site.
  // Calling the property form throws TypeError. Always probe before calling.
  function playerList(holder) {
    if (!holder) return null
    if (typeof holder.players === 'function') return holder.players()
    return holder.players
  }

  function sleepContext(server) {
    if (!server) return null
    try {
      var level = server.overworld()
      var rules = level.getGameRules()
      var rule = rules.getRule(GameRules.RULE_PLAYERS_SLEEPING_PERCENTAGE)
      return { rule: rule, players: playerList(level) }
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not access Overworld sleep state: ' + error)
      return null
    }
  }

  function forEachPlayer(players, callback) {
    if (!players) return
    if (typeof players.forEach === 'function') {
      players.forEach(callback)
      return
    }
    if (typeof players.iterator === 'function') {
      var iterator = players.iterator()
      while (iterator.hasNext()) callback(iterator.next())
    }
  }

  function refreshSleepPercentage(server) {
    var context = sleepContext(server)
    if (!context) return

    var data = server.persistentData
    var current = context.rule.get()
    var managed = readBoolean(data, SLEEP_MANAGED_FLAG)
    var eligiblePlayers = 0
    var protectedEligiblePlayers = 0

    forEachPlayer(context.players, function (player) {
      if (isSpectator(player)) return
      eligiblePlayers++
      var key = playerKey(player)
      if (key && protectedPlayers[key]) protectedEligiblePlayers++
    })

    if (protectedEligiblePlayers === 0) {
      if (!managed) return

      var lastApplied = readInt(data, SLEEP_APPLIED_FLAG)
      var restoreValue = current === lastApplied ? readInt(data, SLEEP_BASE_FLAG) : current
      if (current !== restoreValue) context.rule.set(restoreValue, server)
      clearSleepMarkers(data)
      return
    }

    var basePercentage
    if (!managed) {
      basePercentage = current
      writeBoolean(data, SLEEP_MANAGED_FLAG, true)
    } else {
      var appliedPercentage = readInt(data, SLEEP_APPLIED_FLAG)
      basePercentage = current === appliedPercentage ? readInt(data, SLEEP_BASE_FLAG) : current
    }
    writeInt(data, SLEEP_BASE_FLAG, basePercentage)

    var activePlayers = eligiblePlayers - protectedEligiblePlayers
    // Vanilla requires max(1, ceil(players * percentage / 100)) sleepers.
    // Solve that formula backward so protected players do not raise the count.
    var sleepersNeeded = Math.max(1, Math.ceil(activePlayers * basePercentage / 100))
    var adjustedPercentage = eligiblePlayers > 0
      ? Math.floor(sleepersNeeded * 100 / eligiblePlayers)
      : basePercentage
    adjustedPercentage = Math.max(0, adjustedPercentage)

    if (current !== adjustedPercentage) context.rule.set(adjustedPercentage, server)
    writeInt(data, SLEEP_APPLIED_FLAG, adjustedPercentage)
  }

  function restoreManagedSleepPercentage(server) {
    var context = sleepContext(server)
    if (!context) return

    var data = server.persistentData
    if (!readBoolean(data, SLEEP_MANAGED_FLAG)) return

    var current = context.rule.get()
    var applied = readInt(data, SLEEP_APPLIED_FLAG)
    var restoreValue = current === applied ? readInt(data, SLEEP_BASE_FLAG) : current
    if (current !== restoreValue) context.rule.set(restoreValue, server)
    clearSleepMarkers(data)
  }

  function serverFor(event, player) {
    if (event && event.server) return event.server
    return player ? player.server : null
  }

  function clearPlayerGuard(player) {
    var data = player ? player.persistentData : null
    var restoreInvulnerability = readBoolean(data, PREVIOUS_FLAG)
    setInvulnerable(player, restoreInvulnerability)
    removeFlag(data, ACTIVE_FLAG)
    removeFlag(data, PREVIOUS_FLAG)
  }

  function releaseProtection(player, server, reason, notifyPlayer) {
    var key = playerKey(player)
    if (key && protectedPlayers[key]) {
      delete protectedPlayers[key]
      protectedCount--
    }
    clearPlayerGuard(player)
    refreshSleepPercentage(server)

    if (notifyPlayer && player && typeof player.tell === 'function') {
      player.tell('Join protection has ended. You are now active.')
    }
    console.info(LOG_PREFIX + 'Released ' + playerName(player) + ' (' + reason + ').')
  }

  function startProtection(player, server) {
    var key = playerKey(player)
    if (!key) {
      console.warn(LOG_PREFIX + 'Cannot protect a player without a UUID.')
      return
    }

    var data = player.persistentData
    var staleOwnedProtection = readBoolean(data, ACTIVE_FLAG)
    var previousInvulnerability = staleOwnedProtection ? false : isInvulnerable(player)

    writeBoolean(data, ACTIVE_FLAG, true)
    writeBoolean(data, PREVIOUS_FLAG, previousInvulnerability)
    protectedPlayers[key] = { ticks: 0, activitySeen: false, look: lookAngles(player) }
    protectedCount++

    if (!setInvulnerable(player, true)) {
      delete protectedPlayers[key]
      protectedCount--
      removeFlag(data, ACTIVE_FLAG)
      removeFlag(data, PREVIOUS_FLAG)
      return
    }

    refreshSleepPercentage(server)
    if (typeof player.tell === 'function') {
      player.tell('Join protection is active while the world loads. Look around, move, or interact when ready. Maximum 5 minutes.')
    }
    console.info(LOG_PREFIX + 'Protected ' + playerName(player) + ' for up to ' + MAX_PROTECTION_TICKS + ' ticks.')
  }

  function markActivity(event, player) {
    var key = playerKey(player)
    var state = key ? protectedPlayers[key] : null
    if (!state) return

    state.activitySeen = true
    if (state.ticks >= ARMING_TICKS) {
      releaseProtection(player, serverFor(event, player), 'player activity', true)
    }
  }

  // Look direction is the most reliable proof of a live client: knockback,
  // falling, and chunk loading all move a player without turning their head.
  function lookAngles(player) {
    try {
      var yaw = typeof player.getYRot === 'function' ? player.getYRot() : player.yRot
      var pitch = typeof player.getXRot === 'function' ? player.getXRot() : player.xRot
      if (yaw == null || pitch == null) return null
      yaw = Number(yaw)
      pitch = Number(pitch)
      if (isNaN(yaw) || isNaN(pitch)) return null
      return { yaw: yaw, pitch: pitch }
    } catch (error) {
      return null
    }
  }

  function hasLookInput(player, state) {
    var now = lookAngles(player)
    if (!now) return false
    if (!state.look) {
      state.look = now
      return false
    }
    // Yaw is unbounded and wraps, so compare the shortest angular distance.
    var dYaw = Math.abs(((now.yaw - state.look.yaw + 540) % 360) - 180)
    var dPitch = Math.abs(now.pitch - state.look.pitch)
    return dYaw > LOOK_DELTA_DEGREES || dPitch > LOOK_DELTA_DEGREES
  }

  function hasMovementInput(player) {
    try {
      if (Math.abs(Number(player.xxa) || 0) > 0.001) return true
      if (Math.abs(Number(player.zza) || 0) > 0.001) return true
      if (typeof player.isShiftKeyDown === 'function' && player.isShiftKeyDown()) return true
    } catch (error) {
      console.warn(LOG_PREFIX + 'Could not read movement input for ' + playerName(player) + ': ' + error)
    }
    return false
  }

  PlayerEvents.loggedIn(function (event) {
    if (!event.player) return
    startProtection(event.player, serverFor(event, event.player))
  })

  PlayerEvents.loggedOut(function (event) {
    if (!event.player) return
    var key = playerKey(event.player)
    if (key && protectedPlayers[key]) {
      releaseProtection(event.player, serverFor(event, event.player), 'logout', false)
    }
  })

  PlayerEvents.tick(function (event) {
    // Nobody is protected almost all the time. Bail before touching the player
    // so this handler costs one integer compare in the common case.
    if (protectedCount === 0) return

    var player = event.player
    if (!player) return

    try {
      if (player.level && typeof player.level.isClientSide === 'function' && player.level.isClientSide()) return
    } catch (error) {}

    var key = playerKey(player)
    if (!key) return
    var state = protectedPlayers[key]

    if (!state) {
      if (readBoolean(player.persistentData, ACTIVE_FLAG)) clearPlayerGuard(player)
      return
    }

    state.ticks++
    if (hasLookInput(player, state) || hasMovementInput(player)) state.activitySeen = true

    if (state.ticks >= MAX_PROTECTION_TICKS) {
      releaseProtection(player, player.server, 'five-minute timeout', true)
    } else if (state.ticks >= ARMING_TICKS && state.activitySeen) {
      releaseProtection(player, player.server, 'player input', true)
    }
  })

  BlockEvents.rightClicked(function (event) { markActivity(event, event.player) })
  BlockEvents.leftClicked(function (event) { markActivity(event, event.player) })
  ItemEvents.rightClicked(function (event) { markActivity(event, event.player) })
  ItemEvents.entityInteracted(function (event) { markActivity(event, event.player) })
  ItemEvents.firstLeftClicked(function (event) { markActivity(event, event.player) })

  EntityEvents.beforeHurt(function (event) {
    var attacker = event.source ? event.source.player : null
    if (attacker) markActivity(event, attacker)
  })

  // There is deliberately no ServerEvents.tick handler here. The sleep
  // percentage only changes when the protected set changes, and both
  // startProtection and releaseProtection already refresh it. Polling it every
  // tick recomputed an identical value 20 times a second.

  ServerEvents.loaded(function (event) {
    restoreManagedSleepPercentage(event.server)
    protectedPlayers = {}
    protectedCount = 0

    forEachPlayer(playerList(event.server), function (player) {
      if (readBoolean(player.persistentData, ACTIVE_FLAG)) clearPlayerGuard(player)
    })
  })
})()
