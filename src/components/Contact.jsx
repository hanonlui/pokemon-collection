import React, { useState, useEffect } from 'react';

const ContactPage = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/messagesAll'); // Replace with your actual API endpoint
            const data = await response.json();
            setMessages(data);
        } catch (err){
            console.log(`error!! ${err}`);
        }

      };
  
      fetchData();
    }, []);
  
    return (
        <div>
            <table className="table table-light table-striped table-bordered">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Message</th>
                    <th>Like</th>
                </tr>
                </thead>
                <tbody>
                {messages.map(message => (
                    <tr key={message.mid}>
                    <td>{message.mid}</td>
                    <td>{message.content}</td>
                    <td>{message.like}</td>
                    </tr>
                ))}
                </tbody>
            </table>   
            <div>
                Provided by HanonLui (2024)
            </div>
        </div>
    );
  }
 
export default ContactPage;