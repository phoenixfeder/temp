// ============================================================================
//  IR2 Fuel Tag Unification
// ============================================================================
//
//  Purpose: Unify cross-mod fuel fluids and bucket items under common tags
//  so FTBQuests filter-tasks can match any variant with one `#c:...` reference.
//
//  Scope: LEVEL 1 — Quest logic compat only.
//    Populates the Oritech-style non-prefixed `c:<fuel>` fluid aliases that
//    Oritech recipes actually read, and creates `c:buckets/*` item tags from
//    scratch for bucket-submit quests.
//
//  REMOVED 2026-07-26 (TFMG port task P1.3): the original `c:fluids/*` block.
//    Those writes were dead. No mod in this pack ships a single
//    `data/c/tags/fluid/fluids/*` entry (checked across every jar in mods/) and
//    no recipe, quest filter or script in the repo reads a `#c:fluids/...` tag,
//    so the whole block created tags nothing could consume. The singular
//    `c:<fuel>` spine in ir2_fuel_engine_interchange.js is the live one. The
//    Oritech `c:oil` / `c:biofuel` aliases below are NOT part of that removal:
//    Oritech's refinery and fuel generator read them directly.
//
//  OUT OF SCOPE: LEVEL 2 — Runtime engine compat.
//    This script does NOT force engines to accept cross-mod fuels. If in-game
//    testing shows a CDG Diesel Engine rejects PNC diesel (or similar), the
//    fix goes in a separate script as a recipe override or mod-specific
//    compatibility patch.
//
//  Audit source: docs/rosters/IR2_Fuel_ID_Mapping.md (2026-04-24)
//  Mods covered: PneumaticCraft, Immersive Engineering (+ Oritech / TFMG adds below).
//  2026-08-25: the two legacy petroleum jars (CDG + IP) were pulled from mods/, so all
//  of this script's rows for them were deleted as dead refs; see git history.
//
//  IMPORTANT spelling notes (these are NOT typos — mods use different forms):
//    PneumaticCraft crude oil:    pneumaticcraft:oil         (not crude_oil)
//    PneumaticCraft plant oil:    pneumaticcraft:vegetable_oil
//    Immersive Engineering:       immersiveengineering:plantoil (no underscore)
//
//  VERIFY-IN-GAME notes inline below.
// ============================================================================

ServerEvents.tags('fluid', event => {

  // --- Oritech-style non-prefixed aliases (what Oritech recipes actually read) --
  // Oritech uses `c:<name>` without the `fluids/` prefix (e.g. `#c:oil` in
  // data/oritech/recipe/refinery/oilbase.json and fuelgen/crude.json,
  // `#c:biofuel` in its biodiesel refinery recipe).
  // c:oil: every crude goes here so the Oritech refinery accepts any mod's crude.
  // TFMG crude is added to c:oil in ir2_fuel_engine_interchange.js.
  event.add('c:oil', 'pneumaticcraft:oil')
  event.add('c:oil', 'oritech:still_oil')
  // c:biofuel — Oritech refinery biodiesel recipe reads this
  event.add('c:biofuel', 'pneumaticcraft:biodiesel')
  event.add('c:biofuel', 'immersiveengineering:biodiesel')
  event.add('c:biofuel', 'oritech:still_biofuel')
  // NOTE: Heavy Oil (oritech:still_heavy_oil) is an Oritech-internal
  // intermediate between crude and diesel. Not cross-mod, no tag needed.
  // Turbofuel (oritech:still_fuel) is late-tier — deferred to Gilded. No tag.
})

