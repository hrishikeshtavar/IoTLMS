Design the IoTLearn School Admin Dashboard. Desktop only (1440px).
This is a data-heavy interface — prioritize clarity and scannability.
Design system: Primary #1A73E8, white backgrounds, clean data tables.

LAYOUT:

Left Sidebar (240px, #0F1626 dark navy background):
- Top: IoTLearn logo in white + "Admin Panel" label in primary
- School name: "DY Patil Institute" in white, 14px, with school avatar
- Nav items (white text, 48px each, hover = white 10% bg):
  📊 Dashboard (ACTIVE — white bg left bar)
  👥 Users
  📚 Courses
  📝 Assessments
  💳 Payments
  🎨 Branding
  📢 Announcements
  ⚙️ Settings
- Bottom: "Switch to Student View" ghost white button + admin avatar + name

Main Content:

HEADER ROW:
"Dashboard" H2 title + "Last updated: 2 min ago" caption + Date range picker right 
(showing "Last 30 Days") + Export button

TOP METRIC CARDS ROW (5 cards, equal width):
- Card 1: 👥 Total Students: 342 (↑ +24 this month — green trend)
- Card 2: 📚 Active Enrollments: 891 (↑ +67)
- Card 3: ✅ Course Completions: 156 (↑ +23)
- Card 4: 💰 Revenue: ₹45,600 (↑ +₹8,200)
- Card 5: ⭐ Avg NPS Score: 48 (↑ +3)
Each card: white, 12px radius, Level 1 shadow, colored icon on right, 
trend arrow with delta in small green/red text

CHARTS ROW (two charts side by side):

LEFT CHART — Enrollment Trend (60% width):
- Line chart, 300px height
- X-axis: last 8 weeks (W1–W8)
- Two lines: Enrollments (primary blue) and Completions (success green)
- Area fill under each line (20% opacity)
- Tooltips, legend below
- Card wrapper: white, 12px radius, header "Enrollment Trends" + view selector tabs: 
  Week | Month | Quarter

RIGHT CHART — Course Performance (40% width):  
- Horizontal bar chart showing top 5 courses by completion rate
- Bars in primary blue, completion % labeled at end of each bar
- Card wrapper same style

SECOND ROW:

LEFT — Students Table (65% width):
Card with header "Recent Students" + "View All →" link + "Import CSV" button
Table with columns:
  Student Name (avatar + name) | Class/Batch | Courses | Progress | Last Active | Actions
  Show 8 rows of realistic student data. 
  Progress column: mini progress bar component
  Actions column: 3-dot menu icon
  Table header: sticky, gray background
  Row hover state: light primary tint
  Pagination at bottom: "Showing 1-8 of 342" + page buttons

RIGHT — Quick Actions + Payments (35% width):
  QUICK ACTIONS card:
  - "Import Students" button (with CSV icon)
  - "Add Course" button
  - "Send Announcement" button  
  - "Generate Report" button
  Each button: full width, outline style, icon left

  RECENT PAYMENTS card (below):
  - Header: "Payments" + "View All →"
  - List of 4 payment rows: student name + amount + method badge (UPI/Cash/Online) + date
    UPI = green badge, Cash = orange badge, Online = blue badge

BOTTOM ROW — Analytics Cards (3 equal columns):
- Lab Sessions Heatmap: calendar-style grid (last 4 weeks × 7 days), 
  colored squares (white=no activity, light blue=low, dark blue=high)
- Top Courses: ranked list with position number, course name, enrollment count, progress bar
- Device Usage: donut chart — Mobile 62%, Desktop 31%, Tablet 7% — with legend