import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification;
  });

  if (!notification) {
    return null;
  }
  console.log('notification:', notification);
  const { message, type } = notification;
  console.log('message:', message);
  console.log('type:', type);

  const style = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderColor: type === 'success' ? 'green' : 'red',
    borderRadius: '5px',
  };
  return <div style={style}>{message}</div>;
};

export default Notification;
