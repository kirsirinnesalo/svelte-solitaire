export interface GameInstruction {
  title: string;
  goal: string;
  rules: string[];
  tips?: string[];
}

export const klondikeInstructions: GameInstruction = {
  title: 'Klondike',
  goal: 'Siirrä kaikki kortit neljään perustuspinoon maittain (♥ ♦ ♣ ♠) järjestyksessä ässästä kuninkaaseen.',
  rules: [
    'Työpinoissa kortit järjestetään laskevassa järjestyksessä vuorotellen punaisella ja mustalla värillä (esim. punainen 7 → musta 6 → punainen 5).',
    'Voit siirtää kortteja tai korttiryhmiä työpinojen välillä noudattaen väri- ja järjestyssääntöjä.',
    'Tyhjään työpinoon voi asettaa vain kuninkaan.',
    'Perustuksiin kortit laitetaan ässästä alkaen samaa maata nousevassa järjestyksessä.',
    'Nosta kortteja pakasta (ylävasemmalla). Voit valita asetuksista nostetaanko 1 vai 3 korttia kerralla.',
    'Pakan kierrätyskerrat riippuvat asetuksista (1, 2, 3 tai rajoittamaton).'
  ],
  tips: [
    'Avaa piilossa olevia kortteja työpinoissa mahdollisimman nopeasti.',
    'Älä siirrä kortteja perustukseen liian aikaisin - tarvitset niitä työpinoissa korttiryhmien siirtämiseen.',
    'Yritä pitää yksi työpino tyhjänä - se antaa enemmän liikkumatilaa.',
    'Kun kaikki kortit ovat kuvapuoli ylöspäin, peli viimeistelee itsensä automaattisesti.'
  ]
};

export const napoleonInstructions: GameInstruction = {
  title: 'Napoleonin hauta',
  goal: 'Rakenna viisi peruspinoa: neljä vartijaa kulmiin (7→K) ja hauta keskelle (6→A, 4 kierrosta).',
  rules: [
    'Pelissä käytetään yhtä korttipakkaa (52 korttia).',
    'Neljä vartijaa kulmissa rakennetaan nousevasti seitsemästä kuninkaaseen (7→8→9→10→J→Q→K).',
    'Hauta pelin keskellä rakennetaan laskevasti kuutosesta ässään (6→5→4→3→2→A). Sykli toistuu neljä kertaa.',
    'Apupakoissa (ristin muodossa) voi säilyttää yhden kortin kerrallaan.',
    'Voit siirtää vain yhden kortin kerrallaan. Korttiryhmiä ei voi siirtää.',
    'Kuutoset menevät ensin omaan pinoonsa, josta ne siirretään hautaan.',
    'Voitat kun hauta ja vartijat ovat valmiina ja apupakat sekä käsipakka ovat tyhjiä.',
    'Häviät jos käsipakka loppuu eikä voittoehtoja ole saavutettu.'
  ],
  tips: [
    'Apupakat ovat arvokkaita - säästä niitä uusien siirtojen avaamiseen hautaan ja vartijoihin.',
    'Etusija: hauta > vartijat > kuutosten pino > apupakat.',
    'Jos apupakat täyttyvät, liikkumatilasi loppuu. Siirrä ensin pelissä jo olevat kortit.'
  ]
};

export const acesUpInstructions: GameInstruction = {
  title: 'Aces Up',
  goal: 'Jätä jäljelle vain neljä ässää.',
  rules: [
    'Pelissä on neljä pinoa. Alussa jokaiseen pinoon jaetaan yksi kortti.',
    'Voit poistaa kortin, jos toisessa pinossa on saman maan korkeampi kortti.',
    'Esimerkiksi: jos pinossa on ♥5 ja toisessa pinossa ♥K, voit poistaa ♥5:n.',
    'Ässät ovat arvokkaimpia kortteja - niitä ei voi poistaa.',
    'Voit siirtää pinon päällimmäisen kortin tyhjään pinoon.',
    'Kun siirrot loppuvat, jaa neljä uutta korttia pinoihin (yksi kuhunkin).',
    'Voitat kun vain neljä ässää jää jäljelle.'
  ],
  tips: [
    'Säästä tyhjiä pinoja! Ne ovat arvokkaita strategisesti.',
    'Pidä korkeita kortteja näkyvissä, jotta voit poistaa alempia kortteja.',
    'Älä jaa uusia kortteja liian aikaisin - käytä ensin kaikki mahdolliset siirrot.'
  ]
};

export const clockInstructions: GameInstruction = {
  title: 'Kello',
  goal: 'Paljasta kaikki kortit kellotaululla ennen kuin neljäs kuningas paljastuu.',
  rules: [
    'Kortit jaetaan 13 pinoon: 12 kellotaulun ympärille ja yksi keskelle.',
    'Aloita klikkaamalla keskipinoa paljastaaksesi ensimmäisen kortin.',
    'Siirrä paljastettu kortti sen arvon mukaiseen paikkaan kellotaululla (A=1, 2-10, J=11, Q=12 vastaavat kellotunteja ja K=keskelle).',
    'Paljasta seuraavaksi sen pinon päällimmäinen kortti, johon juuri asetit kortin.',
    'Häviät jos neljäs kuningas paljastuu ja on vielä kääntämättömiä kortteja.',
    'Voitat kun kaikki kortit ovat kuvapuoli ylöspäin ja kellotaulu on valmis.'
  ],
  tips: [
    'Tämä on puhdasta onnea - et voi vaikuttaa lopputulokseen!',
    'Voittomahdollisuus on noin 1 / 13 (noin 7,7 %).',
    'Nauti visuaalisesta kellotaulusta ja jännityksestä neljännen kuninkaan varalta.'
  ]
};
