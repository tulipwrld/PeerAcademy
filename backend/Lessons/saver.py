from downloader import download_photo
import os

from S3 import s3_client

async def save_photos(telegram_id: int, files_list: list):
    try:
        users_photos = []
        res = await download_photo(telegram_id, files_list)
        # print(res)
        if not res:
            return False
        for i in range(len(res)):
            await s3_client.upload_file(res[i])
            # users_photos.append(f"https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/{res[i]}")
            users_photos.append(f"https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/{res[i].split('/')[-1]}")
            os.remove(res[i])
        return users_photos
    except Exception as e:
        # print(e)
        print(f"ОШИБКА с сохранением в S3 {e}")
        return False