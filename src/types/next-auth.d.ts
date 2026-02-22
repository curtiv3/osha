import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      companyId: string | null;
    } & DefaultSession["user"];
  }
}
