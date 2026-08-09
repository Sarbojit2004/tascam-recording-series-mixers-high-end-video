#!/usr/bin/env bash
# Builds the downloadable project-zip safety net required before the full
# long-form render (Section 2's explicit deliverable). Self-contained enough
# that, on the user's own machine:
#
#   unzip tascam-project.zip && cd tascam-project
#   npm install
#   npm run assets     # mirrors the included source stills/clips into public/
#   npm run audio && npm run audio:lf
#   npm run render      # the 88s reel
#   npm run render:lf   # the 298s long-form video
#
# reproduces both renders independently, without this session.
#
# Excluded deliberately: node_modules/ (npm install rebuilds it),
# public/img/ + public/video/ (npm run assets regenerates them from the
# source stills/clips this zip already includes at the repo root), and
# out/ build intermediates (out/*.mp4 / out/*.png deliverables are kept).
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=out/tascam-project-source.zip
mkdir -p out
rm -f "$OUT"

# git ls-files respects .gitignore and includes both tracked files and
# anything already staged in this session — exactly "what the repo contains".
# Newline-separated (not -z/NUL): zip's -@ splits on newlines, and no path in
# this repo contains one, so this is safe and avoids the NUL/newline mismatch
# that silently produced a near-empty archive on the first attempt.
#
# Deliberately excludes out/ entirely, including the rendered MP4s/PNGs: this
# zip is SOURCE ONLY, for reproducing a render from scratch. The rendered
# outputs are already committed to the repo directly (they're the actual
# deliverables), and including a ~45MB MP4 here as well was what originally
# pushed this archive over GitHub's 100MB single-file limit.
git ls-files --cached --others --exclude-standard -- . ':!out' \
  | zip -q -X "$OUT" -@

echo "wrote $OUT"
du -h "$OUT"
unzip -l "$OUT" | tail -3
