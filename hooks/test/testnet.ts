import { Client, SetHookFlags } from '@transia/xrpl'
import { createHookPayload, setHooksV3, SetHookParams } from '@transia/hooks-toolkit'

export async function main(): Promise<void> {
  const serverUrl = 'wss://xahau-test.net'
  const client = new Client(serverUrl)
  await client.connect()
  client.networkID = await client.getNetworkID()

  const hookWallet = (await client.fundWallet()).wallet

  const hookDeposit = createHookPayload(0, 'deposit', 'ns', SetHookFlags.hsfOverride, ['Payment'])
  const hookWithdraw = createHookPayload(0, 'withdraw', 'ns', SetHookFlags.hsfOverride, ['CheckCash'])
  const hookJanken = createHookPayload(0, 'janken', 'ns', SetHookFlags.hsfOverride, ['Invoke'])
  // const hookDist = createHookPayload(0, 'distribution', 'ns', SetHookFlags.hsfOverride, ['Invoke'])

  // deploy
  console.log("deploying...")
  await setHooksV3({
    client: client,
    seed: hookWallet.seed,
    hooks: [{ Hook: hookDeposit }, { Hook: hookWithdraw }, { Hook: hookJanken },
      // { Hook: hookDist}
    ],
  } as SetHookParams)

  await client.disconnect()
}

main()
