import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification;
  });
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };
  if (notification === null) {
    return <div></div>;
  }
  return (
    <div>
      <div style={style}>{notification}</div>
      <div></div>
    </div>
  );
};

export default Notification;
