Design the IoTLearn public landing and login page. Create both Mobile (375px) and 
Desktop (1440px) frames side by side. Use the IoTLearn design system: 
Primary #1A73E8, Accent #FF6F00, Background #F4F7FF, Inter font.

DESKTOP LAYOUT (1440px):

Navigation Bar (64px height, white background, 1px bottom border):
- Left: IoTLearn logo (blue wordmark + circuit-node icon)
- Center: Nav links — Features, Courses, Pricing, About
- Right: Language switcher (EN | हिं | मरा pill group) + "Sign In" ghost button + 
  "Get Started" accent button

Hero Section (full-width, 600px height):
- Background: diagonal gradient from #1A73E8 (left) to #0D47A1 (right) with subtle 
  circuit-board pattern overlay at 5% opacity (dots and lines forming a PCB trace pattern)
- Left half: 
  - Eyebrow label chip: "🔬 India's #1 IoT LMS"
  - H1: "Learn IoT. Build Real Things." (56px, white, bold)
  - Subheading: "Hands-on courses in Arduino, Raspberry Pi, ARM, RISC-V and more — 
    delivered in English, Hindi & Marathi." (18px, white at 85% opacity)
  - Two CTA buttons side by side: "Start Free Trial" (white filled, primary text) + 
    "Watch Demo →" (outline white)
  - Trust strip below buttons: 3 avatar circles (students) + "Join 2,000+ students 
    learning IoT" text
- Right half: 
  - Floating mockup card showing the Student Dashboard — course cards with progress rings, 
    IoT topic badges. Card has white background, Level 2 shadow, 20px radius. 
    Slightly tilted 3° clockwise.

Stats Strip (80px height, white background):
- 4 stats in a row with vertical dividers: "2,000+ Students" | "50+ IoT Courses" | 
  "3 Languages" | "99.5% Uptime"
- Each stat: bold large number in primary blue + label in gray

Features Grid Section (white background, 80px vertical padding):
- Section heading: "Everything Your School Needs" centered
- 3-column grid of feature cards (no card border, just icon + title + description):
  1. 📡 Offline Learning — "Download courses, watch videos, take quizzes without internet"
  2. 🧪 Lab Simulator — "Browser-based Wokwi + circuit simulator, no hardware needed"
  3. 🌐 Multilingual — "Full support for English, Hindi (हिंदी), and Marathi (मराठी)"
  4. ✅ Auto-graded Quizzes — "MCQs, code labs, fill-in-the-blank with instant feedback"
  5. 🎓 Completion Certificates — "Branded PDF certificates auto-generated on completion"
  6. 🏫 White-labeled — "Your school logo, colors, and custom domain — zero extra cost"

Curriculum Section (light blue tinted background #EEF5FF):
- Heading: "What You'll Learn" left-aligned
- Horizontal scrollable topic cards in 2 rows:
  Row 1: Arduino/AVR | Raspberry Pi | ARM Cortex | RISC-V
  Row 2: Intel 8051 | IoT Protocols | PCB Design | Edge AI
  Each topic card: 160x100px, colored gradient background (unique per topic), 
  white icon + topic name

Pricing Section (white background):
- 4 pricing cards in a row, "School" plan card is highlighted (primary border + "Most Popular" badge):
  - Starter: ₹2,999/yr, 100 students, 10 courses, English only
  - School: ₹8,999/yr, 500 students, unlimited courses, 3 languages (HIGHLIGHTED)
  - Institution: ₹19,999/yr, 5,000 students, custom domain, API access
  - Enterprise: Custom, unlimited, on-premise option

Footer (dark navy #0D47A1 background, white text):
- Logo + tagline left, 3 link columns center (Product, Support, Company), 
  language switcher right
- Bottom bar: copyright + "Powered by IoTLearn"

LOGIN CARD (right side of hero on desktop, OR full-screen centered card on mobile):
- White card, 400px wide, 20px radius, Level 3 shadow
- School logo placeholder at top center (80px circle with dotted border)
- "Welcome back" H3 heading
- Email or Phone Number input (label above field)
- Password input (with show/hide toggle eye icon)
- "Forgot Password?" link right-aligned below password
- "Sign In" primary button full width, 48px height
- Divider "— or —"
- "Sign in with OTP" ghost button full width
- Bottom: "New school? Contact us →" small gray text

MOBILE LAYOUT (375px):
- Sticky top bar: logo left, "Sign In" button right (text only)
- Hero: full-width gradient, stacked vertically, illustration below text
- Stats in 2x2 grid
- Features: single column cards
- CTA banner: "Get started for ₹2,999/year →" full-width accent button
- Footer: simplified, accordion for link sections