import os
from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

class BigQueryClient:
    def __init__(self):
        # Use the Project ID from app.yaml env_variables
        project_id = os.getenv("PROJECT_ID", "still-gravity-478807-t5") 
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        if creds_path and os.path.exists(creds_path):
            # Local development
            print(f"Running locally with Service Account Key: {creds_path}")
            self.client = bigquery.Client.from_service_account_json(creds_path, project=project_id)
        else:
            # Google App Engine environment
            print("Running in Cloud - using Application Default Credentials")
            self.client = bigquery.Client(project=project_id)