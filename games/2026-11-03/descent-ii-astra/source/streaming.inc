/* Prime the exact wall and door materials of the selected mine. Secret mines
 * and loads from saves enter through the same path. Other image consumers
 * retain a demand fallback in read_png. No gameplay state is changed. */
EM_ASYNC_JS(void, astra_fetch_mine_art, (const char *names, int count, int wall_count), {
    const list = [];
    for (let i = 0; i < count; i++) list.push(UTF8ToString(names + i * 32));
    try {
        await Module.assetDepot.level(list.slice(0, wall_count), list.slice(wall_count));
        /* These shared geology pairs can occur independently of native wall
         * aliases. Load before rendering, so a showroom frame never yields
         * halfway through a temporary door pose to fetch a missing image. */
        await Promise.all(["m020.png","m022.png","m037.png"].map(name=>Module.assetDepot.image(name)));
    }
    catch (error) { abort(error.message); }
});

void astra_prepare_mine_art(void)
{
    if (!EM_ASM_INT(return !!Module.assetDepot;)) return;
    unsigned char used[MAX_TEXTURES] = {0};
    unsigned char bitmap_used[MAX_BITMAP_FILES] = {0};
    static char names[MAX_BITMAP_FILES][32];
    for (int room = 0; room <= Highest_segment_index; room++) {
        for (int face = 0; face < 6; face++) {
            const side *s = &Segments[room].sides[face];
            int base = s->tmap_num, overlay = s->tmap_num2 & 0x3fff;
            if (base >= 0 && base < NumTextures) used[base] = 1;
            if (overlay > 0 && overlay < NumTextures) used[overlay] = 1;
        }
    }
    for (int wall = 0; wall < Num_walls; wall++) {
        int clip = Walls[wall].clip_num;
        if (clip < 0 || clip >= Num_wall_anims) continue;
        for (int frame = 0; frame < WallAnims[clip].num_frames; frame++) {
            int index = WallAnims[clip].frames[frame];
            if (index >= 0 && index < NumTextures) used[index] = 1;
        }
    }
    for (int index = 0; index < NumTextures; index++) {
        int bitmap = Textures[index].index;
        if (used[index] && bitmap >= 0 && bitmap < Num_bitmap_files) bitmap_used[bitmap] = 1;
    }
    /* Native polygon textures also appear on robot wreckage. Fetch the
     * paint for models in this mine ahead of their first combat use. */
    for (int i = 0; i <= Highest_object_index; i++) {
        const object *obj = &Objects[i];
        if (obj->render_type != RT_POLYOBJ || obj->type == OBJ_NONE) continue;
        int model = obj->rtype.pobj_info.model_num;
        if (model < 0 || model >= N_polygon_models) continue;
        const polymodel *pm = &Polygon_models[model];
        for (int j = 0; j < pm->n_textures; j++) {
            int slot = pm->first_texture + j;
            if (slot < 0 || slot >= MAX_OBJ_BITMAPS || ObjBitmapPtrs[slot] >= MAX_OBJ_BITMAPS) continue;
            int bitmap = ObjBitmaps[ObjBitmapPtrs[slot]].index;
            if (bitmap >= 0 && bitmap < Num_bitmap_files && !bitmap_used[bitmap]) bitmap_used[bitmap] = 2;
        }
    }
    int count = 0, wall_count = 0;
    for (int priority = 1; priority <= 2; priority++) {
        for (int bitmap = 0; bitmap < Num_bitmap_files; bitmap++) {
            if (bitmap_used[bitmap] != priority) continue;
            const char *name = piggy_game_bitmap_name(&GameBitmaps[bitmap]);
            if (name) snprintf(names[count++], sizeof(names[0]), "%s", name);
        }
        if (priority == 1) wall_count = count;
    }
    astra_fetch_mine_art(&names[0][0], count, wall_count);
}
