import React from 'react';

interface LandingPageProps {
  onAuth?: (mode: 'login' | 'signup') => void;
  isLoggedIn?: boolean;
  onBackToDashboard?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onAuth, isLoggedIn, onBackToDashboard }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const auroraBackgroundStyle = {
    background: `
      radial-gradient(ellipse 80% 60% at 70% 20%, rgba(175, 109, 255, 0.85), transparent 68%),
      radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.75), transparent 68%),
      radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.98), transparent 68%),
      radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.3), transparent 68%),
      linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
    `,
  };

  const sunsetGradient = "bg-gradient-to-r from-[#ff9966] to-[#ff5e62]";
  const sunsetShadow = "shadow-lg shadow-orange-200/50";

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* Aurora Dream Vivid Bloom Background */}
      {/* eslint-disable-next-line react/no-inline-styles */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={auroraBackgroundStyle} />
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-[100] bg-white/40 backdrop-blur-2xl border-b border-white/20">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`w-10 h-10 ${sunsetGradient} rounded-xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300`}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`text-2xl font-black bg-gradient-to-r from-[#ff9966] to-[#ff5e62] bg-clip-text text-transparent`}>
              HireStream AI
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-700">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#ff5e62] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff5e62] hover:after:w-full after:transition-all">Features</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-[#ff5e62] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff5e62] hover:after:w-full after:transition-all">About</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-[#ff5e62] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#ff5e62] hover:after:w-full after:transition-all">Testimonials</button>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={onBackToDashboard}
                className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => onAuth?.('login')}
                  className="hidden sm:block px-6 py-3 text-sm font-bold text-slate-700 hover:text-[#ff5e62] transition-all"
                >
                  Log In
                </button>
                <button 
                  onClick={() => onAuth?.('signup')}
                  className={`px-6 py-3 ${sunsetGradient} text-white text-sm font-bold rounded-2xl ${sunsetShadow} hover:brightness-110 hover:-translate-y-0.5 transition-all active:scale-95`}
                >
                  Join for Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 z-10">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/50 text-[#ff5e62] text-[11px] font-black uppercase tracking-widest mb-10 animate-fade-in">
            <span className="w-2 h-2 bg-[#ff5e62] rounded-full animate-ping" />
            Next-Gen Recruitment Platform
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[1.05] max-w-5xl mx-auto tracking-tight drop-shadow-sm">
            Hiring built on <span className="bg-gradient-to-r from-[#ff9966] via-[#ff5e62] to-[#ff9966] bg-size-200 animate-gradient-x bg-clip-text text-transparent">Intelligence</span>, not intuition.
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Connect top-tier talent with world-class opportunities. HireStream uses Gemini AI to screen resumes with human-like understanding in seconds.
          </p>
          
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
              <button 
                onClick={() => onAuth?.('signup')}
                className={`w-full sm:w-auto px-12 py-5 ${sunsetGradient} text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,94,98,0.4)] hover:brightness-110 hover:-translate-y-1 transition-all active:scale-95 text-lg`}
              >
                Start Hiring
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="w-full sm:w-auto px-12 py-5 bg-white/60 backdrop-blur-md border border-white text-slate-700 font-bold rounded-2xl hover:bg-white hover:border-orange-200 transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-orange-100/20"
              >
                Who We Are
              </button>
            </div>
          )}

          {/* Feature Highlight Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl rounded-[3.5rem] -z-10 shadow-2xl" />
            <div className="bg-white/40 p-3 rounded-[3.5rem] border border-white shadow-2xl overflow-hidden group">
               <div className="relative rounded-[2.8rem] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2340" 
                    alt="Platform Preview" 
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-tr from-[#ff5e62]/20 to-transparent`} />
                  
                  {/* Overlay Stats */}
                  <div className="absolute top-8 left-8 p-6 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white animate-fade-in">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${sunsetGradient} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</div>
                        <div className="text-2xl font-black text-slate-900 leading-none">98.4%</div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section: Comprehensive Redesign */}
      <section id="about" className="py-32 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-6">
          {/* Mission Statement */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-xs font-black text-[#ff5e62] uppercase tracking-[0.4em] mb-6">Our DNA</h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-tight">
              Human-centric AI for the <span className="text-[#ff5e62]">modern workforce.</span>
            </h3>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              We started HireStream because we were tired of "Black Box" hiring. Recruiters were overwhelmed by volume, and candidates were invisible in spreadsheets. We built an intelligence layer that treats every resume as a story, not a list of keywords.
            </p>
          </div>

          {/* How It Works Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
            {[
              { 
                step: "01", 
                title: "Post & Distribute", 
                desc: "Create high-impact job postings and reach candidates globally in one click.",
                img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800"
              },
              { 
                step: "02", 
                title: "AI Analysis", 
                desc: "Gemini AI reads resumes, identifies skills, and provides qualitative match reasoning.",
                img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
              },
              { 
                step: "03", 
                title: "Precision Hire", 
                desc: "Review your Top Talent pool and contact the perfect fit directly via email.",
                img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="absolute -top-6 -left-4 text-7xl font-black text-slate-900/5 group-hover:text-[#ff5e62]/10 transition-colors z-0 select-none">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="rounded-[2.5rem] overflow-hidden mb-8 border border-white shadow-xl aspect-video">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Core Values Cards */}
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff5e62]/20 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="lg:w-1/3">
                  <h3 className="text-4xl font-black text-white mb-6">Our Values</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Technology is only as good as the principles behind it. We build with integrity, transparency, and empathy.
                  </p>
                </div>
                <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: "Radical Fairness", desc: "Removing bias from the first touchpoint of the hiring journey." },
                    { title: "Speed to Talent", desc: "Shortening the time-to-hire from weeks to hours." },
                    { title: "Skill Depth", desc: "Analyzing actual competency over university names." },
                    { title: "Candidate Respect", desc: "Giving every applicant the attention they deserve." }
                  ].map((val, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                      <h5 className="text-white font-black text-lg mb-2">{val.title}</h5>
                      <p className="text-slate-400 text-sm font-medium leading-relaxed">{val.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-[#ff5e62] uppercase tracking-[0.4em] mb-4">Core Technology</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight">Built for modern HR teams.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Intelligent Ranking',
                desc: 'Our AI understands context, not just keywords. It ranks candidates by their actual potential for success.',
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                gradient: 'from-[#ff9966] to-[#ff5e62]'
              },
              {
                title: 'PDF Visualization',
                desc: 'Seamlessly preview candidate resumes directly in the app. No more downloading messy attachments.',
                icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
                gradient: 'from-[#ff9966] to-[#ff5e62]'
              },
              {
                title: 'Direct Connection',
                desc: 'One-click outreach to candidates via email integration. Move from screening to interview in seconds.',
                icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                gradient: 'from-[#ff9966] to-[#ff5e62]'
              }
            ].map((feat, i) => (
              <div key={i} className="group p-1 bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500">
                <div className="bg-white/80 p-10 rounded-[2.2rem] h-full flex flex-col">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feat.gradient} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feat.icon} /></svg>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">{feat.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 relative z-10 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black text-[#ff5e62] uppercase tracking-[0.4em] mb-4">Social Proof</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight">Trusted by industry leaders.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "HireStream AI cut our screening time by 90%. We found our Head of Design in just 3 days using the Gemini match score.",
                author: "Sarah Jenkins",
                role: "HR Director at PixelFlow",
                avatar: "https://i.pravatar.cc/150?u=sarah"
              },
              {
                quote: "The PDF visualization and AI reasoning are game-changers. I can see exactly why a candidate is ranked high without opening 50 tabs.",
                author: "Michael Chen",
                role: "Tech Recruiter at Neural Labs",
                avatar: "https://i.pravatar.cc/150?u=michael"
              },
              {
                quote: "As a candidate, the AI feedback was incredibly helpful. It felt like a transparent process rather than a black hole.",
                author: "Aria Rodriguez",
                role: "Senior React Developer",
                avatar: "https://i.pravatar.cc/150?u=aria"
              }
            ].map((testi, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex gap-1 text-orange-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-slate-700 font-medium leading-relaxed italic mb-8">"{testi.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={testi.avatar} alt={testi.author} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                  <div>
                    <div className="font-black text-slate-900 text-sm">{testi.author}</div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5e62]/20 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
                Unlock your <span className={`bg-gradient-to-r from-[#ff9966] to-[#ff5e62] bg-clip-text text-transparent`}>team's potential.</span>
              </h3>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                The most efficient way to hire. Join over 5,000 forward-thinking companies already using HireStream AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <button 
                   onClick={() => onAuth?.('signup')}
                   className={`w-full sm:w-auto px-12 py-5 bg-white text-slate-900 font-black rounded-2xl shadow-2xl hover:bg-orange-50 transition-all active:scale-95 text-lg`}
                 >
                   Join for Free
                 </button>
                 <button 
                   className="w-full sm:w-auto px-12 py-5 bg-white/10 text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all text-lg backdrop-blur-md"
                 >
                   Request a Demo
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-20 bg-white/40 backdrop-blur-xl border-t border-white/30 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 ${sunsetGradient} rounded-lg flex items-center justify-center shadow-lg`}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             </div>
             <span className="text-xl font-black text-slate-900">HireStream AI</span>
          </div>
          <div className="text-slate-500 font-bold text-sm">
            &copy; {new Date().getFullYear()} HireStream AI. Powered by Google Gemini.
          </div>
          <div className="flex gap-8">
             <button className="text-xs font-black text-slate-400 hover:text-[#ff5e62] uppercase tracking-widest">Privacy Policy</button>
             <button className="text-xs font-black text-slate-400 hover:text-[#ff5e62] uppercase tracking-widest">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;