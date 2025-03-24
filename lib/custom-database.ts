// Custom database context using localStorage
import type { WordItem, SentenceItem } from "./quiz-data"

// Database interface
export interface CustomDatabase {
  words: WordItem[]
  sentences: SentenceItem[]
  name: string
  author: string
  description: string
  dateCreated: string
}

// Check if custom database is uploaded
export function hasCustomDatabase(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("customQuizDatabase") !== null
}

// Get custom database
export function getCustomDatabase(): CustomDatabase | null {
  if (typeof window === "undefined") return null

  const storedData = localStorage.getItem("customQuizDatabase")
  if (!storedData) return null

  try {
    return JSON.parse(storedData) as CustomDatabase
  } catch (error) {
    console.error("Error parsing custom database:", error)
    return null
  }
}

// Save custom database
export function saveCustomDatabase(database: CustomDatabase): void {
  if (typeof window === "undefined") return
  localStorage.setItem("customQuizDatabase", JSON.stringify(database))
}

// Clear custom database
export function clearCustomDatabase(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("customQuizDatabase")
}

// Get custom words
export function getCustomWords(): WordItem[] {
  const database = getCustomDatabase()
  return database?.words || []
}

// Get custom sentences
export function getCustomSentences(): SentenceItem[] {
  const database = getCustomDatabase()
  return database?.sentences || []
}

// Get random words from custom database
export function getRandomCustomWords(count: number): WordItem[] {
  const words = getCustomWords()
  if (words.length === 0) return []

  // If requested count is greater than available words, return all words
  if (count >= words.length) return [...words]

  // Otherwise, shuffle and return requested count
  const shuffled = [...words].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Get random sentences from custom database
export function getRandomCustomSentences(count: number): SentenceItem[] {
  const sentences = getCustomSentences()
  if (sentences.length === 0) return []

  // If requested count is greater than available sentences, return all sentences
  if (count >= sentences.length) return [...sentences]

  // Otherwise, shuffle and return requested count
  const shuffled = [...sentences].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

