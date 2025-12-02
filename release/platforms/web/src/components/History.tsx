import { useState, useEffect } from 'react';
import { Calendar, Timer, Trash2, TrendingUp } from 'lucide-react';

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

export function History() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const stored = localStorage.getItem('pomodoroSessions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed.sort((a: PomodoroSession, b: PomodoroSession) => b.date - a.date));
    }
  };

  const deleteSession = (id: string) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    localStorage.setItem('pomodoroSessions', JSON.stringify(filtered));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setSessions([]);
      localStorage.removeItem('pomodoroSessions');
    }
  };

  const getFilteredSessions = () => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    switch (filter) {
      case 'today':
        return sessions.filter(s => s.date >= oneDayAgo);
      case 'week':
        return sessions.filter(s => s.date >= oneWeekAgo);
      default:
        return sessions;
    }
  };

  const filteredSessions = getFilteredSessions();

  const totalSessions = filteredSessions.length;
  const totalCycles = filteredSessions.reduce((sum, s) => sum + s.completedCycles, 0);
  const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.totalWorkTime, 0);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-3 gap-8 h-full">
        {/* Stats Column */}
        <div className="bg-[#161A2C] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl">Statistics</h2>
          </div>

          {/* Stats Overview */}
          <div className="space-y-6">
            <div className="bg-[#FF635C]/10 rounded-2xl p-6 border border-[#FF635C]/20">
              <div className="text-5xl text-[#FF635C] mb-2">{totalSessions}</div>
              <div className="text-[#B4BACB]">Total Sessions</div>
            </div>

            <div className="bg-[#256DFF]/10 rounded-2xl p-6 border border-[#256DFF]/20">
              <div className="text-5xl text-[#256DFF] mb-2">{totalCycles}</div>
              <div className="text-[#B4BACB]">Completed Cycles</div>
            </div>

            <div className="bg-[#FF635C]/10 rounded-2xl p-6 border border-[#FF635C]/20">
              <div className="text-5xl text-[#FF635C] mb-2">{totalMinutes}</div>
              <div className="text-[#B4BACB]">Minutes of Focus</div>
            </div>

            <div className="bg-[#0C1020] rounded-2xl p-6">
              <div className="text-[#B4BACB] text-sm mb-2">Average per Session</div>
              <div className="text-white text-2xl">
                {totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0}m
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List Column */}
        <div className="col-span-2 bg-[#161A2C] rounded-3xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl">Session History</h2>
            {sessions.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[#FF635C] hover:text-[#FF635C]/80 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl transition-colors ${filter === 'all'
                ? 'bg-[#256DFF] text-white'
                : 'bg-[#0C1020] text-[#B4BACB] hover:bg-[#256DFF]/20'
                }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-6 py-3 rounded-xl transition-colors ${filter === 'week'
                ? 'bg-[#256DFF] text-white'
                : 'bg-[#0C1020] text-[#B4BACB] hover:bg-[#256DFF]/20'
                }`}
            >
              This Week
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-6 py-3 rounded-xl transition-colors ${filter === 'today'
                ? 'bg-[#256DFF] text-white'
                : 'bg-[#0C1020] text-[#B4BACB] hover:bg-[#256DFF]/20'
                }`}
            >
              Today
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <TrendingUp className="w-16 h-16 text-[#B4BACB]/30 mb-4" />
                <p className="text-[#B4BACB] text-lg">No sessions yet</p>
                <p className="text-[#B4BACB]/60 mt-2">
                  Complete a Pomodoro session to see your progress here
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0C1020] rounded-xl p-6 flex items-center justify-between border border-[#256DFF]/20 hover:border-[#256DFF]/40 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-[#B4BACB]" />
                      <span className="text-white text-lg">{formatDate(session.date)}</span>
                      <span className="text-[#B4BACB]">{formatTime(session.date)}</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[#B4BACB]">
                        <Timer className="w-4 h-4" />
                        <span>{session.totalWorkTime} min focus</span>
                      </div>
                      <div className="text-[#B4BACB]">
                        {session.completedCycles} cycles
                      </div>
                      <div className="text-[#B4BACB]/60 text-sm">
                        {session.workDuration}m/{session.breakDuration}m
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-3 hover:bg-[#FF635C]/20 rounded-xl transition-colors ml-4"
                  >
                    <Trash2 className="w-5 h-5 text-[#FF635C]" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">Progress</h2>
          {sessions.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[#FF635C] text-sm"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-[#FF635C]/10 rounded-lg p-3 text-center border border-[#FF635C]/20">
            <div className="text-2xl text-[#FF635C]">{totalSessions}</div>
            <div className="text-[#B4BACB] text-xs">Sessions</div>
          </div>
          <div className="bg-[#256DFF]/10 rounded-lg p-3 text-center border border-[#256DFF]/20">
            <div className="text-2xl text-[#256DFF]">{totalCycles}</div>
            <div className="text-[#B4BACB] text-xs">Cycles</div>
          </div>
          <div className="bg-[#FF635C]/10 rounded-lg p-3 text-center border border-[#FF635C]/20">
            <div className="text-2xl text-[#FF635C]">{totalMinutes}m</div>
            <div className="text-[#B4BACB] text-xs">Focus Time</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === 'all'
              ? 'bg-[#256DFF] text-white'
              : 'bg-[#0C1020] text-[#B4BACB]'
              }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === 'week'
              ? 'bg-[#256DFF] text-white'
              : 'bg-[#0C1020] text-[#B4BACB]'
              }`}
          >
            This Week
          </button>
          <button
            onClick={() => setFilter('today')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${filter === 'today'
              ? 'bg-[#256DFF] text-white'
              : 'bg-[#0C1020] text-[#B4BACB]'
              }`}
          >
            Today
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="w-12 h-12 text-[#B4BACB]/30 mb-3" />
              <p className="text-[#B4BACB]">No sessions yet</p>
              <p className="text-[#B4BACB]/60 text-sm mt-1">
                Complete a Pomodoro session to see your progress here
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-[#0C1020] rounded-lg p-4 flex items-start justify-between border border-[#256DFF]/20"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#B4BACB]" />
                    <span className="text-white">{formatDate(session.date)}</span>
                    <span className="text-[#B4BACB] text-sm">{formatTime(session.date)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-[#B4BACB]">
                      <Timer className="w-3 h-3" />
                      <span>{session.totalWorkTime} min focus</span>
                    </div>
                    <div className="text-[#B4BACB]">
                      {session.completedCycles} cycles
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-[#B4BACB]/60">
                    {session.workDuration}m work / {session.breakDuration}m break
                  </div>
                </div>

                <button
                  onClick={() => deleteSession(session.id)}
                  className="p-2 hover:bg-[#FF635C]/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-[#FF635C]" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}