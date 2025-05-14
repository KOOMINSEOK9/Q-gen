from pydantic import BaseModel
from typing import List

class S3UploadRequest(BaseModel):
    s3Urls: List[str]
    choiceAns: int
    oxAns: int
    shortAns: int