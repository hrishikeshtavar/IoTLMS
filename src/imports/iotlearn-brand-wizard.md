Design the IoTLearn Brand Kit Wizard — the step-by-step onboarding flow for a new school admin 
to set up their institution's branded LMS. Desktop (1280px), modal/full-page wizard style.
Design system: Primary #1A73E8, clean wizard UI.

WIZARD SHELL:
- Top progress stepper (5 steps, horizontal):
  ① School Info  ②  Brand Colors  ③ Logo & Assets  ④ Domain Setup  ⑤ Preview & Launch
  Completed steps: filled primary circle + check, line connector filled primary
  Current step: filled primary circle + step name bold
  Upcoming: gray circle + gray text

STEP 2 ACTIVE — BRAND COLORS (show this step):

Two-panel layout:
LEFT PANEL (Form, 50%):
  Heading: "Brand Your School" + subtext "Your students will see these colors across the platform"
  
  Form sections:
  - School Name inputs: 
    Label "School Name" with 3 sub-inputs stacked: 
    English (filled "DY Patil Institute"), Hindi placeholder "हिंदी में नाम", 
    Marathi placeholder "मराठीत नाव"
  
  - Color Pickers (each row: label + color swatch button + hex input):
    "Primary Color" — swatch showing #1976D2 (blue) + "#1976D2" input
    "Secondary Color" — swatch showing #0D47A1
    "Accent Color" — swatch showing #FF6F00
    "Background Color" — swatch showing #F4F7FF
    
    Color swatch button: 40x40px, rounded 8px, shows actual color, opens native color picker
  
  - Font Selection:
    Label "Heading Font"
    Dropdown showing "Inter" selected — with font preview "Aa" in large text
    Options: Inter, Poppins, Roboto, Mukta (for Devanagari)
  
  - "Upload Brand Assets" section (in Step 3 — show as next step preview below)

  Bottom navigation: "← Back" ghost button + "Continue →" primary button

RIGHT PANEL (Live Preview, 50%, #F4F7FF background):
  Heading "Live Preview" + "Refreshes automatically" caption
  
  Iframed preview mockup (white card, 12px radius, shadow):
  Show a miniaturized version of the Student Dashboard applying the school's brand:
  - Sidebar with the custom primary color
  - Header with school logo placeholder
  - Course cards with custom accent color on buttons
  - School name "DY Patil Institute" in header
  
  "This is how your students will see the platform" caption below

STEP 5 — PREVIEW & LAUNCH (show this step in a second frame):
- Full preview iframe mockup (larger, 80% width)
- Below: checklist of completed setup items with green checkmarks:
  ✅ School info added in 3 languages
  ✅ Brand colors configured
  ✅ Logo uploaded
  ✅ Subdomain: dypatil.iotlearn.in
  ☐ DNS configured (pending — with "How to set up DNS ?" help link)
- "🚀 Launch School" large accent button (full width 400px)
- "DNS Setup Guide" secondary button below