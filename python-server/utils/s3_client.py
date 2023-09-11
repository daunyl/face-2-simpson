import os
import boto3

from dotenv import load_dotenv

load_dotenv()


class S3Client:
    def __init__(self):
        self.AWS_ACCESS_KEY = os.getenv("AMAZON_ACCESS_KEY")
        self.AWS_SECRET_KEY = os.getenv("AMAZON_SECRET_KEY")
        self.AWS_REGION = os.getenv("AWS_REGION")
        self.AWS_BUCKET = os.getenv("AWS_BUCKET")

        self.s3 = boto3.client(
            "s3",
            aws_access_key_id=self.AWS_ACCESS_KEY,
            aws_secret_access_key=self.AWS_SECRET_KEY,
            region_name=self.AWS_REGION,
        )

    def get_s3_object(self, key):
        obj = self.s3.get_object(Bucket=self.AWS_BUCKET, Key=key)
        return obj["Body"]

    def put_s3_object(self, body, key, bucket=None):
        if bucket is None:
            bucket = self.AWS_BUCKET
        obj = self.s3.put_object(Body=body, Bucket=bucket, Key=key)
        return None

    def get_s3_objects_list(self, bucket=None):
        if bucket is None:
            bucket = self.AWS_BUCKET
        obj = self.s3.list_objects_v2(Bucket=bucket)
        return obj.get("Contents", [])

    def delete_s3_object(self, key, bucket=None):
        if bucket is None:
            bucket = self.AWS_BUCKET
        obj = self.s3.delete_object(Bucket=bucket, Key=key)
        return obj["DeleteMarker"]
