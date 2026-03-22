export function IconHome({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V10.5z" fill={color} />
    </svg>
  );
}

export function IconSearch({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6" stroke={color} strokeWidth="2" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="13" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconFeed({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" fill={color} />
      <circle cx="6" cy="12" r="3" fill={color} />
      <circle cx="18" cy="19" r="3" fill={color} />
      <line x1="8.6" y1="10.7" x2="15.4" y2="6.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="8.6" y1="13.3" x2="15.4" y2="17.7" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconStar({ size = 18, color = '#F5C842', filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4.8 2.4-7.3L2 9.2h7.6L12 2z"
        stroke={color} strokeWidth={filled ? 0 : 2} strokeLinejoin="round" />
    </svg>
  );
}

export function IconSkills({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 8l10 5 10-5-10-5z" fill={color} />
      <path d="M2 14l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheck({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 11l3 3L22 4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSend({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polyline points="22 2 11 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="22 2 15 22 11 13 2 9" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function IconCalendar({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="2" />
      <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.5" />
      <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="13" width="3" height="3" rx="0.5" fill={color} />
      <rect x="14" y="13" width="3" height="3" rx="0.5" fill={color} />
    </svg>
  );
}

export function IconHeart({ size = 18, color = '#F5C842', filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDots({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.5" fill={color} />
      <circle cx="12" cy="12" r="1.5" fill={color} />
      <circle cx="19" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

export function IconPlus({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconFilter({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="7" x2="20" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="17" x2="14" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconEdit({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLogout({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
