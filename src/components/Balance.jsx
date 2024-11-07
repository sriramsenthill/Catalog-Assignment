import React, { useEffect, useState } from "react";
import { useAccount, useContractReads, usePublicClient } from "wagmi";
import { DAIabi } from "./abi";

const Balance = () => {
  const { isConnected, address } = useAccount();
  const [chains, setChains] = useState([]);
  const publicClient = usePublicClient();

  useEffect(() => {
    const getMetaMaskChains = async () => {
      try {
        // Request the list of chains from MetaMask
        const provider = window.ethereum;
        if (!provider) {
          console.error("MetaMask not found");
          return;
        }

        // Get all chains added to MetaMask
        const chainList = await provider.request({
          method: 'wallet_getPermissions'
        });

        // Get the currently connected chain
        const currentChainId = await provider.request({
          method: 'eth_chainId'
        });

        // Get all available networks from MetaMask
        const networks = await provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });

        // Extract unique chain IDs
        const uniqueChains = [...new Set(networks
          .flatMap(network => network.caveats?.[0]?.value ?? [])
          .filter(Boolean)
        )];

        // Format chains for contract reads
        const formattedChains = uniqueChains.map(chainId => ({
          chainId: parseInt(chainId, 16), // Convert hex to decimal
          address
        }));

        setChains(formattedChains);
      } catch (error) {
        console.error("Error getting MetaMask chains:", error);
      }
    };

    if (isConnected) {
      getMetaMaskChains();
    }
  }, [isConnected, address]);

  const { data: balances, isLoading, isError } = useContractReads({
    contracts: chains.map(({ chainId, address }) => ({
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI contract address
      abi: DAIabi,
      functionName: "balanceOf",
      args: [address],
      chainId,
    })),
    enabled: chains.length > 0,
  });

  if (!isConnected) {
    return (
      <div className="p-4 text-center bg-red-100 rounded">
        Please connect your wallet to view balances.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        Loading chain balances...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center bg-red-100 rounded">
        Error fetching balances
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Wallet Balances</h2>
      {balances && balances.map((balance, index) => (
        <div key={index} className="mb-4 p-4 border rounded shadow">
          <div className="font-medium">Chain ID: {chains[index].chainId}</div>
          <div className="text-gray-600">
            Balance: {balance ? balance.toString() : '0'} DAI
          </div>
        </div>
      ))}
      {chains.length === 0 && (
        <div className="text-center text-gray-500">
          No chains detected in MetaMask
        </div>
      )}
    </div>
  );
};

export default Balance;