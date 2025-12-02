import { useAppContext } from '../context/AppContext';
import { Play, Pause, Activity } from 'lucide-react';

export function MetronomeControls({ hideSliderOnMobile = false }: { hideSliderOnMobile?: boolean }) {
  const {
    bpm,
    setBpm,
    isMetronomeRunning,
    setIsMetronomeRunning,
    beat,
    beatsPerMeasure,
  } = useAppContext();

  return (
    <div className="p-6 rounded-2xl bg-[#161A2C] border-2 border-[#FF635C]/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-[#FF635C]" />
          <span className="text-lg text-[#FF635C]">Metronome</span>
        </div>
        <button
          onClick={() => setIsMetronomeRunning(!isMetronomeRunning)}
          className={`p-3 rounded-xl transition-colors ${isMetronomeRunning
            ? 'bg-[#FF635C] text-white'
            : 'bg-[#256DFF] text-white'
            }`}
        >
          {isMetronomeRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* <div className="flex items-center justify-between">
        <div className="flex gap-2 ml-6">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${isMetronomeRunning && i === beat
                ? i === 0
                  ? 'bg-[#FF635C] scale-150'
                  : 'bg-[#256DFF] scale-125'
                : 'bg-[#FF635C]/30'
                }`}
            />
          ))}
        </div>
      </div> */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-4 flex-2 ${hideSliderOnMobile ? 'hidden lg:flex' : ''}`}>
          <input
            type="range"
            min="30"
            max="300"
            value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value))}
            className="flex-1 h-2 accent-[#FF635C]"
          />
          <span className="text-lg text-[#FF635C] tabular-nums w-20">{bpm} BPM</span>
        </div>

        <div className="flex gap-2 ml-6">
          {Array.from({ length: beatsPerMeasure }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${isMetronomeRunning && i === beat
                ? i === 0
                  ? 'bg-[#FF635C] scale-150'
                  : 'bg-[#256DFF] scale-125'
                : 'bg-[#FF635C]/30'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
