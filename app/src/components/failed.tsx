import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import Image from 'next/image';
import FailedAlign from '../assets/faild_alien.png';

const Failed: NextPage = () => {
  const router = useRouter();

  useEffect(() => localStorage.setItem('stage', '1'), []);
  return (
    <div className='content'>
      <div className='fail-content'>
        <div className='game-result-title'>FAILD</div>

        <Image className='faild-alien-image' src={FailedAlign} />

        <div className='next-game-button'>
          <a onClick={() => router.push('/')}>TOP PAGE</a>
        </div>
      </div>
    </div>
  );
};

export default Failed;
