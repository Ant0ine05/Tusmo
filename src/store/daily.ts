// Outils du "mot du jour". Un jour change à minuit heure de Paris pour tous les joueurs,
// quel que soit le fuseau de leur appareil : c'est ce qui rend le mot commun à tous.
const MS_PER_DAY = 86_400_000

const parisClock = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
})

const parisParts = (date: Date = new Date()): Record<string, string> =>
    Object.fromEntries(parisClock.formatToParts(date).map((part) => [part.type, part.value]))

// Jour courant à Paris, au format AAAA-MM-JJ
export const todayParis = (): string => {
    const { year, month, day } = parisParts()
    return `${year}-${month}-${day}`
}

// Secondes restantes avant minuit à Paris (l'heure d'été/hiver est ignorée : au pire 1 h d'écart
// deux fois par an sur un simple compte à rebours)
export const secondsUntilNextDay = (): number => {
    const { hour, minute, second } = parisParts()
    return 86_400 - (Number(hour) * 3600 + Number(minute) * 60 + Number(second))
}

// Nombre de jours écoulés depuis le 1er janvier 1970 pour une date AAAA-MM-JJ
const dayNumber = (isoDate: string): number => {
    const [year, month, day] = isoDate.split('-').map(Number)
    return Math.round(Date.UTC(year, month - 1, day) / MS_PER_DAY)
}

// Veille d'une date AAAA-MM-JJ
export const previousDay = (isoDate: string): string =>
    new Date((dayNumber(isoDate) - 1) * MS_PER_DAY).toISOString().slice(0, 10)

// "27 septembre" pour 2026-09-27
export const formatDay = (isoDate: string): string =>
    new Date(dayNumber(isoDate) * MS_PER_DAY).toLocaleDateString('fr-FR', {
        timeZone: 'UTC',
        day: 'numeric',
        month: 'long'
    })

// La liste n'est chargée que lorsqu'on joue le mot du jour
export const wordOfTheDay = async (isoDate: string): Promise<string> => {
    const { DAILY_WORDS } = await import('../config/daily-words.js')
    return DAILY_WORDS[dayNumber(isoDate) % DAILY_WORDS.length]
}
