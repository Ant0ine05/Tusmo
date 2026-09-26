<template>
  <InfoPage title="Mentions légales" icon="mdi:scale-balance">
    <p class="updated">Dernière mise à jour : {{ SITE.lastUpdate }}</p>

    <h2>Éditeur du site</h2>
    <p>
      Le site <strong>{{ SITE.name }}</strong> ({{ SITE.url }}) est édité à titre non professionnel par
      <strong>{{ SITE.editorName }}</strong>, qui assure également la direction de la publication.
    </p>
    <p>
      Conformément à l'article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
      l'économie numérique (LCEN), l'éditeur a choisi de préserver son anonymat : son identité a été
      communiquée à l'hébergeur du site, qui peut la transmettre aux autorités compétentes.
    </p>
    <p>Pour toute question ou demande, vous pouvez contacter l'éditeur à l'adresse : {{ SITE.contactEmail }}.</p>

    <h2>Hébergement</h2>
    <p>Le site est hébergé par :</p>
    <ul>
      <li>Nom : {{ SITE.hostName }}</li>
      <li>Adresse : {{ SITE.hostAddress }}</li>
      <li>Contact : {{ SITE.hostContact }}</li>
    </ul>

    <h2>Propriété intellectuelle</h2>
    <p>
      L'identité visuelle de {{ SITE.name }} (logo, graphismes, textes et code du site) est la propriété de
      son éditeur. Toute reproduction ou réutilisation sans autorisation préalable est interdite, sauf
      pour un usage strictement personnel.
    </p>
    <p>
      {{ SITE.name }} est un jeu indépendant. Il s'inspire du principe des jeux de lettres <em>Motus</em>
      et <em>Wordle</em>, mais n'a aucun lien avec leurs auteurs, producteurs ou ayants droit, et n'est ni
      approuvé ni sponsorisé par eux.
    </p>

    <h2>Responsabilité</h2>
    <p>
      {{ SITE.name }} est fourni gratuitement et « en l'état ». L'éditeur s'efforce d'assurer son bon
      fonctionnement mais ne garantit ni sa disponibilité permanente, ni l'absence d'erreurs (par exemple
      dans le dictionnaire de mots). Il ne saurait être tenu responsable des dommages résultant de
      l'utilisation du site.
    </p>

    <h2>Publicité</h2>
    <p>
      Le site affiche des publicités diffusées par Google AdSense. L'éditeur n'est pas responsable du
      contenu des annonces ni des sites vers lesquels elles renvoient.
    </p>

    <h2>Données personnelles</h2>
    <p>
      Le traitement des données personnelles et l'usage des cookies sont détaillés dans notre
      <router-link to="/confidentialite">politique de confidentialité</router-link>.
    </p>

    <h2>Droit applicable</h2>
    <p>
      Le présent site et ses mentions légales sont soumis au droit français. En cas de litige, et à défaut
      de résolution amiable, les tribunaux français seront seuls compétents.
    </p>
  </InfoPage>
</template>

<script setup>
import InfoPage from '../components/InfoPage.vue';
import { SITE } from '../config/site.js';
</script>
