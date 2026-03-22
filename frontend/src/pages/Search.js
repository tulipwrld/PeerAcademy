import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconFilter, IconCheck } from '../components/Icons';

const AVAILABLE_TAGS = [
  { id: 'programming', name: 'Программирование' },
  { id: 'mathematics', name: 'Математика' },
  { id: 'science', name: 'Наука' },
  { id: 'art', name: 'Искусство' },
  { id: 'music', name: 'Музыка' },
  { id: 'languages', name: 'Языки' },
  { id: 'business', name: 'Бизнес' },
  { id: 'health', name: 'Здоровье' },
  { id: 'technology', name: 'Технологии' },
  { id: 'philosophy', name: 'Философия' },
  { id: 'history', name: 'История' },
  { id: 'sports', name: 'Спорт' }
];

export default function Search() {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [customQuery, setCustomQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const effectiveTags = useMemo(() => {
    const customTags = customQuery
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(Boolean);

    return [...new Set([...selectedTags, ...customTags])];
  }, [customQuery, selectedTags]);
  const searchKey = effectiveTags.join(',');

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(tag => tag !== tagId)
        : [...prev, tagId]
    );
  };

  const runSearch = async () => {
    if (effectiveTags.length === 0) {
      setResults([]);
      setError('Выбери хотя бы один тег');
      return;
    }

    setSearching(true);
    setError('');

    try {
      const response = await fetch(
        `/api/statements/search?tags=${encodeURIComponent(effectiveTags.join(','))}`,
        {
          credentials: 'include'
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setResults([]);
        setError(data.message || 'Не удалось выполнить поиск');
        return;
      }

      setResults(Array.isArray(data.results) ? data.results : []);
    } catch (fetchError) {
      console.error('Search error:', fetchError);
      setResults([]);
      setError('Ошибка соединения с сервером');
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (effectiveTags.length === 0) {
      setResults([]);
      setError('');
      return;
    }

    const timeoutId = setTimeout(() => {
      const autoSearch = async () => {
        setSearching(true);
        setError('');

        try {
          const response = await fetch(
            `/api/statements/search?tags=${encodeURIComponent(searchKey)}`,
            {
              credentials: 'include'
            }
          );

          const data = await response.json().catch(() => ({}));

          if (!response.ok) {
            setResults([]);
            setError(data.message || 'Не удалось выполнить поиск');
            return;
          }

          setResults(Array.isArray(data.results) ? data.results : []);
        } catch (fetchError) {
          console.error('Search error:', fetchError);
          setResults([]);
          setError('Ошибка соединения с сервером');
        } finally {
          setSearching(false);
        }
      };

      autoSearch();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [effectiveTags.length, searchKey]);

  const Filters = () => (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconFilter size={15} color="#F5C842" /> Теги
      </div>
      {AVAILABLE_TAGS.map(tag => (
        <div
          key={tag.id}
          onClick={() => toggleTag(tag.id)}
          style={{
            padding: '9px 12px',
            borderRadius: 8,
            marginBottom: 6,
            cursor: 'pointer',
            fontSize: 13,
            transition: 'all .15s',
            background: selectedTags.includes(tag.id) ? '#1a1a1a' : '#f7f7f5',
            color: selectedTags.includes(tag.id) ? '#F5C842' : '#555',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          {selectedTags.includes(tag.id) && <IconCheck size={12} color="#F5C842" />}
          {tag.name}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: '28px 24px', background: '#f7f7f5', minHeight: 'calc(100vh - 64px)' }}>
      <style>{`
        .search-wrap { display:grid; grid-template-columns:230px 1fr; gap:22px; max-width:1060px; margin:0 auto; align-items:start; }
        .filter-desktop { display:block; }
        .filter-toggle { display:none; }
        @media (max-width:680px) {
          .search-wrap { grid-template-columns:1fr; }
          .filter-desktop { display:none; }
          .filter-toggle { display:flex; }
        }
      `}</style>

      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <button
          className="btn btn-ghost btn-sm filter-toggle"
          style={{ marginBottom: 14, alignItems: 'center', gap: 6 }}
          onClick={() => setFiltersOpen(open => !open)}
        >
          <IconFilter size={14} color="#555" /> {filtersOpen ? 'Скрыть теги' : 'Показать теги'}
        </button>
        {filtersOpen && <div style={{ marginBottom: 14 }}><Filters /></div>}

        <div className="search-wrap">
          <div className="filter-desktop"><Filters /></div>

          <div>
            <div style={{ fontSize: 13, color: '#777', marginBottom: 12 }}>
              Найдено статей: {results.length}
            </div>

            <div style={{ background: '#fff', border: '1.5px solid #ddd', borderRadius: 10, padding: '11px 16px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <IconSearch size={15} color="#ccc" />
              <input
                style={{ border: 'none', outline: 'none', fontSize: 14, color: '#555', width: '100%', background: 'transparent' }}
                placeholder="Доп. теги через запятую: programming, science"
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {effectiveTags.map(tag => (
                  <span key={tag} style={{ padding: '6px 10px', borderRadius: 999, background: '#fff3c4', color: '#7a5c00', fontSize: 12, fontWeight: 600 }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={runSearch} disabled={searching}>
                {searching ? 'Ищу...' : 'Искать'}
              </button>
            </div>

            {error && (
              <div className="card" style={{ marginBottom: 14, padding: 16, color: '#b42318', borderColor: '#f0c7c2' }}>
                {error}
              </div>
            )}

            {results.map(post => (
              <button
                key={post.id}
                className="card"
                onClick={() => navigate(`/post/${post.id}`)}
                style={{ marginBottom: 14, padding: 20, width: '100%', textAlign: 'left', cursor: 'pointer', border: '1.5px solid #e5e7eb', background: '#fff' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{post.name || 'Без названия'}</div>
                    <div style={{ fontSize: 13, color: '#777' }}>
                      Автор: {post.owner_name || `Пользователь #${post.owner}`}
                    </div>
                  </div>
                  <div style={{ padding: '7px 10px', borderRadius: 999, background: '#1a1a1a', color: '#F5C842', fontSize: 12, fontWeight: 700 }}>
                    Совпадений: {post.match_count}
                  </div>
                </div>

                <div style={{ fontSize: 14, color: '#333', lineHeight: 1.65, marginBottom: 12 }}>
                  {post.text || 'Без описания'}
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(post.tags || []).map(tag => (
                    <span
                      key={`${post.id}-${tag}`}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        background: effectiveTags.includes(String(tag).toLowerCase()) ? '#fff3c4' : '#f3f4f6',
                        color: effectiveTags.includes(String(tag).toLowerCase()) ? '#7a5c00' : '#555',
                        fontSize: 12,
                        fontWeight: 600
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}

            {!searching && !error && effectiveTags.length === 0 && (
              <div style={{ textAlign: 'center', padding: '56px 0', color: '#999' }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Выбери теги для поиска</div>
                <div style={{ fontSize: 14 }}>Статьи будут отсортированы по максимальному числу совпадений</div>
              </div>
            )}

            {!searching && !error && effectiveTags.length > 0 && results.length === 0 && (
              <div style={{ textAlign: 'center', padding: '56px 0', color: '#999' }}>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Ничего не найдено</div>
                <div style={{ fontSize: 14 }}>Попробуй изменить набор тегов</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
