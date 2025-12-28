
import React, { useState, useEffect, useRef } from 'react';
import { FileData, MVPData, Funder } from './types';
import { convertRepoToMVP, generateWhitepaper, generatePortfolio } from './services/geminiService';
import { FunderList } from './components/FunderList';
import { FundingModal } from './components/FundingModal';
import { gsap } from 'gsap';
import { jsPDF } from 'jspdf';
import { 
  Rocket, 
  Upload, 
  Cpu, 
  Coffee, 
  Users, 
  ChevronRight, 
  Eye, 
  CheckCircle2,
  Zap,
  Terminal,
  Layers,
  Search,
  ArrowRight,
  RefreshCcw,
  DollarSign,
  TrendingUp as ValuationIcon,
  Globe,
  Database,
  Server,
  Layout,
  Smartphone,
  Box,
  Braces,
  GitBranch,
  Shield,
  Cloud,
  Github,
  FileText,
  Briefcase,
  Loader2,
  Info,
  Map
} from 'lucide-react';

const KDLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-16' : 'h-10';
  const logoRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.to(logoRef.current.children, {
          opacity: 0.6,
          duration: 0.1,
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.05, from: "random" },
          ease: "none"
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`${dim} kd-glow flex items-center`}>
      <svg viewBox="0 0 80 40" className="h-full">
        <g ref={logoRef} fill="#00CC00">
           <rect x="10" y="8" width="4" height="24" />
           <rect x="14" y="16" width="4" height="4" />
           <rect x="18" y="12" width="4" height="4" />
           <rect x="22" y="8" width="4" height="4" />
           <rect x="14" y="20" width="4" height="4" />
           <rect x="18" y="24" width="4" height="4" />
           <rect x="22" y="28" width="4" height="4" />
           <rect x="40" y="8" width="4" height="24" />
           <rect x="44" y="8" width="8" height="4" />
           <rect x="44" y="28" width="8" height="4" />
           <rect x="52" y="12" width="4" height="16" />
        </g>
      </svg>
    </div>
  );
};

// Component to handle the Buy Me a Coffee script injection with high reliability
const BmcButton: React.FC<{ html: string }> = ({ html }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !html) return;
    
    // Clear previous content
    containerRef.current.innerHTML = '';
    
    // Create a temporary container to parse the string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html.trim();

    // Re-create nodes into the actual ref to ensure scripts execute
    const nodes = Array.from(tempDiv.childNodes);
    nodes.forEach(node => {
      if (node instanceof HTMLScriptElement) {
        const script = document.createElement('script');
        Array.from(node.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
        script.textContent = node.textContent;
        containerRef.current?.appendChild(script);
      } else if (node instanceof HTMLStyleElement) {
        const style = document.createElement('style');
        style.textContent = node.textContent;
        containerRef.current?.appendChild(style);
      } else if (node instanceof HTMLElement) {
        const clone = node.cloneNode(true) as HTMLElement;
        // Search for script tags inside the container (common for BMC widgets)
        const innerScripts = clone.querySelectorAll('script');
        innerScripts.forEach(s => {
          const newScript = document.createElement('script');
          Array.from(s.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = s.textContent;
          s.parentNode?.replaceChild(newScript, s);
        });
        containerRef.current?.appendChild(clone);
      } else {
        containerRef.current?.appendChild(node.cloneNode(true));
      }
    });
  }, [html]);

  return <div ref={containerRef} className="flex items-center min-h-[40px] bmc-wrapper" />;
};

