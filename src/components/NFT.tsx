"use client"

import React, { useEffect, useState } from 'react';
import { Client, convertHexToString } from 'xrpl';
import { useUser } from '@/components/UserProvider'
import { Imagine } from './Imagine';

interface NFT {
    Flags: number;
    Issuer: string;
    NFTokenID: string;
    NFTokenTaxon: number;
    TransferFee: number;
    URI: string;
    nft_serial: number;
}

interface AccountNFTResponse {
    account: string;
    account_nfts: NFT[];
    ledger_current_index: number;
    validated: boolean;
    nodepref: string;
}

export const NFT = () => {
    const { userInfo } = useUser();

    const [info, setInfo] = useState<AccountNFTResponse>();
    const [fetchedData, setFetchedData] = useState<any>(null);

    // XRPLからNFT情報を取得
    useEffect(() => {
        if (userInfo) {
            const setup = async () => {
                const client = new Client('wss://xrpl.ws')
                await client.connect();
                const response = await client.request({
                    command: "account_nfts",
                    account: userInfo?.account
                });
                setInfo(response.result as AccountNFTResponse);
                await client.disconnect();
            };
            setup();
        }
    }, [userInfo]);

    // IPFSのURIをHTTPSに変換
    const convertIpfsToHttps = (uri: string) => {
        return uri.replace("ipfs://", "https://ipfs.io/ipfs/");
    };

    // 各NFTのメタデータを取得
    const fetchDataFromConvertedURI = async (convertedURI: string) => {
        const response = await fetch(convertedURI);
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    };

    // 全てのNFTのメタデータを取得
    const fetchAllConvertedURIs = async () => {
        if (info?.account_nfts) {
            const allFetchedData = await Promise.all(
                info.account_nfts.map(async (nft) => {
                    const convertedURI = convertIpfsToHttps(convertHexToString(nft.URI));
                    return await fetchDataFromConvertedURI(convertedURI);
                })
            );
            setFetchedData(allFetchedData as any);
        }
    };

    useEffect(() => {
        fetchAllConvertedURIs();
    }, [info]);

    return (
        <div>
            {fetchedData && fetchedData.map((data: any, index: any) => (
                <div key={index}>
                    {/* 画像のURIがHTTPS形式に変換されている場合、その画像を表示 */}
                    {data?.image && <Imagine src={convertIpfsToHttps(data.image)} alt={`NFT ${index}`} width={123} height={123} />}
                </div>
            ))}
        </div>
    );
}
