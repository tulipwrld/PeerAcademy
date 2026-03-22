import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconSkills, IconUser, IconCheck, IconPlus } from '../components/Icons';

const SKILLS = ['Python','JavaScript','Английский','Дизайн','Математика','Гитара','SQL','Испанский','Фотография','React','Figma','Excel'];

export default function Register({ onLogin }) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  // Step 2
  const [name, setName]   = useState('');
  const [uni, setUni]     = useState('');
  const [roles, setRoles] = useState([]); // ['student','teacher']

  // Step 3
  const [learns, setLearns] = useState([]);
  const [teaches, setTeaches] = useState([]);

  const toggleRole = (r) =>
    setRoles(rs => rs.includes(r) ? rs.filter(x => x !== r) : [...rs, r]);
  const toggleSkill = (sk, list, setList) =>
    setList(l => l.includes(sk) ? l.filter(x => x !== sk) : [...l, sk]);

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  const finish = () => {
    onLogin({ name, email, uni, roles, learns, teaches });
    navigate('/');
  };

  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 56 }}>
      <div style={{ width: '100%', maxWidth: 860 }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Создай аккаунт</h1>
          <div style={{ color: '#555' }}>Это займёт меньше минуты</div>
        </div>

        {/* ── Progress ── */}
        <div style={s.progress}>
          {[1,2,3].map(n => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ ...s.progressDot, background: step > n ? '#F5C842' : step === n ? '#1a1a1a' : '#ddd',
                color: step > n ? '#1a1a1a' : '#fff' }}>
                {step > n ? <IconCheck size={14} color="#1a1a1a" /> : n}
              </div>
              <span style={{ fontSize: 14, fontWeight: step === n ? 700 : 400, color: step === n ? '#1a1a1a' : '#999' }}>
                {n === 1 ? 'Email и пароль' : n === 2 ? 'О себе' : 'Навыки'}
              </span>
              {n < 3 && <div style={s.progressLine} />}
            </div>
          ))}
        </div>

        {/* ──────────────── STEP 1 ──────────────── */}
        {step === 1 && (
          <div className="card fade-in" style={{ maxWidth: 480, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Шаг 1 — Email и пароль</h2>

            <label className="label">Email</label>
            <input className="input" style={{ marginBottom: 16 }} type="email"
              placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />

            <label className="label">Пароль</label>
            <input className="input" style={{ marginBottom: 16 }} type="password"
              placeholder="Минимум 8 символов" value={password} onChange={e => setPassword(e.target.value)} />

            <label className="label">Повтори пароль</label>
            <input className="input" style={{ marginBottom: 28 }} type="password"
              placeholder="Повтори пароль" value={password2} onChange={e => setPassword2(e.target.value)} />

            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14 }}
              disabled={!email || !password || password !== password2}
              onClick={next}
            >
              Продолжить →
            </button>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#777' }}>
              Уже есть аккаунт? <Link to="/login" style={{ color: '#7a5c00', fontWeight: 600 }}>Войти</Link>
            </div>
          </div>
        )}

        {/* ──────────────── STEP 2 ──────────────── */}
        {step === 2 && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div className="card">
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Шаг 2 — О себе</h2>

              <label className="label">Имя и фамилия</label>
              <input className="input" style={{ marginBottom: 16 }} placeholder="Алина Смирнова"
                value={name} onChange={e => setName(e.target.value)} />

              <label className="label">Университет</label>
              <input className="input" style={{ marginBottom: 24 }} placeholder="МГУ — Факультет ВМК"
                value={uni} onChange={e => setUni(e.target.value)} />

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={back} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>← Назад</button>
                <button onClick={next} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}
                  disabled={!name}>Далее →</button>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Кто ты на платформе?</h2>
              <p style={{ fontSize: 14, color: '#777', marginBottom: 18, lineHeight: 1.5 }}>
                Можно выбрать оба варианта
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { role: 'student', icon: <IconSkills size={34} color="#F5C842" />, title: 'Ученик', desc: 'Хочу изучить новый навык' },
                  { role: 'teacher', icon: <IconUser size={34} color="#F5C842" />, title: 'Учитель', desc: 'Хочу преподавать' },
                ].map(({ role, icon, title, desc }) => (
                  <div key={role}
                    onClick={() => toggleRole(role)}
                    style={{
                      border: `2.5px solid ${roles.includes(role) ? '#1a1a1a' : '#ddd'}`,
                      borderRadius: 14, padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                      background: roles.includes(role) ? '#FFF8D6' : '#fff',
                      transition: 'all .15s',
                    }}
                  >
                    <div style={{ marginBottom: 10 }}>{icon}</div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: '#777' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ──────────────── STEP 3 ──────────────── */}
        {step === 3 && (
          <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
            <div className="card">
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Шаг 3 — Навыки</h2>
              <p style={{ fontSize: 14, color: '#777', marginBottom: 20 }}>Отметь, чему хочешь научиться</p>

              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconSkills size={14} color="#F5C842" /> Хочу научиться
              </label>
              <div style={{ marginBottom: 20 }}>
                {SKILLS.map(sk => (
                  <span key={sk}
                    onClick={() => toggleSkill(sk, learns, setLearns)}
                    style={{
                      ...chipStyle,
                      background: learns.includes(sk) ? '#FFF8D6' : '#f5f5f3',
                      border: learns.includes(sk) ? '1.5px solid #F5C842' : '1.5px solid #ddd',
                      color: learns.includes(sk) ? '#7a5c00' : '#555',
                    }}
                  >{sk}</span>
                ))}
              </div>

              <button onClick={back} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>← Назад</button>
            </div>

            <div className="card">
              <div style={{ height: 42 }} />
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconSkills size={14} color="#F5C842" /> Могу обучить
              </label>
              <div style={{ marginBottom: 28 }}>
                {SKILLS.map(sk => (
                  <span key={sk}
                    onClick={() => toggleSkill(sk, teaches, setTeaches)}
                    style={{
                      ...chipStyle,
                      background: teaches.includes(sk) ? '#FFF8D6' : '#f5f5f3',
                      border: teaches.includes(sk) ? '1.5px solid #F5C842' : '1.5px solid #ddd',
                      color: teaches.includes(sk) ? '#7a5c00' : '#555',
                    }}
                  >{sk}</span>
                ))}
              </div>

              <button
                onClick={finish}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 14 }}
              >
                <IconCheck size={16} color="#1a1a1a" /> Готово — создать аккаунт
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const chipStyle = {
  display: 'inline-block', borderRadius: 20, padding: '6px 14px',
  fontSize: 13, margin: '3px 4px 3px 0', cursor: 'pointer', transition: 'all .12s',
};

const s = {
  progress: {
    display: 'flex', alignItems: 'center', gap: 0,
    marginBottom: 36,
  },
  progressDot: {
    width: 32, height: 32, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, flexShrink: 0,
    transition: 'all .2s',
  },
  progressLine: {
    height: 2, width: 48, background: '#ddd', margin: '0 8px',
  },
};
