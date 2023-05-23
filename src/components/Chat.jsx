// 



import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);
  const HTTP = "http://localhost:8080/chat";

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;

    const newMessage = {
      content: inputValue,
      isUserMessage: true,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");

    axios
      .post(HTTP, { prompt: inputValue })
      .then((res) => {
        const responseMessage = {
          content: res.data,
          isUserMessage: false,
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const isMCQ = (message) => {
    const mcqRegex = /^\d+\.\s/;
    return mcqRegex.test(message);
  };

  const renderMessages = () => {
    let renderedMessages = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      if (message.isUserMessage) {
        renderedMessages.push(
          <div key={i} className="message user">
            {message.content}
          </div>
        );
      } else if (isMCQ(message.content)) {
        const mcqs = message.content.split(/\d+\.\s/);
        mcqs.shift(); // Remove the empty first element

        const mcqMessages = mcqs.map((mcq, index) => (
          <div key={i + index} className="message response mcq">
            <p>{index + 1}. {mcq}</p>
          </div>
        ));

        renderedMessages = renderedMessages.concat(mcqMessages);
      } else {
        renderedMessages.push(
          <div key={i} className="message response">
            {message.content}
          </div>
        );
      }
    }

    return renderedMessages;
  };

  return (
    <div className="container container-sm p-1">
      <h1 className="title text-center text-darkGreen">Question GPT</h1>
      <div className="chat-container">
        <div className="messages">{renderMessages()}</div>
        <div ref={scrollRef} />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="" >Ask questions</label>
          <input
            className="shadow-sm"
            type="text"
            placeholder="Enter text"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
        <button className="btn btn-accept w-100" type="submit">
          Prompt
        </button>
      </form>
    </div>
  );
}


// export default Chat;