import fs from 'fs';

// Lire le fichier
const contenu = fs.readFileSync('public/mots.txt', 'utf-8');
const mots = contenu.split('\n').map(m => m.trim()).filter(m => m);

// Terminaisons de verbes conjugués à RETIRER (liste exhaustive)
const formesCongugueesARetirer = [
    // Présent
    'ai', 'ais', 'ait', 'aient', 'as', 'at',
    'ez', 'ons', 'ont',
    'is', 'it', 'issent', 'issons', 'issez',
    // Imparfait
    'ais', 'ait', 'aient', 'iez', 'ions',
    // Passé simple
    'âmes', 'âtes', 'èrent', 'ât', 'âtes',
    'imes', 'îmes', 'ites', 'îtes', 'irent', 'îrent',
    'ûmes', 'ûtes', 'urent',
    // Futur
    'rai', 'ras', 'ra', 'rons', 'rez', 'ont',
    // Conditionnel
    'rais', 'rait', 'raient', 'riez', 'rions',
    // Subjonctif imparfait
    'asse', 'asses', 'assent', 'assiez', 'assions',
    'isse', 'isses', 'issent', 'issiez', 'issions',
    'usse', 'usses', 'ussent', 'ussiez', 'ussions',
    // Participe présent
    'ant',
];

// Terminaisons d'infinitif à GARDER
const terminaisonsInfinitif = ['er', 'ir', 're', 'oir'];

function estInfinitif(mot) {
    const motLower = mot.toLowerCase();
    // Vérifier si c'est un vrai infinitif
    return terminaisonsInfinitif.some(term => {
        if (motLower.endsWith(term)) {
            // Pour 'er', 'ir', 're' : doit avoir au moins 3 lettres
            if (term.length <= 2 && mot.length < 3) return false;
            return true;
        }
        return false;
    });
}

function estFormeConjuguee(mot) {
    const motLower = mot.toLowerCase();
    
    // Liste de patterns pour détecter les formes conjuguées
    const patterns = [
        /ais$/, /ait$/, /aient$/, /ai$/, /as$/, /a$/,  // présent/imparfait
        /âmes$/, /âtes$/, /èrent$/, /ât$/,  // passé simple
        /asse$/, /asses$/, /assent$/, /assiez$/, /assions$/,  // subjonctif
        /ons$/, /ez$/, /ont$/,  // présent
        /iez$/, /ions$/,  // imparfait/conditionnel
        /rai$/, /ras$/, /ra$/, /rons$/, /rez$/,  // futur
        /rais$/, /rait$/, /raient$/, /riez$/, /rions$/,  // conditionnel
        /erai$/, /eras$/, /era$/, /erons$/, /erez$/, /eront$/,  // futur en -er
        /erais$/, /erait$/, /eraient$/, /eriez$/, /erions$/,  // conditionnel en -er
        /imes$/, /îmes$/, /ites$/, /îtes$/, /irent$/, /îrent$/,  // passé simple
        /ûmes$/, /ûtes$/, /urent$/,  // passé simple
        /issais$/, /issait$/, /issaient$/, /issiez$/, /issions$/,  // verbes en -ir
        /issant$/,  // participe présent -issant
        /ant$/,  // participe présent
        /erent$/,  // passé simple -er
    ];
    
    return patterns.some(pattern => pattern.test(motLower));
}

function devraitEtreGarde(mot) {
    const motLower = mot.toLowerCase();
    
    // Garder les infinitifs
    if (estInfinitif(mot)) {
        return true;
    }
    
    // Retirer toutes les formes conjuguées
    if (estFormeConjuguee(mot)) {
        return false;
    }
    
    // Garder les mots se terminant par ées, és, es, e, s
    // SAUF s'ils ressemblent à des formes conjuguées
    if (motLower.endsWith('ées') || motLower.endsWith('és') || 
        motLower.endsWith('es') || motLower.endsWith('e') || motLower.endsWith('s')) {
        return true;
    }
    
    // Garder les autres mots (noms, adjectifs, etc.)
    return true;
}

// Filtrer les mots
const motsFiltres = mots.filter(mot => devraitEtreGarde(mot));

// Trier les mots
motsFiltres.sort();

// Écrire le résultat
fs.writeFileSync('public/mots_filtres.txt', motsFiltres.join('\n'), 'utf-8');

console.log(`Nombre de mots d'origine : ${mots.length}`);
console.log(`Nombre de mots après filtrage : ${motsFiltres.length}`);
console.log(`Mots retirés : ${mots.length - motsFiltres.length}`);
