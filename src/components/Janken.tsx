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

  const { userInfo } = useUser(); // ログインしているユーザーの情報を取得
  const client = new Client('wss://s.altnet.rippletest.net:51233', { connectionTimeout: 10000 });  // XRPLクライアントのインスタンス化

  // 送金に使用する固定値
  const senderAddress = 'rKSL87PSZ3bzGmGbdNqhWzKxJnVwjCfDz6';
  const senderSecret = 'sEdVQyU4UVsXYmCJRXMYgA2mWgGMR3z';
  const amount = '1'; // XRPの量

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
    return 'Computer Wins!';
  };

  const playGame = (userChoice: Hand) => {
    const computerChoice = generateComputerHand();
    setUserHand(userChoice);
    setComputerHand(computerChoice);
    const gameResult = determineWinner(userChoice, computerChoice);
    setResult(gameResult);
    if (gameResult === 'You Win!') {
      executeTransaction(); // 勝ったら送金を実行
    }
  };

  const executeTransaction = async () => {
    if (!userInfo?.account) {
      console.error('受信者アドレスが未設定です');
      setTransactionResult('受信者アドレスが未設定です。');
      return;
    }

    try {
      await client.connect();

      // トランザクションの準備
      const prepared = await client.autofill({
        TransactionType: 'Payment',
        Account: senderAddress,
        Amount: xrpToDrops(amount),
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
      <div className="my-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('rock')}>Rock</button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('paper')}>Paper</button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2" onClick={() => playGame('scissors')}>Scissors</button>
      </div>
      <p className="text-lg">Your choice: {userHand}</p>
      <p className="text-lg">Computers choice: {computerHand}</p>
      <p className="text-xl font-semibold">{result}</p>

      {/* 送金結果の表示 */}
      <p>{transactionResult}</p>
    </div>
  );
}
