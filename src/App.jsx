import React, { useState, useEffect } from 'react';
import './styles.css';

const fontThemes = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'editorial', name: 'Editorial' },
  { id: 'expressive', name: 'Expressive' },
  { id: 'future', name: 'Future' },
  { id: 'geometric', name: 'Geometric' },
];

const colorThemes = [
  { id: 'warm', name: 'Warm' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'golden', name: 'Golden' },
  { id: 'forest', name: 'Forest' },
  { id: 'teal', name: 'Teal' },
  { id: 'ocean', name: 'Ocean' },
  { id: 'dusk', name: 'Dusk' },
  { id: 'mauve', name: 'Mauve' },
  { id: 'rose', name: 'Rose' },
];

const scienceTopics = [
  {
    id: 'nitric-oxide',
    title: 'Humming and Nitric Oxide',
    content: 'When you hum, something remarkable happens in your sinuses: nitric oxide production increases by 15 to 20 times compared to quiet breathing. Nitric oxide is a molecule with antimicrobial properties that also improves oxygen uptake in your lungs. The oscillating airflow created by humming enhances sinus ventilation, releasing this protective gas into your airways.',
    sources: [
      { text: 'Weitzberg & Lundberg, 2002', journal: 'American Journal of Respiratory and Critical Care Medicine', url: 'https://doi.org/10.1164/rccm.200202-138BC' },
      { text: 'Maniscalco et al., 2003', journal: 'European Respiratory Journal', url: 'https://doi.org/10.1183/09031936.03.00017903' }
    ]
  },
  {
    id: 'vagal-tone',
    title: 'Vagal Tone and Heart Rate Variability',
    content: 'Your vagus nerve is the main channel of your parasympathetic nervous system, the "rest and digest" mode. When you hum or sing, the vibrations stimulate this nerve, improving what researchers call "vagal tone." One way to measure this is through heart rate variability (HRV), the subtle variation in time between heartbeats. Higher HRV is associated with greater nervous system resilience, better stress recovery, and improved emotional regulation.',
    sources: [
      { text: 'Kuppusamy et al., 2018', journal: 'Journal of Traditional and Complementary Medicine', url: 'https://doi.org/10.1016/j.jtcme.2017.02.003' }
    ]
  },
  {
    id: 'oxytocin',
    title: 'Social Singing and Oxytocin',
    content: 'Singing with others does something that solo singing does not: it releases oxytocin, sometimes called the "bonding hormone." Research from Oxford and other institutions has shown that group singing reduces cortisol (a stress hormone) and increases feelings of social connection and wellbeing. The combination of synchronized breathing, shared rhythm, and collective sound-making creates conditions for what researchers call "social flow."',
    sources: [
      { text: 'Good & Russo, 2022', journal: 'Psychology of Music', url: 'https://doi.org/10.1177/03057356211042668' },
      { text: 'Keeler et al., 2015', journal: 'Frontiers in Human Neuroscience', url: 'https://doi.org/10.3389/fnhum.2015.00518' },
      { text: 'Tarr, Launay & Dunbar, 2014', journal: 'Frontiers in Psychology', url: 'https://doi.org/10.3389/fpsyg.2014.01096' }
    ]
  },
  {
    id: 'extended-exhale',
    title: 'The Extended Exhale',
    content: 'Singing and humming naturally extend your exhale. This matters because the exhale is when your parasympathetic nervous system activates. A longer exhale relative to your inhale signals safety to your brain, slowing your heart rate and calming your body. This is the same mechanism behind why sighing feels calming, and why breathing techniques like "box breathing" emphasize the out-breath.',
    sources: [
      { text: 'Indian Journal of Physiology and Pharmacology, 2024', journal: 'IJPP Literature Review', url: 'https://ijpp.com/exploring-the-health-benefits-of-bhramari-pranayama-humming-bee-breathing-a-comprehensive-literature-review/' }
    ]
  },
  {
    id: 'infant-singing',
    title: 'Infant-Directed Singing',
    content: 'Parents across all cultures naturally sing to their babies, and research shows this instinct serves important developmental functions. Infant-directed singing supports bonding between caregiver and child, helps regulate the infant\'s emotions and arousal levels, and contributes to early language development. The melodic contours and rhythmic patterns of lullabies and play songs appear to be finely tuned to infant perception.',
    sources: [
      { text: 'Trehub & Trainor, 1998', journal: 'Music Perception', url: 'https://doi.org/10.2307/40285802' }
    ]
  }
];

