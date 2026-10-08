// AoA KubeJS: aoa_empty_server_pause.js
// NeoForge 1.21.1 / KubeJS 2101.7.2-build.363
//
// Purpose: Freeze the server (vanilla `/tick freeze`) when no players are
// online so Ecliptic Seasons, world time, weather, machines, and random ticks
// stop advancing while nobody is connected. Unfreeze automatically when a
// real player logs in. Console can always run `/tick unfreeze` as an override.
//
// API surface validated against KubeJS 2101.7.2 docs and existing pack scripts
// (welcome_message.js and the retired stage bootstrap boundary):
//   ServerEvents.loaded, ServerEvents.tick                        - confirmed
//   PlayerEvents.loggedIn, PlayerEvents.loggedOut                  - confirmed
//   event.server.runCommandSilent('cmd without slash')             - confirmed
//   event.server.players (KubeJS bean for getPlayerList.getPlayers) - confirmed
//   player.username                                                - confirmed
//
// Limitations documented inline below: see (a) login-while-frozen, (b) fake
// players, (c) script reload race.

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------

const ENABLE_EMPTY_SERVER_PAUSE = true
const EMPTY_GRACE_TICKS         = 20     // 1 second at 20 TPS
const STARTUP_GRACE_TICKS       = 100    // 5 second post-load grace before freeze logic engages
const LOG_DEBUG                 = false

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let aoaEmptyTicks       = 0
let aoaFrozenByScript   = false
let aoaHasLoggedLoad    = false
let aoaStartupTicks     = 0
let aoaPlayerCountWarningLogged = false
let aoaPauseDisabledByError     = false

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function aoaLog(message) {
  console.info('[AoA Empty Server Pause] ' + message)
}

function aoaDebug(message) {
  if (LOG_DEBUG) console.info('[AoA Empty Server Pause DEBUG] ' + message)
}

function aoaWarn(message) {
  console.warn('[AoA Empty Server Pause] ' + message)
}

// ---------------------------------------------------------------------------
// Command helper - falls back through several KubeJS API shapes defensively
// ---------------------------------------------------------------------------

function aoaRunCommand(server, command) {
  if (!server) {
    aoaWarn('No server reference; cannot run "' + command + '".')
    return false
  }
  try {
    if (typeof server.runCommandSilent === 'function') {
      server.runCommandSilent(command)
      return true
    }
    if (typeof server.runCommand === 'function') {
      server.runCommand(command)
      return true
    }
    aoaWarn('Server has no runCommandSilent/runCommand; cannot run "' + command + '".')
    return false
  } catch (err) {
    aoaWarn('Failed to run command "' + command + '": ' + err)
    return false
  }
}

// ---------------------------------------------------------------------------
// Player count - defensive across KubeJS bean / playerList shapes
// Returns -1 on hard failure (caller should treat as "unknown, do nothing").
// ---------------------------------------------------------------------------

function aoaCollectionSize(value) {
  if (value == null) return null
  try {
    if (typeof value.size === 'function') return value.size()
    if (typeof value.size === 'number')   return value.size
    if (typeof value.length === 'number') return value.length
  } catch (err) {
    return null
  }
  return null
}

function aoaGetOnlinePlayerCount(server) {
  if (!server) return -1

  // Path 1: KubeJS bean - server.players (== server.getPlayers())
  try {
    const n = aoaCollectionSize(server.players)
    if (n != null) return n
  } catch (err) {
    aoaDebug('server.players failed: ' + err)
  }

  // Path 2: server.playerList.players (raw List<ServerPlayer>)
  try {
    if (server.playerList && server.playerList.players) {
      const n = aoaCollectionSize(server.playerList.players)
      if (n != null) return n
    }
  } catch (err) {
    aoaDebug('server.playerList.players failed: ' + err)
  }

  // Path 3: server.playerList.playerCount (int field)
  try {
    if (server.playerList && typeof server.playerList.playerCount === 'number') {
      return server.playerList.playerCount
    }
  } catch (err) {
    aoaDebug('server.playerList.playerCount failed: ' + err)
  }

  if (!aoaPlayerCountWarningLogged) {
    aoaWarn('Could not determine online player count via any known path. ' +
            'Empty-server pause disabled until a working path is found.')
    aoaPlayerCountWarningLogged = true
  }
  return -1
}

// ---------------------------------------------------------------------------
// Freeze / Unfreeze
// ---------------------------------------------------------------------------

