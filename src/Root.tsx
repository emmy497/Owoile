import { Suspense, lazy, useEffect } from 'react'
import { Landing } from './landing/Landing.tsx'

const App = lazy(() => import('./App.tsx'))

export function Root() {
  const isConsole = window.location.pathname.startsWith('/console')

  useEffect(() => {
    document.title = isConsole ? 'Owoile Console' : 'Owoile · Rent escrow you can trust'
  }, [isConsole])

  if (!isConsole) return <Landing />
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  )
}
