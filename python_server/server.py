"""DigiHub AGUI Demo Server.

FastAPI server hosting the DigiHub agent with AG-UI protocol support.
Reuses the same pattern as the React demo's python_server but with a
DigiHub-specific agent for incident management.
"""

import os
import re

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from agent_framework.openai import OpenAIChatCompletionClient
from agent_framework_ag_ui import add_agent_framework_fastapi_endpoint

from .digihub_agent import digihub_agent

# Load local .env
load_dotenv()

app = FastAPI(title="DigiHub AGUI Demo Server")

# CORS - allow Angular dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:4300", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CopilotKitV2PathRewriteMiddleware(BaseHTTPMiddleware):
    """Rewrite CopilotKit V2 paths to match AG-UI endpoint format."""

    async def dispatch(self, request: Request, call_next):
        # Rewrite /{agent_id}/agent/{agent_id}/run -> /{agent_id}
        # Rewrite /{agent_id}/agent/{agent_id}/connect -> /{agent_id}
        match = re.match(r"^/([^/]+)/agent/\1/(run|connect)$", request.url.path)
        if match:
            agent_id = match.group(1)
            request.scope["path"] = f"/{agent_id}"

        # Mock the stop endpoint
        if re.match(r"^/([^/]+)/agent/\1/stop/.*$", request.url.path):
            return JSONResponse({"status": "ok"})

        return await call_next(request)


app.add_middleware(CopilotKitV2PathRewriteMiddleware)


# Info endpoint for CopilotKit handshake
@app.get("/{agent_id}/info")
def get_agent_info(agent_id: str):
    return {
        "endpoints": [{"url": f"/{agent_id}"}],
        "agents": {
            agent_id: {
                "name": agent_id,
                "description": f"{agent_id} Agent",
                "capabilities": {},
            }
        },
    }


# Create the chat client
chat_client = OpenAIChatCompletionClient(
    model=os.getenv("OPENAI_DEPLOYMENT_NAME_GPT_5_2_AGENT", "gpt-5.2"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY_GPT_5_2_AGENT"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT_GPT_5_2_AGENT"),
    api_version=os.getenv("OPENAI_API_VERSION_GPT_5_2_AGENT"),
)

# Register the DigiHub agent endpoint
add_agent_framework_fastapi_endpoint(app, digihub_agent(chat_client), "/digihub")

# Also register a simple chat endpoint for fallback
from agent_framework_ag_ui_examples.agents import simple_agent
add_agent_framework_fastapi_endpoint(app, simple_agent(chat_client), "/agentic_chat")


def main():
    port = int(os.getenv("PORT", "8888"))
    uvicorn.run(
        "python_server.server:app",
        host="0.0.0.0",
        port=port,
        reload=True,
    )


if __name__ == "__main__":
    main()

