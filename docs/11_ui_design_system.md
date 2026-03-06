# UI Design System – TestPilot AI

This document defines the visual design system used across the TestPilot AI application.

The goal is to create a **clean, modern SaaS interface** using TailwindCSS and shadcn/ui components.

---

# Design Principles

The UI should follow these principles:

• Minimalistic interface
• Fast interaction
• Clear hierarchy
• Developer-friendly layout
• Dark mode friendly

The design should resemble modern developer tools such as:

GitHub
Linear
Vercel
Supabase

---

# Color System

Primary Color

Used for primary buttons and highlights.

Primary:
#6366F1

Primary Hover:
#4F46E5

---

Secondary Color

Used for secondary actions.

#64748B

---

Background Colors

Main background:
#0F172A

Card background:
#1E293B

Surface background:
#111827

---

Text Colors

Primary text:
#F8FAFC

Secondary text:
#94A3B8

Muted text:
#64748B

---

Border Colors

Default border:
#334155

Light border:
#475569

---

# Typography

Font Family

Inter

Fallback:
system-ui

---

Font Sizes

Heading 1
32px

Heading 2
24px

Heading 3
20px

Body Text
16px

Small Text
14px

---

Font Weight

Regular
400

Medium
500

Semibold
600

Bold
700

---

# Layout Grid

Main dashboard layout:

Sidebar width:
260px

Content padding:
24px

Max content width:
1400px

---

Page structure

Sidebar
Top navigation
Main content area

---

# Component Design

## Button

Primary Button

Background:
primary color

Text:
white

Border radius:
8px

Padding:
10px 16px

---

Secondary Button

Border:
1px solid border color

Background:
transparent

---

Ghost Button

No background

Hover:
light background

---

# Card

Used for dashboard widgets and outputs.

Card background:
#1E293B

Border:
1px solid #334155

Border radius:
12px

Padding:
20px

---

# Input Fields

Input background:
#111827

Border:
#334155

Border radius:
8px

Focus state:

border color changes to primary

---

# Textarea

Used for requirement input.

Minimum height:
200px

Font:
monospace

---

# Tabs

Used for output sections.

Tabs:

Test Cases
Gherkin
Step Definitions

Active tab:

underline + primary color

---

# Code Viewer

AI outputs displayed inside code editor.

Use:

Monaco Editor

Features:

syntax highlighting
copy button
download button

---

# Sidebar Navigation

Items:

Dashboard
Projects
Generate Tests
History

Active item:

highlighted background

---

# Icons

Icon library:

Lucide React

Common icons:

dashboard
folder
sparkles
history
download
copy

---

# Spacing System

Spacing scale

4px
8px
12px
16px
24px
32px

Use consistent spacing between components.

---

# Animation

Use subtle animations.

Examples:

button hover
tab transitions
loading spinner

Animation duration:

150ms to 250ms

---

# Loading States

While AI generation is running show:

spinner
text message:

"Generating test artifacts..."

---

# Empty States

If no results exist show message:

"No generations yet. Start by generating test cases."

---

# Responsive Design

Minimum supported width:

1024px

Optimized for desktop first.

Tablet support optional.

---

# Accessibility

Ensure:

button labels
keyboard navigation
contrast ratio
focus outlines

---

# Example Page Layout

Generate Tests Page

Left Panel

Requirement input
project selector
generate button

Right Panel

tabs
AI output viewer

---

# Future UI Enhancements

Dark/light theme toggle

drag-and-drop requirement upload

split-screen editing

team collaboration interface
