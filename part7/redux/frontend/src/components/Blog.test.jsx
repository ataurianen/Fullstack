import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
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
  const mockHandler = vi.fn();

  let container;

  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={user} updateLikes={mockHandler} />
    ).container;
  });

  test('renders blogs title and author but not URL or likes by default', () => {
    const element3 = screen.getByText('Testing 123 Aubrey Rose');
    expect(element3).toBeDefined();
    const element = screen.queryByText('www.aubrey.com');
    expect(element).toBeNull();
    const element2 = screen.queryByText('likes 23');
    expect(element2).toBeNull();
  });

  test('Details are displayed when the show button is clicked', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('View');
    await user.click(button);

    const div = container.querySelector('.detailsVisible');
    expect(div).not.toHaveStyle('display: none');
  });

  test('If like button is clicked twice, the event handler should be called twice', async () => {
    const user = userEvent.setup();
    const button = screen.getByText('Like');
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
