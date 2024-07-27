import dynamic from "next/dynamic";

const Form = dynamic(() => import("@/components/dashboard/presentation/form"), {
  ssr: false,
});

export default function Create_Page() {
  return <Form type="create" />;
}
