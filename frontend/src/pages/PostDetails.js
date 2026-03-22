import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Спроси у ИИ что угодно по этой статье. Я отправлю в AI API текст статьи и твой вопрос.'
    }
  ]);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/statements/${postId}`, {
          credentials: 'include'
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setPost(null);
          setError(data.message || 'Не удалось загрузить статью');
          return;
        }

        setPost(data.result || null);
      } catch (fetchError) {
        console.error('Post details error:', fetchError);
        setPost(null);
        setError('Ошибка соединения с сервером');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  const askAI = async () => {
    const question = aiInput.trim();
    if (!question || !post) {
      return;
    }

    const articleText = [
      post.name ? `Заголовок: ${post.name}` : '',
      post.text ? `Текст статьи: ${post.text}` : '',
      post.tags?.length ? `Теги: ${post.tags.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    setAiLoading(true);
    setAiError('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setAiInput('');

    try {
      const response = await fetch('/ai-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          article_text: articleText,
          question
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setAiError(data.message || 'Не удалось получить ответ от ИИ');
        return;
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.answer || 'ИИ не вернул ответ' }
      ]);
    } catch (fetchError) {
      console.error('AI chat error:', fetchError);
      setAiError('Не удалось подключиться к AI API. Проверь, что сервис из папки AI запущен на порту 8001.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 24px', background: '#f7f7f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          Назад
        </button>

        {loading && (
          <div className="card" style={{ textAlign: 'center', color: '#777' }}>
            Загружаю статью...
          </div>
        )}

        {!loading && error && (
          <div className="card" style={{ color: '#b42318', borderColor: '#f0c7c2' }}>
            {error}
          </div>
        )}

        {!loading && !error && post && (
          <>
            <article className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
              {post.pictures?.length > 0 && (
                <img
                  src={post.pictures[0]}
                  alt={post.name || 'Изображение статьи'}
                  style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block', background: '#ececec' }}
                />
              )}

              <div style={{ padding: 24 }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 800, fontSize: 26, color: '#1a1a1a', marginBottom: 6 }}>
                    {post.name || 'Без названия'}
                  </div>
                  <div style={{ fontSize: 14, color: '#777' }}>
                    {post.owner_name || `Пользователь #${post.owner}`}
                  </div>
                </div>

                <div style={{ fontSize: 16, lineHeight: 1.8, color: '#2b2b2b', whiteSpace: 'pre-wrap', marginBottom: post.tags?.length ? 18 : 0 }}>
                  {post.text || 'Без текста'}
                </div>

                {post.tags?.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <span
                        key={`${post.id}-${tag}`}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 999,
                          background: '#f3f4f6',
                          color: '#555',
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>

            <section className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 22, color: '#1a1a1a', marginBottom: 6 }}>
                Спросить у ИИ
              </div>
              <div style={{ fontSize: 14, color: '#777', marginBottom: 16 }}>
                Вопрос отправится в API из папки `AI` вместе с текстом этой статьи.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    style={{
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: message.role === 'user' ? '#1a1a1a' : '#f3f4f6',
                      color: message.role === 'user' ? '#fff' : '#222',
                      fontSize: 14,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.content}
                  </div>
                ))}
              </div>

              {aiError && (
                <div style={{ marginBottom: 12, color: '#b42318', fontSize: 14 }}>
                  {aiError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <textarea
                  value={aiInput}
                  onChange={event => setAiInput(event.target.value)}
                  placeholder="Например: объясни основную мысль статьи простыми словами"
                  rows={3}
                  style={{
                    flex: 1,
                    minWidth: 260,
                    border: '1.5px solid #d0d5dd',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: 92
                  }}
                />
                <button className="btn btn-primary" onClick={askAI} disabled={aiLoading || !aiInput.trim()}>
                  {aiLoading ? 'Спрашиваю...' : 'Спросить'}
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
