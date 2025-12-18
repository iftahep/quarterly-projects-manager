import { useRef } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'

function App() {
  const saveFunctionRef = useRef(null)

  const handleSave = () => {
    if (saveFunctionRef.current) {
      return saveFunctionRef.current()
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSave={handleSave} />
      <main className="container mx-auto px-4 py-8">
        <Dashboard saveFunctionRef={saveFunctionRef} />
      </main>
    </div>
  )
}

export default App

