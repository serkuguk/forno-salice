// ── PIZZA BUILDER SCREEN ─────────────────────────────────────────
const { useState: useStateB, useMemo: useMemoB, useEffect: useEffectB } = React;

// ── LIVE PIZZA CANVAS (SVG) ──────────────────────────────────────
const PizzaCanvas = ({ base, sauce, cheese, toppings }) => {
  const crustColors = {
    neapolitan: ['#EAC96A','#C8A038'],
    roman:      ['#F0D878','#D4B44C'],
    sourdough:  ['#C8A048','#9E7830'],
    wholewheat: ['#B89050','#8A6830'],
  };
  const sauceProps = {
    san_marzano:{ fill:'#B83018', opacity:.93 },
    white:      { fill:'#EDE8D4', opacity:.95 },
    pesto:      { fill:'#3A5828', opacity:.88 },
    no_sauce:   { fill:'transparent', opacity:0 },
  };
  const cheeseProps = {
    fior:    '#F0E8C0',
    scamorza:'#E8D898',
    buffalo: '#F8F2E0',
    cashew:  '#DDD8A8',
    nocheese:null,
  };

  const [c0, c1] = crustColors[base] || crustColors.neapolitan;
  const sp = sauceProps[sauce] || sauceProps.san_marzano;
  const cp = cheeseProps[cheese];
  const hasCheese = cheese && cheese !== 'nocheese' && cp;

  // Topping rendering map
  const toppingRenders = {
    peppers:    () => <>
      <ellipse cx="148" cy="118" rx="7" ry="14" fill="#C83820" opacity=".88" transform="rotate(30 148 118)"/>
      <ellipse cx="172" cy="155" rx="7" ry="14" fill="#E04020" opacity=".82" transform="rotate(-20 172 155)"/>
      <ellipse cx="128" cy="158" rx="7" ry="14" fill="#C83820" opacity=".85" transform="rotate(50 128 158)"/>
    </>,
    mushroom:   () => <>
      <ellipse cx="152" cy="115" rx="10" ry="7" fill="#8A6840" opacity=".82"/>
      <rect x="148" y="115" width="8" height="8" rx="1" fill="#6A5030" opacity=".7"/>
      <ellipse cx="128" cy="155" rx="10" ry="7" fill="#8A6840" opacity=".78"/>
      <rect x="124" y="155" width="8" height="8" rx="1" fill="#6A5030" opacity=".65"/>
    </>,
    artichoke:  () => <>
      <polygon points="155,105 160,118 150,118" fill="#4A6830" opacity=".78"/>
      <polygon points="155,110 159,120 151,120" fill="#5A7840" opacity=".7"/>
      <polygon points="130,150 135,163 125,163" fill="#4A6830" opacity=".75"/>
    </>,
    onion:      () => <>
      <circle cx="145" cy="120" r="10" fill="none" stroke="#D4B070" strokeWidth="3" opacity=".82"/>
      <circle cx="168" cy="152" r="8"  fill="none" stroke="#D4B070" strokeWidth="2.5" opacity=".75"/>
      <circle cx="128" cy="158" r="7"  fill="none" stroke="#D4B070" strokeWidth="2" opacity=".7"/>
    </>,
    arugula:    () => <>
      <ellipse cx="138" cy="118" rx="8" ry="5" fill="#3A5820" opacity=".82" transform="rotate(-30 138 118)"/>
      <ellipse cx="162" cy="142" rx="7" ry="4" fill="#4A6830" opacity=".75" transform="rotate(20 162 142)"/>
      <ellipse cx="145" cy="165" rx="8" ry="5" fill="#3A5820" opacity=".78" transform="rotate(10 145 165)"/>
      <ellipse cx="118" cy="148" rx="6" ry="4" fill="#4A6830" opacity=".7" transform="rotate(-15 118 148)"/>
    </>,
    olives:     () => <>
      <circle cx="150" cy="115" r="6" fill="#1C2810" opacity=".85"/>
      <circle cx="150" cy="115" r="2.5" fill="#E8C060" opacity=".7"/>
      <circle cx="130" cy="152" r="6" fill="#1C2810" opacity=".8"/>
      <circle cx="130" cy="152" r="2.5" fill="#E8C060" opacity=".65"/>
      <circle cx="165" cy="158" r="5" fill="#1C2810" opacity=".78"/>
    </>,
    guanciale:  () => <>
      <rect x="135" y="108" width="16" height="10" rx="2" fill="#E8A8A0" opacity=".85"/>
      <rect x="155" y="148" width="14" height="10" rx="2" fill="#D89090" opacity=".8"/>
      <rect x="122" y="152" width="16" height="10" rx="2" fill="#E8A8A0" opacity=".82"/>
    </>,
    nduja_t:    () => <>
      <circle cx="148" cy="118" r="9"  fill="#A81808" opacity=".88"/>
      <circle cx="168" cy="148" r="8"  fill="#B82010" opacity=".82"/>
      <circle cx="128" cy="158" r="10" fill="#A81808" opacity=".85"/>
    </>,
    prosciutto_t:() => <>
      <ellipse cx="145" cy="118" rx="14" ry="9" fill="#E09898" opacity=".82" transform="rotate(-15 145 118)"/>
      <ellipse cx="165" cy="152" rx="12" ry="8" fill="#D08888" opacity=".75" transform="rotate(10 165 152)"/>
    </>,
    chicken:    () => <>
      <ellipse cx="148" cy="118" rx="12" ry="8" fill="#E8C898" opacity=".85" transform="rotate(-20 148 118)"/>
      <ellipse cx="130" cy="155" rx="10" ry="7" fill="#D8B888" opacity=".78" transform="rotate(15 130 155)"/>
      <ellipse cx="163" cy="155" rx="11" ry="7" fill="#E8C898" opacity=".8" transform="rotate(-10 163 155)"/>
    </>,
    anchovies:  () => <>
      <ellipse cx="145" cy="115" rx="14" ry="4" fill="#8A7060" opacity=".82" transform="rotate(25 145 115)"/>
      <ellipse cx="165" cy="148" rx="14" ry="4" fill="#7A6050" opacity=".75" transform="rotate(-30 165 148)"/>
      <ellipse cx="125" cy="155" rx="12" ry="4" fill="#8A7060" opacity=".78" transform="rotate(10 125 155)"/>
    </>,
    basil:      () => <>
      <ellipse cx="140" cy="118" rx="9" ry="6"  fill="#2A5018" opacity=".88" transform="rotate(-15 140 118)"/>
      <ellipse cx="165" cy="145" rx="8" ry="5"  fill="#386028" opacity=".82" transform="rotate(25 165 145)"/>
      <ellipse cx="130" cy="160" rx="9" ry="6"  fill="#2A5018" opacity=".85" transform="rotate(5 130 160)"/>
    </>,
    chili_honey:() => <>
      <circle cx="143" cy="120" r="4" fill="#E8A020" opacity=".88"/>
      <circle cx="158" cy="148" r="4" fill="#E8A020" opacity=".82"/>
      <circle cx="132" cy="155" r="3.5" fill="#C08010" opacity=".8"/>
      <circle cx="165" cy="158" r="3"   fill="#E8A020" opacity=".75"/>
    </>,
    truffle:    () => <>
      <circle cx="148" cy="118" r="6"  fill="#2A2018" opacity=".78"/>
      <circle cx="168" cy="148" r="5"  fill="#1C1810" opacity=".72"/>
      <circle cx="130" cy="155" r="7"  fill="#2A2018" opacity=".75"/>
      <circle cx="158" cy="162" r="4"  fill="#1C1810" opacity=".68"/>
    </>,
    lemon:      () => <>
      <circle cx="145" cy="118" r="5"  fill="#F0E040" opacity=".78"/>
      <circle cx="162" cy="150" r="4"  fill="#F0E040" opacity=".72"/>
      <circle cx="130" cy="158" r="5"  fill="#F0E040" opacity=".75"/>
    </>,
    sea_salt:   () => <>
      {[[143,115],[158,130],[140,148],[162,158],[128,162],[152,168]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#F5F0E0" opacity=".85"/>
      ))}
    </>,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--s8)' }}>
      <svg viewBox="0 0 280 280" width="100%" style={{ maxWidth: 340, filter: 'drop-shadow(0 12px 40px rgba(28,26,22,.2))' }}>
        <defs>
          <radialGradient id="bld-crust" cx="38%" cy="33%">
            <stop offset="0%" stopColor={c0}/>
            <stop offset="100%" stopColor={c1}/>
          </radialGradient>
        </defs>
        {/* Shadow */}
        <ellipse cx="142" cy="148" rx="112" ry="107" fill="rgba(28,26,22,.15)"/>
        {/* Crust */}
        <circle cx="140" cy="140" r="112" fill="url(#bld-crust)"/>
        {/* Sauce */}
        {sauce !== 'no_sauce' && (
          <circle cx="140" cy="140" r="92" fill={sp.fill} opacity={sp.opacity}/>
        )}
        {/* Cheese */}
        {hasCheese && <>
          <ellipse cx="126" cy="122" rx="30" ry="26" fill={cp} opacity=".88"/>
          <ellipse cx="158" cy="148" rx="25" ry="22" fill={cp} opacity=".82"/>
          <ellipse cx="118" cy="154" rx="20" ry="17" fill={cp} opacity=".85"/>
          <ellipse cx="152" cy="122" rx="16" ry="13" fill={cp} opacity=".78"/>
        </>}
        {/* Toppings */}
        {toppings.map(t => {
          const render = toppingRenders[t];
          return render ? <g key={t}>{render()}</g> : null;
        })}
        {/* Crust rim */}
        <circle cx="140" cy="140" r="112" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="4"/>
        {/* Char spots */}
        {[{cx:88,cy:68},{cx:192,cy:72},{cx:205,cy:190},{cx:78,cy:192}].map((s,i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r="5" fill="rgba(28,20,8,.3)" opacity=".6"/>
        ))}
      </svg>
    </div>
  );
};

