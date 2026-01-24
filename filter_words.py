import re

# Lire le fichier
with open('public/mots.txt', 'r', encoding='utf-8') as f:
    mots = [line.strip() for line in f if line.strip()]

# Terminaisons de verbes conjugués à retirer
terminaisons_conjuguees = [
    'ai', 'ais', 'ait', 'aient', 'as', 'a',  # présent/passé simple
    'âmes', 'âtes', 'èrent', 'ât',  # passé simple
    'asse', 'asses', 'assent', 'assiez', 'assions',  # imparfait du subjonctif
    'ez', 'ons', 'ont',  # présent
    'iez', 'ions',  # imparfait/conditionnel
    'ra', 'ras', 'rai', 'rais', 'rait', 'raient', 'rez', 'riez', 'rions', 'rons', 'ront',  # futur/conditionnel
]

# Terminaisons à garder
terminaisons_a_garder = ['ées', 'és', 'es', 'e', 's']

# Terminaisons de verbes à l'infinitif
terminaisons_infinitif = ['er', 'ir', 're', 'oir']

def est_infinitif(mot):
    """Vérifie si un mot est un verbe à l'infinitif"""
    mot_lower = mot.lower()
    for term in terminaisons_infinitif:
        if mot_lower.endswith(term):
            return True
    return False

def a_terminaison_gardee(mot):
    """Vérifie si le mot a une des terminaisons à garder"""
    mot_lower = mot.lower()
    for term in terminaisons_a_garder:
        if mot_lower.endswith(term):
            return True
    return False

def est_conjugue_a_retirer(mot):
    """Vérifie si c'est une forme conjuguée à retirer"""
    mot_lower = mot.lower()
    
    # Si c'est un infinitif ou a une terminaison à garder, on le garde
    if est_infinitif(mot) or a_terminaison_gardee(mot):
        return False
    
    # Vérifier les terminaisons conjuguées à retirer
    for term in terminaisons_conjuguees:
        if mot_lower.endswith(term):
            return True
    
    return False

# Filtrer les mots
mots_filtres = []
for mot in mots:
    if not est_conjugue_a_retirer(mot):
        mots_filtres.append(mot)

# Trier les mots
mots_filtres.sort()

# Écrire le résultat
with open('public/mots_filtres.txt', 'w', encoding='utf-8') as f:
    for mot in mots_filtres:
        f.write(mot + '\n')

print(f"Nombre de mots d'origine : {len(mots)}")
print(f"Nombre de mots après filtrage : {len(mots_filtres)}")
print(f"Mots retirés : {len(mots) - len(mots_filtres)}")
