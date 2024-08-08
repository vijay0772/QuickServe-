import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [successMessage, setSuccessMessage] = useState("");
  const [persona, setPersona] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await fetch("http://localhost:3003/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, persona }),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful! You can now log in to the system.");
        setTimeout(() => {
          navigate("/login"); // Redirect to the login page after a short delay
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData.error || response.statusText);
        alert("Registration failed: " + (errorData.error || response.statusText));
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("Error registering: " + error.message);
    }
  };

  return (
    <Helmet title="Register">
      <CommonSection title="Register" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    ref={usernameRef}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    ref={emailRef}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    ref={passwordRef}
                  />
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
                  Register
                </button>
              </form>
              <Link to="/login">Already have an account? Login</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Register;
