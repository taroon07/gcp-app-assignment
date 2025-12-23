from fastapi import Header, HTTPException
import firebase_admin
from firebase_admin import auth, credentials
from typing import Optional

# -------- Initialize Firebase Admin --------
# This will use GOOGLE_APPLICATION_CREDENTIALS from your .env
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# -------- TOKEN VERIFICATION FUNCTION --------
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        token = authorization.split(" ")[1]  # "Bearer <token>"
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]

        return {"uid": uid}

    except Exception as e:
        print("Token verification failed:", str(e))
        raise HTTPException(status_code=401, detail="Invalid or expired token")
