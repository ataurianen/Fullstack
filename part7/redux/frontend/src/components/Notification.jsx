import { useSelector } from 'react-redux';
const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification;
  });

  if (notification === null) {
    return null;
  }

  const style = {
    color: notification.type === 'success' ? 'green' : 'red',
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    border: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
