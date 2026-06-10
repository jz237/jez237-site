# Glimmer Grotto — Painterly Asset Prompts (GPT Image 2)

Generate each sprite with **GPT Image 2** at the listed *generation size*, then downscale
to the *final size* and (where marked transparent) cut the object out from its plain
background. Save over the placeholder file in `assets/` **with the exact same filename** —
the game hot-swaps whatever exists there, no code changes needed.

## Style preamble — prepend to EVERY prompt below

> Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text.

## Characters

### `miner.png`
*Player character (single pose; the game animates by bobbing/tilting/squash)*  
Final size: **116×176** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny cheerful miner character seen from the side facing right: round amber hard-hat with a small glowing head-lamp, warm beige face with rosy cheek and a chestnut beard, teal canvas jacket with a leather satchel strap, brown trousers and sturdy dark boots. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `pickaxe.png`
*Pickaxe, drawn in the miner's hands and swung by rotation*  
Final size: **80×76** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A sturdy miner's pickaxe held diagonally: curved polished steel head with bright top highlight, worn oak handle. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

## Pickups

### `geode_closed.png`
*Closed geode pickup (cracks open when collected)*  
Final size: **80×60** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A round lumpy grey geode stone, unbroken, with subtle mineral banding. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `geode_open.png`
*Open geode (journal & pop effect)*  
Final size: **88×52** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cracked-open geode half, grey stone shell revealing sparkling violet amethyst teeth inside. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `fossil_ammonite.png`
*Ammonite fossil curiosity*  
Final size: **80×60** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A sandy stone slab with a beautifully preserved spiral ammonite fossil imprint in cream tones. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `fossil_fern.png`
*Fern fossil curiosity*  
Final size: **80×60** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A grey-green stone slab with a delicate fossilized fern frond imprint. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `fossil_fish.png`
*Fish fossil curiosity*  
Final size: **96×36** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A wide stone slab with a small fossilized fish skeleton, fine cream bones on warm grey. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_amber.png`
*Collectible gem: amber*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a polished teardrop of warm honey amber, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_quartz.png`
*Collectible gem: quartz*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a soft rose-white quartz crystal point, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_amethyst.png`
*Collectible gem: amethyst*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a violet amethyst kite-cut crystal, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_emerald.png`
*Collectible gem: emerald*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a deep green emerald-cut emerald, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_sapphire.png`
*Collectible gem: sapphire*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a round cornflower-blue sapphire cabochon, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_ruby.png`
*Collectible gem: ruby*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a brilliant-cut crimson ruby, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `gem_diamond.png`
*Collectible gem: diamond*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A faceted gemstone: a brilliant-cut icy white diamond, glowing softly from within, bright specular sparkles, painterly facets. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `relic_compass.png`
*Relic: the Wayfarer's Compass*  
Final size: **56×44** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A treasure curio: an antique brass pocket compass with a cream face and red needle. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `relic_locket.png`
*Relic: the Miner's Locket*  
Final size: **56×48** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A treasure curio: a small golden heart locket on a fine chain, rose-tinted picture inside. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `relic_coin.png`
*Relic: an ancient coin*  
Final size: **56×44** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A treasure curio: an ancient gold coin stamped with a worn owl glyph. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `relic_idol.png`
*Relic: the jade dragon idol*  
Final size: **56×52** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A treasure curio: a tiny carved jade dragon idol with a golden eye. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `relic_bottle.png`
*Relic: message in a bottle*  
Final size: **56×48** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A treasure curio: a sealed glass bottle with a rolled paper message inside, corked. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `glowcap_jelly.png`
*Glowcap Jelly — eaten on pickup, grants a 25s Glimmer Rush (fast, effortless digging)*  
Final size: **56×44** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small corked glass jar of luminous golden glowcap jelly, soft inner light, a pale shine on the glass. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

## Veins

### `vein_amber.png`
*Embedded amber vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw amber crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vein_quartz.png`
*Embedded quartz vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw quartz crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vein_amethyst.png`
*Embedded amethyst vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw amethyst crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vein_emerald.png`
*Embedded emerald vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw emerald crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vein_sapphire.png`
*Embedded sapphire vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw sapphire crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vein_ruby.png`
*Embedded ruby vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw ruby crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vein_diamond.png`
*Embedded diamond vein overlay drawn on rock tiles*  
Final size: **128×128** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of 3-4 small raw diamond crystal shards embedded in dark rock pockets, glowing softly, transparent around the cluster. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