const App: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [mvpData, setMvpData] = useState<MVPData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'funding' | 'community'>('overview');
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [backers, setBackers] = useState<Funder[]>([
    { name: 'Elena Vance', amount: 250, date: '2023-11-01' },
    { name: 'Dr. Freeman', amount: 500, date: '2023-11-05' },
    { name: 'Alyx Vance', amount: 150, date: '2023-11-08' }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (mvpData) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();
        tl.to(".dashboard-view", { opacity: 1, duration: 0.4 })
          .from(".aside-panel", { x: -20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
          .from(".main-panel", { x: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
          .from(".valuation-card", { scale: 0.9, opacity: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" }, "-=0.2");
      }, containerRef);
      return () => ctx.revert();
    }
  }, [mvpData]);

  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(tabContentRef.current, 
        { opacity: 0, y: 10, filter: "blur(5px)" }, 
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power1.out" }
      );
    }
  }, [activeTab]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-12), msg]);

  const resetApp = () => {
    setFiles([]);
    setMvpData(null);
    setLogs([]);
    setIsConverting(false);
    setActiveTab('overview');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setIsConverting(true);
    setLogs([]);
    addLog("> Initiating repo analysis sequence...");
    
    let detectedName = "";
    const fileList: FileData[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      // Use webkitRelativePath for deeper folder analysis if uploading folders
      const pathName = file.webkitRelativePath || file.name;
      addLog(`> Reading: ${pathName}`);
      
      const text = await file.text();
      fileList.push({ name: pathName, content: text, type: file.type });

      // Improved detection for Buy Me a Coffee file even in deep paths
      if (pathName.toLowerCase().endsWith('kd-buymeacoffee.txt')) {
        addLog(`> BMC_CONFIG_LOCATED: kd-buymeacoffee.txt found at ${pathName}`);
      }

      if (pathName.toLowerCase().endsWith('package.json')) {
        try {
          const json = JSON.parse(text);
          if (json.name) detectedName = json.name;
        } catch (err) {}
      }
      if (!detectedName && pathName.toLowerCase().endsWith('readme.md')) {
        const match = text.match(/^#\s+(.+)/m);
        if (match) detectedName = match[1].trim();
      }
    }

    const nameHint = detectedName || (uploadedFiles[0].webkitRelativePath ? uploadedFiles[0].webkitRelativePath.split('/')[0] : uploadedFiles[0].name.split('.')[0]);
    
    addLog(`> Identifying Project Identity: ${nameHint}`);
    setFiles(fileList);
    addLog("> Payload stabilized. Deep scanning architecture...");

    try {
      const data = await convertRepoToMVP(fileList, nameHint);
      addLog(`> Synthesis complete for "${data.projectName}".`);
      
      setTimeout(() => {
        setMvpData(data);
        setIsConverting(false);
      }, 800);
    } catch (err) {
      addLog("!! Critical Error during conversion !!");
      setIsConverting(false);
    }
  };

  const handleExportPDF = async (type: 'whitepaper' | 'portfolio') => {
    if (!mvpData) return;
    setIsExporting(type);
    
    try {
      const content = type === 'whitepaper' ? mvpData.whitepaper : mvpData.portfolio;
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(0, 204, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('KD SYNTHESIS REPORT', margin, 18);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text(`${type.toUpperCase()} | ${mvpData.projectName}`, margin, 28);
      
      let cursorY = 50;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text(mvpData.projectName, margin, cursorY);
      cursorY += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
      lines.forEach((line: string) => {
        if (cursorY > pageHeight - 20) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(line, margin, cursorY);
        cursorY += 6;
      });

      doc.save(`${mvpData.projectName.replace(/\s+/g, '_')}_${type}.pdf`);
    } catch (err) {
      console.error("PDF export failed", err);
    } finally {
      setIsExporting(null);
    }
  };

  const addFunder = (name: string, amount: number) => {
    setBackers(prev => [{ name, amount, date: new Date().toISOString().split('T')[0] }, ...prev]);
  };

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'MYR' ? 'en-MY' : 'en-US', {
      style: 'currency', currency, maximumFractionDigits: 0,
    }).format(val);
  };

  const getTechIcon = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('react') || t.includes('ui')) return <Layout size={32} />;
    if (t.includes('node') || t.includes('backend')) return <Server size={32} />;
    if (t.includes('db') || t.includes('sql')) return <Database size={32} />;
    if (t.includes('cloud') || t.includes('aws')) return <Cloud size={32} />;
    return <Terminal size={32} />;
  };

  const getAvatarUrl = (name: string) => {
    const slug = encodeURIComponent(name.toLowerCase().trim());
    return `https://unavatar.io/${slug}?fallback=https://ui-avatars.com/api/?name=${slug}&background=18181b&color=fff`;
  };

  return (
    <div ref={containerRef} className="min-h-screen selection:bg-[#00CC00] selection:text-black">
      <nav className="flex justify-between items-center px-8 py-8 absolute w-full top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={resetApp}>
          <KDLogo size="md" />
        </div>
        
        <div className="flex items-center gap-4">
          {mvpData && (
            <button 
              onClick={resetApp}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 hover:text-[#00CC00] hover:border-[#00CC00]/30 transition-all"
            >
              <RefreshCcw size={12} /> New Analysis
            </button>
          )}
          
          <div className="placeholder-button">
            {mvpData?.buymeacoffee ? (
              <BmcButton html={mvpData.buymeacoffee} />
            ) : (
              <button 
                onClick={() => window.open('https://buymeacoffee.com', '_blank')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 hover:border-[#00CC00]/30 text-sm font-medium transition-all text-zinc-400 hover:text-white"
              >
                <Coffee size={14} /> Buy Coffee
              </button>
            )}
          </div>
        </div>
      </nav>

      {!mvpData && !isConverting && (
        <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="hero-content inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00CC00]"></span> AI Synthesis Protocol
          </div>
          
          <h1 className="hero-content text-6xl md:text-8xl font-bold tracking-tighter text-gradient mb-8 leading-[0.9]">
            Convert code<br/>into a product.
          </h1>
          
          <div className="hero-content relative group mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00CC00] to-emerald-700 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <div className="relative glass-card p-12 md:p-20 rounded-[3rem] border-white/10 hover:border-[#00CC00]/30 transition-all cursor-pointer overflow-hidden">
              <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#00CC00] text-black rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upload Repository</h3>
                <p className="text-zinc-500 text-sm">Packages or raw file collections</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {isConverting && (
        <section className="pt-48 flex justify-center px-6">
          <div className="w-full max-w-2xl glass-card rounded-3xl overflow-hidden border-white/5 shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-4 mono">KD_SYNTHESIS_LOG</span>
            </div>
            <div className="p-8 mono text-[11px] space-y-2 h-80 overflow-y-auto custom-scrollbar bg-black/40">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-3 ${log.startsWith('!!') ? 'text-red-500' : 'text-zinc-400'}`}>
                  <span className="text-zinc-800 shrink-0">{i+1}.</span>
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-[#00CC00] animate-pulse"></div>
                <span className="text-[#00CC00]/60 italic">Mapping architecture...</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {mvpData && (
        <main className="dashboard-view max-w-[1400px] mx-auto pt-32 pb-40 px-6 grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ opacity: 0 }}>
          <aside className="aside-panel lg:col-span-4 space-y-6">
            <div className="glass-card p-10 rounded-[3rem] sticky top-32">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-[#00CC00]/10 border border-[#00CC00]/20 rounded-2xl flex items-center justify-center">
                  <Layers className="text-[#00CC00]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter leading-tight">{mvpData.projectName}</h2>
                  <span className="text-[9px] font-mono font-bold text-[#00CC00] uppercase tracking-widest bg-[#00CC00]/5 px-2 py-0.5 rounded border border-[#00CC00]/10">MVP v{mvpData.mvpVersion}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-10">
                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={<Eye size={16}/>} />
                <TabButton active={activeTab === 'tech'} onClick={() => setActiveTab('tech')} label="Architecture" icon={<Cpu size={16}/>} />
                <TabButton active={activeTab === 'funding'} onClick={() => setActiveTab('funding')} label="Funding & Guide" icon={<ValuationIcon size={16}/>} />
                <TabButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} label="Collaborators" icon={<Users size={16}/>} />
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                <h4 className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-4">Synthesis Output</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleExportPDF('whitepaper')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00CC00]/30 transition-all group">
                    {isExporting === 'whitepaper' ? <Loader2 size={16} className="animate-spin text-[#00CC00]" /> : <FileText size={16} className="text-[#00CC00]" />}
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white">Whitepaper</span>
                  </button>
                  <button onClick={() => handleExportPDF('portfolio')} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#00CC00]/30 transition-all group">
                    {isExporting === 'portfolio' ? <Loader2 size={16} className="animate-spin text-[#00CC00]" /> : <Briefcase size={16} className="text-[#00CC00]" />}
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white">Portfolio</span>
                  </button>
                </div>
                <button onClick={() => setIsSponsorModalOpen(true)} className="w-full py-4 bg-[#00CC00] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#00CC00]/10 mt-2">
                  <Rocket size={18} /> Sponsor Build
                </button>
              </div>
            </div>
          </aside>

          <section className="main-panel lg:col-span-8 space-y-8">
            <div className="glass-card rounded-[3.5rem] min-h-[700px] overflow-hidden flex flex-col premium-gradient">
              <div ref={tabContentRef} className="p-10 md:p-16 flex-1">
                {activeTab === 'overview' && (
                  <div className="space-y-12 max-w-2xl">
                    <header>
                      <h3 className="text-4xl font-bold tracking-tight mb-2 text-gradient">{mvpData.tagline}</h3>
                      <p className="text-sm text-zinc-500 uppercase tracking-widest mb-4 font-mono">Status: {mvpData.deploymentStatus}</p>
                      <p className="text-xl text-zinc-400 leading-relaxed font-light">{mvpData.valueProposition}</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="valuation-card glass-card p-6 rounded-3xl border-white/10 bg-white/[0.02] flex flex-col gap-2">
                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Market Valuation (USD)</div>
                        <div className="text-3xl font-mono font-bold text-white tracking-tighter">{formatCurrency(mvpData.valuation.usd, 'USD')}</div>
                      </div>
                      <div className="valuation-card glass-card p-6 rounded-3xl border-white/10 bg-white/[0.02] flex flex-col gap-2">
                        <div className="text-[9px] font-bold text-[#00CC00] uppercase tracking-widest">Local Est. (MYR)</div>
                        <div className="text-3xl font-mono font-bold text-white tracking-tighter">{formatCurrency(mvpData.valuation.myr, 'MYR')}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Launch Roadmap</h4>
                      <div className="space-y-4">
                        {mvpData.roadmap.map((item, i) => (
                          <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-[#00CC00]/30 transition-all">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-[#00CC00] shrink-0">{i+1}</div>
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-sm font-bold text-white uppercase tracking-tight">{item.milestone}</p>
                                <span className="text-[9px] font-mono text-zinc-500">{item.timeline}</span>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tech' && (
                  <div className="space-y-12">
                    <header><h3 className="text-3xl font-bold tracking-tight">System Architecture</h3></header>
                    
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Core Stack</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {mvpData.techStack.used.map((tech, i) => (
                          <div key={i} className="group relative glass-card rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:bg-[#00CC00] hover:text-black transition-all">
                            <div className="mb-4 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">{getTechIcon(tech.name)}</div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">{tech.name}</span>
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-40 p-3 rounded-xl bg-black border border-[#00CC00]/30 text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-all z-20">
                              <div className="font-bold text-[#00CC00] mb-1">{tech.name}</div>
                              <p className="italic">{tech.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Suggested Upgrades</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mvpData.techStack.suggested.map((tech, i) => (
                          <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#00CC00]/10 flex items-center justify-center shrink-0">
                              <Zap size={18} className="text-[#00CC00]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white mb-1">{tech.name}</p>
                              <p className="text-[10px] text-zinc-500 mb-2">{tech.description}</p>
                              <p className="text-[10px] text-[#00CC00] font-bold italic">Benefit: {tech.benefit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 rounded-[1.5rem] bg-[#020802] border border-[#002200] space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap size={16} className="text-[#00CC00] fill-[#00CC00]" />
                        <h4 className="font-bold text-[#00CC00] text-sm uppercase tracking-widest">KD AI Intelligence Report</h4>
                      </div>
                      <div className="text-xs text-zinc-500 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
                        {mvpData.intelligenceReport}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'funding' && (
                  <div className="space-y-10">
                    <div className="space-y-8">
                      <div className="flex justify-between items-end border-b border-white/5 pb-8">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Backing Required</h3>
                          <p className="text-5xl font-bold text-white tracking-tighter">${backers.reduce((a, b) => a + b.amount, 0).toLocaleString()}</p>
                        </div>
                      </div>
                      <FunderList funders={backers} />
                    </div>

                    <div className="pt-10 border-t border-white/5">
                      <div className="flex items-center gap-3 mb-6">
                        <Info size={16} className="text-[#00CC00]" />
                        <h4 className="font-bold text-white text-sm uppercase tracking-widest">Valuation Tutorial Guide</h4>
                      </div>
                      <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 leading-relaxed italic whitespace-pre-line">
                        {mvpData.valuationTutorial}
                      </div>
                      <div className="mt-4 p-4 rounded-xl bg-[#00CC00]/5 border border-[#00CC00]/20 text-[10px] text-[#00CC00] font-bold italic">
                        Justification: {mvpData.valuation.justification}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'community' && (
                  <div className="space-y-16">
                    <div className="space-y-8">
                      <h3 className="text-3xl font-bold tracking-tight">Collaborators</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { name: 'Isaac Kleiner', role: 'Architector', github: 'kleiner_i' },
                          { name: 'Barney Calhoun', role: 'Fullstack Operative', github: 'calhoun_b' }
                        ].map((dev, i) => (
                          <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#00CC00]/20 transition-all group flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden">
                              <img src={getAvatarUrl(dev.github)} alt={dev.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white group-hover:text-[#00CC00] transition-colors">{dev.name}</h4>
                              <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">{dev.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 space-y-8">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-bold tracking-tight">Contribution Protocol</h3>
                        <p className="text-sm text-zinc-500">Help evolve the KD Synthesis engine. Our infrastructure is open for innovation.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-[#00CC00]/20 transition-all flex gap-6 items-start group">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#00CC00]/30 transition-all">
                            <Terminal size={20} className="text-zinc-400 group-hover:text-[#00CC00]" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-[#00CC00]">Issue Tracking</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">Report reproducible bugs or inconsistencies. Provide environment details and terminal logs for faster resolution via the GitHub Issue Tracker.</p>
                          </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-[#00CC00]/20 transition-all flex gap-6 items-start group">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#00CC00]/30 transition-all">
                            <Zap size={20} className="text-zinc-400 group-hover:text-[#00CC00]" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-[#00CC00]">Feature Proposals</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">Propose new synthesis modules (e.g., market cross-referencing for crypto, real estate) or UI/UX enhancements in our Discussions tab.</p>
                          </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 hover:border-[#00CC00]/20 transition-all flex gap-6 items-start group">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-[#00CC00]/30 transition-all">
                            <GitBranch size={20} className="text-zinc-400 group-hover:text-[#00CC00]" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-[#00CC00]">Code Synthesis (PRs)</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">Submit improvements via pull requests. Adhere to TypeScript standards and maintain the modular architectural blueprint of the KD Protocol.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      <footer className="px-8 py-20 border-t border-white/5 flex flex-col items-center">
        <KDLogo size="lg" />
        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-6">Protocol v5.0 • Synthesis Ready</p>
      </footer>

      <FundingModal isOpen={isSponsorModalOpen} onClose={() => setIsSponsorModalOpen(false)} onSuccess={addFunder} />
    </div>
  );
};

interface TabButtonProps { active: boolean; onClick: () => void; label: string; icon: React.ReactNode; }
const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all transform active:scale-95 ${active ? 'bg-[#00CC00] text-black' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
    <div className="flex items-center gap-4">
      <span className={active ? 'text-black' : 'text-zinc-600'}>{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight size={14} className={active ? 'opacity-40' : 'opacity-0'} />
  </button>
);

export default App;
