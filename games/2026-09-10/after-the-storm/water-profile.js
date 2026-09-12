// Linear-light optical properties, not a screen-space colour filter. Clear
// saltwater, silted freshwater and cold glacial water absorb light differently.
const profiles = {
  coast: { scatter: [.012, .108, .145], absorption: [.30, .080, .045] },
  resort: { scatter: [.014, .112, .125], absorption: [.28, .075, .048] },
  lake: { scatter: [.025, .075, .052], absorption: [.28, .15, .23] },
  fortress: { scatter: [.013, .073, .104], absorption: [.32, .105, .060] },
  port: { scatter: [.022, .085, .093], absorption: [.34, .14, .095] },
  city: { scatter: [.009, .054, .090], absorption: [.34, .115, .060] },
  ice: { scatter: [.009, .113, .175], absorption: [.28, .075, .035] },
  island: { scatter: [.012, .130, .145], absorption: [.27, .065, .045] },
  park: { scatter: [.015, .122, .128], absorption: [.28, .070, .055] }
};
export function waterProfile(theme) {
  return profiles[theme] || profiles.coast;
}
