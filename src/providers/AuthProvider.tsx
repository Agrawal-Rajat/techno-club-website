"use client";

import * as NextAuthReact from "next-auth/react"; // import everything as a module
import { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const SessionProvider = (NextAuthReact as any).SessionProvider;
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
