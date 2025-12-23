import os
import sys

# Force the current directory into the python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Use the folder name in the import if it's still failing
from route.leave_routes import router as leave_router
from database.bigquery_client import BigQueryClient

app = FastAPI()

# ... (rest of your code)

# CORS config for Angular
origins = ["http://localhost:4200","https://my-frontend-400782765700.us-central1.run.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Using credentials:", os.getenv("GOOGLE_APPLICATION_CREDENTIALS"))

@app.get("/")
def root():
    try:
        # Check if we are in the cloud or local
        creds = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        client = BigQueryClient()
        return {
            "status": "online",
            "creds_found": creds is not None,
            "bigquery": "initialized"
        }
    except Exception as e:
        # This will show you the EXACT error in the browser/logs
        return {"status": "error", "detail": str(e)}

# Include your leave routes
app.include_router(leave_router)
