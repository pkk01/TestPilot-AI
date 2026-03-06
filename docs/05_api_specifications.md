# API Specifications

Backend: Next.js API Routes

---

## Generate Test Cases

POST /api/generate/testcases

Request:

{
requirement: string
}

Response:

{
testCases: []
}

---

## Generate Gherkin

POST /api/generate/gherkin

Request:

{
requirement: string
}

Response:

{
feature: string
}

---

## Generate Step Definitions

POST /api/generate/stepdefs

Request:

{
gherkin: string
}

Response:

{
javaCode: string
}

---

## Projects

POST /api/projects
GET /api/projects

---

## Generation History

GET /api/history
