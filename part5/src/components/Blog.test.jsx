import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders blogs title and author but not URL or likes by default', () => {
  const blog = {
    title: 'Testing 123',
    author: 'Aubrey Rose',
    url: 'www.aubrey.com',
    likes: 23,
    user: {
      username: 'aubrey',
    },
  };
  const user = {
    username: 'aubrey',
  };

  const { container } = render(<Blog blog={blog} user={user} />);

  const element3 = screen.getByText('Testing 123 Aubrey Rose');
  expect(element3).toBeDefined();
  const element = screen.queryByText('www.aubrey.com');
  expect(element).toBeNull();
  const element2 = screen.queryByText('likes 23');
  expect(element2).toBeNull();
});
