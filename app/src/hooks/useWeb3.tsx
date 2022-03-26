import { useContext } from 'react';
import { GameTransaction } from '../context/GameTransaction';
import { Web3ContextInterface } from '../types/web3Types';

export const useWeb3 = (): Web3ContextInterface => useContext(GameTransaction);
