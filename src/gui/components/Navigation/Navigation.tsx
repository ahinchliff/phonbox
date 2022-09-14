import * as React from 'react';
import Header from './Header';
import Content from './Content';

const Navigation: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>('settings');

  return (
    <div className="flex-1">
      <Header currentTab={tab} onClickTab={setTab} />
      <Content currentTab={tab} />
    </div>
  );
};

export default Navigation;
