import React, { useEffect, useRef, useState } from 'react';
import {
  Accessibility,
  Users,
  Layers,
  Brain,
  Heart,
  CheckCircle2,
} from 'lucide-react';

// ── Fade-in hook ─────────────────────────────────────────────────────────────
function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return { ref, visible };
}

// ── Animated section wrapper ─────────────────────────────────────────────────
const FadeSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const { ref, visible } = useFadeIn(delay);
  return (
    <div
      ref={ref}
      style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
      className={`${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {children}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export const About: React.FC = () => {
  // Always start at the top of the page when navigating here
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const whoList = [
    'Students who struggle to start tasks',
    'Students who find long text overwhelming',
    'Students who need clear, structured instructions',
    'Anyone who feels traditional productivity tools don\'t work for them',
  ];

  const howList = [
    { icon: Layers, text: 'Breaks large tasks into smaller, manageable steps' },
    { icon: Brain, text: 'Simplifies information into readable formats' },
    { icon: Heart, text: 'Reduces cognitive overload' },
    { icon: CheckCircle2, text: 'Creates a structured and calm workspace' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 px-2 space-y-16">

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <FadeSection delay={0}>
        <div className="text-center space-y-5">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full border border-primary/20 tracking-wide uppercase">
            <Accessibility size={14} />
            Accessibility First Platform
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark leading-tight">
            Built for minds that{' '}
            <span className="text-primary">think differently</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            ClearMind is designed to support students who experience the world
            differently — not as a limitation, but as a different way of
            processing information.
          </p>
        </div>
      </FadeSection>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-800" />

      {/* ── 2. What is ClearMind ────────────────────────────────────────── */}
      <FadeSection delay={80}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
            What is ClearMind?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            ClearMind is an accessibility-first productivity platform that helps
            students manage tasks without feeling overwhelmed.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Instead of forcing users into rigid systems, ClearMind adapts tasks
            into formats that are easier to understand and follow.
          </p>
        </div>
      </FadeSection>

      {/* ── 3. Who it's for ─────────────────────────────────────────────── */}
      <FadeSection delay={140}>
        <div className="bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-2xl p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
              Who is it for?
            </h2>
          </div>
          <ul className="space-y-3">
            {whoList.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                <span className="mt-1 w-5 h-5 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary block" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </FadeSection>

      {/* ── 4. How it helps ─────────────────────────────────────────────── */}
      <FadeSection delay={200}>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
            How ClearMind helps
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {howList.map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-primary/40 transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </FadeSection>

      {/* ── 5. Our philosophy ───────────────────────────────────────────── */}
      <FadeSection delay={260}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
            Our approach
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Most tools expect users to adapt to them.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            ClearMind does the opposite — it adapts to the user.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            This is not about adding accessibility features later. It is about
            designing from the ground up for different ways of thinking.
          </p>
        </div>
      </FadeSection>

      {/* ── 6. Closing ──────────────────────────────────────────────────── */}
      <FadeSection delay={320}>
        <div className="relative overflow-hidden rounded-2xl bg-primary p-10 text-center shadow-lg">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <p className="relative z-10 text-white text-2xl md:text-3xl font-bold leading-relaxed">
            You're not unproductive.
            <br />
            <span className="font-normal opacity-90">
              You just needed a system that works for you.
            </span>
          </p>
        </div>
      </FadeSection>

    </div>
  );
};
