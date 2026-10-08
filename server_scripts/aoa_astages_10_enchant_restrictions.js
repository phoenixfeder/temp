// AOA ENCHANTMENT LITERACY — AStages enchantment restrictions only.
;(function () {
  if (typeof AStages === 'undefined') return
  // Disabled until AStages exposes a 1.21-safe KubeJS hook for dynamic enchantment registries.
  return

  const ACompareCondition = Java.loadClass('com.alessandro.astages.api.constant.ACompareCondition')
  const GREAT_EQUAL = ACompareCondition.GREAT_EQUAL

  function addEnchantCap(stage, enchantment, level, stageKey) {
    const name = enchantment.split(':')[1]
    AStages.addRestrictionForEnchant(
      'aoa/enchant/' + name + '_lv' + level + '_pre_' + stageKey,
      stage,
      enchantment,
      GREAT_EQUAL,
      level
    ).allowInventoryStorage()
  }

  ;[
    ['minecraft:fortune', 3],
    ['minecraft:sharpness', 5],
    ['minecraft:efficiency', 5],
    ['minecraft:protection', 4],
    ['minecraft:power', 5],
    ['minecraft:unbreaking', 3]
  ].forEach(function (entry) {
    addEnchantCap('the_renaissance', entry[0], entry[1], 'the_renaissance')
  })

  ;[
    ['minecraft:looting', 3],
    ['minecraft:silk_touch', 1],
    ['minecraft:thorns', 3]
  ].forEach(function (entry) {
    addEnchantCap('industrial_revolution', entry[0], entry[1], 'industrial_revolution')
  })

  // NEEDS_VERIFICATION: Do not add pre-Gilded super-enchant caps until local
  // Apotheosis/Apothic over-vanilla enchantment behavior is runtime verified.
})()
