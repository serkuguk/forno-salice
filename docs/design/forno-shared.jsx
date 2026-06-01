// ── SHARED COMPONENTS ────────────────────────────────────────────
// Exported to window at bottom

const { useState, useEffect, useRef } = React;

// ── ICONS ────────────────────────────────────────────────────────
const IcoBag    = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const IcoHome   = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoMenu   = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/></svg>;
const IcoPizza  = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2c2.5 2.5 4 6 4 10"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="8" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="16" r="1" fill="currentColor"/></svg>;
const IcoClose  = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoPlus   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoMinus  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcoArrow  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoCheck  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

// ── BUTTON ───────────────────────────────────────────────────────
const Btn = ({ children, variant = 'primary', size = 'md', onClick, disabled, full, style: s }) => {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
    fontFamily:'var(--fu)', fontWeight:600, letterSpacing:'.04em',
    border:'1.5px solid transparent', borderRadius:'var(--r1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .5 : 1,
    transition:'background var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)',
    width: full ? '100%' : undefined, whiteSpace:'nowrap',
  };
  const sizes = {
    sm: { fontSize:'var(--tx-xs)', padding:'6px 14px', letterSpacing:'.08em' },
    md: { fontSize:'var(--tx-sm)', padding:'10px 22px' },
    lg: { fontSize:'var(--tx-base)', padding:'13px 28px' },
    xl: { fontSize:'var(--tx-md)', padding:'16px 36px' },
  };
  const variants = {
    primary:   { background:'var(--red)',     color:'var(--cream)',   borderColor:'var(--red)' },
    secondary: { background:'transparent',    color:'var(--olive)',   borderColor:'var(--olive)' },
    ghost:     { background:'transparent',    color:'var(--charcoal)',borderColor:'var(--border)' },
    dark:      { background:'var(--charcoal)',color:'var(--cream)',   borderColor:'var(--charcoal)' },
    amber:     { background:'var(--amber)',   color:'var(--cream)',   borderColor:'var(--amber)' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{...base,...sizes[size],...variants[variant],...s}}>
      {children}
    </button>
  );
};

// ── BADGE ────────────────────────────────────────────────────────
const Badge = ({ label }) => {
  const colors = {
    'house fave':{ bg:'var(--red-pale)',    color:'var(--red-hover)' },
    'seasonal':  { bg:'var(--amber-pale)',  color:'var(--amber)'     },
    'new':       { bg:'var(--olive-pale)',  color:'var(--olive)'     },
    'vegan':     { bg:'var(--olive-pale)',  color:'var(--olive)'     },
    'spicy':     { bg:'var(--red-pale)',    color:'var(--red)'       },
  };
  const c = colors[label] || { bg:'var(--cream-dkr)', color:'var(--warm-gray)' };
  return (
    <span style={{
      fontFamily:'var(--fu)', fontSize:'var(--tx-xs)', fontWeight:700,
      letterSpacing:'.1em', textTransform:'uppercase',
      padding:'3px 8px', borderRadius:'var(--r4)',
      background:c.bg, color:c.color,
    }}>{label}</span>
  );
};

// ── PIZZA CARD ───────────────────────────────────────────────────
const PizzaCard = ({ pizza, onAdd, onCustomize, size = 'md' }) => {
  const [hover, setHover] = useState(false);
  const sauceColors = { margherita:'#B83018', diavola:'#A02010', funghi:'#EDE8D4',
    norma:'#C03020', prosciutto:'#C83828', marinara:'#B02818',
    bianca:'#EDE8D4', nduja:'#A81808' };
  const sc = sauceColors[pizza.id] || '#B83018';

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background:'var(--cream-dk)', borderRadius:'var(--r2)',
        border:'1px solid var(--border)',
        boxShadow: hover ? 'var(--sh-lg)' : 'var(--sh-sm)',
        transition:'box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease)',
        transform: hover ? 'translateY(-2px)' : 'none',
        overflow:'hidden', display:'flex', flexDirection:'column',
      }}>
      {/* Pizza illustration */}
      <div style={{
        aspectRatio: size === 'lg' ? '16/9' : '4/3',
        background:'var(--cream-dkr)', position:'relative', overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <MiniPizza sauceColor={sc} pizzaId={pizza.id} />
        {pizza.badge && (
          <div style={{position:'absolute', top:'var(--s3)', left:'var(--s3)'}}>
            <Badge label={pizza.badge} />
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{padding:'var(--s4) var(--s5)', display:'flex', flexDirection:'column', gap:'var(--s2)', flex:1}}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'var(--s3)'}}>
          <h3 style={{fontFamily:'var(--fd)', fontSize:'var(--tx-xl)', fontWeight:600, lineHeight:1.2}}>
            {pizza.name}
          </h3>
          <span style={{fontFamily:'var(--fd)', fontSize:'var(--tx-xl)', fontWeight:700, color:'var(--red)', whiteSpace:'nowrap'}}>
            £{pizza.price}
          </span>
        </div>
        <p style={{fontSize:'var(--tx-sm)', color:'var(--warm-gray)', lineHeight:1.5, flex:1}}>
          {pizza.description}
        </p>
        <div style={{display:'flex', gap:'var(--s2)', marginTop:'var(--s2)'}}>
          <Btn variant="primary" size="sm" onClick={() => onAdd(pizza)} full>Add to cart</Btn>
          <Btn variant="ghost" size="sm" onClick={() => onCustomize(pizza)}>Edit</Btn>
        </div>
      </div>
    </div>
  );
};

