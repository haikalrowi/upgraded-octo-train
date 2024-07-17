import path from "@/lib/path";
import { redirect } from "next/navigation";

export default function Presentation_Page() {
  redirect(path.dashboard_presentation_create);
}
