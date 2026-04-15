/**
 * 🧹 Tineco Card for Home Assistant
 * @version 1.0.0
 * @license MIT
 * @author MattiaSaiko
 */

var TRANSLATIONS = {
  en: {
    card:{ online:'Online', offline:'Offline', floor_cleaner:'Floor Cleaner' },
    status:{ cleaning:'Cleaning', running:'Running', working:'Working', charging:'Charging',
      docked:'Docked', standby:'Standby', idle:'Ready', ready:'Ready',
      paused:'Paused', error:'Error', unknown:'Unknown' },
    sensors:{ battery:'Battery', fresh_water:'Fresh Water', waste_water:'Waste Water', brush:'Brush' },
    pills:{ charging:'Charging', battery_low:'Low battery' },
    controls:{ title:'Controls', cleaning_method:'Cleaning Method', running_speed:'Speed',
      suction_power:'Suction Power', max_power:'MAX Power', max_spray:'MAX Spray',
      volume:'Volume', water_mode:'Water Mode', sound:'Sound', light:'Light', on:'ON', off:'OFF' },
    tanks:{ fresh:'Fresh Water', waste:'Waste Water' },
    footer:{ firmware:'FW', api:'API' },
    editor:{
      sections:{ visibility:'Visible sections', image:'Custom image', sensors:'Sensors', controls:'Controls' },
      image_placeholder:'/local/tineco.png',
      image_tip:'Leave empty to use the built-in SVG drawing',
      show:{ image:'Image', status:'Status', battery:'Battery', tanks:'Tanks',
        pills:'Pills', controls:'Controls', footer:'Footer' },
      entities:{ battery:'Battery', status:'Vacuum Status', charging:'Charging', online:'Online',
        brush_roller:'Brush Roller', model:'Model', fresh_water:'Fresh Water', waste_water:'Waste Water',
        firmware:'Firmware', api_version:'API Version', cleaning_method:'Cleaning Method',
        running_speed:'Speed', suction_mode_power:'Suction Power', max_mode_power:'MAX Power',
        max_mode_spray:'MAX Spray Volume', sound_volume:'Sound Volume', water_mode:'Water Mode',
        sound_enabled:'Sound On/Off', floor_brush_light:'Floor Light' }
    }
  },
  it: {
    card:{ online:'Online', offline:'Offline', floor_cleaner:'Lavapavimenti' },
    status:{ cleaning:'Pulizia in corso', running:'In azione', working:'In azione',
      charging:'In carica', docked:'In base', standby:'Standby', idle:'Pronto',
      ready:'Pronto', paused:'In pausa', error:'Errore', unknown:'Sconosciuto' },
    sensors:{ battery:'Batteria', fresh_water:'Acqua Pulita', waste_water:'Acqua Sporca', brush:'Spazzola' },
    pills:{ charging:'In Carica', battery_low:'Batteria bassa' },
    controls:{ title:'Controlli', cleaning_method:'Metodo Pulizia', running_speed:'Velocità',
      suction_power:'Potenza Asp.', max_power:'MAX Power', max_spray:'MAX Spray',
      volume:'Volume', water_mode:'Water Mode', sound:'Suono', light:'Luce', on:'ON', off:'OFF' },
    tanks:{ fresh:'Acqua Pulita', waste:'Acqua Sporca' },
    footer:{ firmware:'FW', api:'API' },
    editor:{
      sections:{ visibility:'Sezioni visibili', image:'Immagine custom', sensors:'Sensori', controls:'Controlli' },
      image_placeholder:'/local/tineco.png',
      image_tip:'Lascia vuoto per il disegno SVG integrato',
      show:{ image:'Immagine', status:'Stato', battery:'Batteria', tanks:'Serbatoi',
        pills:'Pills', controls:'Controlli', footer:'Footer' },
      entities:{ battery:'Batteria', status:'Stato Vacuum', charging:'In Carica', online:'Online',
        brush_roller:'Brush Roller', model:'Modello', fresh_water:'Acqua Pulita', waste_water:'Acqua Sporca',
        firmware:'Firmware', api_version:'API Version', cleaning_method:'Metodo Pulizia',
        running_speed:'Velocità', suction_mode_power:'Potenza Aspirazione', max_mode_power:'MAX Power',
        max_mode_spray:'MAX Spray Volume', sound_volume:'Volume Suono', water_mode:'Water Mode',
        sound_enabled:'Suono On/Off', floor_brush_light:'Luce Pavimento' }
    }
  }
};

function localize(lang, path) {
  var code = (lang||'en').split('-')[0].toLowerCase();
  var dict = TRANSLATIONS[code] || TRANSLATIONS['en'];
  var keys = path.split('.');
  var val = dict;
  for (var i = 0; i < keys.length; i++) {
    val = val ? val[keys[i]] : undefined;
  }
  if (val !== undefined && val !== null) return val;
  val = TRANSLATIONS['en'];
  for (var j = 0; j < keys.length; j++) {
    val = val ? val[keys[j]] : undefined;
  }
  return val !== undefined ? val : path;
}

var T = {
  blue:'#00A8E8', blueDark:'#0077B6', cyan:'#48CAE4',
  success:'#52B788', warning:'#FFB703', danger:'#E63946', muted:'#6B7A8D',
};

var STATUS_KEYS = ['cleaning','running','working','charging','docked','standby','idle','ready','paused','error'];

