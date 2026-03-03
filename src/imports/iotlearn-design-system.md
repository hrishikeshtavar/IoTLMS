Create a complete design system for "IoTLearn" — a mobile-first Learning Management System 
for IoT and processor education used by schools across India. The platform supports English, 
Hindi, and Marathi (Devanagari script).

BRAND IDENTITY:
The visual language should feel like a premium EdTech product — clean, trustworthy, and 
energetic. Think Coursera meets hardware tinkering. Inspired by circuit boards and embedded 
systems without being gimmicky.

COLOR TOKENS:
- Primary:         #1A73E8  (electric blue — trust, technology)
- Primary Dark:    #0D47A1  (deep navy — depth, authority)
- Accent:          #FF6F00  (amber/orange — IoT hardware energy, CTAs)
- Success:         #1DB954  (green — completion, progress)
- Warning:         #FFC107  (amber — alerts, pending)
- Error:           #E53935  (red — failures, errors)
- Background:      #F4F7FF  (cool near-white)
- Surface:         #FFFFFF
- Surface Alt:     #EEF2FB  (slightly tinted card background)
- Text Primary:    #0F1626
- Text Secondary:  #5C6880
- Text Disabled:   #B0BAC9
- Border:          #DDE3EF
- Border Focus:    #1A73E8

TYPOGRAPHY:
- Display (H1): Inter Bold, 40px/48px, tracking -0.5px
- Heading (H2): Inter SemiBold, 28px/36px
- Subheading (H3): Inter SemiBold, 20px/28px
- Body Large: Inter Regular, 18px/28px
- Body: Inter Regular, 16px/24px
- Caption: Inter Regular, 13px/18px
- Code: JetBrains Mono Regular, 14px/22px
- Devanagari Body (Hindi/Marathi): Noto Sans Devanagari Regular, 16px/29px (line-height 1.8)
- Devanagari Heading: Noto Sans Devanagari SemiBold, 20px/32px

SPACING SCALE: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

BORDER RADIUS:
- Small (chips, badges): 99px
- Medium (inputs, buttons): 8px
- Large (cards): 12px
- XL (modals, sheets): 20px
- Full (avatar): 50%

ELEVATION / SHADOWS:
- Level 1 (card resting):  0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(26,115,232,0.06)
- Level 2 (card hover):    0 4px 16px rgba(26,115,232,0.12)
- Level 3 (dropdown):      0 8px 24px rgba(0,0,0,0.12)
- Level 4 (modal):         0 16px 48px rgba(0,0,0,0.18)

COMPONENT SPECIFICATIONS TO GENERATE:

1. BUTTONS
   - Primary: filled #1A73E8, white text, 8px radius, 40px height (large), 36px (medium), 32px (small)
   - Secondary: outlined #1A73E8, blue text, same sizes
   - Accent CTA: filled #FF6F00, white text — for key actions like "Enroll Now"
   - Ghost: no border, primary text — for tertiary actions
   - Danger: filled #E53935 — for destructive actions
   - Icon Button: 40px square, 8px radius
   - States for all: Default, Hover (+8% brightness), Pressed (-8%), Disabled (40% opacity), Loading (spinner)

2. INPUT FIELDS
   - Text Input: 48px height, 8px radius, 1px border #DDE3EF, 2px focus border #1A73E8
   - Search Input: left-aligned search icon, clear button on right when filled
   - Textarea: same styling, resizable, min 3 rows
   - Select / Dropdown
   - OTP Input: 6 individual 48x56px boxes in a row
   - States: Default, Focused, Filled, Error (red border + error message), Disabled

3. CARDS
   - Course Card: 16:9 thumbnail top, badge overlay (topic chip), card body with title (2 lines max),
     instructor row (avatar + name), metadata row (duration icon + time, level dot), 
     CTA button bottom. Width 280px desktop / full-width mobile.
   - Stat Card: large number (32px bold), icon (24px), label text, subtle left-accent bar in primary color
   - Lab Card: similar to course card but with "SIMULATOR" badge and circuit icon
   - Certificate Card: landscape orientation, gold accent border, school logo placeholder, 
     student name, course name, completion date, download button

4. NAVIGATION COMPONENTS
   - Top App Bar (mobile): 56px height, hamburger left, logo center, icon buttons right
   - Desktop Sidebar: 240px width, logo top, nav items (icon + label, 48px height each), 
     active state = primary-tinted background + primary text + left accent bar, 
     user avatar + name at bottom, collapse toggle
   - Bottom Tab Bar (mobile): 64px height, 5 tabs — Home, Courses, Labs, Progress, Profile. 
     Active tab: primary icon + label. Inactive: #5C6880
   - Breadcrumb: separator ›, current page in primary color
   - Language Switcher: 3 pill buttons — "EN" "हिं" "मरा" grouped, active = primary filled

5. BADGES & CHIPS
   - Topic Chip: Arduino=#4CAF50, ARM=#9C27B0, RISC-V=#E91E63, 8051=#FF5722, 
     Raspberry Pi=#C2185B, IoT=#1A73E8, Edge AI=#00BCD4
   - Difficulty Dot: Beginner=green, Intermediate=amber, Advanced=red — dot + label
   - Status Badge: Draft=gray, In Review=blue, Approved=green, Published=teal, Needs Changes=orange
   - Streak Badge: flame emoji + number + "Day Streak", amber background
   - Offline Badge: cloud-download icon + "Available Offline", teal

6. PROGRESS INDICATORS
   - Progress Ring: circular SVG, 64px outer / 48px inner, primary color stroke, 
     percentage text center, gray track
   - Progress Bar: linear, 8px height, rounded, primary fill, animated
   - Lesson Progress Dot List: small dots in a row, completed=filled primary, 
     current=outlined primary, upcoming=gray

7. AVATAR & USER ELEMENTS
   - Avatar: circular, 32 / 40 / 48 / 64px sizes, initials fallback with random background

8. EMPTY STATES
   - Friendly illustration (line art style, IoT themed — robot/circuit), 
     heading, subtext, optional CTA button
   - States needed: No Courses, No Results, Offline, Loading

9. LOADING STATES
   - Skeleton screens for: Course Card, Stat Card, Lesson List Item
   - Shimmer animation (light gray → lighter gray wave)

10. TOAST / ALERT NOTIFICATIONS
    - Success, Warning, Error, Info variants
    - 4px left border in variant color, icon, title, optional description, dismiss X

Output all components in a single organized Figma frame with a components page layout. 
Use Auto Layout throughout. Name every component with the naming convention:
Component/Variant/State (e.g., Button/Primary/Hover, Card/Course/Default)