// ── MINI PIZZA SVG ───────────────────────────────────────────────
const MiniPizza = ({ sauceColor = '#B83018', pizzaId = '' }) => {
  const seeds = {margherita:[0,1,2], diavola:[0,2,4], funghi:[1,3,5],
    norma:[0,3], prosciutto:[1,4], marinara:[], bianca:[0,5], nduja:[2,3,4]};
  const tSeeds = seeds[pizzaId] || [0,1];
  const toppingPositions = [
    [105,95],[130,80],[80,115],[120,115],[95,130],[140,110],
  ].filter((_,i) => tSeeds.includes(i));

  return (
    <svg viewBox="0 0 220 220" width="140" height="140" style={{opacity:.92}}>
      <defs>
        <radialGradient id={`crust-${pizzaId}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#E8C870"/>
          <stop offset="100%" stopColor="#C4A040"/>
        </radialGradient>
        <radialGradient id={`sauce-${pizzaId}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={sauceColor} stopOpacity=".95"/>
          <stop offset="100%" stopColor={sauceColor} stopOpacity=".85"/>
        </radialGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="112" cy="118" rx="82" ry="78" fill="rgba(28,26,22,.12)"/>
      {/* Crust */}
      <circle cx="110" cy="110" r="82" fill={`url(#crust-${pizzaId})`}/>
      {/* Sauce */}
      <circle cx="110" cy="110" r="66" fill={`url(#sauce-${pizzaId})`}/>
      {/* Cheese blobs */}
      <ellipse cx="100" cy="98" rx="28" ry="24" fill="#F0E8C0" opacity=".88"/>
      <ellipse cx="126" cy="118" rx="22" ry="20" fill="#EEE5B8" opacity=".82"/>
      <ellipse cx="95" cy="126" rx="18" ry="16" fill="#F0E8C0" opacity=".84"/>
      {/* Toppings */}
      {toppingPositions.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="7" fill="rgba(28,26,22,.22)" opacity=".7"/>
      ))}
      {/* Crust rim highlight */}
      <circle cx="110" cy="110" r="82" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="4"/>
    </svg>
  );
};

