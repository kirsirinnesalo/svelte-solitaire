export interface GameInstruction {
  title: string;
  goal: string;
  rules: string[];
  tips?: string[];
}

export const klondikeInstructions: GameInstruction = {
  title: 'Klondike-pasianssi',
  goal: 'Siirrä kaikki kortit neljään perustuspinoon (♥ ♦ ♣ ♠) järjestyksessä ässästä kuninkaaseen.',
  rules: [
    'Työpinoissa kortit järjestetään laskevassa järjestyksessä ja vuorotellen punaisella ja mustalla värillä (esim. punainen 7 → musta 6 → punainen 5).',
    'Voit siirtää kortteja tai korttiryhmiä työpinojen välillä noudattaen väri- ja järjestyssääntöjä.',
    'Tyhjään työpinoon voi asettaa vain kuninkaan.',
    'Perustuksiin kortit laitetaan ässästä alkaen samaa maata nousevassa järjestyksessä.',
    'Nosta kortteja pakasta yläviistosta. Pystyt käymään pakan läpi rajoittamattoman määrän kertoja.',
    'Tuplaklikkaa korttia siirtääksesi sen automaattisesti perustukseen (jos mahdollista).'
  ],
  tips: [
    'Avaa piilossa olevia kortteja työpinoissa mahdollisimman nopeasti.',
    'Älä siirrä kortteja perustukseen liian aikaisin - tarvitset niitä työpinoissa korttiryhmien siirtämiseen.',
    'Yritä pitää yksi työpino tyhjänä - se antaa enemmän liikkumatilaa.',
    'Kun kaikki kortit ovat kuvapuoli ylöspäin, peli viimeistelee automaattisesti.'
  ]
};

export const napoleonInstructions: GameInstruction = {
  title: 'Napoleon\'s Tomb (Napoleonin hauta)',
  goal: 'Siirrä kaikki kortit kahdeksaan perustuspinoon järjestyksessä 6:sta kuninkaaseen (tai päinvastoin).',
  rules: [
    'Pelissä käytetään kahta korttipakkaa (104 korttia).',
    'Neljä perustuspinoa rakennetaan nousevasti (6→7→8...→K), neljä laskevasti (7→6→5...→A).',
    'Voit siirtää kortteja 10 työpinosta perustuksiin.',
    'Työpinoissa kortit järjestetään laskevassa järjestyksessä samaa maata (esim. ♥10 → ♥9 → ♥8).',
    'Voit siirtää vain yhden kortin kerrallaan, ei korttiryhmiä.',
    'Tyhjään työpinoon voi asettaa minkä tahansa kortin.',
    'Nosta kortteja pakasta yläviistosta kun työpinot eivät tarjoa siirtoja.'
  ],
  tips: [
    'Keskity tyhjentämään työpinoja strategisesti avataksesi uusia siirtovaihtoehtoja.',
    'Vaikka perustuspinot rakentuvat samaa maata, työpinoissa voit käyttää mitä tahansa maata - hyödynnä tätä!',
    'Älä täytä kaikkia tyhjeitä paikkoja heti - tyhjät pinot ovat arvokkaita väliaikaisia säilytyspaikkoja.'
  ]
};

export const acesUpInstructions: GameInstruction = {
  title: 'Aces Up (Ässät ylös)',
  goal: 'Poista kaikki kortit paitsi neljä ässää.',
  rules: [
    'Pelissä on neljä pinoa. Alussa jokaiseen pinoon jaetaan yksi kortti.',
    'Voit poistaa kortin, jos samassa pinossa on korkeampi arvoinen kortti samaa maata toisessa pinossa.',
    'Esimerkki: Jos pinossa on ♥5 ja toisessa pinossa ♥K, voit poistaa ♥5:n.',
    'Ässät ovat arvokkaimpia kortteja, eikä niitä voi poistaa.',
    'Voit siirtää kortin tyhjään pinoon.',
    'Kun ei ole enää siirtoja, jaa neljä uutta korttia pinoihin (yksi kuhunkin).',
    'Voitat, kun vain neljä ässää jää jäljelle.'
  ],
  tips: [
    'Säästä tyhjiä pinoja! Ne ovat hyvin arvokkaita strategisesti.',
    'Yritä pitää korkeita kortteja näkyvissä, jotta voit poistaa alempia kortteja.',
    'Älä jaa uusia kortteja liian aikaisin - käytä ensin kaikki mahdolliset siirrot.'
  ]
};

export const clockInstructions: GameInstruction = {
  title: 'Clock Solitaire (Kellopasianssi)',
  goal: 'Paljasta kaikki kortit ennen kuin neljäs kuningas paljastuu.',
  rules: [
    'Kortit on jaettu 13 pinoon: 12 kellotaulun ympäri ja 1 keskellä.',
    'Paljasta pinon päällimmäinen kortti klikkaamalla sitä.',
    'Siirrä paljastettu kortti sen arvoa vastaavaan kellotaulun paikkaan: Q=12, A=1, 2-10=kelloaika, J=11, K=keskelle.',
    'Kuninkaat (K) menevät aina keskipinoon.',
    'Paljasta seuraava kortti siitä pinosta, johon juuri asetit kortin.',
    'Häviät, jos neljäs kuningas paljastuu ja on vielä kääntämättömiä kortteja.',
    'Voitat, jos kaikki kortit ovat kuvapuoli ylöspäin.'
  ],
  tips: [
    'Tämä on täysin onnenpeliä - et voi vaikuttaa lopputulokseen!',
    'Voittomahdollisuus on noin 1 / 13 (noin 7,7%).',
    'Nauti visuaalisesta kellotaulusta ja jännityksestä neljännen kuninkaan varalta.'
  ]
};
