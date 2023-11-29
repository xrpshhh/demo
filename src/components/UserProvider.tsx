"use client"

import { useState, useEffect, useContext, createContext } from "react";
import { Xumm } from "xumm";

const xumm = new Xumm(process.env.XUMMAPI || "", process.env.XUMMSECRET || "");

type UserInfoType = {
  account?: string;
  name?: string;
  // email?: string;
  domain?: string;
  picture?: string;
  networkEndpoint?: string;
  networkType?: string;
  source?: string;
  kycApproved?: boolean;
  token?: string;
};

type UserContextType = {
  userInfo: UserInfoType;
  xumm: typeof xumm;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const profile = xumm.user
      const user = {
        account: await profile.account,
        name: await profile.name,
        // email: await profile.email,
        domain: await profile.domain,
        picture: await profile.picture,
        networkEndpoint: await profile.networkEndpoint,
        networkType: await profile.networkType,
        source: await profile.source,
        kycApproved: await profile.kycApproved,
        token: await profile.token
    };
      setUserInfo(user);
      // setUserInfo(profile);
      // const jwt = await xumm.environment.jwt
      // console.log("jwt:", jwt);
    };
    fetchData();
  }, []);

  return (
      <UserContext.Provider value={{userInfo, xumm}}>
          {children}
      </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
