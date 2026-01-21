#!/bin/bash

# Photo Optimization Script
# Analyzes JPEGs in the photos directory for web use
# - Identifies photos that exceed size thresholds
# - Lists photos requiring optimization
# - Asks for user confirmation before optimizing
# - Resizes images to max 1400x1400px
# - Reduces JPEG quality to 80% for better compression

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PHOTOS_DIR="$PROJECT_ROOT/public/photos"
DEFAULT_THRESHOLD_MB=1.5
SIZE_THRESHOLD=$((1500000))  # 1.5MB in bytes

echo "📸 Photo Optimization Script"
echo "================================"
echo "Photos directory: $PHOTOS_DIR"
echo ""

# Check if photos directory exists
if [ ! -d "$PHOTOS_DIR" ]; then
    echo "❌ Error: Photos directory not found at $PHOTOS_DIR"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick is not installed"
    echo "Install it with: sudo apt-get install -y imagemagick"
    exit 1
fi

# Ask user about threshold
echo "🎯 Size Threshold Configuration"
echo "Default limit: ${DEFAULT_THRESHOLD_MB}MB"
echo ""
read -p "Use default threshold? (y/n) " -n 1 -r
echo
THRESHOLD_MB="$DEFAULT_THRESHOLD_MB"
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter custom threshold in MB (e.g., 1.0, 2.5): " CUSTOM_THRESHOLD
    if ! [[ "$CUSTOM_THRESHOLD" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
        echo "❌ Invalid input. Using default threshold."
        SIZE_THRESHOLD=$((1500000))
        THRESHOLD_MB="$DEFAULT_THRESHOLD_MB"
    else
        # Convert MB to bytes using awk for floating point math
        SIZE_THRESHOLD=$(awk "BEGIN {printf \"%.0f\", $CUSTOM_THRESHOLD * 1048576}")
        THRESHOLD_MB="$CUSTOM_THRESHOLD"
        echo "Using custom threshold: ${CUSTOM_THRESHOLD}MB"
    fi
else
    SIZE_THRESHOLD=$((1500000))
    echo "Using default threshold: ${DEFAULT_THRESHOLD_MB}MB"
fi
echo ""

# Analyze photos and find ones that need optimization
echo "🔍 Analyzing photos..."
echo ""

declare -a PHOTOS_TO_OPTIMIZE
OPTIMIZATION_NEEDED=0

while IFS= read -r file; do
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    if [ "$size" -gt "$SIZE_THRESHOLD" ]; then
        PHOTOS_TO_OPTIMIZE+=("$file")
        OPTIMIZATION_NEEDED=1
    fi
done < <(find "$PHOTOS_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \))

if [ "$OPTIMIZATION_NEEDED" -eq 0 ]; then
    echo "✓ All photos are already optimized (under ${THRESHOLD_MB}MB)"
    echo ""
    exit 0
fi

echo "📊 Photos requiring optimization (> ${THRESHOLD_MB}MB):"
echo ""
for file in "${PHOTOS_TO_OPTIMIZE[@]}"; do
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    size_mb=$(awk "BEGIN {printf \"%.1f\", $size / 1048576}")
    filename="${file##*/}"
    echo "  • $filename - ${size_mb}MB"
done
echo ""
echo "Total photos to optimize: ${#PHOTOS_TO_OPTIMIZE[@]}"
echo ""

# Ask for confirmation
read -p "Proceed with optimization? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Optimization cancelled"
    exit 0
fi

echo ""
echo "🔄 Optimizing photos..."
echo "- Resizing to max 1400x1400px"
echo "- Setting JPEG quality to 80%"
echo ""

for file in "${PHOTOS_TO_OPTIMIZE[@]}"; do
    convert "$file" -resize 1400x1400\> -quality 80 "$file"
done

echo "✓ Optimization complete"
echo ""

# Show updated sizes
echo "📊 Updated file sizes:"
echo ""
for file in "${PHOTOS_TO_OPTIMIZE[@]}"; do
    size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    size_mb=$(awk "BEGIN {printf \"%.1f\", $size / 1048576}")
    filename="${file##*/}"
    echo "  • $filename - ${size_mb}MB"
done
echo ""
echo "✨ Done! Your photos are now optimized for web use."