// ── TOP NAV ──────────────────────────────────────────────────────
const TopNav = ({ nav }) => {
  const { screen, setScreen, cart, setCartOpen } = nav;
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const links = [
    { key:'home', label:'Home' },
    { key:'menu', label:'Menu' },
    { key:'builder', label:'Build Your Own' },
  ];
  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      background:'var(--cream)', borderBottom:'1px solid var(--border)',
      boxShadow:'var(--sh-sm)',
    }}>
      <div style={{
        maxWidth:1280, margin:'0 auto', padding:'0 var(--s6)',
        height:60, display:'flex', alignItems:'center', gap:'var(--s8)',
      }}>
        {/* Logo */}
        <button onClick={() => setScreen('home')} style={{
          fontFamily:'var(--fd)', fontSize:'var(--tx-xl)', fontWeight:600,
          letterSpacing:'.04em', color:'var(--charcoal)', whiteSpace:'nowrap',
          flexShrink:0,
        }}>
          Forno <span style={{color:'var(--red)'}}>&amp;</span> Slice
        </button>

        {/* Links */}
        <div style={{display:'flex', gap:'var(--s1)', flex:1}}>
          {links.map(l => (
            <button key={l.key} onClick={() => setScreen(l.key)} style={{
              fontSize:'var(--tx-sm)', fontWeight:500, padding:'6px 14px',
              borderRadius:'var(--r2)',
              color: screen === l.key ? 'var(--red)' : 'var(--warm-gray)',
              background: screen === l.key ? 'var(--red-pale)' : 'transparent',
              transition:'all var(--dur) var(--ease)',
            }}>{l.label}</button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{display:'flex', gap:'var(--s3)', alignItems:'center'}}>
          <button onClick={() => setScreen('kitchen')} style={{
            fontSize:'var(--tx-xs)', fontWeight:700, letterSpacing:'.08em',
            textTransform:'uppercase', color:'var(--warm-gray-lt)',
            padding:'6px 12px', border:'1px solid var(--border)',
            borderRadius:'var(--r2)',
          }}>Kitchen ↗</button>

          <button onClick={() => setCartOpen(true)} style={{
            position:'relative', display:'flex', alignItems:'center', gap:6,
            fontSize:'var(--tx-sm)', fontWeight:600, color:'var(--charcoal)',
            padding:'8px 14px', background:'var(--charcoal)',
            color:'var(--cream)', borderRadius:'var(--r2)',
          }}>
            <IcoBag />
            <span>Cart</span>
            {count > 0 && (
              <span style={{
                background:'var(--red)', color:'var(--cream)',
                borderRadius:'var(--r4)', padding:'1px 6px',
                fontSize:'var(--tx-xs)', fontWeight:700, lineHeight:1.5,
              }}>{count}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

// ── BOTTOM NAV (mobile) ──────────────────────────────────────────
const BottomNav = ({ nav }) => {
  const { screen, setScreen, cart, setCartOpen } = nav;
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const tabs = [
    { key:'home',    label:'Home',   Icon: IcoHome  },
    { key:'menu',    label:'Menu',   Icon: IcoMenu  },
    { key:'builder', label:'Build',  Icon: IcoPizza },
    { key:'cart',    label:'Cart',   Icon: IcoBag, action: () => setCartOpen(true), badge: count },
  ];
  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:100,
      background:'var(--cream)', borderTop:'1px solid var(--border)',
      display:'flex', paddingBottom:'env(safe-area-inset-bottom)',
    }}>
      {tabs.map(({ key, label, Icon, action, badge }) => (
        <button key={key} onClick={action || (() => setScreen(key))}
          style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            gap:3, padding:'10px 4px 8px', position:'relative',
            color: screen === key ? 'var(--red)' : 'var(--warm-gray)',
            fontSize:'var(--tx-xs)', fontWeight: screen === key ? 700 : 400,
            letterSpacing:'.04em', transition:'color var(--dur)',
          }}>
          <Icon />
          {label}
          {badge > 0 && (
            <span style={{
              position:'absolute', top:6, right:'calc(50% - 16px)',
              background:'var(--red)', color:'var(--cream)',
              borderRadius:'var(--r4)', padding:'1px 5px',
              fontSize:'10px', fontWeight:700, lineHeight:1.5,
            }}>{badge}</span>
          )}
        </button>
      ))}
    </div>
  );
};

