from fastapi import APIRouter, HTTPException
from models.leave_model import LeaveRequest, ApproveRejectModel
from services.leave_service import LeaveService

router = APIRouter(prefix="/leave", tags=["Leave Management"])

# -----------------------------------------------------------
# Employee: Create Leave Request
# -----------------------------------------------------------
@router.post("/apply")
def apply_leave(data: LeaveRequest):
    employee_id = data.employee_id  # Sent from Angular
    leave_id_short = LeaveService.create_leave(employee_id, data)
    return {
        "message": "Leave submitted successfully",
        "leave_id": leave_id_short
    }

# -----------------------------------------------------------
# Employee: Get Own Leaves
# -----------------------------------------------------------
@router.get("/my-leaves/{employee_id}")
def my_leaves(employee_id: str):
    return LeaveService.get_user_leaves(employee_id)

# -----------------------------------------------------------
# Manager: Get All Leave Requests
# -----------------------------------------------------------
@router.get("/all")
def all_leaves():
    return LeaveService.get_all_leaves()

# -----------------------------------------------------------
# Manager: Approve / Reject Leave
# -----------------------------------------------------------
@router.post("/{leave_id}/{action}")
def update_leave_status(
    leave_id: str,
    action: str,
    body: ApproveRejectModel
):
    if action not in ["approve", "reject"]:
        raise HTTPException(status_code=400, detail="Invalid action")

    new_status = "approved" if action == "approve" else "rejected"
    LeaveService.update_status(
        leave_id=leave_id,
        status=new_status,
        manager_id=body.manager_id
    )

    return {
        "message": f"Leave {new_status} successfully",
        "leave_id": leave_id
    }
