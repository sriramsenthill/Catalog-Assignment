import React from 'react'
import WalletConnector from "./components/WalletConnector.jsx";
import WalletDetails from './components/WalletDetails.jsx';
import Balance from './components/Balance.jsx';

const App = () => {
  return (
    <>
      <WalletConnector />
      <WalletDetails />
      <Balance />
    </>
  )
}

export default App