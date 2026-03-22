import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconSearch, IconFeed, IconChat, IconUser, IconBell, IconLogout } from './Icons';

const NAV_LINKS = [
  { path: '/',           icon: IconHome,   label: 'Главная'   },
  { path: '/feed',       icon: IconFeed,   label: 'Посты'     },
  { path: '/search',     icon: IconSearch, label: 'Поиск'     },
  { path: '/aisearch',       icon: IconFeed,   label: 'Поиск с ИИ' },
  { path: '/post',   icon: IconChat,   label: 'Создать урок' },
  { path: '/interview',       icon: IconFeed,   label: 'Пройти интервью' },
  { path: '/profile', icon: IconUser,   label: 'Профиль'   },
];

export default function Navbar({ user, onLogout, notifications, onMarkAllRead }) {
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [compact,      setCompact]      = useState(false);
  const navRef    = useRef(null);
  const notifRef  = useRef(null);
  const userRef   = useRef(null);
  const location  = useLocation();
  const navigate  = useNavigate();

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const check = () => setCompact(window.innerWidth < 820);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const h = e => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => { setUserMenuOpen(false); onLogout(); navigate('/'); };

  return (
    <nav ref={navRef} style={s.nav}>
      <Link to="/" style={s.logo}>{compact ? 'PA' : 'PEER ACADEMY'}</Link>

      <div style={s.links}>
        {NAV_LINKS.map(({ path, icon: Icon, label }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link key={path} to={path} title={label}
              style={{ ...s.link, ...(active ? s.linkActive : {}) }}>
              <Icon size={16} color={active ? '#F5C842' : '#aaa'} />
              {!compact && <span style={{ whiteSpace:'nowrap', fontSize:13 }}>{label}</span>}
            </Link>
          );
        })}
      </div>

          {/* <> */}
            {/* <Link to="/login"    className="btn btn-outline btn-sm" style={{ flexShrink:0 }}>{compact ? '→' : 'Войти'}</Link> */}
            {/* <Link to="/register" className="btn btn-primary btn-sm" style={{ flexShrink:0, whiteSpace:'nowrap' }}>{compact ? '+' : 'Регистрация'}</Link> */}
          {/*   </> */}
    </nav>
  );
}

const s = {
  nav: { background:'#1a1a1a', height:64, display:'flex', alignItems:'center', padding:'0 24px', gap:8, position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 16px rgba(0,0,0,.3)', overflow:'visible' },
  logo: { color:'#F5C842', fontWeight:800, fontSize:16, letterSpacing:2, textDecoration:'none', flexShrink:0, whiteSpace:'nowrap' },
  links: { display:'flex', alignItems:'center', justifyContent:'center', flex:1, gap:2, minWidth:0 },
  link: { display:'flex', alignItems:'center', gap:6, color:'#aaa', fontWeight:500, padding:'6px 10px', borderRadius:8, textDecoration:'none', transition:'color .15s, background .15s', flexShrink:0 },
  linkActive: { color:'#F5C842', background:'rgba(245,200,66,.1)' },
  right: { display:'flex', alignItems:'center', gap:8, flexShrink:0 },
  iconBtn: { background:'none', border:'none', cursor:'pointer', position:'relative', padding:6, borderRadius:8, display:'flex', alignItems:'center' },
  badge: { position:'absolute', top:0, right:0, background:'#e53935', color:'#fff', fontSize:9, fontWeight:700, width:14, height:14, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' },
  dropdown: { position:'absolute', top:'calc(100% + 10px)', right:0, width:310, background:'#fff', border:'1.5px solid #e5e5e5', borderRadius:14, boxShadow:'0 8px 40px rgba(0,0,0,.18)', zIndex:9999, overflow:'hidden' },
  notifHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 10px', borderBottom:'1.5px solid #eee' },
  markBtn: { background:'none', border:'none', cursor:'pointer', fontSize:12, color:'#7a5c00', fontWeight:600 },
  notifItem: { display:'flex', alignItems:'flex-start', gap:10, padding:'11px 16px', borderBottom:'1px solid #f0f0f0' },
  dot: { width:7, height:7, borderRadius:'50%', background:'#F5C842', flexShrink:0, marginTop:5 },
  avatarBtn: { background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:7, padding:'3px 8px 3px 3px', borderRadius:30 },
  userMenu: { position:'absolute', top:'calc(100% + 10px)', right:0, width:185, background:'#fff', border:'1.5px solid #e5e5e5', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,.14)', zIndex:9999, padding:'6px 0' },
  menuItem: { display:'flex', alignItems:'center', gap:10, padding:'10px 16px', fontSize:14, color:'#333', textDecoration:'none' },
};
