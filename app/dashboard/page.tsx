import path from "@/lib/path";
import { redirect } from "next/navigation";

export default async function Dashboard_Page() {
  redirect(path.dashboard_presentation_home);
}
