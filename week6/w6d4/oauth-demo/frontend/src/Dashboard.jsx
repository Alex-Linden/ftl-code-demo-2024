import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'

function Dashboard() {
  const [user, setUser] = useState("");

  useEffect(() => {
    fetchUser()
  })

  const fetchUser = async () => {
    // Get user's GitHub username with the stored access token
    const { data } = await axios.get('http://localhost:3000/api/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      withCredentials: true
    });
    setUser(data.user);
  }

  return (
    <div>
      <h1>OAuth Demo</h1>
      <p>Logged in as {user}</p>
    </div>
  )
}

export default Dashboard;