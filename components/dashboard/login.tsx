"use client";

import { Payload, userLogin } from "@/lib/action/user";
import {
  Button,
  Center,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";

export default function Login() {
  const form_initialValues: Payload = { email: "", Password: { password: "" } };
  const form = useForm<Payload>({
    mode: "uncontrolled",
    initialValues: form_initialValues,
  });
  const form_pending = useToggle();
  const form_onSubmit = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    form_pending[1]();
    try {
      await userLogin(values);
    } catch (error) {
      alert(error);
      location.reload();
    }
    form.reset();
    form_pending[1]();
  });
  return (
    <form onSubmit={form_onSubmit}>
      <Center h="100dvh">
        <Fieldset>
          <Stack>
            <TextInput
              autoFocus
              required
              type="email"
              label="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              required
              label="Password"
              key={form.key("Password.password")}
              {...form.getInputProps("Password.password")}
            />
            <Button
              type="submit"
              loading={form_pending[0]}
            >
              Login
            </Button>
          </Stack>
        </Fieldset>
      </Center>
    </form>
  );
}
