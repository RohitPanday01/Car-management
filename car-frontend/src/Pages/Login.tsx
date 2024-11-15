import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {BACKEND_URL} from '../config'

function Login(){
   
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e : any) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, { email, password });
      console.log("Response data:", response.data);
      const jwt = response.data.jwt
      console.log("jwt is" ,jwt)
      localStorage.setItem("token", jwt) 
      navigate('/products');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
        
    
}

export default Login;