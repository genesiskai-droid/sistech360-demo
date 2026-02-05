
import React, { useState } from 'react';
// Added CheckCircle2 to the imports
import { X, ShieldCheck, Check, ClipboardCheck, Zap, Laptop, Eraser, Search, CheckCircle2 } from 'lucide-react';
import { Ticket } from '../types';

interface QualityControlFormProps {
  ticket: Ticket;
  onClose: () => void;
  onApprove: (qcData: any) => void;
}

const QualityControlForm: React.FC<QualityControlFormProps> = ({ ticket, onClose, onApprove }) => {
  const [checks, setChecks] = useState({
    hardware: false,
    software: false,
    cleaning: false,
    ports: false,
    stressTest: false,
    aesthetic: false
  });

  const allPassed = Object.values(checks).every(v => v);

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-3xl overflow-hidden flex flex-col">
        <div className="bg-indigo-900 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-300 border border-white/10">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Certificación de Calidad</h2>
              <p className="text-[10px] font-black text-indigo-300/60 uppercase tracking-widest">Protocolo Final • Ticket #{ticket.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
        </div>

        <div className="p-10 space-y-8 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'hardware', label: 'Verificación de Hardware', icon: Laptop, desc: 'Componentes internos y ensamblaje' },
              { id: 'software', label: 'Sistemas & Drivers', icon: Zap, desc: 'Arranque limpio y controladores' },
              { id: 'cleaning', label: 'Limpieza Integral', icon: Eraser, desc: 'Interna/Externa y pasta térmica' },
              { id: 'ports', label: 'Puertos & Conectividad', icon: Search, desc: 'USB, HDMI, Wifi y Bluetooth' },
              { id: 'stressTest', label: 'Pruebas de Esfuerzo', icon: ClipboardCheck, desc: 'Temperaturas y rendimiento 30min' },
              { id: 'aesthetic', label: 'Acabado Estético', icon: ShieldCheck, desc: 'Sin huellas ni residuos de obra' },
            ].map((item) => {
              const Icon = item.icon;
              const isChecked = checks[item.id as keyof typeof checks];
              return (
                <button 
                  key={item.id}
                  onClick={() => toggleCheck(item.id as keyof typeof checks)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${isChecked ? 'bg-indigo-50 border-indigo-500 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <div className={`p-3 rounded-xl ${isChecked ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className={`block text-xs font-black uppercase tracking-tight ${isChecked ? 'text-indigo-900' : 'text-slate-500'}`}>{item.label}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-indigo-900 rounded-[2rem] p-8 text-white flex justify-between items-center shadow-xl">
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${allPassed ? 'bg-emerald-500 border-emerald-400' : 'border-white/20'}`}>
                 <Check size={20} className={allPassed ? 'text-white' : 'text-white/20'} />
               </div>
               <div>
                 <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] block mb-1">Resultado de Auditoría</span>
                 <p className="text-sm font-black uppercase tracking-tighter">
                   {allPassed ? 'EQUIPO CERTIFICADO PARA ENTREGA' : 'AUDITORÍA EN PROCESO'}
                 </p>
               </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t flex justify-between items-center bg-white">
          <button onClick={onClose} className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-widest">Regresar</button>
          <button 
            disabled={!allPassed}
            onClick={() => onApprove(checks)}
            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-20 flex items-center gap-3"
          >
            <CheckCircle2 size={18} /> Emitir Certificado OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityControlForm;
