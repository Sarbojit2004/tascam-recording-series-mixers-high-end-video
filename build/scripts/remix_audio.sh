#!/usr/bin/env bash
# Re-renders each deliverable's AUDIO from the corrected mix and muxes it onto
# the picture that is already rendered.
#
# WHY NOT JUST RE-RENDER. The mix correction in shared/mix.ts changes no pixel,
# and re-rasterising 43,000 frames to change a gain would cost about 45 minutes
# for a result identical to the one already on disk. Remotion can render a
# composition's audio on its own, which takes well under a minute per
# deliverable; the video stream is then copied through untouched (-c:v copy),
# so the picture is bit-identical to what was verified.
#
# WHY NOT APPLY THE GAIN WITH AN FFMPEG FILTER. That would decode the AAC the
# renderer produced, amplify it and re-encode — a second lossy generation on
# the quietest material in the piece, which is exactly where coding artefacts
# show. Rendering the audio afresh from the composition keeps it to one.
#
# Running it twice is harmless: the second pass produces the same audio.
set -euo pipefail
cd "$(dirname "$0")/.."

remix() { # <project> <composition> <basename>
  local proj="$1" comp="$2" base="$3"
  local mp4="$proj/out/$base.mp4"
  [ -f "$mp4" ] || { echo "skip $base (not rendered)"; return; }
  echo "=== $base"
  ( cd "$proj" && npx remotion render "$comp" "out/$base.wav" --codec=wav --config=remotion.audio.config.ts --log=error )
  ffmpeg -v error -y -i "$mp4" -i "$proj/out/$base.wav" \
    -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -movflags +faststart \
    "$proj/out/$base.remixed.mp4"
  mv -f "$proj/out/$base.remixed.mp4" "$mp4"
  rm -f "$proj/out/$base.wav"
  ffmpeg -nostats -i "$mp4" -af ebur128 -f null - 2>&1 \
    | grep -A3 Summary | grep "I:" | sed "s/^/    /"
}

remix longform LongForm                tascam-model-series-longform
remix reels    Reel1TriPathSurvey      tascam-reel-1-tri-path-survey
remix reels    Reel2FlagshipSpecialist tascam-reel-2-flagship-and-specialist
remix reels    Reel3TransparentBridge  tascam-reel-3-transparent-bridge
echo "REMIX DONE"
