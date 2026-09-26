<template>
  <InfoPage title="Règles du jeu" icon="mdi:book-open-variant">
    <h2>Le principe</h2>
    <p>
      <strong>Tomus</strong> est un jeu de mots gratuit, inspiré de l'émission <em>Motus</em> et du jeu
      <em>Wordle</em>. Un mot français est choisi au hasard et caché : votre mission est de le retrouver
      en <strong>6 essais maximum</strong>. Aucune inscription n'est nécessaire, vous pouvez jouer
      immédiatement et autant de fois que vous le souhaitez.
    </p>

    <h2>Comment jouer</h2>
    <ol>
      <li>
        Le mot à trouver compte entre <strong>5 et 8 lettres</strong> (vous pouvez régler cette plage dans
        les Options). Sa <strong>première lettre est déjà donnée</strong>.
      </li>
      <li>
        Tapez un mot de la même longueur avec votre clavier, ou avec le clavier affiché à l'écran
        (pratique sur mobile et tablette).
      </li>
      <li>
        Appuyez sur <strong>Entrée</strong> pour valider. Chaque lettre de votre proposition se colore
        pour vous indiquer si elle est bien placée, mal placée ou absente.
      </li>
      <li>
        Utilisez ces indices pour améliorer votre proposition suivante, jusqu'à trouver le mot ou
        épuiser vos 6 essais.
      </li>
    </ol>

    <h2>Le code couleur</h2>
    <ul class="legend">
      <li>
        <span class="dot correct"></span>
        <span><strong>Rouge</strong> : la lettre est dans le mot et <strong>bien placée</strong>.</span>
      </li>
      <li>
        <span class="dot present"></span>
        <span><strong>Jaune</strong> : la lettre est dans le mot mais <strong>mal placée</strong>.</span>
      </li>
      <li>
        <span class="dot absent"></span>
        <span><strong>Gris</strong> : la lettre <strong>n'est pas</strong> dans le mot.</span>
      </li>
    </ul>

    <h3>Exemple 1</h3>
    <p>Le mot caché est <strong>MONDE</strong> et vous proposez <strong>MOTEL</strong> :</p>
    <div class="example" role="img" aria-label="MOTEL : M rouge, O rouge, T gris, E jaune, L gris">
      <div class="ex-row">
        <div v-for="(cell, i) in exampleOne" :key="i" class="ex-cell" :class="cell.status">{{ cell.letter }}</div>
      </div>
      <div class="ex-row">
        <div v-for="(cell, i) in exampleOneNext" :key="i" class="ex-cell" :class="cell.status">{{ cell.letter }}</div>
      </div>
    </div>
    <ul>
      <li><strong>M</strong> et <strong>O</strong> sont bien placés.</li>
      <li><strong>T</strong> et <strong>L</strong> ne sont pas dans le mot.</li>
      <li><strong>E</strong> est dans le mot, mais pas en quatrième position : il se trouve à la fin.</li>
    </ul>
    <p>
      Sur la ligne suivante, les lettres déjà trouvées à la bonne place (ici <strong>M</strong> et
      <strong>O</strong>) sont rappelées en transparence pour vous aider à ne pas les perdre de vue.
    </p>

    <h3>Exemple 2 : les lettres en double</h3>
    <p>
      Le mot caché est <strong>TABLE</strong> et vous proposez <strong>ELEVE</strong> :
    </p>
    <div class="example" role="img" aria-label="ELEVE : E gris, L jaune, E gris, V gris, E rouge">
      <div class="ex-row">
        <div v-for="(cell, i) in exampleTwo" :key="i" class="ex-cell" :class="cell.status">{{ cell.letter }}</div>
      </div>
    </div>
    <p>
      Le mot caché ne contient qu'<strong>un seul E</strong>, et il est en dernière position. Seul le
      dernier E de votre proposition est donc rouge ; les deux autres sont grisés. Une lettre n'est jamais
      colorée plus de fois qu'elle n'apparaît dans le mot à trouver.
    </p>

    <AdBanner :ad-slot="AD_SLOTS.rules" />

    <h2>Les règles à connaître</h2>
    <ul>
      <li>
        <strong>Le mot doit exister.</strong> Chaque proposition doit être un mot du dictionnaire du jeu,
        de la bonne longueur. Si le mot n'est pas reconnu, la ligne est simplement effacée : vous ne
        perdez pas d'essai.
      </li>
      <li>
        <strong>Pas d'accents à taper.</strong> Écrivez E pour É, È ou Ê, C pour Ç, et ainsi de suite. Le
        « Œ » s'écrit OE.
      </li>
      <li>
        <strong>Uniquement des lettres.</strong> Les mots avec trait d'union, apostrophe ou espace ne sont
        pas utilisés.
      </li>
      <li>
        <strong>La première lettre est verrouillée.</strong> Elle est fournie et ne peut pas être effacée.
      </li>
      <li>
        <strong>Le clavier à l'écran</strong> se colore lui aussi au fil de vos essais, pour garder une
        trace des lettres déjà testées.
      </li>
    </ul>

    <h2>Les commandes</h2>
    <ul>
      <li><strong>Lettres A à Z</strong> : ajoutent une lettre à votre proposition.</li>
      <li><strong>Retour arrière</strong> : efface la dernière lettre saisie.</li>
      <li><strong>Entrée</strong> : valide la proposition, une fois le mot complet.</li>
    </ul>

    <h2>Les options</h2>
    <p>
      Depuis le menu <strong>Options</strong>, vous pouvez régler le volume de la musique, activer ou
      couper les sons, et choisir la longueur minimale et maximale des mots (de 5 à 8 lettres).
      Attention : modifier la longueur des mots lance une nouvelle partie.
    </p>

    <h2>Le mot du jour et la série</h2>
    <p>
      En plus des parties libres, Tomus propose un <strong>mot du jour</strong> : chaque jour, un seul mot est
      à deviner, <strong>le même pour tous les joueurs</strong>. Il change à minuit, heure de Paris, et vous
      n'avez qu'une partie par jour. Ce mode ignore les réglages de longueur des Options.
    </p>
    <p>
      Chaque mot du jour trouvé prolonge votre <strong>série</strong> d'un jour. Si vous perdez, ou si vous
      laissez passer un jour sans jouer, la série repart de zéro. Votre série en cours et votre meilleure
      série sont visibles dans la page <strong>Stats</strong>.
    </p>

    <h2>Fin de partie et statistiques</h2>
    <p>
      Si vous trouvez le mot, la partie est gagnée et le nombre d'essais utilisés est affiché. Si vous
      épuisez vos 6 essais, la partie est perdue et le mot vous est révélé. Dans les deux cas, vous pouvez
      relancer immédiatement une partie libre avec un nouveau mot tiré au hasard.
    </p>
    <p>
      Vos résultats (parties jouées, gagnées, perdues, taux de réussite, série du mot du jour et
      historique de vos 50 dernières parties) sont consultables dans la page <strong>Stats</strong>. Ils sont enregistrés uniquement dans
      votre navigateur, sur votre appareil.
    </p>

    <h2>Nos conseils pour progresser</h2>
    <ul>
      <li>
        Sur un premier essai, privilégiez un mot qui contient des lettres très courantes en français :
        <strong>E, A, I, S, R, N, T</strong>.
      </li>
      <li>
        Une lettre jaune vous apprend qu'elle est dans le mot : essayez-la à une autre position lors de
        l'essai suivant.
      </li>
      <li>
        Ne gâchez pas d'essais avec des lettres grises : elles n'apparaissent pas dans le mot, inutile de
        les réutiliser.
      </li>
      <li>
        Pensez aux terminaisons fréquentes (<strong>-ER</strong>, <strong>-ES</strong>,
        <strong>-ENT</strong>, <strong>-ION</strong>…) et aux lettres doubles (<strong>LL</strong>,
        <strong>SS</strong>, <strong>RR</strong>…).
      </li>
      <li>
        Profitez des lettres rouges déjà trouvées, rappelées en transparence sur chaque nouvelle ligne,
        pour figer une partie du mot et concentrer votre réflexion sur le reste.
      </li>
    </ul>

    <h2>Questions fréquentes</h2>

    <!-- Chaque h3 suivi de son p devient une question du balisage FAQPage (voir le script).
         Le h2 reste hors de la section : InfoPage annule la marge d'un h2 premier enfant. -->
    <section ref="faqSection">
    <h3>Le mot change-t-il chaque jour ?</h3>
    <p>
      Cela dépend du mode. Le mot du jour change chaque jour à minuit (heure de Paris) et il est le même
      pour tous les joueurs. En mode « Jouer », un nouveau mot est tiré au hasard à chaque partie : vous
      pouvez donc enchaîner autant de parties que vous le souhaitez.
    </p>

    <h3>Comment fonctionne la série ?</h3>
    <p>
      La série compte les mots du jour gagnés plusieurs jours de suite. Elle repart de zéro si vous perdez
      ou si vous manquez un jour.
    </p>

    <h3>Le jeu est-il gratuit ?</h3>
    <p>
      Oui, Tomus est entièrement gratuit et sans inscription. Le site est financé par la publicité, voir
      notre <router-link to="/confidentialite">politique de confidentialité</router-link> pour en savoir
      plus.
    </p>

    <h3>Mes statistiques sont-elles sauvegardées ?</h3>
    <p>
      Oui, mais uniquement sur l'appareil et dans le navigateur que vous utilisez. Si vous changez
      d'appareil ou effacez les données du site, elles seront perdues.
    </p>

    <h3>Pourquoi mon mot est-il refusé ?</h3>
    <p>
      Il n'a probablement pas la bonne longueur ou il ne figure pas dans le dictionnaire du jeu. Vérifiez
      l'orthographe (sans accents) et essayez un autre mot.
    </p>
    </section>

    <p>
      Prêt à jouer ? <router-link to="/game">Lancer une partie</router-link>
    </p>
  </InfoPage>
