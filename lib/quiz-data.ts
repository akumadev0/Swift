// Types for our quiz data
export type WordItem = {
  id: number
  germanWord: string
  polishTranslation: string
  category: string
  difficulty: "easy" | "medium" | "hard"
}

export type SentenceItem = {
  id: number
  germanSentence: string
  polishTranslation: string
  category: string
  difficulty: "easy" | "medium" | "hard"
}

export const germanWords: WordItem[] = [
  { id: 1, germanWord: "das Kleid", polishTranslation: "sukienka", category: "ubrania", difficulty: "easy" },
  { id: 2, germanWord: "die Bluse", polishTranslation: "bluzka", category: "ubrania", difficulty: "easy" },
  { id: 3, germanWord: "der Mantel", polishTranslation: "płaszcz", category: "ubrania", difficulty: "easy" },
  { id: 4, germanWord: "die Jacke", polishTranslation: "kurtka", category: "ubrania", difficulty: "easy" },
  { id: 5, germanWord: "der Schal", polishTranslation: "szalik", category: "ubrania", difficulty: "easy" },
  { id: 6, germanWord: "die Mütze", polishTranslation: "czapka", category: "ubrania", difficulty: "easy" },
  { id: 7, germanWord: "die Hose", polishTranslation: "spodnie", category: "ubrania", difficulty: "easy" },
  { id: 8, germanWord: "der Anzug", polishTranslation: "garnitur", category: "ubrania", difficulty: "easy" },
  { id: 9, germanWord: "das Hemd", polishTranslation: "koszula", category: "ubrania", difficulty: "easy" },
  { id: 10, germanWord: "der Pulli", polishTranslation: "sweter", category: "ubrania", difficulty: "easy" },
  { id: 11, germanWord: "das T-Shirt", polishTranslation: "t-shirt", category: "ubrania", difficulty: "easy" },
  { id: 12, germanWord: "die Krawatte", polishTranslation: "krawat", category: "ubrania", difficulty: "easy" },
  { id: 13, germanWord: "die Schuhe", polishTranslation: "buty", category: "ubrania", difficulty: "easy" },
  { id: 14, germanWord: "die Sandalen", polishTranslation: "sandały", category: "ubrania", difficulty: "easy" },
  { id: 15, germanWord: "die Stiefel", polishTranslation: "kozaki", category: "ubrania", difficulty: "easy" },
  { id: 16, germanWord: "blau", polishTranslation: "niebieski", category: "kolory", difficulty: "easy" },
  { id: 17, germanWord: "braun", polishTranslation: "brązowy", category: "kolory", difficulty: "easy" },
  { id: 18, germanWord: "grün", polishTranslation: "zielony", category: "kolory", difficulty: "easy" },
  { id: 19, germanWord: "schmal", polishTranslation: "wąski", category: "opis", difficulty: "easy" },
  { id: 20, germanWord: "dunkel", polishTranslation: "ciemny", category: "opis", difficulty: "easy" },
  { id: 21, germanWord: "hell", polishTranslation: "jasny", category: "opis", difficulty: "easy" },
  { id: 22, germanWord: "rosig", polishTranslation: "różowy", category: "kolory", difficulty: "easy" },
  { id: 23, germanWord: "trägt", polishTranslation: "nosić", category: "verbs", difficulty: "easy" }
];

