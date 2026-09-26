import { onMounted, onUnmounted } from 'vue'

// Ajoute un bloc JSON-LD (schema.org) dans le <head> tant que le composant est affiché.
// `build` est appelée une fois le composant monté (le DOM est prêt) ; si elle renvoie
// null, rien n'est ajouté.
export function useJsonLd(build) {
  let script = null

  onMounted(() => {
    const data = build()
    if (!data) return

    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...data })
    document.head.appendChild(script)
  })

  // Le balisage ne doit exister que sur la page dont il décrit le contenu
  onUnmounted(() => script?.remove())
}
