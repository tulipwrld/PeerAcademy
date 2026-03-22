import { Link } from 'react-router-dom';
import { IconSkills, IconUser, IconCheck, IconSearch, IconStar } from '../components/Icons';

export default function Home({ user }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* ── Hero ── */}
      <div style={s.hero}>
        <style>{`
          .hero-grid { display: grid; grid-template-columns: 1fr 400px; gap: 64px; align-items: center; }
          .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
          @media (max-width: 800px) {
            .hero-grid { grid-template-columns: 1fr; gap: 32px; }
          }
          .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 28px; }
          @media (max-width: 900px) {
            .steps-grid { grid-template-columns: repeat(2,1fr); }
          }
          .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
          @media (max-width: 800px) {
            .reviews-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="hero-grid">
          <div>
            <div style={s.tag}>БЕСПЛАТНО</div>
            <h1 style={s.h1}>Учись у таких<br />же студентов</h1>
            <p style={s.sub}>
              Обменивайся знаниями с ровесниками — без репетиторов и дорогих курсов.
              Один учит, другой учится — и оба растут.
            </p>
            <div className="hero-btns">
              <Link to={user ? '/search' : '/register'} className="btn btn-dark btn-lg">
                <IconSkills size={17} color="#F5C842" /> Начать учиться
              </Link>
              {/* <Link to={user ? '/profile/me' : '/register'} className="btn btn-outline-dark btn-lg">
                <IconUser size={17} color="#1a1a1a" /> Стать учителем
              </Link> */}
            </div>
          </div>

          <div style={s.darkCard}>
            <div style={s.cardLabel}>ПОПУЛЯРНЫЕ НАВЫКИ</div>
            <div style={{ marginBottom: 18 }}>
              {['Python','Английский','Дизайн','Математика','Гитара','SQL','Испанский','Фотография'].map(k => (
                <span key={k} className="chip-dark">{k}</span>
              ))}
            </div>
            <div style={s.statsRow}>
              {[['1 200','студентов'],['340','учителей'],['890','занятий']].map(([n,l],i) => (
                <div key={l} style={{ ...s.stat, borderLeft: i > 0 ? '1.5px solid #2a2a2a' : 'none' }}>
                  <div style={s.statNum}>{n}</div>
                  <div style={s.statLabel}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div style={s.section}>
        <div style={s.sectionTitle}>
          <IconCheck size={15} color="#F5C842" /> КАК ЭТО РАБОТАЕТ
        </div>
        <div className="steps-grid">
          {[
            ['1','Создай профиль','Укажи что хочешь изучить и чему можешь учить других'],
            ['2','Найди партнёра','Фильтруй по навыку, рейтингу и расписанию'],
            ['3','Подбери урок','Учись по его бесплатным урокам'],
            ['4','Проведи занятие','Учись или учи — и получи честный отзыв'],
          ].map(([n,t,desc]) => (
            <div key={n} style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={s.stepNum}>{n}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:5 }}>{t}</div>
                <div style={{ fontSize:14, color:'#555', lineHeight:1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skills CTA ── */}
      <div style={{ ...s.section, background:'#fff', borderTop:'1.5px solid #eee' }}>
        <div style={s.sectionTitle}>
          <IconSearch size={15} color="#F5C842" /> НАЙДИ СВОЁ
        </div>
        <div style={{ marginBottom:20 }}>
          {['Python','Английский','Дизайн','Математика','Гитара','SQL','Испанский','Фотография','Видео','Анализ данных','React'].map(k => (
            <Link key={k} to="/search" className="chip" style={{ cursor:'pointer' }}>{k}</Link>
          ))}
        </div>
        <Link to="/search" className="btn btn-primary">
          <IconSearch size={15} color="#1a1a1a" /> Искать
        </Link>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ ...s.section, background:'#f7f7f5' }}>
        <div style={s.sectionTitle}>
          <IconStar size={15} color="#F5C842" /> ЧТО ГОВОРЯТ СТУДЕНТЫ
        </div>
        <div className="reviews-grid">
          {[
            { av:'АС', cls:'av-a', name:'Алина С.', text:'Провела 10-е занятие по Python — и сама разобралась глубже, чем за весь семестр!' },
            { av:'МК', cls:'av-b', name:'Максим К.', text:'За 1 час разобрался с ООП лучше, чем за месяц самостоятельно. Очень рекомендую!' },
            { av:'ДВ', cls:'av-c', name:'Даша В.', text:'Нашла партнёра для обмена: учу дизайн, учусь Python. Это работает лучше, чем курсы.' },
          ].map(({ av,cls,name,text }) => (
            <div key={name} className="card">
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div className={`av ${cls}`} style={{ width:44, height:44, fontSize:14 }}>{av}</div>
                <div>
                  <div style={{ fontWeight:700 }}>{name}</div>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <div style={{ fontSize:14, color:'#555', lineHeight:1.7, fontStyle:'italic' }}>"{text}"</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

const s = {
  hero: {
    background: '#F5C842',
    padding: '64px 48px',
  },
  tag: {
    background: '#1a1a1a', color: '#F5C842',
    fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 5,
    display: 'inline-block', marginBottom: 20, letterSpacing: 2,
  },
  h1: {
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontWeight: 800, color: '#1a1a1a', lineHeight: 1.15, marginBottom: 18,
  },
  sub: {
    fontSize: 16, color: '#3a3a2a', lineHeight: 1.7, marginBottom: 32, maxWidth: 480,
  },
  darkCard: {
    background: '#1a1a1a', borderRadius: 18, padding: 28,
  },
  cardLabel: {
    fontSize: 11, color: '#666', letterSpacing: 2.5, marginBottom: 16, fontWeight: 700,
  },
  statsRow: {
    display: 'flex',
    borderTop: '1.5px solid #2a2a2a', paddingTop: 18, marginTop: 4,
  },
  stat: { textAlign: 'center', flex: 1, padding: '0 12px' },
  statNum: { fontSize: 26, fontWeight: 800, color: '#F5C842' },
  statLabel: { fontSize: 12, color: '#777', marginTop: 3 },
  section: { padding: '52px 48px' },
  sectionTitle: {
    fontSize: 12, fontWeight: 700, color: '#555', letterSpacing: 2,
    textTransform: 'uppercase', marginBottom: 28,
    display: 'flex', alignItems: 'center', gap: 8,
  },
  stepNum: {
    width: 36, height: 36, borderRadius: '50%',
    background: '#F5C842', color: '#1a1a1a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15, fontWeight: 700, flexShrink: 0,
  },
};
