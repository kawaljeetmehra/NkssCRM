import React, { useEffect, useRef, useState } from "react";
import { Wrapper } from "../header";
import { ChatStyle, FromMsg, ShowUserComp, ToMsg } from "../../components/chatComp";
import { useSimplePOSTAPI } from "../../hooks/api";
import withRedux from "../../redux/setupRedux";

const ShowChat = (props) => {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const newWs = new WebSocket('ws://localhost:4000');
        setWs(newWs);

        return () => {
            newWs.close();
        };
    }, []);

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                const message = event.data
                if (typeof message === 'string') {
                } else if (message instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const messageText = reader.result;
                        setMessages(prevMessages => {
                            if (!prevMessages.includes(messageText)) {
                                return [...prevMessages, messageText];
                            } else {
                                return prevMessages;
                            }
                        });
                                          };
                    reader.onerror = (error) => {
                        console.error('Error reading Blob as text:', error);
                    };
                    reader.readAsText(message);
                } else {
                    console.error('Unsupported message type:', message);
                }
            };
        }
    }, [ws]);  
    
    

    const handleMessageSend = () => {
        if (ws && inputValue.trim() !== '') {
            ws.send(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleMessageSend();
        }
    };

    const chatHistoryRef = useRef(null);

    useEffect(() => {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }, [messages]);



    const {loading:UserLoading, handleAPI:fetchUser} = useSimplePOSTAPI("/api/users");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUser({}).then((data) =>  {
            // const Heading = ["Profile", "Employee", "DOJ", "Salary", "Action"];
            let mapData = data.data
                  .filter(item => props.user.user.RecordID !== item.RecordID)
                  .map(item => {
                   const Employee = item.name;
                   const Email = item.email;
                   const Designation = item.designation;
                   const id = item.RecordID;
                   const Profile = item.image;

                   return {
                       id,
                       Employee,
                       Email,
                       Designation,
                       Profile
                   }
            })

            setUsers(mapData)
        })
    }, []);

    return (
        <>
            <Wrapper>
            <ChatStyle />

                <div className="card chat-app">
                    <div id="plist" className="people-list">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><i className="fa fa-search"></i></span>
                            </div>
                            <input type="text" className="form-control" placeholder="Search..." />
                        </div>
                        <ul className="list-unstyled chat-list mt-2 mb-0">
                            
                            {users.map(item => (
                                 <>
                                    <ShowUserComp name={item.Employee} profile={item.Profile}/>
                                 </>
                            ))}
                        </ul>
                    </div>
                    <div className="chat">
                        <div className="chat-history" style={{ overflow: "auto", height: "500px" }} ref={chatHistoryRef}>
                            {/* Render chat history here */}
                            {messages.map((msg, index) => (
                                <ToMsg message={msg}/>
                            ))}
                        </div>
                        <div className="chat-message clearfix">
                            <div className="input-group mb-0">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><i className="fa fa-send"></i></span>
                                </div>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="form-control"
                                    placeholder="Enter text here..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </>
    );
};

export default withRedux(ShowChat);
