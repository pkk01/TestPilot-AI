# Database Schema

Database: Supabase PostgreSQL

---

## Users Table

users

id UUID PRIMARY KEY
email TEXT
name TEXT
created_at TIMESTAMP DEFAULT NOW()

---

## Projects Table

projects

id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
name TEXT
description TEXT
created_at TIMESTAMP DEFAULT NOW()

---

## Generations Table

generations

id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
requirement_text TEXT
generation_type TEXT
ai_output JSONB
created_at TIMESTAMP DEFAULT NOW()

generation_type values:

* test_cases
* gherkin
* step_defs

---

## Prompt Templates (Optional)

prompt_templates

id UUID PRIMARY KEY
name TEXT
type TEXT
prompt_text TEXT
created_at TIMESTAMP

---

## ER Diagram (Conceptual)

Users
│
│ 1
▼
Projects
│
│ 1
▼
Generations
