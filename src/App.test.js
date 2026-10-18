import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

const mockViewport = (isMobile) => {
  window.matchMedia = (query) => ({
    matches: query.includes('max-width') ? isMobile : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
};

const renderApp = () =>
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

beforeEach(() => {
  // Skip the one-time boot screen.
  window.sessionStorage.setItem('aiv:booted', '1');
});

test('renders the navigation and the homepage on a phone', async () => {
  mockViewport(true);
  renderApp();
  expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  expect(await screen.findByText(/we turn AI/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /see our events/i })).toBeInTheDocument();
  expect(screen.getAllByText(/README\.md/).length).toBeGreaterThan(0);
});

test('renders the homepage on desktop', async () => {
  mockViewport(false);
  renderApp();
  expect(await screen.findByText(/we turn AI/i)).toBeInTheDocument();
  expect(screen.getByText(/4 departments,/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /meet the whole team/i })).toBeInTheDocument();
});
