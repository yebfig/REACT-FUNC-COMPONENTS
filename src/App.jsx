import React, { useState, useEffect, useCallback, useMemo } from 'react'
import DeckList from './components/DeckList'
import DeckView from './components/DeckView'
import StudyView from './components/StudyView'
import QuickCreatePanel from './components/QuickCreatePanel'
import { loadDecksFromAPI, saveDecksToLocalStorage, loadDecksFromLocalStorage } from './utils/storage'
import { createDeck } from './utils/helpers'
import './App.css'

const App = () => {
  const [decks, setDecks] = useState([])
  const [selectedDeckId, setSelectedDeckId] = useState(null)
  const [viewMode, setViewMode] = useState('home')
  const [studyMode, setStudyMode] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const selectedDeck = useMemo(() => {
    return decks.find(deck => deck.id === selectedDeckId) || null
  }, [decks, selectedDeckId])

  useEffect(() => {
    if (decks.length > 0 && !isLoading) {
      saveDecksToLocalStorage(decks)
    }
  }, [decks, isLoading])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      
      const localDecks = loadDecksFromLocalStorage()
      
      if (localDecks !== null) {
        setDecks(localDecks)
        setIsLoading(false)
        return
      }
      
      try {
        const apiDecks = await loadDecksFromAPI()
        if (apiDecks && apiDecks.length > 0) {
          setDecks(apiDecks)
        }
      } catch (err) {
        setError('Не удалось загрузить карточки. Проверьте соединение')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  const handleCreateDeck = useCallback((deckName) => {
    const trimmedName = deckName.trim()
    if (!trimmedName) return false
    
    const newDeck = createDeck(trimmedName)
    setDecks(prev => [...prev, newDeck])
    return true
  }, [])

  const handleUpdateDeckName = useCallback((deckId, newName) => {
    setDecks(prev => prev.map(deck => 
      deck.id === deckId ? { ...deck, name: newName } : deck
    ))
  }, [])

const handleDeleteDeck = useCallback((deckId) => {
  setDecks(prev => prev.filter(deck => deck.id !== deckId))
    
  if (selectedDeckId === deckId) {
    setSelectedDeckId(null)
  }
}, [selectedDeckId])


  const handleOpenDeck = useCallback((deckId) => {
    setSelectedDeckId(deckId)
    setViewMode('deck')
  }, [])

  const handleBackToHome = useCallback(() => {
    setViewMode('home')
  }, [])

  const handleStartStudy = useCallback(() => {
    setViewMode('study')
  }, [])

  const handleStopStudy = useCallback(() => {
    setViewMode('deck')
  }, [])

  const handleResetDeckProgress = useCallback(() => {
    setDecks(prev => prev.map(deck => deck.id === selectedDeckId ? { ...deck, cards: deck.cards.map(card => ({ ...card, isLearned: false })) } : deck))
  }, [selectedDeckId])

const handleShuffleDeck = useCallback(() => {
  setDecks(prev => prev.map(deck => {
    if (deck.id !== selectedDeckId) return deck
    
    const shuffled = [...deck.cards].sort(() => Math.random() - 0.5)
    
    return { ...deck, cards: shuffled }
  }))
}, [selectedDeckId])

  const handleAddCard = useCallback((front, back, targetDeckId) => {
    if (!front.trim() || !back.trim()) return false
    
    setDecks(prev => prev.map(deck =>
      deck.id === targetDeckId
        ? { ...deck, cards: [...deck.cards, 
          { 
            id:  Date.now() + Math.floor(Math.random() * 1000),
            front: front.trim(),
            back: back.trim(),
            isLearned: false 
          }] }
        : deck
    ))
    return true
  }, [])

  const handleUpdateCard = useCallback((deckId, cardId, updates) => {
    setDecks(prev => prev.map(deck =>
      deck.id === deckId ? { ...deck, cards: deck.cards.map(card => card.id === cardId ? { ...card, ...updates } : card)} : deck))
  }, [])

  const handleDeleteCard = useCallback((deckId, cardId) => {
    setDecks(prev => prev.map(deck => deck.id === deckId ? { ...deck, cards: deck.cards.filter(card => card.id !== cardId) } : deck))
  }, [])

  if (isLoading) {
    return (
      <div className="app">
        <h1>Flashcards (Functional Components)</h1>
        <div className="panel panel-loading">
          <p>Загрузка карточек из opentdb.com...</p>
        </div>
      </div>
    )
  }

  if (error && decks.length === 0) {
    return (
      <div className="app">
        <h1>Flashcards (Functional Components)</h1>
        <div className="panel panel-loading">
          <p className="message">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Flashcards (Functional Components)</h1>

      {viewMode === 'home' && (
        <div className="home-layout">
          <QuickCreatePanel
            decks={decks}
            onCreateDeck={handleCreateDeck}
            onAddCard={handleAddCard}
          />

          <section className="panel home-decks">
            <h2>Колоды</h2>
            {decks.length === 0 ? (
              <p>Пока нет колод</p>
            ) 
            : 
            (<div className="deck-scroll">
                <DeckList
                  decks={decks}
                  onOpenDeck={handleOpenDeck}
                  onUpdateDeckName={handleUpdateDeckName}
                  onDeleteDeck={handleDeleteDeck}
                />
              </div>
            )}
          </section>
        </div>
      )}

      {viewMode === 'deck' && selectedDeck && (
        <DeckView
          deck={selectedDeck}
          studyMode={studyMode}
          onStudyModeChange={setStudyMode}
          onStartStudy={handleStartStudy}
          onBackToHome={handleBackToHome}
          onResetProgress={handleResetDeckProgress}
          onShuffleDeck={handleShuffleDeck}
          onAddCard={handleAddCard}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
        />
      )}

      {viewMode === 'study' && selectedDeck && (
        <StudyView
          deck={selectedDeck}
          studyMode={studyMode}
          onStopStudy={handleStopStudy}
          onUpdateCard={handleUpdateCard}
        />
      )}
    </div>
  )
}

export default App