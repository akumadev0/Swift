// Types for our quiz data
export type WordItem = {
  id: number
  germanWord: string
  polishTranslation: string
  englishTranslation: string
  category: string
  difficulty: "easy" | "medium" | "hard"
}

export type SentenceItem = {
  id: number
  germanSentence: string
  polishTranslation: string
  englishTranslation: string
  category: string
  difficulty: "easy" | "medium" | "hard"
}

// Language pairs
export type LanguagePair = "de-pl" | "de-en" | "pl-de" | "pl-en" | "en-de" | "en-pl"

// Words with translations in all three languages
export const germanWords: WordItem[] = [
  {
    id: 1,
    germanWord: "Haus",
    polishTranslation: "dom",
    englishTranslation: "house",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 2,
    germanWord: "Auto",
    polishTranslation: "samochód",
    englishTranslation: "car",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 3,
    germanWord: "Buch",
    polishTranslation: "książka",
    englishTranslation: "book",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 4,
    germanWord: "Tisch",
    polishTranslation: "stół",
    englishTranslation: "table",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 5,
    germanWord: "Stuhl",
    polishTranslation: "krzesło",
    englishTranslation: "chair",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 6,
    germanWord: "Fenster",
    polishTranslation: "okno",
    englishTranslation: "window",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 7,
    germanWord: "Tür",
    polishTranslation: "drzwi",
    englishTranslation: "door",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 8,
    germanWord: "Schule",
    polishTranslation: "szkoła",
    englishTranslation: "school",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 9,
    germanWord: "Freund",
    polishTranslation: "przyjaciel",
    englishTranslation: "friend (male)",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 10,
    germanWord: "Freundin",
    polishTranslation: "przyjaciółka",
    englishTranslation: "friend (female)",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 11,
    germanWord: "Wasser",
    polishTranslation: "woda",
    englishTranslation: "water",
    category: "nouns",
    difficulty: "easy",
  },
  {
    id: 12,
    germanWord: "Brot",
    polishTranslation: "chleb",
    englishTranslation: "bread",
    category: "food",
    difficulty: "easy",
  },
  {
    id: 13,
    germanWord: "Milch",
    polishTranslation: "mleko",
    englishTranslation: "milk",
    category: "food",
    difficulty: "easy",
  },
  {
    id: 14,
    germanWord: "Apfel",
    polishTranslation: "jabłko",
    englishTranslation: "apple",
    category: "food",
    difficulty: "easy",
  },
  {
    id: 15,
    germanWord: "Banane",
    polishTranslation: "banan",
    englishTranslation: "banana",
    category: "food",
    difficulty: "easy",
  },

  {
    id: 16,
    germanWord: "arbeiten",
    polishTranslation: "pracować",
    englishTranslation: "to work",
    category: "verbs",
    difficulty: "medium",
  },
  {
    id: 17,
    germanWord: "spielen",
    polishTranslation: "grać",
    englishTranslation: "to play",
    category: "verbs",
    difficulty: "medium",
  },
  {
    id: 18,
    germanWord: "lesen",
    polishTranslation: "czytać",
    englishTranslation: "to read",
    category: "verbs",
    difficulty: "medium",
  },
  {
    id: 19,
    germanWord: "schreiben",
    polishTranslation: "pisać",
    englishTranslation: "to write",
    category: "verbs",
    difficulty: "medium",
  },
  {
    id: 20,
    germanWord: "lernen",
    polishTranslation: "uczyć się",
    englishTranslation: "to learn",
    category: "verbs",
    difficulty: "medium",
  },
  {
    id: 21,
    germanWord: "Universität",
    polishTranslation: "uniwersytet",
    englishTranslation: "university",
    category: "education",
    difficulty: "medium",
  },
  {
    id: 22,
    germanWord: "Bibliothek",
    polishTranslation: "biblioteka",
    englishTranslation: "library",
    category: "places",
    difficulty: "medium",
  },
  {
    id: 23,
    germanWord: "Krankenhaus",
    polishTranslation: "szpital",
    englishTranslation: "hospital",
    category: "places",
    difficulty: "medium",
  },
  {
    id: 24,
    germanWord: "Bahnhof",
    polishTranslation: "dworzec",
    englishTranslation: "train station",
    category: "places",
    difficulty: "medium",
  },
  {
    id: 25,
    germanWord: "Flughafen",
    polishTranslation: "lotnisko",
    englishTranslation: "airport",
    category: "places",
    difficulty: "medium",
  },

  {
    id: 26,
    germanWord: "Verantwortung",
    polishTranslation: "odpowiedzialność",
    englishTranslation: "responsibility",
    category: "abstract",
    difficulty: "hard",
  },
  {
    id: 27,
    germanWord: "Entscheidung",
    polishTranslation: "decyzja",
    englishTranslation: "decision",
    category: "abstract",
    difficulty: "hard",
  },
  {
    id: 28,
    germanWord: "Wissenschaft",
    polishTranslation: "nauka",
    englishTranslation: "science",
    category: "education",
    difficulty: "hard",
  },
  {
    id: 29,
    germanWord: "Sehenswürdigkeit",
    polishTranslation: "atrakcja turystyczna",
    englishTranslation: "tourist attraction",
    category: "tourism",
    difficulty: "hard",
  },
  {
    id: 30,
    germanWord: "Geschwindigkeit",
    polishTranslation: "prędkość",
    englishTranslation: "speed",
    category: "physics",
    difficulty: "hard",
  },
]

