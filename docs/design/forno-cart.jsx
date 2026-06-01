// ── CART + CHECKOUT SCREENS ──────────────────────────────────────
const { useState: useStateC } = React;

// ── CART SCREEN ──────────────────────────────────────────────────
const CartScreen = ({ nav }) => {
  const { cart, updateQty, removeFromCart, setScreen } = nav;
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const delivery = 2.50;
  const total = subtotal + delivery;

  if (cart.length === 0) return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', minHeight:'60vh', gap:'var(--s6)',
      textAlign:'center', padding:'var(--s12)',
    }}>
      <div style={{ fontFamily:'var(--fd)', fontSize:'var(--tx-4xl)', fontWeight:600 }}>
        Your cart is empty
      </div>
      <p style={{ color:'var(--warm-gray)', fontSize:'var(--tx-md)', maxWidth:320 }}>
        Head to the menu and add something delicious.
      </p>
      <Btn variant="primary" size="lg" onClick={() => setScreen('menu')}>
        Browse the menu <IcoArrow />
      </Btn>
    </div>
  );

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'var(--s10) var(--s6) 120px' }}>
      <Eyebrow style={{marginBottom:'var(--s3)'}}>Your order</Eyebrow>
      <h1 style={{fontFamily:'var(--fd)',fontSize:'var(--tx-4xl)',fontWeight:700,marginBottom:'var(--s10)'}}>
        Cart
      </h1>

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'var(--s10)',alignItems:'start'}}>
        {/* Items */}
        <div style={{display:'flex',flexDirection:'column',gap:'var(--s3)'}}>
          {cart.map(item => (
            <div key={item.id} style={{
              display:'flex', gap:'var(--s5)', alignItems:'flex-start',
              padding:'var(--s5)', background:'var(--cream-dk)',
              border:'1px solid var(--border)', borderRadius:'var(--r2)',
            }}>
              {/* Mini pizza */}
              <div style={{
                width:72, height:72, borderRadius:'var(--r2)',
                background:'var(--cream-dkr)', flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
              }}>
                <svg viewBox="0 0 120 120" width="72" height="72">
                  <defs>
                    <radialGradient id={`cc-${item.id}`} cx="38%" cy="33%">
                      <stop offset="0%" stopColor="#EAC96A"/>
                      <stop offset="100%" stopColor="#C8A038"/>
                    </radialGradient>
                  </defs>
                  <circle cx="60" cy="60" r="54" fill={`url(#cc-${item.id})`}/>
                  <circle cx="60" cy="60" r="43" fill="#B83018" opacity=".9"/>
                  <ellipse cx="53" cy="52" rx="14" ry="12" fill="#F0E8BC" opacity=".88"/>
                  <ellipse cx="68" cy="65" rx="11" ry="10" fill="#EEE4B0" opacity=".82"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-xl)',fontWeight:600}}>
                  {item.name}
                </div>
                {item.note && (
                  <div style={{fontSize:'var(--tx-xs)',color:'var(--warm-gray)',marginTop:2,lineHeight:1.5}}>
                    {item.note}
                  </div>
                )}
                <div style={{color:'var(--red)',fontWeight:700,fontSize:'var(--tx-lg)',marginTop:4,fontFamily:'var(--fd)'}}>
                  £{(item.price * (item.qty||1)).toFixed(2)}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'var(--s3)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'var(--s2)',
                  border:'1px solid var(--border)',borderRadius:'var(--r2)',overflow:'hidden'}}>
                  <button onClick={() => updateQty(item.id,(item.qty||1)-1)} style={{
                    padding:'6px 10px',color:'var(--warm-gray)',
                    borderRight:'1px solid var(--border)',
                  }}><IcoMinus /></button>
                  <span style={{padding:'6px 12px',fontWeight:700,fontSize:'var(--tx-sm)'}}>
                    {item.qty||1}
                  </span>
                  <button onClick={() => updateQty(item.id,(item.qty||1)+1)} style={{
                    padding:'6px 10px',color:'var(--warm-gray)',
                    borderLeft:'1px solid var(--border)',
                  }}><IcoPlus /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{
                  fontSize:'var(--tx-xs)',color:'var(--warm-gray-lt)',
                  textDecoration:'underline',textUnderlineOffset:2,
                }}>Remove</button>
              </div>
            </div>
          ))}
          <button onClick={() => setScreen('menu')} style={{
            padding:'var(--s4)',border:'1.5px dashed var(--border)',
            borderRadius:'var(--r2)',fontSize:'var(--tx-sm)',
            color:'var(--warm-gray)',display:'flex',alignItems:'center',
            justifyContent:'center',gap:8,
          }}>
            <IcoPlus /> Add more items
          </button>
        </div>

        {/* Summary */}
        <div style={{
          background:'var(--cream-dk)',border:'1px solid var(--border)',
          borderRadius:'var(--r3)',overflow:'hidden',position:'sticky',top:80,
        }}>
          <div style={{padding:'var(--s5)',borderBottom:'1px solid var(--border)',background:'var(--charcoal)'}}>
            <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-2xl)',fontWeight:600,color:'var(--cream)'}}>
              Order summary
            </div>
          </div>
          <div style={{padding:'var(--s5)',display:'flex',flexDirection:'column',gap:'var(--s3)'}}>
            {cart.map(item => (
              <div key={item.id} style={{
                display:'flex',justifyContent:'space-between',
                fontSize:'var(--tx-sm)',color:'var(--warm-gray)',
              }}>
                <span>{item.name} ×{item.qty||1}</span>
                <span>£{(item.price*(item.qty||1)).toFixed(2)}</span>
              </div>
            ))}
            <div style={{height:1,background:'var(--border)',margin:'var(--s2) 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--tx-sm)',color:'var(--warm-gray)'}}>
              <span>Delivery</span><span>£{delivery.toFixed(2)}</span>
            </div>
            <div style={{
              display:'flex',justifyContent:'space-between',
              fontFamily:'var(--fd)',fontSize:'var(--tx-2xl)',fontWeight:700,
              paddingTop:'var(--s3)',borderTop:'1px solid var(--border)',
            }}>
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
            <Btn variant="primary" size="lg" full onClick={() => setScreen('checkout')}
              style={{marginTop:'var(--s2)'}}>
              Proceed to Checkout <IcoArrow />
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── CHECKOUT SCREEN ──────────────────────────────────────────────
const CheckoutScreen = ({ nav }) => {
  const { cart, setScreen, setCart, setOrderPlaced } = nav;
  const [mode, setMode] = useStateC('delivery'); // 'delivery' | 'collection'
  const [step, setStep] = useStateC(1); // 1: details, 2: payment, 3: confirm
  const [form, setForm] = useStateC({
    name:'', email:'', phone:'', address:'', postcode:'',
    card:'', expiry:'', cvv:'',
  });

  const subtotal = cart.reduce((s,i) => s + i.price*(i.qty||1), 0);
  const delivery = mode === 'delivery' ? 2.50 : 0;
  const total    = subtotal + delivery;

  const update = (k, v) => setForm(f => ({...f, [k]:v}));

  const placeOrder = () => {
    setOrderPlaced && setOrderPlaced(true);
    nav.clearCart && nav.clearCart();
    setScreen('tracking');
  };

  const inputStyle = {
    width:'100%', padding:'10px 14px',
    background:'var(--cream)', border:'1.5px solid var(--border)',
    borderRadius:'var(--r2)', fontSize:'var(--tx-base)',
    outline:'none', color:'var(--charcoal)',
  };
  const labelStyle = {
    display:'block', fontSize:'var(--tx-xs)', fontWeight:700,
    letterSpacing:'.08em', textTransform:'uppercase',
    color:'var(--warm-gray)', marginBottom:'var(--s2)',
  };
  const fieldGroup = (label, key, placeholder, half) => (
    <div style={{gridColumn: half ? 'span 1' : 'span 2'}}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={form[key]}
        onChange={e => update(key, e.target.value)}
        placeholder={placeholder}/>
    </div>
  );

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'var(--s10) var(--s6) 120px'}}>
      {/* Header */}
      <button onClick={() => setScreen('cart')} style={{
        fontSize:'var(--tx-sm)',color:'var(--warm-gray)',
        display:'flex',alignItems:'center',gap:6,marginBottom:'var(--s8)',
      }}>← Back to cart</button>

      <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:'var(--s10)',alignItems:'start'}}>
        {/* Form */}
        <div>
          {/* Delivery toggle */}
          <div style={{
            display:'flex',background:'var(--cream-dk)',
            border:'1px solid var(--border)',borderRadius:'var(--r2)',
            padding:'var(--s1)',marginBottom:'var(--s8)',
          }}>
            {['delivery','collection'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex:1,padding:'10px',borderRadius:'var(--r1)',
                background: mode===m ? 'var(--charcoal)' : 'transparent',
                color: mode===m ? 'var(--cream)' : 'var(--warm-gray)',
                fontWeight:600,fontSize:'var(--tx-sm)',textTransform:'capitalize',
                transition:'all var(--dur)',
              }}>{m}</button>
            ))}
          </div>

          {/* Steps indicator */}
          <div style={{display:'flex',gap:'var(--s2)',marginBottom:'var(--s8)'}}>
            {['Your details','Payment','Confirm'].map((label,i) => (
              <div key={i} style={{flex:1}}>
                <div style={{
                  height:3,borderRadius:2,marginBottom:'var(--s2)',
                  background: i+1 <= step ? 'var(--red)' : 'var(--border)',
                  transition:'background var(--dur)',
                }}/>
                <div style={{
                  fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.06em',
                  color: i+1 <= step ? 'var(--charcoal)' : 'var(--warm-gray-lt)',
                  textTransform:'uppercase',
                }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Step 1 — Details */}
          {step === 1 && (
            <div style={{display:'flex',flexDirection:'column',gap:'var(--s5)'}}>
              <h2 style={{fontFamily:'var(--fd)',fontSize:'var(--tx-3xl)',fontWeight:600,marginBottom:'var(--s2)'}}>
                Contact details
              </h2>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s4)'}}>
                {fieldGroup('Full name','name','Jane Smith',false)}
                {fieldGroup('Email','email','jane@example.com',true)}
                {fieldGroup('Phone','phone','+44 7700 000000',true)}
                {mode==='delivery' && fieldGroup('Delivery address','address','12 Brick Lane',false)}
                {mode==='delivery' && fieldGroup('Postcode','postcode','E1 6RF',true)}
              </div>
              <Btn variant="primary" size="lg" onClick={() => setStep(2)}
                style={{alignSelf:'flex-start'}}>
                Continue to payment <IcoArrow />
              </Btn>
            </div>
          )}

          {/* Step 2 — Payment */}
          {step === 2 && (
            <div style={{display:'flex',flexDirection:'column',gap:'var(--s5)'}}>
              <h2 style={{fontFamily:'var(--fd)',fontSize:'var(--tx-3xl)',fontWeight:600,marginBottom:'var(--s2)'}}>
                Payment
              </h2>
              <div style={{
                background:'var(--cream-dk)',border:'1px solid var(--border)',
                borderRadius:'var(--r2)',padding:'var(--s5)',
              }}>
                <div style={{
                  fontSize:'var(--tx-xs)',fontWeight:700,letterSpacing:'.08em',
                  textTransform:'uppercase',color:'var(--warm-gray)',marginBottom:'var(--s4)',
                }}>Card details</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--s4)'}}>
                  <div style={{gridColumn:'span 2'}}>
                    <label style={labelStyle}>Card number</label>
                    <input style={inputStyle} value={form.card}
                      onChange={e=>update('card',e.target.value)}
                      placeholder="4242 4242 4242 4242" maxLength={19}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Expiry</label>
                    <input style={inputStyle} value={form.expiry}
                      onChange={e=>update('expiry',e.target.value)} placeholder="MM/YY" maxLength={5}/>
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input style={inputStyle} value={form.cvv}
                      onChange={e=>update('cvv',e.target.value)} placeholder="123" maxLength={3}/>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:'var(--s3)'}}>
                <Btn variant="ghost" size="lg" onClick={() => setStep(1)}>Back</Btn>
                <Btn variant="primary" size="lg" onClick={() => setStep(3)}>
                  Review order <IcoArrow />
                </Btn>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <div style={{display:'flex',flexDirection:'column',gap:'var(--s5)'}}>
              <h2 style={{fontFamily:'var(--fd)',fontSize:'var(--tx-3xl)',fontWeight:600,marginBottom:'var(--s2)'}}>
                Confirm order
              </h2>
              <div style={{
                background:'var(--olive-pale)',border:'1px solid var(--olive-pale)',
                borderRadius:'var(--r2)',padding:'var(--s5)',
              }}>
                <div style={{fontWeight:700,color:'var(--olive)',marginBottom:'var(--s2)'}}>
                  Everything looks good?
                </div>
                <div style={{fontSize:'var(--tx-sm)',color:'var(--olive-lt)'}}>
                  {mode === 'delivery'
                    ? `Delivering to ${form.address || 'your address'} — est. 30–40 min`
                    : 'Collection from Forno & Slice, Shoreditch — est. 15–20 min'}
                </div>
              </div>
              <div style={{display:'flex',gap:'var(--s3)'}}>
                <Btn variant="ghost" size="lg" onClick={() => setStep(2)}>Back</Btn>
                <Btn variant="primary" size="xl" onClick={placeOrder}>
                  Place order — £{total.toFixed(2)}
                </Btn>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div style={{
          background:'var(--cream-dk)',border:'1px solid var(--border)',
          borderRadius:'var(--r3)',overflow:'hidden',position:'sticky',top:80,
        }}>
          <div style={{padding:'var(--s5)',borderBottom:'1px solid var(--border)',background:'var(--charcoal)'}}>
            <div style={{fontFamily:'var(--fd)',fontSize:'var(--tx-xl)',fontWeight:600,color:'var(--cream)'}}>
              Order summary
            </div>
          </div>
          <div style={{padding:'var(--s5)',display:'flex',flexDirection:'column',gap:'var(--s3)'}}>
            {cart.map(item => (
              <div key={item.id} style={{
                display:'flex',justifyContent:'space-between',
                fontSize:'var(--tx-sm)',color:'var(--warm-gray)',
              }}>
                <span style={{flex:1}}>{item.name} ×{item.qty||1}</span>
                <span>£{(item.price*(item.qty||1)).toFixed(2)}</span>
              </div>
            ))}
            <div style={{height:1,background:'var(--border)',margin:'var(--s2) 0'}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--tx-sm)',color:'var(--warm-gray)'}}>
              <span>{mode==='delivery'?'Delivery':'Collection'}</span>
              <span>{mode==='delivery'?`£${delivery.toFixed(2)}`:'Free'}</span>
            </div>
            <div style={{
              display:'flex',justifyContent:'space-between',
              fontFamily:'var(--fd)',fontSize:'var(--tx-2xl)',fontWeight:700,
              paddingTop:'var(--s3)',borderTop:'1px solid var(--border)',
            }}>
              <span>Total</span><span>£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CartScreen, CheckoutScreen });
