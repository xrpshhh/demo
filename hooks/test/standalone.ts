import { SetHookFlags, xrpToDrops } from '@transia/xrpl'
import { createHookPayload, setHooksV3, SetHookParams, Xrpld, SmartContractParams } from '@transia/hooks-toolkit'
import { XrplIntegrationTestContext, serverUrl, setupClient } from '@transia/hooks-toolkit/dist/npm/src/libs/xrpl-helpers'
import { Client, Wallet, AccountObject } from "xrpl"

function toHex(str: string) {
  var result = ''
  for (let i = 0; i < str.length; i++) {
result += str.charCodeAt(i).toString(16)
  }
  return result.toUpperCase()
}

function fromHex(hex: string) {
  let asciiString = "";
  for (let i = 0; i < hex.length; i += 2) {
    const hexByte = hex.substr(i, 2);
    if (hexByte === "00") {
      break;
    }
    const charCode = parseInt(hexByte, 16);
    asciiString += String.fromCharCode(charCode);
  }
  return asciiString;
}

async function getObjects(address: string, objType: "check"): Promise<AccountObject[]> {
  const _client = new Client(serverUrl);
  await _client.connect();
  const response = await _client.request({
      command: "account_objects",
      account: address,
      ledger_index: "validated",
      type: objType
    })
  const objects = response.result.account_objects
  await _client.disconnect()
  return objects

}

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000); // ミリ秒単位で指定
  });
}

async function getHookState(address: string, ns: string): Promise<any> {
  const _client = new Client(serverUrl);
  await _client.connect();
  const response = await _client.request({
    "command": "account_namespace",
    "account": address,
    "namespace_id": ns,
    "ledger_index": "validated"
  })
  if (response.result == null) {
    return []
  }
  // @ts-ignore
  const res = response.result?.namespace_entries;
  if (!res) {
    return []
  }
  await _client.disconnect()
  return res
}

export async function main(): Promise<void> {
  const testContext = (await setupClient(
    serverUrl
  )) as XrplIntegrationTestContext

  const client = testContext.client
  const hookWallet = testContext.alice
  const userWallet = testContext.bob

  const hookDeposit = createHookPayload(0, 'deposit', 'ns', SetHookFlags.hsfOverride, ['Payment'])
  const hookWithdraw = createHookPayload(0, 'withdraw', 'ns', SetHookFlags.hsfOverride, ['CheckCash'])
  const hookJanken = createHookPayload(0, 'janken', 'ns', SetHookFlags.hsfOverride, ['Payment'])
  const hookDist = createHookPayload(0, 'distribution', 'ns', SetHookFlags.hsfOverride, ['Invoke'])

  // deploy
  console.log("deploying...")
  await setHooksV3({
    client: client,
    seed: hookWallet.seed,
    hooks: [
      { Hook: hookDeposit }, { Hook: hookWithdraw }, { Hook: hookJanken },
      { Hook: hookDist}
    ],
  } as SetHookParams)


  // userWalleにCheckが作成されているか
  console.log("userWallet check result...")
  const checks0 = await getObjects(userWallet.address, "check");
  console.log({checks_length: checks0.length});
  // console.log(JSON.stringify(checks1, null,1))

  /*
  ====
  deposit by user
  ====
  create Check to user
  save hash to state
  update state of maxSize
  */
  console.log("user depositing...")
  await Xrpld.submit(client, {
    tx: {
      Account: userWallet.address,
      TransactionType: 'Payment',
      Destination: hookWallet.address,
      Amount: xrpToDrops(3),
    },
    wallet: userWallet,
  })

  await sleep(1);

  // if Check objects exists in userWalle
  console.log("userWallet check result...")
  const checks1 = await getObjects(userWallet.address, "check");
  console.log({checks_length: checks1.length});
  // console.log(JSON.stringify(checks1, null,1))
  console.log(checks1[0])

  // check state
  console.log(toHex("ns"))
  console.log("hookWallet check state result...")
  const hookState = await getHookState(hookWallet.address, hookDeposit.HookNamespace!);
  console.log({hookState_length: hookState.length});
  console.log(JSON.stringify(hookState, null,1))
  for (let i = 0; i < hookState.length; i++) {
    console.log({key: fromHex(hookState[i].HookStateKey),data: fromHex(hookState[i].HookStateData)})
  }


  /*
  ====
  distribution by hook
  ====
  */
 console.log("hook distribution...")
  await Xrpld.submit(client, {
    tx: {
      Account: userWallet.address,
      TransactionType: 'Invoke',
      Destination: hookWallet.address,
      Memos: [
        {
          Memo: {
              MemoData: toHex(xrpToDrops(1)),
          }
        },
      ],
    },
    wallet: userWallet,
  })

//
  console.log("userWallet check result...")
  const checks2 = await getObjects(userWallet.address, "check")
  console.log({checks_length: checks2.length});
  console.log(JSON.stringify(checks2, null,1))

  /*
  ====
  withdraw by user
  自身のdeposit額が引き出される(Checkの清算)
  ====
  */
  if (checks1.length != 0) {
    console.log("user withdrawing...")
    await Xrpld.submit(client, {
      tx: {
        Account: userWallet.address,
        TransactionType: 'CheckCash',
        CheckID: checks1[0].index,
        // @ts-ignore
        Amount: checks1[0].SendMax
      },
      wallet: userWallet,
    })
    console.log("userWallet check result...")
    const checks2 = await getObjects(userWallet.address, "check");
    console.log({checks_length: checks2.length});
    // console.log(JSON.stringify(checks2, null,1))
    console.log(checks2[0])
  } else {
    console.log("no check")
  }


  await client.disconnect()
}

main()
