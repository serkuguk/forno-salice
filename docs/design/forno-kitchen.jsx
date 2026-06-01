// ── KITCHEN STATUS BOARD ─────────────────────────────────────────
const { useState: useStateK, useEffect: useEffectK } = React;

const K_COLUMNS = [
  { key:'queue',    label:'Queue',    accent:'#9E9688' },
  { key:'prepping', label:'Prepping', accent:'#C97F18' },
  { key:'oven',     label:'In Oven',  accent:'#C4341A' },
  { key:'ready',    label:'Ready',    accent:'#4A5240' },
];

const KitchenScreen = ({ nav }) => {
  const { setScreen } = nav;
  const [orders, setOrders] = useStateK(
    (window.KITCHEN_ORDERS_INIT || []).map(o => ({...o}))
  );
  const [tick, setTick] = useStateK(0);
  const [now, setNow] = useStateK(new Date());

  // Live clock + order timers
  useEffectK(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setTick(n => n + 1);
      setOrders(prev => prev.map(o => {
        if (o.status === 'oven') {
          const newSec = (o.ovenSec || 0) - 1;
          return { ...o, ovenSec: newSec };
        }
        return { ...o, elapsed: (o.elapsed || 0) + (1/60) };
      }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const grouped = K_COLUMNS.reduce((acc, col) => {
    acc[col.key] = orders.filter(o => o.status === col.key);
    return acc;
  }, {});

  const timeStr = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'long' });

  return (
    <div style={{
      minHeight:'100vh', background:'var(--charcoal)',
      color:'var(--cream)', fontFamily:'var(--fu)',
      display:'flex', flexDirection:'column',
    }}>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <header style={{
        borderBottom:'1px solid rgba(213,204,184,.12)',
        padding:'var(--s4) var(--s8)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        flexShrink:0,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:'var(--s6)'}}>
          <button onClick={() => setScreen('home')} style={{
            fontFamily:'var(--fd)',fontSize:'var(--tx-xl)',fontWeight:600,
            color:'var(--cream)',letterSpacing:'.03em',
          }}>
            Forno <span style={{color:'var(--red)'}}>&amp;</span> Slice
          </button>
          <div style={{
            padding:'3px 10px',background:'var(--red)',borderRadius:'var(--r4)',
            fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
          }}>Kitchen Board</div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'var(--s8)'}}>
          {/* Active order count */}
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'var(--tx-xs)',color:'var(--warm-gray)',letterSpacing:'.08em',textTransform:'uppercase'}}>
              Active orders
            </div>
            <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-2xl)',fontWeight:700,color:'var(--amber)'}}>
              {orders.filter(o => o.status !== 'ready').length}
            </div>
          </div>
          {/* Clock */}
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-3xl)',fontWeight:300,letterSpacing:'.04em',color:'var(--cream)',lineHeight:1}}>
              {timeStr}
            </div>
            <div style={{fontSize:'var(--tx-xs)',color:'var(--warm-gray)',marginTop:2}}>
              {dateStr}
            </div>
          </div>
        </div>
      </header>

      {/* ── KANBAN BOARD ─────────────────────────────────────── */}
      <div style={{
        flex:1, display:'grid', gridTemplateColumns:'repeat(4,1fr)',
        gap:1, background:'rgba(213,204,184,.08)', overflow:'auto',
      }}>
        {K_COLUMNS.map(col => (
          <div key={col.key} style={{
            background:'var(--charcoal)',
            display:'flex', flexDirection:'column',
            minHeight:0,
          }}>
            {/* Column header */}
            <div style={{
              padding:'var(--s4) var(--s5)',
              borderBottom:`2px solid ${col.accent}`,
              display:'flex', justifyContent:'space-between', alignItems:'center',
              flexShrink:0,
            }}>
              <div style={{
                fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.14em',
                textTransform:'uppercase',color:col.accent,
              }}>{col.label}</div>
              <div style={{
                background:col.accent, color:
                  col.key==='ready' ? 'var(--cream)' : 'var(--charcoal)',
                borderRadius:'var(--r4)',padding:'2px 8px',
                fontSize:'var(--tx-xs)',fontWeight:700,
              }}>
                {grouped[col.key].length}
              </div>
            </div>

            {/* Cards */}
            <div style={{
              flex:1, overflowY:'auto', padding:'var(--s4)',
              display:'flex', flexDirection:'column', gap:'var(--s3)',
            }}>
              {grouped[col.key].length === 0 && (
                <div style={{
                  color:'rgba(158,150,136,.35)',
                  fontSize:'var(--tx-sm)',textAlign:'center',
                  padding:'var(--s8) 0',fontStyle:'italic',
                }}>No orders</div>
              )}
              {grouped[col.key].map(order => (
                <KitchenCard key={order.id} order={order}
                  accent={col.accent} tick={tick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER BAR ───────────────────────────────────────── */}
      <footer style={{
        borderTop:'1px solid rgba(213,204,184,.1)',
        padding:'var(--s3) var(--s8)',
        display:'flex', gap:'var(--s8)', alignItems:'center',
        flexShrink:0,
      }}>
        {['A','B','C'].map(stn => {
          const count = orders.filter(o => o.station===stn && o.status!=='ready').length;
          return (
            <div key={stn} style={{display:'flex',alignItems:'center',gap:'var(--s3)'}}>
              <div style={{
                width:28,height:28,borderRadius:'var(--r2)',
                background:'rgba(213,204,184,.12)',border:'1px solid rgba(213,204,184,.2)',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.06em',
              }}>Stn {stn}</div>
              <div style={{fontSize:'var(--tx-sm)',color:'var(--warm-gray)'}}>
                {count} active
              </div>
            </div>
          );
        })}
        <div style={{marginLeft:'auto',fontSize:'var(--tx-xs)',color:'var(--warm-gray-lt)'}}>
          Internal view — Forno &amp; Slice kitchen
        </div>
      </footer>
    </div>
  );
};

// ── KITCHEN ORDER CARD ───────────────────────────────────────────
const KitchenCard = ({ order, accent, tick }) => {
  const isOven = order.status === 'oven';
  const isReady = order.status === 'ready';
  const ovenSec = order.ovenSec || 0;
  const ovenDone = isOven && ovenSec <= 0;

  // Timer color logic
  const timerColor = ovenSec > 120 ? '#4A5240'
    : ovenSec > 60 ? 'var(--amber)'
    : ovenSec > 0  ? 'var(--red)'
    : '#C4341A';

  const formatTime = (s) => {
    const abs = Math.abs(Math.round(s));
    const m = Math.floor(abs/60);
    const sec = abs % 60;
    return `${s < 0 ? '+' : ''}${m}:${String(sec).padStart(2,'0')}`;
  };

  return (
    <div style={{
      background: isReady ? 'rgba(74,82,64,.18)' : 'rgba(255,255,255,.04)',
      border:`1px solid ${isReady ? 'rgba(74,82,64,.4)' : 'rgba(213,204,184,.12)'}`,
      borderRadius:'var(--r2)',padding:'var(--s4)',
      transition:'all var(--dur)',
      outline: ovenDone ? '2px solid var(--red)' : 'none',
    }}>
      {/* Top row */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'var(--s3)'}}>
        <div style={{
          fontFamily:'var(--fd)',fontSize:'var(--tx-2xl)',fontWeight:700,
          letterSpacing:'-.01em',color: isReady ? 'var(--olive-pale)' : 'var(--cream)',
        }}>{order.id}</div>

        {/* Station badge */}
        <div style={{
          padding:'2px 8px',borderRadius:'var(--r1)',
          background:'rgba(213,204,184,.1)',border:'1px solid rgba(213,204,184,.2)',
          fontSize:'var(--tx-xs)',fontWeight:700,color:'var(--warm-gray)',
          letterSpacing:'.08em',
        }}>Stn {order.station}</div>
      </div>

      {/* Items */}
      <div style={{display:'flex',flexDirection:'column',gap:3,marginBottom:'var(--s3)'}}>
        {order.items.map((item, i) => (
          <div key={i} style={{
            fontSize:'var(--tx-sm)',color:'rgba(213,204,184,.8)',
            display:'flex',alignItems:'center',gap:6,
          }}>
            <div style={{
              width:5,height:5,borderRadius:'50%',
              background: isReady ? 'var(--olive-lt)' : accent,
              flexShrink:0,
            }}/>
            {item}
          </div>
        ))}
      </div>

      {/* Bottom: timer / status */}
      <div style={{
        display:'flex',justifyContent:'space-between',
        alignItems:'center',
        paddingTop:'var(--s3)',borderTop:'1px solid rgba(213,204,184,.1)',
      }}>
        {isOven ? (
          <>
            <div style={{fontSize:'var(--tx-xs)',color:'var(--warm-gray)',letterSpacing:'.08em',textTransform:'uppercase'}}>
              Oven
            </div>
            <div style={{
              fontFamily:'var(--fd)',fontSize:'var(--tx-xl)',fontWeight:700,
              color: ovenDone ? 'var(--red)' : timerColor,
              animation: ovenDone ? 'blink 1s step-end infinite' : 'none',
            }}>
              {ovenDone ? 'DONE' : formatTime(ovenSec)}
            </div>
          </>
        ) : isReady ? (
          <div style={{
            fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.1em',
            textTransform:'uppercase',color:'var(--olive-lt)',
          }}>Ready for pickup</div>
        ) : (
          <>
            <div style={{fontSize:'var(--tx-xs)',color:'var(--warm-gray)',letterSpacing:'.06em',textTransform:'uppercase'}}>
              Elapsed
            </div>
            <div style={{fontSize:'var(--tx-sm)',color:'var(--warm-gray)',fontWeight:600}}>
              {Math.floor(order.elapsed || 0)} min
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { KitchenScreen });
