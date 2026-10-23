# Engineering & Git Conventions

## Naming Conventions
- **SQL Migrations:** `NNN_verb_noun.sql` (e.g., `001_create_users.sql`, `002_add_projects_table.sql`).
- **API Endpoints:** Plural kebab-case nouns prefixed with `/v1/` (e.g., `/v1/users`, `/v1/project-audits`).
- **React Components:** PascalCase file and component names (e.g., `App.tsx`, `UserList.tsx`).

## Error Response Envelope
All backend error responses must return a structured JSON envelope:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human-readable description of the error",
    "requestId": "req_123456"
  }
}
```
