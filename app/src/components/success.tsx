import { useRouter } from 'next/router';
import { Textarea } from '@nextui-org/react';
import { NextPage } from 'next/types';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';
import { convertStageToPlanet, pickUpImage } from '../utils/util';
import Image from 'next/image';
import GameEarth from '../assets/game_earth.png';

interface Props {
  result: number;
}

interface SuceessStatus {
  title: string;
  content: string;
  html: ReactElement;
}

const Success: NextPage<Props> = (props) => {
  const [successStatus, setSuccessStatus] = useState<SuceessStatus>({
    title: '',
    content: '',
    html: <div></div>,
  });
  const [isLoading, setisLoading] = useState(false);
  const [message, setMessage] = useState('');

  const inputMessage = useCallback(
    (event) => {
      setMessage(event.target.value);
    },
    [message],
  );

  const contract = useContract();
  const router = useRouter();
  const { stage, nextStage } = useWeb3();

  const pushNextStage = () => {
    nextStage();
    router.push('/game');
  };

  const getNFT = async () => {
    try {
      console.log(contract);
      if (contract) {
        // todo svgを入れる
        const txn = await contract.createGameItem(stage, message, pickUpImage(stage));
        setisLoading(true);
        await txn.wait();
        localStorage.setItem('stage', '1');
        setisLoading(false);
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const result = props.result;
    if (result == 0) {
      setSuccessStatus({
        title: 'SUCCESS!',
        content: `now you are :${convertStageToPlanet(stage)}  parcentarge: 5%`,
        html: (
          <div className='button-group'>
            <div className='next-game-button'>
              <a onClick={() => pushNextStage()}>Next Stage</a>
            </div>
          </div>
        ),
      });
    } else if (result == 1) {
      setSuccessStatus({
        title: 'Success',
        content:
          'You have arrived here for the first time; you can get your NFT and finish the game.   But there are others in the world who have ventured further than this and succeeded in their journey.   You may try the next journey. However, if you fail, you will not get the NFT for this planet.',
        html: (
          <div>
            {isLoading ? (
              <p>ローディング中...</p>
            ) : (
              <div className='button-group'>
                <div className='next-game-button'>
                  <a onClick={() => getNFT()}>Get NFT</a>
                </div>
                <div className='next-game-button'>
                  <a onClick={() => pushNextStage()}>Next Stage</a>
                </div>
              </div>
            )}
          </div>
        ),
      });
    } else {
      setSuccessStatus({
        title: "You're number one.",
        content: `now you are :${convertStageToPlanet(stage)}  parcentarge: 5%`,
        html: (
          <div>
            {/* <Textarea
              label='Clear message'
              placeholder='Enter your newspaper message'
              onChange={inputMessage}
            /> */}
            <div>
              {isLoading ? (
                <p>ローディング中...</p>
              ) : (
                <div className='next-game-button'>
                  <a onClick={() => getNFT()}>Get NFT</a>
                </div>
              )}
            </div>
          </div>
        ),
      });
    }
  }, [contract]);
  return (
    <div className='content'>
      <div className='game-earth-img'>
        <Image src={GameEarth} />
      </div>
      <div className='content-main'>
        <div className='game-result-title'>{successStatus.title}</div>
        <div className='padding-top-64px'></div>
        <div>
          <div className='game-result-message'>{successStatus.content}</div>
          <div className='padding-top-64px'></div>

          {successStatus.html}
        </div>
      </div>
    </div>
  );
};

export default Success;
