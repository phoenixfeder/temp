;(function () {
  var disabled = false

  function disableUpdateChecker(source) {
    var Config = Java.loadClass('xxrexraptorxx.allthecompatibility.utils.Config')
    if (Config.UPDATE_CHECKER != null) {
      Config.UPDATE_CHECKER = null
      if (!disabled) {
        console.info('[AoA Hotfix] Disabled AllTheCompatibility update checker via ' + source)
      }
      disabled = true
    }
  }

  try {
    disableUpdateChecker('client script load')

    var EventPriority = Java.loadClass('net.neoforged.bus.api.EventPriority')
    var ClientTickPre = Java.loadClass('net.neoforged.neoforge.client.event.ClientTickEvent$Pre')

    NativeEvents.onEvent(EventPriority.HIGHEST, ClientTickPre, function (_event) {
      disableUpdateChecker('high-priority client tick guard')
    })
  } catch (e) {
    console.warn('[AoA Hotfix] AllTheCompatibility update checker guard skipped: ' + e)
  }
})()
