import asyncio
# from typing import List, Optional, Dict, Any

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import Table, Column, Integer, String, MetaData, ARRAY, text, select, update, delete, BigInteger
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

load_dotenv()

# Конфигурация базы данных
user = os.getenv("user")
password = os.getenv("password")
db_name = os.getenv("db_name")
host = os.getenv("host")
port = int(os.getenv("port"))

db_url = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

# Создание движка и сессии
engine = create_async_engine(
    url=db_url,
    echo=True,  # Логи в консоль
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

metadata_obj = MetaData()

users_table = Table(
    "PeerUsers",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("email", String, unique=True),
    Column("name", String),
    Column("description", String),
    Column("picture", String),
    Column("statements", ARRAY(Integer)),
    Column("videos", ARRAY(Integer))
)


class UsersDatabase:
    async def test_connection():
        try:
            async with engine.connect() as conn:
                result = await conn.execute(text("SELECT VERSION()"))
                version = result.scalar()
                print(f"✅ Success! Database version: {version}")
                return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False

    async def create_tables():
        """Создание таблиц"""
        try:
            async with engine.begin() as conn:
                await conn.run_sync(metadata_obj.create_all)
            print("✅ Tables created successfully")
            return True
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            return False

    async def user_add(email: str, name: str, picture: str):
        try:
            async with AsyncSessionLocal() as session:
                adding = users_table.insert().values(
                    email=email,
                    name=name,
                    picture=picture
                )
                result = await session.execute(adding)
                await session.commit()
                
                user_id = result.inserted_primary_key[0]
                print(f"✅ User added with ID: {user_id}")
                return user_id
        except Exception as e:
            print(f"❌ Error: {e}")
            return None
        

    async def get_user_id(email: str):
        try:
            async with AsyncSessionLocal() as session:
                user = select(users_table).where(users_table.c.email == email)
                result = await session.execute(user)
                user = result.fetchone()
                # print(user["id"])
                # return user["id"]
                return user[0]                
        except Exception as e:
            print(f"❌ Error getting user: {e}")
            return None

    async def get_user(id: int):
        try:
            async with AsyncSessionLocal() as session:
                user = select(users_table).where(users_table.c.id == id)
                result = await session.execute(user)
                user = result.fetchone()
                print(user)
                return user#[0]
        except Exception as e:
            print(f"❌ Error: {e}")
            return None

    # Функция добавления/обновления описания
    async def add_description(id: int, description: str):
        """Добавление или обновление описания пользователя"""
        try:
            async with AsyncSessionLocal() as session:
                stmt = (
                    update(users_table)
                    .where(users_table.c.id == id)
                    .values(description=description)
                    .returning(users_table)
                )
                
                result = await session.execute(stmt)
                updated_user = result.scalar_one_or_none()
                
                if updated_user:
                    await session.commit()
                    print(f"✅ Description added for user ID: {id}")
                    return updated_user
                else:
                    print(f"❌ User with ID {id} not found")
                    return None
                    
        except Exception as e:
            print(f"❌ Error adding description: {e}")
            return None

    # Функция добавления статьи (statement)
    async def add_statement(id: int, statement_id: int):
        """Добавление ID статьи в массив statements пользователя"""
        try:
            async with AsyncSessionLocal() as session:
                # Сначала получаем текущего пользователя
                user = select(users_table).where(users_table.c.id == id)
                result = await session.execute(user)
                user_data = result.fetchone()
                
                if not user_data:
                    print(f"❌ User with ID {id} not found")
                    return None
                
                # Получаем текущий массив statements
                current_statements = user_data.statements or []
                
                # Добавляем новый statement_id, если его еще нет
                if statement_id not in current_statements:
                    current_statements.append(statement_id)
                else:
                    print(f"⚠️ Statement ID {statement_id} already exists for user {id}")
                    return user_data
                
                # Обновляем запись
                stmt = (
                    update(users_table)
                    .where(users_table.c.id == id)
                    .values(statements=current_statements)
                    .returning(users_table)
                )
                
                result = await session.execute(stmt)
                updated_user = result.scalar_one_or_none()
                
                if updated_user:
                    await session.commit()
                    print(f"✅ Statement ID {statement_id} added for user ID: {id}")
                    return updated_user
                    
        except Exception as e:
            print(f"❌ Error adding statement: {e}")
            return None

    # Функция добавления видео
    async def add_video(id: int, video_id: int):
        """Добавление ID видео в массив videos пользователя"""
        try:
            async with AsyncSessionLocal() as session:
                # Сначала получаем текущего пользователя
                user = select(users_table).where(users_table.c.id == id)
                result = await session.execute(user)
                user_data = result.fetchone()
                
                if not user_data:
                    print(f"❌ User with ID {id} not found")
                    return None
                
                # Получаем текущий массив videos
                current_videos = user_data.videos or []
                
                # Добавляем новый video_id, если его еще нет
                if video_id not in current_videos:
                    current_videos.append(video_id)
                else:
                    print(f"⚠️ Video ID {video_id} already exists for user {id}")
                    return user_data
                
                # Обновляем запись
                stmt = (
                    update(users_table)
                    .where(users_table.c.id == id)
                    .values(videos=current_videos)
                    .returning(users_table)
                )
                
                result = await session.execute(stmt)
                updated_user = result.scalar_one_or_none()
                
                if updated_user:
                    await session.commit()
                    print(f"✅ Video ID {video_id} added for user ID: {id}")
                    return updated_user
                    
        except Exception as e:
            print(f"❌ Error adding video: {e}")
            return None

    # Функция удаления статьи (statement)
    async def remove_statement(id: int, statement_id: int):
        """Удаление ID статьи из массива statements пользователя"""
        try:
            async with AsyncSessionLocal() as session:
                # Сначала получаем текущего пользователя
                user = select(users_table).where(users_table.c.id == id)
                result = await session.execute(user)
                user_data = result.fetchone()
                
                if not user_data:
                    print(f"❌ User with ID {id} not found")
                    return None
                
                # Получаем текущий массив statements
                current_statements = user_data.statements or []
                
                # Удаляем statement_id, если он существует
                if statement_id in current_statements:
                    current_statements.remove(statement_id)
                else:
                    print(f"⚠️ Statement ID {statement_id} not found for user {id}")
                    return user_data
                
                # Обновляем запись
                stmt = (
                    update(users_table)
                    .where(users_table.c.id == id)
                    .values(statements=current_statements)
                    .returning(users_table)
                )
                
                result = await session.execute(stmt)
                updated_user = result.scalar_one_or_none()
                
                if updated_user:
                    await session.commit()
                    print(f"✅ Statement ID {statement_id} removed for user ID: {id}")
                    return updated_user
                    
        except Exception as e:
            print(f"❌ Error removing statement: {e}")
            return None

    # Функция удаления видео
    async def remove_video(id: int, video_id: int):
        """Удаление ID видео из массива videos пользователя"""
        try:
            async with AsyncSessionLocal() as session:
                # Сначала получаем текущего пользователя
                user = select(users_table).where(users_table.c.id == id)
                result = await session.execute(user)
                user_data = result.fetchone()
                
                if not user_data:
                    print(f"❌ User with ID {id} not found")
                    return None
                
                # Получаем текущий массив videos
                current_videos = user_data.videos or []
                
                # Удаляем video_id, если он существует
                if video_id in current_videos:
                    current_videos.remove(video_id)
                else:
                    print(f"⚠️ Video ID {video_id} not found for user {id}")
                    return user_data
                
                # Обновляем запись
                stmt = (
                    update(users_table)
                    .where(users_table.c.id == id)
                    .values(videos=current_videos)
                    .returning(users_table)
                )
                
                result = await session.execute(stmt)
                updated_user = result.scalar_one_or_none()
                
                if updated_user:
                    await session.commit()
                    print(f"✅ Video ID {video_id} removed for user ID: {id}")
                    return updated_user
                    
        except Exception as e:
            print(f"❌ Error removing video: {e}")
            return None

    async def update_data(id: int, name: str = "Champion", description: str = "-"):
        try:
            async with AsyncSessionLocal() as session:
                stmt = (
                    update(users_table).where(users_table.c.id == id).values(name=name, description=description).returning(users_table)
                )
                
                result = await session.execute(stmt)
                updated_user = result.scalar_one_or_none()
                
                if updated_user:
                    await session.commit()
                    return updated_user

        except Exception as e:
            print(f"❌ Error: {e}")
            return None


async def initialize_database():
    """Инициализация БД"""
    print("🚀 Initializing database...")

    if not await UsersDatabase.test_connection():
        return False
    
    if not await UsersDatabase.create_tables():
        return False
    
    print("✅ Database initialized successfully")
    return True


async def add_user(email: str, name: str, picture: str):
    try:
        res = await UsersDatabase.user_add(email, name, picture)
        return res
    except Exception as e:
        print(f"Ошибка: {e}")
        return False


async def get_id(email: str):
    try: 
        return await UsersDatabase.get_user_id(email)
    except Exception as e:
        print(f"Ошибка: {e}")
        return False

    

async def get_user(id: int):
    try:
        # print(await UsersDatabase.get_user(id))
        return await UsersDatabase.get_user(id)
    except Exception as e:
        print(f"Ошибка: {e}")
        return False


async def update_user_data(id: int, name: str = "Champion", description: str = "-"):
    # res = await UsersDatabase.update_name(id, name)
    res = await UsersDatabase.update_data(id, name, description)
    if res:
        return True
    else:
        return False

# Новые функции-обертки для удобного использования

async def add_user_description(id: int, description: str):
    """Добавление описания пользователю"""
    try:
        return await UsersDatabase.add_description(id, description)
    except Exception as e:
        print(f"Ошибка добавления описания: {e}")
        return False

async def add_user_statement(id: int, statement_id: int):
    """Добавление статьи пользователю"""
    try:
        return await UsersDatabase.add_statement(id, statement_id)
    except Exception as e:
        print(f"Ошибка добавления статьи: {e}")
        return False

async def add_user_video(id: int, video_id: int):
    """Добавление видео пользователю"""
    try:
        return await UsersDatabase.add_video(id, video_id)
    except Exception as e:
        print(f"Ошибка добавления видео: {e}")
        return False

async def remove_user_statement(id: int, statement_id: int):
    """Удаление статьи у пользователя"""
    try:
        return await UsersDatabase.remove_statement(id, statement_id)
    except Exception as e:
        print(f"Ошибка удаления статьи: {e}")
        return False

async def remove_user_video(id: int, video_id: int):
    """Удаление видео у пользователя"""
    try:
        return await UsersDatabase.remove_video(id, video_id)
    except Exception as e:
        print(f"Ошибка удаления видео: {e}")
        return False