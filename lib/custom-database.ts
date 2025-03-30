import type { WordItem, SentenceItem } from "./quiz-data"

export interface WlasnaBaza {
  words: WordItem[]
  sentences: SentenceItem[]
  name: string
  author: string
  description: string
  dateCreated: string
  language?: "de" | "en" // Add language field
}

export function czyIstniejeWlasnaBaza(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("customQuizDatabase") !== null
}

export function pobierzWlasnaBaze(): WlasnaBaza | null {
  if (typeof window === "undefined") return null

  const zapisaneDane = localStorage.getItem("customQuizDatabase")
  if (!zapisaneDane) return null

  try {
    return JSON.parse(zapisaneDane) as WlasnaBaza
  } catch (error) {
    console.error("Błąd parsowania własnej bazy:", error)
    return null
  }
}

export function zapiszWlasnaBaze(baza: WlasnaBaza): void {
  if (typeof window === "undefined") return
  localStorage.setItem("customQuizDatabase", JSON.stringify(baza))
}

export function usunWlasnaBaze(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("customQuizDatabase")
}

export function pobierzWlasneSlowa(): WordItem[] {
  const baza = pobierzWlasnaBaze()
  return baza?.words || []
}

export function pobierzWlasneZdania(): SentenceItem[] {
  const baza = pobierzWlasnaBaze()
  return baza?.sentences || []
}

export function pobierzLosoweWlasneSlowa(ilosc: number): WordItem[] {
  const slowa = pobierzWlasneSlowa()
  if (slowa.length === 0) return []

  if (ilosc >= slowa.length) return [...slowa]

  const pomieszane = [...slowa].sort(() => 0.5 - Math.random())
  return pomieszane.slice(0, ilosc)
}

export function pobierzLosoweWlasneZdania(ilosc: number): SentenceItem[] {
  const zdania = pobierzWlasneZdania()
  if (zdania.length === 0) return []

  if (ilosc >= zdania.length) return [...zdania]

  const pomieszane = [...zdania].sort(() => 0.5 - Math.random())
  return pomieszane.slice(0, ilosc)
}

