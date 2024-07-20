import route from "@/lib/route";
import { redirect } from "next/navigation";

export default function Presentation_Page() {
  redirect(route.dashboard_presentation_create);
}
