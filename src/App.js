import React from 'react';
import WalletConnector from "./components/WalletConnector.jsx";
import WalletDetails from './components/WalletDetails.jsx';
import Balance from './components/Balance.jsx';

const App = () => {
  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column', // Change to column layout
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <WalletConnector />
        <WalletDetails />
        <Balance />
      </div>
    </>
  );
}

export default App;