import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';
import { Modal, useModal } from '@nextui-org/react';
import Image from 'next/image';
import PlayBackGround from '../assets/play_background.png';
import Player1 from '../assets/player_1.png';
import Player2 from '../assets/player_2.png';
import GameCenter from '../assets/game-center.png';

const Game: NextPage = () => {
  const contract = useContract();
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const { stage, nextStage } = useWeb3();
  const [test, setTest] = useState(0);
  const { setVisible, bindings } = useModal();

  const judge = async () => {
    try {
      if (contract) {
        setisLoading(true);
        setVisible(true);
        const num = Math.floor(Math.random() * 9999999) + 1;
        const result = await contract.judgeGame(stage, num);
        await _sleep(5000);
        router.replace({
          pathname: '/result',
          query: { status: 1 },
        });
        setVisible(false);
        // parseInt(result._hex)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const _sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const judgeTest = async () => {
    try {
      if (contract) {
        let count = 0;
        for (let i = 0; i < 100; i++) {
          const num = Math.floor(Math.random() * 9999999) + 1;
          const result = await contract.judgeGame(stage, num);
          console.log(parseInt(result._hex))
          if (parseInt(result._hex) === 3) {
            count++;
          }
        }
        console.log(count)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    judgeTest()
  }, [contract])

  return (
    <div>
      {isLoading ? (
        <p></p>
      ) : (
        <div className='content'>
          <Image className='game-play-background' src={PlayBackGround} />
          <div className='game-main'>
            <div className='game-select'>
              <Image src={Player1} height={450}/>
              <div className='choose-hero-title'>Adachi Tomoki</div>
              <div className='padding-top-32px'></div>
              <div className='button03'>
                <a onClick={() => judge()}>PLAY</a>
              </div>
            </div>
            <div className='game-select'>
              <Image src={GameCenter}/>
              <div className='choose-hero-title'>See Game Rules</div>
            </div>
            <div className='game-select'>
              <Image src={Player2} height={450}/>
              <div className='choose-hero-title'>Kato Goki</div>
              <div className='padding-top-32px'></div>
              <div className='button03'>
                <a onClick={() => judge()}>PLAY</a>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        scroll
        width='600px'
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
        {...bindings}
      >
        <Modal.Body>
          <iframe src='https://embed.lottiefiles.com/animation/89628'></iframe>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Game;
