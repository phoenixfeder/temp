// ============================================================================
//  IR2 Fuel ENGINE/REFINERY Interchange  (LEVEL 2 — runtime compat)
// ============================================================================
//
//  Goal (user 2026-06-05): "the oil mods should be used interchangeably with
//  one owner." Build ONE petroleum spine — any mod's crude feeds any mod's
//  refinery; any mod's diesel/fuel burns in any mod's engine. Owner of the
//  crude = TFMG since 2026-07-16 (it was Immersive Petroleum when this file was
//  written; IP is retired from the spine, see aoa_oil_single_source.js).
//
//  This is the LEVEL 2 work that ir2_fuel_tag_unification.js explicitly left
//  out of scope. It writes to the LIVE, machine-read tags.
//
//  ── CRITICAL FINDING (verified 2026-06-05) ──────────────────────────────
//  Every petroleum machine in the pack reads the SINGULAR common tags
//  (`c:diesel`, `c:crude_oil`, ...). There are ZERO references anywhere to the
//  PLURAL `c:fluids/diesel` form that ir2_fuel_tag_unification.js used to
//  populate, so those Level-1 fluid lines were DEAD (read by nothing) and were
//  deleted from that file on 2026-07-26. The live fix is to add the missing
//  members to the SINGULAR tags, which is what this file does. (ir2's
//  `c:buckets/*` item tags and its `c:oil`/`c:biofuel` adds ARE live and remain.)
//
//  Singular-tag membership record (jar-verified; updated 2026-08-25 after BOTH legacy
//  petroleum jars were pulled from mods/):
//    c:crude_oil  = chemicalscience, modern_industrialization (VERIFIED-JAR MI-2.5.6),
//                   pneumaticcraft natives (+ tfmg:crude_oil shipped in-jar,
//                   VERIFIED-JAR tfmg-1.2.2)
//    c:diesel     = chemicalscience, modern_industrialization (VERIFIED-JAR MI-2.5.6),
//                   oritech (VERIFIED-JAR oritech-1.2.10), pneumaticcraft natives
//                   (+ tfmg:diesel in-jar, VERIFIED-JAR tfmg-1.2.2)
//  This file originally closed crude/diesel gaps between the OWNER (TFMG since
//  2026-07-16) and the two legacy pumpjack mods; with both jars gone, their fraction
//  rows and the reverse-direction neoforge:* blocks below were deleted here on
//  2026-08-25 as dead weight. No fluid/fuel-tag is AStages-locked (gating stays on
//  the machines), so widening these tags cannot bypass progression.
//
//  Consumers that light up automatically once the tags are populated (verified
//  additive, tag-fed): IE diesel_generator (generator_fuel reads c:diesel @322),
//  PneumaticCraft fuel_quality (reads c:diesel/gasoline/kerosene/lpg/biodiesel),
//  PneumaticCraft refinery + ChemSci fractionating_column (read c:crude_oil),
//  Oritech refinery (reads #c:oil — handled by ir2).
//
//  CONSTRAINT (2026-07-26, oil gaps iii + iv): two mods ship a fuel under a spelling
//  nobody else uses (ChemicalScience c:naphta, Modern Industrialization c:plant_oil).
//  Both are bridged at the END of the fluid handler below by MEMBER addition in both
//  directions — never by nesting one tag inside the other, which is the cycle shape that
//  can make TagLoader drop both keys.
// ============================================================================

