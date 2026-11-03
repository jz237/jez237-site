/* Red Book transport. Engine song selection and completion hooks stay in C. */
#include "rbaudio.h"
#include <emscripten.h>
static void (*finished)(void);
void RBAInit(void) {}
void RBAExit(void) { RBAStop(); }
int RBAEnabled(void) { return 1; }
int RBAGetNumberOfTracks(void) { return 9; }
unsigned long RBAGetDiscID(void) { return 0x7d0ff809; }
void RBAStop(void) { finished = 0; EM_ASM(window.astraDisc.stop()); }
void RBAEjectDisk(void) { RBAStop(); }
void RBASetVolume(int v) { EM_ASM(window.astraDisc.audio.volume = Math.min(1, Math.max(0, $0/8)), v); }
int RBAPlayTracks(int first, int last, void (*hook)(void)) {
    if (first < 2 || first > 9) return 0;
    finished = hook;
    EM_ASM(window.astraDisc.play($0,$1), first, last);
    return 1;
}
int RBAPlayTrack(int t) { return RBAPlayTracks(t,t,0); }
void RBACheckFinishedHook(void) {
    if (finished && EM_ASM_INT(return window.astraDisc.done)) {
        void (*callback)(void) = finished;
        finished = 0;
        callback();
    }
}
int RBAGetTrackNum(void) { return EM_ASM_INT(return window.astraDisc.track); }
int RBAPeekPlayStatus(void) { return RBAGetTrackNum() != 0; }
void RBAPause(void) { EM_ASM(window.astraDisc.audio.pause()); }
int RBAResume(void) { EM_ASM(if(window.astraDisc.track) window.astraDisc.audio.play().catch(()=>{})); return 1; }
int RBAPauseResume(void) {
    if (EM_ASM_INT(return window.astraDisc.audio.paused)) return RBAResume();
    RBAPause(); return 0;
}
void RBAList(void) {}

void msgbox_warning(char *text) { EM_ASM(console.warn(UTF8ToString($0)),text); }
void msgbox_error(const char *text) { EM_ASM(window.astraFail(UTF8ToString($0)),text); }
EM_JS(int, astra_intro, (), {return !!Module.intro;});
EM_JS(int, astra_quick, (), {return !!Module.quick;});
EM_JS(int, astra_skip_first_briefing, (), {if (!Module.quick) return 0; Module.quick=false; return 1;});
EM_JS(int, astra_demo, (), {return !!Module.demo;});