// ── OPTION CHIP ──────────────────────────────────────────────────
const OptionChip = ({ option, selected, onToggle, radio }) => (
  <button onClick={() => onToggle(option.id)} style={{
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
    padding: 'var(--s3) var(--s4)',
    background: selected ? 'var(--charcoal)' : 'var(--cream)',
    color: selected ? 'var(--cream)' : 'var(--charcoal)',
    border: `1.5px solid ${selected ? 'var(--charcoal)' : 'var(--border)'}`,
    borderRadius: 'var(--r2)',
    transition: 'all var(--dur) var(--ease)',
    textAlign: 'left', cursor: 'pointer',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 'var(--s3)' }}>
      <span style={{ fontWeight: 600, fontSize: 'var(--tx-sm)' }}>{option.label}</span>
      {option.extra ? (
        <span style={{ fontSize: 'var(--tx-xs)', color: selected ? 'var(--amber-lt)' : 'var(--amber)', fontWeight: 700 }}>
          +£{option.extra.toFixed(2)}
        </span>
      ) : null}
    </div>
    {option.desc && (
      <span style={{ fontSize: 'var(--tx-xs)', opacity: .7, marginTop: 2 }}>{option.desc}</span>
    )}
  </button>
);

// ── BUILDER SECTION ──────────────────────────────────────────────
const BuilderSection = ({ num, title, children, open, onToggle }) => (
  <div style={{ borderBottom: '1px solid var(--border)' }}>
    <button onClick={onToggle} style={{
      width: '100%', padding: 'var(--s4) var(--s5)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'none', textAlign: 'left',
    }}>
      <div style={{ display: 'flex', gap: 'var(--s3)', alignItems: 'center' }}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          background: open ? 'var(--red)' : 'var(--cream-dkr)',
          color: open ? 'var(--cream)' : 'var(--warm-gray)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'var(--tx-xs)', fontWeight: 700, flexShrink: 0,
        }}>{num}</span>
        <span style={{ fontWeight: 600, fontSize: 'var(--tx-md)' }}>{title}</span>
      </div>
      <span style={{
        fontSize: 'var(--tx-xl)', color: 'var(--warm-gray)',
        transform: open ? 'rotate(45deg)' : 'none',
        transition: 'transform var(--dur)',
        lineHeight: 1,
      }}>+</span>
    </button>
    {open && <div style={{ padding: 'var(--s2) var(--s5) var(--s5)' }}>{children}</div>}
  </div>
);

