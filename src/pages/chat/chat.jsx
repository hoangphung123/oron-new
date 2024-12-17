import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";  // Import icon cho button mở emoji
import { io } from "socket.io-client";
import "./chat.scss";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);  // Trạng thái hiển thị emoji picker
  const socketRef = useRef(null); 
  const [activeUser] = useState("270370f4-3e8f-49ab-982d-e354d1b78c4f");
  const [activeChat, setActiveChat] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Dummy data for chat list
  const chatList = [
    { id: "1", name: "Alice", avatar: "/path-to-alice-avatar.jpg" },
    { id: "2", name: "Bob", avatar: "/path-to-bob-avatar.jpg" },
    { id: "3", name: "Charlie", avatar: "/path-to-charlie-avatar.jpg" }
  ];

  // Dummy emojis to be displayed
  const emojis = ["😊", "😢", "😍", "😎", "😂", "😜", "🤔", "❤️", "🎉"];

  useEffect(() => {
    const socketURL = window.location.protocol === "http://localhost:3500" ? "wss://localhost:3500" : "ws://localhost:3500";
    
    socketRef.current = io(socketURL, {
      query: { userId: activeUser },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      setError(null);
      console.log("Connected to WebSocket server!");
    });

    socketRef.current.on("connect_error", (err) => {
      setIsConnected(false);
      setError("WebSocket connection failed: " + err.message);
      console.error("WebSocket connection failed:", err);
    });

    socketRef.current.on("connect_timeout", () => {
      setError("WebSocket connection timed out");
      console.error("WebSocket connection timed out");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      setError("WebSocket connection lost");
      console.log("WebSocket connection lost");
    });

    socketRef.current.on("receiveMessage", (message) => {
      if (message.receiverId === activeChat) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message.content, sender: "other" },
        ]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [activeUser, activeChat]);

  const handleSend = () => {
    if (input.trim() && socketRef.current && activeChat) {
      const newMessage = { text: input, sender: "me" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput(""); // Clear input field

      socketRef.current.emit("sendMessage", {
        senderId: activeUser,
        receiverId: activeChat,
        content: input, // Message content
      });
    }
  };

  const handleAddEmoji = (emoji) => {
    setInput(input + emoji);  // Thêm emoji vào ô nhập
    setIsEmojiPickerVisible(false);  // Đóng emoji picker
  };

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn chặn việc gửi form nếu có
      handleSend(); // Gửi tin nhắn khi nhấn Enter
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">Chats</div>
        <ul className="chat-list">
          {chatList.map((chat) => (
            <li
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? "active" : ""}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <img src={chat.avatar} alt={`${chat.name}'s avatar`} className="chat-item-avatar" />
              <span className="chat-item-name">{chat.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <span className="name">
            Chat with {activeChat ? chatList.find((c) => c.id === activeChat).name : ""}
          </span>
          <span className="status">{isConnected ? "Online" : "Offline"}</span>
        </div>

        {/* Show connection status */}
        <div>
          {isConnected ? (
            <p>Connected to WebSocket server</p>
          ) : (
            <p>{error || "Connecting..."}</p>
          )}
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "me" ? "my-message" : "other-message"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Field and Send Button */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}  // Thêm sự kiện onKeyDown để xử lý Enter
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>
            <FaPaperPlane />
          </button>

          {/* Emoji button */}
          <button
            className="emoji-button"
            onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
          >
            <FaSmile />
          </button>
        </div>

        {/* Emoji Picker */}
        {isEmojiPickerVisible && (
          <div className="emoji-picker">
            {emojis.map((emoji, index) => (
              <button key={index} onClick={() => handleAddEmoji(emoji)} className="emoji-item">
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
