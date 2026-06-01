// ── HOME SCREEN ──────────────────────────────────────────────────
const { useState: useStateH, useEffect: useEffectH } = React;

const HomeScreen = ({ nav }) => {
  const { setScreen, addToCart } = nav;

  // Ticker items
  const tickerItems = [
    'San Marzano DOP', 'Wild mushroom', 'Buffalo mozzarella', 'Calabrian nduja',
    'Slow-ferment sourdough', 'Truffle oil', 'Prosciutto di Parma', 'Fresh basil',
    'Chili honey', 'Nocellara olives', 'White anchovies', 'Fior di latte',
  ];

  const pillars = [
    { label:'Wood-fired', body:'Our oven reaches 450°C. Every pizza bakes in 90 seconds — blistered, charred, never soggy.' },
    { label:'Open kitchen', body:'No secrets. Watch your pizza built from raw dough at the counter before your eyes.' },
    { label:'Same-day dough', body:'We make and proof each batch fresh every morning. No frozen bases, ever.' },
  ];

  const featuredIds = ['diavola','funghi','prosciutto'];
  const featuredPizzas = (window.PIZZA_MENU || []).filter(p => featuredIds.includes(p.id));

  return (
    <div style={{paddingBottom:80}}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section style={{
        background:'var(--charcoal)',
        display:'grid',
        gridTemplateColumns:'1fr 1fr',
        minHeight:'88vh',
        position:'relative', overflow:'hidden',
      }}>
        {/* Left — Editorial heading */}
        <div style={{
          display:'flex', flexDirection:'column', justifyContent:'flex-end',
          padding:'var(--s20) var(--s10) var(--s16) var(--s10)',
          position:'relative', zIndex:2, overflow:'hidden',
        }}>
          <div style={{
            fontSize:'var(--tx-xs)', fontWeight:700, letterSpacing:'.18em',
            textTransform:'uppercase', color:'var(--amber)', marginBottom:'var(--s6)',
          }}>
            Est. 2019 — Shoreditch, London
          </div>

          <h1 style={{
            fontFamily:'var(--fd)', color:'var(--cream)',
            marginBottom:'var(--s8)',
            display:'flex', flexDirection:'column', gap:'var(--s2)',
          }}>
            <span style={{
              fontSize:'clamp(2.5rem, 5.5vw, 5.5rem)',
              fontWeight:300, fontStyle:'italic',
              letterSpacing:'-.01em', lineHeight:1.1,
              whiteSpace:'nowrap',
            }}>Wood-fired</span>
            <span style={{
              fontSize:'clamp(2.75rem, 6.5vw, 6.5rem)',
              fontWeight:700,
              letterSpacing:'-.03em', lineHeight:1,
              color:'var(--cream)', whiteSpace:'nowrap',
            }}>city pizza</span>
            <span style={{
              fontSize:'clamp(0.9rem, 1.8vw, 1.6rem)',
              fontWeight:300, fontStyle:'italic',
              color:'var(--warm-gray-lt)',
              marginTop:'var(--s2)', lineHeight:1.3, whiteSpace:'nowrap',
            }}>crafted without compromise</span>
          </h1>

          <p style={{
            fontSize:'var(--tx-md)', color:'var(--warm-gray-lt)',
            maxWidth:380, lineHeight:1.65, marginBottom:'var(--s8)',
          }}>
            Neapolitan spirit. London pace. Same-day dough, open kitchen,
            and ingredients worth the journey.
          </p>

          <div style={{display:'flex', gap:'var(--s3)', flexWrap:'wrap'}}>
            <Btn variant="primary" size="xl" onClick={() => setScreen('menu')}>
              Order now
            </Btn>
            <Btn variant="secondary" size="xl" onClick={() => setScreen('builder')}
              style={{borderColor:'rgba(213,204,184,.4)', color:'var(--cream)'}}>
              Build your own
            </Btn>
          </div>

          {/* Stats */}
          <div style={{
            display:'flex', gap:'var(--s10)', marginTop:'var(--s12)',
            borderTop:'1px solid rgba(213,204,184,.15)', paddingTop:'var(--s8)',
          }}>
            {[['450°C','Oven temp'],['90s','Bake time'],['100%','Same-day dough']].map(([n,l]) => (
              <div key={l}>
                <div style={{fontFamily:'var(--fd)', fontSize:'var(--tx-3xl)', fontWeight:700, color:'var(--cream)'}}>{n}</div>
                <div style={{fontSize:'var(--tx-xs)', color:'var(--warm-gray-lt)', letterSpacing:'.08em', textTransform:'uppercase', marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Image area */}
        <div style={{position:'relative', overflow:'hidden'}}>
          {/* Diagonal texture lines */}
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:'repeating-linear-gradient(-45deg, rgba(255,255,255,.03) 0, rgba(255,255,255,.03) 1px, transparent 1px, transparent 40px)',
            zIndex:1,
          }}/>
          {/* Central pizza mockup */}
          <div style={{
            position:'absolute', inset:0, display:'flex',
            alignItems:'center', justifyContent:'center', zIndex:2,
          }}>
            <div style={{position:'relative'}}>
              {/* Outer glow ring */}
              <div style={{
                width:400, height:400, borderRadius:'50%',
                background:'radial-gradient(circle, rgba(201,127,24,.15) 0%, transparent 70%)',
                position:'absolute', top:'50%', left:'50%',
                transform:'translate(-50%,-50%)',
              }}/>
              {/* Pizza SVG large */}
              <svg viewBox="0 0 320 320" width="340" height="340" style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,.5))'}}>
                <defs>
                  <radialGradient id="hcrust" cx="38%" cy="33%">
                    <stop offset="0%" stopColor="#E8CA6C"/>
                    <stop offset="100%" stopColor="#C49838"/>
                  </radialGradient>
                  <radialGradient id="hsauce" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#C4341A" stopOpacity=".95"/>
                    <stop offset="100%" stopColor="#8C2010" stopOpacity=".9"/>
                  </radialGradient>
                </defs>
                <ellipse cx="163" cy="168" rx="126" ry="120" fill="rgba(0,0,0,.35)"/>
                <circle cx="160" cy="160" r="124" fill="url(#hcrust)"/>
                <circle cx="160" cy="160" r="103" fill="url(#hsauce)"/>
                <ellipse cx="145" cy="140" rx="38" ry="33" fill="#F0E8BE" opacity=".88"/>
                <ellipse cx="178" cy="168" rx="28" ry="26" fill="#EEE4B4" opacity=".82"/>
                <ellipse cx="138" cy="178" rx="22" ry="20" fill="#F0E8BE" opacity=".85"/>
                <ellipse cx="170" cy="138" rx="18" ry="16" fill="#EEE4B4" opacity=".8"/>
                <circle cx="148" cy="128" r="7" fill="#3A1808" opacity=".75"/>
                <circle cx="172" cy="148" r="6" fill="#3A1808" opacity=".7"/>
                <circle cx="138" cy="162" r="8" fill="#C02010" opacity=".8"/>
                <circle cx="165" cy="175" r="5" fill="#3A1808" opacity=".65"/>
                <circle cx="158" cy="148" r="4" fill="#2A3818" opacity=".7"/>
                <circle cx="182" cy="162" r="4" fill="#2A3818" opacity=".65"/>
                <circle cx="160" cy="160" r="124" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="5"/>
              </svg>
            </div>
          </div>
          {/* Corner label */}
          <div style={{
            position:'absolute', bottom:'var(--s8)', right:'var(--s8)', zIndex:3,
            textAlign:'right',
          }}>
            <div style={{fontSize:'var(--tx-xs)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--warm-gray-lt)'}}>
              Diavola
            </div>
            <div style={{fontFamily:'var(--fd)', fontSize:'var(--tx-lg)', fontStyle:'italic', color:'rgba(245,240,232,.5)'}}>
              tonight's feature
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────── */}
      <div style={{
        background:'var(--olive)', padding:'var(--s3) 0',
        overflow:'hidden', whiteSpace:'nowrap',
      }}>
        <div style={{
          display:'inline-flex', gap:'var(--s8)',
          animation:'ticker 28s linear infinite',
        }}>
          {[...tickerItems,...tickerItems].map((item, i) => (
            <span key={i} style={{
              fontSize:'var(--tx-xs)', fontWeight:700, letterSpacing:'.14em',
              textTransform:'uppercase', color:'var(--olive-pale)',
            }}>
              {item} <span style={{color:'var(--amber)', marginLeft:'var(--s4)'}}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── PILLARS ───────────────────────────────────────────── */}
      <section style={{
        maxWidth:1280, margin:'0 auto',
        padding:'var(--s20) var(--s6)',
        display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--s8)',
      }}>
        {pillars.map((p, i) => (
          <div key={i} style={{
            padding:'var(--s8) var(--s8) var(--s8)',
            borderTop:`3px solid ${i===0?'var(--red)':i===1?'var(--amber)':'var(--olive)'}`,
          }}>
            <div style={{
              fontFamily:'var(--fu)', fontSize:'var(--tx-xs)', fontWeight:700,
              letterSpacing:'.12em', textTransform:'uppercase',
              color: i===0?'var(--red)':i===1?'var(--amber)':'var(--olive)',
              marginBottom:'var(--s4)',
            }}>0{i+1} — {p.label}</div>
            <p style={{fontSize:'var(--tx-base)', color:'var(--warm-gray)', lineHeight:1.7}}>
              {p.body}
            </p>
          </div>
        ))}
      </section>

      {/* ── TONIGHT'S PICKS ───────────────────────────────────── */}
      <section style={{
        background:'var(--cream-dk)', borderTop:'1px solid var(--border)',
        borderBottom:'1px solid var(--border)',
        padding:'var(--s16) 0',
      }}>
        <div style={{maxWidth:1280, margin:'0 auto', padding:'0 var(--s6)'}}>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-end',
            marginBottom:'var(--s10)',
          }}>
            <div>
              <Eyebrow>Tonight's picks</Eyebrow>
              <h2 style={{fontFamily:'var(--fd)', fontSize:'var(--tx-4xl)', fontWeight:600, lineHeight:1.1, marginTop:'var(--s2)'}}>
                Worth the trip
              </h2>
            </div>
            <button onClick={() => setScreen('menu')} style={{
              fontSize:'var(--tx-sm)', fontWeight:600, color:'var(--red)',
              display:'flex', alignItems:'center', gap:6,
              textDecoration:'underline', textUnderlineOffset:3,
            }}>Full menu <IcoArrow /></button>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--s6)'}}>
            {featuredPizzas.map(pizza => (
              <PizzaCard key={pizza.id} pizza={pizza}
                onAdd={p => addToCart({id:Date.now(), name:p.name, price:p.price, qty:1, note:p.description.slice(0,40)+'…'})}
                onCustomize={() => setScreen('builder')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILD CTA ─────────────────────────────────────────── */}
      <section style={{
        maxWidth:1280, margin:'0 auto',
        padding:'var(--s20) var(--s6)',
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--s12)',
        alignItems:'center',
      }}>
        <div>
          <Eyebrow style={{marginBottom:'var(--s4)'}}>Your pizza, your rules</Eyebrow>
          <h2 style={{fontFamily:'var(--fd)', fontSize:'var(--tx-4xl)', fontWeight:600, lineHeight:1.1, marginBottom:'var(--s5)'}}>
            Build it<br/><em style={{fontWeight:300}}>exactly how you want it</em>
          </h2>
          <p style={{fontSize:'var(--tx-md)', color:'var(--warm-gray)', lineHeight:1.7, marginBottom:'var(--s8)', maxWidth:400}}>
            Pick your base, sauce, cheese, and toppings from our full inventory.
            Watch the price update as you build. No compromises.
          </p>
          <Btn variant="dark" size="xl" onClick={() => setScreen('builder')}>
            Open the builder <IcoArrow />
          </Btn>
        </div>
        <div style={{
          background:'var(--charcoal-mid)', borderRadius:'var(--r3)',
          aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', inset:0,
            backgroundImage:'repeating-linear-gradient(-30deg, rgba(255,255,255,.025) 0, rgba(255,255,255,.025) 1px, transparent 1px, transparent 30px)',
          }}/>
          <svg viewBox="0 0 280 280" width="220" height="220" style={{position:'relative',zIndex:1,filter:'drop-shadow(0 12px 30px rgba(0,0,0,.4))'}}>
            <defs>
              <radialGradient id="bldcrust" cx="38%" cy="33%">
                <stop offset="0%" stopColor="#E8CA6C"/>
                <stop offset="100%" stopColor="#C49838"/>
              </radialGradient>
            </defs>
            <ellipse cx="142" cy="147" rx="108" ry="104" fill="rgba(0,0,0,.3)"/>
            <circle cx="140" cy="140" r="108" fill="url(#bldcrust)"/>
            <circle cx="140" cy="140" r="88" fill="#EDE8D4" opacity=".95"/>
            <ellipse cx="128" cy="125" rx="30" ry="26" fill="#F0E4A0" opacity=".88"/>
            <ellipse cx="155" cy="148" rx="24" ry="22" fill="#EEE098" opacity=".82"/>
            <ellipse cx="120" cy="155" rx="20" ry="18" fill="#F0E4A0" opacity=".85"/>
            <text x="140" y="148" textAnchor="middle" dominantBaseline="middle"
              fontFamily="'Cormorant Garamond',serif" fontSize="22" fontWeight="600"
              fill="rgba(28,26,22,.3)" fontStyle="italic">yours</text>
          </svg>
          <div style={{position:'absolute', bottom:'var(--s6)', right:'var(--s6)', textAlign:'right'}}>
            <div style={{fontSize:'var(--tx-xs)', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray-lt)'}}>
              Starting from
            </div>
            <div style={{fontFamily:'var(--fd)', fontSize:'var(--tx-2xl)', fontWeight:700, color:'var(--amber)'}}>£12.00</div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @media(max-width:768px){
          section[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
          section[style*="repeat(3,1fr)"]{grid-template-columns:1fr!important}
          .hero-right{display:none}
        }
      `}</style>
    </div>
  );
};

Object.assign(window, { HomeScreen });
