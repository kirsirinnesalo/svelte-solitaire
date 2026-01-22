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
│   └── klondike/       # Klondike-pasianssi
│       └── Klondike.svelte
├── lib/                # Apufunktiot ja logiikka
│   └── cardUtils.ts    # Kortti- ja pelitoiminnot
├── types/              # TypeScript-tyyppimääritykset
│   └── game.ts
├── App.svelte          # Pääkomponentti
├── main.ts             # Sisääntulopiste
└── app.css             # Globaalit tyylit
```

## Pelit

### Klondike (valmis)
- Klassinen pasianssi seitsemällä korttipinolla
- Perusominaisuudet: korttien jako, pakasta nostaminen, perustus- ja työpinot

### Tulossa
- **Hämähäkki (Spider)**: Haastavampi pasianssi kahdella pakalla
- **FreeCell**: Strateginen pasianssi vapailla soluilla

## Teknologiat

- **Svelte 4**: Reaktiivinen komponenttikirjasto
- **TypeScript**: Tyypitetty JavaScript
- **Vite**: Nopea kehityspalvelin ja rakennustyökalu
