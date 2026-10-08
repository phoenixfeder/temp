// AOA STAGE FEEDBACK — NON-AUTHORITY ONLY
// This script reacts to confirmed stage grants with cosmetic visual/audio/chat feedback only.

;(function () {
  if (typeof AStageEvents === 'undefined') return

  function jsonText(text, color, bold) {
    return JSON.stringify({
      text: text,
      color: color || 'gold',
      bold: !!bold
    })
  }

  function playerTarget(player) {
    const name = String(player.username || '')
    if (!/^[A-Za-z0-9_]{1,16}$/.test(name)) return null
    return '@a[name="' + name + '"]'
  }

  function runCommand(server, command) {
    if (server && typeof server.runCommandSilent === 'function') {
      server.runCommandSilent(command)
    }
  }

  function sendNarration(server, target, message) {
    runCommand(server, 'tellraw ' + target + ' ' + jsonText(message, 'gray', false))
  }

  function sendFeedback(event, title, messages, sound) {
    const player = event.player
    if (!player) return

    const server = player.server
    const target = playerTarget(player)
    if (!server || !target) return

    runCommand(server, 'title ' + target + ' title ' + jsonText(title, 'gold', true))
    runCommand(server, 'playsound ' + sound + ' master ' + target + ' ~ ~ ~ 1 1')

    if (typeof server.scheduleInTicks === 'function') {
      messages.forEach(function (message, index) {
        server.scheduleInTicks(index * 40, function () {
          sendNarration(server, target, message)
        })
      })
    } else {
      // No scheduler is available on this server object, so narration is delivered immediately.
      messages.forEach(function (message) {
        sendNarration(server, target, message)
      })
    }
  }

  AStageEvents.added('medieval_times', function (event) {
    sendFeedback(event, 'The Medieval Age begins.', [
      'Iron sings under your hammer.',
      'The wilderness yields to those who endure.',
      'New tools await the patient smith.'
    ], 'minecraft:block.anvil.land')
  })

  AStageEvents.added('the_renaissance', function (event) {
    sendFeedback(event, 'The Renaissance dawns.', [
      'New ores glimmer in stone you once thought barren.',
      'Ancient mechanisms across the world hum to life.',
      'Creatures previously unseen now stalk the wilds.',
      'The age of discovery has begun.'
    ], 'minecraft:block.beacon.activate')
  })

  AStageEvents.added('industrial_revolution', function (event) {
    sendFeedback(event, 'The Industrial Revolution begins.', [
      "The earth reveals deeper riches.",
      "Machines you once couldn't fathom now respond to your touch.",
      'Smoke and progress fill the horizon.'
    ], 'minecraft:block.anvil.land')
  })

  AStageEvents.added('gilded_age', function (event) {
    sendFeedback(event, 'The Gilded Age arrives.', [
      'Precision and wealth define this new era.',
      'Networks of power and logic connect your empire.',
      "The ocean's secrets begin to surface."
    ], 'minecraft:entity.lightning_bolt.thunder')
  })

  AStageEvents.added('atomic', function (event) {
    sendFeedback(event, 'The Atomic Age has arrived.', [
      'Radiation hums beneath the surface.',
      'The containment protocols you trained for are now active.',
      "The world's deepest horrors stir at your advancement.",
      'Handle this power carefully.'
    ], 'minecraft:entity.wither.spawn')
  })

  AStageEvents.added('otherworldly', function (event) {
    sendFeedback(event, 'You step beyond the veil.', [
      'The cosmos opens before you.',
      'Dimensions previously sealed now respond to your presence.',
      'Reality bends. Proceed with conviction.'
    ], 'minecraft:entity.ender_dragon.growl')
  })

  AStageEvents.added('ascension', function (event) {
    sendFeedback(event, 'Ascension.', [
      'Every age has led to this.',
      'The archive awaits your final proof.',
      'Become what the world needs you to be.'
    ], 'minecraft:ui.toast.challenge_complete')
  })
})()