## Tiles

### `tile_dirt.png`
*Soft dirt tile (easy to dig)*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of warm amber packed earth with small embedded pebbles and faint root threads, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_dirt2.png`
*Soft dirt tile variant*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of warm amber packed earth, slightly darker variant with scattered pebbles, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_stone.png`
*Stone tile (medium hardness)*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of cool blue-grey cave stone with thin cracks and chipped facets, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_stone2.png`
*Stone tile variant*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of cool blue-grey cave stone variant with mineral flecks, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_hardstone.png`
*Hard stone (needs upgraded pickaxe)*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dense dark slate-blue granite with angular faces and tiny pale glints, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_grass.png`
*Surface grass-topped earth*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of meadow surface: lush mossy green grass blades with tiny wildflowers on top third, warm earth below, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_crystal.png`
*Crystal cavern rock*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of deep violet crystal-bearing rock with embedded angular amethyst glints, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_mushroom.png`
*Mushroom hollow soil*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dark mossy loam flecked with teal bioluminescent moss patches, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_ruins.png`
*Ancient ruins brick*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of ancient golden sandstone bricks with worn mortar lines, chips and warm highlights, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `tile_spring.png`
*Hot-spring terracotta rock*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of smooth warm terracotta hot-spring rock with pale mineral veins, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `backdrop_dirt.png`
*Backdrop wall: warm dark earth cave wall, very dim*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of warm dark earth cave wall, very dim, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `backdrop_stone.png`
*Backdrop wall: dim blue-grey stone cave wall*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dim blue-grey stone cave wall, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `backdrop_crystal.png`
*Backdrop wall: dim violet crystal cave wall with faint sparkle*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dim violet crystal cave wall with faint sparkle, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `backdrop_mushroom.png`
*Backdrop wall: dim mossy teal-green cave wall*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dim mossy teal-green cave wall, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `backdrop_ruins.png`
*Backdrop wall: dim golden sandstone wall with faint brick shadows*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dim golden sandstone wall with faint brick shadows, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

