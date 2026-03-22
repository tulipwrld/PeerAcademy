import asyncio
# from typing import List, Optional, Dict, Any

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import Table, Column, Integer, String, MetaData, ARRAY, text, select, update, delete, BigInteger, bindparam
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

# Обновленное определение таблицы
states_table = Table(
    "PeerStates",
    metadata_obj,
    Column("id", Integer, primary_key=True),
    Column("name", String),
    Column("text", String),  # Добавлено поле text
    Column("owner", Integer),
    Column("tags", ARRAY(String)),
    Column("pictures", ARRAY(String))
)


class StatesDatabase:
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
                # Для уже существующей таблицы create_all не добавляет новые колонки.
                await conn.execute(
                    text('ALTER TABLE "PeerStates" ADD COLUMN IF NOT EXISTS "text" VARCHAR')
                )
            print("✅ Tables created successfully")
            return True
        except Exception as e:
            print(f"❌ Error creating tables: {e}")
            return False

    # Основные CRUD операции
    # async def state_add(name: str, text: str, owner: int, tags: list = None, pictures: list = None):
    #     """Добавление нового состояния"""
    #     try:
    #         async with AsyncSessionLocal() as session:
    #             adding = states_table.insert().values(
    #                 name=name,
    #                 text=text,
    #                 owner=owner,
    #                 tags=tags or [],
    #                 pictures=pictures or []
    #             )
    #             result = await session.execute(adding)
    #             await session.commit()
                
    #             state_id = result.inserted_primary_key[0]
    #             print(f"✅ State added with ID: {state_id}")
    #             return state_id
    #     except Exception as e:
    #         print(f"❌ Error adding state: {e}")
    #         return None

    @staticmethod
    async def state_add(name: str, text: str, owner: int, tags: list = None, pictures: list = None):
        """Добавление нового состояния"""
        try:
            async with AsyncSessionLocal() as session:
                # Вставляем данные
                adding = states_table.insert().values(
                    name=name,
                    text=text,
                    owner=owner,
                    tags=tags or [],
                    pictures=pictures or []
                )
                
                result = await session.execute(adding)
                await session.commit()
                
                # Получаем ID из inserted_primary_key
                # Это список, берем первый элемент
                state_id = result.inserted_primary_key[0]
                
                print(f"✅ State added with ID: {state_id}")
                return state_id
                
        except Exception as e:
            print(f"❌ Error adding state: {e}")
            import traceback
            traceback.print_exc()
            return None

    async def get_state(id: int):
        """Получение состояния по ID"""
        try:
            async with AsyncSessionLocal() as session:
                query = text(
                    """
                    SELECT
                        s.id,
                        s.name,
                        s."text",
                        s.owner,
                        s.tags,
                        s.pictures,
                        u.name AS owner_name,
                        u.picture AS owner_picture
                    FROM "PeerStates" s
                    LEFT JOIN "PeerUsers" u ON u.id = s.owner
                    WHERE s.id = :id
                    LIMIT 1
                    """
                ).bindparams(bindparam("id", type_=Integer))
                result = await session.execute(query, {"id": id})
                row = result.mappings().first()

                if row:
                    state = {
                        "id": row["id"],
                        "name": row["name"],
                        "text": row["text"],
                        "owner": row["owner"],
                        "tags": row["tags"] or [],
                        "pictures": row["pictures"] or [],
                        "owner_name": row["owner_name"],
                        "owner_picture": row["owner_picture"],
                    }
                    print(f"✅ State found: {state}")
                    return state

                print(f"❌ State with ID {id} not found")
                return None
        except Exception as e:
            print(f"❌ Error getting state: {e}")
            return None

    async def get_state_by_owner(owner_id: int):
        """Получение всех состояний пользователя по ID владельца"""
        try:
            async with AsyncSessionLocal() as session:
                states = select(states_table).where(states_table.c.owner == owner_id)
                result = await session.execute(states)
                states_data = result.fetchall()
                
                print(f"✅ Found {len(states_data)} states for owner {owner_id}")
                return states_data
        except Exception as e:
            print(f"❌ Error getting states by owner: {e}")
            return None

    async def get_all_states():
        """Получение всех состояний"""
        try:
            async with AsyncSessionLocal() as session:
                states = select(states_table)
                result = await session.execute(states)
                states_data = result.fetchall()
                
                print(f"✅ Found {len(states_data)} total states")
                return states_data
        except Exception as e:
            print(f"❌ Error getting all states: {e}")
            return None

    @staticmethod
    async def search_by_tags(tags: list[str]):
        """Поиск состояний по тегам с сортировкой по числу совпадений"""
        try:
            normalized_tags = [tag.strip().lower() for tag in tags if isinstance(tag, str) and tag.strip()]
            if not normalized_tags:
                return []

            async with AsyncSessionLocal() as session:
                query = text(
                    """
                    SELECT
                        s.id,
                        s.name,
                        s."text",
                        s.owner,
                        s.tags,
                        s.pictures,
                        u.name AS owner_name,
                        u.picture AS owner_picture,
                        (
                            SELECT COUNT(DISTINCT matched.tag)
                            FROM unnest(COALESCE(s.tags, ARRAY[]::varchar[])) AS matched(tag)
                            WHERE lower(matched.tag) = ANY(:search_tags)
                        ) AS match_count
                    FROM "PeerStates" s
                    LEFT JOIN "PeerUsers" u ON u.id = s.owner
                    WHERE EXISTS (
                        SELECT 1
                        FROM unnest(COALESCE(s.tags, ARRAY[]::varchar[])) AS candidate(tag)
                        WHERE lower(candidate.tag) = ANY(:search_tags)
                    )
                    ORDER BY match_count DESC, s.id DESC
                    """
                ).bindparams(bindparam("search_tags", type_=ARRAY(String)))

                result = await session.execute(query, {"search_tags": normalized_tags})
                rows = result.mappings().all()

                states = []
                for row in rows:
                    states.append({
                        "id": row["id"],
                        "name": row["name"],
                        "text": row["text"],
                        "owner": row["owner"],
                        "tags": row["tags"] or [],
                        "pictures": row["pictures"] or [],
                        "owner_name": row["owner_name"],
                        "owner_picture": row["owner_picture"],
                        "match_count": row["match_count"] or 0,
                    })

                print(f"✅ Found {len(states)} states by tags: {normalized_tags}")
                return states
        except Exception as e:
            print(f"❌ Error searching states by tags: {e}")
            import traceback
            traceback.print_exc()
            return None

    @staticmethod
    async def get_feed(limit: int = 50):
        """Получение ленты состояний с данными автора"""
        try:
            async with AsyncSessionLocal() as session:
                query = text(
                    """
                    SELECT
                        s.id,
                        s.name,
                        s."text",
                        s.owner,
                        s.tags,
                        s.pictures,
                        u.name AS owner_name,
                        u.picture AS owner_picture
                    FROM "PeerStates" s
                    LEFT JOIN "PeerUsers" u ON u.id = s.owner
                    ORDER BY s.id DESC
                    LIMIT :limit
                    """
                ).bindparams(bindparam("limit", type_=Integer))

                result = await session.execute(query, {"limit": limit})
                rows = result.mappings().all()

                states = []
                for row in rows:
                    states.append({
                        "id": row["id"],
                        "name": row["name"],
                        "text": row["text"],
                        "owner": row["owner"],
                        "tags": row["tags"] or [],
                        "pictures": row["pictures"] or [],
                        "owner_name": row["owner_name"],
                        "owner_picture": row["owner_picture"],
                    })

                print(f"✅ Loaded {len(states)} feed states")
                return states
        except Exception as e:
            print(f"❌ Error getting feed states: {e}")
            import traceback
            traceback.print_exc()
            return None

    # Функции обновления
    async def update_state_name(id: int, new_name: str):
        """Изменение имени состояния"""
        try:
            async with AsyncSessionLocal() as session:
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(name=new_name)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ State name updated for ID: {id}")
                    return updated_state
                else:
                    print(f"❌ State with ID {id} not found")
                    return None
                    
        except Exception as e:
            print(f"❌ Error updating state name: {e}")
            return None

    async def update_state_text(id: int, new_text: str):
        """Обновление текста состояния"""
        try:
            async with AsyncSessionLocal() as session:
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(text=new_text)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ State text updated for ID: {id}")
                    return updated_state
                else:
                    print(f"❌ State with ID {id} not found")
                    return None
                    
        except Exception as e:
            print(f"❌ Error updating state text: {e}")
            return None

    async def update_state(id: int, name: str = None, text: str = None):
        """Обновление имени и/или текста состояния"""
        try:
            async with AsyncSessionLocal() as session:
                # Собираем только те поля, которые переданы
                values = {}
                if name is not None:
                    values['name'] = name
                if text is not None:
                    values['text'] = text
                
                if not values:
                    print(f"⚠️ No values to update for state {id}")
                    return await StatesDatabase.get_state(id)
                
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(**values)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ State updated for ID: {id}")
                    return updated_state
                else:
                    print(f"❌ State with ID {id} not found")
                    return None
                    
        except Exception as e:
            print(f"❌ Error updating state: {e}")
            return None

    # Функции для работы с тегами
    async def add_tag(id: int, tag: str):
        """Добавление тега в массив tags"""
        try:
            async with AsyncSessionLocal() as session:
                # Получаем текущее состояние
                state = select(states_table).where(states_table.c.id == id)
                result = await session.execute(state)
                state_data = result.fetchone()
                
                if not state_data:
                    print(f"❌ State with ID {id} not found")
                    return None
                
                # Получаем текущий массив tags
                current_tags = state_data.tags or []
                
                # Добавляем новый тег, если его еще нет
                if tag not in current_tags:
                    current_tags.append(tag)
                else:
                    print(f"⚠️ Tag '{tag}' already exists for state {id}")
                    return state_data
                
                # Обновляем запись
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(tags=current_tags)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ Tag '{tag}' added for state ID: {id}")
                    return updated_state
                    
        except Exception as e:
            print(f"❌ Error adding tag: {e}")
            return None

    async def remove_tag(id: int, tag: str):
        """Удаление тега из массива tags"""
        try:
            async with AsyncSessionLocal() as session:
                # Получаем текущее состояние
                state = select(states_table).where(states_table.c.id == id)
                result = await session.execute(state)
                state_data = result.fetchone()
                
                if not state_data:
                    print(f"❌ State with ID {id} not found")
                    return None
                
                # Получаем текущий массив tags
                current_tags = state_data.tags or []
                
                # Удаляем тег, если он существует
                if tag in current_tags:
                    current_tags.remove(tag)
                else:
                    print(f"⚠️ Tag '{tag}' not found for state {id}")
                    return state_data
                
                # Обновляем запись
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(tags=current_tags)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ Tag '{tag}' removed for state ID: {id}")
                    return updated_state
                    
        except Exception as e:
            print(f"❌ Error removing tag: {e}")
            return None

    # Функции для работы с картинками
    async def add_picture(id: int, picture: str):
        """Добавление картинки в массив pictures"""
        try:
            async with AsyncSessionLocal() as session:
                # Получаем текущее состояние
                state = select(states_table).where(states_table.c.id == id)
                result = await session.execute(state)
                state_data = result.fetchone()
                
                if not state_data:
                    print(f"❌ State with ID {id} not found")
                    return None
                
                # Получаем текущий массив pictures
                current_pictures = state_data.pictures or []
                
                # Добавляем новую картинку, если ее еще нет
                if picture not in current_pictures:
                    current_pictures.append(picture)
                else:
                    print(f"⚠️ Picture '{picture}' already exists for state {id}")
                    return state_data
                
                # Обновляем запись
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(pictures=current_pictures)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ Picture '{picture}' added for state ID: {id}")
                    return updated_state
                    
        except Exception as e:
            print(f"❌ Error adding picture: {e}")
            return None

    async def remove_picture(id: int, picture: str):
        """Удаление картинки из массива pictures"""
        try:
            async with AsyncSessionLocal() as session:
                # Получаем текущее состояние
                state = select(states_table).where(states_table.c.id == id)
                result = await session.execute(state)
                state_data = result.fetchone()
                
                if not state_data:
                    print(f"❌ State with ID {id} not found")
                    return None
                
                # Получаем текущий массив pictures
                current_pictures = state_data.pictures or []
                
                # Удаляем картинку, если она существует
                if picture in current_pictures:
                    current_pictures.remove(picture)
                else:
                    print(f"⚠️ Picture '{picture}' not found for state {id}")
                    return state_data
                
                # Обновляем запись
                stmt = (
                    update(states_table)
                    .where(states_table.c.id == id)
                    .values(pictures=current_pictures)
                    .returning(states_table)
                )
                
                result = await session.execute(stmt)
                updated_state = result.scalar_one_or_none()
                
                if updated_state:
                    await session.commit()
                    print(f"✅ Picture '{picture}' removed for state ID: {id}")
                    return updated_state
                    
        except Exception as e:
            print(f"❌ Error removing picture: {e}")
            return None

    # Функция удаления состояния
    async def delete_state(id: int):
        """Удаление состояния по ID"""
        try:
            async with AsyncSessionLocal() as session:
                stmt = delete(states_table).where(states_table.c.id == id)
                result = await session.execute(stmt)
                await session.commit()
                
                if result.rowcount > 0:
                    print(f"✅ State with ID {id} deleted successfully")
                    return True
                else:
                    print(f"❌ State with ID {id} not found")
                    return False
                    
        except Exception as e:
            print(f"❌ Error deleting state: {e}")
            return False


