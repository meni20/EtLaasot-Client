import { useEffect, useState } from 'react'
import './App.css'
import volunteerService from './services/volunteer.service'

function App() {
  const [count, setCount] = useState(0)

  const handleClick = async () => {
     await volunteerService.createVolunteer({
      id: "215283425",
      name: "beni",
      phone: "053248545",
      trainee_id: "15645",
      adress: "jerusalem",
      email: "benibiton3@gmail.com"
    }
    )
  }

  return (
    <>
      <h1>Volunteers</h1>

      <button onClick={() => handleClick()}>
        count is {count}
      </button>
    </>
  )
}

export default App
