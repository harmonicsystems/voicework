import React, { useState, useRef, useEffect, useCallback } from 'react';
import { YIN } from 'pitchfinder';

// Note frequencies for reference (A4 = 440Hz)
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function frequencyToNote(frequency) {
  if (!frequency || frequency < 20) return { note: '--', octave: '', cents: 0 };

  // Calculate semitones from A4 (440Hz)
  const semitones = 12 * Math.log2(frequency / 440);
  const roundedSemitones = Math.round(semitones);
  const cents = Math.round((semitones - roundedSemitones) * 100);

  // A4 is the 9th note (index 9) in octave 4
  const noteIndex = ((roundedSemitones % 12) + 12 + 9) % 12;
  const octave = 4 + Math.floor((roundedSemitones + 9) / 12);

  return {
    note: NOTE_NAMES[noteIndex],
    octave: octave,
    cents: cents
  };
}

const PitchVisualizer = () => {
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState(null);
  const [noteInfo, setNoteInfo] = useState({ note: '--', octave: '', cents: 0 });
  const [volume, setVolume] = useState(0);
  const [waveformData, setWaveformData] = useState(new Array(64).fill(0));
  const [error, setError] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const detectPitchRef = useRef(null);

  const startListening = async () => {
    try {
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      streamRef.current = stream;

      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Initialize pitch detector (YIN is great for voice)
      detectPitchRef.current = YIN({ sampleRate: audioContext.sampleRate });

      setIsListening(true);

      // Start analysis loop
      analyze();

    } catch (err) {
      console.error('Microphone access error:', err);
      setError('Could not access microphone. Please allow microphone permissions.');
    }
  };

  const stopListening = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setIsListening(false);
    setFrequency(null);
    setNoteInfo({ note: '--', octave: '', cents: 0 });
    setVolume(0);
    setWaveformData(new Array(64).fill(0));
  }, []);

  const analyze = () => {
    if (!analyserRef.current || !detectPitchRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);
    const waveformArray = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getFloatTimeDomainData(dataArray);
      analyser.getByteTimeDomainData(waveformArray);

      // Calculate volume (RMS)
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);
      const volumeLevel = Math.min(1, rms * 5); // Scale for visibility
      setVolume(volumeLevel);

      // Only detect pitch if there's enough volume
      if (volumeLevel > 0.01) {
        const pitch = detectPitchRef.current(dataArray);
        if (pitch && pitch > 50 && pitch < 1000) {
          setFrequency(Math.round(pitch));
          setNoteInfo(frequencyToNote(pitch));
        }
      } else {
        setFrequency(null);
        setNoteInfo({ note: '--', octave: '', cents: 0 });
      }

      // Sample waveform for visualization (take every nth sample)
      const samples = 64;
      const step = Math.floor(waveformArray.length / samples);
      const newWaveform = [];
      for (let i = 0; i < samples; i++) {
        newWaveform.push((waveformArray[i * step] - 128) / 128);
      }
      setWaveformData(newWaveform);

      animationRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
      border: '1px solid rgba(var(--accent-rgb), 0.2)',
      borderRadius: '4px',
      textAlign: 'center'
    }}>
      <h4 style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        marginBottom: '1.5rem'
      }}>
        Voice Visualizer
      </h4>

      {error && (
        <p style={{
          color: '#e57373',
          marginBottom: '1rem',
          fontSize: '0.95rem'
        }}>
          {error}
        </p>
      )}

      {/* Waveform Visualization */}
      <div style={{
        height: '120px',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px'
      }}>
        {waveformData.map((value, index) => (
          <div
            key={index}
            style={{
              width: '3px',
              height: `${Math.abs(value) * 100 + 4}px`,
              backgroundColor: isListening && volume > 0.01
                ? 'var(--accent)'
                : 'rgba(var(--accent-rgb), 0.2)',
              borderRadius: '2px',
              transition: 'height 0.05s ease, background-color 0.2s ease',
              opacity: isListening ? 0.4 + Math.abs(value) * 0.6 : 0.3
            }}
          />
        ))}
      </div>

      {/* Frequency Display */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          fontSize: 'clamp(3rem, 10vw, 4.5rem)',
          fontFamily: 'var(--font-heading)',
          fontWeight: 'var(--heading-weight)',
          letterSpacing: '-0.02em',
          color: frequency ? 'var(--text)' : 'rgba(var(--text-rgb), 0.3)',
          lineHeight: 1
        }}>
          {noteInfo.note}
          <span style={{
            fontSize: '0.4em',
            verticalAlign: 'sub',
            opacity: noteInfo.octave ? 1 : 0
          }}>
            {noteInfo.octave}
          </span>
        </div>

        {/* Cents indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '0.75rem',
          opacity: frequency ? 1 : 0.3
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: 'rgba(var(--text-rgb), 0.5)',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            flat
          </span>
          <div style={{
            width: '120px',
            height: '4px',
            backgroundColor: 'rgba(var(--accent-rgb), 0.2)',
            borderRadius: '2px',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--accent)',
              borderRadius: '50%',
              transform: `translate(calc(-50% + ${noteInfo.cents}%), -50%)`,
              transition: 'transform 0.1s ease'
            }} />
          </div>
          <span style={{
            fontSize: '0.875rem',
            color: 'rgba(var(--text-rgb), 0.5)',
            fontFamily: "'DM Sans', sans-serif"
          }}>
            sharp
          </span>
        </div>

        {/* Frequency in Hz */}
        <p style={{
          marginTop: '1rem',
          fontSize: '1.125rem',
          color: 'rgba(var(--text-rgb), 0.6)',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          {frequency ? `${frequency} Hz` : 'Waiting for sound...'}
        </p>
      </div>

      {/* Start/Stop Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '1rem 2rem',
          backgroundColor: isListening ? 'var(--accent)' : 'transparent',
          border: '1px solid var(--accent)',
          color: isListening ? 'var(--bg)' : 'var(--accent)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      {isListening && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.95rem',
          color: 'rgba(var(--text-rgb), 0.6)',
          fontStyle: 'italic'
        }}>
          Try humming a steady note and watch it appear above.
        </p>
      )}
    </div>
  );
};

export default PitchVisualizer;
