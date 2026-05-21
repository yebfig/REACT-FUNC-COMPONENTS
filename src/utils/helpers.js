export function createDeck(name) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name,
    cards: [],
  }
}

export function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}