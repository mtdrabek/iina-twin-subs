// Beautiful Subs: make secondary (top) subtitles match primary (bottom) style.
// mpv strips ASS styling on secondary subs by default and uses a different
// position/scale policy; here we mirror the primary settings onto them.
const { console, event, mpv, preferences } = iina;

function apply() {
  try {
    // Same ASS override policy as primary (IINA default "scale"/"yes"), so
    // secondary subs get the same font, size, border, shadow and colours.
    const override = mpv.getString("sub-ass-override") || "scale";
    mpv.set("secondary-sub-ass-override", override);

    // Style options (font, size, color, border, shadow, margins, scale)
    // are shared by both tracks in mpv; make sure they follow primary.
    mpv.set("sub-ass-use-video-data", mpv.getString("sub-ass-use-video-data") || "none");

    // Top position: 0 = very top, 100 = bottom. Mirror bottom margin feel.
    const pos = Number(preferences.get("top_pos"));
    mpv.set("secondary-sub-pos", Number.isFinite(pos) ? pos : 8);
    console.log(`applied: override=${override}, top_pos=${pos}`);
  } catch (e) {
    console.log("error: " + e);
  }
}

event.on("iina.window-loaded", apply);
event.on("iina.file-loaded", apply);
event.on("mpv.secondary-sid.changed", apply);
event.on("mpv.sid.changed", apply);
