import { Route, Switch } from 'wouter'
import Navbar from './components/Navbar.tsx'
import HomePage from './pages/HomePage.tsx'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 py-10">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route>
            <p className="text-lg">No encontramos esta página. Vuelve al inicio.</p>
          </Route>
        </Switch>
      </main>
    </>
  )
}
