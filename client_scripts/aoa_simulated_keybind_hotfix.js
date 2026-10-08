;(function () {
  try {
    if (
      Java.loadClass('dev.simulated_team.simulated.index.SimKeys').SCROLL_UP.getKeybind() == null ||
      Java.loadClass('dev.simulated_team.simulated.index.SimKeys').SCROLL_DOWN.getKeybind() == null
    ) {
      Java.loadClass('dev.simulated_team.simulated.index.SimKeys').registerTo(function (_keyMapping) {})
      console.info('[AoA Hotfix] Initialized Simulated keybinds before first client tick')
    }
  } catch (e) {
    console.warn('[AoA Hotfix] Simulated keybind init skipped: ' + e)
  }
})()
