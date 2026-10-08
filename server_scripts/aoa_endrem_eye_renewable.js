// AoA KubeJS: aoa_endrem_eye_renewable.js
// Theme: RENEWABLE recovery route for EndRem portal eyes that remain obtainable.
//
// Problem this solves:
//   endrem_eye_strip.js removes the loot/mob/structure sources for portal eyes
//   so the End is quest-gated. Each tracked eye is then granted exactly ONCE by a
//   quest reward: 7 of the 10 come from Renaissance chapter rewards, while
//   corrupted_eye (g5), magical_eye (ow4), and lost_eye (ow6) arrive as rewards
//   in later ages. The renewable crafts below cover all 10 regardless of which
//   age hands out the one-time copy. Because the End portal physically consumes
//   eyes when placed (and endrem.json EYE_BREAK_PROBABILITY=10 can destroy one),
//   a player who loses a single eye before opening the portal has NO second
//   source -> permanent End softlock.
//
// Fix: a controlled, RENEWABLE craft for each obtainable portal eye tracked by
//   the End quest batch (10 eyes). Evil and Cryptic stay disabled in
//   endrem.json (IS_*_OBTAINABLE: false) and are not renewable here. The portal
//   still needs 12 frames; remaining frames use recovery/exotic/witch/guardian
//   routes outside this list.
//   Base ingredient is minecraft:ender_eye. An ender eye needs blaze powder, and
//   the Nether is hard-gated at the_renaissance (aoa_astages_03_dimension_restrictions.js).
//   So every recipe below is naturally Renaissance-gated and cannot be crafted
//   early -- no progression bypass. The realm chapter PROOFS (ren_*_complete) still
//   gate the capstone independently; these recipes only let a player recover a
//   lost portal key. This matches endrem_eye_strip.js's "verified controlled routes".
//
// Pattern (vertical sandwich): 2x theme material + 1 ender eye -> 1 eye.
//   D
//   E
//   D

ServerEvents.recipes(event => {
  // [ endrem eye output, theme/differentiator ingredient ]
  const PORTAL_EYES = [
    ['endrem:magical_eye',   'minecraft:amethyst_shard'],
    ['endrem:nether_eye',    'minecraft:blaze_powder'],
    ['endrem:corrupted_eye', 'minecraft:sculk'],
    ['endrem:cursed_eye',    'minecraft:magma_cream'],
    ['endrem:cold_eye',      'minecraft:blue_ice'],
    ['endrem:lost_eye',      'minecraft:echo_shard'],
    ['endrem:undead_eye',    'minecraft:rotten_flesh'],
    ['endrem:old_eye',       'minecraft:bone_block'],
    ['endrem:black_eye',     'minecraft:ink_sac'],
    ['endrem:rogue_eye',     'minecraft:emerald']
  ]

  PORTAL_EYES.forEach(entry => {
    const out = entry[0]
    const mat = entry[1]
    const slug = out.substring(out.indexOf(':') + 1)
    event.shaped(out, ['D', 'E', 'D'], {
      D: mat,
      E: 'minecraft:ender_eye'
    }).id('aoa:endrem_eye_renewable/' + slug)
  })
})