// German sentences with Polish translations
export const germanSentences: SentenceItem[] = [ 
  { id: 1, germanSentence: "In diesem grünen Kleid", polishTranslation: "W tej zielonej sukience", category: "ubrania", difficulty: "medium" },
  { id: 2, germanSentence: "Diese weiße Bluse", polishTranslation: "Tę białą bluzkę", category: "ubrania", difficulty: "medium" },
  { id: 3, germanSentence: "Ein schwarzer Mantel", polishTranslation: "Jakiś czarny płaszcz", category: "ubrania", difficulty: "medium" },
  { id: 4, germanSentence: "In diesem grauen Schal", polishTranslation: "W tym szarym szalu", category: "ubrania", difficulty: "medium" },
  { id: 5, germanSentence: "In einer braunen Jacke", polishTranslation: "W jakiejś brązowej kurtce", category: "ubrania", difficulty: "medium" },
  { id: 6, germanSentence: "Dieser rote Pullover", polishTranslation: "Ten czerwony sweter", category: "ubrania", difficulty: "medium" },
  { id: 7, germanSentence: "Eine blaue Mütze", polishTranslation: "Jakąś niebieską czapkę", category: "ubrania", difficulty: "medium" },
  { id: 8, germanSentence: "In diesem violetten Rock", polishTranslation: "W tej fioletowej spódnicy", category: "ubrania", difficulty: "medium" },
  { id: 9, germanSentence: "Ein rosa Anzug", polishTranslation: "Jakiś różowy garnitur", category: "ubrania", difficulty: "medium" },
  { id: 10, germanSentence: "Diese grüne Jacke", polishTranslation: "Tę zieloną marynarkę", category: "ubrania", difficulty: "medium" },
  { id: 11, germanSentence: "Sie trägt einen roten Schal mit einem grauen Kleid sowie einem schwarzen Mantel und grauen Hosen mit dunklen Schuhen.", polishTranslation: "Ona nosi czerwony szalik z szarą sukienką oraz czarnym płaszczem i szare spodnie z ciemnymi butami", category: "ubrania", difficulty: "hard" },
  { id: 12, germanSentence: "Er trägt ein rotes Hemd mit einer blauen Krawatte, einer schwarzen Hose und dunklen Schuhen.", polishTranslation: "On nosi czerwoną koszulę z niebieskim krawatem, czarnymi spodniami i ciemnymi butami", category: "ubrania", difficulty: "hard" },
  { id: 13, germanSentence: "Sie trägt ein grünes Hemd, einen grauen Rock und helle Schuhe.", polishTranslation: "Ona nosi zieloną koszulę, szarą spódnicę oraz jasne buty", category: "ubrania", difficulty: "hard" },
  { id: 14, germanSentence: "Er trägt eine schwarze Jacke, eine weiße Bluse und dunkle Schuhe.", polishTranslation: "On nosi czarną kurtkę, białą bluzkę i ciemne buty", category: "ubrania", difficulty: "medium" },
  { id: 15, germanSentence: "Sie trägt eine braune Hose, ein graues T-Shirt und helle Sandalen.", polishTranslation: "Ona nosi brązowe spodnie, szary T-shirt i jasne sandały", category: "ubrania", difficulty: "medium" },
  { id: 16, germanSentence: "Er trägt einen blauen Anzug, ein weißes Hemd und schwarze Schuhe.", polishTranslation: "On nosi niebieski garnitur, białą koszulę i czarne buty", category: "ubrania", difficulty: "medium" },
  { id: 17, germanSentence: "Sie trägt eine rote Bluse mit einer schwarzen Hose und braunen Stiefeln.", polishTranslation: "Ona nosi czerwoną bluzkę z czarnymi spodniami i brązowymi botkami", category: "ubrania", difficulty: "hard" },
  { id: 18, germanSentence: "Er trägt ein grünes Sweatshirt und eine graue Hose.", polishTranslation: "On nosi zieloną bluzę i szare spodnie", category: "ubrania", difficulty: "medium" },
  { id: 19, germanSentence: "Sie trägt eine lila Jacke und eine weiße Krawatte.", polishTranslation: "Ona nosi fioletową kurtkę i biały krawat", category: "ubrania", difficulty: "medium" },
  { id: 20, germanSentence: "Er trägt eine schwarze Mütze und einen braunen Schal.", polishTranslation: "On nosi czarną czapkę i brązowy szalik", category: "ubrania", difficulty: "medium" },
  { id: 21, germanSentence: "Sie trägt ein blaues Kleid und eine weiße Jacke.", polishTranslation: "Ona nosi niebieską sukienkę i białą kurtkę", category: "ubrania", difficulty: "medium" },
  { id: 22, germanSentence: "Er trägt einen roten Pullover und graue Hosen.", polishTranslation: "On nosi czerwony sweter i szare spodnie", category: "ubrania", difficulty: "medium" },
  { id: 23, germanSentence: "Sie trägt eine schwarze Jacke, eine graue Hose und rote Schuhe.", polishTranslation: "Ona nosi czarną kurtkę, szare spodnie i czerwone buty", category: "ubrania", difficulty: "hard" },
  { id: 24, germanSentence: "Er trägt eine weiße Bluse und einen blauen Rock.", polishTranslation: "On nosi białą bluzkę i niebieską spódnicę", category: "ubrania", difficulty: "medium" },
  { id: 25, germanSentence: "Sie trägt helle Sandalen und ein gelbes T-Shirt.", polishTranslation: "Ona nosi jasne sandały i żółty T-shirt", category: "ubrania", difficulty: "medium" },
  { id: 26, germanSentence: "Er trägt einen schwarzen Mantel und ein rotes Hemd.", polishTranslation: "On nosi czarny płaszcz i czerwoną koszulę", category: "ubrania", difficulty: "medium" },
  { id: 27, germanSentence: "Sie trägt eine graue Jacke und eine blaue Bluse.", polishTranslation: "Ona nosi szarą kurtkę i niebieską bluzkę", category: "ubrania", difficulty: "medium" },
  { id: 28, germanSentence: "Er trägt dunkle Stiefel und einen grünen Schal.", polishTranslation: "On nosi ciemne botki i zielony szalik", category: "ubrania", difficulty: "medium" },
  { id: 29, germanSentence: "Sie trägt einen violetten Rock und ein rosa Hemd.", polishTranslation: "Ona nosi fioletową spódnicę i różową koszulę", category: "ubrania", difficulty: "medium" },
  { id: 30, germanSentence: "Er trägt eine braune Hose und helle Sandalen.", polishTranslation: "On nosi brązowe spodnie i jasne sandały", category: "ubrania", difficulty: "medium" }
];


// Function to get random words for the quiz
export function getRandomWords(count: number) {
  // Shuffle the array and take 'count' items
  const shuffled = [...germanWords].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Function to get random sentences for the quiz
export function getRandomSentences(count: number) {
  // Shuffle the array and take 'count' items
  const shuffled = [...germanSentences].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

