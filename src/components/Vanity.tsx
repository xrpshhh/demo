"use client"

import { ComponentProps, useState } from "react";
import { Wallet } from "xrpl";

type VanityList = {
  address: string;
  secret: string;
};

export const Vanity = () => {
  const [vanity, setVanity] = useState<VanityList[]>([]);
  // const [vanity, setVanity] = useState([{}]);
  const [showSecrets, setShowSecrets] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);

  const vanitySearch: ComponentProps<"form">["onSubmit"] = async (event) => {
    setLoading(true);
    event.preventDefault();

    const keyword: string[] = event.currentTarget.keyword.value.split(/[\s,]+/).map((k: string) => k.trim());

    // const response = await fetch("/api/vanity", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ keyword }),
    // });

    // const data = await response.json();
    // setVanity(data);

    const matchedAddresses = []; //レスポンスの配列
    const maxMatches = 5; //検索する最大数

    // キーワードの配列を使って一つの正規表現を作成
    const re = "^(r)(" + keyword.join("|") + ")(.+)$";
    const regexp = new RegExp(re, "i");

    for (let i = 0; matchedAddresses.length < maxMatches; i++) {
      const account = Wallet.generate();
      const test = regexp.exec(account.address);

      if (test) {
        console.log(account.address);
        // matchedAddresses.push({ address: account.address, secret: account.seed });
        matchedAddresses.push({ address: account.address, secret: account.seed || "" });
      }
    }
    // 最大数に達したらループを止めレスポンスを返す
    if (matchedAddresses.length > 0) {
      setVanity(matchedAddresses)
    }

    setLoading(false);
    setShowSecrets([false]);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const value = event.target.value.replace(/[^A-Za-z1-9,\s]|O|I|l/g, '');
    event.target.value = value;
  }
  function toggleSecret(index: number) {
    const newShowSecrets = [...showSecrets];
    newShowSecrets[index] = !newShowSecrets[index];
    setShowSecrets(newShowSecrets);
  }

  return (
    <div className="p-4 card border border-primary">
      <h2 className="text-accent text-2xl">
        Get Your Vanity Address.
      </h2>
      <form onSubmit={vanitySearch} className="m-4 join join-vertical">
        <input
          type="text"
          name="keyword"
          id="keyword"
          placeholder="word1, word2 word3"
          className="input input-bordered w-full join-item"
          onChange={handleInputChange}
        />
        <button className="btn btn-neutral join-item">search</button>
      </form>
      {loading ? (<>
        <div>
          <span className="loading loading-infinity loading-lg"></span>
          <span className="loading loading-infinity loading-lg"></span>
          <span className="loading loading-infinity loading-lg"></span>
          <span className="loading loading-infinity loading-lg"></span>
          <span className="loading loading-infinity loading-lg"></span>
        </div>
      </>
      ) : (<>
        <h3 className="m-4">Matching</h3>
        {Array.isArray(vanity) && vanity.map((vanityList, index) => (
          <dl className="truncate" key={index}>
            <dt>Address:</dt>
            <dd className="text-success">{vanityList.address} </dd>
            <dt>Secret: </dt>
            <dd className="text-success">{showSecrets[index] ? vanityList.secret : '***************'} </dd>
            <label className="label cursor-pointer w-36 mx-auto">
              <span className="label-text my-auto">Seed is Show or hidden.</span>
              <input
                type="checkbox"
                onChange={() => toggleSecret(index)}
                checked={showSecrets[index] || false}
                className="checkbox"
              />
            </label>
            <br />
          </dl>
        ))}
      </>)}
    </div>
  )
}
