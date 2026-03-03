Design 4 mobile screens (375px) for IoTLearn:
1. Offline Mode indicator screen
2. Student Progress dashboard
3. Certificate view screen  
4. Onboarding/Welcome screen for new students

Design system: Primary #1A73E8, Accent #FF6F00, mobile-native feel.

SCREEN 1 — OFFLINE MODE (when device has no internet):

Top bar: school logo center + offline icon right (🔴 Offline)
Offline banner (full width, amber #FFF8E1 bg, amber left border):
  ⚡ "You're offline. Showing downloaded content."
  "Last synced: Today at 10:23 AM"
  
Content shows normally with offline-available indicators:
- Downloaded course cards have cloud-filled green icon ✅
- Lesson list items that are cached show download icon filled green
- Online-only items (like lab simulations) are grayed out with "Online Only" chip

Bottom sticky: "📶 3 lessons ready to sync when online" info bar

SCREEN 2 — STUDENT PROGRESS:

Header: "My Progress" H2 + current date

Streak card (full width, gradient amber bg):
  🔥 "7 Day Streak!" bold white H2
  Calendar grid showing last 14 days — green dots for active days, empty circles for missed
  "Keep it up! Come back tomorrow" white subtext

Overall stats: 2x2 grid of stat cards (white, shadow):
  Courses Enrolled: 6 | Lessons Done: 34
  Labs Completed: 12 | Quiz Avg Score: 84%

Course Progress list (heading "My Courses"):
  Each course row (white card, 12px radius):
  - Course thumbnail (48x48px, rounded 8px) + title + percentage text right
  - Full-width thin progress bar below (primary color fill)
  - Show 4 courses with varying completion: 100%, 65%, 30%, 8%
  - 100% course has "🎓 Certificate Ready" green chip

Badges section: horizontal scroll of achievement badges
  Badge: 64px circle (colored gradient bg) + icon + label below
  Show: "First Login" 🌟 | "3-Day Streak" 🔥 | "Quiz Master" 🧠 | "Lab Rat" 🔬 | "?" locked

SCREEN 3 — CERTIFICATE VIEW:

Landscape-oriented certificate card (displayed at ~90% phone width, with slight rotation -1.5°):
  White card, gold 2px border, 12px radius, elegant shadow
  
  Top: School logo left + IoTLearn logo right (both small)
  Center top: Gold star/seal decoration
  "Certificate of Completion" (elegant serif-style heading, maybe Playfair Display, 18px)
  "This certifies that"
  Student name: "Riya Sharma" (28px bold, primary color, with subtle underline decoration)
  "has successfully completed"
  Course name: "Arduino Fundamentals" (20px SemiBold)
  "with a score of 92%"
  Date: "November 2024" + school name "DY Patil Institute"
  Bottom: Two signature line placeholders + school seal circle

Below certificate card:
  "Share Certificate" icon buttons row: LinkedIn | WhatsApp | Download PDF
  Each button: labeled icon, gray outline pill button

SCREEN 4 — NEW STUDENT WELCOME / ONBOARDING:

Step 1 of 4 — Language Selection:
  Large illustration at top (60% of screen): friendly robot/character holding a circuit board, 
  line art style in primary color palette
  
  "Welcome to IoTLearn! 🎉" H2
  "Choose your language / अपनी भाषा चुनें / आपली भाषा निवडा"
  
  3 large language selection cards (full width, 80px each, tappable):
  [🇬🇧  English — "Learn in English"]  
  [🇮🇳  हिंदी — "हिंदी में सीखें"]
  [🇮🇳  मराठी — "मराठीत शिका"]
  Each card: white bg, 12px radius, left flag/icon, right radio button, hover = primary border

  Step dots at bottom (4 dots, first filled primary)
  "Continue →" primary button disabled until selection made