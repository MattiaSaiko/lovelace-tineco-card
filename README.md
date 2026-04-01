# Tineco Card 🧹

<img width="1024" height="1024" alt="tineco" src="https://github.com/user-attachments/assets/264f8309-0ca0-48a1-92f3-a3355cccc12f" />

## 🇮🇹 Italiano

Una card Lovelace per Home Assistant che mostra lo stato del tuo aspirapolvere/lavapavimenti Tineco in tempo reale: stato operativo con SVG animato che si adatta al modello, barra batteria con animazione di ricarica, livello dei serbatoi acqua pulita e sporca con alert cromatici, e un pannello controlli completo con tendine e toggle.

### Requisiti

- Home Assistant 2024.8.0 o superiore.
- Integrazione Tineco installata e configurata.
- HACS installato per una gestione semplice degli aggiornamenti (opzionale ma raccomandato).
- Dashboard Lovelace.

---

### Installazione tramite HACS (repository custom)

1. Apri **HACS** in Home Assistant.
2. Vai su **Impostazioni HACS → Custom repositories**.
3. Aggiungi il repository:
   - **URL:** `https://github.com/MattiaSaiko/lovelace-tineco-card`
   - **Tipo:** Frontend
4. Salva.
5. Torna alla sezione **Frontend** di HACS, cerca **Tineco Card** e clicca su **Installa**.
6. Conferma l'installazione e riavvia l'interfaccia se richiesto.

---

### Installazione manuale

1. Scarica il file `tineco-card.js` dall'ultima release del repository.
2. Copialo in:
   ```
   config/www/community/lovelace-tineco-card/tineco-card.js
   ```
3. Riavvia Home Assistant.
4. Vai su **Impostazioni → Dashboard → Risorse** e aggiungi:
   ```
   /local/community/lovelace-tineco-card/tineco-card.js
   ```
   Tipo: **Modulo JavaScript**

---

### Aggiungere la card alla dashboard

1. Vai sulla dashboard desiderata.
2. Clicca su **Modifica dashboard → Aggiungi scheda**.
3. Cerca **"Custom: Tineco Card"**.
4. Compila i campi dell'editor visuale (o passa all'editor YAML) e salva.

---

### Configurazione YAML

La card supporta sia una configurazione minimale sia una configurazione avanzata con tutte le entità disponibili.

#### Configurazione minimale

```yaml
type: custom:tineco-card
entities:
  battery: sensor.tineco_battery
  status: sensor.tineco_vacuum_status
  online: binary_sensor.tineco_online
```

#### Configurazione avanzata

```yaml
type: custom:tineco-card
show_footer: true
controls_open: false
image: /local/tineco_s5.png
entities:
  battery: sensor.tineco_battery
  status: sensor.tineco_vacuum_status
  charging: binary_sensor.tineco_charging
  online: binary_sensor.tineco_online
  brush_roller: sensor.tineco_brush_roller
  model: sensor.tineco_model
  fresh_water: sensor.fresh_water_tank_status
  waste_water: sensor.waste_water_tank_status
  firmware: sensor.tineco_firmware_version
  api_version: sensor.tineco_api_version
  cleaning_method: select.tineco_cleaning_method
  running_speed: select.tineco_running_speed
  suction_mode_power: select.tineco_suction_mode_power
  max_mode_power: select.tineco_max_mode_power
  max_mode_spray: select.tineco_max_mode_spray_volume
  sound_volume: select.tineco_sound_volume_level
  water_mode: switch.tineco_water_mode_enabled
  sound_enabled: switch.tineco_sound_enabled
  floor_brush_light: switch.tineco_floor_brush_light
```

---

### 📝 Parametri principali della card

| Parametro | Tipo | Descrizione |
|---|---|---|
| `type` | string | Tipo della card: `custom:tineco-card` |
| `image` | string | Path immagine custom (es. `/local/tineco.png`). Se omesso viene usato l'SVG integrato |
| `show_image` | boolean | Mostra/nasconde l'immagine/SVG (default: `true`) |
| `show_status` | boolean | Mostra il badge di stato (default: `true`) |
| `show_battery` | boolean | Mostra la barra batteria (default: `true`) |
| `show_tanks` | boolean | Mostra i serbatoi acqua (default: `true`) |
| `show_pills` | boolean | Mostra le pills informative (default: `true`) |
| `show_controls` | boolean | Mostra il pannello controlli (default: `true`) |
| `show_footer` | boolean | Mostra firmware e API version (default: `false`) |
| `controls_open` | boolean | Pannello controlli aperto di default (default: `false`) |

### 📝 Parametri entità (`entities`)

| Parametro | Tipo | Descrizione |
|---|---|---|
| `battery` | string | Sensore percentuale batteria |
| `status` | string | Sensore stato vacuum |
| `charging` | string | Sensore/switch stato ricarica |
| `online` | string | Sensore stato connessione |
| `brush_roller` | string | Sensore stato spazzola |
| `model` | string | Sensore modello dispositivo |
| `fresh_water` | string | Sensore serbatoio acqua pulita |
| `waste_water` | string | Sensore serbatoio acqua sporca |
| `firmware` | string | Sensore versione firmware |
| `api_version` | string | Sensore versione API |
| `cleaning_method` | string | Select metodo di pulizia |
| `running_speed` | string | Select velocità |
| `suction_mode_power` | string | Select potenza aspirazione |
| `max_mode_power` | string | Select potenza modalità MAX |
| `max_mode_spray` | string | Select volume spray modalità MAX |
| `sound_volume` | string | Select volume audio |
| `water_mode` | string | Switch modalità acqua |
| `sound_enabled` | string | Switch suono on/off |
| `floor_brush_light` | string | Switch luce spazzola |

