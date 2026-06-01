// ── MENU DATA ────────────────────────────────────────────────────
const PIZZA_MENU = [
  { id:'margherita',  name:'La Margherita',      price:14, category:'classics',  badge:null,        featured:false,
    description:'San Marzano, fior di latte, fresh basil, extra virgin olive oil' },
  { id:'diavola',     name:'Diavola',             price:17, category:'signature', badge:'house fave', featured:true,
    description:"Calabrian nduja, crushed tomato, smoked scamorza, chili honey" },
  { id:'funghi',      name:'Funghi & Truffle',    price:19, category:'signature', badge:'seasonal',   featured:false,
    description:'Wild forest mushrooms, white cream, taleggio, truffle oil finish' },
  { id:'norma',       name:'Alla Norma',          price:16, category:'classics',  badge:null,        featured:false,
    description:'Roasted aubergine, San Marzano, ricotta salata, fresh basil' },
  { id:'prosciutto',  name:'Prosciutto e Fichi',  price:21, category:'signature', badge:'new',        featured:false,
    description:'San Daniele prosciutto, fig compote, gorgonzola, walnut, rocket' },
  { id:'marinara',    name:'Marinara',            price:11, category:'classics',  badge:'vegan',      featured:false,
    description:'San Marzano, garlic confit, dried oregano, olive oil — no cheese' },
  { id:'bianca',      name:'Bianca al Limone',    price:16, category:'classics',  badge:null,        featured:false,
    description:'White cream, fior di latte, preserved lemon, capers, sea salt flakes' },
  { id:'nduja',       name:"N'Duja & Honey",      price:20, category:'signature', badge:'spicy',      featured:false,
    description:"'Nduja sausage, burrata, roasted peppers, Calabrian chili honey" },
];

// ── BUILDER OPTIONS ──────────────────────────────────────────────
const BUILDER_OPTIONS = {
  bases: [
    { id:'neapolitan', label:'Neapolitan', desc:'Thin, pillowy crust' },
    { id:'roman',      label:'Roman',      desc:'Crispy & airy' },
    { id:'sourdough',  label:'Sourdough',  desc:'48h slow ferment', extra:2 },
    { id:'wholewheat', label:'Whole Wheat',desc:'Nutty, hearty' },
  ],
  sauces: [
    { id:'san_marzano', label:'San Marzano',  desc:'Classic crushed tomato' },
    { id:'white',       label:'White Cream',  desc:'Béchamel base' },
    { id:'pesto',       label:'Basil Pesto',  desc:'Fresh Genovese', extra:1 },
    { id:'no_sauce',    label:'No Sauce',     desc:'Just olive oil' },
  ],
  cheeses: [
    { id:'fior',     label:'Fior di Latte',     desc:'Classic mozzarella' },
    { id:'scamorza', label:'Scamorza',           desc:'Lightly smoked' },
    { id:'buffalo',  label:'Buffalo Mozzarella', desc:'DOP certified', extra:3 },
    { id:'cashew',   label:'Cashew Vegan',       desc:'Plant-based', extra:2 },
    { id:'nocheese', label:'No Cheese',          desc:'Dairy-free' },
  ],
  toppings: {
    Vegetables: [
      { id:'peppers',   label:'Roasted Peppers',   extra:1.5 },
      { id:'mushroom',  label:'Wild Mushroom',      extra:2   },
      { id:'artichoke', label:'Artichoke Hearts',   extra:2   },
      { id:'onion',     label:'Caramelized Onion',  extra:1   },
      { id:'arugula',   label:'Rocket / Arugula',   extra:1   },
      { id:'olives',    label:'Nocellara Olives',   extra:1   },
    ],
    Proteins: [
      { id:'guanciale',   label:'Guanciale',          extra:2.5 },
      { id:'nduja_t',     label:"N'Duja",             extra:2   },
      { id:'prosciutto_t',label:'Prosciutto di Parma',extra:3   },
      { id:'chicken',     label:'Roast Chicken',      extra:2   },
      { id:'anchovies',   label:'White Anchovies',    extra:2   },
    ],
    Finish: [
      { id:'basil',      label:'Fresh Basil',      extra:0   },
      { id:'chili_honey',label:'Chili Honey',      extra:1   },
      { id:'truffle',    label:'Truffle Oil',       extra:2.5 },
      { id:'lemon',      label:'Lemon Zest',        extra:0   },
      { id:'sea_salt',   label:'Sea Salt Flakes',   extra:0   },
    ],
  },
};

const BASE_PIZZA_PRICE = 12;

// ── KITCHEN MOCK DATA ────────────────────────────────────────────
const KITCHEN_ORDERS_INIT = [
  { id:'#142', items:['Diavola','La Margherita'],       station:'A', elapsed:2,  status:'queue'   },
  { id:'#143', items:['Funghi & Truffle','Bianca'],     station:'B', elapsed:1,  status:'queue'   },
  { id:'#144', items:['Build Your Own','Marinara'],     station:'A', elapsed:8,  status:'prepping'},
  { id:'#145', items:['Prosciutto e Fichi'],            station:'C', elapsed:5,  status:'prepping'},
  { id:'#146', items:['Diavola',"N'Duja & Honey"],      station:'B', elapsed:3,  status:'oven', ovenSec:240  },
  { id:'#147', items:['La Margherita','Alla Norma'],    station:'A', elapsed:1,  status:'oven', ovenSec:420  },
  { id:'#148', items:['Funghi & Truffle'],              station:'C', elapsed:12, status:'ready'   },
  { id:'#149', items:['Build Your Own'],                station:'B', elapsed:9,  status:'ready'   },
];

// ── PRICE CALCULATOR ─────────────────────────────────────────────
function calcBuilderPrice(base, sauce, cheese, toppings) {
  let p = BASE_PIZZA_PRICE;
  const allToppings = Object.values(BUILDER_OPTIONS.toppings).flat();
  [
    ...BUILDER_OPTIONS.bases.filter(b => b.id === base),
    ...BUILDER_OPTIONS.sauces.filter(s => s.id === sauce),
    ...BUILDER_OPTIONS.cheeses.filter(c => c.id === cheese),
    ...allToppings.filter(t => toppings.includes(t.id)),
  ].forEach(o => { if (o.extra) p += o.extra; });
  return p;
}

Object.assign(window, {
  PIZZA_MENU, BUILDER_OPTIONS, BASE_PIZZA_PRICE,
  KITCHEN_ORDERS_INIT, calcBuilderPrice,
});
