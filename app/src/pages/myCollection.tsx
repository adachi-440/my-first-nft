import { Table } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';
import { NFTItem } from '../types/web3Types';
import { decode } from 'js-base64';

const columns = [
  {
    key: 'tokenId',
    label: 'TokenId',
  },
  {
    key: 'stage',
    label: 'Stage',
  },
  {
    key: 'number',
    label: 'Number',
  },
  {
    key: 'message',
    label: 'Message',
  },
  {
    key: 'image',
    label: 'Image',
  },
];

const MyCollection: NextPage = () => {
  const contract = useContract();
  const [myNFTs, setMyNFTs] = useState<NFTItem[]>([]);

  const fetchMyNFTs = async () => {
    try {
      if (contract) {
        const nfts = await contract.fetchMyNFTs();
        nfts.map(async (nft: any) => {
          const data = await contract.tokenURI(parseInt(nft.tokenId._hex));
          const d = decode(data.slice(29));
          const json = JSON.parse(d);
          const image = decode(json.image.slice(26));
          const copy = myNFTs;
          copy.push({
            tokenId: parseInt(nft.tokenId._hex),
            stage: parseInt(nft.stage._hex),
            number: parseInt(nft.number._hex),
            message: nft.message,
            svg: image,
          });
          setMyNFTs(copy);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyNFTs();
  }, [contract]);
  return (
    <div>
      <Table
        aria-label='Example table with dynamic content'
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
      >
        <Table.Header columns={columns}>
          {(column) => <Table.Column key={column.key}>{column.label}</Table.Column>}
        </Table.Header>
        <Table.Body items={myNFTs}>
          {(nft) => (
            <Table.Row key={nft.tokenId}>
              <Table.Cell>{nft.tokenId}</Table.Cell>
              <Table.Cell>{nft.stage}</Table.Cell>
              <Table.Cell>{nft.number}</Table.Cell>
              <Table.Cell>{nft.message}</Table.Cell>
              <Table.Cell>
                <span dangerouslySetInnerHTML={{ __html: nft.svg }}></span>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default MyCollection;
