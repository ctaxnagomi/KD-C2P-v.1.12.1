
import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string, amount: number) => void;
}

export const FundingModal: React.FC<FundingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(100);
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(name || 'Anonymous', amount);
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg overflow-hidden rounded-[2.5rem] relative p-10">
        {!isSuccess ? (
          <>
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
            >
              <span className="text-xl">×</span>
            </button>
            
            <header className="mb-10">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="text-black" size={24} />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Back this Vision</h2>
              <p className="text-zinc-500 text-sm">Every contribution accelerates the development roadmap.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Identity</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Your Name or Alias"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Commitment ($)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 250, 500].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${amount === v ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20'}`}
                    >
                      ${v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <span>Stripe Secure Gateway</span>
                  <Lock size={12} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center px-4 text-zinc-400 font-mono text-sm">
                    •••• •••• •••• 4242
                  </div>
                  <div className="w-20 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-zinc-400 font-mono text-sm">
                    12/26
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all relative overflow-hidden ${isProcessing ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black hover:scale-[1.01] active:scale-95 shadow-xl'}`}
              >
                {isProcessing ? 'Verifying Gateway...' : `Authorize $${amount.toLocaleString()} Payment`}
              </button>
            </form>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Contribution Secured</h2>
            <p className="text-zinc-500">Thank you for believing in the project.</p>
          </div>
        )}
      </div>
    </div>
  );
};