### `backdrop_spring.png`
*Backdrop wall: dim warm terracotta cave wall with steam stains*  
Final size: **128×128** · Generate at: **1024x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A seamless square texture tile of dim warm terracotta cave wall with steam stains, viewed flat-on. Must tile perfectly on all four edges. Even lighting, painterly texture detail, no vignette, full-bleed (no background needed).
```

## Decors

### `mushroom_glow_big.png`
*Large glowing mushroom (emits light)*  
Final size: **80×76** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tall bioluminescent teal mushroom with a softly glowing aqua cap, pale spotted top and cream stem. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `mushroom_glow_small.png`
*Small glowing mushroom (emits light)*  
Final size: **48×44** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny bioluminescent teal mushroom with a glowing cap and cream stem. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `crystal_cluster_violet.png`
*Violet crystal cluster (emits light)*  
Final size: **104×96** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of four violet amethyst crystal shards growing from a small dark rock base, glowing softly. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `crystal_cluster_teal.png`
*Teal crystal cluster (emits light)*  
Final size: **104×96** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of four teal aquamarine crystal shards growing from a small dark rock base, glowing softly. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `stalactite.png`
*Hanging stalactite*  
Final size: **56×96** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tapering limestone stalactite hanging point-down with a single glistening water drip at the tip. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `stalagmite.png`
*Floor stalagmite*  
Final size: **56×96** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tapering limestone stalagmite rising point-up from the cave floor, banded mineral texture. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `roots.png`
*Hanging roots (shallow depths)*  
Final size: **120×80** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tangle of slender tree roots hanging from a cave ceiling, earthy browns with fine root hairs. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `vine.png`
*Hanging vine*  
Final size: **48×136** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A slender hanging cave vine with small paired leaves, moss green with light tips. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `fern.png`
*Cave fern tuft*  
Final size: **96×64** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small arching cave fern with five fronds, moss green with pale highlights. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `flower_glow.png`
*Glowing cave flower (emits faint light)*  
Final size: **48×56** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny magical cave flower with pale aqua petals and a softly glowing cream core on a thin green stem. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `tree_pine.png`
*Surface pine tree*  
Final size: **144×208** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small stylised pine tree with four tiers of layered moss-green foliage and a short brown trunk. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `ruins_pillar.png`
*Ruins pillar decoration*  
Final size: **80×176** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A broken ancient sandstone column with a carved capital, cracked golden stone and small moss tufts. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `statue_owl.png`
*Owl shrine statue (Gilded Ruins landmark)*  
Final size: **80×80** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A weathered stone owl statue on a square plinth, carved round eyes, small moss tufts, warm grey stone. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `urn.png`
*Ruins urn decoration*  
Final size: **56×56** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small ancient terracotta amphora with two handles and a chipped rim. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `sunken_boat.png`
*Sunken rowboat (Still Lake landmark)*  
Final size: **160×48** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. An old sunken wooden rowboat resting on a lake bed, broken ribs, waterlogged planks, faint teal algae. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `cart_wreck.png`
*Wrecked cart (Old Workings landmark)*  
Final size: **112×52** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tipped-over broken wooden mine cart, one iron wheel detached, splintered planks. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `spore_plant.png`
*Spore puffballs (mushroom hollows)*  
Final size: **48×40** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cluster of teal puffball spore pods on thin green stems, softly glowing. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `reeds.png`
*Lake reeds*  
Final size: **56×48** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tuft of slender dark-teal underwater reeds swaying gently. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `spring_lily.png`
*Hot-spring lily pad*  
Final size: **64×32** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A floating green lily pad with a single small pink-cream blossom, top-down three-quarter view. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `mural_miners.png`
*Cave mural: the miners (Painted Dark landmark)*  
Final size: **160×112** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cave-painting panel on lighter rock: ochre stick-figure miners beside violet and green gem glyphs and a spiral, prehistoric style. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `mural_beasts.png`
*Cave mural: the beasts*  
Final size: **160×112** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cave-painting panel on lighter rock: ochre long-bodied beasts, cream handprints and a spiral, prehistoric style. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `mural_hands.png`
*Cave mural: the hands*  
Final size: **160×112** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cave-painting panel on lighter rock: cream and ochre handprints, gem glyphs and a small miner figure, prehistoric style. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `support_beam.png`
*Timber mine support (Old Workings landmark)*  
Final size: **160×232** · Generate at: **1024x1536** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. An old timber mine support: two upright posts and a crossbeam of worn oak with dark joint pegs. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `boulder.png`
*Scatter boulder*  
Final size: **88×68** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A rounded grey-blue boulder with thin cracks and a little moss on top. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `cairn.png`
*Stone cairn (hot springs)*  
Final size: **64×72** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small stacked stone cairn of four warm terracotta stones. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `shelf_fungi.png`
*Wall shelf fungi*  
Final size: **56×72** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. Three teal shelf-fungus brackets growing in a column from a cave wall, glowing rims. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `flowers_patch.png`
*Surface wildflowers*  
Final size: **88×44** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small patch of meadow grass blades with four tiny wildflowers in gold, rose and violet. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `bush.png`
*Surface bush*  
Final size: **96×60** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small rounded leafy shrub in layered moss greens with a few tiny rose berries. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `great_mushroom.png`
*The Elder Cap (mushroom hollows landmark)*  
Final size: **192×232** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A towering ancient bioluminescent mushroom: huge glowing teal domed cap with pale spots and gills, thick cream stem. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

## Critters

### `moth.png`
*Cave moth (flutters near glowing flora)*  
Final size: **48×24** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small cream cave moth with spread patterned wings, seen from above. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `snail.png`
*Cave snail*  
Final size: **48×32** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A little amber-shelled snail with a cream body, side view. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `bat.png`
*Cave bat (flutters away when approached)*  
Final size: **52×28** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny round fruit bat with spread dusk-purple wings and amber eyes, front view, friendly. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `fish.png`
*Lake fish*  
Final size: **56×28** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small plump teal cave fish with pale belly, side view. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `bird.png`
*Surface bird (flies off when approached)*  
Final size: **48×40** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small round robin-like bird with a rust-red breast, side view, perched. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

## Props

### `lantern.png`
*Lantern prop (also used at rest spots)*  
Final size: **48×48** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small brass camp lantern with a warm amber glass globe glowing softly, wire handle on top. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `campfire.png`
*Campfire rest spot*  
Final size: **96×72** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A cozy little campfire: ring of grey stones, crossed oak logs, lively amber-yellow flame with a bright core and a few rising embers. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `minecart.png`
*Mine-cart hub prop / deposit point*  
Final size: **120×64** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. An old wooden mine cart with iron rim and two iron wheels, heaped with colourful raw gems spilling over the top. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `tent.png`
*Surface camp tent (shop)*  
Final size: **160×84** · Generate at: **1536x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small terracotta canvas camping tent with a dark inviting entrance and a wooden ridge pole. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `crate.png`
*Camp decoration crate*  
Final size: **72×60** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A small worn wooden supply crate with cross planks and pale wood highlights. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

## Backgrounds

### `bg_sky.png`
*Surface sky parallax backdrop*  
Final size: **960×540** · Generate at: **1536x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A wide painterly dawn sky for a cozy mining village: deep indigo fading through rose to warm gold at the horizon, soft clouds, a gentle sun glow upper-right, distant mossy hills along the bottom. Must tile seamlessly left-to-right. Full-bleed.
```

