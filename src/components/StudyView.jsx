import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'

const StudyView = memo(({ deck, studyMode, onStopStudy, onUpdateCard }) => {
  const [queue, setQueue] = useState([])
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const sourceCards = (studyMode === 'unlearned') ? deck.cards.filter(card => !card.isLearned) : [...deck.cards]
    
    setQueue(sourceCards.map(card => card.id))
    setFlipped(false)
  }, [])

  const currentCard = useMemo(() => {
    if (queue.length === 0) return null
    return deck.cards.find(card => card.id === queue[0])
  }, [deck.cards, queue])

  const handleFlip = useCallback(() => setFlipped(true), [])

  const handleHard = useCallback(() => {
    setQueue(prev => {
      if (prev.length <= 1) return prev

      const updatedQueue = [...prev.slice(1), prev[0]]
      return updatedQueue //когда "трудно" я закидываю карточку в конец, чтобы пользователь мог еще раз проверить себя (что-то типа как в анки выбор времени, через которое появится карточка снова)
    })
    setFlipped(false)
  }, [])

  const handleEasy = useCallback(() => {
    if (!currentCard) return
    
    onUpdateCard(deck.id, currentCard.id, { isLearned: true })
    
    setQueue(prev => {
      if (prev.length === 1) return []
      return prev.slice(1) //когда "легко" удаляю карточку из очереди для изчения
    })
    setFlipped(false)
  }, [currentCard, deck.id, onUpdateCard])

  const handleStopStudy = useCallback(() =>{
    onStopStudy()
  }, [onStopStudy])

  if (queue.length === 0) {
    return (
      <section className="panel">
        <div className="row">
          <button onClick={handleStopStudy}>Вернуться в колоду</button>
        </div>
        <h2>Изучение колоды: {deck.name}</h2>
        <div className="study-screen">
          <p>Колода завершена! Все карточки отмечены как выученные.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="row">
        <button onClick={handleStopStudy}>Вернуться в колоду</button>
      </div>
      <h2>Изучение колоды: {deck.name}</h2>

      <div className="study-screen">
        <div className="flashcard large">
          <div className="flashcard-side">
            {flipped ? currentCard?.back : currentCard?.front}
          </div>
        </div>
        
        {!flipped ? (
          <div className="row centered">
            <button onClick={handleFlip}>Перевернуть</button>
          </div>
        ) : (
          <div className="row centered">
            <button onClick={handleEasy}>Легко</button>
            <button onClick={handleHard}>Трудно</button>
          </div>
        )}
        
        <div className="position">Осталось карточек: {queue.length}</div>
      </div>
    </section>
  )
})

export default StudyView