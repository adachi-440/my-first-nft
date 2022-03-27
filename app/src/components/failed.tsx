import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import Image from 'next/image';
import FailedAlign from '../assets/faild_alien.png';
import { useWeb3 } from '../hooks/useWeb3';

const Failed: NextPage = () => {
  const router = useRouter();
  const { resetStage } = useWeb3();

  const reset = () => {
    resetStage()
    router.push('/')
  }

  return (
    <div className='content'>
      <div className='fail-content'>
        <div className='game-result-title'>FAILD</div>

        <Image className='faild-alien-image' src={FailedAlign} />

        <div className='next-game-button'>
          <a onClick={() => reset()}>TOP PAGE</a>
        </div>
      </div>
    </div>
  );
};

export default Failed;
