# https://7510ee71-be04-4432-82ff-85c3551baf7f.selstorage.ru/

import aiofiles
import os
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent.parent
FILES_DIR = BASE_DIR / "files" #"server" /

async def download_photo(telegram_id: int, photo_list: list):
    try:
        new_user_photos = []
        for i in range(len(photo_list)):
            filename = f"{telegram_id}_{i}.jpeg"
            file_path = os.path.join(FILES_DIR / filename)#/ f"{1}",
            os.makedirs(FILES_DIR, exist_ok=True)#/ f"{1}",
            # Сохраняем файл асинхронно
            async with aiofiles.open(file_path, "wb") as f:
                # await f.write(await uploaded_file.read())
                await f.write(await photo_list[i].read())
                new_user_photos.append(file_path)
        print(new_user_photos)
        return new_user_photos
    except Exception as e:
        print(f"ОШИБКА со скачиванием фото: {e}")
        return None
    # print(new_user_photos)