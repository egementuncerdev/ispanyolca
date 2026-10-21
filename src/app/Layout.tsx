/* Düzen: masaüstü sol sidebar (etiketli), tablet ikon sidebar, mobil alt menü + "Diğer" */
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Ellipsis, X } from 'lucide-react';
import { NAV } from './nav';

const linkBase = 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors';
const linkState = ({ isActive }: { isActive: boolean }) =>
  `${linkBase} ${isActive ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`;

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/" className="flex items-center gap-2.5 px-2 py-1" aria-label={compact ? 'Español — Ana Sayfa' : undefined}>
      <span className="grid size-9 place-items-center rounded-xl bg-accent-600 text-lg font-bold text-white dark:bg-accent-500 dark:text-slate-950" aria-hidden="true">ñ</span>
      {!compact && <span className="text-base font-semibold tracking-tight">Español</span>}
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-slate-200 bg-white/70 px-3 py-4 backdrop-blur md:flex md:w-[72px] lg:w-60 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mb-6 lg:hidden"><Brand compact /></div>
      <div className="mb-6 hidden lg:block"><Brand /></div>
      <nav aria-label="Ana menü" className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={(s) => `${linkState(s)} md:justify-center lg:justify-start`} title={label}>
            <Icon className="size-5 shrink-0" aria-hidden="true" />
            <span className="md:sr-only lg:not-sr-only">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function BottomNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const sheetRef = useRef<HTMLDivElement>(null);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    sheetRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const extra = NAV.filter((n) => !n.mobile);
  const extraActive = extra.some((n) => pathname.startsWith(n.to));

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Diğer sayfalar">
          <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Kapat" onClick={() => setOpen(false)} />
          <div ref={sheetRef} className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-slate-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="font-semibold">Diğer</p>
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Kapat"><X className="size-5" /></button>
            </div>
            <nav aria-label="Diğer sayfalar" className="grid grid-cols-2 gap-2">
              {extra.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={(s) => `${linkState(s)} border border-slate-200 dark:border-slate-800`}>
                  <Icon className="size-5" aria-hidden="true" />{label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
      <nav aria-label="Ana menü" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-slate-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-900/90">
        {NAV.filter((n) => n.mobile).map(({ to, label, short, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-500 dark:text-slate-400'}`}>
            <Icon className="size-5" aria-hidden="true" />{short ?? label}
          </NavLink>
        ))}
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${extraActive ? 'text-accent-600 dark:text-accent-400' : 'text-slate-500 dark:text-slate-400'}`}>
          <Ellipsis className="size-5" aria-hidden="true" />Diğer
        </button>
      </nav>
    </>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow dark:focus:bg-slate-900">İçeriğe geç</a>
      <Sidebar />
      <main id="main" ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 px-4 pt-6 pb-28 focus:outline-none sm:px-6 md:pb-10 lg:px-10 lg:pt-10">
        <div className="mx-auto max-w-5xl"><Outlet /></div>
      </main>
      <BottomNav />
    </div>
  );
}
