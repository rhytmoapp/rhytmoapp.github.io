import { useAppContext } from '../context/AppContext';
import { Timer } from 'lucide-react';

export function PomodoroIndicator() {
  const {
    pomodoroTimeLeft,
    isPomodoroRunning,
    pomodoroPhase,
  } = useAppContext();

  if (!isPomodoroRunning && pomodoroTimeLeft === 0) {
    return null;
  }

  const minutes = Math.floor(pomodoroTimeLeft / 60);
  const seconds = pomodoroTimeLeft % 60;

  const phaseColors = {
    work: 'bg-[#FF635C]/20 text-[#FF635C] border-[#FF635C]/30',
    break: 'bg-[#256DFF]/20 text-[#256DFF] border-[#256DFF]/30',
    longBreak: 'bg-[#256DFF]/20 text-[#256DFF] border-[#256DFF]/30',
  };

  const phaseLabels = {
    work: '💼 Work',
    break: '☕ Break',
    longBreak: '🌟 Long Break',
  };

  return (
    <div className={`p-6 rounded-2xl border-2 ${phaseColors[pomodoroPhase]} flex items-center justify-between bg-[#161A2C]`}>
      <div className="flex items-center gap-3">
        <Timer className="w-5 h-5" />
        <span className="text-lg">{phaseLabels[pomodoroPhase]}</span>
      </div>
      <div className="text-2xl tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {isPomodoroRunning && (
        <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
      )}
    </div>
  );
}
