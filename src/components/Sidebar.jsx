// SidebarScrollSpyDemo.jsx (plain JS)
// React 18 · Tailwind CSS 3 · framer-motion 10
import React, { useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileNav from './MobileNav';

const SECTIONS = [
  { id: 'preface', raw: 'Preface' },
  { id: 'narrative', raw: 'Narrative Review' },
  { id: 'provider', raw: "Provider's Perspective" },
  { id: 'reflect', raw: 'Record, Reflect, Refine' },
  { id: 'guidance', raw: 'Practical Guidance' },
  { id: 'research', raw: 'Driving Research' },
  { id: 'collab', raw: 'International Collaboration' },
];

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useLayoutEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;
    let ticking = false;
    const OFFSET = 100;
    const calc = () => {
      ticking = false;
      const tops = els.map(el => el.getBoundingClientRect().top);
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] - OFFSET <= 0) {
          idx = i;
        }
      }
      setActive(els[idx].id);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(calc);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', calc);
    calc();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', calc);
    };
  }, [ids]);
  useLayoutEffect(() => {
    const handler = (e) => setActive(e.detail);
    window.addEventListener('nav-activate', handler);
    return () => window.removeEventListener('nav-activate', handler);
  }, []);
  return active;
}

const INDICATOR = {
  rest:   { width: 4,  height: 2, borderRadius: 1, backgroundColor: '#475569' },
  hover:  { width: 14, height: 2, borderRadius: 1, backgroundColor: '#94a3b8' },
  active: { width: 22, height: 2, borderRadius: 1, backgroundColor: '#ffffff' },
};

function SidebarItem({ id, title, active }) {
  const [hovered, setHovered] = useState(false);
  const state = active ? 'active' : hovered ? 'hover' : 'rest';
  const handleClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('nav-activate', { detail: id }));
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };
  return (
    <li
      className="flex items-center gap-3 py-1 font-medium"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        layout="size"
        variants={INDICATOR}
        animate={state}
        transition={{
          layout: {
            type: 'spring',
            stiffness: active || hovered ? 130 : 260,
            damping: active || hovered ? 44 : 22,
          },
          backgroundColor: { duration: 0.4, ease: 'easeInOut' },
        }}
        className="block shrink-0"
      />
      <a
        href={`#${id}`}
        onClick={handleClick}
        className={`block text-sm transition-colors duration-150
          ${active ? 'text-[#ffffff] font-bold' : hovered ? 'text-[#cfd2d6]' : 'text-[#6e7783]'}
        `}
        aria-current={active ? 'location' : undefined}
      >
        {title}
      </a>
    </li>
  );
}

const LONG_LOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in mi quis risus vehicula pretium. Sed luctus nibh et libero aliquet, quis maximus arcu pellentesque. Suspendisse potenti. Mauris sed sagittis purus. Curabitur ullamcorper, tortor sed cursus dictum, libero nisi interdum nulla, vel ultrices quam erat quis leo.`;

export default function SidebarScrollSpyDemo() {
  const active = useScrollSpy(SECTIONS.map((s) => s.id));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileNavOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (!window.location.hash && window.innerWidth >= 768) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('nav-activate', { detail: SECTIONS[0].id }));
        document.getElementById(SECTIONS[0].id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
        history.replaceState(null, '', `#${SECTIONS[0].id}`);
        window.dispatchEvent(new Event('scroll'));
      }, 1500);
    }
  }, []);

  function smoothScrollTo(targetY, duration = 1350) {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let start;
    function easeInOut(t) {
      return 0.5 * (1 - Math.cos(Math.PI * t));
    }
    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOut(t);
      window.scrollTo(0, startY + diff * eased);
      if (t < 1) {
        window.requestAnimationFrame(step);
      }
    }
    window.requestAnimationFrame(step);
  }

  const handleSectionClick = (id) => {
    window.dispatchEvent(new CustomEvent('nav-activate', { detail: id }));
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.scrollY;
      smoothScrollTo(targetY, 1350);
    }
    history.replaceState(null, '', `#${id}`);
    setIsMobileNavOpen(false);
  };

  const sidebarMotion = {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 1.2, duration: 1.1, type: 'spring', stiffness: 120, damping: 30 } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.7 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i === 0 ? 0 : 0.25 + i * 0.27,
        duration: 1.05,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/40 to-slate-800/40">
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-16" style={{ scrollPaddingTop: '6rem' }}>
        {isMobile && (
          <MobileNav
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(!isMobileNavOpen)}
            activeSection={active}
            onSectionClick={handleSectionClick}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 md:gap-8 sm:gap-4 items-start max-w-6xl mx-auto">
          <AnimatePresence>
            {!isMobile && (
              <motion.aside
                {...sidebarMotion}
                className="sticky top-24 w-72 px-6 pr-10 py-8 rounded-lg bg-[#112038] shadow-lg select-none"
              >
                <ul role="list" className="space-y-1">
                  {SECTIONS.map((s, idx) => (
                    <SidebarItem key={s.id} id={s.id} title={idx === 0 ? s.raw : `${idx}. ${s.raw}`} active={active === s.id} />
                  ))}
                </ul>
              </motion.aside>
            )}
          </AnimatePresence>
          <article className="space-y-16 rounded-lg px-4 py-14 md:px-10 md:pt-8">
            {SECTIONS.map((s, idx) => (
              <motion.section
                key={s.id}
                id={s.id}
                className="scroll-mt-24 mb-8 rounded-xl bg-gradient-to-br from-stone-50 to-fuchsia-50 border border-[#e7dfd7] shadow-md p-6 md:p-8"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                custom={idx}
              >
                <h2
                  className="mb-6 not-prose"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: '40px',
                    color: '#383437',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.raw}
                </h2>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#666666',
                    maxWidth: '28rem',
                    marginLeft: 0,
                    marginRight: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: LONG_LOREM.replace(/(\bhttps?:\/\/\S+)/g, (url) =>
                      `<a href="${url}" style="font-family: Inter, sans-serif; font-weight: 700; font-size: 16px; color: #152536; text-decoration: none; transition: color 150ms;" onmouseover="this.style.color='#529C9C';this.style.textDecoration='underline'" onmouseout="this.style.color='#152536';this.style.textDecoration='none'">${url}</a>`
                    ),
                  }}
                />
              </motion.section>
            ))}
            <div className="h-screen" aria-hidden="true"></div>
          </article>
        </div>
      </main>
    </div>
  );
}
