#!/usr/bin/env bash
# Probe every reel: width, height, duration, bitrate -> scripts/reels.tsv
FFBIN="/c/Users/User/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin"
export PATH="$FFBIN:$PATH"
OUT="scripts/reels.tsv"
: > "$OUT"
for f in Videos/sem4naparadise/*.mp4; do
  line=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,duration,nb_frames \
    -of csv=p=0:s=, "$f" 2>/dev/null)
  size=$(stat -c%s "$f")
  printf '%s\t%s\t%s\n' "$f" "$line" "$size" >> "$OUT"
done
echo "probed $(wc -l < "$OUT") reels"
