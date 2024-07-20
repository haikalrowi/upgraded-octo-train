"use client";

import { userLogout } from "@/lib/action/user";
import path from "@/lib/path";
import {
  Anchor,
  AppShell,
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Dashboard({ children }: React.PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const { toggleColorScheme } = useMantineColorScheme();
  const pathname = usePathname();
  const logout = async () => {
    await userLogout();
  };
  return (
    <AppShell
      header={{ height: 16 * 4 }}
      navbar={{
        width: 16 * 16,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md">
        <Group
          h="100%"
          justify="space-between"
        >
          <Burger
            hiddenFrom="sm"
            size="sm"
            opened={opened}
            onClick={toggle}
          />
          <Anchor
            component={Link}
            href={path.dashboard_home}
          >
            Logo
          </Anchor>
          <Group visibleFrom="sm">
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={toggleColorScheme}
            >
              Theme
            </Button>
            <Menu
              trigger="hover"
              width={16 * 16}
            >
              <Menu.Target>
                <UnstyledButton>
                  <Avatar>XX</Avatar>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={logout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section
          component={ScrollArea}
          grow
        >
          {pathname.startsWith(path.dashboard_presentation_home) && (
            <>
              <NavLink
                component={Link}
                href={path.dashboard_presentation_create}
                label="Create"
                active={pathname === path.dashboard_presentation_create}
                onClick={toggle}
              />
              <NavLink
                component={Link}
                href={path.dashboard_presentation_update}
                label="Update"
                active={pathname === path.dashboard_presentation_update}
                onClick={toggle}
              />
            </>
          )}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
