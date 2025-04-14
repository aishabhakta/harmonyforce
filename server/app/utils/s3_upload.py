import boto3
import os
import uuid

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

def upload_file_to_s3(file, folder="uploads"):
    """
    Uploads a file object to S3 and returns the public URL.
    """
    bucket_name = os.getenv("S3_BUCKET_NAME")
    filename = f"{folder}/{uuid.uuid4().hex}_{file.filename}"

    s3.upload_fileobj(
        file,
        bucket_name,
        filename,
        ExtraArgs={"ACL": "public-read", "ContentType": file.content_type}
    )

    return f"https://{bucket_name}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/{filename}"