### `bg_far.png`
*Far cave parallax layer (tinted per biome in-game)*  
Final size: **960×540** · Generate at: **1536x1024** · full-bleed (no cut-out) · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A very dark warm cavern wall seen far away: vast soft rock masses in deep umber and near-black, faint distant crystal glints. Low contrast, must tile seamlessly left-to-right. Full-bleed.
```

### `bg_mid.png`
*Mid cave parallax layer (tinted per biome in-game)*  
Final size: **960×540** · Generate at: **1536x1024** · transparent — cut out after generation · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. Mid-distance cave silhouettes: dark rock formations, hanging stalactite fringe along the top and rising stalagmites along the bottom, transparent in the middle. Must tile seamlessly left-to-right. Transparent background between formations.
```

### `bg_near.png`
*Near cave parallax layer (tinted per biome in-game)*  
Final size: **960×540** · Generate at: **1536x1024** · transparent — cut out after generation · **must tile seamlessly**

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. Foreground cave silhouettes: a few massive near-black rock columns and ceiling teeth, mostly transparent elsewhere. Must tile seamlessly left-to-right. Transparent background.
```

## Uis

### `icon_bag.png`
*HUD icon: bag capacity*  
Final size: **56×48** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny leather satchel icon, drawstring open showing a golden glow inside, crisp game-icon styling. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `icon_energy.png`
*HUD icon: energy*  
Final size: **56×52** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny warm golden lightning-bolt energy icon with a soft cream highlight, crisp game-icon styling. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `icon_journal.png`
*HUD icon: collection journal*  
Final size: **56×48** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A tiny leather-bound journal icon, russet cover, cream pages, small golden gem inlay, crisp game-icon styling. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `ui_panel.png`
*9-slice panel for HUD/shop/journal (CSS border-image)*  
Final size: **192×192** · Generate at: **1024x1024** · full-bleed (no cut-out)

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A square wooden UI panel frame: carved oak border with golden corner studs around a dark leather center. Designed to be 9-sliced. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `btn_dig.png`
*Touch button: dig*  
Final size: **120×120** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A round carved stone game button engraved with a golden pickaxe glyph, beveled rim, top-down. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `btn_jump.png`
*Touch button: jump*  
Final size: **120×120** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A round carved stone game button engraved with a golden up-arrow glyph, beveled rim, top-down. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `btn_action.png`
*Touch button: interact*  
Final size: **120×120** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text. A round carved stone game button engraved with a golden open-hand glyph, beveled rim, top-down. Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame.
```

### `joystick_base.png`
*Virtual joystick base ring (touch controls)*  
Final size: **176×176** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text.  Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame. A carved stone ring pad with four small golden direction notches, seen top-down.
```

### `joystick_thumb.png`
*Virtual joystick thumb knob (touch controls)*  
Final size: **88×88** · Generate at: **1024x1024** · transparent — cut out after generation

```
Cozy storybook painterly video-game art. Soft gouache-and-oil brushwork with visible strokes, warm amber key light from the upper-left, gentle violet ambient shadow, rich jewel-tone palette (amber, terracotta, moss green, teal, violet), rounded inviting shapes with strong readable silhouettes, subtle paper-grain texture, edges defined by dark warm-brown paint rather than black outlines, whimsical calm mood like a beloved children's book about a tiny miner, high detail but soft focus falloff, absolutely no photorealism, no 3D render look, no text.  Single centered object on a plain flat light-grey background for easy cut-out, no cast shadow on the ground, no border, object fills ~80% of the frame. A round polished wooden knob with visible grain and a soft top-left highlight, top-down.
```
