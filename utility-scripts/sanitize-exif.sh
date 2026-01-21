#!/bin/bash

# EXIF Sanitization Script
# Removes personal information from photo EXIF data while preserving camera settings
# - Camera make, model, and body
# - Lens information
# - Shutter speed, aperture, ISO
# - Focal length
# - White balance, metering mode
# Removes:
# - GPS coordinates
# - Date/time information
# - User comments and artist info
# - Copyright and software info

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PHOTOS_DIR="$PROJECT_ROOT/public/photos"

echo "🔐 EXIF Sanitization Script"
echo "============================"
echo "Photos directory: $PHOTOS_DIR"
echo ""

# Check if photos directory exists
if [ ! -d "$PHOTOS_DIR" ]; then
    echo "❌ Error: Photos directory not found at $PHOTOS_DIR"
    exit 1
fi

# Check if exiftool is installed
if ! command -v exiftool &> /dev/null; then
    echo "❌ Error: exiftool is not installed"
    echo "Install it with: sudo apt-get install -y libimage-exiftool-perl"
    exit 1
fi

echo "🔍 Scanning photos for EXIF data..."
echo ""

# Build a list of files with removable EXIF data
TEMP_LIST=$(mktemp)
FILE_COUNT=$(find "$PHOTOS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | wc -l)

echo "🔍 Scanning photos for removable EXIF data..."
echo ""

find "$PHOTOS_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | sort | while read file; do
    EXIF_DATA=$(exiftool "$file" 2>/dev/null | grep -v "^File" | grep -v "^Profile" | grep -E "GPS|Date/Time|DateTime|User Comment|Artist|Creator|Copyright|Software|Image Description|Creator Tool|History" || true)
    
    if [ -n "$EXIF_DATA" ]; then
        echo "$file" >> "$TEMP_LIST"
        echo "📷 $(basename "$file")"
        echo "$EXIF_DATA" | sed 's/^/   ├─ /'
    fi
done

EXIF_COUNT=$(wc -l < "$TEMP_LIST" 2>/dev/null || echo 0)

echo ""
echo "📊 Summary:"
echo "   Total JPEGs found: $FILE_COUNT"
echo "   Files with removable EXIF: $EXIF_COUNT"
echo ""

if [ $EXIF_COUNT -eq 0 ]; then
    echo "✅ All photos are clean. No personal EXIF data found."
    rm -f "$TEMP_LIST"
    exit 0
fi

# Ask for confirmation
read -p "Sanitize EXIF data in these photos? (This will remove personal info but keep camera settings) (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 0
fi

echo ""
echo "🔐 Sanitizing EXIF data..."
echo ""

# Process each file from the temp list
while IFS= read -r file; do
    # Remove personal/private EXIF and XMP tags while keeping camera settings
    exiftool -overwrite_original \
        -GPS*= \
        -DateTimeOriginal= \
        -DateTime= \
        -DateModified= \
        -DateCreated= \
        -ModifyDate= \
        -CreateDate= \
        -UserComment= \
        -Artist= \
        -Creator= \
        -Copyright= \
        -CopyrightNotice= \
        -Software= \
        -ImageDescription= \
        -XMP:all= \
        -IPTC:all= \
        "$file" 2>&1 | grep -q "1 image files updated" && echo "✅ Sanitized: $(basename "$file")" || echo "⚠️  Warning for: $(basename "$file")"
done < "$TEMP_LIST"

rm -f "$TEMP_LIST"

echo ""
echo "✨ Complete!"
echo ""
echo "Preserved camera settings:"
echo "   • Camera make and model"
echo "   • Lens information"
echo "   • Shutter speed, aperture, ISO"
echo "   • Focal length"
echo "   • White balance, metering mode"
echo ""
echo "Removed personal information:"
echo "   • GPS coordinates"
echo "   • Date and time"
echo "   • User comments and artist info"
echo "   • Copyright and software info"
