import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconChat, IconSend, IconStar } from '../components/Icons';

const PHRASES = [
  '"Знания, которыми делятся, множатся. Ты не просто учился — ты строил связь."',
  '"Каждое занятие — это +1 к твоей версии себя. Не останавливайся."',
  '"Лучший способ выучить что-то — объяснить это другому. Ты только что доказал это."',
  '"Сегодня ты на шаг впереди себя вчерашнего. Это и есть рост."',
];
const ALL_TAGS = ['Понятно объяснял','Пунктуальность','Терпеливый','Интересно','Структурировано','Практично'];

export default function Review() {
  const [rating,setRating]     = useState(5);
  const [hovered,setHovered]   = useState(0);
  const [tags,setTags]         = useState(['Понятно объяснял','Терпеливый']);
  const [text,setText]         = useState('');
  const [submitted,setSubmitted] = useState(false);
  const [phrase]               = useState(PHRASES[Math.floor(Math.random()*PHRASES.length)]);
  const navigate = useNavigate();

  const toggle = t => setTags(ts=>ts.includes(t)?ts.filter(x=>x!==t):[...ts,t]);

  if (submitted) return (
    <div className="page" style={{textAlign:'center',paddingTop:80}}>
      <div style={{fontSize:56,marginBottom:16}}>🎉</div>
      <h2 style={{fontSize:28,fontWeight:800,marginBottom:10}}>Отзыв отправлен!</h2>
      <p style={{color:'#777',marginBottom:32}}>Спасибо, ты помогаешь платформе становиться лучше</p>
      <button className="btn btn-primary btn-lg" onClick={()=>navigate('/')}>На главную</button>
    </div>
  );

  return (
    <div className="page" style={{display:'flex',justifyContent:'center'}}>
      <div style={{width:'100%',maxWidth:700}}>
        <div style={{background:'#F5C842',borderRadius:18,padding:42,textAlign:'center',marginBottom:28}}>
          <div style={{fontSize:52,marginBottom:12}}>⭐</div>
          <div style={{fontSize:30,fontWeight:800,color:'#1a1a1a',marginBottom:8}}>Занятие завершено!</div>
          <div style={{fontSize:16,color:'#3a3a2a'}}>Ты только что стал чуточку лучше</div>
        </div>

        <div className="card" style={{marginBottom:24,display:'flex',gap:16,alignItems:'flex-start'}}>
          <IconChat size={26} color="#F5C842"/>
          <div style={{fontSize:15,color:'#1a1a1a',lineHeight:1.8,fontStyle:'italic'}}>{phrase}</div>
        </div>

        <div className="card" style={{marginBottom:24}}>
          <div style={{background:'#FFF8D6',border:'1.5px solid #F5C842',borderRadius:12,padding:20,marginBottom:24}}>
            <div style={{fontSize:11,color:'#7a5c00',fontWeight:700,letterSpacing:1.5,marginBottom:12}}>ИТОГ ЗАНЯТИЯ</div>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div className="av av-a" style={{width:52,height:52,fontSize:17}}>АС</div>
              <div>
                <div style={{fontSize:16,fontWeight:700}}>Алина Смирнова</div>
                <div style={{fontSize:14,color:'#7a5c00'}}>ООП в Python · 60 мин</div>
              </div>
            </div>
          </div>

          <div style={{textAlign:'center',marginBottom:24}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:14}}>Как прошло занятие?</div>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              {[1,2,3,4,5].map(i=>(
                <span key={i}
                  onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(0)}
                  onClick={()=>setRating(i)}
                  style={{fontSize:38,cursor:'pointer',color:(hovered||rating)>=i?'#F5C842':'#ddd',transition:'color .1s'}}>
                  ★
                </span>
              ))}
            </div>
            <div style={{fontSize:14,color:'#7a5c00',fontWeight:600,marginTop:8}}>
              {['','Плохо','Так себе','Нормально','Хорошо','Отлично!'][hovered||rating]}
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontWeight:700,fontSize:14,color:'#555',marginBottom:12}}>Что понравилось?</div>
            <div>
              {ALL_TAGS.map(t=>(
                <span key={t} onClick={()=>toggle(t)}
                  style={{display:'inline-block',borderRadius:24,padding:'8px 18px',fontSize:14,
                    marginRight:10,marginBottom:10,cursor:'pointer',transition:'all .12s',
                    background:tags.includes(t)?'#FFF8D6':'#f5f5f3',
                    border:tags.includes(t)?'1.5px solid #F5C842':'1.5px solid #ddd',
                    color:tags.includes(t)?'#7a5c00':'#555'}}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontWeight:700,fontSize:14,color:'#555',marginBottom:10}}>Напиши отзыв (необязательно)</div>
            <textarea className="input" rows={3} style={{resize:'none'}}
              placeholder="Алина очень круто объяснила ООП..."
              value={text} onChange={e=>setText(e.target.value)}/>
          </div>

          <button onClick={()=>setSubmitted(true)} className="btn btn-primary"
            style={{width:'100%',justifyContent:'center',padding:14,fontSize:15}}>
            <IconSend size={16} color="#1a1a1a"/> Отправить отзыв
          </button>
        </div>
      </div>
    </div>
  );
}
