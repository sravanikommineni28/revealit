# RevealIt

A sleek before/after photo comparison app built with Expo and React Native.

## Overview

RevealIt lets users create stunning before/after photo comparisons with an interactive slider. The app is designed for iOS-first with Android compatibility, featuring a minimal and refined aesthetic.

## Recent Changes

- **January 2026**: Initial MVP release
  - Image selection from camera or photo library
  - Interactive draggable comparison slider
  - Export to camera roll functionality
  - Share via system share sheet
  - Pro unlock stub for future monetization

## Architecture

### Stack
- **Frontend**: React Native with Expo SDK 54
- **Navigation**: React Navigation 7 (Stack + Bottom Tabs)
- **Animations**: React Native Reanimated + Gesture Handler
- **Image Processing**: Expo Image Manipulator, Expo Media Library
- **Storage**: AsyncStorage for local preferences

### Key Directories
- `/client/screens/` - Main app screens (Home, Compare, Settings)
- `/client/components/` - Reusable UI components
- `/client/navigation/` - Navigation configuration
- `/client/hooks/` - Custom React hooks
- `/client/lib/` - Utility functions and storage

### Navigation Flow
1. **HomeScreen** - Select before/after images
2. **CompareScreen** - Interactive slider comparison with export options
3. **SettingsScreen** - Pro unlock, app info, legal links

## User Preferences

- Dark/Light mode follows system preference
- Pro status persisted locally via AsyncStorage

## Key Features

### Image Selection
- Camera capture or photo library selection
- Modal picker with clean UI

### Comparison Slider
- Smooth horizontal dragging with haptic feedback
- Before/After labels
- Tap-to-position support
- Animated handle with visual feedback

### Export Options
- Save combined image to gallery
- Share via system share sheet
- Success animation feedback

### Pro Features (Stub)
- One-time purchase model
- Currently unlocks via settings (no payment integration yet)

## Permissions Required

- **Camera**: For taking photos
- **Photo Library**: For selecting existing photos
- **Media Library Write**: For saving exported images

## Running the App

The app runs on port 8081 (Expo dev server). Use Expo Go on a physical device to test native features.
