"use client";

import { userLogin } from "@/lib/action/user";
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
  const form = useForm<{ email: string; password: string }>({
    mode: "uncontrolled",
  });
  const pending = useToggle();
  const form_onSubmit = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    pending[1]();
    try {
      await userLogin(values.email, values.password);
    } catch (error) {
      alert(error);
      location.reload();
    }
    pending[1]();
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
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Button
              type="submit"
              loading={pending[0]}
            >
              Login
            </Button>
          </Stack>
        </Fieldset>
      </Center>
    </form>
  );
}
