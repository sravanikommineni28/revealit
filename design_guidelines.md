# RevealIt Design Guidelines

## App Vision
RevealIt is a sleek, professional before/after photo comparison app designed for iOS-first users. The aesthetic is **minimal, refined, and focused** - allowing the user's photos to be the star while providing an intuitive editing experience.

## Brand Identity

### Tone
- **Professional** - Clean lines, purposeful interactions
- **Minimal** - No clutter, every element serves a purpose
- **Refined** - Subtle animations, polished details

### Memorable Element
The **draggable comparison slider** with a glowing teal handle that leaves a subtle trail effect when dragged.

### Color Palette

#### Primary Colors
- **Teal** (Primary): `#0D9488` - Used for CTAs, slider handle, active states
- **Teal Dark**: `#0F766E` - Pressed states
- **Coral** (Accent): `#F97316` - Used sparingly for highlights, Pro badge

#### Neutral Colors
- **Background Dark**: `#0F0F0F` - Primary dark mode background
- **Background Light**: `#FAFAFA` - Primary light mode background
- **Surface Dark**: `#1A1A1A` - Cards, elevated surfaces (dark)
- **Surface Light**: `#FFFFFF` - Cards, elevated surfaces (light)
- **Border Dark**: `#2A2A2A` - Subtle borders (dark)
- **Border Light**: `#E5E5E5` - Subtle borders (light)

#### Text Colors
- **Text Primary Dark**: `#FFFFFF`
- **Text Primary Light**: `#0F0F0F`
- **Text Secondary Dark**: `#A3A3A3`
- **Text Secondary Light**: `#737373`

## Typography

- **Headings**: System font, bold weight
- **Body**: System font, regular weight
- **Labels**: System font, medium weight, slightly smaller

## Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 32px
- 4xl: 40px

## Component Styles

### Buttons
- **Primary**: Teal background, white text, full-width on mobile, rounded corners (12px)
- **Secondary**: Transparent with teal border, teal text
- **Ghost**: Transparent, teal text only
- **Disabled**: 50% opacity

### Cards
- Rounded corners (16px)
- Subtle background elevation
- No shadows on dark mode, subtle shadows on light mode

### Image Containers
- Rounded corners (12px)
- Thin border for empty states
- Dashed border with + icon for image selection placeholders

### Slider Handle
- Circular with teal background
- White vertical lines indicating drag direction
- Subtle glow effect
- Size: 48px diameter

## Interaction Feedback

### Touch States
- Scale down to 0.97 on press
- Opacity change to 0.8
- Spring animation on release

### Haptic Feedback
- Light impact on button press
- Medium impact on slider snap
- Success notification on export

## Empty States
- Centered content
- Subtle icon or illustration
- Clear call-to-action

## Screen Flow

1. **Home Screen** - Select Before/After images
2. **Alignment Screen** - Pan, zoom, crop images to align
3. **Compare Screen** - Interactive slider comparison
4. **Export Screen** - Save or share the result

## Pro Features (Paywall)
- Badge: Coral background with "PRO" text
- Unlock modal with benefits list
- One-time purchase button
