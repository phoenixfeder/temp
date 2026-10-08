// AoA KubeJS: aoa_goety_weaves.js
// Goety Dark-Arts Integration (Task 3) -- cross-mod weave recipes stitching the
// Goety necromancy ladder to Malum's spirit machines and Neo Vitae's blood forge.
// ADDITIVE ONLY. This file removes and modifies NOTHING. Every output keeps its
// native route; each recipe below is an extra cross-mod path.
//
// Every recipe type string and item id was pulled from the owning jar and matched
// against a STOCK recipe of the same type (schema templates recorded in
// .superpowers/sdd/goety-task-3-report.md, 2026-07-23):
//   goety:cursed_infuser_recipes  (single-ingredient burner: ingredient/result/cookingTime)
//   goety:ritual                  (ritual_type/craftType/soulCost/duration/ingredients/result; research optional)
//   malum:spirit_infusion         (Spirit Altar: input/extraInputs[]/spirits[]/result)
//   malum:spirit_focusing         (Spirit Crucible: input/spirits[]/result/durabilityCost/time)
//   neovitae:hellfire_forge       (inputs[] max 4, no per-input count/drain/minDrain/output)
//
// Age placement (from aoa_astages_01r_goety.js + Malum/NV native gates). Every weave
// sits at or AFTER the native route of its output, so none is an early bypass:
//   W2 ectoplasm             Renaissance (goety altar economy)
//   W3 crushed_soulstone     Malum ore chain (cursed_infuser is Medieval-entry)
//   W4 ectoplasmic_residue   Gilded  (needs goety:unholy_blood, gilded-gated)
//   W5 soul_emerald          Renaissance (blood_orb_weak + magic_emerald + ghast_tear)
//   W6 rotting_essence       Renaissance (malum spirit altar)
//   W7 soul_stained_steel    Industrial (needs goety:dark_ingot, IR-gated) ALTERNATE
//   W9 blood_orb_archmage    Gilded  (needs goety:philosophers_stone, IR + master orb) ALTERNATE
//   W10 death_scythe         Atomic+ (blood_orb_transcendent is atomic-gated in 01m_magic) ALTERNATE
//   totem recycle            Renaissance (cursed_infuser)

