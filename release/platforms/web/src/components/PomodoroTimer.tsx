import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Save, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { MetronomeControls } from './MetronomeControls';

interface PomodoroSession {
  id: string;
  date: number;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  completedCycles: number;
  totalWorkTime: number;
}

export function PomodoroTimer() {
  const {
    pomodoroTimeLeft,
    setPomodoroTimeLeft,
    isPomodoroRunning,
    setIsPomodoroRunning,
    pomodoroPhase,
    setPomodoroPhase,
    completedSessions,
    setCompletedSessions,
    totalWorkTime,
    setTotalWorkTime,
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    longBreakMinutes,
    setLongBreakMinutes,
    sessionsBeforeLongBreak,
    setSessionsBeforeLongBreak,
    setIsMetronomeRunning, // Added for stopping metronome
  } = useAppContext();

  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic moved to AppContext

  // Phase completion and sound logic moved to AppContext

  const toggleTimer = () => {
    if (!isPomodoroRunning && pomodoroTimeLeft === 0) {
      setPomodoroTimeLeft(workMinutes * 60);
      setPomodoroPhase('work');
    }
    setIsPomodoroRunning(!isPomodoroRunning);
  };

  const resetTimer = () => {
    setIsPomodoroRunning(false);
    setIsMetronomeRunning(false); // Stop metronome
    setPomodoroPhase('work');
    setPomodoroTimeLeft(workMinutes * 60);
  };

  const saveSession = () => {
    const session: PomodoroSession = {
      id: Date.now().toString(),
      date: Date.now(),
      workDuration: workMinutes,
      breakDuration: breakMinutes,
      longBreakDuration: longBreakMinutes,
      sessionsBeforeLongBreak,
      completedCycles: completedSessions,
      totalWorkTime,
    };

    const sessions = JSON.parse(localStorage.getItem('pomodoroSessions') || '[]');
    sessions.push(session);
    localStorage.setItem('pomodoroSessions', JSON.stringify(sessions));

    // Reset for new session
    setCompletedSessions(0);
    setTotalWorkTime(0);
    resetTimer();

    alert('Session saved successfully!');
  };

  const minutes = Math.floor(pomodoroTimeLeft / 60);
  const seconds = pomodoroTimeLeft % 60;
  const progress = pomodoroPhase === 'work'
    ? ((workMinutes * 60 - pomodoroTimeLeft) / (workMinutes * 60)) * 100
    : pomodoroPhase === 'break'
      ? ((breakMinutes * 60 - pomodoroTimeLeft) / (breakMinutes * 60)) * 100
      : ((longBreakMinutes * 60 - pomodoroTimeLeft) / (longBreakMinutes * 60)) * 100;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-2 gap-8 h-full">
        {/* Left Column - Timer */}
        <div className="bg-[#161A2C] rounded-3xl p-12 flex flex-col items-center justify-center relative">
          {!showSettings ? (
            <>
              <button
                onClick={() => {
                  setShowSettings(true);
                  setIsPomodoroRunning(false);
                  setIsMetronomeRunning(false);
                }}
                className="absolute top-6 right-6 p-3 rounded-lg hover:bg-[#0C1020] transition-colors"
              >
                <Settings className="w-6 h-6 text-[#B4BACB]" />
              </button>

              <div className="text-center mb-8">
                <div className="text-[#B4BACB] mb-2">
                  Session {completedSessions + 1}
                </div>

                {/* Phase Indicator */}
                <div className={`inline-block px-8 py-3 rounded-full text-lg ${pomodoroPhase === 'work' ? 'bg-[#FF635C]/20 text-[#FF635C]' :
                  pomodoroPhase === 'break' ? 'bg-[#256DFF]/20 text-[#256DFF]' :
                    'bg-[#256DFF]/20 text-[#256DFF]'
                  }`}>
                  {pomodoroPhase === 'work' ? '💼 Work Time' :
                    pomodoroPhase === 'break' ? '☕ Short Break' :
                      '🌟 Long Break'}
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative mb-12">
                <svg className="w-96 h-96 -rotate-90">
                  <circle
                    cx="192"
                    cy="192"
                    r="180"
                    stroke="#0C1020"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="192"
                    cy="192"
                    r="180"
                    stroke={pomodoroPhase === 'work' ? '#FF635C' : '#256DFF'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 180}`}
                    strokeDashoffset={`${2 * Math.PI * 180 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-7xl text-white tabular-nums mb-4">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>

                  {/* Session Dots */}
                  <div className="flex gap-3">
                    {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${i < completedSessions % sessionsBeforeLongBreak
                          ? 'bg-[#FF635C]'
                          : 'bg-[#0C1020]'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-6 items-center">
                <button
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-full bg-[#0C1020] flex items-center justify-center hover:bg-[#256DFF] transition-colors"
                >
                  <RotateCcw className="w-7 h-7 text-white" />
                </button>

                <button
                  onClick={toggleTimer}
                  className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all ${isPomodoroRunning
                    ? 'bg-[#FF635C] hover:bg-[#FF635C]/90 shadow-[#FF635C]/30'
                    : 'bg-[#256DFF] hover:bg-[#256DFF]/90 shadow-[#256DFF]/30'
                    }`}
                >
                  {isPomodoroRunning ? (
                    <Pause className="w-16 h-16 text-white" />
                  ) : (
                    <Play className="w-16 h-16 text-white ml-2" />
                  )}
                </button>

                <button
                  onClick={saveSession}
                  disabled={completedSessions === 0}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${completedSessions === 0
                    ? 'bg-[#0C1020] cursor-not-allowed opacity-50'
                    : 'bg-[#256DFF] hover:bg-[#256DFF]/90'
                    }`}
                >
                  <Save className="w-7 h-7 text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white text-2xl">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-[#0C1020] rounded-lg"
                >
                  <X className="w-6 h-6 text-[#B4BACB]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[#B4BACB] mb-3">Work Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={workMinutes}
                    onChange={(e) => {
                      setWorkMinutes(parseInt(e.target.value));
                      if (pomodoroPhase === 'work' && !isPomodoroRunning) {
                        setPomodoroTimeLeft(parseInt(e.target.value) * 60);
                      }
                    }}
                    className="w-full px-6 py-4 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white text-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#B4BACB] mb-3">Break Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                    className="w-full px-6 py-4 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white text-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#B4BACB] mb-3">Long Break Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakMinutes}
                    onChange={(e) => setLongBreakMinutes(parseInt(e.target.value))}
                    className="w-full px-6 py-4 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white text-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#B4BACB] mb-3">Sessions Before Long Break</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={sessionsBeforeLongBreak}
                    onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value))}
                    className="w-full px-6 py-4 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white text-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Metronome */}
        <div className="flex flex-col gap-8">
          {/* Metronome Controls */}
          <MetronomeControls />

          {/* Stats */}
          <div className="bg-[#161A2C] rounded-3xl p-12 flex-1">
            <h3 className="text-white text-xl mb-8">Current Session</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#FF635C]/10 rounded-2xl p-6 text-center border border-[#FF635C]/20">
                <div className="text-5xl text-[#FF635C] mb-2">{completedSessions}</div>
                <div className="text-[#B4BACB]">Completed Cycles</div>
              </div>
              <div className="bg-[#256DFF]/10 rounded-2xl p-6 text-center border border-[#256DFF]/20">
                <div className="text-5xl text-[#256DFF] mb-2">{totalWorkTime}m</div>
                <div className="text-[#B4BACB]">Focus Time</div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-[#0C1020] rounded-2xl">
              <div className="text-[#B4BACB] text-sm mb-2">Session Configuration</div>
              <div className="text-white">
                {workMinutes}m work • {breakMinutes}m break • {longBreakMinutes}m long break
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Metronome Controls at Top */}
        {!showSettings && <MetronomeControls hideSliderOnMobile={true} />}

        {/* Pomodoro Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {showSettings ? (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-[#B4BACB]"
                >
                  Done
                </button>
              </div>

              <div>
                <label className="block text-[#B4BACB] mb-2">Work Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={workMinutes}
                  onChange={(e) => {
                    setWorkMinutes(parseInt(e.target.value));
                    if (pomodoroPhase === 'work' && !isPomodoroRunning) {
                      setPomodoroTimeLeft(parseInt(e.target.value) * 60);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white"
                />
              </div>

              <div>
                <label className="block text-[#B4BACB] mb-2">Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white"
                />
              </div>

              <div>
                <label className="block text-[#B4BACB] mb-2">Long Break Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakMinutes}
                  onChange={(e) => setLongBreakMinutes(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white"
                />
              </div>

              <div>
                <label className="block text-[#B4BACB] mb-2">Sessions Before Long Break</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={sessionsBeforeLongBreak}
                  onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full">
                <div className="text-[#B4BACB]">
                  Session {completedSessions + 1}
                </div>
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setIsPomodoroRunning(false);
                    setIsMetronomeRunning(false);
                  }}
                  className="p-2 rounded-lg hover:bg-[#0C1020]"
                >
                  <Settings className="w-5 h-5 text-[#B4BACB]" />
                </button>
              </div>

              {/* Phase Indicator */}
              <div className={`px-6 py-2 rounded-full ${pomodoroPhase === 'work' ? 'bg-[#FF635C]/20 text-[#FF635C]' :
                pomodoroPhase === 'break' ? 'bg-[#256DFF]/20 text-[#256DFF]' :
                  'bg-[#256DFF]/20 text-[#256DFF]'
                }`}>
                {pomodoroPhase === 'work' ? '💼 Work Time' :
                  pomodoroPhase === 'break' ? '☕ Short Break' :
                    '🌟 Long Break'}
              </div>

              {/* Circular Progress */}
              <div className="relative">
                <svg className="w-64 h-64 -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#0C1020"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke={pomodoroPhase === 'work' ? '#FF635C' : '#256DFF'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl text-white tabular-nums">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Session Dots */}
              <div className="flex gap-2">
                {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < completedSessions % sessionsBeforeLongBreak
                      ? 'bg-[#FF635C]'
                      : 'bg-[#0C1020]'
                      }`}
                  />
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-[#FF635C]/10 rounded-lg p-4 text-center border border-[#FF635C]/20">
                  <div className="text-2xl text-[#FF635C]">{completedSessions}</div>
                  <div className="text-[#B4BACB] text-sm">Completed</div>
                </div>
                <div className="bg-[#256DFF]/10 rounded-lg p-4 text-center border border-[#256DFF]/20">
                  <div className="text-2xl text-[#256DFF]">{totalWorkTime}m</div>
                  <div className="text-[#B4BACB] text-sm">Focus Time</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                <button
                  onClick={resetTimer}
                  className="w-14 h-14 rounded-full bg-[#0C1020] flex items-center justify-center active:bg-[#256DFF]"
                >
                  <RotateCcw className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={toggleTimer}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${isPomodoroRunning
                    ? 'bg-[#FF635C] hover:bg-[#FF635C]/90'
                    : 'bg-[#256DFF] hover:bg-[#256DFF]/90'
                    }`}
                >
                  {isPomodoroRunning ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </button>

                <button
                  onClick={saveSession}
                  disabled={completedSessions === 0}
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${completedSessions === 0
                    ? 'bg-[#0C1020] cursor-not-allowed opacity-50'
                    : 'bg-[#256DFF] hover:bg-[#256DFF]/90 active:bg-[#256DFF]/80'
                    }`}
                >
                  <Save className="w-6 h-6 text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
