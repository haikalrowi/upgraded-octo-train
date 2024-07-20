import route from "@/lib/route";
import { redirect } from "next/navigation";

export default function Home_Page() {
  redirect(route.dashboard_home);
}
