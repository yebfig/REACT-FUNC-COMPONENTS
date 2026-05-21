import React, { useState, useCallback, memo } from 'react'

const DeckListItem = memo(({ deck, onOpenDeck, onUpdateDeckName, onDeleteDeck }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(deck.name)

  const handleSave = useCallback(() => {
    if (editName.trim()) {
      onUpdateDeckName(deck.id, editName.trim())
      setIsEditing(false)
    }
  }, [deck.id, editName, onUpdateDeckName])

  const handleCancel = useCallback(() => {
    setEditName(deck.name)
    setIsEditing(false)
  }, [deck.name])

  const handleOpenDeck = useCallback(() => {
    onOpenDeck(deck.id)
  }, [deck.id, onOpenDeck])

  const handleDeleteDeck = useCallback(() => {
    onDeleteDeck(deck.id)
  }, [deck.id, onDeleteDeck])

  const handleStartEditing = useCallback(() => {
    setIsEditing(true)
  }, [])


  return (
    <li className="deck-item">
      {isEditing ? (
        <div className="deck-edit">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            autoFocus
          />
          <button onClick={handleSave}>Сохранить</button>
          <button onClick={handleCancel}>Отмена</button>
        </div>
      ) : (
        <>
          <span className="deck-name">
            {deck.name} ({deck.cards.length})
          </span>
          <div className="deck-actions">
            <button onClick={handleOpenDeck}>Открыть</button>
            <button onClick={handleStartEditing}>Редактировать</button>
            <button className="delete" onClick={handleDeleteDeck}>
              Удалить
            </button>
          </div>
        </>
      )}
    </li>
  )
})

export default DeckListItem