from uuid import uuid4
from database.bigquery_client import BigQueryClient

DATASET = "leave_management"
TABLE = "leave_applications"

# Helper to generate IDs
def generate_ids():
    full_uuid = str(uuid4())
    short_uuid = full_uuid[:9]
    return full_uuid, short_uuid

# Initialize the client for use in this service
bq_service = BigQueryClient()

class LeaveService:

    @staticmethod
    def create_leave(employee_id: str, data):
        full_id, short_id = generate_ids()

        query = f"""
        INSERT INTO `{DATASET}.{TABLE}`
        (leave_id, employee_id, leave_type, start_date, end_date, reason, status, applied_at)
        VALUES (
            '{full_id}',
            '{employee_id}',
            '{data.leave_type}',
            '{data.start_date}',
            '{data.end_date}',
            '{data.reason}',
            'pending',
            CURRENT_TIMESTAMP()
        )
        """
        # Use bq_service.client
        bq_service.client.query(query).result()
        return short_id

    @staticmethod
    def get_user_leaves(employee_id: str):
        query = f"""
        SELECT leave_id, leave_type, start_date, end_date, reason, status, applied_at
        FROM `{DATASET}.{TABLE}`
        WHERE employee_id = '{employee_id}'
        ORDER BY applied_at DESC
        """
        results = bq_service.client.query(query).result()
        return [dict(row) for row in results]

    @staticmethod
    def get_all_leaves():
        query = f"""
        SELECT leave_id, employee_id, leave_type, start_date, end_date, reason, status, applied_at
        FROM `{DATASET}.{TABLE}`
        ORDER BY applied_at DESC
        """
        results = bq_service.client.query(query).result()
        return [dict(row) for row in results]

    @staticmethod
    def update_status(leave_id: str, status: str, manager_id: str):
        query = f"""
        UPDATE `{DATASET}.{TABLE}`
        SET status = '{status}'
        WHERE leave_id = '{leave_id}'
        """
        bq_service.client.query(query).result()
        return True