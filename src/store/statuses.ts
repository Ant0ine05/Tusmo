export type LetterStatus = 'correct' | 'present' | 'absent'

// Couleur de chaque lettre d'une proposition par rapport au mot à trouver
export const getGuessStatuses = (guess: string, target: string): LetterStatus[] => {
    const guessArr = guess.split('')
    const targetArr = target.split('')

    const result: LetterStatus[] = new Array(guess.length).fill('absent')

    const targetCounts: Record<string, number> = {}
    for (const char of targetArr) {
        targetCounts[char] = (targetCounts[char] || 0) + 1
    }

    // PASSE 1 : Les Bien Placés (Rouge) - PRIORITAIRE
    guessArr.forEach((letter, i) => {
        if (letter === targetArr[i]) {
            result[i] = 'correct'
            targetCounts[letter]--
        }
    })

    // PASSE 2 : Les Mal Placés (Jaune)
    guessArr.forEach((letter, i) => {
        if (result[i] !== 'correct') {
            if (targetCounts[letter] > 0) {
                result[i] = 'present'
                targetCounts[letter]--
            }
        }
    })

    return result
}
