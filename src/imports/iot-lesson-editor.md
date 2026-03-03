Design the IoTLearn Content Management System — the lesson editor used by teachers and 
content managers to create IoT course content. Desktop (1440px), editor-style layout.
Design system: clean and focused, minimal distractions.

LAYOUT (3-panel editor):

LEFT PANEL — Course Structure Tree (260px, #F8FAFF bg):
- Breadcrumb: Courses › Arduino Fundamentals › Lessons
- Course title: "Arduino Fundamentals" with edit pencil icon
- Lesson list (tree structure):
  Module 1: Getting Started (collapse/expand toggle)
    ✅ 01. What is Arduino? (text) — published
    ✅ 02. Setting Up IDE (video) — published  
    ✏️ 03. GPIO Pins (video) — DRAFT (currently selected, highlighted primary bg)
    ➕ Add Lesson
  Module 2: I/O and Sensors
    🔒 04. Analog Inputs — draft
    🔒 05. Sensor Lab — lab
  ➕ Add Module
- Drag handles on each item for reordering

CENTER PANEL — Main Editor (flexible, white):
ACTIVE STATE — Editing lesson "03. GPIO Pins":
  
  Top bar (sticky):
  - Lesson title input (large, inline editable): "03. Digital I/O and GPIO Pins" 
  - Status badge: "DRAFT" amber + dropdown arrow (Draft/In Review/Approved)
  - Right: Auto-save indicator "💾 Saved 2m ago" + "Preview" button + "Submit for Review" primary button
  
  Locale tab bar: English (active) | हिंदी | मराठी
  (Hindi and Marathi tabs show translation completion ✓ or "Needs Translation" warning)
  
  Lesson Type selector (horizontal icon button group):
  🎥 Video | 📄 Text | 🧪 Lab | 📝 Quiz — "Video" selected (primary tinted)
  
  VIDEO LESSON CONTENT:
  - Video upload zone: dashed border rectangle 400px height, cloud upload icon, 
    "Drag MP4 video here or click to upload" text
    OR if uploaded: video thumbnail preview with file name + replace button
  - Thumbnail image upload (below, 160:90px slot)
  - Subtitle files: "Subtitles" row with 3 add buttons: "+ Add EN .vtt" "+ Add HI .vtt" "+ Add MR .vtt"
    Show EN vtt as uploaded (green check)
  
  Below video section — TipTap Rich Text Editor for lesson description/notes:
  - Editor toolbar: B I U | H1 H2 | — bullet | 1. numbered | 🔗 link | </> code block | 
    image | table | undo redo
  - Editor body: placeholder "Add lesson description, key concepts, and notes here..."
  - Current content: a few lines of Lorem Ipsum in English + one highlighted code block 
    showing Arduino syntax with dark background
  
  LESSON SETTINGS ACCORDION at bottom:
  - Prerequisites (course dropdown multiselect)
  - Points/Duration (number inputs)
  - "Must Cache for Offline" toggle
  - Tags (chip input)

RIGHT PANEL — Tools & Meta (280px, #F8FAFF bg):
  LESSON INFO card:
  - Created: Oct 12, 2024 by "Priya Mehta"
  - Last edited: 2 min ago
  - Version: v3.1
  - Views: 0 (not published)
  
  VERSION HISTORY card (collapsible, default expanded):
  - Timeline list (4 versions):
    v3.1 (current) — You, 2 min ago
    v3.0 — Priya M., Oct 14 "Added Hindi subtitle"
    v2.1 — Admin, Oct 10 "Approved for review"  
    v2.0 — You, Oct 8 "Initial upload"
  - "View all versions →" link
  - Each row has "Restore" link on hover
  
  TRANSLATION STATUS card:
  - EN: ✅ Complete (Published)
  - HI: ⚠️ In Progress (70%) — yellow progress bar
  - MR: ❌ Not Started — "Assign Translator" button
  
  COMMENTS card:
  - 2 comment threads with avatar + name + comment text + timestamp
  - One comment with "RESOLVED" green badge
  - Comment input field at bottom