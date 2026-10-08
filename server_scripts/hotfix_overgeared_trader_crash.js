// AoA restore: Overgeared fixed the old wandering-trader blueprint crash.
// Keep this tiny restorative pass so worlds touched by the old hotfix get
// normal trader spawning back; do not kill or cancel trader entities anymore.

ServerEvents.loaded(event => {
  event.server.runCommandSilent('gamerule doTraderSpawning true')
})
