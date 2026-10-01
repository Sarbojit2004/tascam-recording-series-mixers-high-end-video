#!/bin/sh
# Chunked, resumable silent 4K render. GPU (angle) first; a chunk that crashes falls back to
# software GL (swangle). Remotion temp bundles are cleaned after every chunk (tight disk).
#   START=0 END=3600 CHUNK=150 CONC=4 sh scripts/render.sh <Composition> <outname>
set -e
COMP=$1; NAME=$2
FRAMES=${END:-3600}; CHUNK=${CHUNK:-150}
D=out/$NAME-chunks; mkdir -p $D
i=${START:-0}
while [ $i -lt $FRAMES ]; do
  e=$((i + CHUNK - 1)); [ $e -ge $FRAMES ] && e=$((FRAMES - 1))
  f=$D/$(printf '%05d' $i).mp4
  if [ ! -s "$f" ]; then
    n=0; GL=angle
    until timeout -k 20 1800 npx remotion render $COMP "$f.tmp.mp4" --frames=$i-$e --scale=2 --gl=$GL --muted --concurrency=${CONC:-4} --crf=${CRF:-18} --jpeg-quality=92 --log=error; do
      n=$((n + 1)); rm -f "$f.tmp.mp4"
      find /tmp -maxdepth 1 -name "remotion-*" -mmin +1 -exec rm -rf {} + 2>/dev/null || true
      [ $n -ge 1 ] && GL=swangle
      [ $n -ge 3 ] && { echo "chunk $i-$e FAILED"; exit 1; }
      echo "chunk $i-$e retry $n (gl=$GL)"
    done
    mv "$f.tmp.mp4" "$f"
    find /tmp -maxdepth 1 -name "remotion-*" -mmin +1 -exec rm -rf {} + 2>/dev/null || true
  fi
  echo "$COMP chunk $i-$e done $(date +%T)"
  i=$((e + 1))
done
ls $D/*.mp4 | grep -v tmp | sed "s#^#file '$PWD/#; s#\$#'#" > $D/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $D/list.txt -c copy -movflags +faststart out/$NAME.mp4
ffprobe -v error -count_frames -show_entries stream=nb_read_frames,width,height:format=duration -of default=nw=1 out/$NAME.mp4
rm -rf $D
