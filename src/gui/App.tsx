import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/output.css';
import { CardStoreProvider, useCardStore } from './stores/CardStore';
import CardList from './components/CardList/CardList';
import Navigation from './components/Navigation/Navigation';
import NoCards from './components/NoCards';

const App = () => {
  const { cards, loadingCardIds } = useCardStore();

  if (!cards.length && !loadingCardIds.length) {
    return <NoCards />;
  }

  return (
    <div className="flex bg-gray-100">
      <CardList />
      <Navigation />
    </div>
  );
};

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <CardStoreProvider>
      <App />
    </CardStoreProvider>
  </QueryClientProvider>
);
