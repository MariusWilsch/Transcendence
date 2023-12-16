// components/Chat.tsx
'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface Message {
  sender: string;
  message: string;
}

const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [recipientUserId, setRecipientUserId] = useState('');
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // Replace with your server URL
    setSocket(newSocket);

    newSocket.on('privateChat', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendPrivateMessage = () => {
    if (socket && recipientUserId && messageText) {
      socket.emit('privateChat', { to: recipientUserId, message: messageText});
      setMessageText('');
    }
  };

  return (
    <div>
      <div>
        <label>
          Recipient User ID:
          <input
            type="text"
            value={recipientUserId}
            onChange={(e) => setRecipientUserId(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Message:
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </label>
        <button onClick={sendPrivateMessage}>Send Private Message</button>
      </div>
      <div>
        <h2>Chat Messages</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
