import React, { useState, useEffect, useCallback, memo } from 'react'

const QuickCreatePanel = memo(({ decks, onCreateDeck, onAddCard }) => {
  const [deckNameInput, setDeckNameInput] = useState('')
  const [cardDeckId, setCardDeckId] = useState(decks[0]?.id || '')
  const [frontInput, setFrontInput] = useState('')
  const [backInput, setBackInput] = useState('')
  const [message, setMessage] = useState('')

  const handleCreateDeck = useCallback(() => {
    if (onCreateDeck(deckNameInput)) {
      setDeckNameInput('')
      setMessage('')
    } else {
      setMessage('Введите название колоды')
    }
  }, [deckNameInput, onCreateDeck])

  const handleAddCard = useCallback(() => {
    if (!cardDeckId) {
      setMessage('Сначала создайте колоду')
      return
    }
    
    if (onAddCard(frontInput, backInput, cardDeckId)) {
      setFrontInput('')
      setBackInput('')
      setMessage('')
    } else {
      setMessage('Заполните все стороны карточки')
    }
  }, [frontInput, backInput, cardDeckId, onAddCard])

  useEffect(() => {
    if (decks.length > 0 && (!cardDeckId || !decks.find(d => d.id === cardDeckId))) {
      setCardDeckId(decks[0].id)
    }
  }, [decks, cardDeckId])

  return (
    <section className="panel home-controls">
      <h2>Быстрое создание</h2>
      <div className="row">
        <input
          type="text"
          placeholder="Название новой колоды"
          value={deckNameInput}
          onChange={(e) => setDeckNameInput(e.target.value)}
        />
        <button onClick={handleCreateDeck}>Создать колоду</button>
      </div>
      <div className="row">
        <label htmlFor="deck-select-home">Колода для карточки:</label>
        <select
          id="deck-select-home"
          value={cardDeckId}
          onChange={(e) => setCardDeckId(e.target.value)}
        >
          {decks.map(deck => (
            <option key={deck.id} value={deck.id}>{deck.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Лицевая сторона"
          value={frontInput}
          onChange={(e) => setFrontInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Оборотная сторона"
          value={backInput}
          onChange={(e) => setBackInput(e.target.value)}
        />
        <button onClick={handleAddCard}>Создать карточку</button>
      </div>
      {message && <div className="message">{message}</div>}
    </section>
  )
})

export default QuickCreatePanel