# Функции-обертки для удобного использования
async def initialize_database_states():
    """Инициализация БД"""
    print("🚀 Initializing database...")

    if not await StatesDatabase.test_connection():
        return False
    
    if not await StatesDatabase.create_tables():
        return False
    
    print("✅ Database initialized successfully")
    return True


async def add_state(name: str, text: str, owner: int, tags: list = None, pictures: list = None):
    """Добавление нового состояния"""
    try:
        return await StatesDatabase.state_add(name, text, owner, tags, pictures)
    except Exception as e:
        print(f"Ошибка добавления состояния: {e}")
        return False

async def get_state(id: int):
    """Получение состояния по ID"""
    try:
        return await StatesDatabase.get_state(id)
    except Exception as e:
        print(f"Ошибка получения состояния: {e}")
        return False

async def get_states_by_owner(owner_id: int):
    """Получение всех состояний пользователя"""
    try:
        return await StatesDatabase.get_state_by_owner(owner_id)
    except Exception as e:
        print(f"Ошибка получения состояний пользователя: {e}")
        return False

async def search_states_by_tags(tags: list[str]):
    """Поиск состояний по тегам с максимальным числом совпадений"""
    try:
        return await StatesDatabase.search_by_tags(tags)
    except Exception as e:
        print(f"Ошибка поиска состояний по тегам: {e}")
        return False