function resolveStatus(raw, lang) {
  var k = (raw||'').toLowerCase().trim();
  var colorMap = {
    cleaning:'#00A8E8', running:'#00A8E8', working:'#00A8E8',
    charging:'#FFB703', docked:'#52B788', standby:'#6B7A8D',
    idle:'#52B788', ready:'#52B788', paused:'#FFB703', error:'#E63946'
  };
  var animateSet = {cleaning:true, running:true, working:true};
  for (var i = 0; i < STATUS_KEYS.length; i++) {
    var key = STATUS_KEYS[i];
    if (k.indexOf(key) >= 0) {
      return {
        label: localize(lang, 'status.'+key),
        color: colorMap[key],
        animate: !!animateSet[key],
        raw: raw
      };
    }
  }
  return { label:raw||localize(lang,'status.unknown'), color:T.muted, animate:false, raw:raw };
}

var MODEL_COLORS = {
  'floor one s3':'#00A8E8','floor one s5':'#0095D3','floor one s6':'#0077B6',
  'floor one s7':'#005F99','ifloor':'#48CAE4','pure one':'#00CBA7','carpet one':'#2563EB',
};
function modelAccent(m) {
  var l = (m||'').toLowerCase();
  for (var k in MODEL_COLORS) { if (l.indexOf(k) >= 0) return MODEL_COLORS[k]; }
  return T.blue;
}

function vacuumSVG(accent, isAnimated, batteryPct, freshStatus, wasteStatus) {
  var fw = (freshStatus||'').toLowerCase();
  var ww = (wasteStatus||'').toLowerCase();
  var freshFill = fw.indexOf('empty')>=0 ? T.danger : fw.indexOf('low')>=0 ? T.warning : accent;
  var wasteFill = ww.indexOf('full')>=0  ? T.danger : ww.indexOf('high')>=0? T.warning : '#9DB4C0';
  var batColor  = batteryPct<20 ? T.danger : batteryPct<50 ? T.warning : T.success;
  var batWidth  = Math.max(2,(batteryPct/100)*22);
  var ra        = isAnimated ? 'svgSpin' : 'none';
  var bristles  = [22,29,36,43,50,57,64,71,78,85,92].map(function(x){
    return '<line x1="'+x+'" y1="206" x2="'+(x-1)+'" y2="226" stroke="#3A6078" stroke-width="0.8" opacity="0.6"/>';
  }).join('');
  return '<svg class="vacuum-svg" viewBox="0 0 120 280" xmlns="http://www.w3.org/2000/svg">'
    +'<defs>'
    +'<linearGradient id="bG" x1="0%" y1="0%" x2="100%" y2="100%">'
    +'<stop offset="0%" stop-color="#D4E8F8"/><stop offset="100%" stop-color="#B8D4E8"/></linearGradient>'
    +'<linearGradient id="hG" x1="0%" y1="0%" x2="100%" y2="0%">'
    +'<stop offset="0%" stop-color="'+accent+'"/><stop offset="100%" stop-color="'+accent+'CC"/></linearGradient>'
    +'</defs>'
    +'<rect x="51" y="8" width="18" height="8" rx="4" fill="'+accent+'"/>'
    +'<rect x="52" y="14" width="16" height="65" rx="8" fill="url(#bG)" stroke="#A8C4DC" stroke-width="1"/>'
    +'<rect x="53" y="24" width="14" height="2" rx="1" fill="'+accent+'44"/>'
    +'<rect x="53" y="30" width="14" height="2" rx="1" fill="'+accent+'44"/>'
    +'<rect x="53" y="36" width="14" height="2" rx="1" fill="'+accent+'44"/>'
    +'<ellipse cx="60" cy="79" rx="14" ry="7" fill="#C0D8EC" stroke="#A8C4DC" stroke-width="1"/>'
    +'<rect x="32" y="79" width="56" height="110" rx="18" fill="url(#bG)" stroke="#A0BCCC" stroke-width="1.5"/>'
    +'<rect x="32" y="79" width="56" height="24" rx="18" fill="url(#hG)" opacity="0.9"/>'
    +'<rect x="40" y="104" width="40" height="50" rx="10" fill="#0D1B2E"/>'
    +'<circle cx="60" cy="121" r="17" fill="none" stroke="'+accent+'33" stroke-width="2"/>'
    +'<circle cx="60" cy="121" r="17" fill="none" stroke="'+accent+'" stroke-width="2"'
    +' stroke-dasharray="54 54" stroke-linecap="round"'
    +' style="transform-origin:60px 121px;animation:'+ra+' 2s linear infinite;opacity:'+(isAnimated?'1':'0.3')+'"/>'
    +'<circle cx="60" cy="121" r="11" fill="none" stroke="'+accent+'88" stroke-width="1.5"'
    +' style="transform-origin:60px 121px;animation:'+(isAnimated?'svgSpinReverse 3s linear infinite':'none')+'"/>'
    +'<circle cx="60" cy="121" r="5" fill="'+accent+'" opacity="'+(isAnimated?'1':'0.6')+'"'
    +' style="animation:'+(isAnimated?'svgPulse 1.5s ease-in-out infinite':'none')+'"/>'
    +'<rect x="44" y="136" width="24" height="6" rx="3" fill="#1A2E40"/>'
    +'<rect x="45" y="137" width="'+batWidth+'" height="4" rx="2" fill="'+batColor+'" opacity="0.9"/>'
    +'<text x="60" y="152" font-family="Helvetica Neue,Arial,sans-serif" font-size="7" font-weight="800"'
    +' fill="'+accent+'" text-anchor="middle" letter-spacing="2" opacity="0.85">TINECO</text>'
    +'<rect x="34" y="162" width="18" height="22" rx="5" fill="'+freshFill+'22" stroke="'+freshFill+'" stroke-width="1.2"/>'
    +'<text x="43" y="176" font-size="9" text-anchor="middle" fill="'+freshFill+'">💧</text>'
    +'<rect x="68" y="162" width="18" height="22" rx="5" fill="'+wasteFill+'22" stroke="'+wasteFill+'" stroke-width="1.2"/>'
    +'<text x="77" y="176" font-size="9" text-anchor="middle" fill="'+wasteFill+'">🗑</text>'
    +'<rect x="48" y="189" width="24" height="10" rx="4" fill="#B0C8DC"/>'
    +'<rect x="18" y="199" width="84" height="28" rx="14" fill="#8AAFC4" stroke="#7098B0" stroke-width="1.5"/>'
    +'<rect x="18" y="199" width="84" height="10" rx="14" fill="'+accent+'66"/>'
    +'<rect x="18" y="204" width="84" height="5" fill="'+accent+'66"/>'
    +'<ellipse cx="60" cy="213" rx="36" ry="7" fill="#5A8098" opacity="0.7"/>'
    +bristles
    +'<ellipse cx="28" cy="224" rx="9" ry="5" fill="#2A4A60" opacity="0.8"/>'
    +'<ellipse cx="28" cy="224" rx="5" ry="3" fill="#1A3A50" opacity="0.6"/>'
    +'<ellipse cx="92" cy="224" rx="9" ry="5" fill="#2A4A60" opacity="0.8"/>'
    +'<ellipse cx="92" cy="224" rx="5" ry="3" fill="#1A3A50" opacity="0.6"/>'
    +'</svg>';
}

