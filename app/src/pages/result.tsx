import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import Failed from '../components/failed';
import Success from '../components/success';
import { useWeb3 } from '../hooks/useWeb3';

const Result: NextPage = () => {
  const router = useRouter();
  const result: string = router.query.status as string;
  const { stage } = useWeb3();
  console.log(stage);

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      if (
        url == '/' ||
        url == '/result?status=0' ||
        url == '/result?status=1' ||
        url == '/result?status=2' ||
        url == '/result?status=4'
      ) {
        const answer = window.confirm('ゲームを中止しますか？');
        if (!answer) {
          router.push({ pathname: '/result', query: { status: result } });
          return false;
        } else {
          localStorage.setItem('stage', '1');
          window.location.href = '/';
          return true;
        }
      }
      return true;
    });
  }, []);

  const overridePopstate = () => {
    history.pushState(null, '', null);
  };
  return (
    <div>
      <ResultContent result={parseInt(result)} />
    </div>
  );
};

export default Result;

interface Props {
  result: number;
}
const ResultContent: NextPage<Props> = (props) => {
  if (props.result == 3) {
    return <Failed />;
  } else if (props.result == 4) {
    return <p>エラー</p>;
  } else {
    return <Success result={props.result} />;
  }
};
