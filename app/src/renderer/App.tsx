import './styles/output.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CardStoreProvider, useCardStore } from './stores/CardStore';
import NoCards from './components/NoCards';
import CardNavigation from './navigation/CardNavigation';
import SideBar from './components/SideBar';
import SelectACard from './components/SelectACard';

const App = () => {
  const { cards, selectedCardId, loadingCardIds } = useCardStore();

  if (!cards.length && !loadingCardIds.length) {
    return <NoCards />;
  }

  return (
    <div className="flex bg-gray-100">
      <SideBar />
      {selectedCardId ? <CardNavigation /> : <SelectACard />}
    </div>
  );
};

const queryClient = new QueryClient();

export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CardStoreProvider>
        <App />
      </CardStoreProvider>
    </QueryClientProvider>
  );
};
