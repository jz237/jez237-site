/* Presentation metadata shared by live fireballs and the detached showroom. */
#ifndef ASTRA_DETONATIONS_H
#define ASTRA_DETONATIONS_H
enum astra_pattern {
    AB_LEGACY, AB_ARC, AB_SPALL, AB_CINDERS, AB_RING, AB_IMPLOSION,
    AB_CHAIN, AB_BLOOM, AB_NEEDLES, AB_CRACKLE, AB_PETALS, AB_TWINJET, AB_SHELL, AB_CRYO, AB_CROSS, AB_AFTERSHOCK, AB_SPLINTERS, AB_THUNDERHEAD, AB_FUSE_RUN, AB_SPLIT_RELAY, AB_CAPACITOR_LADDER, AB_TANK_CASCADE, AB_ARMOR_COOKOFF, AB_POD_RUNAWAY, AB_SHRAPNEL_RELAY, AB_HALO_COLLAPSE, AB_REACTOR_DOMINO, AB_LAST_LIGHT, AB_COUNT
};
typedef struct {
    float seconds, variation, scale;
    int palette;
} astra_detonation;
static const astra_detonation astra_detonations[AB_COUNT] = {
    [AB_ARC]       = {.38f, .14f, .68f, 1},
    [AB_SPALL]     = {.64f, .22f, .82f, 2},
    [AB_CINDERS]   = {1.04f, .30f, .88f, 0},
    [AB_RING]      = {1.32f, .36f, .95f, 7},
    [AB_IMPLOSION] = {1.84f, .38f, 1.f, 4},
    [AB_CHAIN]     = {3.08f, .64f, 1.16f, 3},
    [AB_BLOOM]     = {4.15f, .85f, 1.22f, 5},
    [AB_NEEDLES]   = {.42f, .16f, .55f, 2},
    [AB_CRACKLE]   = {.85f, .25f, .66f, 4},
    [AB_PETALS]    = {1.45f, .30f, .92f, 0},
    [AB_TWINJET]   = {1.80f, .40f, .92f, 3},
    [AB_SHELL]     = {2.10f, .35f, 1.02f, 5},
    [AB_CRYO]      = {1.60f, .30f, .80f, 7},
    [AB_CROSS]     = {1.15f, .30f, .88f, 0},
    [AB_AFTERSHOCK]= {3.25f, .50f, 1.08f, 2},
    [AB_SPLINTERS] = {2.65f, .50f, .97f, 3},
    [AB_THUNDERHEAD]={4.40f, .65f, 1.16f, 0},
    [AB_FUSE_RUN]={1.35f,.20f,.62f,0},
    [AB_SPLIT_RELAY]={2.10f,.30f,.86f,7},
    [AB_CAPACITOR_LADDER]={2.65f,.35f,.76f,1},
    [AB_TANK_CASCADE]={3.40f,.40f,1.02f,3},
    [AB_ARMOR_COOKOFF]={3.65f,.40f,.95f,2},
    [AB_POD_RUNAWAY]={4.00f,.45f,1.05f,7},
    [AB_SHRAPNEL_RELAY]={2.90f,.40f,.82f,0},
    [AB_HALO_COLLAPSE]={3.50f,.40f,.90f,7},
    [AB_REACTOR_DOMINO]={4.70f,.50f,1.12f,5},
    [AB_LAST_LIGHT]={5.25f,.45f,1.08f,0}
};
static float astra_pattern_length(int profile, unsigned seed)
{
    const astra_detonation *entry = &astra_detonations[profile];
    return entry->seconds + entry->variation * (seed & 255) / 255.f;
}
static int astra_choose_pattern(int tier, unsigned seed)
{
    static const int impacts[] = {AB_LEGACY, AB_ARC, AB_SPALL, AB_CINDERS, AB_LEGACY, AB_NEEDLES, AB_CRACKLE, AB_CRYO, AB_CROSS};
    static const int blasts[] = {AB_LEGACY, AB_RING, AB_IMPLOSION,
                                 AB_LEGACY, AB_CHAIN, AB_BLOOM, AB_LEGACY, AB_PETALS, AB_TWINJET, AB_SHELL, AB_AFTERSHOCK, AB_SPLINTERS, AB_THUNDERHEAD, AB_FUSE_RUN, AB_SPLIT_RELAY, AB_TANK_CASCADE, AB_ARMOR_COOKOFF, AB_POD_RUNAWAY, AB_SHRAPNEL_RELAY, AB_REACTOR_DOMINO, AB_LAST_LIGHT};
    if (tier == 2) return AB_LEGACY;
    return tier ? blasts[(seed >> 16) % (sizeof blasts / sizeof blasts[0])] : impacts[(seed >> 16) % (sizeof impacts / sizeof impacts[0])];
}
/* Retired chain 3/8 IDs stay reserved, but cannot be selected or rendered. */
static int astra_pattern_enabled(int profile){return profile>=AB_LEGACY&&profile<AB_COUNT&&profile!=AB_CAPACITOR_LADDER&&profile!=AB_HALO_COLLAPSE;}
static int astra_is_chain(int profile){return profile>=AB_FUSE_RUN&&profile<=AB_LAST_LIGHT&&astra_pattern_enabled(profile);}
static int astra_chain_breakup(int profile){return profile==AB_ARMOR_COOKOFF||profile==AB_POD_RUNAWAY||profile==AB_SHRAPNEL_RELAY||profile==AB_LAST_LIGHT;}
static int astra_chain_beats(int profile){static const int count[10]={7,6,8,5,8,6,9,9,6,8};return astra_is_chain(profile)?count[profile-AB_FUSE_RUN]:0;}
static float astra_chain_onset(int profile,int beat){
    static const float times[10][9]={
      {0,.09f,.18f,.28f,.39f,.51f,.65f},
      {.06f,.17f,.29f,.40f,.53f,.66f},
      {0,.07f,.16f,.25f,.36f,.47f,.59f,.71f},
      {0,.12f,.28f,.44f,.63f},
      {0,.07f,.19f,.28f,.40f,.48f,.60f,.71f},
      {0,.11f,.25f,.36f,.51f,.65f},
      {0,.08f,.13f,.23f,.32f,.44f,.53f,.63f,.74f},
      {0,.07f,.14f,.21f,.28f,.35f,.42f,.49f,.68f},
      {0,.10f,.24f,.39f,.52f,.64f},
      {0,.08f,.18f,.26f,.38f,.46f,.55f,.72f}
    };
    return times[profile-AB_FUSE_RUN][beat];
}
/* Wall light follows the main releases of energy, including the delayed
 * implosion and the five separate fuel cells. The mine handles occlusion. */
