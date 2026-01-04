import React, { useState, useEffect } from 'react';

const VoiceWork = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [showBreathGuide, setShowBreathGuide] = useState(false);

  useEffect(() => {
    if (showBreathGuide) {
      const interval = setInterval(() => {
        setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showBreathGuide]);

  const toggleModule = (id) => {
    setActiveModule(activeModule === id ? null : id);
  };

  const markComplete = (id) => {
    if (!completedModules.includes(id)) {
      setCompletedModules([...completedModules, id]);
    }
  };

  const modules = [
    {
      id: 'what-is-voice',
      title: 'What Is Your Voice?',
      subtitle: 'Understanding the instrument you were born with',
      content: {
        intro: "Your voice is the only musical instrument that lives inside your body. It's not just for communication—it's a powerful tool for regulating your nervous system, expressing emotion, and connecting with others.",
        sections: [
          {
            heading: 'Your Voice Is Vibration',
            text: "When you speak or hum, tiny folds of tissue in your throat (your vocal folds) vibrate hundreds of times per second. These vibrations travel through your body and into the air. You don't just make sound—you become sound."
          },
          {
            heading: 'Three Parts Working Together',
            text: "Your voice emerges from the coordination of three systems: your breath (the power), your vocal folds (the vibrator), and your throat, mouth, and nose (the resonators). Like a wind instrument, change any part and the whole sound changes."
          },
          {
            heading: 'Everyone Has a Unique Voice',
            text: "No two voices are identical. Your vocal folds, the size of your resonating spaces, and how you've learned to use them all combine to create your signature sound. VoiceWork isn't about changing who you are—it's about discovering the full range of what your voice can do."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Place your hand gently on your throat. Say 'hmmmm' at a comfortable pitch. Feel the vibration under your fingers? That's your vocal folds in action—vibrating about 100-300 times per second."
        }
      }
    },
    {
      id: 'voice-nervous-system',
      title: 'Your Voice & Your Nervous System',
      subtitle: 'How sound soothes from the inside out',
      content: {
        intro: "There's a reason humming feels calming. Your voice is directly connected to your nervous system through the vagus nerve—one of the most important nerves in your body for rest and recovery.",
        sections: [
          {
            heading: 'The Vagus Nerve',
            text: "The vagus nerve runs from your brainstem down through your neck, past your vocal folds, and into your heart, lungs, and gut. When you hum, sing, or even just exhale slowly with sound, you stimulate this nerve and activate your body's 'rest and digest' response."
          },
          {
            heading: 'Why Humming Calms You',
            text: "When you hum, the vibration of your vocal folds creates a gentle massage for your vagus nerve. This sends signals to your brain that you're safe. Your heart rate slows, your breathing deepens, and stress hormones decrease. This isn't metaphor—it's measurable physiology."
          },
          {
            heading: 'Voice as Self-Regulation',
            text: "Many cultures have known this intuitively for thousands of years. Chanting, singing, and humming practices appear in traditions worldwide. VoiceWork draws on this ancient wisdom alongside modern voice science to help you use your voice as a tool for wellbeing."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Take a slow breath in through your nose. As you exhale, hum at a comfortable, low pitch. Let the hum last as long as your breath allows. Notice: does your face tingle? Does your chest vibrate? Do you feel any calmer? Repeat 3-5 times."
        }
      }
    },
    {
      id: 'breath-foundation',
      title: 'Breath: The Foundation',
      subtitle: 'No breath, no voice—mastering your power source',
      content: {
        intro: "Every voice begins with breath. The air you exhale is what sets your vocal folds into vibration. Learning to breathe efficiently and calmly is the foundation of all voice work.",
        sections: [
          {
            heading: 'Diaphragmatic Breathing',
            text: "Your diaphragm is a dome-shaped muscle beneath your lungs. When it contracts, it pulls downward, creating space for your lungs to expand. This is 'belly breathing'—efficient, calming, and the kind of breath that supports a strong, steady voice."
          },
          {
            heading: 'Breath and Tension',
            text: "Shallow, chest-level breathing often accompanies stress and tension. This kind of breathing doesn't give your voice much to work with. When you breathe low and slow, you not only give your voice better support—you also signal safety to your nervous system."
          },
          {
            heading: 'The Exhale Is the Voice',
            text: "You only make sound on the exhale. Learning to extend and control your exhale—without tension—gives you more control over your voice. A rushed, tight exhale creates a rushed, tight voice. A steady, relaxed exhale creates a steady, resonant voice."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Sit comfortably. Place one hand on your chest and one on your belly. Breathe in slowly through your nose—try to make only your belly hand rise. Your chest should stay relatively still. Exhale slowly through your mouth. Practice this for one minute."
        }
      }
    },
    {
      id: 'bhramari',
      title: 'Bhramari: The Humming Breath',
      subtitle: 'An ancient practice for modern nervous systems',
      content: {
        intro: "Bhramari Pranayama, often called 'bee breath,' is a yogic breathing practice that combines breath control with humming. It's one of the most accessible and immediately effective practices for calming the mind and tuning into your voice.",
        sections: [
          {
            heading: 'What Is Bhramari?',
            text: "The name comes from the Sanskrit word for 'bee'—because the sound you make resembles a bee's hum. The practice involves inhaling fully, then exhaling with a steady humming sound. The vibration you create resonates through your skull and face, creating a gentle internal massage."
          },
          {
            heading: 'Why It Works',
            text: "Bhramari combines several powerful elements: extended exhale (activates parasympathetic nervous system), vocal fold vibration (stimulates vagus nerve), and focused attention (calms mental chatter). Research has shown it can reduce heart rate, lower blood pressure, and decrease anxiety."
          },
          {
            heading: 'Variations to Explore',
            text: "The basic practice is simply humming on your exhale. Some variations include gently plugging your ears with your fingers (Shanmukhi Mudra) to intensify the internal experience, or varying the pitch of your hum to feel different resonance patterns in your body."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Sit comfortably with your spine straight. Close your eyes. Inhale deeply through your nose. As you exhale, create a steady, medium-pitched hum with your lips gently closed. Let the sound be smooth and continuous until your breath is complete. Notice where you feel vibration. Repeat 5-10 times."
        }
      }
    },
    {
      id: 'finding-your-voice',
      title: 'Finding Your Natural Voice',
      subtitle: 'Discovering your authentic sound',
      content: {
        intro: "Many people have never truly explored their own voice. We learn to speak by imitation and rarely question whether the voice we use is actually the most natural or comfortable for our body. VoiceWork invites you to rediscover your authentic sound.",
        sections: [
          {
            heading: 'Habitual vs. Optimal',
            text: "Your habitual voice is the one you use every day—shaped by culture, family, and unconscious habits. Your optimal voice is the one that emerges when your body is relaxed, your breath is supported, and you're not straining or holding back. These aren't always the same voice."
          },
          {
            heading: 'Signs of Vocal Strain',
            text: "Do you ever feel tired after talking? Does your voice get hoarse by the end of the day? Do you feel tension in your throat, jaw, or shoulders when you speak? These can be signs that your habitual voice requires more effort than necessary."
          },
          {
            heading: 'The Sigh of Relief',
            text: "One of the simplest ways to find a more natural voice is to start from a sigh. A genuine sigh of relief—the kind you make when you release tension—often reveals a more relaxed, resonant sound than your habitual speaking voice."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Stand or sit comfortably. Let your shoulders drop. Take a breath in, then release it as a genuine sigh of relief—let the sound 'ahhhhh' come out naturally, as if you're releasing the tension of a long day. Notice the pitch and quality of that sound. That's closer to your natural voice. Try speaking a few words at that same pitch and ease."
        }
      }
    },
    {
      id: 'resonance',
      title: 'Resonance: Your Body as Amplifier',
      subtitle: 'Making more sound with less effort',
      content: {
        intro: "Your vocal folds alone produce a small, buzzy sound. What makes your voice full and rich is resonance—the way sound waves bounce around and amplify inside the spaces of your throat, mouth, and head. Learning to use resonance means making more sound with less effort.",
        sections: [
          {
            heading: 'What Is Resonance?',
            text: "Think of an acoustic guitar. The strings vibrate, but it's the hollow body that amplifies and colors the sound. Your throat, mouth, and nasal passages work the same way. The shape and openness of these spaces dramatically affect your vocal quality."
          },
          {
            heading: 'Feeling Resonance',
            text: "You can feel resonance as vibration in different parts of your body. A low hum might vibrate in your chest. A higher pitch might buzz in your nose or forehead. These sensations tell you where your voice is resonating. Neither is 'better'—but awareness gives you choice."
          },
          {
            heading: 'Opening Resonance Spaces',
            text: "Tension closes off resonance. When your jaw is clenched, your tongue is tight, or your throat is constricted, you lose resonating space. Relaxing these areas—while maintaining supported breath—allows your voice to ring more freely."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Hum at a comfortable pitch with your lips gently closed. Now, while continuing to hum, slowly open your mouth to an 'ah' sound. Notice how the resonance shifts from your nose/head to your mouth/throat. Play with moving between 'mmm' and 'ahh' and notice the changing sensations. This is you exploring your resonating spaces."
        }
      }
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1612',
      color: '#f5f0e8',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@400;500&display=swap');

        * {
          box-sizing: border-box;
        }

        ::selection {
          background: rgba(200, 160, 120, 0.3);
        }

        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        .module-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .module-card:hover {
          transform: translateX(8px);
        }

        .practice-box {
          position: relative;
          overflow: hidden;
        }

        .practice-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(200, 160, 120, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .breath-guide-circle {
          animation: breathe 8s ease-in-out infinite;
        }

        .completion-check {
          transition: all 0.3s ease;
        }

        .completion-check:hover {
          transform: scale(1.1);
        }
      `}</style>

      {/* Hero Section */}
      <header style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          opacity: 0.5
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              borderRadius: '50%',
              border: '1px solid rgba(200, 160, 120, 0.2)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `breathe ${6 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }} />
          ))}
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c8a078',
            marginBottom: '2rem'
          }}>
            A Beginner's Guide
          </p>

          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1.5rem'
          }}>
            Voice<span style={{ color: '#c8a078' }}>Work</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(245, 240, 232, 0.8)',
            marginBottom: '3rem',
            fontStyle: 'italic'
          }}>
            Learn to use your voice as a tool for self-regulation, <br />
            expression, and wellbeing.
          </p>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => document.getElementById('intro').scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                border: '1px solid #c8a078',
                color: '#c8a078',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = '#c8a078';
                e.target.style.color = '#1a1612';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#c8a078';
              }}
            >
              Begin Learning
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'float 2s ease-in-out infinite'
        }}>
          <div style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, #c8a078)',
            margin: '0 auto 0.5rem'
          }} />
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c8a078',
            opacity: 0.7
          }}>Scroll</p>
        </div>
      </header>

      {/* Introduction Section */}
      <section id="intro" style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(2rem, 5vw, 4rem)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 400,
          marginBottom: '2rem',
          lineHeight: 1.3
        }}>
          Your voice is the only musical instrument <br />
          <span style={{ color: '#c8a078', fontStyle: 'italic' }}>that lives inside your body.</span>
        </h2>

        <div style={{
          fontSize: '1.1rem',
          lineHeight: 2,
          color: 'rgba(245, 240, 232, 0.85)'
        }}>
          <p style={{ marginBottom: '1.5rem' }}>
            VoiceWork is a practice of using your voice for self-soothing and strengthening the neural
            connections within your nervous system. It draws on the wisdom of professional singers,
            public speakers, ancient breathing practices like Bhramari Pranayama, and modern voice therapy.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            You don't need any musical training. You don't need a "good" voice. You don't need to
            sound like anyone else. VoiceWork meets you exactly where you are.
          </p>
          <p>
            This guide will help you understand how your voice works, why it affects your
            whole body, and how to use it as a tool for calm, confidence, and self-expression.
          </p>
        </div>
      </section>

      {/* Interactive Breath Guide */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 6rem) clamp(2rem, 5vw, 4rem)',
        backgroundColor: 'rgba(200, 160, 120, 0.05)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#c8a078',
          marginBottom: '1rem'
        }}>
          Interactive Practice
        </h3>
        <h2 style={{
          fontSize: 'clamp(1.6rem, 3vw, 2rem)',
          fontWeight: 400,
          marginBottom: '2rem'
        }}>
          Breath Awareness Guide
        </h2>

        <button
          onClick={() => setShowBreathGuide(!showBreathGuide)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            padding: '0.8rem 1.5rem',
            backgroundColor: showBreathGuide ? '#c8a078' : 'transparent',
            border: '1px solid #c8a078',
            color: showBreathGuide ? '#1a1612' : '#c8a078',
            cursor: 'pointer',
            marginBottom: '3rem',
            transition: 'all 0.3s ease'
          }}
        >
          {showBreathGuide ? 'Stop Guide' : 'Start Breathing Guide'}
        </button>

        {showBreathGuide && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="breath-guide-circle" style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid #c8a078',
                backgroundColor: 'rgba(200, 160, 120, 0.1)'
              }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#c8a078',
                zIndex: 1
              }}>
                {breathPhase}
              </p>
            </div>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(245, 240, 232, 0.7)',
              maxWidth: '400px',
              lineHeight: 1.8
            }}>
              Follow the circle. Breathe in as it expands, out as it contracts.
              On your exhale, try adding a gentle hum.
            </p>
          </div>
        )}
      </section>

      {/* Modules Section */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(2rem, 5vw, 4rem)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#c8a078',
            marginBottom: '1rem'
          }}>
            The Curriculum
          </h3>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 400
          }}>
            Learning Modules
          </h2>
          <p style={{
            marginTop: '1rem',
            color: 'rgba(245, 240, 232, 0.7)',
            fontStyle: 'italic'
          }}>
            {completedModules.length} of {modules.length} completed
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: 'rgba(200, 160, 120, 0.2)'
        }}>
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="module-card"
              style={{
                backgroundColor: '#1a1612'
              }}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                style={{
                  width: '100%',
                  padding: '2rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  textAlign: 'left',
                  color: '#f5f0e8'
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.75rem',
                  color: '#c8a078',
                  minWidth: '2rem'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontWeight: 500,
                    marginBottom: '0.3rem'
                  }}>
                    {module.title}
                  </h3>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.85rem',
                    color: 'rgba(245, 240, 232, 0.6)'
                  }}>
                    {module.subtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {completedModules.includes(module.id) && (
                    <span style={{
                      color: '#c8a078',
                      fontSize: '0.75rem',
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}>
                      ✓ Complete
                    </span>
                  )}
                  <span style={{
                    color: '#c8a078',
                    fontSize: '1.5rem',
                    transform: activeModule === module.id ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    +
                  </span>
                </div>
              </button>

              {/* Module Content */}
              {activeModule === module.id && (
                <div style={{
                  padding: '0 2rem 2rem 5rem',
                  animation: 'fadeInUp 0.4s ease-out'
                }}>
                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.9,
                    marginBottom: '2rem',
                    color: 'rgba(245, 240, 232, 0.9)',
                    fontStyle: 'italic'
                  }}>
                    {module.content.intro}
                  </p>

                  {module.content.sections.map((section, sIndex) => (
                    <div key={sIndex} style={{ marginBottom: '2rem' }}>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        color: '#c8a078',
                        marginBottom: '0.75rem'
                      }}>
                        {section.heading}
                      </h4>
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.9,
                        color: 'rgba(245, 240, 232, 0.8)'
                      }}>
                        {section.text}
                      </p>
                    </div>
                  ))}

                  {/* Practice Box */}
                  <div className="practice-box" style={{
                    backgroundColor: 'rgba(200, 160, 120, 0.08)',
                    padding: '2rem',
                    marginTop: '2rem',
                    border: '1px solid rgba(200, 160, 120, 0.2)'
                  }}>
                    <h4 style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.75rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: '#c8a078',
                      marginBottom: '1rem'
                    }}>
                      {module.content.practice.title}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      lineHeight: 1.9,
                      color: 'rgba(245, 240, 232, 0.9)'
                    }}>
                      {module.content.practice.instruction}
                    </p>
                  </div>

                  {/* Mark Complete Button */}
                  <button
                    className="completion-check"
                    onClick={() => markComplete(module.id)}
                    style={{
                      marginTop: '2rem',
                      padding: '0.8rem 1.5rem',
                      backgroundColor: completedModules.includes(module.id) ? 'rgba(200, 160, 120, 0.2)' : 'transparent',
                      border: '1px solid rgba(200, 160, 120, 0.5)',
                      color: '#c8a078',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {completedModules.includes(module.id) ? '✓ Completed' : 'Mark as Complete'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles Section */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(2rem, 5vw, 4rem)',
        backgroundColor: 'rgba(200, 160, 120, 0.03)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#c8a078',
              marginBottom: '1rem'
            }}>
              Philosophy
            </h3>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 400
            }}>
              The Principles of VoiceWork
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                number: '01',
                title: 'Your Voice Is Already Whole',
                text: "VoiceWork isn't about fixing what's broken. Your voice is a complete instrument. We're simply learning to play it with more awareness and ease."
              },
              {
                number: '02',
                title: 'Sensation Over Judgment',
                text: "Focus on what you feel, not how you sound. The vibrations in your chest, the ease in your throat, the calm in your body—these are your guides."
              },
              {
                number: '03',
                title: 'Less Effort, More Sound',
                text: "The best voices aren't forced. As you release tension and find better support, you'll discover that less muscular effort often produces richer sound."
              },
              {
                number: '04',
                title: 'Daily Practice, Gentle Progress',
                text: "Five minutes of humming each day does more than an hour once a week. VoiceWork rewards consistency and patience over intensity."
              }
            ].map((principle, index) => (
              <div
                key={index}
                style={{
                  padding: '2rem',
                  border: '1px solid rgba(200, 160, 120, 0.15)',
                  backgroundColor: 'rgba(26, 22, 18, 0.5)'
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.75rem',
                  color: '#c8a078',
                  display: 'block',
                  marginBottom: '1rem'
                }}>
                  {principle.number}
                </span>
                <h4 style={{
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  marginBottom: '1rem',
                  lineHeight: 1.4
                }}>
                  {principle.title}
                </h4>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  color: 'rgba(245, 240, 232, 0.7)'
                }}>
                  {principle.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section style={{
        padding: 'clamp(4rem, 10vw, 8rem) clamp(2rem, 5vw, 4rem)',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 400,
          marginBottom: '2rem'
        }}>
          Begin With Just <span style={{ color: '#c8a078', fontStyle: 'italic' }}>Five Breaths</span>
        </h2>

        <p style={{
          fontSize: '1.1rem',
          lineHeight: 2,
          color: 'rgba(245, 240, 232, 0.85)',
          marginBottom: '2rem'
        }}>
          The simplest VoiceWork practice is this: take five slow breaths through your nose,
          and on each exhale, hum at a comfortable pitch until your breath runs out.
          That's it. Do this once a day and you've begun.
        </p>

        <div style={{
          padding: '2rem',
          backgroundColor: 'rgba(200, 160, 120, 0.08)',
          border: '1px solid rgba(200, 160, 120, 0.2)',
          marginTop: '3rem'
        }}>
          <h4 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c8a078',
            marginBottom: '1.5rem'
          }}>
            Your Daily Practice
          </h4>
          <ol style={{
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 2.2,
            fontSize: '1rem',
            color: 'rgba(245, 240, 232, 0.9)',
            paddingLeft: '1.5rem'
          }}>
            <li>Find a quiet moment—morning or evening works well</li>
            <li>Sit or stand comfortably with relaxed shoulders</li>
            <li>Close your eyes if that feels right</li>
            <li>Breathe in slowly through your nose</li>
            <li>Exhale with a steady, comfortable hum</li>
            <li>Repeat five times. Notice how you feel.</li>
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(200, 160, 120, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(200, 160, 120, 0.6)',
          marginBottom: '1rem'
        }}>
          VoiceWork
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: 'rgba(245, 240, 232, 0.5)',
          fontStyle: 'italic'
        }}>
          Using your voice for wellbeing, expression, and connection.
        </p>
      </footer>
    </div>
  );
};

export default VoiceWork;
