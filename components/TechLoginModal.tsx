
import React, { useState } from 'react';
import { Lock, X, ChevronRight, Shield, Info } from 'lucide-react';
import { TECH_STAFF } from '../constants';

interface TechLoginModalProps {
  onClose: () => void;
  onSuccess: (role: 'tech' | 'manager') => void;
}

const TechLoginModal: React.FC<TechLoginModalProps> = ({ onClose, onSuccess }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // 1. Verificación de Administrador Maestro
      if ((user === 'admin' || user === 'TEC-000') && pass === 'admin123') {
         onSuccess('manager');
         return;
      }

      // 2. Verificación contra Staff del PDF
      const technician = TECH_STAFF.find(t => 
        (t.email.toLowerCase() === user.toLowerCase() || t.id.toUpperCase() === user.toUpperCase()) && 
        t.password === pass
      );

      if (technician) {
        // Nivel 3 (Lucía, Elena) acceden a Torre de Control
        if (technician.level === 3) {
          onSuccess('manager');
        } else {
          onSuccess('tech');
        }
      } else {
        setError('Credenciales JH&F inválidas. Acceso denegado por el Nodo de Seguridad.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 pointer-events-none">
           <Shield size={140} />
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Acceso Staff</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest opacity-80">TechNova Solutions JH&F</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">ID Técnico o Email</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900"
              placeholder="admin / TEC-106"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Clave Maestra</label>
            <input 
              type="password"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all text-slate-900"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="text-[10px] font-black text-red-600 text-center uppercase tracking-widest leading-tight p-3 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <>ACCEDER AL NODO <ChevronRight size={18} /></>
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <button 
            onClick={() => setShowHint(!showHint)}
            className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all"
          >
            <Info size={14} /> {showHint ? 'Ocultar ayuda' : 'Ver credenciales de prueba'}
          </button>
          
          {showHint && (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed">
                <span className="text-slate-900">Admin:</span> admin / admin123 <br/>
                <span className="text-slate-900">Gerente:</span> TEC-106 / LR62703338 <br/>
                <span className="text-slate-900">Técnico:</span> TEC-101 / DF69916674
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechLoginModal;
