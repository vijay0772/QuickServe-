import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();  // Reference for username input
  const [successMessage, setSuccessMessage] = useState('');
  const [persona, setPersona] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    
    try {
      const response = await fetch('http://localhost:3003/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('persona', data.persona);
        localStorage.setItem('username', data.username); // Store the username received from the server
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error || response.statusText);
        alert('Login failed: ' + (errorData.error || response.statusText));
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in: ' + error.message);
    }
  };
  

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              {successMessage && <p className="text-success">{successMessage}</p>}
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input type="email" placeholder="Email" required ref={emailRef} />
                </div>
                <div className="form__group">
                  <input type="password" placeholder="Password" required ref={passwordRef} />
                </div>
                <div className="form__group">
                  <select required value={persona} onChange={e => setPersona(e.target.value)}>
                    <option value="">Select Your Persona</option>
                    <option value="Customer">Customer</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Delivery Personnel">Delivery Personnel</option>
                    <option value="System Administrator">System Administrator</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                </div>
                <button type="submit" className="addTOCart__btn">
                  Login
                </button>
              </form>
              <Link to="/register">Don't have an account? Create an account</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
