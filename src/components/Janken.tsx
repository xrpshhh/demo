"use client"

import React, { useState } from 'react';
import { Client, Wallet, xrpToDrops } from 'xrpl';
import { useUser } from "@/components/UserProvider"; // ユーザー情報を取得するためのフック

type Hand = 'rock' | 'paper' | 'scissors';

export const Janken = () => {
  const [userHand, setUserHand] = useState<Hand | null>(null);
  const [computerHand, setComputerHand] = useState<Hand | null>(null);
  const [result, setResult] = useState<string>('');
  const [transactionResult, setTransactionResult] = useState('');
  const [winCount, setWinCount] = useState(0);

  const { userInfo } = useUser(); // ログインしているユーザーの情報を取得
  const client = new Client('wss://s.altnet.rippletest.net:51233', { connectionTimeout: 10000 });  // XRPLクライアントのインスタンス化

  // 送金に使用する固定値
  const senderAddress = 'rKSL87PSZ3bzGmGbdNqhWzKxJnVwjCfDz6';
  const senderSecret = 'sEdVQyU4UVsXYmCJRXMYgA2mWgGMR3z';
  //const amount = '1'; // XRPの量

  const generateComputerHand = (): Hand => {
    const hands: Hand[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * hands.length);
    return hands[randomIndex];
  };

  const determineWinner = (user: Hand, computer: Hand): string => {
    if (user === computer) return 'Draw';
    if ((user === 'rock' && computer === 'scissors') ||
        (user === 'scissors' && computer === 'paper') ||
        (user === 'paper' && computer === 'rock')) {
      return 'You Win!';
    }
    return 'You Lose!';
  };

  const playGame = (userChoice: Hand) => {
    // ユーザーの選択を受け入れる
    setUserHand(userChoice);
    const computerChoice = generateComputerHand();
    setComputerHand(computerChoice);
    const gameResult = determineWinner(userChoice, computerChoice);
  
    if (gameResult === 'Draw') {
      // 引き分けの場合、再度選択を促す
      setResult('Draw. Please choose again.');
    } else {
      // 勝敗が決まった場合
      setResult(gameResult);
      if (gameResult === 'You Win!') {
        setWinCount(winCount + 1); // 勝利回数を更新
        //executeTransaction(); // 勝ったら送金を実行
      } else {
        // 負けた場合、勝利回数と手をリセット
        setWinCount(0);
        setUserHand(null);
        setComputerHand(null);
      }
    }
  };

  const getImagePath = () => {
    switch (winCount) {
      case 1:
        return '/1.png';
      case 2:
        return '/2.png';
      case 3:
        return '/3.png';
      case 4:
        return '/4.png';
      case 5:
        return '/5.png';
      case 6:
        return '/6.png';
      case 7:
        return '/7.png';
      default:
        return ''; // winCountが0またはそれ以上の場合は画像を表示しない
    }
  };

  const handleConfirmTransaction = () => {
    executeTransaction(); // 送金を実行
    setWinCount(0); // 勝利回数をリセット
  };

  const executeTransaction = async () => {
    if (!userInfo?.account) {
      console.error('受信者アドレスが未設定です');
      setTransactionResult('受信者アドレスが未設定です。');
      return;
    }

    try {
      await client.connect();

      const dynamicAmount = Math.pow(2, winCount).toString(); // 勝利回数に基づいた賞金額の計算

      // トランザクションの準備
      const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: senderAddress,
        Amount: xrpToDrops(dynamicAmount),
        Destination: userInfo.account // 受信者アドレス
      });

      // トランザクションの署名
      const signed = Wallet.fromSecret(senderSecret).sign(prepared);

      // トランザクションの送信
      const submitResult = await client.submitAndWait(signed.tx_blob);

      // トランザクション結果の確認
      /*
      if (submitResult.result.engine_result === 'tesSUCCESS') {
        setTransactionResult(`送金が完了しました。TxID: ${submitResult.result.tx_json.hash}`);
      } else {
        setTransactionResult(`送金に失敗しました。エラーコード: ${submitResult.result.engine_result_code}, エラーメッセージ: ${submitResult.result.engine_result_message}`);
      }
      */

      await client.disconnect();
    } catch (error) {
      console.error('エラーが発生しました:', error);
      setTransactionResult('エラーが発生しました。');
    }
  };

  return (
    <div className="App text-center">
      {/* じゃんけんゲームのUI */}
      <h1 className="text-3xl font-bold my-6">Rock Paper Scissors</h1>

      {/* 勝利回数と賞金額の表示 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'orange', width: '300px', padding: '10px' }}>
      <p style={{ color: 'white', fontSize: '18px' }}>Win Count: {winCount}回目</p>
      <p style={{ color: 'white', fontSize: '18px' }}>Prize Amount: {Math.pow(2, winCount)} XRP</p>
      </div>
      </div>

      <div className="my-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('rock')}>Rock</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('paper')}>Paper</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('scissors')}>Scissors</button>
      </div>
      <p className="text-lg">Your choice: {userHand}</p>
      <p className="text-lg">Computer's choice: {computerHand}</p>
      <p className="text-xl font-semibold">{result}</p>

      {/* 勝利回数に応じた画像の表示 */}
      {winCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img 
            src={getImagePath()} 
            width="300" 
            height="300"
          />
        </div>
      )}

      {/* 送金確認ボタンの追加 */}
      {winCount > 0 && (
      <div className="my-4">
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={handleConfirmTransaction}>
          {Math.pow(2, winCount)} XRP受取
        </button>
      </div>
      )}

      {/* 送金結果の表示 */}
      <p>{transactionResult}</p>
    </div>
  );
}
