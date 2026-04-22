const fs = require('fs');

const sourcePath = '/home/judi/ma-bible/french_louis_segond_1910/French Louis Segond (1910).json';
let content = fs.readFileSync(sourcePath, 'utf8');
if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

let raw;
try {
  raw = eval('(' + content + ')');
} catch (e) {
  console.error('Erreur de parsing:', e);
  process.exit(1);
}

const bible = { livres: [] };

// Liste des livres de l'Ancien Testament (noms français)
const oldTestamentNames = [
  "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome", "Josué", "Juges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Rois", "2 Rois", "1 Chroniques", "2 Chroniques", "Esdras",
  "Néhémie", "Esther", "Job", "Psaumes", "Proverbes", "Ecclésiaste", "Cantique des Cantiques",
  "Ésaïe", "Jérémie", "Lamentations", "Ézéchiel", "Daniel", "Osée", "Joël", "Amos",
  "Abdias", "Jonas", "Michée", "Nahum", "Habacuc", "Sophonie", "Aggée", "Zacharie", "Malachie"
];

for (const testament of raw.Testaments) {
  for (const book of testament.Books) {
    const bookName = book.Text; // Le nom du livre est dans 'Text'
    if (!bookName) {
      console.error("Nom de livre manquant", book);
      continue;
    }
    const testamentType = oldTestamentNames.includes(bookName) ? 'ancien' : 'nouveau';

    const livre = {
      nom: bookName,
      abrev: bookName.substring(0, 3),
      testament: testamentType,
      chapitres: []
    };

    for (const chapter of book.Chapters) {
      // Le numéro du chapitre est dans chapter.ID
      const chapitreNumero = chapter.ID;
      if (!chapitreNumero) {
        console.warn("Chapitre sans ID, ignoré");
        continue;
      }
      const versets = [];
      if (chapter.Verses && Array.isArray(chapter.Verses)) {
        for (const verse of chapter.Verses) {
          versets.push({
            numero: verse.ID,
            texte: verse.Text
          });
        }
      }
      livre.chapitres.push({
        numero: chapitreNumero,
        versets: versets
      });
    }

    // Trier les chapitres par numéro
    livre.chapitres.sort((a, b) => a.numero - b.numero);
    bible.livres.push(livre);
  }
}

const outputPath = 'assets/bible_fr.json';
fs.writeFileSync(outputPath, JSON.stringify(bible, null, 2));
console.log(`✅ Bible convertie avec succès → ${outputPath}`);