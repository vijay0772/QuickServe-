import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [successMessage, setSuccessMessage] = useState(""); // State to store the success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3005/submit-contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
        const data = await response.json();
        if (data.status === 'success') {
            console.log('Data submitted:', data);
            setFormData({ name: "", email: "", message: "" }); // Reset form data
            setSuccessMessage("Your query has been submitted successfully. We will contact you soon."); // Set success message
        } else {
            console.error('Submission failed:', data.message);
            setSuccessMessage("Failed to submit your query. Please try again later."); // Set failure message
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        setSuccessMessage("An error occurred. Please try again later."); // Set error message
    }
  };

  return (
    <div>
      <Helmet title="Contact Us">
        <CommonSection title="Contact Us" />
        <section>
          <Container>
            <Row>
              <Col lg="6" md="6" sm="12" className="m-auto text-center">
                <form className="form mb-5" onSubmit={handleSubmit}>
                  <div className="form__group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form__group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form__group">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="addTOCart__btn">
                    Submit
                  </button>
                  {successMessage && <p className="text-success mt-3">{successMessage}</p>}
                </form>
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    </div>
  );
};

export default Contact;
