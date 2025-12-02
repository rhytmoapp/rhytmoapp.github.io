import { useState } from 'react';
import { Metronome } from './components/Metronome';
import { PomodoroTimer } from './components/PomodoroTimer';
import { History } from './components/History';
import { AppLogo } from './components/AppLogo';
import { Timer, Activity, BarChart3 } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';

type Tab = 'metronome' | 'pomodoro' | 'history';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('pomodoro');
  const { setIsPomodoroRunning, setIsMetronomeRunning } = useAppContext();

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-[#0C1020]">
        {/* Sidebar Navigation */}
        <aside className="w-28 bg-[#161A2C] border-r border-[#256DFF]/20 flex flex-col">
          <div className="p-6 flex flex-col items-center">
            <AppLogo />
            <h1 className="text-white text-center mt-4 text-sm font-medium">Rhytmo</h1>
          </div>

          <nav className="flex-1 px-4">
            <button
              onClick={() => setActiveTab('metronome')}
              className={`w-full flex flex-col items-center gap-2 px-2 py-2 rounded-xl mb-2 transition-all ${activeTab === 'metronome'
                ? 'bg-[#256DFF] text-white shadow-lg shadow-[#256DFF]/20'
                : 'text-[#B4BACB] hover:bg-[#0C1020]'
                }`}
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs">Metronome</span>
            </button>

            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`w-full flex flex-col items-center gap-2 px-2 py-2 rounded-xl mb-2 transition-all ${activeTab === 'pomodoro'
                ? 'bg-[#256DFF] text-white shadow-lg shadow-[#256DFF]/20'
                : 'text-[#B4BACB] hover:bg-[#0C1020]'
                }`}
            >
              <Timer className="w-6 h-6" />
              <span className="text-xs">Pomodoro</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setIsPomodoroRunning(false);
                setIsMetronomeRunning(false);
              }}
              className={`w-full flex flex-col items-center gap-2 px-2 py-2 rounded-xl mb-2 transition-all ${activeTab === 'history'
                ? 'bg-[#256DFF] text-white shadow-lg shadow-[#256DFF]/20'
                : 'text-[#B4BACB] hover:bg-[#0C1020]'
                }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">History</span>
            </button>
          </nav>

          <div className="p-6 border-t border-[#256DFF]/20">
            <div className="text-[#B4BACB] text-xs text-center">
              © 2025 Rhytmo
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-12">
          <div className="w-full max-w-5xl">
            {activeTab === 'metronome' && <Metronome />}
            {activeTab === 'pomodoro' && <PomodoroTimer />}
            {activeTab === 'history' && <History />}
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-[#0C1020] flex flex-col">
        {/* Header */}
        <header className="pt-8 pb-4 px-6 flex flex-col items-center">
          <div className="scale-75">
            <AppLogo />
          </div>
          <h1 className="text-white text-center mt-2">Rhytmo</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 pb-24 overflow-y-auto">
          <div className="bg-[#161A2C] rounded-3xl shadow-2xl p-6 min-h-[500px]">
            {activeTab === 'metronome' && <Metronome />}
            {activeTab === 'pomodoro' && <PomodoroTimer />}
            {activeTab === 'history' && <History />}
          </div>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#161A2C]/95 backdrop-blur-sm border-t border-[#256DFF]/20 safe-area-pb">
          <div className="flex items-center justify-around px-6 py-3">
            <button
              onClick={() => setActiveTab('metronome')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === 'metronome'
                ? 'bg-[#256DFF] text-white'
                : 'text-[#B4BACB]'
                }`}
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs">Metronome</span>
            </button>

            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === 'pomodoro'
                ? 'bg-[#256DFF] text-white'
                : 'text-[#B4BACB]'
                }`}
            >
              <Timer className="w-6 h-6" />
              <span className="text-xs">Pomodoro</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                setIsPomodoroRunning(false);
                setIsMetronomeRunning(false);
              }}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${activeTab === 'history'
                ? 'bg-[#256DFF] text-white'
                : 'text-[#B4BACB]'
                }`}
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">History</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
