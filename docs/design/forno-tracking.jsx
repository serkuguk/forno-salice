// ── ORDER TRACKING SCREEN ────────────────────────────────────────
const { useState: useStateT, useEffect: useEffectT } = React;

const TRACKING_STEPS = [
  { key:'placed',    label:'Order placed',      body:'We got your order and are reviewing it.' },
  { key:'confirmed', label:'Confirmed',          body:'Your order is confirmed and queued.' },
  { key:'prepping',  label:'Prepping',           body:'The kitchen is stretching your dough now.' },
  { key:'oven',      label:'In the oven',        body:'Your pizza is firing at 450°C.' },
  { key:'ready',     label:'Ready',              body:'Done. Your pizza is boxed and ready.' },
  { key:'delivered', label:'Out for delivery',   body:'On its way to you.' },
];

const TrackingScreen = ({ nav }) => {
  const { setScreen } = nav;
  const [currentStep, setCurrentStep] = useStateT(3); // 0-indexed, starts at 'prepping'
  const [elapsed, setElapsed] = useStateT(0);
  const ORDER_NUM = '#' + Math.floor(150 + Math.random() * 50);
  const ETA = 24; // minutes remaining

  // Simulate progress
  useEffectT(() => {
    const t = setInterval(() => {
      setElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance step slowly for demo
  useEffectT(() => {
    if (elapsed > 0 && elapsed % 12 === 0 && currentStep < TRACKING_STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    }
  }, [elapsed]);

  const activeStep = TRACKING_STEPS[currentStep];
  const etaRemaining = Math.max(0, ETA - Math.floor(elapsed / 6));

  const statusColors = {
    placed:'var(--warm-gray)',confirmed:'var(--amber)',
    prepping:'var(--amber-lt)',oven:'var(--red)',
    ready:'var(--olive)',delivered:'var(--olive)',
  };
  const accentColor = statusColors[activeStep.key] || 'var(--amber)';

  return (
    <div style={{maxWidth:720,margin:'0 auto',padding:'var(--s10) var(--s6) 120px'}}>
      {/* Header */}
      <div style={{marginBottom:'var(--s10)'}}>
        <Eyebrow style={{marginBottom:'var(--s2)'}}>Live tracking</Eyebrow>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <h1 style={{fontFamily:'var(--fd)',fontSize:'var(--tx-4xl)',fontWeight:700,lineHeight:1}}>
            Order {ORDER_NUM}
          </h1>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--warm-gray)'}}>
              Est. delivery
            </div>
            <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-3xl)',fontWeight:700,color:accentColor}}>
              {etaRemaining} min
            </div>
          </div>
        </div>
      </div>

      {/* Big status card */}
      <div style={{
        background:'var(--charcoal)',borderRadius:'var(--r3)',
        padding:'var(--s10) var(--s8)',
        display:'flex',alignItems:'center',gap:'var(--s8)',
        marginBottom:'var(--s8)',overflow:'hidden',position:'relative',
      }}>
        {/* Animated background rings */}
        <div style={{
          position:'absolute',right:-60,top:'50%',transform:'translateY(-50%)',
          width:300,height:300,borderRadius:'50%',
          border:`80px solid ${accentColor}`,opacity:.06,
          animation:'pulse 2s ease-in-out infinite',
        }}/>
        {/* Status icon */}
        <div style={{
          width:80,height:80,borderRadius:'50%',
          background:accentColor,flexShrink:0,
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:`0 0 0 12px ${accentColor}22`,
        }}>
          <StatusIcon stepKey={activeStep.key} />
        </div>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{
            fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.14em',
            textTransform:'uppercase',color:'var(--warm-gray-lt)',marginBottom:'var(--s2)',
          }}>Current status</div>
          <div style={{
            fontFamily:'var(--fd)',fontSize:'var(--tx-3xl)',fontWeight:700,
            color:'var(--cream)',lineHeight:1.1,marginBottom:'var(--s2)',
          }}>{activeStep.label}</div>
          <div style={{fontSize:'var(--tx-sm)',color:'var(--warm-gray-lt)'}}>
            {activeStep.body}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background:'var(--cream-dk)',border:'1px solid var(--border)',
        borderRadius:'var(--r3)',overflow:'hidden',marginBottom:'var(--s8)',
      }}>
        <div style={{
          padding:'var(--s5)',borderBottom:'1px solid var(--border)',
        }}>
          <div style={{fontSize:'var(--tx-sm)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--warm-gray)'}}>
            Progress
          </div>
        </div>
        <div style={{padding:'var(--s5)'}}>
          {TRACKING_STEPS.map((step,i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const future = i > currentStep;
            return (
              <div key={step.key} style={{
                display:'flex',gap:'var(--s4)',
                paddingBottom: i < TRACKING_STEPS.length-1 ? 'var(--s4)' : 0,
                opacity: future ? .35 : 1,
              }}>
                {/* Dot + line */}
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:0,flexShrink:0}}>
                  <div style={{
                    width:28,height:28,borderRadius:'50%',flexShrink:0,
                    background: done ? 'var(--olive)' : active ? accentColor : 'var(--cream-dkr)',
                    border: `2px solid ${done ? 'var(--olive)' : active ? accentColor : 'var(--border)'}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    transition:'all var(--dur-s)',
                    boxShadow: active ? `0 0 0 6px ${accentColor}20` : 'none',
                  }}>
                    {done ? (
                      <IcoCheck />
                    ) : (
                      <div style={{
                        width:8,height:8,borderRadius:'50%',
                        background: active ? 'var(--cream)' : 'var(--border)',
                      }}/>
                    )}
                  </div>
                  {i < TRACKING_STEPS.length-1 && (
                    <div style={{
                      width:2,flex:1,minHeight:24,
                      background: done ? 'var(--olive)' : 'var(--border)',
                      transition:'background var(--dur-s)',
                    }}/>
                  )}
                </div>
                {/* Label */}
                <div style={{paddingBottom:'var(--s4)',paddingTop:3}}>
                  <div style={{
                    fontWeight: active ? 700 : done ? 600 : 400,
                    fontSize:'var(--tx-sm)',
                    color: done ? 'var(--charcoal)' : active ? 'var(--charcoal)' : 'var(--warm-gray)',
                    marginBottom:2,
                  }}>{step.label}</div>
                  {(active || done) && (
                    <div style={{fontSize:'var(--tx-xs)',color:'var(--warm-gray)'}}>
                      {active ? step.body : 'Complete'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order items */}
      <div style={{
        background:'var(--cream-dk)',border:'1px solid var(--border)',
        borderRadius:'var(--r3)',overflow:'hidden',marginBottom:'var(--s8)',
      }}>
        <div style={{padding:'var(--s5)',borderBottom:'1px solid var(--border)'}}>
          <div style={{fontSize:'var(--tx-sm)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--warm-gray)'}}>
            What's cooking
          </div>
        </div>
        <div style={{padding:'var(--s5)',display:'flex',flexDirection:'column',gap:'var(--s3)'}}>
          {(nav.cart||[]).length > 0 ? nav.cart.map(item => (
            <div key={item.id} style={{
              display:'flex',justifyContent:'space-between',
              fontSize:'var(--tx-base)',
            }}>
              <span style={{fontFamily:'var(--fd)',fontSize:'var(--tx-lg)',fontWeight:500}}>
                {item.name} <span style={{color:'var(--warm-gray)',fontSize:'var(--tx-sm)'}}>×{item.qty||1}</span>
              </span>
              <span style={{fontWeight:700,color:'var(--red)'}}>
                £{(item.price*(item.qty||1)).toFixed(2)}
              </span>
            </div>
          )) : (
            <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-lg)',color:'var(--warm-gray)'}}>Diavola ×1 — £17.00</div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{textAlign:'center'}}>
        <Btn variant="ghost" size="md" onClick={() => setScreen('home')}>
          Back to home
        </Btn>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100%{transform:translateY(-50%) scale(1);opacity:.06}
          50%{transform:translateY(-50%) scale(1.08);opacity:.1}
        }
      `}</style>
    </div>
  );
};

// Status icons by step
const StatusIcon = ({ stepKey }) => {
  const icons = {
    placed:    <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    confirmed: <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
    prepping:  <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3m-4.2-7.8-2.1 2.1M8.3 15.7l-2.1 2.1m0-11.6 2.1 2.1m7.4 7.4 2.1 2.1"/></svg>,
    oven:      <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    ready:     <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    delivered: <svg width="32" height="32" fill="none" stroke="white" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  };
  return icons[stepKey] || icons.placed;
};

Object.assign(window, { TrackingScreen });