</template>

<script setup>
import { ref } from 'vue';
import InfoPage from '../components/InfoPage.vue';
import AdBanner from '../components/AdBanner.vue';
import { AD_SLOTS } from '../config/ads.js';
import { useJsonLd } from '../composables/useJsonLd.js';

// Balisage FAQPage (schema.org) construit depuis le texte affiché : il ne peut pas
// diverger de la page, et une question ajoutée dans la section est prise en compte seule.
const faqSection = ref(null);

const visibleText = (el) => el.textContent.replace(/\s+/g, ' ').trim();

useJsonLd(() => ({
  '@type': 'FAQPage',
  mainEntity: [...faqSection.value.querySelectorAll('h3')]
    .filter((question) => question.nextElementSibling)
    .map((question) => ({
      '@type': 'Question',
      name: visibleText(question),
      acceptedAnswer: { '@type': 'Answer', text: visibleText(question.nextElementSibling) }
    }))
}));

// Construit une ligne d'exemple à partir d'un mot et de ses statuts, lettre par lettre
const buildRow = (word, statuses) =>
  word.split('').map((letter, i) => ({ letter, status: statuses[i] }));

// Cible : MONDE, proposition : MOTEL
const exampleOne = buildRow('MOTEL', ['correct', 'correct', 'absent', 'present', 'absent']);
// Ligne suivante : seules les lettres bien placées sont rappelées
const exampleOneNext = buildRow('MO...', ['hint', 'hint', 'placeholder', 'placeholder', 'placeholder']);