ServerEvents.tags('item', event => {
  // ========================================================================
  //  COKE UNIFICATION (owner-veto 2026-07-17, plan 13 §5)
  //  Inject TFMG coke into the shared c:coal_coke ITEM tag.
  // ========================================================================
  //  Jar ground truth (verified 2026-07-17): TFMG ships c:dusts/coal_coke and
  //  c:storage_blocks/coal_coke but NO base c:coal_coke membership for
  //  tfmg:coal_coke. IE ships data/c/tags/item/coal_coke.json =
  //  [immersiveengineering:coal_coke] and its blast furnace burns #c:coal_coke
  //  (data/immersiveengineering/recipe/blastfurnace/fuel_coke.json, input #c:coal_coke).
  //  Adding tfmg:coal_coke here makes IE's blast furnace accept TFMG coke, and TFMG's
  //  coke-block consumers (graphite-electrode stonecutting) already read the shared
  //  c:storage_blocks/coal_coke tag (which contains IE's coke block). One injection and
  //  either oven feeds either mod's consumers. Guarded so it is a clean no-op without
  //  the TFMG jar.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('tfmg')) {
    event.add('c:coal_coke', 'tfmg:coal_coke')
  }

  // ========================================================================
  //  c:buckets/<fuel> — bucket item tags for FTBQuests filter-tasks
  //  These do NOT exist in any mod. Creating from scratch.
  //  A quest with `item: { id: "#c:buckets/diesel" }` will match ANY
  //  cross-mod diesel bucket.
  //
  //  TFMG NOTE (2026-07-16 program; re-verified in-jar 2026-08-25 vs tfmg-1.2.2):
  //  TFMG ships its own c:buckets/* item tags in-jar (data/c/tags/item/buckets/*.json;
  //  VERIFIED diesel + gasoline), so those quest filters already match TFMG buckets --
  //  no TFMG add is needed for them. The tfmg jar ships NO c:buckets/lubricant and
  //  names its bucket lubrication_oil -- both bridged into c:buckets/lubricant below.
  //  2026-08-25: this script's former IP bucket rows were deleted as dead refs (jar
  //  pulled); see git history.
  // ========================================================================

  // --- Diesel buckets ------------------------------------------------------
  event.add('c:buckets/diesel', 'pneumaticcraft:diesel_bucket')
  event.add('c:buckets/diesel', 'oritech:still_diesel_bucket')

  // --- Gasoline buckets ----------------------------------------------------
  event.add('c:buckets/gasoline', 'pneumaticcraft:gasoline_bucket')

  // --- Crude oil buckets ---------------------------------------------------
  event.add('c:buckets/crude_oil', 'pneumaticcraft:oil_bucket')
  event.add('c:buckets/crude_oil', 'oritech:still_oil_bucket')

  // --- Ethanol buckets -----------------------------------------------------
  event.add('c:buckets/ethanol', 'pneumaticcraft:ethanol_bucket')
  event.add('c:buckets/ethanol', 'immersiveengineering:ethanol_bucket')

  // --- Biodiesel buckets (Oritech calls its variant 'biofuel' — same tag) --
  event.add('c:buckets/biodiesel', 'pneumaticcraft:biodiesel_bucket')
  event.add('c:buckets/biodiesel', 'immersiveengineering:biodiesel_bucket')
  event.add('c:buckets/biodiesel', 'oritech:still_biofuel_bucket')

  // --- Plant oil buckets (three different internal names) ------------------
  event.add('c:buckets/plantoil', 'pneumaticcraft:vegetable_oil_bucket')
  event.add('c:buckets/plantoil', 'immersiveengineering:plantoil_bucket')

  // --- LPG buckets ---------------------------------------------------------
  event.add('c:buckets/lpg', 'pneumaticcraft:lpg_bucket')

  // --- Kerosene buckets ----------------------------------------------------
  event.add('c:buckets/kerosene', 'pneumaticcraft:kerosene_bucket')

  // --- Lubricant buckets ---------------------------------------------------
  event.add('c:buckets/lubricant', 'pneumaticcraft:lubricant_bucket')
  // TFMG names its lubricant bucket 'lubrication_oil_bucket' (verified in-jar); bridge it
  // into the pack's c:buckets/lubricant quest filter. Guarded no-op without the TFMG jar.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('tfmg')) {
    event.add('c:buckets/lubricant', 'tfmg:lubrication_oil_bucket')
  }

  // --- Creosote bucket (IE only in IR2 scope — MI's creosote is IR1) ------
  event.add('c:buckets/creosote', 'immersiveengineering:creosote_bucket')

  // --- High power biodiesel bucket (IE only) -------------------------------
  event.add('c:buckets/high_power_biodiesel', 'immersiveengineering:high_power_biodiesel_bucket')

  // --- Naphtha bucket (Oritech) --------------------------------------------
  event.add('c:buckets/naphtha', 'oritech:still_naphtha_bucket')

  // --- Sulfuric acid bucket (Oritech IR byproduct; shared with Gilded G4) --
  event.add('c:buckets/sulfuric_acid', 'oritech:still_sulfuric_acid_bucket')
})
