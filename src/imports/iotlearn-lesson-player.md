Design the IoTLearn Lesson Player page — the core learning experience screen.
Create Desktop (1280px) and Mobile (375px) layouts.
Design system: Primary #1A73E8, dark background for player area, white sidebar.

DESKTOP LAYOUT:

Top Navigation Bar (56px, white):
- Left: ← Back to Course (with course title "Arduino Fundamentals")
- Center: Lesson title "03. Digital I/O and GPIO Pins"
- Right: Language selector (EN | हिं | मरा) + Offline toggle (cloud icon) + progress "3/12"

Main Layout (full remaining height, two columns):

LEFT COLUMN — Lesson Content (flex, takes ~75% width):

VIDEO LESSON TYPE (show this state):
- Video player: full width, 16:9 aspect, dark #0F1626 background
  Custom controls bar at bottom of player (dark glass):
  ▶ Play | progress scrubber (filled primary color) | 00:04:23 / 00:18:45 | 
  CC button | Quality (720p) | Speed (1x) | Fullscreen
  Subtitle bar above controls: white text on semi-transparent dark bg showing Hindi subtitle
  
- Below player: Lesson info row: 
  Title "Digital I/O and GPIO Pins" (H2), 
  Right side: bookmark icon button + download icon button + share icon button
  
- Tab bar below: Notes | Transcript | Resources | Comments
  Show "Transcript" tab active: scrollable text with timestamps, 
  Hindi text in Noto Sans Devanagari at 16px line-height 1.8

RIGHT COLUMN — Course Navigation (280px, white, 1px left border, scrollable):
- "Course Content" heading + "3 of 12 complete" 
- Linear progress bar (3/12 filled)
- Lesson list (each row 56px, with status icons):
  ✅ 01. Introduction to Arduino (completed, gray text)
  ✅ 02. Setting Up the IDE (completed)
  ▶ 03. Digital I/O and GPIO (CURRENT — primary bg, bold, play icon)
  🔒 04. Analog Inputs (upcoming, gray)
  🔒 05. PWM and Motors (locked, gray)
  📝 06. Quiz: GPIO Basics (quiz icon, gray)
  🧪 07. Lab: Blink LED (lab icon, green tint)
  ...
- Each completed row has a checkmark. Current row has left accent bar.

Bottom Action Bar (64px, white, 1px top border, sticky):
- Left: ← Previous Lesson button (ghost)
- Center: "Mark as Complete" primary button (or green "Completed ✓" if done)
- Right: Next Lesson → button (primary)

MOBILE LAYOUT (375px):
- Full-screen video player at top (16:9, 211px)
- Below player: lesson title + tab bar (Notes | Transcript | Resources)
- Content area scrollable
- Sticky bottom bar: ← Prev | ☰ Contents | Next →
- Lesson drawer: when ☰ tapped, slides up as bottom sheet with full lesson list

LAB LESSON VARIANT (show alternative state in a separate frame):
Desktop layout: Split screen
- Left 60%: Monaco code editor (dark theme, VS Code style)
  - Tab bar at top: sketch.ino | wiring.cpp
  - Code with syntax highlighting (Arduino C++)
  - Status bar at bottom: Line 24 | Arduino Uno | ● Ready
- Right 40%: 
  - Top half: Wokwi simulator iframe with Arduino circuit visualization
  - Bottom half: Serial Monitor (dark, monospace output text)
  - Toolbar: ▶ Run | ⏹ Stop | 🔄 Reset | 💾 Save
  - Hint system: "💡 Hint 1 of 3" collapsible panel at bottom right

QUIZ LESSON VARIANT (separate frame, mobile):
- Progress dots at top (Q2 of 5, dots row)
- Timer chip top-right: ⏱ 08:42 (amber when under 2 min)
- Question card: white, centered, large text, readable in Devanagari
  "Which function is used to set a pin as OUTPUT in Arduino?"
- 4 answer options as large tap-target cards (full width, 64px height):
  A) pinMode()  — selected = primary border + tinted bg + checkmark
  B) digitalWrite()
  C) analogRead()
  D) Serial.begin()
- Bottom: "Submit Answer" accent button OR "Next Question →" after answering
- Show one option in "correct" state (green bg, ✅ icon) and one in "wrong" state (red, ✗)