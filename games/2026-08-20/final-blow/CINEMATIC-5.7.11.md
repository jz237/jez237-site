# 5.7.11 cinematic direction

All ten fighters and both fatality variants now derive their movement from the live three-beat projectile timeline. The old multi-hit movement track remains as a pose library; its unrelated attacks, lifts, and side switches no longer play between projectile events. The victim reacts at contact, recoils, then falls with an accelerating descent. Character-specific pose choices, props and variant outcomes remain.

Camera: one gradual push from 1.24 to 1.33, then a slow release; reduced motion peaks at 1.275. Framing stays on the two fighters. Letterbox height settles once. Object-specific Foley accompanies setup/contact, and a body landing cue plays once at the scripted landing. Hitstop, shake, and flash are shorter and smaller.

Presentation: compact effects and bottom-bar captions replace oversized bursts and competing announcement layers. Removed the redundant headline stack, diagrammatic electric skeleton, and screen-wide family accent marks. Painted character art remains the visual basis; this is a choreography and presentation upgrade, not new fatality sprite artwork.

Validation: all 20 variants, 9,200 timeline samples; contact-order, spacing, finite positions, bounded heights, smooth lens movement, pose fallbacks, gore on/off, touch execution and offline boot. Eight focused browser probes pass, with follow-up camera/presentation probes passing after final refinements. A broader existing mobile-menu probe separately fails its bottom-dock viewport-bound assertion; the isolated touch-finisher probe passes with its own mobile setup.
