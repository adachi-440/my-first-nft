import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';
import Image from 'next/image';
import PlayBackGround from '../assets/play_background.png';
import Player from '../assets/player_1.png';
import GameCenter from '../assets/game-center.png';

const Game: NextPage = () => {
  const contract = useContract();
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const { stage, nextStage } = useWeb3();
  const [test, setTest] = useState(0);

  const judge = async () => {
    try {
      if (contract) {
        setisLoading(true);
        const num = Math.floor(Math.random() * 9999999) + 1;
        const result = await contract.judgeGame(stage, num);
        setisLoading(false);
        router.replace({
          pathname: '/result',
          query: { status: parseInt(result._hex).toString() },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const judgeTest = async () => {
    try {
      if (contract) {
        for (let i = 0; i < 100; i++) {
          const num = Math.floor(Math.random() * 9999999) + 1;
          const result = await contract.judgeGame(stage, num);
          console.log(result);
          if (parseInt(result._hex) == 3) {
            const t = test;
            setTest(t + 1);
          }
          await _sleep(2000);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    judgeTest();
  }, [contract]);

  return (
    <div>
      {isLoading ? (
        <p>ローディング中</p>
      ) : (
        <div className='content'>
          <Image className='game-play-background' src={PlayBackGround} />
          <div className='content-main'>
            <div>
              <Image src={Player} />
              <div className='choose-hero-title'>Lex Anston</div>
              <div className='padding-top-32px'></div>
              <div className='button03'>
                <a onClick={() => judge()}>PLAY</a>
              </div>
            </div>
            <div>
              <Image src={GameCenter} />
              <div className='choose-hero-title'>See Game Rules</div>
            </div>
            <div>
              <Image src={Player} />
              <div className='choose-hero-title'>Lex Anston</div>
              <div className='padding-top-32px'></div>
              <div className='button03'>
                <a onClick={() => judge()}>PLAY</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
