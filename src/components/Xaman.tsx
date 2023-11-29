"use client"

// import { useState } from "react";
import { useUser} from "@/components/UserProvider";

export const Xaman = () => {
  const { xumm } = useUser();

      (async () => {
        // console.log(await xumm.helpers?.getCuratedAssets());

        // const storageSet = await xumm.backendstore.set({
        //     name: "Lisaog3",
        //     age: 27,
        //     male: true,
        // });
        // console.log(storageSet);

        // const storageGet = await xumm.backendstore.get();
        // console.log(storageGet);

        // const storageDelete = await xumm.backendstore.delete();
        // console.log(storageDelete);

        // const storageGetAfterDelete = await xumm.backendstore.get();
        // console.log(storageGetAfterDelete);

      //   const userstoreSet = await xumm.userstore.set('userdeta',{
      //     name: "101"
      //   })
      //   console.log(userstoreSet)

      //   const userstoreList = await xumm.userstore.list()
      //   console.log(userstoreList)

      //   const userstoreGet = await xumm.userstore.get('userdeta')
      //   console.log(userstoreGet)

      //   const userstoreDelete = await xumm.userstore.delete('userdeta')
      //   console.log(userstoreDelete)
      })()

  return (
    <>
      {/* {account && ( */}
        <div>
          {/* {account} */}
        </div>
      {/* )} */}
    </>
  )
}
