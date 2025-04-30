import React from "react";
import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, safe, metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

const config = createConfig({
  chains: [mainnet, base],
  connectors: [injected(), safe(), metaMask()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

function Web3Provider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

window.Web3Provider = Web3Provider;