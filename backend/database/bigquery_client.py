import os
from google.cloud import bigquery
from dotenv import load_dotenv

load_dotenv()

class BigQueryClient:
    def __init__(self):
        project_id = os.getenv("PROJECT_ID")
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        if creds_path and os.path.exists(creds_path):
            # This runs on your LAPTOP
            print("Running locally with Service Account Key")
            self.client = bigquery.Client.from_service_account_json(creds_path, project=project_id)
        else:
            # This runs in GOOGLE CLOUD (App Engine)
            # It uses the "Badge" we discussed—no key file needed!
            print("Running in Cloud - using Default Credentials")
            self.client = bigquery.Client(project=project_id)

# Export ready-to-use client
bigquery_client = BigQueryClient()
