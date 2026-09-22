# Forgiving ball handling (mm-42)

The user found even the easiest setting difficult to control. Difficulty still
selects the original time allowance; a separate Ball handling setting now
defaults to Forgiving, including existing saves with no handling preference.
Classic remains selectable. Changes apply when starting the next race.

Forgiving handling applies bounded opposing torque to brake released input,
reverse motion and sideways drift. It preserves forward acceleration, turbo
power, physical rolling, gravity, collision geometry and unsupported flight.
Assistance requires a supporting surface within 0.015 world units of the sphere
and friction at least 0.1; ice retains its low grip. It does not move a marble
or assign its velocity. The impulse is capped so it cannot reverse the damped
angular component by itself.

Handling is saved with race/replay options and separated in record keys and
record descriptions. The physics revision is mm-42. Model simulations without
an explicit handling option retain Classic; the player-facing default is
Forgiving. This is an accessibility adaptation, not an original Amiga rule.

Level-track measurements after two seconds of ordinary forward input:
- Release: travel over the next two seconds drops from 6.790 to 1.997 world units.
- Reverse: peak stopping travel drops from 3.277 to 1.152 world units.
- Forward acceleration matches exactly before release; turning reduces lateral
  travel, mid-turn snapshots restore exactly, and ice/airborne comparisons match.

Timed native Practice completes with no falls: solo 4,232 ticks; both players
finished by 4,366 ticks. Browser Settings displays Forgiving by default. This
does not prove all native courses or optional routes; their existing parity
gaps remain open. Build and focused handling/difficulty/records checks pass.
