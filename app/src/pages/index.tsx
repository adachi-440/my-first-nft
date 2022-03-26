import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CurrentStatus from '../components/currentStatus';
import { useContract } from '../hooks/useContract';
import HomeBackGround from '../assets/home_background.png';
import HomeMobile from '../assets/home_mobile.png';
import HomeEarth from '../assets/home_earth.png';

const Home: NextPage = () => {
  const [canGamePlay, setCanGamePlay] = useState(false);
  const router = useRouter();
  const contract = useContract();

  const checkPlayGame = async () => {
    try {
      if (contract) {
        const canPlayGame = await contract.canPlayGame();
        setCanGamePlay(canPlayGame);
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const startGame = async () => {
    try {
      if (contract) {
        // await contract.startGame();
        router.push('/game');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkPlayGame();
    localStorage.setItem('stage', '1');
  }, [contract]);

  return (
    <div>
      <div className='sample-box'>
        <div className='background-image'>
          <Image src={HomeBackGround} />
        </div>
        <div className='home-contents'>
          <div className='title-app-name'>
            SPACE BOUKEN <br />
            DAAP
          </div>
          <br />
          <div className='app-title-discription'>Choose rocket and travel another space!</div>
          <div className='padding-top-96px'></div>
          {canGamePlay && <button onClick={() => startGame()}>start game!!</button>}
        </div>
      </div>
      <div className='padding-top-64px'></div>

      <div className='how-to-play-title'>How to play</div>
      <div className='padding-top-32px'></div>
      <div className='how-to-play-contents'>
        <div className='how-to-play-box'>
          <div className='how-to-play-title-head'>1 Connect Wallet</div>

          <div className='how-to-play-title-content'>You can connect MetaMask</div>
        </div>
        <div className='padding-left-16px'></div>
        <div className='how-to-play-box'>
          <div className='how-to-play-title-head'>2 Play&Get NFT</div>

          <div className='how-to-play-title-content'>You play game and get it</div>
        </div>
      </div>

      <div className='padding-top-64px'></div>
      <div className='home-mobile'>
        <div>
          <Image src={HomeMobile} objectFit='contain' />
        </div>
      </div>

      <div className='rank-box'>
        <div>
          <Image src={HomeEarth} height={800} />
        </div>
        <CurrentStatus />
      </div>
    </div>
  );
};

export default Home;
