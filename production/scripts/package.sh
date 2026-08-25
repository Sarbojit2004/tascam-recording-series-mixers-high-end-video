#!/usr/bin/env bash
# CHECKPOINT 12 — a downloadable project zip per deliverable.
#
# Source, schedules, shared library, build/QA scripts and the manifest; not
# node_modules, not the renders, not the QA stills. Each zip is self-contained:
# `npm install && node scripts/render.mjs <Composition> <out.mp4>` rebuilds the
# deliverable from it.
set -euo pipefail
cd "$(dirname "$0")/.."

pack () { # <projdir> <zipname>
  local proj="$1" name="$2"
  rm -f "${proj}/out/${name}"
  ( cd "$proj" && zip -q -r "out/${name}" \
      src scripts package.json tsconfig.json remotion.config.ts \
      public/fonts public/logo \
      -x 'src/shared/manifest.json' ) || true
  # The asset manifest, plus the audio the composition mounts — shipped as FLAC
  # rather than WAV so the zip clears GitHub's 100 MB per-file limit. FLAC is
  # lossless, so `scripts/audio-expand.sh` restores byte-identical PCM.
  ( cd "$proj" && zip -q "out/${name}" src/shared/manifest.json out/*.flac )
  printf '  %-46s %s\n' "$name" "$(du -h "${proj}/out/${name}" | cut -f1)"
}

pack longform tascam-longform-project.zip
pack reels    tascam-reels-project.zip
