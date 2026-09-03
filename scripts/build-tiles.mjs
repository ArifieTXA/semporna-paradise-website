/**
 * build-tiles.mjs — the ffmpeg reel pipeline. Re-runnable; skips work already done.
 *
 * Source: `Videos/sem4naparadise/` — 207 Instagram reels owned by Semporna
 * Paradise Travel & Tours Sdn Bhd (the company's own account, @sem4naparadise).
 * The owner directed on 2026-09-03 that the company's own footage be published
 * (CONTEXT.md §5, owner override).
 *
 * `Videos/iamirahsna_/` is NEVER touched by this script. That is a private
 * individual's account with no consent on file.
 *
 * Selection rules, in order:
 *  1. Drop anything under 464px wide. 130 of the 207 are 360px and look soft
 *     even as a small tile.
 *  2. De-duplicate reposts. The account reposts the same cut daily; identical
 *     (caption, duration) means the same file, so only the sharpest copy stays.
 *  3. Rank by pixel area, then take the first TARGET.
 *
 * Each survivor becomes a ~6s silent loop at 540px wide in three files:
 *   .webm  VP9  CRF 34   — the modern path
 *   .mp4   H.264 CRF 28  — iPhone / Safari fallback
 *   .webp  poster        — what shows before the tile is in view
 *
 * Budget is 400 KB per tile. Anything over that is reported, not hidden.
 *
 * Usage:  node scripts/build-tiles.mjs [--target 40] [--force]
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const FFMPEG_BIN =
  process.env.FFMPEG_BIN ??
  "C:/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin/ffmpeg.exe";
const FFPROBE_BIN = FFMPEG_BIN.replace(/ffmpeg\.exe$/, "ffprobe.exe");

const SRC_DIR = "Videos/sem4naparadise";
const OUT_DIR = "public/video/tiles";
const MANIFEST = "src/data/tiles.ts";

const MIN_WIDTH = 464;
const TILE_WIDTH = 420;   // a tile is ~2-3 per row; 540 was 67 MB across 40 files
const TILE_FPS = 24;      // reels ship at 30; nobody reads 6 extra frames on a loop
const CLIP_SECONDS = 5;
const BUDGET_BYTES = 400 * 1024;

const args = process.argv.slice(2);
const TARGET = Number(args[args.indexOf("--target") + 1]) || 40;
const FORCE = args.includes("--force");

/* -------------------------------------------------------------------------- */
/* Probe + select                                                             */
/* -------------------------------------------------------------------------- */

function probe(file) {
  const out = execFileSync(
    FFPROBE_BIN,
    ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,duration",
     "-of", "csv=p=0:s=,", file],
    { encoding: "utf8" },
  ).trim();
  const [w, h, d] = out.split(",");
  return { w: Number(w), h: Number(h), dur: Number(d) };
}

function caption(file) {
  const j = `${file}.json`;
  if (!existsSync(j)) return "";
  try {
    const d = JSON.parse(readFileSync(j, "utf8"));
    return String(d.description ?? "").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

/** The subject buckets used for the tile label. Ordered: first match wins. */
const SUBJECTS = [
  [/adil|aidil/i,        "adil"],
  [/royal/i,             "royal"],
  [/danglai/i,           "danglai"],
  [/dayang/i,            "dayang"],
  [/sisipan/i,           "sisipan"],
  [/singamata/i,         "singamata"],
  [/maglami/i,           "maglami"],
  [/paghalian/i,         "paghalian"],
  [/bihing/i,            "bihing"],
  [/nusakuya/i,          "nusakuya"],
  [/egang/i,             "egang"],
  [/sibuan/i,            "sibuan"],
  [/bohey|dulang/i,      "bohey"],
  [/seawalk/i,           "seawalk"],
  [/snorkel/i,           "snorkel"],
  [/island hopping/i,    "hopping"],
  [/honeymoon|romantic/i,"honeymoon"],
  [/matta|booth/i,       "booth"],
  [/checkout|guest/i,    "guests"],
];

function subjectOf(text) {
  for (const [re, key] of SUBJECTS) if (re.test(text)) return key;
  return "sea";
}

function select() {
  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".mp4")).map((f) => join(SRC_DIR, f));
  const rows = [];
  for (const f of files) {
    let m;
    try { m = probe(f); } catch { continue; }
    if (!Number.isFinite(m.w) || m.w < MIN_WIDTH) continue;
    const cap = caption(f);
    rows.push({ file: f, ...m, cap, subject: subjectOf(cap) });
  }

  // De-duplicate reposts: identical caption + duration to 0.1s == same cut.
  const seen = new Map();
  for (const r of rows) {
    const key = `${r.cap.slice(0, 120)}|${r.dur.toFixed(1)}`;
    const prev = seen.get(key);
    if (!prev || r.w * r.h > prev.w * prev.h) seen.set(key, r);
  }

  return [...seen.values()]
    .sort((a, b) => b.w * b.h - a.w * a.h || a.dur - b.dur)
    .slice(0, TARGET)
    .map((r) => ({ ...r, id: `reel-${basename(r.file).split("_")[1]}` }));
}

