import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconChat, IconSearch, IconSend, IconCalendar, IconCheck, IconDots } from '../components/Icons';

const CONTACTS = [
  { id:1, profileId:'smirnova', name:'Алина Смирнова', avCls:'av-a', av:'АС', online:true,  lastMsg:'Отправляю запрос на занятие 👇', lastTime:'15:32',
    messages:[
      { id:1, out:false, text:'Привет! Видела, что ты ищешь партнёра для Python 😊', time:'15:28' },
      { id:2, out:true,  text:'Хочу разобраться с ООП. Ты занимаешься онлайн?', time:'15:29' },
      { id:3, out:false, text:'Конечно, через Zoom. Могу завтра в 18:00 или послезавтра в 19:30', time:'15:30' },
      { id:4, out:true,  text:'Завтра в 18:00 — идеально!', time:'15:31' },
      { id:5, out:false, text:'', time:'15:32', isRequest:true, topic:'ООП в Python', sessionDate:'15 марта', sessionTime:'18:00', format:'Онлайн (Zoom)', duration:'60' },
    ]},
  { id:2, profileId:'kozlov', name:'Максим Козлов', avCls:'av-b', av:'МК', online:false, lastMsg:'Договорились на среду!', lastTime:'вчера',
    messages:[
      { id:1, out:false, text:'Привет! Хочу обменяться — учу математику, изучаю гитару', time:'вчера' },
      { id:2, out:true,  text:'Звучит интересно! Как раз нужна помощь с матаном', time:'вчера' },
      { id:3, out:false, text:'Договорились на среду в 19:00?', time:'вчера' },
      { id:4, out:true,  text:'Договорились на среду!', time:'вчера' },
    ]},
  { id:3, profileId:'voronova', name:'Даша Воронова', avCls:'av-c', av:'ДВ', online:true, lastMsg:'Спасибо за занятие! 🙏', lastTime:'пн',
    messages:[
      { id:1, out:true,  text:'Даша, твоё занятие по Figma было очень полезным!', time:'пн' },
      { id:2, out:false, text:'Спасибо за занятие! 🙏 Рада помочь', time:'пн' },
    ]},
  { id:4, profileId:'petrov', name:'Иван Петров', avCls:'av-d', av:'ИП', online:false, lastMsg:'Когда удобно провести занятие?', lastTime:'сб',
    messages:[
      { id:1, out:false, text:'Привет! Хочу помочь с SQL, ищу помощь с испанским', time:'сб' },
      { id:2, out:true,  text:'Отлично! Когда удобно провести занятие?', time:'сб' },
    ]},
];

/* ── Propose modal ── */
function ProposeModal({ onClose, onSend }) {
  const [topic,    setTopic]    = useState('');
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('');
  const [format,   setFormat]   = useState('Онлайн (Zoom)');
  const [duration, setDuration] = useState('60');

  const send = () => {
    if (!topic || !date || !time) return;
    onSend({ topic, sessionDate: date, sessionTime: time, format, duration });
    onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:420, boxShadow:'0 16px 60px rgba(0,0,0,.25)' }}
        onClick={e => e.stopPropagation()} className="fade-in">
        <div style={{ fontWeight:700, fontSize:17, marginBottom:20 }}>📋 Предложить занятие</div>
        <label className="label">Тема занятия</label>
        <input className="input" style={{ marginBottom:14 }} placeholder="Например: ООП в Python"
          value={topic} onChange={e => setTopic(e.target.value)} />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <label className="label">Дата</label>
            <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Время</label>
            <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <label className="label">Формат</label>
        <select className="input" style={{ marginBottom:14 }} value={format} onChange={e => setFormat(e.target.value)}>
          <option>Онлайн (Zoom)</option>
          <option>Онлайн (Google Meet)</option>
          <option>Офлайн</option>
        </select>
        <label className="label">Длительность (мин)</label>
        <select className="input" style={{ marginBottom:24 }} value={duration} onChange={e => setDuration(e.target.value)}>
          <option>30</option><option>45</option><option>60</option><option>90</option><option>120</option>
        </select>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:12 }}
            disabled={!topic || !date || !time} onClick={send}>
            <IconSend size={14} color="#1a1a1a" /> Отправить запрос
          </button>
          <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center' }} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Request card ── */
