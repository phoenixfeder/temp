// AoA KubeJS: aoa_astages_reload_guard.js
// Startup scripts may initialize KubeJS globals. Server scripts may read them,
// but assigning global fields there is rejected by KubeJS 1.21.1.
global.aoaAStagesCustomized = {}
global.aoaAStagesMarkersRegistered = {}

// Ore -> [{stage, replacement, priority}] mirror of the ore-disguise rows
// registered by server_scripts/aoa_astages_06_ore_restrictions.js, consumed by
// server_scripts/aoa_astages_15_ore_drop_bypass_guard.js.
// A list, not a single row: five ores carry TWO rows with different stages,
// replacements, and priorities (see addLayeredOreRestriction in 06). Script 06
// clears this in place on every /reload; it must never be reassigned there.
global.aoaOreDisguiseTable = {}