var CARD_CSS = ''
  +':host{'
    +'--t-blue:#00A8E8;--t-ok:#52B788;--t-warn:#FFB703;--t-err:#E63946;'
    +'--t-surf:var(--secondary-background-color,#E4F2FB);'
    +'--t-border:var(--divider-color,rgba(0,168,232,0.15));'
    +'--radius:16px;--radius-sm:10px;'
    +'font-family:Helvetica Neue,-apple-system,BlinkMacSystemFont,sans-serif;'
  +'}'
  +'*{box-sizing:border-box;margin:0;padding:0;}'
  +'ha-card{background:var(--card-background-color,#fff);border-radius:var(--radius);overflow:hidden;'
    +'color:var(--primary-text-color,#1A2A4A);'
    +'box-shadow:0 4px 24px rgba(0,120,200,0.10),0 1px 4px rgba(0,0,0,0.06);position:relative;}'
  +'.tc-header{background:linear-gradient(135deg,#003F6B 0%,#0077B6 45%,#00A8E8 100%);'
    +'padding:14px 18px 12px;display:flex;align-items:center;'
    +'justify-content:space-between;position:relative;overflow:hidden;}'
  +'.tc-header::before{content:"";position:absolute;top:-40px;right:-20px;'
    +'width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,0.05);}'
  +'.tc-logo{font-size:22px;font-weight:900;color:#fff;letter-spacing:3px;'
    +'text-transform:uppercase;z-index:1;text-shadow:0 1px 6px rgba(0,0,0,0.18);}'
  +'.tc-model{font-size:11px;color:rgba(255,255,255,0.72);font-weight:500;'
    +'letter-spacing:1.5px;text-transform:uppercase;margin-top:2px;z-index:1;}'
  +'.tc-header-right{display:flex;align-items:center;gap:8px;z-index:1;}'
  +'.tc-online-label{font-size:11px;color:rgba(255,255,255,0.75);}'
  +'.tc-online-dot{width:10px;height:10px;border-radius:50%;transition:background .3s,box-shadow .3s;}'
  +'.tc-online-dot.on{background:#4CAF50;box-shadow:0 0 8px #4CAF5099;animation:dotPulse 2s ease-in-out infinite;}'
  +'.tc-online-dot.off{background:#9E9E9E;}'
  +'.tc-body{padding:16px 18px 18px;}'
  +'.tc-main{display:flex;gap:16px;align-items:flex-start;margin-bottom:14px;}'
  +'.tc-vacuum-wrap{flex:0 0 auto;width:120px;display:flex;justify-content:center;padding-top:4px;}'
  +'.vacuum-svg{width:110px;height:255px;display:block;}'
  +'.vacuum-user-img{width:110px;height:200px;object-fit:contain;border-radius:8px;}'
  +'.tc-info{flex:1;display:flex;flex-direction:column;gap:10px;min-width:0;}'
  +'.tc-status-badge{display:inline-flex;align-items:center;gap:7px;padding:6px 14px;'
    +'border-radius:20px;font-size:13px;font-weight:700;width:fit-content;transition:all .3s;}'
  +'.tc-status-dot{width:8px;height:8px;border-radius:50%;background:currentColor;}'
  +'.tc-batt-label{font-size:11px;color:var(--secondary-text-color,#6B7A8D);font-weight:600;'
    +'margin-bottom:4px;display:flex;justify-content:space-between;}'
  +'.tc-batt-bar{width:100%;height:12px;background:var(--t-surf);border-radius:6px;'
    +'border:1px solid var(--t-border);overflow:hidden;}'
  +'.tc-batt-fill{height:100%;border-radius:6px;transition:width .6s ease,background .3s;position:relative;overflow:hidden;}'
  +'.tc-batt-fill::after{content:"";position:absolute;inset:0;'
    +'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);animation:shimmer 2s infinite;}'
  +'.tc-tanks{display:flex;gap:8px;}'
  +'.tc-tank{flex:1;background:var(--t-surf);border-radius:var(--radius-sm);'
    +'padding:8px 10px;border:1px solid var(--t-border);display:flex;flex-direction:column;gap:2px;}'
  +'.tc-tank-top{display:flex;align-items:center;gap:5px;}'
  +'.tc-tank-icon{font-size:14px;}'
  +'.tc-tank-name{font-size:10px;font-weight:700;color:var(--secondary-text-color,#6B7A8D);'
    +'text-transform:uppercase;letter-spacing:.5px;}'
  +'.tc-tank-value{font-size:12px;font-weight:800;}'
  +'.tc-pills{display:flex;flex-wrap:wrap;gap:5px;}'
  +'.tc-pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;'
    +'border-radius:20px;font-size:10px;font-weight:700;'
    +'background:var(--t-surf);border:1px solid var(--t-border);color:var(--secondary-text-color,#6B7A8D);}'
  +'.tc-pill.pill-ok{background:#52B78818;border-color:#52B78844;color:#52B788;}'
  +'.tc-pill.pill-warn{background:#FFB70318;border-color:#FFB70344;color:#B07A00;}'
  +'.tc-pill.pill-err{background:#E6394618;border-color:#E6394644;color:#E63946;}'
  +'.tc-pill.pill-info{background:#00A8E818;border-color:#00A8E844;color:#0077B6;}'
  +'.tc-pill-dot{width:5px;height:5px;border-radius:50%;background:currentColor;}'
  +'.tc-ctrl-toggle{display:flex;align-items:center;justify-content:space-between;'
    +'padding:11px 14px;margin:14px -18px 0;background:var(--t-surf);'
    +'border-top:1px solid var(--t-border);cursor:pointer;user-select:none;transition:background .2s;}'
  +'.tc-ctrl-toggle:hover{opacity:0.85;}'
  +'.tc-ctrl-toggle-left{display:flex;align-items:center;gap:8px;}'
  +'.tc-ctrl-toggle-label{font-size:11px;font-weight:800;'
    +'color:var(--secondary-text-color,#6B7A8D);text-transform:uppercase;letter-spacing:1.5px;}'
  +'.tc-ctrl-count{font-size:10px;font-weight:800;background:#00A8E822;'
    +'border:1px solid #00A8E844;color:#0077B6;padding:2px 8px;border-radius:20px;}'
  +'.tc-chevron{width:28px;height:28px;display:flex;align-items:center;justify-content:center;'
    +'color:var(--secondary-text-color,#6B7A8D);border-radius:8px;background:rgba(0,168,232,0.08);'
    +'transition:transform .35s cubic-bezier(.34,1.56,.64,1);}'
  +'.tc-chevron.open{transform:rotate(180deg);}'
  +'.tc-chevron svg{display:block;}'
  +'.tc-ctrl-drawer{overflow:hidden;max-height:0;opacity:0;'
    +'transition:max-height .45s cubic-bezier(.4,0,.2,1),opacity .3s ease;}'
  +'.tc-ctrl-drawer.open{max-height:700px;opacity:1;padding-top:12px;}'
  +'.tc-controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;}'
  +'.tc-ctrl{background:var(--t-surf);border-radius:var(--radius-sm);padding:9px 11px;'
    +'border:1px solid var(--t-border);display:flex;flex-direction:column;gap:5px;'
    +'transition:border-color .2s,box-shadow .2s;}'
  +'.tc-ctrl:hover{border-color:#00A8E8;box-shadow:0 2px 10px rgba(0,168,232,.12);}'
  +'.tc-ctrl-label{font-size:10px;font-weight:800;color:var(--secondary-text-color,#6B7A8D);'
    +'text-transform:uppercase;letter-spacing:.7px;}'
  +'.tc-ctrl-select{width:100%;padding:5px 28px 5px 8px;border-radius:8px;'
    +'border:1px solid var(--t-border);background:var(--card-background-color,#fff);'
    +'font-size:12px;font-weight:700;color:var(--primary-text-color,#1A2A4A);'
    +'cursor:pointer;outline:none;-webkit-appearance:none;'
    +'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2300A8E8\' stroke-width=\'2.5\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");'
    +'background-repeat:no-repeat;background-position:right 7px center;}'
  +'.tc-ctrl-select:focus{border-color:#00A8E8;}'
  +'.tc-toggle-row{display:flex;align-items:center;justify-content:space-between;}'
  +'.tc-toggle-val{font-size:12px;font-weight:800;}'
  +'.tc-toggle{position:relative;width:42px;height:24px;cursor:pointer;flex-shrink:0;}'
  +'.tc-toggle input{opacity:0;width:0;height:0;}'
  +'.tc-toggle-track{position:absolute;inset:0;border-radius:24px;background:#CCD8E4;transition:background .25s;}'
  +'.tc-toggle-thumb{position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;'
    +'top:3px;left:3px;transition:transform .25s cubic-bezier(.34,1.56,.64,1);box-shadow:0 1px 4px rgba(0,0,0,.2);}'
  +'.tc-toggle input:checked~.tc-toggle-track{background:#00A8E8;}'
  +'.tc-toggle input:checked~.tc-toggle-thumb{transform:translateX(18px);}'
  +'.tc-offline{position:absolute;inset:0;background:rgba(10,20,30,.55);backdrop-filter:blur(3px);'
    +'display:flex;flex-direction:column;align-items:center;justify-content:center;'
    +'border-radius:var(--radius);z-index:10;gap:8px;pointer-events:none;}'
  +'.tc-offline-icon{font-size:32px;}'
  +'.tc-offline-text{color:rgba(255,255,255,.85);font-size:14px;font-weight:700;}'
  +'@keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.3)}}'
  +'@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}'
  +'@keyframes svgSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'
  +'@keyframes svgSpinReverse{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}'
  +'@keyframes svgPulse{0%,100%{opacity:1}50%{opacity:.5}}';

