import * as React from 'react';
import { Route, Routes } from 'react-router';
import { HashRouter } from 'react-router-dom';
import PairingRequestModal from '../components/PairingRequestModal';
import CardIsUnlockedWrapper from '../components/CardIsUnlockedWrapper';
import CardSettings from '../components/CardSettings';
import Header from '../components/Header';
import PhononList from '../components/PhononList/PhononList';
import UnlockCard from '../components/UnlockCard';

const CardNavigation: React.FC = () => {
  return (
    <div className="flex-1">
      <HashRouter>
        <Header />
        <div className="pt-8">
          <CardIsUnlockedWrapper>
            <Routes>
              <Route path="/" element={<UnlockCard />} />
              <Route path="/phonons" element={<PhononList />} />
              <Route path="/settings" element={<CardSettings />} />
            </Routes>
          </CardIsUnlockedWrapper>
        </div>
      </HashRouter>
      <PairingRequestModal />
    </div>
  );
};

export default CardNavigation;
