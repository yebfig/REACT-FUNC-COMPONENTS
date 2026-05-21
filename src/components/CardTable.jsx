import React, { memo } from 'react'
import CardRow from './CardRow'

const CardTable = memo(({ cards, deckId, onUpdateCard, onDeleteCard }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Лицевая сторона</th>
          <th>Оборотная сторона</th>
          <th>Выучена</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {cards.map(card => (
          <CardRow
            key={card.id}
            card={card}
            deckId={deckId}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </tbody>
    </table>
  )
})

export default CardTable