var EDITOR_CSS = ''
  +':host{display:block;padding:0 0 8px;}'
  +'*{box-sizing:border-box;}'
  +'.sec{font-size:11px;font-weight:800;color:var(--primary-color,#00A8E8);'
    +'text-transform:uppercase;letter-spacing:1.5px;'
    +'padding:16px 0 8px;border-bottom:1px solid var(--divider-color,rgba(128,128,128,0.2));margin-bottom:10px;}'
  +'.row{margin-bottom:10px;}'
  +'.row-label{display:block;font-size:11px;font-weight:700;'
    +'color:var(--secondary-text-color,#888);'
    +'text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;}'
  +'.ent-input{width:100%;padding:8px 10px;border-radius:8px;'
    +'border:1px solid var(--divider-color,rgba(128,128,128,0.3));'
    +'background:var(--secondary-background-color,rgba(128,128,128,0.05));'
    +'color:var(--primary-text-color,#fff);font-size:13px;outline:none;'
    +'font-family:monospace;transition:border-color 0.2s;}'
  +'.ent-input:focus{border-color:var(--primary-color,#00A8E8);}'
  +'.ent-input::placeholder{color:var(--disabled-text-color,rgba(128,128,128,0.5));}'
  +'.toggles{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;}'
  +'.tog{display:flex;align-items:center;gap:8px;padding:8px 10px;'
    +'border-radius:8px;cursor:pointer;user-select:none;'
    +'background:var(--secondary-background-color,rgba(128,128,128,0.06));'
    +'border:1px solid var(--divider-color,rgba(128,128,128,0.15));}'
  +'.tog input{accent-color:var(--primary-color,#00A8E8);width:15px;height:15px;cursor:pointer;flex-shrink:0;}'
  +'.tog span{font-size:12px;font-weight:600;color:var(--primary-text-color,#fff);}'
  +'.tip{font-size:11px;color:var(--secondary-text-color,#888);margin-top:3px;font-style:italic;}';

