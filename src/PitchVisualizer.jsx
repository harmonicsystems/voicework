import React, { useState, useRef, useEffect, useCallback } from 'react';
import { YIN } from 'pitchfinder';

// Note frequencies for reference (A4 = 440Hz)
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Voice frequency range (Hz)
const VOICE_FREQ_MIN = 65;   // ~C2, low male voice
const VOICE_FREQ_MAX = 1100; // ~C6, high female voice

// Smoothing and stability settings
const SMOOTHING_FACTOR = 0.15;        // Lower = smoother but more latent
const STABILITY_WINDOW_SIZE = 12;     // Samples to track for stability
const STABILITY_THRESHOLD = 8;        // Hz variance for "stable" state
const VERY_STABLE_THRESHOLD = 3;      // Hz variance for "locked" state

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

// Calculate variance of an array
function calculateVariance(values) {
  if (values.length < 2) return Infinity;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => (v - mean) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
}

const PitchVisualizer = () => {
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState(null);
  const [noteInfo, setNoteInfo] = useState({ note: '--', octave: '', cents: 0 });
  const [volume, setVolume] = useState(0);
  const [waveformData, setWaveformData] = useState(new Array(64).fill(0));
  const [error, setError] = useState(null);
  const [stability, setStability] = useState('searching'); // 'searching' | 'unstable' | 'stable' | 'locked'
  const [confidence, setConfidence] = useState(0); // 0-1 signal quality
  const [testToneFreq, setTestToneFreq] = useState(null); // null = off, number = playing

  const audioContextRef = useRef(null);
  const testOscillatorRef = useRef(null);
  const testGainRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const detectPitchRef = useRef(null);

  // Smoothing refs (persist across renders without triggering re-renders)
  const smoothedFreqRef = useRef(null);
  const frequencyHistoryRef = useRef([]);

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

      // Initialize pitch detector (YIN tuned for voice)
      detectPitchRef.current = YIN({
        sampleRate: audioContext.sampleRate,
        threshold: 0.15,  // Lower = more sensitive but more false positives
        probabilityThreshold: 0.1
      });

      // Reset smoothing state
      smoothedFreqRef.current = null;
      frequencyHistoryRef.current = [];

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
    setStability('searching');
    setConfidence(0);
    smoothedFreqRef.current = null;
    frequencyHistoryRef.current = [];
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

      // Only detect pitch if there's enough volume (lowered for sensitivity)
      if (volumeLevel > 0.005) {
        const rawPitch = detectPitchRef.current(dataArray);

        if (rawPitch && rawPitch > VOICE_FREQ_MIN && rawPitch < VOICE_FREQ_MAX) {
          // Calculate confidence based on volume and pitch validity
          const signalConfidence = Math.min(1, volumeLevel * 3);
          setConfidence(signalConfidence);

          // Apply smoothing: exponential moving average
          if (smoothedFreqRef.current === null) {
            smoothedFreqRef.current = rawPitch;
          } else {
            // Adaptive smoothing: less smoothing for big jumps (likely intentional)
            const jump = Math.abs(rawPitch - smoothedFreqRef.current);
            const adaptiveFactor = jump > 50 ? 0.5 : SMOOTHING_FACTOR;
            smoothedFreqRef.current += (rawPitch - smoothedFreqRef.current) * adaptiveFactor;
          }

          const smoothedPitch = smoothedFreqRef.current;

          // Update frequency history for stability detection
          frequencyHistoryRef.current.push(smoothedPitch);
          if (frequencyHistoryRef.current.length > STABILITY_WINDOW_SIZE) {
            frequencyHistoryRef.current.shift();
          }

          // Calculate stability from variance
          const variance = calculateVariance(frequencyHistoryRef.current);
          let stabilityState = 'unstable';
          if (frequencyHistoryRef.current.length < 3) {
            stabilityState = 'searching';
          } else if (variance <= VERY_STABLE_THRESHOLD) {
            stabilityState = 'locked';
          } else if (variance <= STABILITY_THRESHOLD) {
            stabilityState = 'stable';
          }
          setStability(stabilityState);

          setFrequency(Math.round(smoothedPitch));
          setNoteInfo(frequencyToNote(smoothedPitch));
        } else {
          // Invalid pitch reading
          setConfidence(prev => prev * 0.8); // Decay confidence
        }
      } else {
        // No signal
        setFrequency(null);
        setNoteInfo({ note: '--', octave: '', cents: 0 });
        setStability('searching');
        setConfidence(0);
        smoothedFreqRef.current = null;
        frequencyHistoryRef.current = [];
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
      stopTestTone();
    };
  }, [stopListening]);

  // Test tone functions
  const playTestTone = (freq) => {
    stopTestTone(); // Stop any existing tone

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    gainNode.gain.value = 0.3; // Keep it quiet

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();

    testOscillatorRef.current = oscillator;
    testGainRef.current = { gain: gainNode, ctx };
    setTestToneFreq(freq);
  };

  const stopTestTone = () => {
    if (testOscillatorRef.current) {
      testOscillatorRef.current.stop();
      testOscillatorRef.current = null;
    }
    if (testGainRef.current?.ctx) {
      testGainRef.current.ctx.close();
      testGainRef.current = null;
    }
    setTestToneFreq(null);
  };

  const TEST_TONES = [
    { freq: 130.81, label: 'C3' },
    { freq: 220, label: 'A3' },
    { freq: 440, label: 'A4' },
    { freq: 523.25, label: 'C5' },
  ];

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
        {waveformData.map((value, index) => {
          // Color based on stability state
          const getBarColor = () => {
            if (!isListening || volume < 0.005) return 'rgba(var(--accent-rgb), 0.2)';
            if (stability === 'locked') return 'var(--accent)';
            if (stability === 'stable') return 'rgba(var(--accent-rgb), 0.8)';
            return 'rgba(var(--accent-rgb), 0.5)';
          };

          return (
            <div
              key={index}
              style={{
                width: '3px',
                height: `${Math.abs(value) * 100 + 4}px`,
                backgroundColor: getBarColor(),
                borderRadius: '2px',
                transition: 'height 0.05s ease, background-color 0.3s ease',
                opacity: isListening ? 0.4 + Math.abs(value) * 0.6 : 0.3
              }}
            />
          );
        })}
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

        {/* Volume Meter (debug) */}
        {isListening && (
          <div style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(var(--text-rgb), 0.4)',
              fontFamily: "'DM Sans', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              width: '35px'
            }}>
              Mic
            </span>
            <div style={{
              width: '80px',
              height: '4px',
              backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min(100, volume * 500)}%`,
                height: '100%',
                backgroundColor: volume > 0.005 ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.4)',
                transition: 'width 0.05s ease'
              }} />
            </div>
            <span style={{
              fontSize: '0.65rem',
              color: 'rgba(var(--text-rgb), 0.3)',
              fontFamily: "'DM Mono', monospace",
              width: '35px'
            }}>
              {(volume * 100).toFixed(1)}%
            </span>
          </div>
        )}

        {/* Stability Indicator */}
        {isListening && (
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            {/* Stability dot */}
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: stability === 'locked' ? 'var(--accent)' :
                              stability === 'stable' ? 'rgba(var(--accent-rgb), 0.7)' :
                              stability === 'unstable' ? 'rgba(var(--accent-rgb), 0.4)' :
                              'rgba(var(--accent-rgb), 0.2)',
              transition: 'background-color 0.3s ease',
              boxShadow: stability === 'locked' ? '0 0 8px rgba(var(--accent-rgb), 0.5)' : 'none'
            }} />
            <span style={{
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(var(--text-rgb), 0.5)',
              fontFamily: "'DM Sans', sans-serif"
            }}>
              {stability === 'locked' ? 'Locked' :
               stability === 'stable' ? 'Stable' :
               stability === 'unstable' ? 'Finding pitch...' :
               'Listening...'}
            </span>
          </div>
        )}

        {/* Confidence bar */}
        {isListening && frequency && (
          <div style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.7rem',
              color: 'rgba(var(--text-rgb), 0.4)',
              fontFamily: "'DM Sans', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Signal
            </span>
            <div style={{
              width: '60px',
              height: '3px',
              backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${confidence * 100}%`,
                height: '100%',
                backgroundColor: 'rgba(var(--accent-rgb), 0.6)',
                transition: 'width 0.1s ease'
              }} />
            </div>
          </div>
        )}
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

      {/* Test Tone Section */}
      <div style={{
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(var(--accent-rgb), 0.1)'
      }}>
        <p style={{
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(var(--text-rgb), 0.4)',
          marginBottom: '0.75rem',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          Test Reference Tones
        </p>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {TEST_TONES.map(({ freq, label }) => (
            <button
              key={freq}
              onClick={() => testToneFreq === freq ? stopTestTone() : playTestTone(freq)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.8rem',
                padding: '0.5rem 1rem',
                backgroundColor: testToneFreq === freq ? 'var(--accent)' : 'transparent',
                border: '1px solid rgba(var(--accent-rgb), 0.3)',
                color: testToneFreq === freq ? 'var(--bg)' : 'rgba(var(--text-rgb), 0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '2px'
              }}
            >
              {label}
              <span style={{
                fontSize: '0.65rem',
                opacity: 0.7,
                marginLeft: '0.3rem'
              }}>
                {Math.round(freq)}Hz
              </span>
            </button>
          ))}
        </div>
        {testToneFreq && (
          <p style={{
            marginTop: '0.75rem',
            fontSize: '0.8rem',
            color: 'rgba(var(--text-rgb), 0.5)',
            fontFamily: "'DM Mono', monospace"
          }}>
            Playing {testToneFreq}Hz — detector should show ~{Math.round(testToneFreq)}Hz
          </p>
        )}
      </div>
    </div>
  );
};

export default PitchVisualizer;
