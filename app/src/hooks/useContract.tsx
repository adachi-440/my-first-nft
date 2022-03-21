import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { contractABI, contractAddress } from "../utils/constants";
import { useWeb3 } from "./useWeb3";

export const useContract = () => {
  const { provider } = useWeb3();

  const [contract, setContract] = useState<ethers.Contract>();

  if(provider) {
    const signer = provider.getSigner();
    const gameItemContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    setContract(gameItemContract);
  }

  return contract;
};