"use client"
import React, { useState } from 'react';
import { Client } from "xrpl";

import { Payload } from "@/components/Payload";
import { Vanity } from "@/components/Vanity";
import { Domain } from '@/components/Domain';

interface InputData {
  username: string;
  address: string;
}

export const AddressCheck = () => {
  const [inputData, setInputData] = useState<InputData>({
    username: '',
    address: '',
  });
  const [message, setMessage] = useState<string>('');

  const client = new Client("wss://testnet.xrpl-labs.com");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof InputData) => {
    setInputData({
      ...inputData,
      [field]: e.target.value,
    });
  };

  const isValidASCII = (str: string) => {
    return /^[\x00-\x7F]*$/.test(str);
  };

  const validateInputs = async () => {
    const { username, address } = inputData;
    //一意の名前のバリデーション（例：空白のチェック）
    if (!username.trim()) {
      setMessage('Username cannot be empty.');
      return;
    }

    try {
      await client.connect();
      // XRPアドレスのバリデーション
      if (await client.request({ command: "account_info", account: address })) {
        setMessage('Invalid XRP address.');
      } else {
        setMessage('Both username and XRP address are valid.');
      }
    } catch (error) {
      setMessage('Error occurred while checking XRP address.');
    } finally {
      await client.disconnect();
    }
     //ここで追加のAPI呼び出しやバリデーションを行うことができます
  };

  return (
    <div className='p-8 py-16 text-center container mx-auto'>
      <Payload />
      <div className="p-4 m-4 card border border-primary">
        <form className="form-control">
          <div className='w-auto mt-4'>
            <label>User Name: </label>
            <input
              type="text"
              className='input input-sm input-bordered'
              value={inputData.username}
              onChange={(e) => handleInputChange(e, "username")}
            />
          </div>
          <div className='w-auto mt-4'>
            <label>XRP Address: </label>
            <input
              type="text"
              className='input input-sm input-bordered'
              value={inputData.address}
              onChange={(e) => handleInputChange(e, "address")}
            />
          </div>
          <button className="mt-4 btn btn-secondary" onClick={validateInputs}>Check</button>
        </form>
      </div>
      <div>{message}</div>

      <Domain />
      <Vanity />
    </div>
  );
};
