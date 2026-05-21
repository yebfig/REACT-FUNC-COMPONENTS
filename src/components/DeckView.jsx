import React, { useState, useCallback, memo } from 'react'
import CardTable from './CardTable'

const DeckView = memo(({
  deck,
  studyMode,
  onStudyModeChange,
  onStartStudy,
  onBackToHome,
  onResetProgress,
  onShuffleDeck,
  onAddCard,
  onUpdateCard,
  onDeleteCard,
}) => {
  const [frontInput, setFrontInput] = useState('')
  const [backInput, setBackInput] = useState('')
  const [message, setMessage] = useState('')

  const handleAddCard = useCallback(() => {
    if (!frontInput.trim() || !backInput.trim()) {
      setMessage('Заполните обе стороны карточки')
      return
    }
    
    if (onAddCard(frontInput, backInput, deck.id)) {
      setFrontInput('')
      setBackInput('')
      setMessage('')
    }
  }, [frontInput, backInput, deck.id, onAddCard])

  const handleResetProgress = useCallback(() => {
    if (window.confirm('Сбросить прогресс всех карточек в этой колоде?')) {
      onResetProgress()
    }
  }, [onResetProgress])


  const handleStudyModeChange = useCallback((e) => {
    onStudyModeChange(e.target.value)
  }, [onStudyModeChange])


  return (
    <>
      <section className="panel">
        <div className="row">
          <button onClick={onBackToHome}>На главный экран</button>
        </div>
        <h2>Колода: {deck.name}</h2>
        <div className="row">
          <button onClick={handleResetProgress}>Сбросить прогресс колоды</button>
          <button onClick={onShuffleDeck}>Перемешать колоду</button>
          <label htmlFor="study-mode">Режим изучения:</label>
          <select
            id="study-mode"
            value={studyMode}
            onChange={handleStudyModeChange}
          >
            <option value="all">Все карточки</option>
            <option value="unlearned">Только невыученные</option>
          </select>
          <button onClick={onStartStudy}>Изучать</button>
        </div>
      </section>

      <section className="panel">
        <h2>Добавить / редактировать карточку</h2>
        <div className="row">
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

      <section className="panel">
        <h2>Список карточек ({deck.cards.length})</h2>
        {deck.cards.length === 0 ? (
          <p>В этой колоде пока нет карточек.</p>
        ) : (
          <div className="cards-scroll">
            <CardTable
              cards={deck.cards}
              deckId={deck.id}
              onUpdateCard={onUpdateCard}
              onDeleteCard={onDeleteCard}
            />
          </div>
        )}
      </section>
    </>
  )
})

export default DeckView