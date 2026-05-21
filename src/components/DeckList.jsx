import React, { memo } from 'react'
import DeckListItem from './DeckListItem'

const DeckList = memo(({ decks, onOpenDeck, onUpdateDeckName, onDeleteDeck }) => {
  return (
    <ul className="deck-list">
      {decks.map(deck => (
        <DeckListItem
          key={deck.id}
          deck={deck}
          onOpenDeck={onOpenDeck}
          onUpdateDeckName={onUpdateDeckName}
          onDeleteDeck={onDeleteDeck}
        />
      ))}
    </ul>
  )
})

export default DeckList