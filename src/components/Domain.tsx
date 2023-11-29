"use client"

import { useState } from "react";
import { Client, convertHexToString } from "xrpl";

interface TomlResponse {
  account: Array<{
    address: string;
    desc: string;
  }>;
}

export const Domain = () => {
  const [toml, setToml] = useState<TomlResponse | null>(null);
  const [domain, setDomain] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const checkDomainInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const domainValue = formData.get("domain");

    const response = await fetch("/api/toml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain: domainValue }),
    });

    const data = await response.json();
    setToml(data);

    setLoading(false);
  };

  const checkAddressInfo = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const addressValue = formData.get("address");

    const client = new Client("wss://xrpl.ws");
    await client.connect();

    const request: any = await client.request({
      command: "account_info",
      account: addressValue,
    });

    const domain = convertHexToString(request.result.account_data.Domain);

    await client.disconnect();

    setDomain(domain);

    setLoading(false);
  };

  return (
    <div className="p-4 card border border-primary">
      <h2 className="text-accent text-2xl">Check Address.</h2>
      <form onSubmit={checkDomainInfo} className="m-4 join join-vertical">
        <input
          type="text"
          name="domain"
          id="domain"
          placeholder="Domain URL"
          className="input input-bordered w-full join-item"
        />
        <button className="btn btn-neutral join-item">Check Address</button>
      </form>
      <form onSubmit={checkAddressInfo} className="m-4 join join-vertical">
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Address (r...)"
          className="input input-bordered w-full join-item"
        />
        <button className="btn btn-neutral join-item">Check Domain</button>
      </form>

      {loading ? (
        <>
          <h3 className="m-4">Checking...</h3>
          <div>
            {[1, 2, 3, 4, 5].map((key) => (
              <span
                key={key}
                className="loading loading-infinity loading-lg"
              ></span>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className="m-4">Check Results</h3>
          <div className="text-left">
            {toml?.account && Array.isArray(toml.account) ? (
              <>
                {toml.account.map((account, index) => (
                  <dl key={index}>
                    <dt>Address:</dt>
                    <dd className="text-success">{account.address}</dd>
                    <dt>Description:</dt>
                    <dd className="text-success">{account.desc}</dd>
                  </dl>
                ))}
                <br />
              </>
            ) : (
              <>
                <p>No accounts found.</p>
                <br />
              </>
            )}
            {domain ? (
              <>
                <span>Domain: </span>
                <p className="text-success">{domain}</p>
              </>
            ) : (
              <p>Loading or no data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
