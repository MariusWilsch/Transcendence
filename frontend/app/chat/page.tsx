// components/Chat.tsx
'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

var data: User;
interface Message {
  sender: string;
  message: string;
}

type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  created_at: Date;
  updated_at: Date;
};

const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Provide a type for the messages state
  const [recipientUserId, setRecipientLogin] = useState('');
  const [messageText, setMessageText] = useState('');
  const [userData, setUserData] = useState(null);

  // useEffect(() => {
  //   const checkJwtCookie = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3001/auth/user", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         credentials: "include",
  //       });
  //       data = await response.json();
  //       // console.log("user data : ", data);
  //     } catch (error) {
  //       console.error("Error during login:", error);
  //     }
  //   };
  //   checkJwtCookie();
  //   console.log("data : ", data);
  //   const newSocket = io('http://localhost:3001', {
  //     query: { userId: data.intraId },
  //   }); // Replace with your server URL
  //   setSocket(newSocket);

  //   newSocket.on('privateChat', (data: Message)  => {
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   });

  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []);
  useEffect(() => {
    const fetchDataAndSetupSocket = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const userData = await response.json();
        setUserData(userData);
        // console.log("user data:", userData);
  
        const newSocket = io('http://localhost:3001', {
          query: { userId: userData.intraId },
        });
  
        setSocket(newSocket);
  
        newSocket.on('privateChat', (data: Message) => {
          setMessages((prevMessages) => [...prevMessages, data]);
        });
  
        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error("Error during login:", error);
      }
    };
  
    fetchDataAndSetupSocket();
  }, []);
  

  const sendPrivateMessage = () => {
    if (socket && recipientUserId && messageText) {
      socket.emit('privateChat', { to: recipientUserId, message: messageText,senderId:userData?.intraId});
      setMessageText('');
    }
  };

  return (
    <div>
      <div>
        <label>
          Recipient login:
          <input
            type="text"
            value={recipientUserId}
            onChange={(e) => setRecipientLogin(e.target.value)}
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
