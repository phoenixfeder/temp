// AoA KubeJS: soul_economy.js
// Theme: Malum soul economy support.
// NeoForge 1.21.1 / KubeJS 2101.x

// ---- LootJS: guarantee Malum wicked spirit on common undead --------------
// R3 Branch A quest "Extractive — Harvest" asks for 8× malum:wicked_spirit.
// Native Malum drops are RNG-weighted. This top-up guarantees at least one
// wicked_spirit drop from a zombie on killed_by_player, so the quest is
// achievable without extreme RNG churn. Does NOT replace native drops.
LootJS.modifiers(event => {
    event.addEntityModifier('minecraft:zombie').addLoot(
        LootEntry.of(Item.of('malum:wicked_spirit', 1))
            .when(condition => condition.killedByPlayer())
            .when(condition => condition.randomChance(0.15))
    )

    event.addEntityModifier('minecraft:husk').addLoot(
        LootEntry.of(Item.of('malum:wicked_spirit', 1))
            .when(condition => condition.killedByPlayer())
            .when(condition => condition.randomChance(0.15))
    )
})