ServerEvents.recipes(event => {

  // -- W2 -- Ectoplasm from grave-talc lattice (Malum -> Goety) ----------------
  // Shaped bench route giving Malum players a Goety-side ectoplasm source. Bone
  // frames the four edges, Malum grim talc at the corners, Goety grave dust at the
  // core. ADDITIVE: ectoplasm keeps its native goety sources.
  event.shaped('goety:ectoplasm', [
    'TbT',
    'bdb',
    'TbT'
  ], {
    T: 'malum:grim_talc',
    b: 'minecraft:bone',
    d: 'goety:grave_dust'
  }).id('aoa:goety/ectoplasm_from_grim_talc')

  // -- W3 -- Cursed-infused soulstone crush (Malum -> Goety machine) -----------
  // Raw soulstone crushed in the Cursed Infuser instead of a Malum spirit crucible.
  // NOTE: the cursed_infuser serializer is single-ingredient with no proven result
  // count in any of its 32 stock recipes; count:2 is requested but runtime-unverified
  // (worst case yields 1, which is harmless and non-blocking). See report.
  event.custom({
    type: 'goety:cursed_infuser_recipes',
    ingredient: { item: 'malum:raw_soulstone' },
    result: { id: 'malum:crushed_soulstone', count: 2 },
    cookingTime: 60
  }).id('aoa:goety/crushed_soulstone_from_raw')

  // -- W4 -- Ectoplasmic residue in the Hellfire Forge (Goety -> Neo Vitae) ----
  // Unholy blood plus twin ectoplasm plus a sacrificed petty spiritus gem forge into
  // a stack of ectoplasmic residue. Exactly four inputs (the forge cap). unholy_blood
  // is gilded-gated, so this alternate is a gilded-tier route to a basic NV reagent.
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { item: 'goety:unholy_blood' },
      { item: 'goety:ectoplasm' },
      { item: 'goety:ectoplasm' },
      { item: 'neovitae:spiritus_gem_petty' }
    ],
    drain: 20.0,
    minDrain: 400.0,
    output: { count: 4, id: 'neovitae:ectoplasmic_residue' }
  }).id('aoa:goety/ectoplasmic_residue_from_unholy_blood')

  // -- W5 -- Soul emerald ritual (Neo Vitae -> Goety altar) --------------------
  // Magic-craft ritual binding a weak blood orb, twin magic emeralds and a ghast
  // tear into a soul emerald. soulCost 5 matches the philosophers_stone magic craft
  // and clears the stock soul_emerald bench route (a crafting_shaped recipe with an
  // effective soulCost of 0). ADDITIVE: the bench route is untouched.
  event.custom({
    type: 'goety:ritual',
    ritual_type: 'goety:craft',
    activation_item: { item: 'goety:empty_focus' },
    craftType: 'magic',
    soulCost: 5,
    duration: 10,
    ingredients: [
      { item: 'neovitae:blood_orb_weak' },
      { item: 'goety:magic_emerald' },
      { item: 'goety:magic_emerald' },
      { item: 'minecraft:ghast_tear' }
    ],
    result: { id: 'goety:soul_emerald', count: 1 }
  }).id('aoa:goety/soul_emerald_from_blood_orb_ritual')

  // -- W6 -- Rotting essence on the Spirit Altar (Goety -> Malum) --------------
  // Ectoplasm as the central charge, hex ash on a pedestal, four wicked spirits drawn
  // in, yielding two rotting essence. The '4x wicked spirit' maps to the altar spirit
  // type token malum:wicked (count 4), the proven spirit-array format.
  event.custom({
    type: 'malum:spirit_infusion',
    input: { count: 1, item: 'goety:ectoplasm' },
    extraInputs: [
      { count: 1, item: 'malum:hex_ash' }
    ],
    spirits: [
      { type: 'malum:wicked', count: 4 }
    ],
    result: { count: 2, id: 'malum:rotting_essence' }
  }).id('aoa:goety/rotting_essence_from_ectoplasm')

  // -- W7 -- Soul-stained steel in the Spirit Crucible (Goety -> Malum) --------
  // ALTERNATE route to soul-stained steel: a Goety dark ingot focused with the rarest
  // Malum spirit (eldritch). This is a DIFFERENT machine than Malum's native
  // spirit_infusion route (iron ingot + refined soulstone), so nothing is removed and
  // there is no conflict. dark_ingot is IR-gated, so this alternate lands later than
  // the native Renaissance route and cannot be an early bypass.
  event.custom({
    type: 'malum:spirit_focusing',
    durabilityCost: 1,
    input: { item: 'goety:dark_ingot' },
    spirits: [
      { type: 'malum:eldritch', count: 4 }
    ],
    result: { count: 1, id: 'malum:soul_stained_steel_ingot' },
    time: 300
  }).id('aoa:goety/soul_stained_steel_from_dark_ingot')

  // -- W9 -- Archmage blood orb in the Hellfire Forge (Goety -> Neo Vitae) -----
  // ALTERNATE archmage-orb route: a philosophers stone, a master blood orb and twin
  // soul emeralds. Four inputs (the forge cap). NV's native ara_vitae archmage route
  // is untouched; this is a Goety-flavored premium path. High drain to match the tier.
  event.custom({
    type: 'neovitae:hellfire_forge',
    inputs: [
      { item: 'goety:philosophers_stone' },
      { item: 'neovitae:blood_orb_master' },
      { item: 'goety:soul_emerald' },
      { item: 'goety:soul_emerald' }
    ],
    drain: 80.0,
    minDrain: 800.0,
    output: { count: 1, id: 'neovitae:blood_orb_archmage' }
  }).id('aoa:goety/blood_orb_archmage_from_philosophers_stone')

  // -- W10 -- Death scythe forbidden ritual (tri-mod capstone) -----------------
  // ALTERNATE apex route to the death scythe. Necroturgy craft gated behind the real
  // 'forbidden' research key (used by heart_of_the_night / nameless_crown), fed by a
  // necro crown, twin soul-stained steel ingots, a transcendent blood orb and a
  // forbidden fragment. soulCost 25 is the high stock ritual tier. The transcendent
  // orb is the latest gate (atomic-locked NV apex), so this sits at atomic or later and cannot bypass.
  // NV blood_orb_transcendent is registration-verified (stock ara_vitae recipe +
  // advancement + blood_orb_stats data map + NVItems class); flagged runtime-verify.
  // ADDITIVE: goety's native death_scythe necroturgy route (dark_metal_scythe) stays.
  event.custom({
    type: 'goety:ritual',
    ritual_type: 'goety:craft',
    activation_item: { item: 'goety:soul_emerald' },
    craftType: 'necroturgy',
    research: 'forbidden',
    soulCost: 25,
    duration: 10,
    ingredients: [
      { item: 'goety:necro_crown' },
      { item: 'malum:soul_stained_steel_ingot' },
      { item: 'malum:soul_stained_steel_ingot' },
      { item: 'neovitae:blood_orb_transcendent' },
      { item: 'goety:forbidden_fragment' }
    ],
    result: { id: 'goety:death_scythe', count: 1 }
  }).id('aoa:goety/death_scythe_forbidden_ritual')

  // -- Spent-totem recycling (Goety) ------------------------------------------
  // A spent totem re-infused in the Cursed Infuser back into a totem of undying.
  // MACHINE-FAITHFUL to the brief (goety:cursed_infuser_recipes). LIMITATION: the
  // cursed_infuser is a single-ingredient burner (32/32 stock recipes; no second slot),
  // so the brief's '+4x goety:ectoplasm' cost CANNOT be attached in this schema. A long
  // cookingTime (540) is the only available throttle. Supply is self-limiting: a spent
  // totem only exists after a totem has saved the player. If the owner wants the
  // ectoplasm cost gate enforced, this must move to a goety:ritual (multi-ingredient);
  // that alternative is spelled out in the task report.
  event.custom({
    type: 'goety:cursed_infuser_recipes',
    ingredient: { item: 'goety:spent_totem' },
    result: { id: 'minecraft:totem_of_undying' },
    cookingTime: 540
  }).id('aoa:goety/totem_recycle_from_spent')

})
