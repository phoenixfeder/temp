const WELCOME_FLAG = 'aoa_welcome_message_shown'
const WELCOME_MESSAGE = 'Welcome to Ascension of Ages! For the best starting advice, you should think like you\'re in the real world. Open your quests for a vague guide on how to survive your first nights. Ores, tools, and other items above stone tier will be locked until you get your first copper pickaxe, and you won\'t be able to do that if you can\'t survive the cold, the fact that smoke inhalation will poison you, and quickly getting food. Good luck!'

PlayerEvents.loggedIn(event => {
  const player = event.player
  if (player.persistentData.getBoolean(WELCOME_FLAG)) return

  player.persistentData.putBoolean(WELCOME_FLAG, true)
  event.server.scheduleInTicks(20, () => {
    player.tell(Text.aqua(WELCOME_MESSAGE))
  })
})
