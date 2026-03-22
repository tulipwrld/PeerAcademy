import asyncio
from contextlib import asynccontextmanager

import aiofiles
import os
from pathlib import Path

from aiobotocore.session import get_session
from botocore.exceptions import ClientError
from botocore.config import Config

class S3Client:
    def __init__(
            self,
            access_key: str,
            secret_key: str,
            endpoint_url: str,
            bucket_name: str,
    ):
        self.config = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "endpoint_url": endpoint_url,
            "verify": False,
            "config": Config(
                signature_version="s3v4",
                s3={"addressing_style": "path"},
            ),
        }
        self.bucket_name = bucket_name
        self.session = get_session()
        self.endpoint_url = endpoint_url.rstrip("/")

    @asynccontextmanager
    async def get_client(self):
        async with self.session.create_client("s3", **self.config) as client:
            yield client

    async def upload_file(
            self,
            file_path: str,
    ):
        object_name = file_path.split("/")[-1]  # /users/artem/cat.jpg
        try:
            async with self.get_client() as client:
                with open(file_path, "rb") as file:
                    res = await client.put_object(#res = Добавил я
                        Bucket=self.bucket_name,
                        Key=object_name,
                        Body=file,
                    )
                print(f"File {object_name} uploaded to {self.bucket_name}")
                print(res)
                return object_name
        except ClientError as e:
            print(f"Error uploading file: {e}")
            return None

    async def delete_file(self, object_name: str):
        try:
            async with self.get_client() as client:
                await client.delete_object(Bucket=self.bucket_name, Key=object_name)
                print(f"File {object_name} deleted from {self.bucket_name}")
        except ClientError as e:
            print(f"Error deleting file: {e}")

    async def get_file(self, object_name: str, destination_path: str):
        try:
            async with self.get_client() as client:
                response = await client.get_object(Bucket=self.bucket_name, Key=object_name)
                data = await response["Body"].read()
                with open(destination_path, "wb") as file:
                    file.write(data)
                print(f"File {object_name} downloaded to {destination_path}")
        except ClientError as e:
            print(f"Error downloading file: {e}")

    def get_public_url(self, object_name: str):
        return f"{self.endpoint_url}/{self.bucket_name}/{object_name}"


# async def main():
s3_client = S3Client(
    access_key="",
    secret_key="",        
    endpoint_url="https://s3.ru-7.storage.selcloud.ru",
    bucket_name="15minprivate",
    )

# "https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/6627715284_0.jpeg"

# "https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/"
# "https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/"

    # # Проверка, что мы можем загрузить, скачать и удалить файл
    # await s3_client.upload_file("test.txt")
    # await s3_client.get_file("test.txt", "text_local_file.txt")
    # await s3_client.delete_file("test.txt")


# if __name__ == "__main__":
#     asyncio.run(s3_client.upload_file("files/6627715284_0.jpeg"))

    # asyncio.run(s3_client.delete_file("6627715284_0.jpeg"))
