import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

type TimerPhase = 'work' | 'break' | 'longBreak';

interface AppContextType {
  // Metronome state
  bpm: number;
  setBpm: (bpm: number) => void;
  isMetronomeRunning: boolean;
  setIsMetronomeRunning: (running: boolean) => void;
  beat: number;
  beatsPerMeasure: number;
  setBeatsPerMeasure: (beats: number) => void;

  // Pomodoro state
  pomodoroTimeLeft: number;
  setPomodoroTimeLeft: (time: number) => void;
  isPomodoroRunning: boolean;
  setIsPomodoroRunning: (running: boolean) => void;
  pomodoroPhase: TimerPhase;
  setPomodoroPhase: (phase: TimerPhase) => void;
  completedSessions: number;
  setCompletedSessions: (sessions: number) => void;
  totalWorkTime: number;
  setTotalWorkTime: (time: number) => void;

  // Settings
  workMinutes: number;
  setWorkMinutes: (min: number) => void;
  breakMinutes: number;
  setBreakMinutes: (min: number) => void;
  longBreakMinutes: number;
  setLongBreakMinutes: (min: number) => void;
  sessionsBeforeLongBreak: number;
  setSessionsBeforeLongBreak: (sessions: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Metronome state
  const [bpm, setBpm] = useState(120);
  const [isMetronomeRunning, setIsMetronomeRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);

  // Pomodoro state
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState(workMinutes * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroPhase, setPomodoroPhase] = useState<TimerPhase>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalWorkTime, setTotalWorkTime] = useState(0);

  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pomodoroIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Metronome ticker
  useEffect(() => {
    if (isMetronomeRunning) {
      const interval = 60000 / bpm;
      metronomeIntervalRef.current = setInterval(() => {
        setBeat((prev) => {
          const nextBeat = (prev + 1) % beatsPerMeasure;
          playClick(nextBeat === 0);
          return nextBeat;
        });
      }, interval);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
      setBeat(0);
    }

    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [isMetronomeRunning, bpm, beatsPerMeasure]);

  // Pomodoro ticker
  useEffect(() => {
    if (isPomodoroRunning && pomodoroTimeLeft > 0) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroTimeLeft((prev) => {
          if (prev <= 1) {
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    }

    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    };
  }, [isPomodoroRunning, pomodoroTimeLeft]);

  const handlePhaseComplete = () => {
    playNotificationSound();

    if (pomodoroPhase === 'work') {
      const newCompleted = completedSessions + 1;
      setCompletedSessions(newCompleted);
      setTotalWorkTime(prev => prev + workMinutes);

      if (newCompleted % sessionsBeforeLongBreak === 0) {
        setPomodoroPhase('longBreak');
        setPomodoroTimeLeft(longBreakMinutes * 60);
      } else {
        setPomodoroPhase('break');
        setPomodoroTimeLeft(breakMinutes * 60);
      }
    } else {
      setPomodoroPhase('work');
      setPomodoroTimeLeft(workMinutes * 60);
    }

    setIsPomodoroRunning(false);
  };

  const playNotificationSound = () => {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.3;

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);

    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1000;
      gain2.gain.value = 0.3;
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.2);
    }, 200);
  };

  const playClick = (isAccent: boolean) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = isAccent ? 1000 : 800;
    gainNode.gain.value = isAccent ? 0.3 : 0.2;

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  };

  const value: AppContextType = {
    bpm,
    setBpm,
    isMetronomeRunning,
    setIsMetronomeRunning,
    beat,
    beatsPerMeasure,
    setBeatsPerMeasure,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