ServerEvents.tags('fluid', event => {
  // ---- CRUDE OIL: one barrel, every refinery -------------------------------
  // TFMG (Create: The Factory Must Grow) is the crude OWNER as of 2026-07-16 and ships its
  // own SINGULAR c: fluid-tag memberships in-jar (c:crude_oil / c:diesel / c:naphtha /
  // c:gasoline / c:kerosene / c:lpg / c:heavy_oil all contain the tfmg: fluid + its flowing
  // form, verified 2026-07-17), so the singular c:-tag spine picks TFMG fluids up
  // automatically -- no add needed for those. The ONE membership TFMG does NOT ship is
  // Oritech's non-prefixed c:oil alias; add TFMG crude there so the Oritech refinery
  // (reads #c:oil) accepts it. Guarded on the TFMG jar in the same idiom as
  // ir2_fuel_tag_unification.js so the line is a clean no-op without it.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('tfmg')) {
    event.add('c:oil', 'tfmg:crude_oil')
  }
  // Bring Oritech still_oil into the c: spine (TFMG-fed via aoa_oil_single_source).
  event.add('c:crude_oil', 'oritech:still_oil')
  // 2026-08-25: deleted the former IP crudeoil row and the whole neoforge:crude_oil
  // reverse block -- both served only the pulled IP jar's machines (its distillation
  // tower / hydrotreater read neoforge:crude_oil); see git history.

  // ---- DIESEL: one fuel, every engine --------------------------------------
  // Fully populated without any add: tfmg:diesel ships in-jar c:diesel membership
  // (VERIFIED-JAR tfmg-1.2.2), and the chemicalscience / modern_industrialization /
  // oritech / pneumaticcraft diesels carry their own jar tags. 2026-08-25: the former
  // IP diesel rows and the neoforge:diesel reverse block served only the pulled IP
  // jar's gas generator and were deleted; see git history.

  // ---- GASOLINE / KEROSENE / LPG / NAPHTHA / LUBRICANT ----------------------
  // The OWNER's fractions need no add: TFMG ships its own c:gasoline / c:kerosene /
  // c:lpg / c:naphtha memberships in-jar (all VERIFIED-JAR tfmg-1.2.2). Kept
  // fuel-type-faithful: we do NOT force gasoline into diesel-only engines -- only
  // unify each fuel's cross-mod variants.
  // 2026-08-25: deleted the IP fraction rows, the neoforge:kerosene add, and the whole
  // neoforge:lubricant reverse block -- consumers were the pulled IP jar's gas
  // generator / auto-lubricator; see git history. NOTE: c:lubricant now has NO scripted
  // writer anywhere in kubejs (tfmg ships no c:lubricant fluid tag in-jar,
  // VERIFIED-JAR tfmg-1.2.2) and no kubejs consumer either -- flagged for the owner.
  event.add('c:lpg', 'chemicalscience:lpg')

  // ---- NAPHTHA SPELLING BRIDGE: c:naphta <-> c:naphtha  (oil gap iv) -------
  // CONSTRAINT: the required Gilded catalytic reformer must run on a naphtha the pack can
  // actually produce at its age.
  // ChemicalScience ships its naphtha under a MISSPELLED key: chemicalscience-3.1.2
  // data/c/tags/fluid/naphta.json = ["chemicalscience:naphta"] (one "h"), and its two
  // catalytic_reformer recipes -- recipe/fluiditem2fluid/catalytic_reformer/
  // naphta_reformer_ptal.json and naphta_reformer_rhal.json -- read {"tag": "c:naphta"}.
  // The pack's own naphtha lives in the correctly spelled c:naphtha (tfmg:naphtha +
  // tfmg:flowing_naphtha, modern_industrialization:naphtha, oritech:still_naphtha --
  // all read from each jar's own tag file). So the Gilded
  // reformer the questbook tells the player to build sat inert on TFMG feedstock.
  // Bridge by MEMBER addition in both directions, never by nesting one tag inside the other:
  // a mutual "#" reference is the cycle shape that can make TagLoader drop both tags (the
  // c:lubricant / c:lubrication_oil case). Widening is bypass-safe -- no fuel fluid carries
  // an AStages lock anywhere in aoa_astages_*.js, gating lives on the machines. The other
  // two c:naphta consumers, ChemSci's flamethrower fuel and the Electrodynamics combustion
  // generator, are both industrial-tier and simply start accepting the shared fraction.
  // Every add is guarded on its own jar so each line is a clean no-op without it.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('chemicalscience')) {
    if (Platform.isLoaded('tfmg')) {
      event.add('c:naphta', 'tfmg:naphtha')
      event.add('c:naphta', 'tfmg:flowing_naphtha')
    }
    if (Platform.isLoaded('modern_industrialization')) {
      event.add('c:naphta', 'modern_industrialization:naphtha')
    }
    if (Platform.isLoaded('oritech')) {
      event.add('c:naphta', 'oritech:still_naphtha')
    }
    // 2026-08-25: the former IP naphtha member add was deleted with its guard -- jar
    // pulled from mods/; see git history.
    // Reverse: ChemSci's own naphtha finally reaches the correctly spelled tag, so it can
    // feed the AoA W1 reformer weave and W5 thermo-plant weave in aoa_oil_spine_weaves.js
    // (both read c:naphtha) plus TFMG's tag-driven engine cylinder fuel selection.
    event.add('c:naphtha', 'chemicalscience:naphta')
  }

  // ---- PLANT OIL SPELLING BRIDGE: c:plant_oil <-> c:plantoil  (oil gap iii) -
  // CONSTRAINT: MI plant oil and everyone else's plant oil must feed each other's machines.
  // Modern Industrialization ships data/c/tags/fluid/plant_oil.json (underscore) holding
  // only modern_industrialization:plant_oil, while IE, PneumaticCraft, Create Crafts &
  // Additions and Electro Energetics all populate the
  // no-underscore c:plantoil. Consumers of c:plantoil that light up for MI plant oil:
  // IE refinery/biodiesel + bottling/ersatz_leather + drill-lube upgrade, PNC
  // fluid_mixer/biodiesel and two thermo_plant recipes, CDG mixing/biodiesel and its
  // fuel_type/plantoil engine fuel, createaddition's eight biomass mixing recipes, and
  // Electro Energetics transformer oil. c:plant_oil currently has no consumer at all
  // (MI recipes are id-pinned), so the reverse direction is forward-compat only.
  // Same rule as above: member additions, no nested tag references, no AStages fluid lock
  // exists on any of these, each add guarded on its own jar.
  if (typeof Platform !== 'undefined' && Platform.isLoaded('modern_industrialization')) {
    if (Platform.isLoaded('immersiveengineering')) {
      event.add('c:plant_oil', 'immersiveengineering:plantoil')
    }
    if (Platform.isLoaded('pneumaticcraft')) {
      event.add('c:plant_oil', 'pneumaticcraft:vegetable_oil')
    }
    // 2026-08-25: the pulled CDG jar's plant_oil members were removed (see git history).
    if (Platform.isLoaded('electroenergetics')) {
      event.add('c:plant_oil', 'electroenergetics:plant_oil')
      event.add('c:plant_oil', 'electroenergetics:flowing_plant_oil')
    }
    if (Platform.isLoaded('createaddition')) {
      event.add('c:plant_oil', 'createaddition:seed_oil')
      event.add('c:plant_oil', 'createaddition:flowing_seed_oil')
    }
    // Reverse: MI plant oil joins the tag every other mod's machines actually read.
    event.add('c:plantoil', 'modern_industrialization:plant_oil')
  }
})
