import React, { useState, useCallback, memo } from 'react'

const CardRow = memo(({ card, deckId, onUpdateCard, onDeleteCard }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editFront, setEditFront] = useState(card.front)
  const [editBack, setEditBack] = useState(card.back)

  const handleToggleLearned = useCallback((e) => {
    onUpdateCard(deckId, card.id, { isLearned: e.target.checked })
  }, [deckId, card.id, onUpdateCard])

  const handleStartEdit = useCallback(() => { 
    setIsEditing(true) 
  }, [])

  const handleCancelEdit = useCallback(() => {
  setIsEditing(false)
  setEditFront(card.front)
  setEditBack(card.back)
}, [card.front, card.back])


  const handleSaveEdit = useCallback(() => {
    if (editFront.trim() && editBack.trim()) {
      onUpdateCard(deckId, card.id, { 
        front: editFront.trim(), 
        back: editBack.trim() 
      })
      setIsEditing(false)
    }
  }, [deckId, card.id, editFront, editBack, onUpdateCard])

  const handleDeleteCard = useCallback(() => { 
    onDeleteCard(deckId, card.id)
   }, [deckId, card.id, onDeleteCard])

  if (isEditing) {
    return (
      <tr>
        <td>
          <input 
            type="text" 
            value={editFront} 
            onChange={(e) => setEditFront(e.target.value)} 
            className="table-input"
          />
        </td>
        <td>
          <input 
            type="text" 
            value={editBack} 
            onChange={(e) => setEditBack(e.target.value)} 
            className="table-input"         
          />
        </td>
        <td>{card.isLearned ? 'Да' : 'Нет'}</td>
        <td>
          <button onClick={handleSaveEdit}>Сохранить</button>
          <button onClick={handleCancelEdit}>Отмена</button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{card.front}</td>
      <td>{card.back}</td>
      <td>
        <label className="learned-toggle">
          <input
            type="checkbox"
            checked={card.isLearned}
            onChange={handleToggleLearned}
          />
          {card.isLearned ? 'Да' : 'Нет'}
        </label>
      </td>
      <td>
        <button className="delete" onClick={handleDeleteCard}>
          Удалить
        </button>
        <button onClick={handleStartEdit}>
          Редактировать
        </button>
      </td>
    </tr>
  )
})

export default CardRow