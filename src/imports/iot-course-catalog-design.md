Design the IoTLearn Course Catalog page. Desktop (1280px) with left filter sidebar 
and main grid, plus Mobile (375px) with collapsible filter bottom sheet.
Design system: Primary #1A73E8, Inter font, Background #F4F7FF.

DESKTOP LAYOUT:

Left Filter Sidebar (280px, white card, 12px radius, sticky):
- "Filters" heading (H3) + "Clear all" link right-aligned in primary color
- Search input (48px, magnifier icon inside, placeholder "Search courses...")
- Divider then filter sections (each collapsible with ▼ icon):

  TOPIC (checkboxes):
  ☐ Arduino / AVR  |  badge count "12"
  ☐ Raspberry Pi  |  "8"
  ☐ ARM Cortex  |  "6"
  ☐ RISC-V  |  "4"
  ☐ Intel 8051  |  "7"
  ☐ IoT Protocols  |  "5"
  ☐ PCB Design  |  "3"
  ☐ Edge AI  |  "2"
  ☐ IoT Security  |  "4"

  DIFFICULTY (radio buttons):
  ○ All Levels  ○ Beginner  ○ Intermediate  ○ Advanced

  LANGUAGE (checkboxes):
  ☐ English  ☐ हिंदी (Hindi)  ☐ मराठी (Marathi)

  DURATION:
  ○ Any  ○ Under 2 hrs  ○ 2–5 hrs  ○ 5–10 hrs  ○ 10+ hrs

  LAB INCLUDED: Toggle switch ON/OFF

- "Apply Filters" primary button full width at bottom of sidebar

Main Content Area:
- Top row: "Showing 47 courses" left + Sort dropdown right ("Sort by: Most Popular ▼")
- Course Grid: 3-column, 16px gap, Course Cards (use component from design system)
  Show 9 cards. Make them varied: different topic colors, different progress states, 
  some with language flags showing EN+HI+MR availability, some EN only.
  Include one card with "ENROLLED" green ribbon corner badge.
  Include one card with "NEW" amber badge.
  Include one card with "FREE PREVIEW" chip on thumbnail.
- Pagination at bottom: ← 1 2 3 4 5 →

COURSE CARD (detailed spec for this page):
- 16:9 thumbnail (gradient bg if no image — use topic color gradient)
  Topic chip overlay on thumbnail top-left
  Duration chip overlay bottom-right (dark glass effect "4.5 hrs")
- Card body (16px padding):
  - Course title: 2 lines max, 16px SemiBold
  - Instructor row: small avatar + instructor name in gray
  - Language availability: small flag emojis or "EN | HI | MR" compact
  - Bottom row: difficulty dot + label left | Star rating right (⭐ 4.8 · 234 students)
  - CTA: "Enroll Now" accent button OR "Continue" primary button OR "Preview" ghost button

MOBILE LAYOUT (375px):
- Top: page title "Course Catalog" + filter icon button right (shows filter count badge)
- Search bar full width below
- Horizontal scroll topic chips (color-coded: Arduino=green, ARM=purple etc.)
- Results count row + sort button
- 1-column card list (full width cards, landscape card style: thumbnail left 120px, 
  content right)
- Filter Bottom Sheet (when filter icon tapped): slides up from bottom, 90% screen height,
  drag handle at top, all filters inside scrollable area, 
  sticky "Show 47 Results" button at bottom