import { SetHookFlags} from '@transia/xrpl'
import { createHookPayload, setHooksV3, SetHookParams, Xrpld, SmartContractParams } from '@transia/hooks-toolkit'
import { XrplIntegrationTestContext, serverUrl, setupClient } from '@transia/hooks-toolkit/dist/npm/src/libs/xrpl-helpers'

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

  await client.disconnect()
}

main()
