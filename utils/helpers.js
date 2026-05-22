export function createDeck(name) {
  return {
    id: Date.now().toString(16) + Math.random(),
    name,
    cards: [],
  }
}

export function decodeHTMLEntities(text) {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}