import os
from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

class BigQueryClient:
    def __init__(self):
        project_id = os.getenv("PROJECT_ID", "still-gravity-478807-t5") 
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        # FIX: Check if the path looks like a Windows path or if file doesn't exist
        if creds_path and os.path.exists(creds_path) and ":/" not in creds_path:
            print(f"Running locally with Service Account Key")
            self.client = bigquery.Client.from_service_account_json(creds_path, project=project_id)
        else:
            # This is what App Engine SHOULD use
            print("Detected Cloud environment or invalid local path - using Default Credentials")
            # Clear the env var if it's a broken local path to prevent the library from tripping
            if creds_path and ":/" in creds_path:
                os.environ.pop("GOOGLE_APPLICATION_CREDENTIALS", None)
            
            self.client = bigquery.Client(project=project_id)