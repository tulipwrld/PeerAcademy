from mistralai import Mistral

from config import config

API_KEY = config.API_KEY_AI.get_secret_value()
MODEL = "mistral-small-latest"


async def aifunc(article_text: str, question: str) -> str:
    client = Mistral(api_key=API_KEY)
    prompt = (
        "Ниже текст статьи.\n"
        f"{article_text}\n\n"
        f"Вопрос пользователя: {question}\n\n"
        "Ответь по содержанию статьи как дружелюбный ИИ-учитель. "
        "Объясняй просто, конкретно и без воды."
    )

    chat_response = client.chat.complete(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "Ты дружелюбный ИИ-учитель. Твоя задача объяснять материал простым языком.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    answer = chat_response.choices[0].message.content
    return answer or "Не удалось получить ответ от ИИ."