function RequestCard({ msg, accepted, onAccept }) {
  return (
    <div style={{ background:'#FFF8D6', border:'1.5px solid #F5C842', borderRadius:14, padding:'16px 18px', maxWidth:280 }}>
      <div style={{ fontSize:11, color:'#7a5c00', fontWeight:700, letterSpacing:1, marginBottom:12 }}>📋 ЗАПРОС НА ЗАНЯТИЕ</div>
      <div style={{ fontSize:13, color:'#3a3a00', lineHeight:2 }}>
        <div>Тема: <b>{msg.topic || 'ООП в Python'}</b></div>
        <div>Дата: <b>{msg.sessionDate || '15 марта'}, {msg.sessionTime || '18:00'}</b></div>
        <div>Формат: <b>{msg.format || 'Онлайн (Zoom)'}</b></div>
        <div>Длительность: <b>{msg.duration || '60'} мин</b></div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:14 }}>
        {accepted ? (
          <div style={{ background:'#e8f5e9', color:'#2e7d32', borderRadius:8, padding:'10px 14px', fontSize:13, fontWeight:600, textAlign:'center' }}>
            ✓ Принято — встретимся!
          </div>
        ) : (
          <>
            <button onClick={onAccept} className="btn btn-dark" style={{ width:'100%', justifyContent:'center' }}>
              <IconCheck size={13} color="#F5C842" /> Принять
            </button>
            <button className="btn btn-ghost" style={{ width:'100%', justifyContent:'center', color:'#7a5c00', borderColor:'#F5C842' }}>
              Изменить
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Messages() {
  const [activeId,    setActiveId]    = useState(1);
  const [chats,       setChats]       = useState(CONTACTS);
  const [input,       setInput]       = useState('');
  const [accepted,    setAccepted]    = useState({});
  const [showPropose, setShowPropose] = useState(false);
  const endRef = useRef(null);

  const active = chats.find(c => c.id === activeId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [activeId, active?.messages?.length]);

  const send = (text) => {
    if (!text?.trim()) return;
    setChats(cs => cs.map(c => c.id === activeId
      ? { ...c, messages:[...c.messages, { id:Date.now(), out:true, text, time:'сейчас' }], lastMsg:text }
      : c));
    setInput('');
  };

  const sendRequest = (data) => {
    setChats(cs => cs.map(c => c.id === activeId
      ? { ...c, messages:[...c.messages, { id:Date.now(), out:true, time:'сейчас', isRequest:true, ...data }], lastMsg:`Запрос: ${data.topic}` }
      : c));
  };

  return (
    <>
      {showPropose && <ProposeModal onClose={() => setShowPropose(false)} onSend={sendRequest} />}

      <div style={{ background:'#f7f7f5', height:'calc(100vh - 64px)', display:'grid', gridTemplateColumns:'280px 1fr' }}>

        {/* ── Sidebar ── */}
        <div style={{ background:'#fff', borderRight:'1.5px solid #e5e5e5', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'18px 16px 12px', borderBottom:'1.5px solid #eee', flexShrink:0 }}>
            <div style={{ fontWeight:700, fontSize:15, display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <IconChat size={16} color="#F5C842" /> Сообщения
            </div>
            <div style={{ background:'#f7f7f5', border:'1.5px solid #ddd', borderRadius:8, padding:'8px 12px', display:'flex', alignItems:'center', gap:7 }}>
              <IconSearch size={13} color="#ccc" />
              <span style={{ fontSize:13, color:'#999' }}>Поиск...</span>
            </div>
          </div>
          <div style={{ overflowY:'auto', flex:1, padding:'6px' }}>
            {chats.map(c => (
              <div key={c.id}
                onClick={() => setActiveId(c.id)}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 10px', cursor:'pointer',
                  borderRadius:10, marginBottom:2, transition:'all .15s',
                  background: c.id === activeId ? '#FFF8D6' : 'transparent',
                  border: c.id === activeId ? '1.5px solid #F5C842' : '1.5px solid transparent' }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div className={`av ${c.avCls}`} style={{ width:42, height:42, fontSize:13 }}>{c.av}</div>
                  {c.online && <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:'#28c840', border:'2px solid #fff' }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>{c.name.split(' ').slice(0,2).join(' ')}</span>
                    <span style={{ fontSize:11, color:'#999' }}>{c.lastTime}</span>
                  </div>
                  <div style={{ fontSize:12, color:'#777', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:3 }}>{c.lastMsg}</div>
                  {/* Profile link — stops propagation so it doesn't switch chat */}
                  <Link
                    to={`/profile/${c.profileId}`}
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize:11, color:'#7a5c00', fontWeight:600, textDecoration:'none' }}>
                    Профиль →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat window ── */}
        <div style={{ display:'flex', flexDirection:'column', overflow:'hidden', background:'#fff' }}>

          {/* Header — clickable → profile */}
          <div style={{ padding:'14px 20px', borderBottom:'1.5px solid #eee', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, flexWrap:'wrap', gap:10 }}>
            <Link
              to={`/profile/${active.profileId}`}
              style={{ display:'flex', alignItems:'center', gap:12, textDecoration:'none', color:'inherit' }}>
              <div style={{ position:'relative' }}>
                <div className={`av ${active.avCls}`} style={{ width:44, height:44, fontSize:14 }}>{active.av}</div>
                {active.online && <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:'#28c840', border:'2px solid #fff' }} />}
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ fontWeight:700, fontSize:16 }}>{active.name}</span>
                  <span style={{ fontSize:11, color:'#aaa' }}>→ профиль</span>
                </div>
                <div style={{ fontSize:12, color: active.online ? '#28c840' : '#999' }}>
                  {active.online ? '● онлайн' : 'был недавно'}
                </div>
              </div>
            </Link>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowPropose(true)}>
                <IconCalendar size={13} color="#1a1a1a" /> Предложить занятие
              </button>
              <button style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
                <IconDots size={17} color="#888" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px 24px' }}>
            <div style={{ fontSize:12, color:'#999', textAlign:'center', marginBottom:20 }}>Сегодня</div>
            {active.messages.map(msg => (
              <div key={msg.id} style={{ marginBottom:12, display:'flex', justifyContent: msg.out ? 'flex-end' : 'flex-start' }}>
                {msg.isRequest
                  ? <RequestCard msg={msg} accepted={!!accepted[msg.id]} onAccept={() => setAccepted(a => ({ ...a, [msg.id]:true }))} />
                  : (
                    <div style={{
                      background: msg.out ? '#1a1a1a' : '#f0f0ee',
                      color:      msg.out ? '#F5C842' : '#1a1a1a',
                      borderRadius: 14,
                      borderBottomRightRadius: msg.out ? 3 : 14,
                      borderBottomLeftRadius:  msg.out ? 14 : 3,
                      padding:'10px 15px',
                      fontSize:14, lineHeight:1.6,
                      maxWidth:'60%',
                    }}>
                      {msg.text}
                      <div style={{ fontSize:10, marginTop:4, opacity:.5, textAlign:'right' }}>{msg.time}</div>
                    </div>
                  )
                }
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{ padding:'12px 20px', borderTop:'1.5px solid #eee', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
            <input className="input" style={{ borderRadius:28, flex:1 }}
              placeholder="Написать сообщение..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(input); }}} />
            <button onClick={() => send(input)}
              style={{ background:'#F5C842', border:'none', borderRadius:'50%', width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, opacity: input.trim() ? 1 : .35, transition:'opacity .15s' }}>
              <IconSend size={17} color="#1a1a1a" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
