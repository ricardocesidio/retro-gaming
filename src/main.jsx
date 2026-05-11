import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { seedDemoListings } from './utils/seedListings.js'

seedDemoListings()

createRoot(document.getElementById('root')).render(
  <App />,
)
