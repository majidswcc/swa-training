import React, { useEffect, useMemo, useRef, useState } from 'react'

/* ========== Utilities: Hash Router ========== */
function useHashRoute(defaultPath = '/strategy'){
  const parse = ()=> {
    const raw = window.location.hash.replace('#','') || defaultPath
    const [path, qs] = raw.split('?')
    return { path, q: Object.fromEntries(new URLSearchParams(qs||'')) }
  }
  const [r,setR] = useState(parse())
  useEffect(()=>{ const on = ()=> setR(parse()); window.addEventListener('hashchange', on); return ()=> window.removeEventListener('hashchange', on) },[])
  const navigate = (p, params={})=>{
    const qs = new URLSearchParams(params).toString()
    window.location.hash = qs ? `${p}?${qs}` : p
  }
  return { ...r, navigate }
}

/* ========== Data (عينات قابلة للتعديل لاحقًا) ========== */
const cities = {
  'الدمام': [26.4207, 50.0888],
  'الخبر': [26.2854, 50.1961],
  'القطيف': [26.5632, 50.0103],
  'الجبيل': [27.0046, 49.6601],
  'الأحساء': [25.3833, 49.5867],
  'الظهران': [26.305, 50.142]
}

const charities = [
  { id:'albir-dmm', name:'جمعية البر بالدمام', city:'الدمام', seats:120 },
  { id:'etam-khb', name:'جمعية إطعام', city:'الخبر', seats:80 },
  { id:'aytam-dmm', name:'جمعية أيتام الشرقية', city:'الدمام', seats:100 },
  { id:'tarabot-khb', name:'جمعية ترابط', city:'الخبر', seats:70 },
  { id:'wed-ahs',  name:'جمعية ود الخيرية', city:'الأحساء', seats:60 },
  { id:'mix-jub',  name:'جمعيات متفرقة', city:'الجبيل', seats:70 },
] // = 500

const companies = [
  { id:'abb', name:'ABB', city:'الدمام',
    programs:[
      { title:'فني تشغيل وصيانة', type:'كهرباء', city:'الدمام', seats:25, filled:17, start:'2025-10-01', end:'2025-12-01' },
      { title:'مساعد مهندس كهرباء', type:'كهرباء', city:'الدمام', seats:15, filled:6, start:'2025-10-10', end:'2025-12-20' }
    ]
  },
  { id:'siemens', name:'سيمنس', city:'الدمام',
    programs:[
      { title:'تقنيات الصيانة الكهربائية', type:'HSSE', city:'الدمام', seats:30, filled:24, start:'2025-10-05', end:'2025-12-05' }
    ]
  },
  { id:'nesma', name:'نسما', city:'الخبر',
    programs:[
      { title:'خدمة عملاء', type:'خدمة عملاء', city:'الخبر', seats:22, filled:12, start:'2025-10-15', end:'2025-12-20' },
      { title:'محاسب مبتدئ', type:'مالية', city:'الدمام', seats:10, filled:4, start:'2025-10-15', end:'2025-12-25' }
    ]
  },
  { id:'alkhuraif', name:'الخريف', city:'الأحساء',
    programs:[
      { title:'ميكانيكا عامة', type:'ميكانيكا', city:'الأحساء', seats:18, filled:10, start:'2025-10-01', end:'2025-12-01' }
    ]
  },
  { id:'sepco', name:'سيبكو', city:'الجبيل',
    programs:[
      { title:'السلامة الصناعية', type:'HSSE', city:'الجبيل', seats:20, filled:8, start:'2025-10-10', end:'2025-12-15' }
    ]
  }
]

/* Helpers */
const daysLeft = (d)=> Math.max(0, Math.ceil((new Date(d) - new Date())/(1000*60*60*24)))
const percent = (a,b)=> b? Math.min(100, Math.max(0, Math.round((a/b)*100))) : 0

/* ========== Components ========== */

function Header({navigate, path}){
  return (
    <div className="container">
      <div className="header">
        <div className="brand">أكاديمية المياه — SWA Training</div>
        <div className="nav">
          <button onClick={()=>navigate('/strategy')} style={{fontWeight: path==='/strategy'?'800':600}}>الرؤية والاستراتيجية</button>
          <button onClick={()=>navigate('/opps')} style={{fontWeight: path==='/opps'?'800':600}}>الخريطة والفرص</button>
          <button onClick={()=>navigate('/programs')} style={{fontWeight: path==='/programs'?'800':600}}>البرامج والدورات</button>
        </div>
      </div>
    </div>
  )
}

