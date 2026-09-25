# Global Machine-Level Development & Agent Rules

## ⚠️ CRITICAL: Pre-Testing Checklist (READ THIS FIRST)

Before invoking the `/browser` subagent, running builds, or executing test suites, you MUST complete ALL of these steps IN ORDER:

### Step 1: Verify file changes are applied on disk
The user uses the VS Code Antigravity extension which shows **accept/reject popups** for file edits. Edits are NOT applied to disk until the user clicks "Accept". After making file changes:
- **Read back each modified file** using `view_file` or a shell check to confirm the changes are actually on disk.
- If the file on disk does NOT contain your changes, **STOP and tell the user**: "I've made changes to [files]. Please accept them in VS Code before I proceed with testing."
- **Do NOT proceed to testing until you have verified the changes are on disk.**

### Step 2: Confirm server / watcher reloads (only if files changed)
- If dev servers are running, verify they have detected changes and finished recompiling (check logs for completion).
- If servers are NOT running, check if ports are already listening first before launching new ones.

### Step 3: Test
- Only NOW invoke tests, browser subagents, or verification scripts.

### ANTI-PATTERN: The Infinite Loop
**NEVER** do this: make changes → test immediately → see changes not reflected → conclude "it's broken" → make more changes → test again → loop forever.
The root cause is almost always that file changes haven't been accepted by the user yet, or servers haven't reloaded. Always verify Step 1 and Step 2 before concluding something is broken.

---

## Environment Constraints (Windows / PowerShell)

- **npm/npx commands**: Always wrap in `cmd /c "..."` because PowerShell blocks unsigned `.ps1` scripts. E.g. `cmd /c "npm run build"`, `cmd /c "npm start"`, `cmd /c "npm test"`.
- **Chaining commands**: PowerShell does NOT support `&&` for chaining — use `;` (semicolons) instead.
- **Searching text**: PowerShell does NOT support `grep` — use `Select-String` instead.
- **Listing files recursively**: PowerShell does NOT support `dir /s /b` — use `Get-ChildItem -Recurse -Filter`.

## Server & Process Management Rules

- **Check before starting**: Before starting any local dev server, always check if the ports are already listening (e.g. `netstat -ano | findstr ":<port>"`). Do NOT blindly restart servers.
- **Do NOT kill Chrome**: Never run `Stop-Process -Name chrome` before invoking the `/browser` subagent. The browser subagent manages its own Chrome connection. Killing Chrome destroys `DevToolsActivePort` and causes `WebSocket connection failed` errors.
- **Port conflicts**: If a port is in use, kill only the specific PID with `Stop-Process -Id <PID> -Force`, not all node/python processes.

## Build & Test Rules

- **Verify file changes accepted**: Before running build or test commands, confirm that recent file edits were saved and accepted on disk.

## Browser Subagent Rules

- **Do NOT restart servers** just because you're about to invoke the `/browser` subagent. Only start servers if they aren't already running.
- **Do NOT kill Chrome processes** before or after invoking the browser subagent. The subagent handles its own browser lifecycle.
- **One browser invocation at a time**: Don't invoke multiple browser subagents concurrently.

## Model Continuity

- When the user switches models mid-conversation, the new model **MUST** read the conversation context summary and continue from where the previous model left off. Do NOT start from scratch or re-scaffold the project.
- All prior work, decisions, and file changes from earlier in the conversation are valid and should be preserved.
- This applies to ALL models: Claude Opus, Sonnet, Gemini Pro, Flash, or any other. Read the context, understand what was done, and continue.





# DigiHub AGUI Demo - Project Architecture & Specific Rules

> Note: Machine-level rules (Pre-Testing Checklist, Windows/PowerShell constraints, Server/Browser safety, and Model Continuity) are automatically inherited from global configuration (`~/.gemini/config/GEMINI.md`). pasted above

### 1. Start the Python Backend
In the project root:
```powershell
python -m python_server.server
```
The FastAPI backend will start on `http://localhost:8888`.

### 2. Start the Angular Dev Server
In a separate terminal:
```powershell
cmd /c "npm start"

## Project Architecture & Tech Stack

- **Angular App**: `d:\Repos\Angular\digihub-agui-demo` (Angular 22, standalone components)
- **Python Backend**: `d:\Repos\Angular\digihub-agui-demo\python_server\` (FastAPI + AG-UI protocol on port 8888)
- **Legacy Reference**: `d:\Repos\Angular\digihub-ui` (Angular 18, PrimeNG, Tailwind — for UI reference only)
- **CopilotKit Angular**: Uses `@copilotkit/angular` with `selfManagedAgents` + `HttpAgent` from `@ag-ui/client` pointing to `/digihub` — no separate CopilotKit Runtime server needed.
- **Frontend Tools**:
  - `applyIncidentFilters` and `navigateToPage` are registered via `registerFrontendTool` in Angular (`chatbot.ts`) and forwarded to the Python agent over AG-UI.
  - **Do NOT declare them as `FunctionTool` in Python** (`digihub_agent.py`), as declaring them on both ends causes a `Duplicate tool name` error.
- **Proxy**: Angular dev server proxies `/digihub` and `/agentic_chat` to `http://localhost:8888`.
- **Bundle Budgets**: CopilotKit adds ~5MB to the bundle. The `angular.json` budget is set to `"maximumWarning": "2MB"`, `"maximumError": "5MB"`.
