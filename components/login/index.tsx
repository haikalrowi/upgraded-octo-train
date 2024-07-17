"use client";

import { userLogin } from "@/lib/action/user";
import { Button, Card, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Login() {
  const form = useForm<{ email: string; password: string }>({
    mode: "uncontrolled",
  });
  const login = form.onSubmit(async (values, event) => {
    event?.preventDefault();
    await userLogin(values.email, values.password);
  });
  return (
    <Stack
      h="100dvh"
      align="center"
      justify="center"
    >
      <Card
        shadow="md"
        withBorder
      >
        <form onSubmit={login}>
          <Stack>
            <TextInput
              label="Email"
              key={form.key("email")}
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            <Button type="submit">Login</Button>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