// ── CART DRAWER ──────────────────────────────────────────────────
const CartDrawer = ({ nav }) => {
  const { cart, setCartOpen, updateQty, removeFromCart, setScreen } = nav;
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  const goCheckout = () => { setCartOpen(false); setScreen('checkout'); };

  return (
    <>
      {/* Backdrop */}
      <div onClick={() => setCartOpen(false)} style={{
        position:'fixed', inset:0, background:'rgba(28,26,22,.45)', zIndex:200,
        animation:'fadeIn var(--dur-s) var(--ease)',
      }}/>
      {/* Panel */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:'min(420px,100vw)',
        background:'var(--cream)', zIndex:201, display:'flex', flexDirection:'column',
        boxShadow:'-8px 0 40px rgba(28,26,22,.18)',
        animation:'slideInRight var(--dur-s) var(--ease-o)',
      }}>
        {/* Header */}
        <div style={{
          padding:'var(--s5) var(--s6)', borderBottom:'1px solid var(--border)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
        }}>
          <div>
            <div style={{fontSize:'var(--tx-xs)', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--warm-gray)'}}>
              Your Order
            </div>
            <div style={{fontFamily:'var(--fd)', fontSize:'var(--tx-2xl)', fontWeight:600, marginTop:2}}>
              {cart.length === 0 ? 'Empty' : `${cart.length} item${cart.length > 1 ? 's' : ''}`}
            </div>
          </div>
          <button onClick={() => setCartOpen(false)} style={{
            padding:'var(--s2)', borderRadius:'var(--r2)', color:'var(--warm-gray)',
            border:'1px solid var(--border)',
          }}><IcoClose /></button>
        </div>

        {/* Items */}
        <div style={{flex:1, overflowY:'auto', padding:'var(--s4) var(--s6)'}}>
          {cart.length === 0 ? (
            <div style={{textAlign:'center', padding:'var(--s16) 0', color:'var(--warm-gray)'}}>
              <div style={{fontFamily:'var(--fd)', fontSize:'var(--tx-3xl)', marginBottom:'var(--s3)'}}>
                Your cart is empty
              </div>
              <p style={{fontSize:'var(--tx-sm)'}}>Add something delicious from the menu.</p>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:'var(--s3)'}}>
              {cart.map(item => (
                <div key={item.id} style={{
                  display:'flex', gap:'var(--s4)', alignItems:'flex-start',
                  padding:'var(--s4)', background:'var(--cream-dk)',
                  borderRadius:'var(--r2)', border:'1px solid var(--border)',
                }}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'var(--fd)', fontSize:'var(--tx-lg)', fontWeight:600}}>
                      {item.name}
                    </div>
                    {item.note && (
                      <div style={{fontSize:'var(--tx-xs)', color:'var(--warm-gray)', marginTop:2}}>{item.note}</div>
                    )}
                    <div style={{color:'var(--red)', fontWeight:700, fontSize:'var(--tx-md)', marginTop:4}}>
                      £{(item.price * (item.qty || 1)).toFixed(2)}
                    </div>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'var(--s2)'}}>
                    <button onClick={() => updateQty(item.id, (item.qty||1) - 1)} style={{
                      width:28, height:28, borderRadius:'var(--r2)', border:'1px solid var(--border)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'var(--charcoal)',
                    }}><IcoMinus /></button>
                    <span style={{fontWeight:700, minWidth:20, textAlign:'center'}}>{item.qty || 1}</span>
                    <button onClick={() => updateQty(item.id, (item.qty||1) + 1)} style={{
                      width:28, height:28, borderRadius:'var(--r2)', border:'1px solid var(--border)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'var(--charcoal)',
                    }}><IcoPlus /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding:'var(--s5) var(--s6)',
            borderTop:'1px solid var(--border)',
          }}>
            <div style={{
              display:'flex', justifyContent:'space-between', marginBottom:'var(--s3)',
              fontSize:'var(--tx-sm)', color:'var(--warm-gray)',
            }}>
              <span>Subtotal</span><span>£{total.toFixed(2)}</span>
            </div>
            <div style={{
              display:'flex', justifyContent:'space-between', marginBottom:'var(--s5)',
              fontSize:'var(--tx-sm)', color:'var(--warm-gray)',
            }}>
              <span>Delivery</span><span>£2.50</span>
            </div>
            <div style={{
              display:'flex', justifyContent:'space-between', marginBottom:'var(--s5)',
              fontFamily:'var(--fd)', fontSize:'var(--tx-2xl)', fontWeight:700,
            }}>
              <span>Total</span><span>£{(total + 2.5).toFixed(2)}</span>
            </div>
            <Btn variant="primary" size="lg" full onClick={goCheckout}>
              Proceed to Checkout <IcoArrow />
            </Btn>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
      `}</style>
    </>
  );
};

// ── EYEBROW LABEL ────────────────────────────────────────────────
const Eyebrow = ({ children, color = 'var(--warm-gray)', style: s }) => (
  <div style={{
    fontFamily:'var(--fu)', fontSize:'var(--tx-xs)', fontWeight:700,
    letterSpacing:'.14em', textTransform:'uppercase', color,
    ...s,
  }}>{children}</div>
);

Object.assign(window, {
  Btn, Badge, PizzaCard, MiniPizza, TopNav, BottomNav, CartDrawer,
  Eyebrow, IcoBag, IcoHome, IcoMenu, IcoPizza, IcoClose,
  IcoPlus, IcoMinus, IcoArrow, IcoCheck,
});
