# UI Architecture & Components

## Layout

Application uses a dashboard layout.

Sidebar Navigation:

Dashboard
Projects
Generate Tests
History

---

## Generate Tests Page

Two-panel layout.

Left Panel:
Requirement input

Right Panel:
AI generated output

Tabs:

Test Cases
Gherkin
Step Definitions

---

## Key Components

### DashboardLayout

Responsible for sidebar and page layout.

---

### RequirementInput

Textarea input where users paste requirement text.

Features:

* character counter
* validation
* placeholder example

---

### ProjectSelector

Dropdown allowing user to select project.

---

### GenerationTabs

Tab component showing:

* Test Cases
* Gherkin
* Step Definitions

---

### AIOutputViewer

Displays AI-generated content.

Features:

* syntax highlighting
* copy button
* download button

Uses Monaco Editor.
