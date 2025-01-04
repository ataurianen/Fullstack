import { HeaderProps } from '../types';

const Header = (props: HeaderProps) => {
  return <h1>{props.text}</h1>;
};

export default Header;
