import { useRouter } from 'next/router';
import { Table } from '@nextui-org/react';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';
import { convertStageToPlanet } from '../utils/util';
import { useWeb3 } from '../hooks/useWeb3';

interface Status {
  stage: number;
  count: number;
}
const columns = [
  {
    key: 'stage',
    label: 'Stage',
  },
  {
    key: 'count',
    label: 'Count',
  },
];

const CurrentStatus: NextPage = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const contarct = useContract();
  const { stage } = useWeb3()

  const fetchCurrentStatus = async () => {
    try {
      if (contarct) {
        setStatuses([])
        const currentStatuses = await contarct.fetchCurrenStatus();
        currentStatuses.map((s: any, index: number) => {
          const copy = statuses;
          copy.push({ stage: index + 1, count: parseInt(s._hex) });
          setStatuses(copy);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentStatus();
  }, [contarct, stage]);

  return (
    <div className='rank-box-contents'>
      <div className='callenger-list-title'>
        We wellcome next challenger!
        <div className='padding-top-32px'></div>
        <div className='ranking-title'>
          <div className='ranking-title-box'>
            <div className='ranking-title-box-left'>
              <div className='ranking-title-box-content'>No.</div>
              <div className='left-16px-padding'></div>
              <div className='ranking-title-box-content'>NFT Name</div>
            </div>
            <div className='ranking-title-box-right'>
              <div className='ranking-title-box-content'>Minted</div>
            </div>
          </div>
        </div>
      </div>

      <div className='padding-top-8px'></div>

      {statuses.map((status, index) => (
        <div className='ranking-box' key={index}>
          <div className='ranking-box-contents'>
            <div className='ranking-box-contents-left'>
              <div className='ranking-box-contents-left-number'>{index + 1}</div>
              <div className='ranking-box-contents-left-planet'>
                {convertStageToPlanet(status.stage)}
              </div>
            </div>

            <div className='ranking-box-contents-right'>{status.count}</div>
          </div>
          <div className='padding-top-8px'></div>
        </div>
      ))}
    </div>
  );
};

export default CurrentStatus;
