// ── MENU SCREEN ──────────────────────────────────────────────────
const { useState: useStateM, useRef: useRefM, useEffect: useEffectM } = React;

const CATEGORIES = [
  { key:'all',       label:'Everything' },
  { key:'classics',  label:'Classics'   },
  { key:'signature', label:'Signatures' },
];

const MenuScreen = ({ nav }) => {
  const { addToCart, setScreen } = nav;
  const [activeCategory, setActiveCategory] = useStateM('all');
  const [addedId, setAddedId] = useStateM(null);
  const menu = window.PIZZA_MENU || [];

  const filtered = activeCategory === 'all'
    ? menu
    : menu.filter(p => p.category === activeCategory);

  const featured = menu.find(p => p.featured);
  const rest = filtered.filter(p => !p.featured || activeCategory !== 'all');

  const handleAdd = (pizza) => {
    addToCart({ id: Date.now(), name: pizza.name, price: pizza.price, qty: 1,
      note: pizza.description.slice(0, 50) + '…' });
    setAddedId(pizza.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div style={{ paddingBottom: 100 }}>

      {/* ── PAGE HEADER ─────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--cream)',
        position: 'sticky', top: 60, zIndex: 90,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 var(--s6)' }}>
          {/* Title row */}
          <div style={{ padding: 'var(--s6) 0 var(--s4)' }}>
            <Eyebrow style={{ marginBottom: 'var(--s2)' }}>Forno &amp; Slice</Eyebrow>
            <h1 style={{
              fontFamily: 'var(--fd)', fontSize: 'var(--tx-4xl)',
              fontWeight: 700, lineHeight: 1,
            }}>The Menu</h1>
          </div>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 'var(--s1)', paddingBottom: 'var(--s4)' }}>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setActiveCategory(c.key)} style={{
                padding: '7px 18px', borderRadius: 'var(--r4)',
                fontSize: 'var(--tx-sm)', fontWeight: 600,
                background: activeCategory === c.key ? 'var(--charcoal)' : 'transparent',
                color: activeCategory === c.key ? 'var(--cream)' : 'var(--warm-gray)',
                border: `1.5px solid ${activeCategory === c.key ? 'var(--charcoal)' : 'var(--border)'}`,
                transition: 'all var(--dur) var(--ease)',
              }}>{c.label}</button>
            ))}
            <button onClick={() => setScreen('builder')} style={{
              padding: '7px 18px', borderRadius: 'var(--r4)',
              fontSize: 'var(--tx-sm)', fontWeight: 600,
              background: 'var(--red-pale)', color: 'var(--red)',
              border: '1.5px solid var(--red-pale)',
              marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              Build Your Own <IcoArrow />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--s10) var(--s6)' }}>

        {/* ── FEATURED CARD (full-width editorial) ────────── */}
        {activeCategory === 'all' && featured && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: 'var(--charcoal)', borderRadius: 'var(--r3)',
            overflow: 'hidden', marginBottom: 'var(--s10)',
            minHeight: 380,
          }}>
            {/* Left: illustration */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--charcoal-mid)', position: 'relative',
              padding: 'var(--s12)',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'repeating-linear-gradient(-45deg,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 36px)',
              }}/>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <svg viewBox="0 0 280 280" width="260" height="260"
                  style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,.5))' }}>
                  <defs>
                    <radialGradient id="fcrust" cx="38%" cy="33%">
                      <stop offset="0%" stopColor="#E8CA6C"/>
                      <stop offset="100%" stopColor="#C49838"/>
                    </radialGradient>
                  </defs>
                  <ellipse cx="142" cy="147" rx="108" ry="103" fill="rgba(0,0,0,.3)"/>
                  <circle cx="140" cy="140" r="108" fill="url(#fcrust)"/>
                  <circle cx="140" cy="140" r="90" fill="#B83018" opacity=".93"/>
                  <ellipse cx="126" cy="120" rx="32" ry="28" fill="#F0E0BC" opacity=".9"/>
                  <ellipse cx="158" cy="145" rx="26" ry="23" fill="#EED8B0" opacity=".84"/>
                  <ellipse cx="118" cy="155" rx="20" ry="18" fill="#F0E0BC" opacity=".86"/>
                  <circle cx="148" cy="122" r="8"  fill="#C02010" opacity=".82"/>
                  <circle cx="162" cy="138" r="6"  fill="#3A1808" opacity=".78"/>
                  <circle cx="130" cy="148" r="9"  fill="#C02010" opacity=".78"/>
                  <circle cx="155" cy="160" r="6"  fill="#3A1808" opacity=".7"/>
                  <circle cx="138" cy="132" r="4"  fill="#E8901A" opacity=".8"/>
                  <circle cx="140" cy="140" r="108" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="5"/>
                </svg>
              </div>
            </div>
            {/* Right: info */}
            <div style={{
              padding: 'var(--s12) var(--s10)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ marginBottom: 'var(--s3)' }}>
                <Badge label="house fave" />
              </div>
              <h2 style={{
                fontFamily: 'var(--fd)', fontSize: 'var(--tx-5xl)',
                fontWeight: 700, lineHeight: 1, color: 'var(--cream)',
                marginBottom: 'var(--s4)',
              }}>{featured.name}</h2>
              <p style={{
                fontSize: 'var(--tx-md)', color: 'var(--warm-gray-lt)',
                lineHeight: 1.7, marginBottom: 'var(--s8)', maxWidth: 360,
              }}>{featured.description}</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--s6)',
                marginBottom: 'var(--s8)',
              }}>
                <span style={{
                  fontFamily: 'var(--fd)', fontSize: 'var(--tx-4xl)',
                  fontWeight: 700, color: 'var(--amber)',
                }}>£{featured.price}</span>
                <span style={{ fontSize: 'var(--tx-xs)', color: 'var(--warm-gray-lt)', lineHeight: 1.5 }}>
                  Neapolitan base<br/>Wood-fired 90s
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--s3)' }}>
                <Btn variant="primary" size="lg"
                  onClick={() => handleAdd(featured)}>
                  {addedId === featured.id ? '✓ Added' : 'Add to cart'}
                </Btn>
                <Btn variant="ghost" size="lg"
                  style={{ borderColor: 'rgba(213,204,184,.25)', color: 'var(--cream)' }}
                  onClick={() => setScreen('builder')}>
                  Customise
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION HEADER ──────────────────────────────── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 'var(--s6)',
          paddingBottom: 'var(--s4)',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{
            fontFamily: 'var(--fd)', fontSize: 'var(--tx-2xl)', fontWeight: 600,
          }}>
            {activeCategory === 'all' ? 'All pizzas' :
             activeCategory === 'classics' ? 'The classics' : 'Signature pies'}
          </h2>
          <span style={{ fontSize: 'var(--tx-sm)', color: 'var(--warm-gray)' }}>
            {rest.length} on the menu
          </span>
        </div>

        {/* ── PIZZA GRID — editorial asymmetric layout ─────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--s5)',
        }}>
          {rest.map((pizza, i) => (
            <div key={pizza.id} style={{
              gridColumn: i === 0 ? 'span 2' : 'span 1',
            }}>
              <MenuPizzaRow pizza={pizza} large={i === 0}
                onAdd={() => handleAdd(pizza)}
                onCustomize={() => setScreen('builder')}
                added={addedId === pizza.id}
              />
            </div>
          ))}
        </div>

        {/* ── BUILD CTA STRIP ─────────────────────────────── */}
        <div style={{
          marginTop: 'var(--s12)',
          background: 'var(--cream-dk)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r3)',
          padding: 'var(--s8) var(--s10)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--fd)', fontSize: 'var(--tx-2xl)', fontWeight: 600,
            }}>Don't see exactly what you want?</div>
            <div style={{ fontSize: 'var(--tx-sm)', color: 'var(--warm-gray)', marginTop: 'var(--s2)' }}>
              Build your own from £12 — every ingredient à la carte.
            </div>
          </div>
          <Btn variant="dark" size="lg" onClick={() => setScreen('builder')}>
            Build Your Own <IcoArrow />
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ── MENU PIZZA ROW (list-style card) ─────────────────────────────
const MenuPizzaRow = ({ pizza, large, onAdd, onCustomize, added }) => {
  const [hover, setHover] = useStateM(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: large ? 'row' : 'column',
        background: 'var(--cream-dk)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r2)',
        overflow: 'hidden',
        boxShadow: hover ? 'var(--sh-lg)' : 'var(--sh-sm)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all var(--dur) var(--ease)',
        height: '100%',
      }}>
      {/* Illustration */}
      <div style={{
        background: 'var(--cream-dkr)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--s6)',
        minWidth: large ? 220 : 'auto',
        aspectRatio: large ? 'auto' : '4/3',
        position: 'relative',
      }}>
        <MiniPizza pizzaId={pizza.id}
          sauceColor={pizza.category === 'classics' ? '#B83018' : '#A02010'}
        />
        {pizza.badge && (
          <div style={{ position: 'absolute', top: 'var(--s3)', left: 'var(--s3)' }}>
            <Badge label={pizza.badge} />
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{
        flex: 1, padding: 'var(--s5)', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: 'var(--s3)', marginBottom: 'var(--s2)',
        }}>
          <h3 style={{
            fontFamily: 'var(--fd)',
            fontSize: large ? 'var(--tx-2xl)' : 'var(--tx-xl)',
            fontWeight: 600, lineHeight: 1.15,
          }}>{pizza.name}</h3>
          <span style={{
            fontFamily: 'var(--fd)',
            fontSize: large ? 'var(--tx-2xl)' : 'var(--tx-xl)',
            fontWeight: 700, color: 'var(--red)', whiteSpace: 'nowrap',
          }}>£{pizza.price}</span>
        </div>
        <p style={{
          fontSize: 'var(--tx-sm)', color: 'var(--warm-gray)',
          lineHeight: 1.6, flex: 1, marginBottom: 'var(--s4)',
        }}>{pizza.description}</p>
        <div style={{ display: 'flex', gap: 'var(--s2)' }}>
          <Btn variant={added ? 'secondary' : 'primary'} size="sm" onClick={onAdd}>
            {added ? <><IcoCheck /> Added</> : 'Add to cart'}
          </Btn>
          <Btn variant="ghost" size="sm" onClick={onCustomize}>Customise</Btn>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { MenuScreen });
