# Copilot-ohjeistus: Pasianssikokoelma

## Projektin yleiskuvaus

Svelte 4 + TypeScript + Vite -pohjainen pasianssikokoelma. Arkkitehtuuri nojaa komponenttipohjaiseen suunnitteluun, jossa jokainen peli on erillinen Svelte-komponentti jaettuine apufunktioineen.

## Arkkitehtuuri ja rakenne

### Komponenttihierarkia
- `App.svelte` hallitsee pelivalintaa ja renderöi valitun pelin
- `GameSelector.svelte` näyttää pelilistan ja lähettää `selectGame`-eventtejä
- Pelit sijaitsevat `src/games/{pelinimi}/` -hakemistoissa omina komponentteinaan
- Uudelleenkäytettävät komponentit (esim. `CardComponent.svelte`) sijaitsevat `src/components/`

### Tyyppijärjestelmä
- Kaikki kortti- ja pelityypit määritelty `src/types/game.ts`:ssä
- `Card`-tyyppi sisältää: `suit`, `rank`, `faceUp`, `id`
- `Suit` = `'hearts' | 'diamonds' | 'clubs' | 'spades'`
- `Rank` = `'A' | '2' ... '10' | 'J' | 'Q' | 'K'`

### Pelitoiminnot
`src/lib/cardUtils.ts` sisältää kaikki yhteiset korttipelitoiminnot:
- `createDeck()`: Luo 52-korttisen pakan
- `shuffleDeck()`: Sekoittaa pakan Fisher-Yates-algoritmilla
- `canStackOnTableau()`: Tarkistaa, voidaanko kortti asettaa työpinoon (vaihtoehtoinen väri, arvo -1)
- `canStackOnFoundation()`: Tarkistaa, voidaanko kortti asettaa perustukseen (sama maa, arvo +1)
- `getRankValue()`: Palauttaa kortin numeerisen arvon (A=1, K=13)

## Kehitystyönkulku

### Käynnistäminen
```bash
npm install          # Ensimmäinen kerta
npm run dev          # Kehityspalvelin portissa 5173
npm run build        # Tuotantoversio dist/-hakemistoon
```

### Uuden pelin lisääminen
1. Luo hakemisto `src/games/{pelinimi}/`
2. Luo pääkomponentti `{Pelinimi}.svelte` joka:
   - Ottaa vastaan `on:back`-eventille kuuntelijan
   - Hallitsee oman pelitilansa
   - Käyttää `CardComponent.svelte`-komponenttia korttien renderöintiin
3. Lisää peli `GameType`-tyyppiin (`src/types/game.ts`)
4. Lisää peli `GameSelector.svelte`:n `games`-taulukkoon
5. Lisää pelin renderöinti `App.svelte`:n `{:else if}`-lohkoon

### Pelitilojen hallinta
- Pelit käyttävät Svelte-reaktiivisuutta: `let` ja `$:` -merkinnät
- Korttipakat ovat `Card[][]` -taulukoita (esim. `tableau`, `foundations`)
- Muutokset tehdään aina uusilla taulukoilla (`[...spread]`) reaktiivisuuden säilyttämiseksi

## Tyylittely

### Väripaletti
- Vihreä pelialue: `#2d6e2d` (klassinen pöytätunne)
- Primaarinavigaatio: `#4CAF50` (vihreä)
- Punaiset maat: `#d32f2f`
- Mustat maat: `#000`

### Korttien tyylittely
- Koko: `70px × 100px`
- Pyöristetyt kulmat: `8px`
- Varjo: `0 2px 4px rgba(0,0,0,0.2)`
- Draggable-kortit: `cursor: grab`
- Kortin kääntöpuoli käyttää Unicode-symbolia `🂠`

### Responsive-suunnittelu
- Pelit skaalautuvat `max-width: 1200px` sisällä
- Käytä `grid-template-columns: repeat(auto-fit, minmax(...))` dynaamiseen layoutiin

## Tärkeät konventiot

### Event-käsittely
- Pelit kommunikoivat ylöspäin `createEventDispatcher`-avulla
- Esim. `dispatch('back')` palaa valikkoon
- Käytä TypeScript-geneerisiä eventejä: `createEventDispatcher<{ selectGame: GameType }>()`

### Tiedostorakenne
```
src/games/{pelinimi}/
  └── {Pelinimi}.svelte           # Pääkomponentti
  └── {Pelinimi}Logic.ts (opt.)   # Pelihallinta erillisessä tiedostossa
```

### Immutability korttien käsittelyssä
```typescript
// ✅ Oikein - luo uusi taulukko
pile = [...pile, card];

// ❌ Väärin - mutoi suoraan (ei triggeröi reaktiivisuutta)
pile.push(card);
```

### Drag & Drop (tuleva ominaisuus)
Käytä Svelte native drag-attribuutteja:
- `draggable={true}` elementeissä
- `on:dragstart`, `on:drop`, `on:dragover` eventeissä
- Välitä `dataTransfer` kautta kortti-ID:t

## Olemassa olevat pelit

### Klondike (src/games/klondike/)
- Klassinen pasianssi seitsemällä tableaupinolla
- Drag & drop -toiminnallisuus
- Tuplaklikkaus siirtää kortin automaattisesti foundationiin
- Referenssipeli muille toteutuksille

### Napoleon's Tomb (src/games/napoleon/)
- Kahdella pakalla pelattava strateginen pasianssi
- 10 tableaupinoa, 8 foundationpinoa
- Vain yksi kortti kerrallaan siirrettävissä
- Tableaussa laskeva järjestys samaa maata

### Aces Up (src/games/acesup/)
- Nopea ja yksinkertainen pasianssi
- 4 pinoa, tavoitteena jättää vain ässät
- Poista kortteja klikkaamalla
- Automaattinen "can remove" -havaitseminen

## Uusien pelien lisääminen

1. Luo hakemisto `src/games/{pelinimi}/`
2. Luo `{pelinimi}Rules.ts` pelisääntömoduuli:
   - Määrittele `{Pelinimi}State`-tyypit
   - Toteuta `moveCard()`, `canMove...()` -funktiot
   - Lisää `isGameWon()` ja mahdollisesti `isGameLost()`
3. Luo `{Pelinimi}.svelte` UI-komponentti
4. Lisää peli `GameType`-tyyppiin (`src/types/game.ts`)
5. Lisää peli `GameSelector.svelte`:n `games`-taulukkoon
6. Lisää pelin renderöinti `App.svelte`:n `{:else if}`-lohkoon

## Testaaminen

Käynnistä peli kehityspalvelimella ja testaa manuaalisesti:
- Korttien jako toimii oikein
- Siirrot noudattavat pelisääntöjä
- Voittotilanteet tunnistetaan
- "Uusi peli" -nappi nollaa tilan

Tulevaisuudessa harkitse Vitest + Testing Library integraatiota.
