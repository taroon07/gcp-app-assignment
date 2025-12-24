import os
import sys

# Ensure the backend directory is in the path
# This helps if GAE starts the app from one level up
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import classes carefully
try:
    from route.leave_routes import router as leave_router
    from database.bigquery_client import BigQueryClient
except ImportError as e:
    print(f"CRITICAL IMPORT ERROR: {e}")
    # This print will show up in your Google Cloud Logs 
    # even if uvicorn truncates the traceback
    raise e

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:4200",
    "https://my-frontend-400782765700.us-central1.run.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "FastAPI is running",
        "environment": "production"
    }

# Include routers
app.include_router(leave_router)