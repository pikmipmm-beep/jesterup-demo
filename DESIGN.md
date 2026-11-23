---
name: JesterUp
description: Игровой зал JesterUp с солнечно-жёлтым лобби, тёмными игровыми сценами и локальными демо-играми.
colors:
  midnight-plum: "#100e13"
  panel: "#19161e"
  panel-raised: "#211c26"
  panel-soft: "#2b2431"
  divider: "#3a303e"
  text-primary: "#fff8ed"
  text-muted: "#c7bac6"
  text-quiet: "#a99aa8"
  jester-violet: "#bd8bff"
  jester-purple: "#925de5"
  win-mint: "#85e0b3"
  jackpot-gold: "#f4c96a"
  lobby-yellow: "#37301e"
  lobby-ink: "#f8f0d6"
  lobby-muted: "#c4b891"
  lobby-tint: "rgba(0, 0, 0, 0.2)"
  brand-yellow: "#b9a36e"
  chance-pink: "#f18bb4"
  scene-blue: "#8eddf4"
  loss-coral: "#fa8797"
  action-bronze: "#c08a43"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Manrope, sans-serif"
    fontSize: "clamp(29px, 3.1vw, 43px)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, Manrope, sans-serif"
    fontSize: "25px"
    fontWeight: 800
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, Manrope, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Mono, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "0.065em"
rounded:
  compact: "7px"
  sm: "8px"
  control: "10px"
  md: "12px"
  card: "14px"
  lg: "16px"
  modal: "17px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "28px"
components:
  button-primary:
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "11px 16px"
    height: "48px"
  button-secondary:
    backgroundColor: "#272d4a"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "11px 16px"
    height: "48px"
  bet-stepper:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "5px"
    height: "53px"
  game-tile:
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0"
    height: "151px"
  wallet-pill:
    textColor: "{colors.text-primary}"
    rounded: "14px"
    padding: "9px 10px 9px 13px"
  play-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "0"
  nav-link:
    textColor: "{colors.text-muted}"
    typography: "{typography.body}"
    rounded: "10px"
    padding: "10px 16px"
---

# Design System: JesterUp

## Overview

**Creative North Star: "Игровой зал JesterUp"**

JesterUp uses a muted olive-gold game lobby with slightly darker translucent game tiles, led by the supplied JesterUp logo and game illustrations. Bright yellow stays in the logo and selected accents. Case, inventory, and game boards retain plum-black surfaces; warm gold marks value and decisions, while violet, mint, and rose identify game-specific states.

Game controls share one language for stakes, status, and panels. Use real, locally bundled game and gift imagery for catalog covers and case prizes, retaining source provenance. Interactive boards remain responsive; the «Самолёт / Рейс» stage uses a cropped, muted clip supplied by the user. On a small screen the game scene comes before the stake controls, and the lower navigation remains within easy reach.

**The Game-First Rule.** Keep the game board and its stake controls as the clearest action; decorative light supports them without competing.

**Key Characteristics:**
- Plum-black atmosphere with warm, purposeful signals.
- Photo-led game covers and source-labeled prize art inside distinct arcade cabinets.
- Compact, legible game controls with clear round states.
- Mobile layout that keeps play, balance, and navigation close.

## Colors

The lobby uses a muted olive-gold canvas with warm light text and transparent, deeper-toned game tiles. Plum-black surfaces remain inside game boards, case dialogs, and secondary pages. Bright yellow stays in the logo and selected accents; gold carries prices and primary actions, while violet, mint, rose, blue, and coral keep game states distinct.

### Primary
- **Jester Violet:** Marks selected controls and game states.
- **Jester Purple:** Adds depth inside game art and win effects.

### Secondary
- **Jackpot Gold:** Calls out prices, multipliers, and primary actions.
- **Win Mint:** Marks a favorable state and the live demo indicator.
- **Scene Blue:** Illuminates safe crystal reveals and cool details in game art.

### Tertiary
- **Chance Pink:** Colors energetic game art and selected chance states.
- **Loss Coral:** Identifies loss states and warnings without changing the dark surface structure.

### Neutral
- **Midnight Ink:** The page canvas and the darkest parts of game boards.
- **Panel:** The shared play surface and larger content container.
- **Raised Panel / Soft Panel:** Separate nested controls and cards through tone rather than heavy borders.
- **Divider:** Defines panel edges, tile outlines, and quiet separators.
- **Primary Text / Muted Text / Quiet Text:** Establish readable hierarchy for names and actions, descriptions, then metadata.
- **White:** Reserved for high-contrast text on saturated action and selected states.

**The Jester Signal Rule.** Gold identifies value and the main action; mint, violet, blue, pink, and coral communicate a specific game or round state.

## Typography

**Display Font:** Bricolage Grotesque (with Manrope and sans-serif fallbacks)  
**Body Font:** Manrope (with Segoe UI and sans-serif fallbacks)  
**Label/Mono Font:** IBM Plex Mono (with Consolas and monospace fallbacks)

**Character:** Bricolage Grotesque gives game names and balances a compact, expressive marquee quality. Manrope keeps instructions calm and readable, while IBM Plex Mono makes currencies, round labels, and short status data feel instrument-like.