// German sentences with Polish and English translations
export const germanSentences: SentenceItem[] = [
  {
    id: 1,
    germanSentence: "Ich gehe zur Schule.",
    polishTranslation: "Idę do szkoły.",
    englishTranslation: "I am going to school.",
    category: "daily life",
    difficulty: "easy",
  },
  {
    id: 2,
    germanSentence: "Wie heißt du?",
    polishTranslation: "Jak się nazywasz?",
    englishTranslation: "What is your name?",
    category: "introduction",
    difficulty: "easy",
  },
  {
    id: 3,
    germanSentence: "Ich komme aus Polen.",
    polishTranslation: "Pochodzę z Polski.",
    englishTranslation: "I come from Poland.",
    category: "introduction",
    difficulty: "easy",
  },
  {
    id: 4,
    germanSentence: "Das Wetter ist heute schön.",
    polishTranslation: "Pogoda jest dzisiaj ładna.",
    englishTranslation: "The weather is nice today.",
    category: "weather",
    difficulty: "easy",
  },
  {
    id: 5,
    germanSentence: "Ich trinke gerne Kaffee.",
    polishTranslation: "Lubię pić kawę.",
    englishTranslation: "I like to drink coffee.",
    category: "food",
    difficulty: "easy",
  },

  {
    id: 6,
    germanSentence: "Ich habe gestern einen Film gesehen.",
    polishTranslation: "Wczoraj obejrzałem film.",
    englishTranslation: "I watched a movie yesterday.",
    category: "entertainment",
    difficulty: "medium",
  },
  {
    id: 7,
    germanSentence: "Kannst du mir bitte helfen?",
    polishTranslation: "Czy możesz mi pomóc?",
    englishTranslation: "Can you help me, please?",
    category: "requests",
    difficulty: "medium",
  },
  {
    id: 8,
    germanSentence: "Ich muss morgen früh aufstehen.",
    polishTranslation: "Jutro muszę wcześnie wstać.",
    englishTranslation: "I have to get up early tomorrow.",
    category: "daily life",
    difficulty: "medium",
  },
  {
    id: 9,
    germanSentence: "Wir treffen uns um 18 Uhr vor dem Kino.",
    polishTranslation: "Spotkamy się o 18:00 przed kinem.",
    englishTranslation: "We will meet at 6 PM in front of the cinema.",
    category: "appointments",
    difficulty: "medium",
  },
  {
    id: 10,
    germanSentence: "Ich lerne seit drei Jahren Deutsch.",
    polishTranslation: "Uczę się niemieckiego od trzech lat.",
    englishTranslation: "I have been learning German for three years.",
    category: "education",
    difficulty: "medium",
  },

  {
    id: 11,
    germanSentence: "Wenn ich Zeit hätte, würde ich mehr reisen.",
    polishTranslation: "Gdybym miał czas, podróżowałbym więcej.",
    englishTranslation: "If I had time, I would travel more.",
    category: "conditional",
    difficulty: "hard",
  },
  {
    id: 12,
    germanSentence: "Die Globalisierung hat sowohl Vor- als auch Nachteile.",
    polishTranslation: "Globalizacja ma zarówno zalety, jak i wady.",
    englishTranslation: "Globalization has both advantages and disadvantages.",
    category: "society",
    difficulty: "hard",
  },
  {
    id: 13,
    germanSentence: "Nachdem er sein Studium abgeschlossen hatte, fand er sofort einen Job.",
    polishTranslation: "Po ukończeniu studiów od razu znalazł pracę.",
    englishTranslation: "After completing his studies, he immediately found a job.",
    category: "career",
    difficulty: "hard",
  },
  {
    id: 14,
    germanSentence: "Obwohl es regnete, sind wir spazieren gegangen.",
    polishTranslation: "Mimo że padało, poszliśmy na spacer.",
    englishTranslation: "Although it was raining, we went for a walk.",
    category: "weather",
    difficulty: "hard",
  },
  {
    id: 15,
    germanSentence: "Je mehr ich über dieses Thema lese, desto interessanter finde ich es.",
    polishTranslation: "Im więcej czytam na ten temat, tym bardziej go znajduję interesującym.",
    englishTranslation: "The more I read about this topic, the more interesting I find it.",
    category: "education",
    difficulty: "hard",
  },
]

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

// Helper function to get word in specific language
export function getWordInLanguage(word: WordItem, language: string): string {
  switch (language) {
    case "de":
      return word.germanWord
    case "pl":
      return word.polishTranslation
    case "en":
      return word.englishTranslation
    default:
      return word.germanWord
  }
}

// Helper function to get sentence in specific language
export function getSentenceInLanguage(sentence: SentenceItem, language: string): string {
  switch (language) {
    case "de":
      return sentence.germanSentence
    case "pl":
      return sentence.polishTranslation
    case "en":
      return sentence.englishTranslation
    default:
      return sentence.germanSentence
  }
}

// Get language name from code
export function getLanguageName(code: string): string {
  switch (code) {
    case "de":
      return "Niemiecki"
    case "pl":
      return "Polski"
    case "en":
      return "Angielski"
    default:
      return code
  }
}

