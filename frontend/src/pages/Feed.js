import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconFeed } from '../components/Icons';

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/statements/feed', {
        credentials: 'include'
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPosts([]);
        setError(data.message || 'Не удалось загрузить посты');
        return;
      }

      setPosts(Array.isArray(data.results) ? data.results : []);
    } catch (fetchError) {
      console.error('Feed loading error:', fetchError);
      setPosts([]);
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div style={{ padding: '32px 24px', background: '#f7f7f5', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconFeed size={18} color="#F5C842" />
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>Посты</div>
              <div style={{ fontSize: 13, color: '#777' }}>Фото сверху, текст ниже, свежие записи первыми</div>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={loadFeed} disabled={loading}>
            {loading ? 'Обновляю...' : 'Обновить'}
          </button>
        </div>

        {error && (
          <div className="card" style={{ marginBottom: 16, color: '#b42318', borderColor: '#f0c7c2' }}>
            {error}
          </div>
        )}

        {loading && posts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: '#777' }}>
            Загружаю посты...
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', color: '#777' }}>
            Постов пока нет
          </div>
        )}

        {posts.map(post => (
          <article
            key={post.id}
            className="card"
            style={{ marginBottom: 18, padding: 0, overflow: 'hidden', cursor: 'pointer' }}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            {post.pictures?.length > 0 && (
              <img
                src={post.pictures[0]}
                alt={post.name || 'Изображение поста'}
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block', background: '#ececec' }}
              />
            )}

            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: '#1a1a1a', marginBottom: 4 }}>
                    {post.name || 'Без названия'}
                  </div>
                  <div style={{ fontSize: 13, color: '#777' }}>
                    {post.owner_name || `Пользователь #${post.owner}`}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  ID: {post.id}
                </div>
              </div>

              <div style={{ fontSize: 15, lineHeight: 1.75, color: '#2b2b2b', marginBottom: post.tags?.length ? 14 : 0, whiteSpace: 'pre-wrap' }}>
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
        ))}
      </div>
    </div>
  );
}
