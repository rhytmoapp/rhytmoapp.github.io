import { Play, Pause, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PomodoroIndicator } from './PomodoroIndicator';

export function Metronome() {
  const {
    bpm,
    setBpm,
    isMetronomeRunning,
    setIsMetronomeRunning,
    beat,
    beatsPerMeasure,
    setBeatsPerMeasure,
  } = useAppContext();

  const handleBpmChange = (delta: number) => {
    setBpm(Math.max(30, Math.min(300, bpm + delta)));
  };

  const togglePlay = () => {
    setIsMetronomeRunning(!isMetronomeRunning);
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-2 gap-8 h-full">
        {/* Left Column - Main Controls */}
        <div className="bg-[#161A2C] rounded-3xl p-12 flex flex-col items-center justify-center">
          <div className="text-center mb-12">
            <h2 className="text-[#B4BACB] mb-6">Metronome</h2>

            {/* BPM Display */}
            <div className="relative mb-8">
              <div className="text-8xl text-white mb-4">{bpm}</div>
              <div className="text-[#B4BACB] text-xl">BPM</div>
            </div>

            {/* BPM Controls */}
            <div className="flex items-center gap-6 mb-12">
              <button
                onClick={() => handleBpmChange(-10)}
                className="w-16 h-16 rounded-full bg-[#0C1020] flex items-center justify-center hover:bg-[#256DFF] transition-colors"
              >
                <Minus className="w-6 h-6 text-white" />
              </button>

              <input
                type="range"
                min="30"
                max="300"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value))}
                className="w-64 h-2 accent-[#256DFF]"
              />

              <button
                onClick={() => handleBpmChange(10)}
                className="w-16 h-16 rounded-full bg-[#0C1020] flex items-center justify-center hover:bg-[#256DFF] transition-colors"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Fine Controls */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleBpmChange(-1)}
                className="px-6 py-3 rounded-lg bg-[#0C1020] text-white hover:bg-[#256DFF] transition-colors"
              >
                -1
              </button>
              <button
                onClick={() => handleBpmChange(1)}
                className="px-6 py-3 rounded-lg bg-[#0C1020] text-white hover:bg-[#256DFF] transition-colors"
              >
                +1
              </button>
            </div>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all ${isMetronomeRunning
                ? 'bg-[#FF635C] hover:bg-[#FF635C]/90 shadow-[#FF635C]/30'
                : 'bg-[#256DFF] hover:bg-[#256DFF]/90 shadow-[#256DFF]/30'
              }`}
          >
            {isMetronomeRunning ? (
              <Pause className="w-16 h-16 text-white" />
            ) : (
              <Play className="w-16 h-16 text-white ml-2" />
            )}
          </button>
        </div>

        {/* Right Column - Visual & Settings */}
        <div className="flex flex-col gap-8">
          {/* Pomodoro Status */}
          <PomodoroIndicator />

          {/* Beat Indicator */}
          <div className="bg-[#161A2C] rounded-3xl p-12 flex-1 flex flex-col items-center justify-center">
            <h3 className="text-[#B4BACB] mb-8">Beat Visualization</h3>

            <div className="flex gap-4 mb-12">
              {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-full transition-all duration-100 ${isMetronomeRunning && i === beat
                      ? i === 0
                        ? 'bg-[#FF635C] scale-110 shadow-lg shadow-[#FF635C]/50'
                        : 'bg-[#256DFF] scale-110 shadow-lg shadow-[#256DFF]/50'
                      : 'bg-[#0C1020]'
                    }`}
                />
              ))}
            </div>

            {/* Time Signature */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-[#B4BACB]">Time Signature</span>
              <div className="flex gap-3">
                {[2, 3, 4, 6].map((beats) => (
                  <button
                    key={beats}
                    onClick={() => setBeatsPerMeasure(beats)}
                    className={`px-6 py-3 rounded-lg transition-all ${beatsPerMeasure === beats
                        ? 'bg-[#256DFF] text-white'
                        : 'bg-[#0C1020] text-[#B4BACB] hover:bg-[#256DFF]/20'
                      }`}
                  >
                    {beats}/4
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Pomodoro Status at Top */}
        <PomodoroIndicator />

        {/* Metronome Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h2 className="text-[#B4BACB] mb-2">Metronome</h2>

            {/* BPM Display */}
            <div className="relative">
              <div className="text-6xl text-white mb-2">{bpm}</div>
              <div className="text-[#B4BACB]">BPM</div>
            </div>
          </div>

          {/* BPM Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleBpmChange(-10)}
              className="w-12 h-12 rounded-full bg-[#0C1020] flex items-center justify-center active:bg-[#256DFF] transition-colors"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>

            <input
              type="range"
              min="30"
              max="300"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-48 accent-[#256DFF]"
            />

            <button
              onClick={() => handleBpmChange(10)}
              className="w-12 h-12 rounded-full bg-[#0C1020] flex items-center justify-center active:bg-[#256DFF] transition-colors"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Beat Indicator */}
          <div className="flex gap-2">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full transition-all duration-100 ${isMetronomeRunning && i === beat
                    ? i === 0
                      ? 'bg-[#FF635C] scale-110'
                      : 'bg-[#256DFF] scale-110'
                    : 'bg-[#0C1020]'
                  }`}
              />
            ))}
          </div>

          {/* Time Signature */}
          <div className="flex items-center gap-4">
            <span className="text-[#B4BACB]">Time Signature:</span>
            <select
              value={beatsPerMeasure}
              onChange={(e) => setBeatsPerMeasure(parseInt(e.target.value))}
              className="px-4 py-2 rounded-lg border border-[#256DFF]/30 bg-[#0C1020] text-white"
            >
              <option value={2}>2/4</option>
              <option value={3}>3/4</option>
              <option value={4}>4/4</option>
              <option value={6}>6/8</option>
            </select>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${isMetronomeRunning
                ? 'bg-[#FF635C] hover:bg-[#FF635C]/90'
                : 'bg-[#256DFF] hover:bg-[#256DFF]/90'
              }`}
          >
            {isMetronomeRunning ? (
              <Pause className="w-10 h-10 text-white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
