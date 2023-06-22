import { useQuery, useMutation } from '@apollo/client';
import { GET_CHAT_MESSAGES } from '../utils/queries';
import { SEND_CHAT_MESSAGE } from '../utils/mutations'

const Chat = ({ senderId, receiverId }) => {
  const { loading, error, data } = useQuery(GET_CHAT_MESSAGES, {
    variables: { senderId, receiverId },
  });

  const [sendMessage] = useMutation(SEND_CHAT_MESSAGE);

  const handleSendMessage = (message) => {
    sendMessage({
      variables: { senderId, receiverId, message },
    })
      .then((response) => {
        // Message sent successfully
        console.log('Message sent:', response);
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
      });
  };

  if (loading) {
    return <div>Loading chat messages...</div>;
  }

  if (error) {
    return <div>Error fetching chat messages</div>;
  }

  const { chatMessages } = data;

  return (
    <div>
      {chatMessages.map((chat) => (
        <div key={chat._id}>
          <strong>{chat.sender.username}: </strong>
          {chat.message}
        </div>
      ))}
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" />
        <button onClick={handleSendMessage}>Send</button>
      </form>
    </div>
  );
};

export default Chat;
