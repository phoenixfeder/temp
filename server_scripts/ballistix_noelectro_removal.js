// ============================================================================
//  Ballistix _noelectro recipe removal
// ============================================================================
//
//  Audit:  docs/audits/science_spine_cluster_design_2026-04-30.md ( row 6,
//          .G), docs/audits/_science_temp/G_ballistix.md
//  JAR:    mods/ballistix-1.21.1-1.0.1-0.jar (1.21.1-1.0.1-0)
//  Count:  40 recipes — verified via zipfile scan of
//          data/ballistix/recipe/*_noelectro.json
//
//  Why:    Ballistix ships every cross-circuit recipe with a parallel
//          `_noelectro` variant that substitutes vanilla materials
//          (steel, gunpowder, redstone) for ED circuit dependencies. Without
//          removal, players craft ICBMs, antimatter warheads, and dark-matter
//          warheads without ever touching the Electrodynamics circuit ladder
//          OR Nuclear Science antimatter / dark-matter cycle — bypassing the
//          entire science spine that Ballistix is supposed to be the terminal
//          sink for.
//
//          Removing all 40 forces the canonical recipes (with ED Basic /
//          Advanced / Elite / Ultimate Circuit gates and NS HEU / antimatter /
//          dark-matter cell inputs) as the only craftable paths, restoring
//          the strategic-warhead chain's intended progression.
//
//  Scope:  All 40 _noelectro recipes. Single regex covers every variant
//          (turrets, missiles, warheads, radar, EW gear, silos).
//
//  Load order: KubeJS server_scripts run AFTER mod recipe registration, so
//          this removal works even though Ballistix publishes the recipes
//          first. Recipe with the `_noelectro` suffix is gone before JEI
//          indexes for the player.
//
//  Sister script: voltaic _noelectro variants are auto-disabled by Voltaic's
//          own `{not: mod_loaded: electrodynamics}` condition — no KubeJS
//          work needed there. ED itself has zero _noelectro variants.
//          This is Ballistix-specific.
// ============================================================================

ServerEvents.recipes(event => {
  event.remove({ id: /ballistix:.*_noelectro/ })
})
