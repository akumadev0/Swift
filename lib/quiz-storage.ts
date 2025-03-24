// Types for quiz results
export type QuizResult = {
  id: string
  date: string
  type: "words" | "sentences" | "combined"
  direction: "de-to-pl" | "pl-to-de"
  score: number
  total: number
  percentage: number
  duration: number // in seconds
}

// Save quiz result to localStorage
export function saveQuizResult(result: Omit<QuizResult, "id" | "date">): QuizResult {
  // Generate a unique ID and add timestamp
  const newResult: QuizResult = {
    ...result,
    id: generateId(),
    date: new Date().toISOString(),
  }

  // Get existing results
  const existingResults = getQuizResults()

  // Add new result
  const updatedResults = [...existingResults, newResult]

  // Save to localStorage
  localStorage.setItem("quizResults", JSON.stringify(updatedResults))

  return newResult
}

// Get all quiz results from localStorage
export function getQuizResults(): QuizResult[] {
  const resultsJson = localStorage.getItem("quizResults")
  if (!resultsJson) return []

  try {
    return JSON.parse(resultsJson)
  } catch (error) {
    console.error("Error parsing quiz results from localStorage", error)
    return []
  }
}

// Clear all quiz results
export function clearQuizResults(): void {
  localStorage.removeItem("quizResults")
}

// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get statistics from quiz results
export function getQuizStatistics() {
  const results = getQuizResults()

  if (results.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      totalWords: 0,
      totalSentences: 0,
      byType: {
        words: { count: 0, averageScore: 0 },
        sentences: { count: 0, averageScore: 0 },
        combined: { count: 0, averageScore: 0 },
      },
      byDirection: {
        "de-to-pl": { count: 0, averageScore: 0 },
        "pl-to-de": { count: 0, averageScore: 0 },
      },
      recentResults: [],
    }
  }

  // Calculate statistics
  const totalQuizzes = results.length

  const scores = results.map((r) => r.percentage)
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalQuizzes
  const bestScore = Math.max(...scores)
  const worstScore = Math.min(...scores)

  // Count by type
  const wordQuizzes = results.filter((r) => r.type === "words")
  const sentenceQuizzes = results.filter((r) => r.type === "sentences")
  const combinedQuizzes = results.filter((r) => r.type === "combined")

  // Count by direction
  const deToPlQuizzes = results.filter((r) => r.direction === "de-to-pl")
  const plToDeQuizzes = results.filter((r) => r.direction === "pl-to-de")

  // Calculate total words and sentences practiced
  const totalWords = results.reduce((sum, r) => {
    if (r.type === "words") return sum + r.total
    if (r.type === "combined") {
      // Estimate based on typical ratio in combined quizzes
      return sum + Math.round(r.total * 0.7) // Assuming 70% are words
    }
    return sum
  }, 0)

  const totalSentences = results.reduce((sum, r) => {
    if (r.type === "sentences") return sum + r.total
    if (r.type === "combined") {
      // Estimate based on typical ratio in combined quizzes
      return sum + Math.round(r.total * 0.3) // Assuming 30% are sentences
    }
    return sum
  }, 0)

  // Get recent results (last 10)
  const recentResults = [...results]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return {
    totalQuizzes,
    averageScore,
    bestScore,
    worstScore,
    totalWords,
    totalSentences,
    byType: {
      words: {
        count: wordQuizzes.length,
        averageScore:
          wordQuizzes.length > 0 ? wordQuizzes.reduce((sum, r) => sum + r.percentage, 0) / wordQuizzes.length : 0,
      },
      sentences: {
        count: sentenceQuizzes.length,
        averageScore:
          sentenceQuizzes.length > 0
            ? sentenceQuizzes.reduce((sum, r) => sum + r.percentage, 0) / sentenceQuizzes.length
            : 0,
      },
      combined: {
        count: combinedQuizzes.length,
        averageScore:
          combinedQuizzes.length > 0
            ? combinedQuizzes.reduce((sum, r) => sum + r.percentage, 0) / combinedQuizzes.length
            : 0,
      },
    },
    byDirection: {
      "de-to-pl": {
        count: deToPlQuizzes.length,
        averageScore:
          deToPlQuizzes.length > 0 ? deToPlQuizzes.reduce((sum, r) => sum + r.percentage, 0) / deToPlQuizzes.length : 0,
      },
      "pl-to-de": {
        count: plToDeQuizzes.length,
        averageScore:
          plToDeQuizzes.length > 0 ? plToDeQuizzes.reduce((sum, r) => sum + r.percentage, 0) / plToDeQuizzes.length : 0,
      },
    },
    recentResults,
  }
}

