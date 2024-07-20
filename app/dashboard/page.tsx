import route from "@/lib/route";
import { redirect } from "next/navigation";

export default async function Dashboard_Page() {
  redirect(route.dashboard_presentation_home);
}
