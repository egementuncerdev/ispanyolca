/* Düzen: masaüstü sol sidebar (etiketli), tablet ikon sidebar, mobil alt menü + "Diğer" */
import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { Ellipsis, X } from 'lucide-react';
import { NAV } from './nav';

const linkState = ({ isActive }: { isActive: boolean }) =>
  `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14.5px] transition-colors ${isActive ? 'bg-sunken font-semibold text-ink' : 'text-ink-2 hover:bg-sunken/60 hover:text-ink'}`;

/** Kelime işareti: "Español", ñ vurgu renginde */
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/" className="flex items-baseline gap-0 px-3 py-1 text-ink" aria-label={compact ? 'Español — Ana Sayfa' : undefined}>
      {compact
        ? <span className="display text-3xl leading-none" aria-hidden="true">ñ</span>
        : <span className="display text-[1.7rem] leading-none">Espa<span className="text-accent-ink">ñ</span>ol</span>}
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line px-3 py-6 md:flex md:w-[76px] lg:w-60">
      <div className="mb-8 text-center lg:hidden"><Brand compact /></div>
      <div className="mb-8 hidden lg:block"><Brand /></div>
      <nav aria-label="Ana menü" className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={(s) => `${linkState(s)} md:justify-center lg:justify-start`} title={label}>
            {({ isActive }) => (
              <>
                <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-accent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                <Icon className={`size-[18px] shrink-0 ${isActive ? 'text-accent-ink' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                <span className="md:sr-only lg:not-sr-only">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <p className="hidden px-3 text-xs text-muted lg:block">A1 · İspanya İspanyolcası</p>
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
  const tab = (active: boolean) => `relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? 'text-ink' : 'text-muted'}`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Diğer sayfalar">
          <button type="button" className="absolute inset-0 bg-ink/30" aria-label="Kapat" onClick={() => setOpen(false)} />
          <div ref={sheetRef} className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-surface p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="display text-xl">Diğer</p>
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-sunken" aria-label="Kapat"><X className="size-5" /></button>
            </div>
            <nav aria-label="Diğer sayfalar" className="grid grid-cols-2 gap-2">
              {extra.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={(s) => `${linkState(s)} border border-line py-3`}>
                  <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />{label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
      <nav aria-label="Ana menü" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.filter((n) => n.mobile).map(({ to, label, short, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => tab(isActive)}>
            {({ isActive }) => (
              <>
                <span className={`absolute top-0 h-[3px] w-8 rounded-b-full bg-accent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                <Icon className={`size-5 ${isActive ? 'text-accent-ink' : ''}`} strokeWidth={1.75} aria-hidden="true" />{short ?? label}
              </>
            )}
          </NavLink>
        ))}
        <button type="button" onClick={() => setOpen(true)} aria-expanded={open} className={tab(extraActive)}>
          <Ellipsis className="size-5" strokeWidth={1.75} aria-hidden="true" />Diğer
        </button>
      </nav>
    </>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">İçeriğe geç</a>
      <Sidebar />
      <main id="main" tabIndex={-1} className="min-w-0 flex-1 px-4 pt-8 pb-28 focus:outline-none sm:px-8 md:pb-12 lg:px-14 lg:pt-12">
        <div className="mx-auto max-w-[68rem]"><Outlet /></div>
      </main>
      <BottomNav />
    </div>
  );
}
