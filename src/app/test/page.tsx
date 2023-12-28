import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";

export default async function TestPage() {
  const session = await getServerSession(authOptions);
  return <div>{session?.user.id}</div>;
}