function StrategyPage(){
  return (
    <div className="container">
      <section className="card" dir="rtl">
        <h1 className="h1">الرؤية والرسالة والاستراتيجية</h1>
        <p className="muted">
          بناء جيل سعودي مؤهل ومُمكّن في قطاعات المياه والصناعة والخدمات المرتبطة بها،
          يساهم في تحقيق مستهدفات <b>رؤية 2030</b> عبر برامج تدريبية نوعية منتهية بالتوظيف،
          وشراكات فاعلة مع القطاع الخاص والجمعيات و"هدف".
        </p>

        <div className="grid-2">
          <div className="card">
            <h2 className="h2">الأهداف الاستراتيجية</h2>
            <ul className="muted">
              <li>تأهيل وتوظيف <b>1500</b> شاب وشابة على ثلاث سنوات (500 سنويًا).</li>
              <li>مواءمة التدريب مع احتياجات السوق ورفع الاستبقاء الوظيفي.</li>
              <li>منصة متابعة رقمية لقياس الأثر وإبراز قصص النجاح.</li>
            </ul>
          </div>
          <div className="card">
            <h2 className="h2">المحاور</h2>
            <ul className="muted">
              <li>اختيار المستفيدين بالشراكة مع الجمعيات.</li>
              <li>مسارات تدريبية (كهرباء، ميكانيكا، HSSE، مالية، خدمة عملاء).</li>
              <li>توظيف سريع بعد التخرج ومتابعة الاندماج.</li>
            </ul>
          </div>
        </div>

        <div className="kpi" style={{marginTop:12}}>
          <div className="item"><b>السنة 1:</b> 500 مستفيد</div>
          <div className="item"><b>السنة 2:</b> 500 مستفيد</div>
          <div className="item"><b>السنة 3:</b> 500 مستفيد</div>
        </div>
      </section>
      <div className="footer">© {new Date().getFullYear()} الأكاديمية — جميع الحقوق محفوظة</div>
    </div>
  )
}

function LeafletMap({onCityClick}){
  const ref = useRef(null)
  const mapRef = useRef(null)

  const cityAgg = useMemo(()=>{
    const byCity = {}
    // جمع بيانات الشركات
    companies.forEach(c=>{
      c.programs.forEach(p=>{
        const city = p.city
        byCity[city] = byCity[city] || { companySeats:0, charitySeats:0 }
        byCity[city].companySeats += (p.seats||0)
      })
    })
    // جمع بيانات الجمعيات
    charities.forEach(ch=>{
      const city = ch.city
      byCity[city] = byCity[city] || { companySeats:0, charitySeats:0 }
      byCity[city].charitySeats += (ch.seats||0)
    })
    return byCity
  }, [])

  useEffect(()=>{
    const L = window.L
    if(!L || !ref.current) return

    if(mapRef.current){ mapRef.current.remove() }
    const map = L.map(ref.current).setView([26.5, 50.1], 8)

    // طبقتي خرائط أساس
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' })
    const carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 19, attribution: '&copy; CARTO, OSM' })
    osm.addTo(map)

    // أيقونات ملوّنة
    const blueIcon = L.icon({
      iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34]
    })
    const greenIcon = L.icon({
      iconUrl:'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl:'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[1,-34]
    })

    const companyLayer = L.layerGroup().addTo(map)
    const charityLayer = L.layerGroup().addTo(map)

    Object.keys(cities).forEach(city=>{
      const [lat,lng] = cities[city]
      const agg = cityAgg[city] || {companySeats:0, charitySeats:0}

      // شركـات (أزرق) — إزاحة بسيطة شرقًا
      L.marker([lat, lng+0.02], {icon:blueIcon})
        .addTo(companyLayer)
        .bindPopup(`<div dir="rtl"><b>${city}</b><br/>مقاعد الشركات: ${agg.companySeats}</div>`)
        .on('click',()=> onCityClick && onCityClick(city))

      // جمعيات (أخضر) — إزاحة بسيطة غربًا
      L.marker([lat, lng-0.02], {icon:greenIcon})
        .addTo(charityLayer)
        .bindPopup(`<div dir="rtl"><b>${city}</b><br/>مقاعد الجمعيات: ${agg.charitySeats}</div>`)
        .on('click',()=> onCityClick && onCityClick(city))
    })

    L.control.layers(
      { 'OSM': osm, 'Carto Light': carto },
      { 'شركات (أزرق)': companyLayer, 'جمعيات (أخضر)': charityLayer },
      { collapsed: false }
    ).addTo(map)

    mapRef.current = map
    return ()=> map.remove()
  }, [onCityClick, cityAgg])

  return <div ref={ref} className="map"></div>
}

