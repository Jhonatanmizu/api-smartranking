# GEMINI Mandates & Workflow

This document defines the specialized instructions for the Gemini CLI agent working on the SmartRanking API.

## 🧠 Core Mandates
- **Stability First**: Always run `yarn build` before considering any task complete.
- **Verification Mandate**: For bug fixes, **Empirically Reproduce** the issue with a test or reproduction script before applying a fix.
- **Doc Integrity**: After adding/updating routes, ensure Swagger decorators in controllers and the `requests.http` file are synchronized.
- **Zero-Any**: Never introduce `any` types. Use `unknown`, `Partial`, or custom types.

## 🛠️ Implementation Workflow
1.  **Research**: Use `grep_search` and `read_file` to map the target module's flow.
2.  **Strategy**: Propose changes based on existing project patterns (see `PROJECT_RULES.md`).
3.  **Action**: 
    - Create/Update Schemas & Interfaces.
    - Implement/Update Service logic (with logging).
    - Create/Update DTOs.
    - Expose via Controller (with Swagger).
4.  **Validate**: Run existing tests and `yarn build`.

## 🐛 Bug Fixing Protocol
- **Analyze**: Locate the source using Grep.
- **Reproduce**: Create a minimal test case or `requests.http` scenario.
- **Fix**: Surgical code correction.
- **Verify**: Confirm the fix with the reproduction case and ensure no regressions.

## 📦 Dependency Management
- **Tool**: Always use `yarn`.
- **Conflicts**: Check for peer dependency warnings during `yarn install`.
- **Audits**: Run `npm audit` (via yarn if needed) periodically to check for security flaws.

## 📝 Change Summaries
- Provide a technical summary of files changed and the rationale behind architectural decisions.
- Do not repeat file contents unless specifically asked.
