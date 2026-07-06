#!/usr/bin/env bash
# Records you once, then transcribes with EVERY installed Whisper model so you
# can see which recognizes your voice best. Set that one as MUSE's default with:
#   MUSE_WHISPER_MODEL=large-v3-turbo bun start   (or small.en, base.en, …)
set -euo pipefail

MODELS_DIR="$HOME/.config/muse/models"
PROMPT="Voice commands for a music player. Muse, play, pause, resume, next, previous, back, shuffle, volume up, volume down."
RAW="$(mktemp -t muse-voice-raw).wav"
WAV="$(mktemp -t muse-voice).wav"
SECS=5

command -v rec >/dev/null || { echo "✗ run: brew install sox"; exit 1; }
command -v whisper-cli >/dev/null || { echo "✗ run: brew install whisper-cpp"; exit 1; }
ls "$MODELS_DIR"/ggml-*.bin >/dev/null 2>&1 || { echo "✗ no models in $MODELS_DIR"; exit 1; }

echo ""
echo "🎤  Recording ${SECS}s — speak now.  Try: \"muse play blinding lights\""
echo ""
rec -q -c 1 -r 16000 -b 16 "$RAW" trim 0 "$SECS"
sox "$RAW" "$WAV" gain -n -1   # normalize volume

echo "⏳  Transcribing with each model…"
echo ""
for MODEL in "$MODELS_DIR"/ggml-*.bin; do
  name="$(basename "$MODEL" .bin | sed 's/^ggml-//')"
  start=$(date +%s.%N)
  text="$(whisper-cli -m "$MODEL" -f "$WAV" -nt -np -bs 5 -l en --prompt "$PROMPT" 2>/dev/null | tr '\n' ' ' | sed 's/^ *//;s/ *$//')"
  end=$(date +%s.%N)
  printf "  %-16s (%.1fs)  %s\n" "$name" "$(echo "$end - $start" | bc)" "$text"
done
echo ""
echo "☝️  Pick the model that got you right, then run MUSE with:"
echo "     MUSE_WHISPER_MODEL=<that-name> bun start"
echo "   (e.g. MUSE_WHISPER_MODEL=large-v3-turbo bun start)"
rm -f "$RAW" "$WAV"
