# DigiHub AGUI Demo - Project Architecture & Specific Rules

> Note: Machine-level rules (Pre-Testing Checklist, Windows/PowerShell constraints, Server/Browser safety, and Model Continuity) are automatically inherited from global configuration (`~/.gemini/config/GEMINI.md`).

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
