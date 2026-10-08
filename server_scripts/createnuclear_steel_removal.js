// ============================================================================
//  Create Nuclear steel-mixing recipe removal
// ============================================================================
//
//  Audit:  docs/audits/create_full_chapter_design_2026-04-30.md
//          ("Critical KubeJS prerequisite" section);
//          docs/audits/unauthored_content_inventory_2026-04-30.md .3
//  JAR:    mods/createnuclear-1.3.2-beta.3-neoforge.jar
//  Count:  1 recipe — data/createnuclear/recipe/mixing/steel.json
//
//  Why:    Create Nuclear ships its own steel-via-mixing recipe (iron + coal
//          dust through a Mixer). This Renaissance-era Create kinetic process
//          would let a player produce steel in R7 (Renaissance Tech) and
//          completely bypass the IR1 Mekanism metallurgic infusion → enriched
//          alloy → osmium → steel chain that gates the Industrial Revolution
//          age's first capstone.
//
//          Removing this single recipe restores the canonical IR1 steel-as-
//          gating-milestone narrative: steel is the boundary between
//          Renaissance and Industrial Revolution, and Mekanism owns its
//          production. Create Nuclear keeps its reactor and other content
//          intact — only the bypass shortcut is closed.
//
//  Scope:  Exactly one recipe ID. No regex needed.
//
//  Load order: KubeJS server_scripts run after mod recipe registration, so
//          removal works even though Create Nuclear publishes the recipe
//          first.
// ============================================================================

ServerEvents.recipes(event => {
  event.remove({ id: 'createnuclear:mixing/steel' })
})
