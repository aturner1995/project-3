import React, { useState, useEffect } from 'react';
import { GET_CONVERSATION } from '../utils/queries';
import { SEND_CHAT_MESSAGE } from '../utils/mutations';
import AuthService from '../utils/auth';
import { io } from 'socket.io-client';
import { useQuery, useMutation } from '@apollo/client';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Form from 'react-bootstrap/Form';

const ChatPopup = ({ seller }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const loggedIn = AuthService.loggedIn();
    const receiverId = seller._id;
    const { loading, data, refetch } = useQuery(GET_CONVERSATION, {
        variables: { receiverId },
    });
    const conversation = data?.conversation || [];

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

    const [sendMessage] = useMutation(SEND_CHAT_MESSAGE);

    const handleExit = () => {
        setOpen(false);
    };

    if (loading) {
        return <div>Loading chat messages...</div>;
    }

    return (
        <div className='chat-popup-container'>
            {loggedIn && !open ? (
                <div>
                    <Button onClick={() => setOpen(true)} label={`Message ${seller.username}`} severity='success' text raised />
                </div>
            ) : (
                loggedIn &&
                open && (
                    <div className='p-2'>
                        <div className='chat-header d-flex justify-content-between align-items-center'>
                            <h4 className='mx-2'>{seller.username}</h4>
                            <Button icon='pi pi-times' rounded text aria-label='Filter' onClick={handleExit} />
                        </div>

                        {/* Render the messages for the selected chat */}
                        <div className='message-container my-2'>
                            {conversation[0]?.messages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`message-bubble ${message.sender._id !== receiverId ? 'right' : 'left'}`}
                                >
                                    <p className='m-1'>{message.message}</p>
                                </div>
                            ))}
                        </div>
                        <Form onSubmit={(e) => handleSendMessage(receiverId, e)} className='d-flex p-inputgroup'>
                            <InputText type='text' value={message} onChange={(e) => setMessage(e.target.value)} />
                            <Button type='submit' disabled={sending}>
                                {sending ? 'Sending...' : 'Send'}
                            </Button>
                        </Form>
                    </div>
                )
            )}
        </div>
    );
};

export default ChatPopup;
