/* Presentation metadata shared by live fireballs and the detached showroom. */
#ifndef ASTRA_DETONATIONS_H
#define ASTRA_DETONATIONS_H
enum astra_pattern {
    AB_LEGACY, AB_ARC, AB_SPALL, AB_CINDERS, AB_RING, AB_IMPLOSION,
    AB_CHAIN, AB_BLOOM, AB_COUNT
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
    [AB_BLOOM]     = {4.15f, .85f, 1.22f, 5}
};
static float astra_pattern_length(int profile, unsigned seed)
{
    const astra_detonation *entry = &astra_detonations[profile];
    return entry->seconds + entry->variation * (seed & 255) / 255.f;
}
static int astra_choose_pattern(int tier, unsigned seed)
{
    static const int impacts[] = {AB_LEGACY, AB_ARC, AB_SPALL, AB_CINDERS, AB_LEGACY};
    static const int blasts[] = {AB_LEGACY, AB_RING, AB_IMPLOSION,
                                 AB_LEGACY, AB_CHAIN, AB_BLOOM, AB_LEGACY};
    if (tier == 2) return AB_LEGACY;
    return tier ? blasts[(seed >> 16) % (sizeof blasts / sizeof blasts[0])] : impacts[(seed >> 16) % 5];
}
/* Wall light follows the main releases of energy, including the delayed
 * implosion and the five separate fuel cells. The mine handles occlusion. */
static float astra_pattern_light(int profile, float t)
{
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
