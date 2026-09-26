<template>
  <InfoPage title="Confidentialité" icon="mdi:shield-lock-outline">
    <p class="updated">Dernière mise à jour : {{ SITE.lastUpdate }}</p>

    <h2>Qui est responsable de ce site ?</h2>
    <p>
      Le site <strong>{{ SITE.name }}</strong> ({{ SITE.url }}) est édité par {{ SITE.editorName }}.
      Pour toute question relative à vos données personnelles, vous pouvez nous écrire à
      {{ SITE.contactEmail }}.
    </p>

    <h2>Ce que nous ne collectons pas</h2>
    <p>
      {{ SITE.name }} ne demande ni compte, ni adresse e-mail, ni mot de passe. Aucun formulaire ne vous est
      proposé et nous ne conservons aucune donnée personnelle vous concernant sur nos propres serveurs.
    </p>

    <h2>Données enregistrées sur votre appareil</h2>
    <p>
      Pour fonctionner, le jeu enregistre deux éléments dans le stockage local (<em>localStorage</em>) de
      votre navigateur :
    </p>
    <ul>
      <li><strong>tusmo_stats</strong> : vos statistiques (parties jouées, gagnées, perdues) et l'historique
        de vos 50 dernières parties ;</li>
      <li><strong>tusmo_settings</strong> : vos préférences (volume de la musique, sons, longueur des mots).</li>
    </ul>
    <p>
      Ces informations restent sur votre appareil et ne nous sont jamais transmises. Vous pouvez les
      supprimer à tout moment, soit avec le bouton « Réinitialiser » de la page Options (pour les
      statistiques), soit en effaçant les données du site dans les réglages de votre navigateur.
    </p>

    <h2>Publicité : Google AdSense</h2>
    <p>
      {{ SITE.name }} est gratuit et financé par la publicité. Nous utilisons pour cela le service
      <strong>Google AdSense</strong>. Google et ses partenaires publicitaires peuvent utiliser des cookies
      et des identifiants similaires afin d'afficher des annonces, de mesurer leur performance et de
      prévenir la fraude. Dans ce cadre, les informations suivantes peuvent être traitées : votre adresse
      IP, des identifiants de cookies, des informations sur votre navigateur et votre appareil, ainsi que
      les pages que vous consultez.
    </p>
    <p>
      Les annonces peuvent être <strong>personnalisées</strong> (selon vos centres d'intérêt) ou
      <strong>non personnalisées</strong> (selon le contenu de la page). Si vous vous trouvez dans l'Espace
      économique européen, au Royaume-Uni ou en Suisse, les cookies publicitaires ne sont déposés qu'avec
      <strong>votre consentement</strong>, recueilli via un bandeau affiché lors de votre visite. Vous
      pouvez le refuser ou retirer votre consentement à tout moment.
    </p>
    <p>Pour en savoir plus ou gérer vos choix :</p>
    <ul>
      <li>
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          Comment Google utilise les données des sites partenaires</a>
      </li>
      <li>
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
          Règles de Google sur la publicité</a>
      </li>
      <li>
        <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
          Centre de préférences publicitaires de Google</a>
      </li>
      <li>
        <a href="https://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer">
          Your Online Choices : gérer les publicités ciblées</a>
      </li>
    </ul>

    <h2>Cookies</h2>
    <p>
      {{ SITE.name }} n'utilise lui-même aucun cookie. Les seuls cookies pouvant être déposés sont ceux des
      services publicitaires décrits ci-dessus, après votre consentement le cas échéant. Vous pouvez aussi
      les bloquer ou les supprimer depuis les réglages de votre navigateur.
    </p>

    <h2>Services techniques tiers</h2>
    <ul>
      <li>
        <strong>Icônes.</strong> Les icônes du site sont chargées depuis le service Iconify
        (api.iconify.design). Votre navigateur lui envoie une requête, qui contient notamment votre
        adresse IP.
      </li>
      <li>
        <strong>Hébergement.</strong> Notre hébergeur ({{ SITE.hostName }}) peut enregistrer des journaux
        techniques de connexion (adresse IP, date, page demandée) pour assurer la sécurité et le bon
        fonctionnement du site.
      </li>
    </ul>

    <h2>Durée de conservation</h2>
    <p>
      Les données stockées dans votre navigateur y restent jusqu'à ce que vous les supprimiez. Les données
      traitées par Google et par notre hébergeur sont conservées selon leurs propres politiques.
    </p>

    <h2>Vos droits</h2>
    <p>
      Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et
      Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, de
      portabilité et d'opposition concernant vos données, ainsi que du droit de retirer votre consentement
      à tout moment. Pour exercer ces droits, contactez-nous : {{ SITE.contactEmail }}.
    </p>
    <p>
      Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez
      introduire une réclamation auprès de la
      <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer">CNIL</a>.
    </p>

    <h2>Modifications</h2>
    <p>
      Cette politique peut évoluer, par exemple si nous ajoutons de nouvelles fonctionnalités. La date de
      dernière mise à jour figure en haut de cette page.
    </p>

    <p>
      Voir aussi : <router-link to="/mentions-legales">mentions légales</router-link>.
    </p>
  </InfoPage>
</template>

<script setup>
import InfoPage from '../components/InfoPage.vue';
import { SITE } from '../config/site.js';
</script>
