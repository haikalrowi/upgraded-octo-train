import path from "@/lib/path";
import { redirect } from "next/navigation";

export default function Home_Page() {
  redirect(path.dashboard_home);
}
