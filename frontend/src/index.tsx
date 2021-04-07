import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createClient, Provider } from 'urql'

const client = createClient({
  url: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000/graphql',
})

ReactDOM.render(
  <StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)
