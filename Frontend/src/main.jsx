import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './authContext.jsx'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import { ProjectRoutes } from './Routes.jsx'
import PageNotFound from './pageNotFound.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <ProjectRoutes />
    </Router>
  </AuthProvider>
)
