# System Architecture – TestPilot AI

## Overview

TestPilot AI follows a modern full-stack architecture using **Next.js as both frontend and backend**, **Supabase for database and authentication**, and **Groq AI API for LLM processing**.

The architecture is designed to be:

* scalable
* serverless
* easy to maintain
* optimized for AI integrations

---

# High Level Architecture

User Browser
↓
Next.js Frontend (React UI)
↓
Next.js API Routes (Backend)
↓
AI Service Layer
↓
Groq LLM API

Database operations are handled by:

Supabase PostgreSQL

---

# Architecture Layers

## 1 Frontend Layer

Responsible for:

* user interface
* requirement input
* displaying AI outputs
* project management UI

Built using:

Next.js App Router
React
TailwindCSS
shadcn/ui

Key UI modules:

Dashboard
Projects
Generate Tests
History

---

## 2 Backend Layer

Backend logic is implemented using **Next.js API Routes**.

Responsibilities:

* AI request processing
* database interactions
* validation
* authentication checks

Example API routes:

/api/generate/testcases
/api/generate/gherkin
/api/generate/stepdefs
/api/projects
/api/history

---

## 3 AI Service Layer

Handles communication with Groq API.

Responsibilities:

* sending prompts to LLM
* formatting prompts
* parsing responses
* validating outputs

Location in project:

lib/ai/

Example files:

lib/ai/generateTestCases.ts
lib/ai/generateGherkin.ts
lib/ai/generateStepDefs.ts

---

## 4 Database Layer

Supabase PostgreSQL stores:

users
projects
generations

Responsibilities:

* store project data
* store AI generation history
* user authentication

Database access handled using:

@supabase/supabase-js

Location:

lib/supabase/client.ts

---

# Request Flow

Example: Generate Test Cases

Step 1
User enters requirement in UI.

Step 2
Frontend sends POST request.

POST /api/generate/testcases

Step 3
API route validates input.

Step 4
API route sends prompt to Groq API.

Step 5
Groq LLM generates test cases.

Step 6
API route stores result in Supabase.

Step 7
Response returned to frontend.

Step 8
Frontend displays output in editor.

---

# Project Folder Structure

app/

dashboard/
projects/
generate/
history/

api/

generate/

testcases/route.ts
gherkin/route.ts
stepdefs/route.ts

projects/route.ts
history/route.ts

---

components/

layout/
ai/
editor/
ui/

---

lib/

ai/
supabase/
utils/

---

types/

api.types.ts
generation.types.ts
project.types.ts

---

# AI Prompt Engine

The prompt engine converts user requirements into structured prompts.

Example:

Requirement input → Prompt template → LLM → Structured output

Prompt templates stored in:

lib/ai/prompts/

Files:

testcasesPrompt.ts
gherkinPrompt.ts
stepDefsPrompt.ts

---

# Output Processing

AI responses are validated before returning.

Validation library:

Zod

Example schema:

TestCaseSchema

Ensures AI returns expected structure.

---

# Security Model

Secrets stored in environment variables.

.env.local

Contains:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GROQ_API_KEY

Never expose API keys in frontend code.

All AI calls handled server-side.

---

# Performance Optimization

Use caching when possible.

Strategies:

* cache AI results
* store previous generations
* reduce duplicate AI requests

---

# Future Architecture Extensions

Possible improvements:

AI vector search using embeddings

Supabase storage for requirement documents

Jira integration

Team collaboration features

Analytics dashboard

---


# Scalability

This architecture supports scaling because:

* serverless backend
* external AI processing
* managed database
* stateless frontend

---

# Development Workflow

1 Create Next.js project
2 Setup Supabase client
3 Configure database tables
4 Implement API routes
5 Integrate Groq AI
6 Build UI components
7 Connect frontend with API
8 Implement generation history
