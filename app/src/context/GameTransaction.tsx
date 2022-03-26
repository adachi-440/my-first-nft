import React, { createContext, useEffect, useState } from 'react';
import { Web3ContextInterface } from '../types/web3Types';
import { getWeb3Provider } from '../utils/web3Util';
import { useContract } from '../hooks/useContract';

type Interface = Web3ContextInterface;

const getDefaultContextValue = (): Web3ContextInterface => ({
  account: null,
  provider: null,
  stage: 1,
  connectWallet: async () => {},
  nextStage: () => {},
  checkPlayGame: async () => false,
  fetchCurrentStatus: async () => [],
  startGame: async () => {},
  judge: async () => 3,
  mintItem: async () => {},
});

export const GameTransaction = createContext<Web3ContextInterface>(getDefaultContextValue());

export const TransactionProvider: React.FC<React.PropsWithChildren<{ key?: string }>> = ({
  children,
}) => {
  const [provider, setProvider] = useState<Interface['provider']>(null);
  const [account, setAccount] = useState<Interface['account']>(null);
  const [stage, setStage] = useState(1);

  const nextStage = () => {
    localStorage.setItem('stage', (stage + 1).toString());
    setStage(stage + 1);
  };

  const connectWallet = async () => {
    try {
      if (!account) {
        const [instance, _provider] = await getWeb3Provider();
        setProvider(_provider);
        setAccount(account);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkPlayGame = async () => {
    try {
      const gameItemContract = useContract();
      if (gameItemContract) {
        const canPlayGame = await gameItemContract.canPlayGame();
        console.log(canPlayGame);
        return canPlayGame;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchCurrentStatus = async () => {
    try {
      const gameItemContract = useContract();
      if (gameItemContract) {
        const currentStatuses = await gameItemContract.fetchCurrentStatus();
        const statuses = currentStatuses.map((status: any) => ({
          count: parseInt(status.count._hex),
        }));
        return statuses;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
    return [];
  };

  const startGame = async () => {
    try {
      const gameItemContract = useContract();
      if (gameItemContract) {
        await gameItemContract.startGame();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const judge = async () => {
    try {
      const gameItemContract = useContract();
      if (gameItemContract) {
        const num = Math.floor(Math.random() * 9999999) + 1;
        const result = await gameItemContract.judgeGame(num);
        return result;
      }
    } catch (error) {
      console.error(error);
      return 4;
    }
    return 4;
  };

  const mintItem = async (stage: number) => {
    try {
      const gameItemContract = useContract();
      if (gameItemContract) {
        // todo svgを入れる
        const txn = await gameItemContract.createItem(stage, '');
        await txn.wait();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    connectWallet();
    const stageText = localStorage.getItem('stage');
    setStage(parseInt(stageText ?? '1'));
  }, []);

  return (
    <GameTransaction.Provider
      value={{
        account,
        stage,
        provider,
        nextStage,
        connectWallet,
        checkPlayGame,
        fetchCurrentStatus,
        startGame,
        judge,
        mintItem,
      }}
    >
      {children}
    </GameTransaction.Provider>
  );
};