const myths = [
  {
    id: 'cant-sing',
    myth: '"I can\'t sing"',
    reality: 'VoiceWork has nothing to do with singing ability or musical talent. If you can hum, you can do voice work. The practices here are about feeling vibration in your body, extending your exhale, and stimulating your nervous system. No one will hear you, and there are no wrong notes. Your voice is already the perfect instrument for this work.'
  },
  {
    id: 'woo-woo',
    myth: '"This is just woo-woo"',
    reality: 'The physiological mechanisms behind voice work are measurable and published in peer-reviewed journals. Nitric oxide production can be measured in parts per billion. Heart rate variability is tracked with medical-grade sensors. Cortisol and oxytocin levels are measured through saliva samples. Ancient practices like humming and chanting have modern explanations, and the research is growing every year.'
  },
  {
    id: 'need-training',
    myth: '"You need training to use your voice well"',
    reality: 'While professional singers and speakers benefit from specialized training, the basic practices of VoiceWork are accessible to everyone. Humming, sighing, and gentle vocal exploration require no formal instruction. Your body already knows how to make sound. These practices are about removing tension and reconnecting with what comes naturally.'
  },
  {
    id: 'only-singers',
    myth: '"Voice work is only for singers and public speakers"',
    reality: 'The benefits of voice work apply to anyone with a nervous system. Whether you speak publicly or prefer silence, your voice can be a tool for self-regulation. Many people who never sing or speak professionally find that simple humming practices help them manage stress, improve focus, and feel more grounded in their bodies.'
  }
];