function aoaFreezeServer(server) {
  if (!ENABLE_EMPTY_SERVER_PAUSE) return
  if (aoaFrozenByScript) return

  if (aoaRunCommand(server, 'tick freeze')) {
    aoaFrozenByScript = true
    aoaLog('Server tick frozen (no players online for ' +
           (EMPTY_GRACE_TICKS / 20) + 's).')
  }
}

function aoaUnfreezeServer(server, reason) {
  // Reset empty timer regardless - any unfreeze means we're "active again"
  aoaEmptyTicks = 0

  // Always send unfreeze on a join, even when we don't believe we froze it.
  // This handles the case where `/tick freeze` was issued manually by an
  // admin and a player joins - we want them to be able to play.
  if (aoaRunCommand(server, 'tick unfreeze')) {
    if (aoaFrozenByScript) {
      aoaLog('Server tick unfrozen (' + reason + ').')
    } else {
      aoaDebug('Unfreeze sent (' + reason + '); script did not believe we were frozen.')
    }
    aoaFrozenByScript = false
  }
}

// ---------------------------------------------------------------------------
// Player name helper
// ---------------------------------------------------------------------------

function aoaPlayerName(player) {
  if (!player) return 'unknown player'
  try {
    if (player.username)            return String(player.username)
    if (typeof player.getName === 'function') {
      const n = player.getName()
      if (n != null) return String(n.getString ? n.getString() : n)
    }
    if (player.name)                return String(player.name)
  } catch (err) {}
  return 'unknown player'
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

ServerEvents.loaded(event => {
  // Reset state every time scripts (re)load. We do NOT freeze on load -
  // wait STARTUP_GRACE_TICKS, then the tick loop will freeze if empty.
  aoaEmptyTicks      = 0
  aoaFrozenByScript  = false
  aoaStartupTicks    = 0
  aoaPlayerCountWarningLogged = false
  aoaPauseDisabledByError = false

  if (!aoaHasLoggedLoad) {
    aoaHasLoggedLoad = true
    aoaLog('Loaded. Empty-server pause enabled=' + ENABLE_EMPTY_SERVER_PAUSE +
           ', graceTicks=' + EMPTY_GRACE_TICKS +
           ' (~' + (EMPTY_GRACE_TICKS / 20) + 's), startupGraceTicks=' +
           STARTUP_GRACE_TICKS + '.')
  }
})

PlayerEvents.loggedIn(event => {
  const loginName = aoaPlayerName(event.player)
  // event.server is the KubeJS bean; event.player.server is the fallback.
  const loginServer = (event.server) ? event.server :
                      (event.player ? event.player.server : null)
  aoaUnfreezeServer(loginServer, 'player joined: ' + loginName)
  aoaLog('Player joined: ' + loginName)
})

PlayerEvents.loggedOut(event => {
  const logoutName = aoaPlayerName(event.player)
  aoaLog('Player left: ' + logoutName + '. Pause will engage in ~' +
         (EMPTY_GRACE_TICKS / 20) + 's if nobody else is online.')
  // Don't freeze instantly - the tick handler will do it after the grace period.
})

function aoaHandleEmptyServerPauseTick(event) {
  var pauseServer = event.server
  if (!pauseServer) return

  // Startup grace - never freeze in the first few seconds after load.
  if (aoaStartupTicks < STARTUP_GRACE_TICKS) {
    aoaStartupTicks++
    return
  }

  var onlinePlayers = aoaGetOnlinePlayerCount(pauseServer)

  // Hard failure path - couldn't read player count. Do nothing this tick;
  // the warning was already logged once.
  if (onlinePlayers < 0) return

  if (onlinePlayers > 0) {
    if (aoaFrozenByScript) {
      aoaUnfreezeServer(pauseServer, 'players online: ' + onlinePlayers)
    } else {
      aoaEmptyTicks = 0
    }
    return
  }

  // onlinePlayers === 0 from here.
  aoaEmptyTicks++

  // Use >= (not ===) so we still freeze if EMPTY_GRACE_TICKS is briefly
  // skipped over by tick scheduling. aoaFreezeServer is idempotent via
  // aoaFrozenByScript so this can't spam the freeze command.
  if (aoaEmptyTicks >= EMPTY_GRACE_TICKS && !aoaFrozenByScript) {
    aoaFreezeServer(pauseServer)
  }
}

ServerEvents.tick(event => {
  if (!ENABLE_EMPTY_SERVER_PAUSE || aoaPauseDisabledByError) return

  try {
    aoaHandleEmptyServerPauseTick(event)
  } catch (err) {
    aoaPauseDisabledByError = true
    aoaWarn('Tick handler error; empty-server pause disabled until scripts reload: ' + err)
  }
})