var SHOW_DEFAULTS = {
  show_image:true, show_status:true, show_battery:true,
  show_tanks:true, show_pills:true, show_controls:true, show_footer:false,
};

class TinecoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this._hass = null;
    this._config = {};
    this._ctrlOpen = false;
    this._lastStateKey = null;
  }

  setConfig(config) {
    if (!config.entities) throw new Error('Tineco Card: define "entities".');
    this._config = Object.assign({entities:{}}, SHOW_DEFAULTS, config);
    if (config.controls_open) this._ctrlOpen = true;
    this._render();
  }

  set hass(hass) { this._hass = hass; if (!this._hasStateChanged()) return; this._render(); }
  getCardSize() { return 5; }

  _lang()      { return this._hass ? (this._hass.language||'en') : 'en'; }

  _stateKey() {
    if (!this._hass || !this._config) return '';
    var e = this._config.entities || {};
    var self = this;
    var keys = ['battery','status','charging','online','brush_roller','model',
      'fresh_water','waste_water','firmware','api_version',
      'cleaning_method','floor_brush_light','max_mode_power','max_mode_spray',
      'running_speed','sound_enabled','sound_volume','suction_mode_power','water_mode'];
    return keys.map(function(k){ return e[k] ? (self._hass.states[e[k]] ? self._hass.states[e[k]].state : '') : ''; }).join('|');
  }

  _hasStateChanged() {
    var key = this._stateKey();
    if (key === this._lastStateKey) return false;
    this._lastStateKey = key;
    return true;
  }

  _l(path)     { return localize(this._lang(), path); }
  _show(k)     { return this._config[k] !== false; }
  _st(eid)     { if(!eid||!this._hass) return null; return this._hass.states[eid]||null; }
  _val(eid,fb) { var s=this._st(eid); return s ? s.state : (fb||''); }
  _opts(eid)   { var s=this._st(eid); return (s&&s.attributes&&s.attributes.options)||[]; }
  _svc(domain, service, data) { if (this._hass) this._hass.callService(domain, service, data); }

  _buildSelect(eid, cur, labelKey, icon) {
    if (!eid) return '';
    var label = this._l('controls.'+labelKey);
    var opts = this._opts(eid);
    var options = opts.length
      ? opts.map(function(o){ return '<option value="'+o+'"'+(o===cur?' selected':'')+'>'+o+'</option>'; }).join('')
      : '<option>'+(cur||'—')+'</option>';
    return '<div class="tc-ctrl">'
      +'<div class="tc-ctrl-label">'+icon+' '+label+'</div>'
      +'<select class="tc-ctrl-select" data-eid="'+eid+'">'+options+'</select>'
      +'</div>';
  }

  _buildToggle(eid, val, labelKey, icon, accent) {
    if (!eid) return '';
    var label = this._l('controls.'+labelKey);
    var on = val==='on'||val==='true';
    return '<div class="tc-ctrl">'
      +'<div class="tc-ctrl-label">'+icon+' '+label+'</div>'
      +'<div class="tc-toggle-row">'
        +'<span class="tc-toggle-val" style="color:'+(on?accent:T.muted)+'">'
          +(on?this._l('controls.on'):this._l('controls.off'))+'</span>'
        +'<label class="tc-toggle" aria-label="'+label+'">'
          +'<input type="checkbox"'+(on?' checked':'')+' data-eid="'+eid+'">'
          +'<div class="tc-toggle-track"></div>'
          +'<div class="tc-toggle-thumb"></div>'
        +'</label>'
      +'</div>'
      +'</div>';
  }

  _render() {
    if (!this._hass || !this._config) return;
    var e = this._config.entities||{};
    var lang = this._lang();

    var battery        = parseInt(this._val(e.battery,'0'))||0;
    var status         = this._val(e.status,'');
    var charging       = this._val(e.charging,'off');
    var online         = this._val(e.online,'off');
    var brushRoller    = this._val(e.brush_roller,'');
    var model          = this._val(e.model,'Tineco');
    var freshWater     = this._val(e.fresh_water,'—');
    var wasteWater     = this._val(e.waste_water,'—');
    var firmware       = this._val(e.firmware,'N/A');
    var apiVer         = this._val(e.api_version,'N/A');
    var cleaningMethod = this._val(e.cleaning_method,'');
    var floorLight     = this._val(e.floor_brush_light,'off');
    var maxPower       = this._val(e.max_mode_power,'');
    var maxSpray       = this._val(e.max_mode_spray,'');
    var runSpeed       = this._val(e.running_speed,'');
    var soundOn        = this._val(e.sound_enabled,'off');
    var soundVol       = this._val(e.sound_volume,'');
    var suctionPow     = this._val(e.suction_mode_power,'');
    var waterMode      = this._val(e.water_mode,'off');

    var isOnline   = ['on','true','connected'].indexOf((online||'').toLowerCase())>=0;
    var isCharging = ['on','true'].indexOf((charging||'').toLowerCase())>=0;
    var si         = resolveStatus(status, lang);
    var accent     = modelAccent(model);
    var bc         = battery<20?T.danger:battery<50?T.warning:T.success;
    var fw2        = (freshWater||'').toLowerCase();
    var ww2        = (wasteWater||'').toLowerCase();
    var freshColor = fw2.indexOf('empty')>=0?T.danger:fw2.indexOf('low')>=0?T.warning:accent;
    var wasteColor = ww2.indexOf('full')>=0?T.danger:ww2.indexOf('high')>=0?T.warning:T.success;

    function brushClass(v) {
      var l=(v||'').toLowerCase();
      if(l.indexOf('ok')>=0||l.indexOf('good')>=0||l.indexOf('clean')>=0) return 'pill-ok';
      if(l.indexOf('warn')>=0||l.indexOf('check')>=0) return 'pill-warn';
      if(l.indexOf('err')>=0||l.indexOf('block')>=0||l.indexOf('tangle')>=0) return 'pill-err';
      return 'pill-info';
    }

    var ctrlCount = [e.cleaning_method,e.running_speed,e.suction_mode_power,e.max_mode_power,
      e.max_mode_spray,e.sound_volume,e.water_mode,e.sound_enabled,e.floor_brush_light].filter(Boolean).length;

    var vacuumHTML = this._config.image
      ? '<img src="'+this._config.image+'" class="vacuum-user-img" alt="'+model+'" loading="lazy"/>'
      : vacuumSVG(accent, si.animate, battery, freshWater, wasteWater);

    var chev = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>';

    var offlineText = this._l('card.offline');
    var onlineLabel = isOnline ? this._l('card.online') : this._l('card.offline');
    var modelLabel  = (model!=='unknown'&&model) ? model : this._l('card.floor_cleaner');

    var h = '<style>'+CARD_CSS+'</style><ha-card>'
      +(!isOnline?'<div class="tc-offline"><div class="tc-offline-icon">📡</div>'
        +'<div class="tc-offline-text">Tineco '+offlineText+'</div></div>':'')
      +'<div class="tc-header">'
        +'<div>'
          +'<div class="tc-logo">tineco</div>'
          +'<div class="tc-model">'+modelLabel+'</div>'
        +'</div>'
        +'<div class="tc-header-right">'
          +'<span class="tc-online-label">'+onlineLabel+'</span>'
          +'<div class="tc-online-dot '+(isOnline?'on':'off')+'"></div>'
        +'</div>'
      +'</div>'
      +'<div class="tc-body"><div class="tc-main">';

    if (this._show('show_image')) h += '<div class="tc-vacuum-wrap">'+vacuumHTML+'</div>';
    h += '<div class="tc-info">';

    if (this._show('show_status')) {
      h += '<div class="tc-status-badge" style="background:'+si.color+'18;color:'+si.color+';border:1px solid '+si.color+'40">'
        +'<div class="tc-status-dot" style="animation:'+(si.animate?'dotPulse 1.2s ease-in-out infinite':'none')+'"></div>'
        +si.label+'</div>';
    }
    if (this._show('show_battery')) {
      h += '<div>'
        +'<div class="tc-batt-label">'
          +'<span>🔋 '+this._l('sensors.battery')+'</span>'
          +'<span style="color:'+bc+';font-weight:800">'+battery+'%</span>'
        +'</div>'
        +'<div class="tc-batt-bar">'
          +'<div class="tc-batt-fill" style="width:'+battery+'%;background:'+bc+'">'
          +'</div></div></div>';
    }
    if (this._show('show_tanks')) {
      h += '<div class="tc-tanks">'
        +'<div class="tc-tank" style="border-color:'+freshColor+'44">'
          +'<div class="tc-tank-top"><span class="tc-tank-icon">💧</span>'
            +'<span class="tc-tank-name">'+this._l('tanks.fresh')+'</span></div>'
          +'<div class="tc-tank-value" style="color:'+freshColor+'">'+freshWater+'</div>'
        +'</div>'
        +'<div class="tc-tank" style="border-color:'+wasteColor+'44">'
          +'<div class="tc-tank-top"><span class="tc-tank-icon">🗑️</span>'
            +'<span class="tc-tank-name">'+this._l('tanks.waste')+'</span></div>'
          +'<div class="tc-tank-value" style="color:'+wasteColor+'">'+wasteWater+'</div>'
        +'</div></div>';
    }
    if (this._show('show_pills')) {
      h += '<div class="tc-pills">'
        +(isCharging?'<div class="tc-pill pill-warn"><div class="tc-pill-dot"></div>'+this._l('pills.charging')+'</div>':'')
        +(brushRoller&&brushRoller!=='unknown'&&brushRoller!==''
          ?'<div class="tc-pill '+brushClass(brushRoller)+'"><div class="tc-pill-dot"></div>'+this._l('sensors.brush')+': '+brushRoller+'</div>':'')
        +(battery<20?'<div class="tc-pill pill-err"><div class="tc-pill-dot"></div>'+this._l('pills.battery_low')+'</div>':'')
        +'</div>';
    }

    h += '</div></div>';

    if (this._show('show_controls') && ctrlCount > 0) {
      h += '<div class="tc-ctrl-toggle" id="ct" role="button" tabindex="0" aria-expanded="'+(this._ctrlOpen?'true':'false')+'">'
          +'<div class="tc-ctrl-toggle-left">'
            +'<span class="tc-ctrl-toggle-label">⚙️ '+this._l('controls.title')+'</span>'
            +'<span class="tc-ctrl-count">'+ctrlCount+'</span>'
          +'</div>'
          +'<div class="tc-chevron '+(this._ctrlOpen?'open':'')+'">'+chev+'</div>'
        +'</div>'
        +'<div class="tc-ctrl-drawer '+(this._ctrlOpen?'open':'')+'" id="cd">'
          +'<div class="tc-controls">'
            +this._buildSelect(e.cleaning_method,   cleaningMethod,'cleaning_method','🧹')
            +this._buildSelect(e.running_speed,      runSpeed,     'running_speed',  '⚡')
            +this._buildSelect(e.suction_mode_power, suctionPow,   'suction_power',  '💨')
            +this._buildSelect(e.max_mode_power,     maxPower,     'max_power',      '🔥')
            +this._buildSelect(e.max_mode_spray,     maxSpray,     'max_spray',      '🌊')
            +this._buildSelect(e.sound_volume,       soundVol,     'volume',         '🔊')
            +this._buildToggle(e.water_mode,         waterMode,    'water_mode',     '💦',accent)
            +this._buildToggle(e.sound_enabled,      soundOn,      'sound',          '🔔',accent)
            +this._buildToggle(e.floor_brush_light,  floorLight,   'light',          '💡',accent)
          +'</div>'
        +'</div>';
    }

    if (this._show('show_footer')) {
      h += '<div style="border-top:1px solid var(--divider-color,rgba(0,168,232,0.15));'
        +'padding:9px 0 0;margin-top:14px;display:flex;justify-content:space-between;'
        +'font-size:10px;color:var(--secondary-text-color,#6B7A8D);">'
        +'<span>'+this._l('footer.firmware')+': <strong>'+firmware+'</strong></span>'
        +'<span>'+this._l('footer.api')+': <strong>'+apiVer+'</strong></span>'
        +'</div>';
    }

    h += '</div></ha-card>';
    this.shadowRoot.innerHTML = h;
    this._listen();
  }

  _listen() {
    var self = this;
    var ct = this.shadowRoot.getElementById('ct');
    if (ct) {
      ct.addEventListener('click', function() {
        self._ctrlOpen = !self._ctrlOpen;
        var cd = self.shadowRoot.getElementById('cd');
        var chev = ct.querySelector('.tc-chevron');
        if (cd) cd.classList.toggle('open', self._ctrlOpen);
        if (chev) chev.classList.toggle('open', self._ctrlOpen);
        ct.setAttribute('aria-expanded', self._ctrlOpen ? 'true' : 'false');
      });
      ct.addEventListener('keydown', function(ev) {
        if (ev.key==='Enter'||ev.key===' ') { ev.preventDefault(); ct.click(); }
      });
    }
    this.shadowRoot.querySelectorAll('.tc-ctrl-select').forEach(function(s) {
      s.addEventListener('change', function() {
        self._svc('select','select_option',{entity_id:s.dataset.eid,option:s.value});
      });
    });
    this.shadowRoot.querySelectorAll('.tc-toggle input').forEach(function(c) {
      c.addEventListener('change', function() {
        self._svc('homeassistant','toggle',{entity_id:c.dataset.eid});
      });
    });
  }

  static getConfigElement() { return document.createElement('tineco-card-editor'); }
  static getStubConfig() {
    return Object.assign({}, SHOW_DEFAULTS, {
      entities:{
        battery:'sensor.tineco_battery',
        status:'sensor.tineco_vacuum_status',
        charging:'binary_sensor.tineco_charging',
        online:'binary_sensor.tineco_online',
        brush_roller:'sensor.tineco_brush_roller',
        model:'sensor.tineco_model',
        fresh_water:'sensor.fresh_water_tank_status',
        waste_water:'sensor.waste_water_tank_status',
        firmware:'sensor.tineco_firmware_version',
        api_version:'sensor.tineco_api_version',
        cleaning_method:'select.tineco_cleaning_method',
        floor_brush_light:'switch.tineco_floor_brush_light',
        max_mode_power:'select.tineco_max_mode_power',
        max_mode_spray:'select.tineco_max_mode_spray_volume',
        running_speed:'select.tineco_running_speed',
        sound_enabled:'switch.tineco_sound_enabled',
        sound_volume:'select.tineco_sound_volume_level',
        suction_mode_power:'select.tineco_suction_mode_power',
        water_mode:'switch.tineco_water_mode_enabled',
      },
    });
  }
}
customElements.define('tineco-card', TinecoCard);

