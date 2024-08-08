import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Container } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat'; // Updated icon for Bot
import PersonIcon from '@mui/icons-material/Person'; // Updated icon for User
import axios from 'axios';
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { red } from '@mui/material/colors';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newMessage = { user: 'You', text: userInput, timestamp: new Date().toLocaleTimeString() };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setUserInput('');

    try {
      const response = await axios.post('http://localhost:3002/api/getSuggestions', { query: userInput });
      const botResponse = { user: 'Bot', text: response.data.suggestion || "I'm not sure how to respond.", timestamp: new Date().toLocaleTimeString() };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      const errorMessage = { user: 'Bot', text: 'Error connecting to the server.', timestamp: new Date().toLocaleTimeString() };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  return (
    <Helmet title="QuickChat">
    <CommonSection title="Chat With our QuickAi" />
    <Box sx={{ flexGrow: 1 }}>
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom color={red}>
            QuickServe Virtual Assistant
          </Typography>
          <List sx={{ maxHeight: '60vh', overflow: 'auto', bgcolor: 'background.paper' }}>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    {message.user === 'Bot' ? <ChatIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${message.user} at ${message.timestamp}`} secondary={message.text} />
              </ListItem>
            ))}
            <div ref={endOfMessagesRef} />
          </List>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Type your message here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSendMessage} edge="end" color="primary">
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
    </Helmet>
  );
};

export default ChatComponent;
