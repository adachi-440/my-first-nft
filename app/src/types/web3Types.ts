import { ethers } from 'ethers';

export interface Account {
  id: string;
  abbreviatedId: string;
  ethName: string | null;
  avatar: string | null;
}

export interface Web3ContextInterface {
  account: Account | null;
  provider: ethers.providers.Web3Provider | null;
  stage: number;
  nextStage: () => void;
  connectWallet: () => Promise<void>;
  checkPlayGame: () => Promise<boolean>;
  fetchCurrentStatus: () => Promise<any[]>;
  startGame: () => Promise<void>;
  judge: () => Promise<number>;
  mintItem: (stage: number) => Promise<void>;
}

export interface NFTItem {
  tokenId: number;
  stage: number;
  number: number;
  message: string;
  svg: any;
}