---

---

## 🇬🇧 English

A Lovelace card for Home Assistant that displays the real-time status of your Tineco floor vacuum: operational status with an animated SVG that adapts to the device model, a battery bar with charging animation, fresh and waste water tank levels with color alerts, and a full control panel with dropdowns and toggles.

### Requirements

- Home Assistant 2024.8.0 or higher.
- Tineco integration installed and configured.
- HACS installed for easy update management (optional but recommended).
- Lovelace Dashboard.

---

### Installation via HACS (custom repository)

1. Open **HACS** in Home Assistant.
2. Go to **HACS Settings → Custom repositories**.
3. Add the repository:
   - **URL:** `https://github.com/MattiaSaiko/lovelace-tineco-card`
   - **Type:** Frontend
4. Save.
5. Go back to the **Frontend** section in HACS, search for **Tineco Card** and click **Install**.
6. Confirm the installation and restart the interface if requested.

> HACS automatically registers the resource as a JS module.

---

### Manual installation

1. Download the `tineco-card.js` file from the latest release of the repository.
2. Copy it to:
   ```
   config/www/community/lovelace-tineco-card/tineco-card.js
   ```
3. Restart Home Assistant.
4. Go to **Settings → Dashboard → Resources** and add:
   ```
   /local/community/lovelace-tineco-card/tineco-card.js
   ```
   Type: **JavaScript Module**

---

### Adding the card to the dashboard

1. Go to the desired dashboard.
2. Click **Edit dashboard → Add card**.
3. Search for **"Custom: Tineco Card"**.
4. Fill in the fields in the visual editor (or switch to the YAML editor) and save.

---

### YAML Configuration

The card supports both a minimal configuration and a full advanced configuration with all available entities.

#### Minimal configuration

```yaml
type: custom:tineco-card
entities:
  battery: sensor.tineco_battery
  status: sensor.tineco_vacuum_status
  online: binary_sensor.tineco_online
```

#### Full configuration

```yaml
type: custom:tineco-card
show_footer: true
controls_open: false
image: /local/tineco_s5.png
entities:
  battery: sensor.tineco_battery
  status: sensor.tineco_vacuum_status
  charging: binary_sensor.tineco_charging
  online: binary_sensor.tineco_online
  brush_roller: sensor.tineco_brush_roller
  model: sensor.tineco_model
  fresh_water: sensor.fresh_water_tank_status
  waste_water: sensor.waste_water_tank_status
  firmware: sensor.tineco_firmware_version
  api_version: sensor.tineco_api_version
  cleaning_method: select.tineco_cleaning_method
  running_speed: select.tineco_running_speed
  suction_mode_power: select.tineco_suction_mode_power
  max_mode_power: select.tineco_max_mode_power
  max_mode_spray: select.tineco_max_mode_spray_volume
  sound_volume: select.tineco_sound_volume_level
  water_mode: switch.tineco_water_mode_enabled
  sound_enabled: switch.tineco_sound_enabled
  floor_brush_light: switch.tineco_floor_brush_light
```

---

### 📝 Main card parameters

| Parameter | Type | Description |
|---|---|---|
| `type` | string | Card type: `custom:tineco-card` |
| `image` | string | Custom image path (e.g. `/local/tineco.png`). If omitted, the built-in SVG is used |
| `show_image` | boolean | Show/hide the image/SVG (default: `true`) |
| `show_status` | boolean | Show the status badge (default: `true`) |
| `show_battery` | boolean | Show the battery bar (default: `true`) |
| `show_tanks` | boolean | Show water tanks (default: `true`) |
| `show_pills` | boolean | Show info pills (default: `true`) |
| `show_controls` | boolean | Show the controls panel (default: `true`) |
| `show_footer` | boolean | Show firmware and API version (default: `false`) |
| `controls_open` | boolean | Controls panel open by default (default: `false`) |

### 📝 Entity parameters (`entities`)

| Parameter | Type | Description |
|---|---|---|
| `battery` | string | Battery percentage sensor |
| `status` | string | Vacuum status sensor |
| `charging` | string | Charging state sensor/switch |
| `online` | string | Connection state sensor |
| `brush_roller` | string | Brush roller status sensor |
| `model` | string | Device model sensor |
| `fresh_water` | string | Fresh water tank sensor |
| `waste_water` | string | Waste water tank sensor |
| `firmware` | string | Firmware version sensor |
| `api_version` | string | API version sensor |
| `cleaning_method` | string | Cleaning method select |
| `running_speed` | string | Speed select |
| `suction_mode_power` | string | Suction power select |
| `max_mode_power` | string | MAX mode power select |
| `max_mode_spray` | string | MAX mode spray volume select |
| `sound_volume` | string | Sound volume select |
| `water_mode` | string | Water mode switch |
| `sound_enabled` | string | Sound on/off switch |
| `floor_brush_light` | string | Floor brush light switch |

---

## ☕ Support

If you enjoy using Tineco Card and want to support its development, you can:

[Donate via PayPal 💙](https://www.paypal.com)

Your support helps me dedicate more time to improving this card and creating new features for the Home Assistant community.

Thank you! 🙏