function CityDashboard({selectedCity}){
  // دورات الشركات في المدينة
  const rows = companies.flatMap(c => c.programs.filter(p=>p.city===selectedCity).map(p=>({
    company: c.name, title:p.title, type:p.type, seats:p.seats, filled:p.filled, end:p.end
  })))
  // حصة الجمعيات في المدينة
  const ch = charities.filter(x=>x.city===selectedCity)
  const charitySeats = ch.reduce((a,b)=>a+b.seats,0)

  if(!selectedCity) return <div className="muted">اختر مدينة من الخريطة لعرض التفاصيل…</div>

  return (
    <div className="card" dir="rtl">
      <h2 className="h2" style={{marginBottom:6}}>المدينة: {selectedCity}</h2>
      <div className="kpi" style={{marginBottom:10}}>
        <div className="item"><b>مقاعد الشركات:</b> {rows.reduce((a,b)=>a+b.seats,0)}</div>
        <div className="item"><b>مقاعد الجمعيات:</b> {charitySeats}</div>
        <div className="item"><span className="badge blue">شركات</span> <span className="badge green">جمعيات</span></div>
      </div>

      <div style={{overflowX:'auto'}}>
        <table className="table">
          <thead>
            <tr>
              <th>الشركة</th><th>الدورة</th><th>النوع</th><th>المقاعد</th><th>تم التسجيل</th><th>نسبة الإنجاز</th><th>المتبقي</th>
            </tr>
          </thead>
          <tbody>
            {rows.length===0 && (
              <tr><td colSpan="7" className="muted">لا توجد برامج معلنة لهذه المدينة.</td></tr>
            )}
            {rows.map((r,i)=>(
              <tr key={i}>
                <td>{r.company}</td>
                <td>{r.title}</td>
                <td><span className="badge">{r.type}</span></td>
                <td>{r.seats}</td>
                <td>{r.filled}</td>
                <td style={{minWidth:140}}>
                  <div className="progress"><span style={{width:`${percent(r.filled, r.seats)}%`}}/></div>
                </td>
                <td>{daysLeft(r.end)} يوم</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OpportunitiesPage(){
  const [city, setCity] = useState('')
  return (
    <div className="container">
      <section className="card" dir="rtl">
        <h1 className="h1">الخريطة والفرص</h1>
        <p className="muted" style={{marginBottom:8}}>
          اختر مدينة من الخريطة لعرض <b>الفرص المتاحة</b> للشركات والجمعيات، مع نوع الدورة ومؤشرات الإنجاز.
        </p>
        <LeafletMap onCityClick={setCity}/>
        <div style={{height:12}}/>
        <CityDashboard selectedCity={city}/>
      </section>
    </div>
  )
}

function ProgramsPage(){
  return (
    <div className="container">
      <section className="card" dir="rtl">
        <h1 className="h1">البرامج والدورات</h1>
        <p className="muted">مساهمات الشركات حسب المدينة ونوع البرامج.</p>
        <div className="cards">
          {companies.map(c=>(
            <div className="company-card" key={c.id}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
                <h2 className="h2" style={{margin:0}}>{c.name}</h2>
                <span className="badge blue">مدينة: {c.city}</span>
              </div>
              {c.programs.map((p,idx)=>(
                <div key={idx} className="course">
                  <div style={{display:'flex', justifyContent:'space-between', gap:8, alignItems:'center'}}>
                    <div><b>{p.title}</b> — <span className="muted">{p.type} • {p.city}</span></div>
                    <div className="badge">المقاعد: {p.filled}/{p.seats}</div>
                  </div>
                  <div className="progress" style={{marginTop:8}}><span style={{width:`${percent(p.filled,p.seats)}%`}}/></div>
                  <div className="muted" style={{marginTop:6}}>المتبقي: {daysLeft(p.end)} يوم</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ========== App (Router + Pages) ========== */
export default function App(){
  const { path, navigate } = useHashRoute('/strategy')

  let page = null
  switch(path){
    case '/strategy': page = <StrategyPage/>; break
    case '/opps':     page = <OpportunitiesPage/>; break
    case '/programs': page = <ProgramsPage/>; break
    default:          page = <StrategyPage/>; break
  }

  return (
    <>
      <Header navigate={navigate} path={path}/>
      {page}
    </>
  )
}
