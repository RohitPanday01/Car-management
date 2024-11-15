import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BACKEND_URL } from "../config";

function SignUp (){
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name , setname ] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, { email, password , name });
      console.log("Response data:", response.data);
      const jwt = response.data.jwt
      console.log("jwt is" ,jwt)
      localStorage.setItem("token", jwt)
      navigate('/login');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="name" 
          value={name} 
          onChange={(e) => setname(e.target.value)} 
          placeholder="name" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;