// ── BUILDER SCREEN ───────────────────────────────────────────────
const BuilderScreen = ({ nav }) => {
  const { addToCart, setScreen, setCartOpen } = nav;
  const opts = window.BUILDER_OPTIONS;

  const [base, setBase]       = useStateB('neapolitan');
  const [sauce, setSauce]     = useStateB('san_marzano');
  const [cheese, setCheese]   = useStateB('fior');
  const [toppings, setToppings] = useStateB([]);
  const [openSection, setOpenSection] = useStateB('base');

  const price = useMemoB(
    () => window.calcBuilderPrice(base, sauce, cheese, toppings),
    [base, sauce, cheese, toppings]
  );

  const toggleTopping = (id) => {
    setToppings(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const selectedLabels = [
    opts.bases.find(b => b.id === base)?.label,
    opts.sauces.find(s => s.id === sauce)?.label,
    opts.cheeses.find(c => c.id === cheese)?.label,
    ...Object.values(opts.toppings).flat().filter(t => toppings.includes(t.id)).map(t => t.label),
  ].filter(Boolean);

  const handleAdd = () => {
    addToCart({
      id: Date.now(),
      name: 'Build Your Own',
      price,
      qty: 1,
      note: selectedLabels.slice(0,3).join(' · ') + (selectedLabels.length > 3 ? ` +${selectedLabels.length-3}` : ''),
    });
    setCartOpen(true);
  };

  const sections = [
    {
      key: 'base', num: 1, title: 'Base',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
          {opts.bases.map(o => (
            <OptionChip key={o.id} option={o} selected={base === o.id}
              onToggle={() => setBase(o.id)} radio />
          ))}
        </div>
      ),
    },
    {
      key: 'sauce', num: 2, title: 'Sauce',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
          {opts.sauces.map(o => (
            <OptionChip key={o.id} option={o} selected={sauce === o.id}
              onToggle={() => setSauce(o.id)} radio />
          ))}
        </div>
      ),
    },
    {
      key: 'cheese', num: 3, title: 'Cheese',
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
          {opts.cheeses.map(o => (
            <OptionChip key={o.id} option={o} selected={cheese === o.id}
              onToggle={() => setCheese(o.id)} radio />
          ))}
        </div>
      ),
    },
    {
      key: 'toppings', num: 4, title: `Toppings${toppings.length ? ` (${toppings.length})` : ''}`,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>
          {Object.entries(opts.toppings).map(([group, items]) => (
            <div key={group}>
              <div style={{
                fontSize: 'var(--tx-xs)', fontWeight: 700, letterSpacing: '.1em',
                textTransform: 'uppercase', color: 'var(--warm-gray)',
                marginBottom: 'var(--s2)',
              }}>{group}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s2)' }}>
                {items.map(o => (
                  <OptionChip key={o.id} option={o} selected={toppings.includes(o.id)}
                    onToggle={toggleTopping} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 60px)', paddingBottom: 90 }}>
      {/* Back link */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        padding: 'var(--s4) var(--s6)',
      }}>
        <button onClick={() => setScreen('menu')} style={{
          fontSize: 'var(--tx-sm)', color: 'var(--warm-gray)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ← Back to menu
        </button>
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        padding: '0 var(--s6)',
        display: 'grid', gridTemplateColumns: '1fr 420px',
        gap: 'var(--s10)', flex: 1,
        alignItems: 'start',
      }}>

        {/* LEFT — pizza canvas + current build */}
        <div style={{ position: 'sticky', top: 80 }}>
          <Eyebrow style={{ marginBottom: 'var(--s3)' }}>The Workbench</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'var(--tx-4xl)',
            fontWeight: 700, lineHeight: 1, marginBottom: 'var(--s6)',
          }}>Build Your Pizza</h1>

          <div style={{
            background: 'var(--cream-dk)', borderRadius: 'var(--r3)',
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <PizzaCanvas base={base} sauce={sauce} cheese={cheese} toppings={toppings} />

            {/* Selected ingredients */}
            <div style={{
              padding: 'var(--s5)', borderTop: '1px solid var(--border)',
            }}>
              <div style={{
                fontSize: 'var(--tx-xs)', fontWeight: 700, letterSpacing: '.1em',
                textTransform: 'uppercase', color: 'var(--warm-gray)',
                marginBottom: 'var(--s3)',
              }}>Your build</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s2)' }}>
                {selectedLabels.map(label => (
                  <span key={label} style={{
                    padding: '4px 10px', borderRadius: 'var(--r4)',
                    background: 'var(--charcoal)', color: 'var(--cream)',
                    fontSize: 'var(--tx-xs)', fontWeight: 600,
                  }}>{label}</span>
                ))}
                {selectedLabels.length === 0 && (
                  <span style={{ fontSize: 'var(--tx-sm)', color: 'var(--warm-gray-lt)', fontStyle: 'italic' }}>
                    Start choosing above →
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div style={{
            marginTop: 'var(--s5)', padding: 'var(--s5)',
            background: 'var(--cream-dk)', borderRadius: 'var(--r2)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontSize: 'var(--tx-sm)', color: 'var(--warm-gray)',
              paddingBottom: 'var(--s3)', marginBottom: 'var(--s3)',
              borderBottom: '1px solid var(--border)',
            }}>
              <span>Base price</span><span>£{window.BASE_PIZZA_PRICE}.00</span>
            </div>
            {toppings.length > 0 && Object.values(opts.toppings).flat()
              .filter(t => toppings.includes(t.id) && t.extra)
              .map(t => (
                <div key={t.id} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 'var(--tx-xs)', color: 'var(--warm-gray)',
                  marginBottom: 4,
                }}>
                  <span>{t.label}</span><span>+£{t.extra.toFixed(2)}</span>
                </div>
              ))
            }
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--fd)', fontSize: 'var(--tx-2xl)', fontWeight: 700,
              marginTop: 'var(--s3)', paddingTop: 'var(--s3)',
              borderTop: '1px solid var(--border)', color: 'var(--red)',
            }}>
              <span>Total</span><span>£{price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT — builder controls */}
        <div style={{
          background: 'var(--cream-dk)', borderRadius: 'var(--r3)',
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          <div style={{
            padding: 'var(--s5) var(--s5)',
            borderBottom: '1px solid var(--border)',
            background: 'var(--charcoal)',
          }}>
            <div style={{
              fontSize: 'var(--tx-xs)', fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--warm-gray-lt)',
              marginBottom: 4,
            }}>Choose your</div>
            <div style={{
              fontFamily: 'var(--fd)', fontSize: 'var(--tx-2xl)',
              fontWeight: 600, color: 'var(--cream)',
            }}>Ingredients</div>
          </div>

          {sections.map(s => (
            <BuilderSection key={s.key} num={s.num} title={s.title}
              open={openSection === s.key}
              onToggle={() => setOpenSection(openSection === s.key ? null : s.key)}>
              {s.content}
            </BuilderSection>
          ))}

          <div style={{ padding: 'var(--s5)' }}>
            <Btn variant="primary" size="xl" full onClick={handleAdd}>
              Add to cart — £{price.toFixed(2)}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BuilderScreen, PizzaCanvas });
