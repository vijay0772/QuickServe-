import React, { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

const CustomerQueries = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch('http://localhost:3005/fetch-contacts');
                const data = await response.json();
                if (data.status === 'success') {
                    setContacts(data.data);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch contacts:', data.message);
                }
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, []);

    return (
        <div>
            <Helmet title="Customer Queries">
                <CommonSection title="Customer Queries" />
                <section>
                    <Container>
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">Loading...</td>
                                    </tr>
                                ) : contacts.map((contact, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{contact.name}</td>
                                        <td>{contact.email}</td>
                                        <td>{contact.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </section>
            </Helmet>
        </div>
    );
};

export default CustomerQueries;
