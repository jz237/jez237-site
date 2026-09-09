# Fighting exchanges — 5.7.8

CPU exhibitions now finish a short route before repositioning. Jez and Benny link up to three distinct moves, Ali up to four, and the more deliberate fighters generally use two. Multi-hit specials count as one move. A nearly defeated opponent allows one additional finishing move. Legal cancels, range, meter, and hit confirmation still gate every continuation.

Every finished exchange gets a short reset, including a shorter reset after a miss. Defense and actionable recovery punishes retain priority; ordinary feints cannot consume the reset. Patient fighters bait and punish more often, while pressure fighters keep their shorter recovery between exchanges. A new guarded approach closes small punish gaps only when the visible recovery pays for both the walk and strike startup, and reevaluates each simulation tick.

Contact effects use painted body dimensions and calibrated limb tips when available, rejecting anchors outside the receiving body. Normal punch and kick reactions follow the authored high/body distinction; lows and overheads keep their explicit regions. Forward motion offsets use the same spacing cap in the sprite and tip projection. Combat ranges and damage are unchanged.

Routine light, heavy, and special hits have shorter hitstop, fewer smaller particles, and less camera shake. Intermediate super hits pause less; the final hit retains its emphasis. Stage light spill is reserved for counters, weapons, and supers. Reviewed voices and the 5.7.7 Foley remain in place.

Validation: all-roster route bounds, multi-hit counting, repeat exchange resets, legal recovery approaches, mirrored contact bounds, existing AI/footwork/spacing tests; browser CPU matches, round strategy, normals, supers, command specials, combos, bottom HUD, offline startup, and console checks. Contact screenshots inspect the roster at real melee impacts. This release tunes existing painted art and game logic; it does not regenerate every attack drawing.
