const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }
  const { message, type } = notification;

  const style = {
    color: type === 'success' ? 'green' : 'red',
    backgroundColor: 'lightgrey',
    fontSize: '20px',
    border: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return <div style={style}>{message}</div>;
};

export default Notification;
