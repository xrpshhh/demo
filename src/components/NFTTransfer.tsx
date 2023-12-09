"use client"

//import { Xumm } from "xumm";
import { useEffect, useState, ChangeEvent } from "react";
import { Buffer } from "buffer";
import { XrplClient } from 'xrpl-client'
import { NFTStorage } from "nft.storage";
import { extractAffectedNFT } from "@xrplkit/txmeta";
import { useUser } from "@/components/UserProvider"; // ユーザー情報を取得するためのフック

require("dotenv").config();

export const NFTTransfer: React.FC = () => {
    const { userInfo, xumm } = useUser();
    const [account, setAccount] = useState<string | undefined>(userInfo?.account);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [nftId, setNftId] = useState<string | undefined>(undefined);
    const nftStorage = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEI1ZGQ2MUNEMjVmZDgxM0MyNEQ1YUNFNThjZDYwNzQ4OGFiQzE1N2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NjI5NjQxODU1MiwibmFtZSI6InRlc3QifQ.CEtfoZZhcLJiKF6GW3SYw4gI3bAJveVDp5U8odEcf4M'});
    //const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_TOKEN });

    useEffect(() => {
      if (userInfo && userInfo.account) {
        setAccount(userInfo.account);
      }
    }, [userInfo]);

    const connect = () => {
      xumm.authorize();
    };

  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  interface PayloadResult {
    signed: boolean;
    txid: string;
  }

  const mint = async () => {
    try {
    if (!file) {
      alert("画像ファイルを選択してください！");
      return;
    }

    alert("画像のアップロードを開始します…");
    const { url } = await nftStorage.store({
      schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
      nftType: "art.v0",
      image: file,
      name: "some name",
      description: "some description",
    });

    alert("トークンのミントを開始します…");
    if (!xumm.payload) {
      alert("Xumm APIとの接続に問題があります。");
      console.error("xumm.payload is undefined");
      return;
    }

    const payload = await xumm.payload.createAndSubscribe({
      TransactionType: "NFTokenMint",
      NFTokenTaxon: 1,
      Flags: 8,
      URI: Buffer.from(url).toString("hex"),
    });

    payload.websocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data.toString());
      if (typeof data.signed === "boolean") {
        payload.resolve({ signed: data.signed, txid: data.txid });
      }
    };

    const result = await payload.resolved as PayloadResult;
    if (!result.signed) {
      alert("トランザクションへの署名は拒否されました！");
      return;
    }

    alert("トランザクションを送信しています…");
    const client = new XrplClient("wss://testnet.xrpl-labs.com");
    const txResponse = await client.send({
      command: "tx",
      transaction: result.txid,
    });

    const nftoken = extractAffectedNFT(txResponse);
    alert('NFTトークンが発行されました。NFT ID: ' + nftoken.NFTokenID);
    window.open(`https://test.bithomp.com/nft/${nftoken.NFTokenID}`, "_blank");

  } catch (error) {
    console.error("ミントプロセス中にエラーが発生しました:", error);
    alert("エラーが発生しました。コンソールを確認してください。");
  }
  };

  return (
    <div className="nft-minter-box">
        <div className="title">XRP NFT</div>
        <div className="account-box">
            <div className="account">{account}</div>
            <button className="connect-button" onClick={connect}>
                connect
            </button>
        </div>
        <div className="image-box">
            <label className="file-upload-button">
                ファイルを選択
                <input
                    className="imageInput"
                    type="file"
                    accept=".jpg , .jpeg , .png"
                    onChange={uploadImage}
                />
            </label>
        </div>
        {file && (
            <img
                src={window.URL.createObjectURL(file)}
                alt="nft"
                className="nft-image"
            />
        )}
        {account && (
            <div>
                <button className="mint-button" onClick={mint}>
                    mint
                </button>
            </div>
        )}
        {nftId && (
              <div>
                  <p>NFTトークンが発行されました。NFT ID: {nftId}</p>
              </div>
        )}
    </div>
    );
}