async def get_feed_states(limit: int = 50):
    """Получение ленты состояний"""
    try:
        return await StatesDatabase.get_feed(limit)
    except Exception as e:
        print(f"Ошибка получения ленты состояний: {e}")
        return False

async def update_state_name(id: int, new_name: str):
    """Изменение имени состояния"""
    try:
        return await StatesDatabase.update_state_name(id, new_name)
    except Exception as e:
        print(f"Ошибка изменения имени состояния: {e}")
        return False

async def update_state_text(id: int, new_text: str):
    """Обновление текста состояния"""
    try:
        return await StatesDatabase.update_state_text(id, new_text)
    except Exception as e:
        print(f"Ошибка обновления текста состояния: {e}")
        return False

async def update_state(id: int, name: str = None, text: str = None):
    """Обновление имени и/или текста состояния"""
    try:
        return await StatesDatabase.update_state(id, name, text)
    except Exception as e:
        print(f"Ошибка обновления состояния: {e}")
        return False

async def add_state_tag(id: int, tag: str):
    """Добавление тега состоянию"""
    try:
        return await StatesDatabase.add_tag(id, tag)
    except Exception as e:
        print(f"Ошибка добавления тега: {e}")
        return False

async def remove_state_tag(id: int, tag: str):
    """Удаление тега у состояния"""
    try:
        return await StatesDatabase.remove_tag(id, tag)
    except Exception as e:
        print(f"Ошибка удаления тега: {e}")
        return False

async def add_state_picture(id: int, picture: str):
    """Добавление картинки состоянию"""
    try:
        return await StatesDatabase.add_picture(id, picture)
    except Exception as e:
        print(f"Ошибка добавления картинки: {e}")
        return False

async def remove_state_picture(id: int, picture: str):
    """Удаление картинки у состояния"""
    try:
        return await StatesDatabase.remove_picture(id, picture)
    except Exception as e:
        print(f"Ошибка удаления картинки: {e}")
        return False

async def delete_state(id: int):
    """Удаление состояния"""
    try:
        return await StatesDatabase.delete_state(id)
    except Exception as e:
        print(f"Ошибка удаления состояния: {e}")
        return False
