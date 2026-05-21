import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { seedDemoListings } from './utils/seedListings.js'
import { seedDemoAccount } from './utils/seedDemoAccount.js'

seedDemoListings()
seedDemoAccount()

createRoot(document.getElementById('root')).render(
  <App />,
)
