import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './NewBlogForm';
import NewBlogForm from './NewBlogForm';

describe('<NewBlogForm />', () => {
  test('The form should call the event handler it received as props with the correct details', async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    const element = render(<NewBlogForm createBlog={createBlog} />);

    const inputTitle = element.container.querySelector('.title');
    const inputAuthor = element.container.querySelector('.author');
    const inputURL = element.container.querySelector('.url');

    const createButton = screen.getByText('Create');

    await user.type(inputTitle, 'Test Blog');
    await user.type(inputURL, 'www.test.com');
    await user.type(inputAuthor, 'Test Author');

    await user.click(createButton);
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('Test Blog');
    expect(createBlog.mock.calls[0][0].url).toBe('www.test.com');
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author');
  });
});