var EDITOR_SENSOR_KEYS = [
  'battery','status','charging','online','brush_roller','model',
  'fresh_water','waste_water','firmware','api_version'
];
var EDITOR_CONTROL_KEYS = [
  'cleaning_method','running_speed','suction_mode_power','max_mode_power',
  'max_mode_spray','sound_volume','water_mode','sound_enabled','floor_brush_light'
];
var EDITOR_PLACEHOLDERS = {
  battery:'sensor.tineco_battery', status:'sensor.tineco_vacuum_status',
  charging:'binary_sensor.tineco_charging', online:'binary_sensor.tineco_online',
  brush_roller:'sensor.tineco_brush_roller', model:'sensor.tineco_model',
  fresh_water:'sensor.fresh_water_tank_status', waste_water:'sensor.waste_water_tank_status',
  firmware:'sensor.tineco_firmware_version', api_version:'sensor.tineco_api_version',
  cleaning_method:'select.tineco_cleaning_method', running_speed:'select.tineco_running_speed',
  suction_mode_power:'select.tineco_suction_mode_power', max_mode_power:'select.tineco_max_mode_power',
  max_mode_spray:'select.tineco_max_mode_spray_volume', sound_volume:'select.tineco_sound_volume_level',
  water_mode:'switch.tineco_water_mode_enabled', sound_enabled:'switch.tineco_sound_enabled',
  floor_brush_light:'switch.tineco_floor_brush_light',
};
var SHOW_KEYS = ['show_image','show_status','show_battery','show_tanks','show_pills','show_controls','show_footer'];

class TinecoCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'});
    this._config = {};
    this._lang = 'en';
  }

  set hass(h) { if (h && h.language) this._lang = h.language; }

  setConfig(c) {
    this._config = Object.assign({}, SHOW_DEFAULTS, c);
    this._render();
  }

  _l(path) { return localize(this._lang, path); }

  _fire(cfg) {
    this.dispatchEvent(new CustomEvent('config-changed',{
      detail:{config:cfg}, bubbles:true, composed:true
    }));
  }

  _row(key, val) {
    var label = this._l('editor.entities.'+key);
    var ph    = EDITOR_PLACEHOLDERS[key]||'';
    return '<div class="row">'
      +'<label class="row-label">'+label+'</label>'
      +'<input class="ent-input" type="text" data-key="'+key+'"'
        +' placeholder="'+ph+'" value="'+(val||'')+'">'
      +'</div>';
  }

  _render() {
    var self = this;
    var e = this._config.entities||{};

    var togsHTML = SHOW_KEYS.map(function(k) {
      var label = self._l('editor.show.'+k.replace('show_',''));
      return '<label class="tog">'
        +'<input type="checkbox" data-show="'+k+'"'+(self._config[k]!==false?' checked':'')+'>'
        +'<span>'+label+'</span>'
        +'</label>';
    }).join('');

    var sensorsHTML  = EDITOR_SENSOR_KEYS.map(function(k){ return self._row(k, e[k]); }).join('');
    var controlsHTML = EDITOR_CONTROL_KEYS.map(function(k){ return self._row(k, e[k]); }).join('');

    this.shadowRoot.innerHTML = '<style>'+EDITOR_CSS+'</style>'
      +'<div class="sec">👁 '+this._l('editor.sections.visibility')+'</div>'
      +'<div class="toggles">'+togsHTML+'</div>'
      +'<div class="sec">🖼️ '+this._l('editor.sections.image')+'</div>'
      +'<div class="row">'
        +'<label class="row-label">Path</label>'
        +'<input class="ent-input" type="text" id="img-input"'
          +' placeholder="'+this._l('editor.image_placeholder')+'"'
          +' value="'+(this._config.image||'')+'">'
        +'<div class="tip">'+this._l('editor.image_tip')+'</div>'
      +'</div>'
      +'<div class="sec">📊 '+this._l('editor.sections.sensors')+'</div>'
      +sensorsHTML
      +'<div class="sec">🎛️ '+this._l('editor.sections.controls')+'</div>'
      +controlsHTML;

    this.shadowRoot.querySelectorAll('.ent-input[data-key]').forEach(function(inp) {
      inp.addEventListener('change', function() {
        var newE = Object.assign({}, self._config.entities||{});
        newE[inp.dataset.key] = inp.value.trim();
        self._fire(Object.assign({}, self._config, {entities:newE}));
      });
    });

    var imgInp = this.shadowRoot.getElementById('img-input');
    if (imgInp) {
      imgInp.addEventListener('change', function() {
        var upd = Object.assign({}, self._config);
        var v = imgInp.value.trim();
        if (v) upd.image = v; else delete upd.image;
        self._fire(upd);
      });
    }

    this.shadowRoot.querySelectorAll('input[data-show]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        var upd = Object.assign({}, self._config);
        upd[cb.dataset.show] = cb.checked;
        self._fire(upd);
      });
    });
  }
}
customElements.define('tineco-card-editor', TinecoCardEditor);

window.customCards = window.customCards||[];
window.customCards.push({
  type:'tineco-card', name:'Tineco Card', preview:true,
  description:'Card for Tineco floor vacuums — controls, animated SVG, i18n (IT/EN), theme-aware.',
});
console.info(
  '%c TINECO CARD %c v1.5.0 ',
  'color:#fff;background:#0077B6;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:800',
  'color:#0077B6;background:#E8F4FB;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:700'
);