// Cible : TABLE, proposition : ELEVE
const exampleTwo = buildRow('ELEVE', ['absent', 'present', 'absent', 'absent', 'correct']);
</script>

<style scoped>
.legend {
  list-style: none;
  padding-left: 0;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dot {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.dot.correct {
  background: var(--color-correct);
}

.dot.present {
  background: var(--color-present);
}

.dot.absent {
  background: var(--color-absent);
}

/* Cases d'exemple, calquées sur celles de la grille de jeu */
.example {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 1rem 0 1.25rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.ex-row {
  display: flex;
  gap: 6px;
}

.ex-cell {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: 700;
  user-select: none;
}

.ex-cell.correct {
  background: linear-gradient(145deg, var(--color-correct), #B71C1C);
  border-color: var(--color-correct);
}

.ex-cell.present {
  background: linear-gradient(145deg, var(--color-present), #F9A825);
  border-color: var(--color-present);
  color: #1E293B;
  font-weight: 800;
}

.ex-cell.absent {
  background: linear-gradient(145deg, rgba(120, 144, 156, 0.6), rgba(96, 125, 139, 0.8));
  border-color: rgba(120, 144, 156, 0.4);
  opacity: 0.7;
}

.ex-cell.hint {
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.5;
}

.ex-cell.placeholder {
  color: rgba(255, 255, 255, 0.3);
  opacity: 0.3;
}

@media (max-width: 480px) {
  .ex-cell {
    width: 38px;
    height: 38px;
    font-size: 1.25rem;
  }
}
</style>