static float astra_pattern_light(int profile, float t)
{
    if(astra_is_chain(profile)){
        float light=0;for(int i=0;i<astra_chain_beats(profile);i++){float a=t-astra_chain_onset(profile,i);if(a>=0&&a<.30f)light+=.67f*expf(-a*17)*(1-a/.30f);}
        return fminf(1.35f,light);
    }
    if(profile==AB_CRACKLE)return (.18f+.62f*powf(sinf(t*28.f),2.f))*(1.f-t);
    if(profile==AB_AFTERSHOCK){float light=0;for(int i=0;i<3;i++){float a=t-i*.22f;if(a>=0)light+=.8f*expf(-a*14);}return light;}
    if(profile==AB_THUNDERHEAD)return (.18f+2.4f*t)*expf(-3.f*t)*(1.f-t);
    if (profile == AB_IMPLOSION)
        return .11f * (1.f-t) + 1.15f * expf(-fabsf(t-.64f)*13.f);
    if (profile == AB_CHAIN) {
        float light = 0;
        for (int cell=0; cell<5; cell++) {
            float age = t - cell * .153f;
            if (age >= 0) light += .73f * expf(-age*12.f);
        }
        return light;
    }
    if (profile == AB_BLOOM)
        return (.27f + 2.3f*t) * expf(-2.8f*t) * (1.f-t);
    return (.32f + .63f*expf(-5.f*t)) * (1.f-t);
}
#endif
