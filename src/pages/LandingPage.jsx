import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div style={styles.glowTop} />

      {/* --- NAVBAR --- */}
      <nav style={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <div style={styles.navLogo}>INFINITE STEP</div>
          <div style={{ 
            fontSize: '0.65rem', 
            color: '#ff7700', 
            opacity: 0.8, 
            border: '1px solid #ff7700', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            V.1.0.0 Early Access
          </div>
        </div>
      </nav>

      {/* --- 1. HERO SECTION: STEP EXPLORATION --- */}
      <header style={styles.header}>
         <h2 style={styles.welcomeText}>EVERY <span style={{color: '#ff7700'}}>STEP</span> IS A JOURNEY</h2>
         <p style={styles.mainSubtitle}>
           มาเริ่มเดินกันเถอะ! <strong>"กดเดิน Step"</strong> ยิ่งคุณเดินเยอะ 
           โอกาสที่จะเจอของดี ทรัพยากรหายาก หรือศัตรูระดับตำนานก็ยิ่งมากตาม 
           ทุกย่างก้าวลุ้นกันตัวโก่งแน่นอนว่าจะเจออะไรในแมพต่อไป!
         </p>
         
         {/* ✅ ปุ่มเดียวสำหรับเข้าเกม: เพิ่ม zIndex และความหนึบ */}
         <button 
           style={{...styles.startButton, position: 'relative', zIndex: 100}} 
           onClick={(e) => {
             e.preventDefault();
             navigate('/play');
           }}
         >
           START ADVENTURE
         </button>
         
         <div style={styles.heroImageWrapper}>
            <div style={styles.scanline} />
            <img src="/icon/step_content.png" alt="Step System" style={styles.heroImage} />
            <p style={styles.imageCaption}>[ NEURAL SCANNER: MANUAL STEP CONTROL ]</p>
         </div>
      </header>

      {/* --- 2. THE BIG THREE FEATURES --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <h2 style={styles.sectionTitle}>CORE <span style={{color: '#ff7700'}}>SYSTEMS</span></h2>
          <div style={styles.sectionLine} />
        </div>

        <div style={styles.featureColumn}>
          
          <div style={{...styles.megaCard, borderColor: '#ffd700', background: 'rgba(255,215,0,0.05)'}}>
            <div style={{...styles.iconWrapper, background: 'rgba(255,215,0,0.1)'}}>
               <img src="/icon/shiny.png" alt="Shiny Variant" style={{...styles.iconLarge, filter: 'drop-shadow(0 0 30px #ffd700)'}} />
            </div>
            <div style={styles.cardDetail}>
               <h3 style={{...styles.cardTitle, color: '#ffd700'}}>SHINY VARIANTS</h3>
               <p style={styles.cardDesc}>
                 <strong>"ตามหาตัวไชนี่ในตำนาน"</strong> <br />
                 มอนสเตอร์ทุกตัวมีโอกาสเกิดเป็นไชนี่ (Shiny) พวกมันโหดกว่าเดิม 2.5 เท่า 
                 แต่ถ้าล้มได้ล่ะก็ เตรียมตัวรับไอเทมระดับ <strong>Legendary</strong> ไปใส่หล่อๆ ได้เลย!
               </p>
               <div style={styles.tagGroup}>
                 <span style={{...styles.tag, color: '#ffd700', borderColor: '#ffd700'}}>2.5x Stats</span>
                 <span style={{...styles.tag, color: '#ffd700', borderColor: '#ffd700'}}>Legendary Loot</span>
               </div>
            </div>
          </div>

          <div style={styles.megaCard}>
            <div style={styles.iconWrapper}>
               <img src="/icon/passive.png" alt="Passive Core" style={styles.iconLarge} />
            </div>
            <div style={styles.cardDetail}>
               <h3 style={styles.cardTitle}>PASSIVE CORES</h3>
               <p style={styles.cardDesc}>
                 <strong>"อัปเกรดตัวเองแบบถาวร"</strong> <br />
                 ติดตั้ง Cores เพื่อเพิ่มพลังพื้นฐาน (ATK, DEF, HP, CRIT) ให้ตัวละครเก่งขึ้นเรื่อยๆ 
                 ยิ่งฟาร์ม Cores ได้เยอะ คุณก็จะยิ่งลุยแมพโหดๆ ได้สบายขึ้นแบบถาวร
               </p>
               <div style={styles.tagGroup}>
                 <span style={styles.tag}>Permanent Boost</span>
                 <span style={styles.tag}>3 Slots</span>
               </div>
            </div>
          </div>

          <div style={{...styles.megaCard, borderColor: '#60a5fa', background: 'rgba(96, 165, 250, 0.03)'}}>
            <div style={{...styles.iconWrapper, background: 'rgba(96, 165, 250, 0.1)'}}>
               <img src="/icon/active.png" alt="Active Drive" style={{...styles.iconLarge, filter: 'drop-shadow(0 0 30px #60a5fa)'}} />
            </div>
            <div style={styles.cardDetail}>
               <h3 style={{...styles.cardTitle, color: '#60a5fa'}}>ACTIVE DRIVES</h3>
               <p style={styles.cardDesc}>
                 <strong>"กดใช้ให้ถูกจังหวะ"</strong> <br />
                 สกิลที่ต้องกดเอง (Active) เลือกใส่ได้ 2 Slots จะเอาดาเมจแรงๆ หรือฮีลฉุกเฉิน 
                 ก็จัดเต็มไปตามสไตล์การเล่นของคุณเพื่อล้มศัตรูที่อยู่ตรงหน้า
               </p>
               <div style={styles.tagGroup}>
                 <span style={{...styles.tag, color: '#60a5fa', borderColor: '#60a5fa'}}>Tactical Skill</span>
                 <span style={{...styles.tag, color: '#60a5fa', borderColor: '#60a5fa'}}>2 Slots</span>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- 3. UI INTERFACE PREVIEW --- */}
      <section style={styles.section}>
         <div style={styles.sectionHeading}>
            <h2 style={styles.sectionTitle}>NEURAL <span style={{color: '#ff7700'}}>INTERFACE</span></h2>
            <div style={styles.sectionLine} />
            <p style={styles.cardDesc}>หน้าตาเมนูที่ออกแบบมาให้คลีนที่สุด แต่ข้อมูลครบพร้อมลุย</p>
         </div>
         <div style={styles.uiFrame}>
            <div style={styles.scanline} />
            <img src="/icon/passive_view.png" alt="System Interface" style={styles.fullImg} />
         </div>
         
         <p style={{...styles.cardDesc, marginTop: '40px', fontStyle: 'italic', color: '#ff7700'}}>
            ... และยังมีคอนเทนต์อื่นๆ อีกมากมายรอให้เพื่อนๆ มาสนุกกันจ่ะ ...
         </p>
      </section>

      {/* MOBILE STICKY START */}
      {isMobile && (
        <div style={styles.stickyAction}>
          <button style={styles.mobileActionBtn} onClick={() => navigate('/play')}>START ADVENTURE</button>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <p style={{ marginBottom: '5px' }}>VERSION 1.0.0 - STABLE STREAM</p>
        <p style={{ color: '#ff7700', fontWeight: 'bold' }}>DEVELOPED BY NANLNWZA</p>
      </footer>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { backgroundColor: '#05070a', color: '#e2e8f0', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '100px 15px 40px', fontFamily: '"IBM Plex Sans Thai", sans-serif', textAlign: 'center' },
  navbar: { position: 'fixed', top: 0, width: '100%', height: '70px', background: 'rgba(5,7,10,0.9)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 40px', zIndex: 1000, borderBottom: '1px solid rgba(255,119,0,0.2)' },
  navLogo: { color: '#ff7700', fontWeight: '900', letterSpacing: '2px' },

  header: { textAlign: 'center', marginBottom: '80px', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  welcomeText: { fontSize: 'clamp(2.2rem, 10vw, 4.5rem)', fontWeight: '900', color: '#fff', margin: 0 },
  mainSubtitle: { fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.8', marginTop: '20px', maxWidth: '700px' },
  startButton: { marginTop: '30px', marginBottom: '50px', padding: '18px 50px', fontSize: '1.2rem', fontWeight: 'bold', backgroundColor: '#ff7700', border: 'none', borderRadius: '5px', color: '#000', cursor: 'pointer', boxShadow: '0 0 30px rgba(255,119,0,0.4)' },
  
  heroImageWrapper: { width: '100%', maxWidth: '800px', position: 'relative', border: '1px solid rgba(255,119,0,0.3)', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.5)' },
  heroImage: { width: '100%', display: 'block' },
  imageCaption: { fontSize: '0.7rem', color: '#ff7700', letterSpacing: '3px', margin: '15px 0', fontWeight: 'bold' },

  section: { width: '100%', maxWidth: '1100px', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  sectionHeading: { textAlign: 'center', marginBottom: '40px' },
  sectionTitle: { fontSize: '2.2rem', fontWeight: '900', color: '#fff' },
  sectionLine: { width: '50px', height: '3px', backgroundColor: '#ff7700', margin: '15px auto' },

  featureColumn: { display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' },
  megaCard: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,119,0,0.15)', borderRadius: '35px', padding: '40px', flexWrap: 'wrap', textAlign: 'center' },
  iconWrapper: { background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  iconLarge: { width: '130px', height: '130px', filter: 'drop-shadow(0 0 20px #ff7700)' },
  cardDetail: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  cardTitle: { fontSize: '2rem', fontWeight: '900', color: '#ff7700', marginBottom: '15px' },
  cardDesc: { fontSize: '1.05rem', color: '#cbd5e1', lineHeight: '1.8', maxWidth: '600px' },
  tagGroup: { display: 'flex', gap: '10px', marginTop: '25px', justifyContent: 'center' },
  tag: { padding: '6px 18px', border: '1px solid #ff7700', borderRadius: '25px', fontSize: '0.85rem', color: '#ff7700', fontWeight: 'bold' },

  uiFrame: { width: '100%', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', overflow: 'hidden' },
  fullImg: { width: '100%', display: 'block' },
  scanline: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)', backgroundSize: '100% 4px', zIndex: 2, pointerEvents: 'none' },

  stickyAction: { position: 'fixed', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 2000 },
  mobileActionBtn: { width: '90%', padding: '18px', background: '#ff7700', color: '#000', fontWeight: '900', borderRadius: '15px', border: 'none', fontSize: '1rem' },
  footer: { marginTop: '40px', opacity: 0.6, fontSize: '0.8rem', borderTop: '1px solid rgba(255,119,0,0.1)', paddingTop: '30px', width: '100%' },
  glowTop: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '500px', backgroundColor: 'rgba(255, 119, 0, 0.05)', filter: 'blur(100px)', zIndex: 0 }
};

export default LandingPage;