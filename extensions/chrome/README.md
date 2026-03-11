# Yggdrasil Capture - Chrome Extension

Chrome extension (Manifest V3) for capturing content to your Yggdrasil knowledge graph.

## Features

- **Right-click context menu**: "Save to Yggdrasil" on any content
- **Captures**: Selected text, images, links, page URLs, videos
- **AI extraction**: Auto-grabs metadata (title, description, author, date, etc.)
- **AI auto-tagging**: Suggests tags based on content analysis
- **Metadata editor**: Choose which fields to include before saving
- **Visual feedback**: Toast notifications on successful capture

## Installation (Development)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extensions/chrome` directory

## Usage

1. Right-click any content on a page
2. Select "Save to Yggdrasil" from the context menu
3. Choose the capture type (auto-detected for most cases)
4. Click the extension icon to review/edit metadata before saving

## Configuration

Click the extension icon > Options to configure:
- **API URL**: Your Yggdrasil backend endpoint (default: `http://localhost:5000/api`)
- **AI extraction**: Enable/disable automatic AI tagging
- **Default tags**: Tags added to every capture

## Note on Icons

The `icon.svg` is a placeholder. To generate PNG icons for Chrome:
```bash
# Using ImageMagick or similar tool:
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 32x32 icon32.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```
