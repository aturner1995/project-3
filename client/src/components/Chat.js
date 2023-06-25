import { useQuery, useMutation } from '@apollo/client';
import { GET_CHAT_MESSAGES } from '../utils/queries';
import { SEND_CHAT_MESSAGE } from '../utils/mutations';
import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Form from 'react-bootstrap/Form';
import AuthService from '../utils/auth';
import { io } from 'socket.io-client';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const { loading, error, data, refetch } = useQuery(GET_CHAT_MESSAGES);
    const chatMessages = data?.chatMessages || [];
    const [sending, setSending] = useState(false);
    const loggedInUserId = AuthService.getProfile().data._id;

    const [sendMessage] = useMutation(SEND_CHAT_MESSAGE);

    useEffect(() => {
        const socket = io(); // Connect to the server-side WebSocket endpoint

        socket.on('message', (message) => {
            // Handle incoming message event
            // Refetch the chat messages to update the data
            refetch();
        });

        return () => {
            socket.disconnect(); // Disconnect the socket when the component unmounts
        };
    }, [refetch]);

    const handleSendMessage = async (receiverId, e) => {
        e.preventDefault();
        try {
            setSending(true); // Set sending to true when sending starts
            await sendMessage({
                variables: { receiverId, message },
            });
            setMessage(''); // Clear the message input after sending

            const socket = io(); // Connect to the server-side WebSocket endpoint
            socket.emit('message', message); // Emit a 'message' event to the server-side
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false); // Set sending to false when sending finishes (success or error)
        }
    };

    if (loading) {
        return <div>Loading chat messages...</div>;
    }

    if (error) {
        return <div>Error fetching chat messages</div>;
    }

    const handleChatItemClick = (index) => {
        setSelectedChat(index);
    };

    return (
        <Container>
            <Row className='my-5'>
                <Col xs={4} className='chat-list card'>
                    {chatMessages.map((chat, index) => (
                        <div
                            key={chat._id}
                            className={`d-flex align-items-center p-2 chat-item ${chat.participants[1]._id === selectedChat ? 'selected' : ''
                                }`}
                            onClick={() => handleChatItemClick(index)}
                        >
                            <div className='rounded-circle profile-pic bg-secondary text-white d-flex justify-content-center align-items-center me-2'>
                                {chat.participants[1].username.charAt(0)}
                            </div>
                            <div>
                                <h5>{chat.participants[1].username}</h5>
                                <p>{chat.messages[chat.messages.length - 1].message}</p>
                            </div>
                        </div>
                    ))}
                </Col>
                <Col xs={7} className='selected-chat mx-4'>
                    {console.log()}
                    {selectedChat !== null && (
                        <div>
                            <h4>{chatMessages[selectedChat].participants[1].username}</h4>
                            {/* Render the messages for the selected chat */}
                            <div className='message-container'>
                                {chatMessages[selectedChat].messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`message-bubble ${message.sender._id === loggedInUserId ? 'right' : 'left'
                                            }`}
                                    >
                                        <p className='m-1'>{message.message}</p>
                                    </div>
                                ))}
                            </div>
                            <Form onSubmit={(e) => handleSendMessage(chatMessages[selectedChat].participants[1]._id, e)} className='d-flex p-inputgroup'>
                                <InputText type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
                                <Button type='submit' disabled={sending}>
                                    {sending ? 'Sending...' : 'Send'}
                                </Button>
                            </Form>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