const VoiceWork = () => {
  const [fontTheme, setFontTheme] = useState('classic');
  const [colorTheme, setColorTheme] = useState('warm');
  const [lightMode, setLightMode] = useState(false);
  const [themeExpanded, setThemeExpanded] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [showBreathGuide, setShowBreathGuide] = useState(false);
  const [activeScienceTopic, setActiveScienceTopic] = useState(null);
  const [activeMythTopic, setActiveMythTopic] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', fontTheme);
    document.documentElement.setAttribute('data-color', colorTheme);
    document.documentElement.setAttribute('data-mode', lightMode ? 'light' : 'dark');
  }, [fontTheme, colorTheme, lightMode]);

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
        intro: "Your voice is the only musical instrument that lives inside your body. Beyond communication, it can regulate your nervous system, express emotion, and connect you with others.",
        sections: [
          {
            heading: 'Your Voice Is Vibration',
            text: "When you speak or hum, tiny folds of tissue in your throat vibrate hundreds of times per second. These vibrations travel through your body and into the air. You don't just make sound. You become sound."
          },
          {
            heading: 'Three Parts Working Together',
            text: "Your voice emerges from three systems working in coordination: your breath provides the power, your vocal folds create the vibration, and your throat, mouth, and nose shape the resonance. Like a wind instrument, changing any part changes the whole sound."
          },
          {
            heading: 'Everyone Has a Unique Voice',
            text: "No two voices are identical. Your vocal folds, the size of your resonating spaces, and how you've learned to use them all combine to create your signature sound. VoiceWork helps you discover the full range of what your voice can do."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Place your hand gently on your throat. Say 'hmmmm' at a comfortable pitch. Feel the vibration under your fingers? That's your vocal folds in action, vibrating about 100-300 times per second."
        }
      }
    },
    {
      id: 'voice-nervous-system',
      title: 'Your Voice & Your Nervous System',
      subtitle: 'How sound soothes from the inside out',
      content: {
        intro: "There's a reason humming feels calming. Your voice connects directly to your nervous system through the vagus nerve, one of the most important nerves in your body for rest and recovery.",
        sections: [
          {
            heading: 'The Vagus Nerve',
            text: "The vagus nerve runs from your brainstem down through your neck, past your vocal folds, and into your heart, lungs, and gut. When you hum, sing, or exhale slowly with sound, you stimulate this nerve and activate your body's rest and digest response."
          },
          {
            heading: 'Why Humming Calms You',
            text: "When you hum, the vibration of your vocal folds creates a gentle massage for your vagus nerve. This sends signals to your brain that you're safe. Your heart rate slows, your breathing deepens, and stress hormones decrease. This is measurable physiology."
          },
          {
            heading: 'Voice as Self-Regulation',
            text: "Many cultures have known this intuitively for thousands of years. Chanting, singing, and humming practices appear in traditions worldwide. VoiceWork draws on this ancient wisdom alongside modern voice science."
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
      subtitle: 'Your power source',
      content: {
        intro: "Every voice begins with breath. The air you exhale sets your vocal folds into vibration. Learning to breathe efficiently and calmly is the foundation of all voice work.",
        sections: [
          {
            heading: 'Diaphragmatic Breathing',
            text: "Your diaphragm is a dome-shaped muscle beneath your lungs. When it contracts, it pulls downward, creating space for your lungs to expand. This is belly breathing: efficient, calming, and the kind of breath that supports a strong, steady voice."
          },
          {
            heading: 'Breath and Tension',
            text: "Shallow, chest-level breathing often accompanies stress and tension. This kind of breathing doesn't give your voice much to work with. When you breathe low and slow, you give your voice better support and signal safety to your nervous system."
          },
          {
            heading: 'The Exhale Is the Voice',
            text: "You only make sound on the exhale. Learning to extend and control your exhale without tension gives you more control over your voice. A rushed, tight exhale creates a rushed, tight voice. A steady, relaxed exhale creates a steady, resonant voice."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Sit comfortably. Place one hand on your chest and one on your belly. Breathe in slowly through your nose and try to make only your belly hand rise. Your chest should stay relatively still. Exhale slowly through your mouth. Practice this for one minute."
        }
      }
    },
    {
      id: 'bhramari',
      title: 'Bhramari: The Humming Breath',
      subtitle: 'An ancient practice for modern nervous systems',
      content: {
        intro: "Bhramari Pranayama, often called bee breath, is a yogic breathing practice that combines breath control with humming. It's one of the most accessible and immediately effective practices for calming the mind and tuning into your voice.",
        sections: [
          {
            heading: 'What Is Bhramari?',
            text: "The name comes from the Sanskrit word for bee, because the sound you make resembles a bee's hum. The practice involves inhaling fully, then exhaling with a steady humming sound. The vibration resonates through your skull and face, creating a gentle internal massage."
          },
          {
            heading: 'Why It Works',
            text: "Bhramari combines several elements: extended exhale activates the parasympathetic nervous system, vocal fold vibration stimulates the vagus nerve, and focused attention calms mental chatter. Research has shown it can reduce heart rate, lower blood pressure, and decrease anxiety."
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
        intro: "Many people have never truly explored their own voice. We learn to speak by imitation and rarely question whether the voice we use is actually the most natural or comfortable for our body.",
        sections: [
          {
            heading: 'Habitual vs. Optimal',
            text: "Your habitual voice is the one you use every day, shaped by culture, family, and unconscious habits. Your optimal voice emerges when your body is relaxed, your breath is supported, and you're not straining or holding back. These aren't always the same."
          },
          {
            heading: 'Signs of Vocal Strain',
            text: "Do you ever feel tired after talking? Does your voice get hoarse by the end of the day? Do you feel tension in your throat, jaw, or shoulders when you speak? These can be signs that your habitual voice requires more effort than necessary."
          },
          {
            heading: 'The Sigh of Relief',
            text: "One of the simplest ways to find a more natural voice is to start from a sigh. A genuine sigh of relief, the kind you make when you release tension, often reveals a more relaxed, resonant sound than your habitual speaking voice."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Stand or sit comfortably. Let your shoulders drop. Take a breath in, then release it as a genuine sigh of relief. Let the sound 'ahhhhh' come out naturally, as if you're releasing the tension of a long day. Notice the pitch and quality of that sound. That's closer to your natural voice. Try speaking a few words at that same pitch and ease."
        }
      }
    },
    {
      id: 'resonance',
      title: 'Resonance: Your Body as Amplifier',
      subtitle: 'Making more sound with less effort',
      content: {
        intro: "Your vocal folds alone produce a small, buzzy sound. What makes your voice full and rich is resonance: the way sound waves bounce around and amplify inside the spaces of your throat, mouth, and head.",
        sections: [
          {
            heading: 'What Is Resonance?',
            text: "Think of an acoustic guitar. The strings vibrate, but the hollow body amplifies and colors the sound. Your throat, mouth, and nasal passages work the same way. The shape and openness of these spaces dramatically affect your vocal quality."
          },
          {
            heading: 'Feeling Resonance',
            text: "You can feel resonance as vibration in different parts of your body. A low hum might vibrate in your chest. A higher pitch might buzz in your nose or forehead. These sensations tell you where your voice is resonating. Awareness gives you choice."
          },
          {
            heading: 'Opening Resonance Spaces',
            text: "Tension closes off resonance. When your jaw is clenched, your tongue is tight, or your throat is constricted, you lose resonating space. Relaxing these areas while maintaining supported breath allows your voice to ring more freely."
          }
        ],
        practice: {
          title: 'Try This Now',
          instruction: "Hum at a comfortable pitch with your lips gently closed. Now, while continuing to hum, slowly open your mouth to an 'ah' sound. Notice how the resonance shifts from your nose and head to your mouth and throat. Play with moving between 'mmm' and 'ahh' and notice the changing sensations."
        }
      }
    }
  ];

  return (
    <div className="voicework-app">
      {/* Theme Switcher */}
      <nav className={`theme-switcher ${themeExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Collapsed state - just a toggle button */}
        <button
          className="theme-toggle-btn"
          onClick={() => setThemeExpanded(!themeExpanded)}
          aria-label={themeExpanded ? 'Close theme picker' : 'Open theme picker'}
        >
          <span className="toggle-icon">{themeExpanded ? '×' : '◐'}</span>
          {!themeExpanded && <span className="toggle-label">Theme</span>}
        </button>

        {/* Expanded state - full theme picker */}
        {themeExpanded && (
          <div className="theme-panel">
            {/* Light/Dark Mode Toggle */}
            <div className="theme-row">
              <span className="theme-label">Mode</span>
              <button
                className={`theme-btn ${!lightMode ? 'active' : ''}`}
                onClick={() => setLightMode(false)}
              >
                Dark
              </button>
              <button
                className={`theme-btn ${lightMode ? 'active' : ''}`}
                onClick={() => setLightMode(true)}
              >
                Light
              </button>
            </div>

            {/* Font Theme Row */}
            <div className="theme-row">
              <span className="theme-label">Font</span>
              {fontThemes.map(t => (
                <button
                  key={t.id}
                  className={`theme-btn ${fontTheme === t.id ? 'active' : ''}`}
                  onClick={() => setFontTheme(t.id)}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Color Theme Row */}
            <div className="theme-row">
              <span className="theme-label">Color</span>
              {colorThemes.map(c => (
                <button
                  key={c.id}
                  className={`color-btn ${colorTheme === c.id ? 'active' : ''}`}
                  data-color={c.id}
                  onClick={() => setColorTheme(c.id)}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header style={{
        minHeight: '100vh',
        paddingTop: '5.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated sine wave background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '60px'
        }}>
          <div className="wave-layer wave-1" style={{ top: '20%' }} />
          <div className="wave-layer wave-2" style={{ top: '35%' }} />
          <div className="wave-layer wave-3" style={{ top: '50%' }} />
          <div className="wave-layer wave-2" style={{ top: '65%' }} />
          <div className="wave-layer wave-1" style={{ top: '80%' }} />
        </div>

        <div className="animate-fadeInUp" style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '1.5rem'
          }}>
            A Beginner's Guide
          </p>

          <h1 className="font-heading" style={{
            fontSize: 'clamp(2.75rem, 12vw, 6rem)',
            lineHeight: 1.1,
            marginBottom: '1.25rem'
          }}>
            Voice<span style={{ color: 'var(--accent)' }}>Work</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(var(--text-rgb), 0.8)',
            marginBottom: '2.5rem',
            fontStyle: 'italic'
          }}>
            Learn to use your voice as a tool for<br />
            self-regulation, expression, and wellbeing.
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
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '1rem 2rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--accent)',
                color: 'var(--accent)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = 'var(--accent)';
                e.target.style.color = 'var(--bg)';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--accent)';
              }}
            >
              Begin Learning
            </button>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section id="intro" style={{
        padding: 'clamp(3rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h2 className="font-heading" style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
          marginBottom: '1.75rem',
          lineHeight: 1.3
        }}>
          Your voice is the only musical instrument{' '}
          <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>that lives inside your body.</span>
        </h2>

        <div style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
          lineHeight: 1.9,
          color: 'rgba(var(--text-rgb), 0.85)'
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
        padding: 'clamp(3rem, 10vw, 6rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.875rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '0.75rem'
        }}>
          Interactive Practice
        </h3>
        <h2 className="font-heading" style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          marginBottom: '1.75rem'
        }}>
          Breath Awareness Guide
        </h2>

        <button
          onClick={() => setShowBreathGuide(!showBreathGuide)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1rem',
            letterSpacing: '0.1em',
            padding: '1rem 1.75rem',
            backgroundColor: showBreathGuide ? 'var(--accent)' : 'transparent',
            border: '1px solid var(--accent)',
            color: showBreathGuide ? 'var(--bg)' : 'var(--accent)',
            cursor: 'pointer',
            marginBottom: '2.5rem',
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
                border: '2px solid var(--accent)',
                backgroundColor: 'rgba(var(--accent-rgb), 0.1)'
              }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '1.125rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                zIndex: 1
              }}>
                {breathPhase}
              </p>
            </div>
            <p style={{
              fontSize: '1.125rem',
              color: 'rgba(var(--text-rgb), 0.7)',
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
        padding: 'clamp(3rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '0.75rem'
          }}>
            The Curriculum
          </h3>
          <h2 className="font-heading" style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)'
          }}>
            Learning Modules
          </h2>
          <p style={{
            marginTop: '1rem',
            fontSize: '1.125rem',
            color: 'rgba(var(--text-rgb), 0.7)',
            fontStyle: 'italic'
          }}>
            {completedModules.length} of {modules.length} completed
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: 'rgba(var(--accent-rgb), 0.2)'
        }}>
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="module-card"
              style={{
                backgroundColor: 'var(--bg)'
              }}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left',
                  color: 'var(--text)'
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  color: 'var(--accent)',
                  minWidth: '2rem'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div style={{ flex: 1 }}>
                  <h3 className="font-heading" style={{
                    fontSize: 'clamp(1.25rem, 4vw, 1.5rem)',
                    marginBottom: '0.25rem'
                  }}>
                    {module.title}
                  </h3>
                  <p className="font-ui" style={{
                    fontSize: '1rem',
                    color: 'rgba(var(--text-rgb), 0.6)'
                  }}>
                    {module.subtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {completedModules.includes(module.id) && (
                    <span style={{
                      color: 'var(--accent)',
                      fontSize: '0.875rem',
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      display: 'none'
                    }}>
                      ✓
                    </span>
                  )}
                  <span style={{
                    color: 'var(--accent)',
                    fontSize: '1.75rem',
                    transform: activeModule === module.id ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    +
                  </span>
                </div>
              </button>

              {/* Module Content */}
              {activeModule === module.id && (
                <div className="animate-fadeInUp-fast" style={{
                  padding: '0 1.5rem 2rem',
                  paddingLeft: 'clamp(1.5rem, 5vw, 4.5rem)'
                }}>
                  <p style={{
                    fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                    lineHeight: 1.8,
                    marginBottom: '2rem',
                    color: 'rgba(var(--text-rgb), 0.9)',
                    fontStyle: 'italic'
                  }}>
                    {module.content.intro}
                  </p>

                  {module.content.sections.map((section, sIndex) => (
                    <div key={sIndex} style={{ marginBottom: '2rem' }}>
                      <h4 style={{
                        fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                        fontWeight: 500,
                        color: 'var(--accent)',
                        marginBottom: '0.75rem'
                      }}>
                        {section.heading}
                      </h4>
                      <p style={{
                        fontSize: 'clamp(1.0625rem, 2.5vw, 1.125rem)',
                        lineHeight: 1.85,
                        color: 'rgba(var(--text-rgb), 0.8)'
                      }}>
                        {section.text}
                      </p>
                    </div>
                  ))}

                  {/* Practice Box */}
                  <div className="practice-box" style={{
                    backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                    padding: '1.75rem',
                    marginTop: '2rem',
                    border: '1px solid rgba(var(--accent-rgb), 0.2)'
                  }}>
                    <h4 style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '0.875rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: '1rem'
                    }}>
                      {module.content.practice.title}
                    </h4>
                    <p style={{
                      fontSize: 'clamp(1.0625rem, 2.5vw, 1.125rem)',
                      lineHeight: 1.85,
                      color: 'rgba(var(--text-rgb), 0.9)'
                    }}>
                      {module.content.practice.instruction}
                    </p>
                  </div>

                  {/* Mark Complete Button */}
                  <button
                    className="completion-check"
                    onClick={() => markComplete(module.id)}
                    style={{
                      marginTop: '1.75rem',
                      padding: '1rem 1.5rem',
                      backgroundColor: completedModules.includes(module.id) ? 'rgba(var(--accent-rgb), 0.2)' : 'transparent',
                      border: '1px solid rgba(var(--accent-rgb), 0.5)',
                      color: 'var(--accent)',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '1rem',
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

      {/* The Science Section */}
      <section style={{
        padding: 'clamp(3rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: 'rgba(var(--accent-rgb), 0.03)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.75rem'
            }}>
              Research
            </h3>
            <h2 className="font-heading" style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)'
            }}>
              The Science Behind VoiceWork
            </h2>
            <p style={{
              marginTop: '1rem',
              fontSize: '1.125rem',
              color: 'rgba(var(--text-rgb), 0.7)',
              fontStyle: 'italic',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              What does the research say about humming, singing, and nervous system regulation?
            </p>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            backgroundColor: 'rgba(var(--accent-rgb), 0.2)'
          }}>
            {scienceTopics.map((topic, index) => (
              <div
                key={topic.id}
                className="module-card"
                style={{ backgroundColor: 'var(--bg)' }}
              >
                <button
                  onClick={() => setActiveScienceTopic(activeScienceTopic === topic.id ? null : topic.id)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    textAlign: 'left',
                    color: 'var(--text)'
                  }}
                >
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.875rem',
                    color: 'var(--accent)',
                    minWidth: '2rem'
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3 className="font-heading" style={{
                    fontSize: 'clamp(1.125rem, 3vw, 1.35rem)',
                    flex: 1
                  }}>
                    {topic.title}
                  </h3>

                  <span style={{
                    color: 'var(--accent)',
                    fontSize: '1.75rem',
                    transform: activeScienceTopic === topic.id ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    +
                  </span>
                </button>

                {activeScienceTopic === topic.id && (
                  <div className="animate-fadeInUp-fast" style={{
                    padding: '0 1.5rem 2rem',
                    paddingLeft: 'clamp(1.5rem, 5vw, 4.5rem)'
                  }}>
                    <p style={{
                      fontSize: 'clamp(1.0625rem, 2.5vw, 1.125rem)',
                      lineHeight: 1.85,
                      color: 'rgba(var(--text-rgb), 0.85)'
                    }}>
                      {topic.content}
                    </p>

                    <div className="sources-box" style={{
                      backgroundColor: 'rgba(var(--accent-rgb), 0.05)',
                      border: '1px solid rgba(var(--accent-rgb), 0.15)',
                      padding: '1rem 1.25rem',
                      marginTop: '1.5rem'
                    }}>
                      <h5 style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.75rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        marginBottom: '0.75rem'
                      }}>
                        Sources
                      </h5>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: 1.7
                      }}>
                        {topic.sources.map((source, sIndex) => (
                          <li key={sIndex} style={{ marginBottom: '0.5rem' }}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: 'var(--accent)',
                                textDecoration: 'underline',
                                textUnderlineOffset: '2px'
                              }}
                            >
                              {source.text}
                            </a>
                            <span style={{ color: 'rgba(var(--text-rgb), 0.6)' }}>
                              {' — '}{source.journal}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myths & Misconceptions Section */}
      <section style={{
        padding: 'clamp(3rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '0.75rem'
          }}>
            Common Questions
          </h3>
          <h2 className="font-heading" style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)'
          }}>
            Myths & Misconceptions
          </h2>
          <p style={{
            marginTop: '1rem',
            fontSize: '1.125rem',
            color: 'rgba(var(--text-rgb), 0.7)',
            fontStyle: 'italic',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Addressing hesitations and misunderstandings about voice work.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1px',
          backgroundColor: 'rgba(var(--accent-rgb), 0.2)'
        }}>
          {myths.map((myth, index) => (
            <div
              key={myth.id}
              className="module-card"
              style={{ backgroundColor: 'var(--bg)' }}
            >
              <button
                onClick={() => setActiveMythTopic(activeMythTopic === myth.id ? null : myth.id)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  textAlign: 'left',
                  color: 'var(--text)'
                }}
              >
                <h3 className="font-heading" style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.35rem)',
                  flex: 1,
                  fontStyle: 'italic'
                }}>
                  {myth.myth}
                </h3>

                <span style={{
                  color: 'var(--accent)',
                  fontSize: '1.75rem',
                  transform: activeMythTopic === myth.id ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  +
                </span>
              </button>

              {activeMythTopic === myth.id && (
                <div className="animate-fadeInUp-fast" style={{
                  padding: '0 1.5rem 2rem'
                }}>
                  <p style={{
                    fontSize: 'clamp(1.0625rem, 2.5vw, 1.125rem)',
                    lineHeight: 1.85,
                    color: 'rgba(var(--text-rgb), 0.85)'
                  }}>
                    {myth.reality}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles Section */}
      <section style={{
        padding: 'clamp(3rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        backgroundColor: 'rgba(var(--accent-rgb), 0.03)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '0.75rem'
            }}>
              Philosophy
            </h3>
            <h2 className="font-heading" style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)'
            }}>
              The Principles of VoiceWork
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                number: '01',
                title: 'Your Voice Is Already Whole',
                text: "Your voice is a complete instrument. We're simply learning to play it with more awareness and ease."
              },
              {
                number: '02',
                title: 'Sensation Over Judgment',
                text: "Focus on what you feel, not how you sound. The vibrations in your chest, the ease in your throat, the calm in your body. These are your guides."
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
                  padding: '1.75rem',
                  border: '1px solid rgba(var(--accent-rgb), 0.15)',
                  backgroundColor: 'rgba(var(--bg-rgb), 0.5)'
                }}
              >
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.875rem',
                  color: 'var(--accent)',
                  display: 'block',
                  marginBottom: '0.875rem'
                }}>
                  {principle.number}
                </span>
                <h4 style={{
                  fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
                  fontWeight: 500,
                  marginBottom: '0.875rem',
                  lineHeight: 1.4
                }}>
                  {principle.title}
                </h4>
                <p style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.0625rem)',
                  lineHeight: 1.8,
                  color: 'rgba(var(--text-rgb), 0.7)'
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
        padding: 'clamp(3rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 className="font-heading" style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
          marginBottom: '1.75rem'
        }}>
          Begin With Just <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Five Breaths</span>
        </h2>

        <p style={{
          fontSize: 'clamp(1.125rem, 3vw, 1.25rem)',
          lineHeight: 1.9,
          color: 'rgba(var(--text-rgb), 0.85)',
          marginBottom: '1.75rem'
        }}>
          The simplest VoiceWork practice: take five slow breaths through your nose,
          and on each exhale, hum at a comfortable pitch until your breath runs out.
          That's it. Do this once a day and you've begun.
        </p>

        <div style={{
          padding: '1.75rem',
          backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
          border: '1px solid rgba(var(--accent-rgb), 0.2)',
          marginTop: '2.5rem'
        }}>
          <h4 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.875rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '1.25rem'
          }}>
            Your Daily Practice
          </h4>
          <ol style={{
            textAlign: 'left',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 2.1,
            fontSize: 'clamp(1.0625rem, 2.5vw, 1.125rem)',
            color: 'rgba(var(--text-rgb), 0.9)',
            paddingLeft: '1.5rem'
          }}>
            <li>Find a quiet moment, morning or evening</li>
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
        padding: '3rem 1.5rem',
        borderTop: '1px solid rgba(var(--accent-rgb), 0.1)',
        textAlign: 'center'
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.875rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(var(--accent-rgb), 0.6)',
          marginBottom: '0.875rem'
        }}>
          VoiceWork
        </p>
        <p style={{
          fontSize: '1.0625rem',
          color: 'rgba(var(--text-rgb), 0.5)',
          fontStyle: 'italic'
        }}>
          Using your voice for wellbeing, expression, and connection.
        </p>
      </footer>
    </div>
  );
};

export default VoiceWork;
