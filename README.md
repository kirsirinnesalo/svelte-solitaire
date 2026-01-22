# Pasianssikokoelma

Svelte-pohjainen pasianssikokoelma, joka sisältää klassisia korttipelejä.

## Aloitus

### Kehitys

```bash
# Asenna riippuvuudet
npm install

# Käynnistä kehityspalvelin
npm run dev

# Avaa selaimella
http://localhost:5173
```

### Tuotanto

```bash
# Rakenna tuotantoversioksi
npm run build

# Esikatsele rakennettua versiota
npm run preview
```

## Projektinrakenne

```
src/
├── components/          # Uudelleenkäytettävät komponentit
│   ├── CardComponent.svelte   # Yksittäinen kortti
│   └── GameSelector.svelte    # Pelivalikko
├── games/              # Peli-implementaatiot
│   ├── klondike/       # Klondike-pasianssi
│   │   └── Klondike.svelte
│   ├── napoleon/       # Napoleonin hauta
│   │   ├── Napoleon.svelte
│   │   └── napoleonRules.ts
│   ├── acesup/         # Aces Up
│   │   ├── AcesUp.svelte
│   │   └── acesUpRules.ts
│   └── clock/          # Kellopasianssi
│       ├── Clock.svelte
│       └── clockRules.ts
├── lib/                # Apufunktiot ja logiikka
│   └── cardUtils.ts    # Kortti- ja pelitoiminnot
├── types/              # TypeScript-tyyppimääritykset
│   └── game.ts
├── App.svelte          # Pääkomponentti
├── main.ts             # Sisääntulopiste
└── app.css             # Globaalit tyylit
```

## Pelit

### Klondike
Klassinen pasianssi seitsemällä tableaupinolla. Tavoite on järjestää kortit nousevaan järjestykseen foundationiin maan mukaan.
- Drag & drop -toiminnallisuus
- 1/3 kortin nosto pakasta
- Tuplaklikkaus siirtää kortin automaattisesti foundationiin

### Napoleon's Tomb (Napoleonin hauta)
Strateginen pasianssi, jossa tavoitteena on täyttää Napoleonin hauta ja neljä kulmaa.
- **Napoleonin hauta (keskus)**: Rakenna laskevasti 6→5→4→3→2→A, neljä kierrosta
- **4 kulmaa**: Rakenna nousevasti 7→8→9→10→J→Q→K (7 korttia kuhunkin)
- **4 apupinoa**: Tilapäissäilytys, max 1 kortti per pino
- Vain yksi kortti kerrallaan siirrettävissä
- Haastava, mutta palkitseva peli

### Aces Up
Nopea ja yksinkertainen pasianssi 4 pinolla.
- Tavoite: jättää vain ässät
- Poista kortteja klikkaamalla
- Automaattinen "voidaan poistaa" -havaitseminen

### Clock (Kellopasianssi)
Uniikki pasianssi, jossa kortit järjestetään kellotauluun.
- 13 pinoa: 12 kellotaulun ympärillä + kuninkaiden pino keskellä
- Klikkaa pinoa paljastaaksesi kortin
- Raahaa paljastettu kortti oikeaan paikkaan (Q=12, A=1, 2=2, ..., K=keskelle)
- Voita paljastamalla kaikki kortit ennen 4. kuninkaan asettamista

### Tulossa
- **Pyramid (Pyramidi)**: Poista pareja, joiden summa on 13
- **Yukon**: Kuten Klondike, mutta enemmän strategisia vaihtoehtoja
- **Perpetual Motion (Ikiliikkuja)**: Loputon pasianssi jatkuvalla sekoituksella

## Teknologiat

- **Svelte 4**: Reaktiivinen komponenttikirjasto
- **TypeScript**: Tyypitetty JavaScript
- **Vite**: Nopea kehityspalvelin ja rakennustyökalu
