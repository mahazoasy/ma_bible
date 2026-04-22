const fs = require('fs');

// Chemin du fichier source téléchargé
const raw = JSON.parse(fs.readFileSync('lsg_raw.json', 'utf8'));
const bible = { livres: [] };

// Table de correspondance anglais → français (66 livres)
const frenchNames = {
  "Genesis": "Genèse",
  "Exodus": "Exode",
  "Leviticus": "Lévitique",
  "Numbers": "Nombres",
  "Deuteronomy": "Deutéronome",
  "Joshua": "Josué",
  "Judges": "Juges",
  "Ruth": "Ruth",
  "1 Samuel": "1 Samuel",
  "2 Samuel": "2 Samuel",
  "1 Kings": "1 Rois",
  "2 Kings": "2 Rois",
  "1 Chronicles": "1 Chroniques",
  "2 Chronicles": "2 Chroniques",
  "Ezra": "Esdras",
  "Nehemiah": "Néhémie",
  "Esther": "Esther",
  "Job": "Job",
  "Psalms": "Psaumes",
  "Proverbs": "Proverbes",
  "Ecclesiastes": "Ecclésiaste",
  "Song of Solomon": "Cantique des Cantiques",
  "Isaiah": "Ésaïe",
  "Jeremiah": "Jérémie",
  "Lamentations": "Lamentations",
  "Ezekiel": "Ézéchiel",
  "Daniel": "Daniel",
  "Hosea": "Osée",
  "Joel": "Joël",
  "Amos": "Amos",
  "Obadiah": "Abdias",
  "Jonah": "Jonas",
  "Micah": "Michée",
  "Nahum": "Nahum",
  "Habakkuk": "Habacuc",
  "Zephaniah": "Sophonie",
  "Haggai": "Aggée",
  "Zechariah": "Zacharie",
  "Malachi": "Malachie",
  "Matthew": "Matthieu",
  "Mark": "Marc",
  "Luke": "Luc",
  "John": "Jean",
  "Acts": "Actes",
  "Romans": "Romains",
  "1 Corinthians": "1 Corinthiens",
  "2 Corinthians": "2 Corinthiens",
  "Galatians": "Galates",
  "Ephesians": "Éphésiens",
  "Philippians": "Philippiens",
  "Colossians": "Colossiens",
  "1 Thessalonians": "1 Thessaloniciens",
  "2 Thessalonians": "2 Thessaloniciens",
  "1 Timothy": "1 Timothée",
  "2 Timothy": "2 Timothée",
  "Titus": "Tite",
  "Philemon": "Philémon",
  "Hebrews": "Hébreux",
  "James": "Jacques",
  "1 Peter": "1 Pierre",
  "2 Peter": "2 Pierre",
  "1 John": "1 Jean",
  "2 John": "2 Jean",
  "3 John": "3 Jean",
  "Jude": "Jude",
  "Revelation": "Apocalypse"
};

// Liste des livres de l'Ancien Testament (pour déterminer testament)
const oldTestamentBooks = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
];

for (const [bookNameEng, chapters] of Object.entries(raw)) {
  const frenchName = frenchNames[bookNameEng] || bookNameEng;
  const testament = oldTestamentBooks.includes(bookNameEng) ? 'ancien' : 'nouveau';

  const livre = {
    nom: frenchName,
    abrev: frenchName.substring(0, 3),
    testament: testament,
    chapitres: []
  };

  for (const [chapNum, verses] of Object.entries(chapters)) {
    const versets = [];
    for (const [verseNum, text] of Object.entries(verses)) {
      versets.push({ numero: parseInt(verseNum), texte: text });
    }
    livre.chapitres.push({ numero: parseInt(chapNum), versets });
  }
  bible.livres.push(livre);
}

// Écriture dans assets/bible_fr.json
fs.writeFileSync('assets/bible_fr.json', JSON.stringify(bible, null, 2));
console.log('Bible française convertie → assets/bible_fr.json');