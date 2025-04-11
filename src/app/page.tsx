import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import HomeContent from "../components/HomeContent";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <HomeContent session={session} />;
}