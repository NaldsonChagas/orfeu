import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResultCard from './SearchResultCard';

const mockAlbum = {
  id: '1',
  name: 'Test Album',
  artist: 'Test Artist',
  imageUrl: 'https://example.com/cover.jpg',
  tags: ['rock', 'indie'],
};

describe('SearchResultCard', () => {
  it('renders album cover, name, artist and tags', () => {
    render(
      <SearchResultCard
        album={mockAlbum}
        isInLibrary={false}
        onAdd={jest.fn()}
      />,
    );

    expect(screen.getByAltText('Capa do álbum Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
    expect(screen.getByText('indie')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar/i }),
    ).toBeInTheDocument();
  });

  it('calls onAdd when add button is clicked', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();

    render(
      <SearchResultCard album={mockAlbum} isInLibrary={false} onAdd={onAdd} />,
    );

    await user.click(screen.getByRole('button'));
    expect(onAdd).toHaveBeenCalledWith(mockAlbum);
  });

  it('disables button and shows "Adicionado" when album is in library', () => {
    render(
      <SearchResultCard
        album={mockAlbum}
        isInLibrary={true}
        onAdd={jest.fn()}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Adicionado');
  });

  it('disables button and shows "Adicionando..." during add operation', () => {
    render(
      <SearchResultCard
        album={mockAlbum}
        isInLibrary={false}
        isAdding={true}
        onAdd={jest.fn()}
      />,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Adicionando...');
  });

  it('does not render tags when tags array is empty', () => {
    const albumWithoutTags = { ...mockAlbum, tags: [] };

    render(
      <SearchResultCard
        album={albumWithoutTags}
        isInLibrary={false}
        onAdd={jest.fn()}
      />,
    );

    expect(screen.queryByText('rock')).not.toBeInTheDocument();
  });
});
