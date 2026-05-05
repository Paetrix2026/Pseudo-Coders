import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppProvider';
import { 
  ArrowRight, 
  Moon, 
  Sun, 
  Brain, 
  TimerOff, 
  ListX, 
  Target, 
  HeartHandshake, 
  Zap,
  LayoutList,
  Timer,
  Users,
  Settings2,
  UserPlus,
  SlidersHorizontal,
  CheckSquare
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { theme, setTheme } = useAppContext();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition-colors duration-300 font-sans">
      {/* HEADER */}
      <header className="fixed w-full top-0 z-50 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white px-2 py-1 rounded-lg font-bold">C</span>
              <span className="font-bold text-xl tracking-tight text-primary">ClearMind</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-gray-300" />}
              </button>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors">
                Login
              </Link>
              <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              ClearMind – <span className="text-primary">Designed for</span><br /> How You Think
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              An accessibility-first platform that adapts learning to you. Finally, a productivity tool that understands your unique workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link to="/signup" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto justify-center">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="flex items-center gap-2 bg-card-light dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-gray-800 text-text-light dark:text-text-dark border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto justify-center">
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-24 bg-card-light/50 dark:bg-card-dark/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">The Struggle is Real</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Traditional productivity tools are designed for one type of mind. This leads to common challenges that hold you back.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ListX, title: 'Overwhelming Tasks', desc: 'Long lists and complex projects create paralysis instead of progress.' },
                { icon: TimerOff, title: 'Difficulty Focusing', desc: 'Constant distractions and lack of clear boundaries derail your momentum.' },
                { icon: Brain, title: 'Lack of Structure', desc: 'Generic tools don\'t provide the scaffolding needed for neurodivergent minds.' }
              ].map((item, i) => (
                <div key={i} className="bg-bg-light dark:bg-bg-dark p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="bg-red-100 dark:bg-red-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <item.icon size={28} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION SECTION */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">A Platform That Adapts to <span className="text-primary">You</span></h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">ClearMind flips the script. Instead of forcing you into a rigid system, our platform flexes to match your unique working style.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Target, title: 'Adaptive Tasks', desc: 'Smart AI breaking down overwhelming projects into manageable, bite-sized steps.', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { icon: Zap, title: 'Personalized Experience', desc: 'A UI that changes based on your needs—whether you need high contrast, minimalism, or extra structure.', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                { icon: HeartHandshake, title: 'Supportive Community', desc: 'Connect with peers, share strategies, and find accountability in a safe space.', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' }
              ].map((item, i) => (
                <div key={i} className="bg-card-light dark:bg-card-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
                  <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={32} className={item.color} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-primary/5 dark:bg-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features, <br />Simple Interface</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Everything you need to stay on track, designed with cognitive accessibility at the forefront.</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: LayoutList, title: 'Task Breakdown', desc: 'Automatically split large tasks into micro-steps.' },
                { icon: Timer, title: 'Focus Mode', desc: 'Customizable Pomodoro timers with sensory-friendly alerts.' },
                { icon: Users, title: 'Community Support', desc: 'Body doubling and shared goals with like-minded users.' },
                { icon: Settings2, title: 'Customizable UI', desc: 'Tailor colors, fonts, and layout complexity.' }
              ].map((item, i) => (
                <div key={i} className="bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-300 shadow-sm hover:shadow-md">
                  <item.icon size={32} className="text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Get started in three simple steps.</p>
            </div>
            
            <div className="relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0" />
              
              <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {[
                  { step: '01', icon: UserPlus, title: 'Sign Up', desc: 'Create your account in seconds. No credit card required.' },
                  { step: '02', icon: SlidersHorizontal, title: 'Choose Your Style', desc: 'Set your sensory preferences and working style in our quick onboarding.' },
                  { step: '03', icon: CheckSquare, title: 'Get Structured', desc: 'Start adding tasks and let ClearMind help you execute them smoothly.' }
                ].map((item, i) => (
                  <div key={i} className="relative flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-bg-light dark:bg-bg-dark border-4 border-card-light dark:border-card-dark rounded-full flex items-center justify-center shadow-xl mb-6 relative z-10 group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
                      <item.icon size={32} className="text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 px-4">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-black opacity-10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to regain your focus?</h2>
            <p className="text-xl text-primary-100 mb-10 opacity-90">Join thousands of users who have transformed how they work with ClearMind.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-2xl hover:-translate-y-1">
              Start using ClearMind today <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-card-light dark:bg-card-dark border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white px-2 py-1 rounded-lg font-bold text-sm">C</span>
            <span className="font-bold text-lg text-primary">ClearMind</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {new Date().getFullYear()} ClearMind. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
