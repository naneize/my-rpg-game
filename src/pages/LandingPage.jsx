import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, Cpu, Activity, Shield, Swords, Layers, ZapOff } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.scanlineOverlay} />
      <div style={styles.glowTop} />

      {/* --- 🛰️ NAV: TACTICAL HUD --- */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.navLogo}>INFINITE_STEP <span style={styles.blink}>_</span></div>
          <div style={styles.versionTag}>V.1.2.0_STABLE</div>
        </div>
      </nav>

      {/* --- ⚔️ HERO: OPERATOR COMMAND --- */}
      <header style={styles.header}>
        <div style={styles.heroTag}>[ SIGNAL_ACQUIRED ]</div>
        <h2 style={styles.welcomeText}>NEURAL <span style={{color: '#ff7700'}}>OVERLOAD</span></h2>
        <p style={styles.mainSubtitle}>
          เชื่อมต่อระบบประสาทของคุณเข้ากับ <strong>Infinite Step</strong> ทุกก้าวเดินคือการประมวลผลข้อมูล 
          ยิ่งสำรวจลึก เลเวลศัตรูยิ่ง Scale ตามความโหด เตรียม Neural Drive ให้พร้อม เพราะที่นี่... ไม่มีคำว่าหยุดเดิน
        </p>
        
        <button 
          style={styles.startButton} 
          onClick={() => navigate('/play')}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>INITIALIZE_START</span>
          <div style={styles.btnGlitch} />
        </button>
      </header>

      {/* --- 🛰️ SYSTEM ANALYTICS (FEATURES) --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>CORE_LOGIC_<span style={{color: '#ff7700'}}>PROTOCOLS</span></h2>
          <div style={styles.sectionLine} />
        </div>

        <div style={styles.gridContainer}>
          {/* 1. Level Scaling */}
          <div style={styles.tacticalCard}>
            <Target color="#ff7700" size={32} />
            <h3 style={styles.cardTitle}>LEVEL_SCALING</h3>
            <p style={styles.cardDesc}>มอนสเตอร์ไม่ได้เกิดมาเพื่อแพ้! ระบบจะปรับความโหดของศัตรูตามเลเวลคุณ ยิ่งคุณเก่ง โลกยิ่งท้าทาย</p>
          </div>

          {/* 2. Auto-Combat */}
          <div style={styles.tacticalCard}>
            <Activity color="#60a5fa" size={32} />
            <h3 style={styles.cardTitle}>AUTO_ENGAGEMENT</h3>
            <p style={styles.cardDesc}>ระบบต่อสู้อัตโนมัติความเร็วสูง สลับเทิร์นประมวลผลดาเมจแบบ Real-time แม่นยำและดุดัน</p>
          </div>

          {/* 3. Neural Overload (Combo) */}
          <div style={styles.tacticalCard}>
            <Zap color="#fbbf24" size={32} />
            <h3 style={styles.cardTitle}>NEURAL_OVERLOAD</h3>
            <p style={styles.cardDesc}>สะสม Combo จากการโจมตี 5 ครั้ง เพื่อปลดล็อคสถานะ Overload สั่งใช้สกิลรุนแรงขึ้น 2 เท่า!</p>
          </div>

          {/* 4. Elemental Mastery */}
          <div style={styles.tacticalCard}>
            <Layers color="#f87171" size={32} />
            <h3 style={styles.cardTitle}>ELEMENT_TUNING</h3>
            <p style={styles.cardDesc}>ปรับจูนธาตุในร่างกายเพื่อหาจุดอ่อนศัตรู ธาตุที่ชนะทางจะสร้าง Damage มหาศาล</p>
          </div>
        </div>
      </section>

      {/* --- 💎 MODULES (Passive/Active) --- */}
      <section style={styles.section}>
        <div style={styles.megaDisplay}>
          <div style={styles.displaySide}>
            <div style={styles.moduleCard}>
              <Cpu color="#ff7700" />
              <div style={{textAlign: 'left'}}>
                <h4 style={styles.moduleTitle}>PASSIVE_CORES</h4>
                <p style={styles.moduleText}>ติดตั้ง Core เพื่ออัปเกรด Stat ถาวร เสริมความแกร่งจากระดับเซลล์</p>
              </div>
            </div>
            <div style={styles.moduleCard}>
              <Swords color="#60a5fa" />
              <div style={{textAlign: 'left'}}>
                <h4 style={styles.moduleTitle}>ACTIVE_DRIVES</h4>
                <p style={styles.moduleText}>2 Slot สกิลกดใช้ Tactical Burst หรือ Emergency Heal เลือกใช้ให้ถูกจังหวะ</p>
              </div>
            </div>
          </div>
          <div style={styles.interfacePreview}>
             <img src="/icon/passive_view.png" alt="Interface" style={styles.uiImage} />
             <div style={styles.uiOverlay}>[ INTERFACE_SCAN_ACTIVE ]</div>
          </div>
        </div>
      </section>

      {/* --- 🚩 FOOTER --- */}
      <footer style={styles.footer}>
        <div style={styles.footerLine} />
        <div style={styles.footerContent}>
          <span>STABLE_STREAM // OP_ID: NANLNWZA</span>
          <span style={{color: '#ff7700'}}>© 2026 INFINITE_STEP_PROJECT</span>
        </div>
      </footer>

      {isMobile && (
        <button style={styles.mobileFixedBtn} onClick={() => navigate('/play')}>
          EXECUTE_START_PROTOCOL
        </button>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#020617', color: '#cbd5e1', minHeight: '100vh', padding: '100px 20px', fontFamily: 'monospace', position: 'relative', overflowX: 'hidden' },
  scanlineOverlay: { position: 'fixed', inset: 0, background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)', backgroundSize: '100% 4px', zIndex: 100, pointerEvents: 'none', opacity: 0.3 },
  navbar: { position: 'fixed', top: 0, left: 0, width: '100%', height: '60px', borderBottom: '2px solid rgba(255,119,0,0.3)', background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(10px)', zIndex: 1000 },
  navInner: { maxWidth: '1200px', margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' },
  navLogo: { color: '#ff7700', fontWeight: 'bold', letterSpacing: '4px', fontSize: '1.2rem' },
  versionTag: { fontSize: '0.7rem', color: '#60a5fa', border: '1px solid #60a5fa', padding: '2px 8px' },
  
  header: { maxWidth: '800px', margin: '0 auto 100px', textAlign: 'center' },
  heroTag: { color: '#ff7700', fontSize: '0.7rem', letterSpacing: '5px', marginBottom: '10px' },
  welcomeText: { fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '900', color: '#fff', lineHeight: 1, marginBottom: '30px', fontStyle: 'italic' },
  mainSubtitle: { fontSize: '1rem', lineHeight: 1.8, color: '#94a3b8', marginBottom: '40px' },
  
  startButton: { background: '#ff7700', color: '#000', border: 'none', padding: '20px 40px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', position: 'relative', boxShadow: '4px 4px 0 #fff' },
  
  section: { maxWidth: '1100px', margin: '0 auto 120px' },
  sectionTitle: { fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '5px', color: '#fff' },
  sectionLine: { width: '40px', height: '4px', background: '#ff7700', marginTop: '10px' },
  
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '50px' },
  tacticalCard: { border: '1px solid rgba(255,255,255,0.1)', padding: '30px', textAlign: 'left', background: 'rgba(255,255,255,0.02)', position: 'relative' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#fff', margin: '20px 0 10px' },
  cardDesc: { fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 },

  megaDisplay: { display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' },
  displaySide: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '300px' },
  moduleCard: { display: 'flex', gap: '20px', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #ff7700' },
  moduleTitle: { color: '#fff', fontSize: '1rem', fontWeight: 'bold', marginBottom: '5px' },
  moduleText: { fontSize: '0.8rem', color: '#94a3b8' },
  
  interfacePreview: { flex: 1.5, minWidth: '300px', position: 'relative', border: '1px solid rgba(255,119,0,0.2)' },
  uiImage: { width: '100%', display: 'block', filter: 'grayscale(0.5) contrast(1.2)' },
  uiOverlay: { position: 'absolute', bottom: 10, right: 10, color: '#ff7700', fontSize: '0.6rem', fontWeight: 'bold' },

  footer: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  footerLine: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' },
  footerContent: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.6 },
  
  mobileFixedBtn: { position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '20px', background: '#ff7700', color: '#000', fontWeight: 'bold', border: 'none', zIndex: 1100, fontSize: '1rem' },
  blink: { animation: 'blink 1s infinite' },
  glowTop: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '300px', background: 'radial-gradient(circle, rgba(255,119,0,0.1) 0%, transparent 70%)', pointerEvents: 'none' }
};

export default LandingPage;