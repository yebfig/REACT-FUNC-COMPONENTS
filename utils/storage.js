import { createDeck, decodeHTMLEntities} from './helpers'

const STORAGE_KEY = 'flashcards-class-decks'
const API = 'https://opentdb.com/api.php?amount=50'

export async function loadDecksFromAPI() 
{
  try 
  {
    const response = await fetch(API)
    const data = await response.json()
    
    if (data.response_code !== 0 || !data.results) {
      throw new Error('API error')
    }
    
    const apiDeck = createDeck('opentdb.com')
    
    apiDeck.cards = data.results.map( (item, index) => ({
      id: Date.now().toString(16) + Math.random(),
      front: decodeHTMLEntities(item.question),
      back: decodeHTMLEntities(item.correct_answer),
      isLearned: false,
    }) )
    
    return [apiDeck]
  } catch (error) 
  {
    console.error('Failed to load from API:', error)
    throw error
  }
}

export function saveDecksToLocalStorage(decks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks))
}

export function loadDecksFromLocalStorage() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return null
  
  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}