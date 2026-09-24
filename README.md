# DigiHub AG-UI Demo (Angular + CopilotKit + FastAPI)

A modern, standalone Angular 22 demo demonstrating **Agentic User Interaction (AG-UI)** for SITA DigiHub's Operational Support portal. It integrates an intelligent AI assistant using **CopilotKit Angular** connected to a **Python FastAPI backend** powered by Azure OpenAI and the AG-UI protocol.

---

## 🌟 Key Features

### 1. Natural Language UI Control (Chatbot Driving the UI)
Users can ask the AI assistant in natural language to perform actions across the UI:
- **Filter Incidents**: E.g., *"Show me open incidents in Hamburg"*, *"Show SITA Connect incidents in Hamburg from last week"*, *"Retrieve incidents from Frankfurt"*.
- **Automatic Navigation**: The assistant automatically navigates to relevant pages (e.g., *"Take me to billing"*).
- **Incident Details & Knowledge**: E.g., *"Tell me about CCD012098"*, *"How many high-priority incidents are open?"*.

### 2. Bidirectional & Synced Filtering
- **Manual Column Filters**: Users can also filter manually via inline column search inputs (🔍) and status dropdowns (including **"Not Done (Open)"**).
- **Shared Reactive State**: Both manual filters and assistant-applied filters feed into the same reactive signals (`AguiService`), updating filter pills and data grids seamlessly.
- **Visual Feedback**: Dynamic filter pills display active filters, with indicator labels showing whether a filter was applied by the AI assistant.

### 3. DigiHub Design & Styling
- Styled to match SITA DigiHub legacy look and feel:
  - Deep forest-green sidebar (`#2b3e2b`)
  - Icy-blue grid container (`#bbe8ee`)
  - Orange active filter pills (`#ff782d`)
  - Custom responsive layout with CopilotKit sidebar

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│        Angular 22 Frontend (Port 4200)       │
│  - Standalone Components                     │
│  - @copilotkit/angular + @ag-ui/client       │
│  - Shared AguiService (Signals State)        │
│  - Frontend Tools (applyIncidentFilters,     │
│    navigateToPage)                           │
└───────────────────────▲──────────────────────┘
                        │ HTTP / SSE (Proxy: /digihub)
┌───────────────────────▼──────────────────────┐
│        Python FastAPI Backend (Port 8888)    │
│  - python_server/server.py                   │
│  - AG-UI Protocol Runner                     │
│  - digihub_agent (Azure OpenAI)              │
│  - Path Rewriting Middleware for CopilotKit  │
└──────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20+ (Node v26+ recommended)
- **Python**: 3.12+ (Python 3.13 recommended)
- Azure OpenAI credentials (configured in `.env`)

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
```
The Angular application will start on `http://localhost:4200` with proxy configuration forwarding `/digihub` and `/agentic_chat` to the backend.

---

## 💬 Sample Demo Queries

Try these in the CopilotKit chat sidebar:

| Query | What Happens |
| :--- | :--- |
| **"Show me open incidents in Hamburg"** | Navigates to incidents grid, filters by `Status: Open` and `Location: Hamburg` (shows 6 tickets). |
| **"Show SITA Connect incidents in Hamburg from last week"** | Applies multi-parameter filter (Service + Location + Time Window). |
| **"Retrieve incidents from Frankfurt"** | Displays all Frankfurt incidents without enforcing an "Open" status filter (shows 2 tickets). |
| **"Tell me about CCD012098"** | Assistant reads details from data and replies directly with ticket status and details. |
| **"Take me to billing"** | Assistant triggers `navigateToPage` and opens the Billing view. |

---

## 📁 Project Structure

```
digihub-agui-demo/
├── python_server/
│   ├── __init__.py
│   ├── server.py              # FastAPI server + CORS + AG-UI endpoint
│   └── digihub_agent.py       # Incident agent with context & tool instructions
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── chatbot/       # CopilotSidebar + frontend tool registrations
│   │   │   ├── main-layout/   # Topbar + Left Sidebar + Chatbot layout
│   │   │   ├── sidebar/       # SITA Navigation sidebar
│   │   │   └── topbar/        # Customer header
│   │   ├── pages/
│   │   │   ├── billing/       # Billing page
│   │   │   ├── incidents/     # Incidents table with column search & filter pills
│   │   │   └── operational-support/
│   │   ├── services/
│   │   │   ├── agui.service.ts # Central reactive signals state
│   │   │   └── mock-data.ts    # Incident dataset & filtering logic
│   │   ├── app.config.ts      # CopilotKit provider configuration
│   │   └── app.routes.ts      # Angular routing
│   └── styles.scss            # Global styles and CopilotKit chat overrides
├── proxy.conf.json            # Dev server proxy to port 8888
└── angular.json
```