### Hierarchy
- **Display:** Heavy Bricolage Grotesque with tight tracking; for page headings and the main balance.
- **Headline:** Heavy display face for section titles and the current game.
- **Title:** Heavy display face for card names, control headings, and primary actions.
- **Body:** Manrope at the comfortable reading size and open line height for help text and descriptions.
- **Label:** Small, tracked IBM Plex Mono for currency, round metadata, game numbering, and compact status labels.

## Layout

The desktop canvas is centered at a maximum width of 1392px, with a 26px side gutter and a compact top bar. The play area uses a wider board column beside a narrower stake-control column; a three-column game shelf gives the featured game extra span.

At 980px the play columns tighten and the game shelf becomes two columns. At 720px the board and controls stack, the top navigation gives way to a fixed four-item lower bar, and the game shelf stays two-up with one featured horizontal tile. At 390px the outer gutter and tile gaps tighten again. Keep the page usable down to the 320px minimum viewport width and respect the mobile safe-area inset beneath the fixed navigation.

Spacing follows a small, repeatable rhythm across gutters, control groups, and card interiors. Preserve breathing room around the active board, then use tighter spacing inside quick bets and metadata rows.

## Elevation & Depth

Depth comes mostly from tonal layering, quiet plum dividers, and restrained light behind the active board and game art. Shadows are selective: the brand mark, revealed game tiles, and floating dialogs receive lift, while the large play surface stays edge-defined and calm. Transitions are short and state-led; the reduced-motion preference collapses animation and transition durations.

### Shadow Vocabulary
- **Brand lift:** 0 4px 12px rgba(5, 7, 20, .3) keeps the jester mark distinct from the header.
- **Primary action:** 0 5px 14px rgba(4, 5, 20, .3) gives the main action a little weight.
- **Interactive tile:** 0 4px 9px rgba(4, 6, 20, .22), deepening on hover to 0 7px 14px rgba(6, 7, 22, .26).
- **Mobile navigation:** 0 8px 22px rgba(4, 5, 19, .35) separates the fixed bar from the content beneath it.

**The Limited-Glow Rule.** Keep broad panels flat at rest; use glow or shadow around an active control, an illustrated scene, or a clear state change.

## Shapes

Cards and controls use gently rounded corners rather than pills: the play frame is the broadest rectangle, game tiles and inputs sit one step tighter, and small selectors use the compact end of the scale. Borders are thin and cool-toned, with overflow clipped around sourced imagery so each tile reads like a cabinet window. The active game uses a brighter edge and surface shift rather than a new silhouette.

## Components

Controls feel tactile and confident. State changes rely on a lifted edge, a short color shift, and a clear status signal.

### Buttons
- **Shape:** Softly rounded rectangular controls using the shared medium corner.
- **Primary:** The main action uses warm bronze-gold with dark display text; it brightens on hover.
- **Secondary:** A filled dark raised surface with a quiet plum border; it stays visually quieter than the main action.
- **Hover / Focus:** Hover raises enabled buttons by 1px. Keyboard focus uses a 3px gold outline with a 3px offset.

### Chips
- **Quick bets:** Compact monospace choices on a dark raised surface; hover and selection brighten the border and fill.
- **Segmented options:** A framed group with one brighter filled selection; selected values use white text.

### Cards / Containers
- **Play panel:** Dark framed container with a quiet border and a subtle radial highlight; its header separates from the play area with a thin rule.
- **Game tile:** Clipped art window beside a title, short description, and “Играть” affordance. The current tile uses a brighter gold edge and warmer surface.
- **Balance pill:** A compact bordered container combines the virtual balance, currency selector, and a small gold wallet mark.

### Inputs / Fields
- **Stake stepper:** A numeric amount sits between decrement and increment buttons inside a bordered, dark inset control.
- **Currency selector:** A compact monospace selector sits at the right edge of the balance pill.
- **Focus:** Buttons and selectors use the shared gold keyboard outline; the stake input itself remains visually integrated into the stepper.

### Navigation
Desktop navigation is a quiet row of text buttons with a filled active state. On mobile, use the fixed four-item bar with icon above label; its active item receives a clear gold-accent state.

### Game and Case Imagery
Game tiles and case results use locally bundled images from Steam, Telegram-gift catalogs, and the user's supplied plane reference. Keep the origin for each raster alongside the asset. Interactive game boards may use responsive interface geometry and state animation; do not present an illustrative case result as a real drop table or delivered item.

**The Cabinet-Art Rule.** Use sourced item collages for case covers and locally bundled game images for game tiles; keep titles and play affordances legible beside the art.

## Do's and Don'ts

### Do:
- **Do** keep the page in its dark plum range, using warm gold for value and bright accents for game states.
- **Do** preserve distinct sourced cover art for each game and keep it readable at small sizes.
- **Do** retain each image's source in the asset sidecar and `assets/ASSETS.md`.
- **Do** make the active game, current stake, and round state easy to scan before decorative details.
- **Do** use the fixed four-item lower navigation at mobile widths and account for the safe-area inset.
- **Do** keep Russian interface labels and use the display, body, and mono roles for their established purposes.

### Don't:
- **Don't** replace game-specific art with unrelated decorative stock imagery.
- **Don't** let arcade lighting, gradients, or card chrome obscure the board, balance, or stake controls.
- **Don't** turn every label into monospace or every action into the primary gradient.
- **Don't** flatten the interface into generic equal cards; keep the active game and its board visually dominant.

