import os
from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

class BigQueryClient:
    def __init__(self):
        # Fallback to a hardcoded string if env var is missing for debugging
        project_id = os.getenv("PROJECT_ID", "still-gravity-478807-t5") 
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        if creds_path and os.path.exists(creds_path):
            self.client = bigquery.Client.from_service_account_json(creds_path, project=project_id)
        else:
            # In App Engine, this is the safest way
            self.client = bigquery.Client(project=project_id)

# REMOVE THIS LINE: bigquery_client = BigQueryClient()