import { getAllWriteups } from "@/lib/writeups";
import TerminalPage from "./_terminal";

export default function Page() {
  const writeups = getAllWriteups();
  return <TerminalPage writeups={writeups} />;
}
