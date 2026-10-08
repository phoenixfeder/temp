# AoA KubeJS / LootJS / Gate Logic Rules

These instructions apply to KubeJS, LootJS, and custom AoA item/gate logic.

## Mission

Implement recipe gates, custom proof items, boss-drop guarantees, and progression-support scripts in a way that matches live AoA architecture and never invents content carelessly.

## Core Rules

### 1. Live Truth Over Stale Design

If docs, old plans, and current live files disagree:

- prefer live repo truth and latest locked architecture
- report drift explicitly
- do not silently restore removed gates, mods, or systems

### 2. No Fake Items Unless Architecture Truly Needs Them

Custom `aoa:*` items are allowed only when they serve a real role:

- convergence proof
- chapter token
- gate intermediate
- final trigger item

Do not create custom items just to patch weak chapter design.

Before creating a new `aoa:*` item, ask:

- is there already a real item that can serve as proof?
- is the custom item actually needed for clarity or gating?
- does the chapter/token/gate architecture explicitly call for it?

### 3. Verify IDs First

Before writing recipe rewrites, loot injections, or item registration:

- verify item/entity IDs from live files or jar registry
- do not guess namespaces
- do not port stale IDs from old docs

### 4. Preserve Locked Gate Logic

Do not casually rewrite these without explicit approval:

- Moon Clock gate
- age-stage grants already locked in current pass state
- current locked boss-drop gate philosophy
- active Neo Vitae, Malum, and Mahou spine decisions (Forbidden & Arcanus is
  retiring and out of progression scope)
- active industrial/space convergence gates

### 5. Prefer Clear Gates Over Hidden Hacks

When implementing a gate:

- make the proof path legible
- prefer one explicit intermediate over obscure side effects
- ensure handoff docs and chapter quests reflect the gate

### 6. LootJS Guarantees Are For Deterministic Progression Only

Use LootJS top-ups when:

- a boss drop is required for progression
- the native drop path is unreliable, chest-only, or missing
- the architecture explicitly depends on deterministic proof

Do not use LootJS to shower bonus loot for flavor.

## Required Work Sequence

1. Audit current recipe/drop/item registration truth.
2. Verify all IDs.
3. Compare against latest locked architecture/current chapter plan.
4. Implement minimal safe change.
5. Document what changed and why.
6. Note any unresolved drift.

## Preferred Script Categories

### aoa_items

Use for:

- custom proof items
- chapter tokens
- gate intermediates

Only create items that are architecturally justified.

### Recipe Gates

Use for:

- cross-mod recipe walls
- chapter capstone craft proofs
- deterministic convergence items

### Loot Gates

Use for:

- boss-drop guarantees
- deterministic progression items
- correction of chest-only or unreliable boss-drop logic

## Mandatory Reporting

When editing KubeJS/LootJS:

- list the exact files touched
- list the exact IDs verified
- list new custom items added
- list recipes changed
- list loot tables changed
- list what chapter/gate this supports
