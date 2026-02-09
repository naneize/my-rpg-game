import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.glowTop} />

      {/* --- SIDEBAR & NAVBAR --- */}
      <div style={{...styles.sidebar, right: isSidebarOpen ? '0' : '-350px'}}>
        <button onClick={() => setSidebarOpen(false)} style={styles.closeBtn}>✕</button>
        <div style={styles.sidebarContent}>
          <h2 style={styles.sidebarTitle}>{isLoggedIn ? 'PROFILE' : 'NEURAL ACCESS'}</h2>
          {!isLoggedIn ? (
            <div style={styles.loginForm}>
              <input type="text" placeholder="PILOT_ID" style={styles.input} />
              <input type="password" placeholder="ACCESS_CODE" style={styles.input} />
              <button onClick={() => {setIsLoggedIn(true); setSidebarOpen(false);}} style={styles.loginBtn}>AUTHORIZE</button>
            </div>
          ) : (
            <div style={styles.profileSection}>
              <div style={styles.profileAvatar}>👤</div>
              <p style={styles.profileName}>SOLO_PILOT_01</p>
              <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>TERMINATE</button>
            </div>
          )}
        </div>
      </div>

      <nav style={styles.navbar}>
        <div style={styles.navLogo}>INFINITE STEP</div>
        <button onClick={() => setSidebarOpen(true)} style={styles.menuBtn}>
          {isLoggedIn ? '👤 PROFILE' : '🔑 LOGIN'}
        </button>
      </nav>

      {/* --- 1. HERO SECTION --- */}
      <header style={styles.header}>
        <div style={styles.heroContent}>
           <h2 style={styles.welcomeText}>INFINITE <span style={{color: '#ff7700'}}>STEP</span></h2>
           <p style={styles.mainSubtitle}>Experience a minimalist RPG where every step you take is a unique journey.</p>
           <button style={styles.startButton} onClick={() => navigate('/play')}>CLICK HERE! TO START ADVENTURE</button>
        </div>
      </header>

      {/* --- 2. MONSTER SCALING --- */}
      <section style={styles.section}>
        <div style={styles.scalingHighlight}>
           <div style={styles.scalingContent}>
              <div style={styles.scalingIcon}>📈</div>
              <div style={{textAlign: 'left'}}>
                 <h4 style={styles.scalingTitle}>DYNAMIC LEVEL SCALING</h4>
                 <p style={styles.scalingDesc}>
                    <strong>Monsters evolve with you.</strong> A system that ensures farming never gets boring. Enemies will develop their stats alongside the player to provide the perfect challenge at all times.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* --- 3. THE JOURNEY: STEP & COMBAT --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>THE <span style={{color: '#ff7700'}}>JOURNEY</span></h2>
          <div style={styles.sectionLine} />
        </div>
        
        {/* Step System Preview */}
        <div style={styles.journeySegment}>
            <div style={styles.bigImageWrapper}>
                <div style={styles.uiFrame}>
                    <img src="/icon/step_content.png" alt="Step Content" style={styles.fullWidthImage} />
                </div>
            </div>
            <div style={styles.textDetailBox}>
                <h3 style={styles.segmentTitle}>STEP-BASED EXPLORATION</h3>
                <p style={styles.segmentDesc}>Explore the world through a step-based system designed for immersion. Every "Step" is a decision on what you will encounter next.</p>
            </div>
        </div>

        {/* Combat Interface Section */}
        <div style={styles.journeySegmentCompact}>
            <div style={styles.compactImageWrapper}>
                <div style={{...styles.uiFrameCompact, borderColor: 'rgba(96, 165, 250, 0.3)'}}>
                    <img src="/icon/combatview.png" alt="Combat View" style={styles.compactImage} />
                </div>
            </div>
            <div style={styles.textDetailBox}>
                <h3 style={{...styles.segmentTitle, color: '#60a5fa', fontSize: '1.8rem', textAlign: 'center'}}>MINIMALIST COMBAT VIEW</h3>
                <p style={{...styles.segmentDesc, textAlign: 'center'}}>The cleanest combat interface, focused on simplicity. Displays status and skill usage in real-time.</p>
            </div>
        </div>
      </section>

      {/* --- 4. MAP SELECTION --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>MAP <span style={{color: '#ff7700'}}>SELECTION</span></h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.compactImageWrapper}>
            <div style={styles.uiFrameCompact}>
                <img src="/icon/map_selection.png" alt="Map Selection" style={styles.compactImage} />
            </div>
        </div>
        <div style={styles.systemDetailBox}>
            <h4 style={styles.systemHeader}>🌍 MISSION AREA SELECTION</h4>
            <p style={styles.systemText}>Various Neural Stream coordinates await your exploration to discover new resources and monster species.</p>
        </div>
      </section>

      {/* --- 5. NEURAL CUSTOMIZATION --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>NEURAL <span style={{color: '#ff7700'}}>LINK</span></h2>
          <div style={styles.sectionLine} />
        </div>

        {/* Passive View */}
        <div style={styles.bigImageWrapper}>
            <div style={styles.uiFrame}>
                <img src="/icon/passive_view.png" alt="Passive View Big" style={styles.fullWidthImage} />
            </div>
            <div style={styles.neuralSlotInfo}>
                <span style={styles.slotBadge}>PASSIVE SLOTS: 3</span>
                <span style={{...styles.slotBadge, color: '#60a5fa', borderColor: '#60a5fa'}}>ACTIVE SLOTS: 2</span>
                <p style={styles.slotText}>can tune their Neural Link with up to <strong>3 Passive Skills</strong> and <strong>2 Active Skills</strong> to create unique combat builds for different enemy types.</p>
            </div>
        </div>

        {/* Giant Skill Icons */}
        <div style={styles.giantSkillWrapper}>
            <div style={styles.giantSkillCard}>
                <div style={styles.giantIconContainer}>
                    <img src="/icon/passive.png" alt="Passive Big" style={styles.iconSuperGiant} />
                </div>
                <div style={styles.giantSkillText}>
                    <h3 style={styles.skillTitleText}>PASSIVE CORES</h3>
                    <p style={styles.skillSubText}>"PASSIVE CORE RESONANCE" – A hidden power that never fades! Every Core you obtain permanently increases your base stats. Equipping them into Neural Sync slots further resonates and amplifies those powers to the next level.</p>
                </div>
            </div>
        </div>

        <div style={styles.giantSkillWrapper}>
            <div style={{...styles.giantSkillCard, borderRight: '1px solid rgba(96, 165, 250, 0.2)'}}>
                <div style={{...styles.giantIconContainer, background: 'rgba(96, 165, 250, 0.05)'}}>
                    <img src="/icon/active.png" alt="Active Big" style={{...styles.iconSuperGiant, filter: 'drop-shadow(0 0 30px #60a5fa)'}} />
                </div>
                <div style={styles.giantSkillText}>
                    <h3 style={{...styles.skillTitleText, color: '#60a5fa'}}>ACTIVE DRIVES</h3>
                    <p style={styles.skillSubText}>"TACTICAL SYNC DRIVE" – Customize your offensive and supportive command sets via Neural Sync. Equip the right skills to execute the Ultimate Combo.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- 6. ADVANCED CRAFTING --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>ADVANCED <span style={{color: '#ff7700'}}>CRAFTING</span></h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.bigImageWrapper}>
            <div style={{...styles.uiFrame, borderColor: 'rgba(255,119,0,0.4)'}}>
                <img src="/icon/craft.png" alt="Crafting View Big" style={styles.fullWidthImage} />
            </div>
        </div>
        <div style={styles.systemDetailBox}>
            <h4 style={styles.systemHeader}>🔨 CONSTRUCTION CORE</h4>
            <p style={styles.systemText}>Dismantle unused items and gather rare materials to forge high-tier equipment.</p>
        </div>
      </section>

      {/* --- 7. COLLECTION SYSTEM --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>MONSTER <span style={{color: '#ff7700'}}>COLLECTION</span></h2>
          <div style={styles.sectionLine} />
        </div>
        <div style={styles.compactImageWrapper}>
            <div style={styles.uiFrameCompact}>
                <img src="/icon/collection_view.png" alt="Collection View" style={styles.compactImage} />
            </div>
        </div>
        <div style={styles.systemDetailBox}>
            <h4 style={styles.systemHeader}>Collection Bonus</h4>
            <p style={styles.systemText}>Collect journey logs to unlock permanent status bonuses</p>
        </div>
      </section>

      {/* --- 8. WORLD BOSS --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>LATEST <span style={{color: '#ff4444'}}>THREAT</span></h2>
          <div style={{...styles.sectionLine, backgroundColor: '#ff4444'}} />
        </div>
        <div style={styles.bossCard}>
          <div style={styles.bossContent}>
            <div style={styles.bossImageWrapper}>
              <img src="/monsters/black_dragon.png" alt="Boss" style={styles.bossImage} />
            </div>
            <div style={styles.bossInfo}>
              <div style={styles.eventBadge}>GLOBAL BOSS EVENT</div>
              <h2 style={styles.bossNameText}>BLACK DRAGON KING</h2>
              <p style={styles.globalBossInfo}>
                 <strong>GLOBAL CO-OP :</strong>  across the entire server work together in real-time to defeat the threat.
              </p>
              <div style={styles.hpContainer}>
                <div style={styles.hpLabel}>
                  <span>DARK ELEMENT</span>
                  <span style={{color: '#ff7700'}}>HP: 7,310 / 10,000</span>
                </div>
                <div style={styles.hpBarBg}><div style={styles.hpBarFill} /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={styles.version}>INFINITE STEP © 2026</p>
        <p style={styles.devText}>DEVELOPED BY SOLO DEV</p>
      </footer>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { backgroundColor: '#05070a', color: '#e2e8f0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"IBM Plex Sans Thai", sans-serif', padding: '120px 20px 80px 20px', position: 'relative', overflowX: 'hidden' },
  navbar: { position: 'fixed', top: 0, left: 0, width: '100%', height: '70px', backgroundColor: 'rgba(5, 7, 10, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' },
  navLogo: { fontSize: '1.2rem', fontWeight: '900', color: '#ff7700', letterSpacing: '2px' },
  menuBtn: { backgroundColor: 'transparent', border: '1px solid #ff7700', color: '#ff7700', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  sidebar: { position: 'fixed', top: 0, width: '320px', height: '100%', backgroundColor: '#0a0f1a', borderLeft: '1px solid rgba(255,119,0,0.3)', zIndex: 1000, transition: '0.4s ease-in-out', padding: '40px' },
  closeBtn: { position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' },
  sidebarTitle: { color: '#fff', fontSize: '1.4rem', fontWeight: '900', marginBottom: '20px' },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '4px', color: '#fff', marginBottom: '15px' },
  loginBtn: { width: '100%', backgroundColor: '#ff7700', border: 'none', color: '#000', padding: '12px', borderRadius: '4px', fontWeight: '900', cursor: 'pointer' },
  profileSection: { textAlign: 'center' },
  profileAvatar: { fontSize: '4rem', marginBottom: '15px' },
  logoutBtn: { backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', width: '100%', padding: '10px', cursor: 'pointer', marginTop: '20px' },

  header: { textAlign: 'center', marginBottom: '120px', zIndex: 1, width: '100%', maxWidth: '1000px' },
  welcomeText: { fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', fontWeight: '900', color: '#fff', marginBottom: '25px', textShadow: '0 0 20px rgba(255,119,0,0.3)' },
  mainSubtitle: { fontSize: '1.2rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 40px auto', lineHeight: '1.8' },
  startButton: { padding: '20px 60px', fontSize: '1.3rem', fontWeight: 'bold', color: '#000', backgroundColor: '#ff7700', border: 'none', borderRadius: '4px', cursor: 'pointer', letterSpacing: '2px', boxShadow: '0 0 40px rgba(255,119,0,0.4)' },

  section: { width: '100%', maxWidth: '1100px', marginBottom: '140px', zIndex: 1 },
  sectionHeading: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' },
  sectionTitle: { fontSize: '2.5rem', fontWeight: '800', fontStyle: 'italic', color: '#fff' },
  sectionLine: { width: '80px', height: '3px', backgroundColor: '#ff7700', marginTop: '15px' },

  scalingHighlight: { background: 'linear-gradient(90deg, rgba(255,119,0,0.1), transparent)', borderLeft: '5px solid #ff7700', padding: '40px', borderRadius: '0 25px 25px 0' },
  scalingIcon: { fontSize: '4rem', marginBottom: '15px' },
  scalingTitle: { color: '#fff', fontSize: '1.5rem', fontWeight: '900', marginBottom: '10px' },
  scalingDesc: { fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.8', margin: 0 },

  bigImageWrapper: { width: '100%', marginBottom: '40px' },
  fullWidthImage: { width: '100%', height: 'auto', borderRadius: '25px', display: 'block' },
  uiFrame: { background: '#0a101a', padding: '20px', borderRadius: '35px', border: '1px solid rgba(255,119,0,0.3)', position: 'relative', boxShadow: '0 0 100px rgba(0,0,0,0.9)' },
  uiLabel: { position: 'absolute', top: '35px', left: '40px', fontSize: '11px', background: 'rgba(0,0,0,0.85)', padding: '6px 16px', borderRadius: '6px', fontWeight: 'bold', zIndex: 10, color: '#ff7700' },
  
  neuralSlotInfo: { marginTop: '30px', textAlign: 'left', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' },
  slotBadge: { display: 'inline-block', padding: '5px 15px', border: '1px solid #ff7700', borderRadius: '20px', color: '#ff7700', fontSize: '0.9rem', fontWeight: 'bold', marginRight: '15px', marginBottom: '10px' },
  slotText: { fontSize: '1.1rem', color: '#cbd5e1', marginTop: '10px' },

  journeySegmentCompact: { marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  compactImageWrapper: { width: '100%', maxWidth: '400px', margin: '0 auto 30px auto' }, 
  uiFrameCompact: { background: '#0a101a', padding: '15px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' },
  compactImage: { width: '100%', borderRadius: '20px' },
  uiLabelSmall: { position: 'absolute', top: '25px', left: '30px', fontSize: '9px', background: 'rgba(0,0,0,0.8)', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', color: '#ff7700' },

  giantSkillWrapper: { width: '100%', marginBottom: '60px' },
  giantSkillCard: { display: 'flex', gap: '50px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '50px', borderRadius: '40px', borderLeft: '1px solid rgba(255,119,0,0.2)', flexWrap: 'wrap' },
  giantIconContainer: { background: 'rgba(255,119,0,0.05)', padding: '40px', borderRadius: '35px' },
  iconSuperGiant: { width: '250px', height: '250px', filter: 'drop-shadow(0 0 40px #ff7700)' },
  giantSkillText: { flex: 1, textAlign: 'left', minWidth: '350px' },
  skillTitleText: { fontSize: '2.5rem', color: '#fff', fontWeight: '900', margin: '0 0 20px 0' },
  skillSubText: { fontSize: '1.3rem', color: '#cbd5e1', lineHeight: '1.8' },

  journeySegment: { marginBottom: '100px' },
  textDetailBox: { textAlign: 'left', padding: '0 40px' },
  segmentTitle: { fontSize: '2.2rem', color: '#ff7700', fontWeight: '900', marginBottom: '15px' },
  segmentDesc: { fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.7', margin: 0 },

  systemDetailBox: { textAlign: 'center', background: 'rgba(255,119,0,0.03)', padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,119,0,0.1)', marginTop: '20px', maxWidth: '800px', margin: '20px auto 0 auto' },
  systemHeader: { fontSize: '1.8rem', color: '#fff', fontWeight: '900', marginBottom: '15px' },
  systemText: { fontSize: '1.2rem', color: '#94a3b8', lineHeight: '1.8', margin: 0 },

  bossCard: { background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '60px', backdropFilter: 'blur(10px)' },
  bossContent: { display: 'flex', gap: '50px', alignItems: 'center', flexWrap: 'wrap', textAlign: 'left' },
  bossImageWrapper: { width: '250px', height: '250px' },
  bossImage: { width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(255,119,0,0.5))' },
  bossInfo: { flex: 1, minWidth: '350px' },
  eventBadge: { color: '#ff4444', fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px' },
  bossNameText: { fontSize: '3.5rem', fontWeight: '900', fontStyle: 'italic', color: '#fff', margin: '0 0 25px 0' },
  globalBossInfo: { fontSize: '1.1rem', color: '#94a3b8', marginBottom: '25px', lineHeight: '1.6' },
  hpBarBg: { height: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginTop: '15px' },
  hpBarFill: { width: '73.1%', height: '100%', background: 'linear-gradient(90deg, #ff0000, #ff7700)', borderRadius: '8px', boxShadow: '0 0 25px #ff7700' },
  hpLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' },

  glowTop: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '800px', backgroundColor: 'rgba(255, 119, 0, 0.05)', filter: 'blur(120px)', zIndex: 0 },
  footer: { marginTop: '120px', padding: '80px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', width: '100%' },
  version: { fontSize: '0.9rem', color: '#475569', fontWeight: 'bold' },
  devText: { fontSize: '0.9rem', color: '#ff7700', fontWeight: 'bold', fontStyle: 'italic', marginTop: '10px' }
};

export default LandingPage;