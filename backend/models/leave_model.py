from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class LeaveRequest(BaseModel):
    employee_id: str
    leave_type: str
    start_date: date
    end_date: date
    reason: str

class LeaveResponse(BaseModel):
    leave_id_short: str
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    status: str
    created_at: datetime

class ApproveRejectModel(BaseModel):
   manager_id: Optional[str] = None