/* -------------------------------------------------------------------------- */
/* Encode                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Where the 5s cut starts.
 *
 * 15% was the first guess and it was wrong: a QA pass at 1920px found burnt-in
 * Instagram title cards ("BRIEFING", a stylised "Royal Resort" wordmark) still
 * on screen in the poster frame, which reads as a screenshot of a phone rather
 * than as footage. Those overlays run for the first few seconds, so the cut
 * starts at 40% instead — past the card, before the outro.
 */
function startAt(dur) {
  if (dur <= CLIP_SECONDS) return 0;
  return Math.min(dur * 0.4, dur - CLIP_SECONDS);
}

function run(bin, argv) {
  execFileSync(bin, argv, { stdio: ["ignore", "ignore", "pipe"] });
}

const VF = `scale=${TILE_WIDTH}:-2:flags=lanczos,fps=${TILE_FPS}`;

/**
 * Both encoders run CONSTRAINED quality, not pure CRF. Handheld reel footage is
 * expensive to compress, and a pure-CRF pass put 36 of 40 tiles over budget
 * (one webm hit 4.8 MB). The bitrate ceiling makes the 400 KB budget a
 * guarantee rather than a hope.
 */

function encode(t) {
  const ss = startAt(t.dur).toFixed(2);
  const dur = Math.min(CLIP_SECONDS, t.dur).toFixed(2);
  const base = join(OUT_DIR, t.id);

  if (FORCE || !existsSync(`${base}.webm`)) {
    run(FFMPEG_BIN, ["-y", "-ss", ss, "-t", dur, "-i", t.file,
      "-an", "-vf", VF, "-c:v", "libvpx-vp9", "-crf", "44", "-b:v", "320k",
      "-maxrate", "420k", "-bufsize", "840k", "-g", "120",
      "-auto-alt-ref", "1", "-lag-in-frames", "25",
      "-row-mt", "1", "-cpu-used", "3", "-deadline", "good", "-pix_fmt", "yuv420p",
      `${base}.webm`]);
  }
  if (FORCE || !existsSync(`${base}.mp4`)) {
    run(FFMPEG_BIN, ["-y", "-ss", ss, "-t", dur, "-i", t.file,
      "-an", "-vf", VF, "-c:v", "libx264", "-profile:v", "high", "-crf", "32",
      "-maxrate", "480k", "-bufsize", "960k", "-g", "120",
      "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      `${base}.mp4`]);
  }
  if (FORCE || !existsSync(`${base}.webp`)) {
    run(FFMPEG_BIN, ["-y", "-ss", ss, "-i", t.file, "-frames:v", "1",
      "-vf", VF, "-quality", "68", `${base}.webp`]);
  }

  const m = probe(`${base}.webm`);
  const sizes = ["webm", "mp4", "webp"].map((e) => statSync(`${base}.${e}`).size);
  return { w: m.w, h: m.h, bytes: { webm: sizes[0], mp4: sizes[1], webp: sizes[2] } };
}

/* -------------------------------------------------------------------------- */

mkdirSync(OUT_DIR, { recursive: true });

const picked = select();
console.log(`selected ${picked.length} reels (>= ${MIN_WIDTH}px wide, de-duped)`);

const built = [];
let over = 0;
for (const [i, t] of picked.entries()) {
  process.stdout.write(`  [${String(i + 1).padStart(2, "0")}/${picked.length}] ${t.id} `);
  try {
    const r = encode(t);
    const worst = Math.max(r.bytes.webm, r.bytes.mp4);
    if (worst > BUDGET_BYTES) over++;
    console.log(`${r.w}x${r.h} webm=${(r.bytes.webm / 1024).toFixed(0)}KB mp4=${(r.bytes.mp4 / 1024).toFixed(0)}KB${worst > BUDGET_BYTES ? "  OVER BUDGET" : ""}`);
    built.push({ id: t.id, src: t.file, subject: t.subject, w: r.w, h: r.h, bytes: r.bytes });
  } catch (e) {
    console.log(`FAILED — ${String(e.message).split("\n")[0]}`);
  }
}

writeFileSync(
  "scripts/tiles-build.json",
  JSON.stringify({ built, generated: new Date().toISOString() }, null, 2),
  "utf8",
);

console.log(`\ndone: ${built.length} tiles, ${over} over the ${BUDGET_BYTES / 1024}KB budget`);
console.log(`raw build record -> scripts/tiles-build.json`);
console.log(`hand-written labels live in ${MANIFEST}`);
