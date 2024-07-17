"use client";

import { userLogout } from "@/lib/action/user";
import path from "@/lib/path";
import {
  Anchor,
  AppShell,
  Burger,
  Button,
  Group,
  Menu,
  NavLink,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Dashboard({ children }: React.PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
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
            <Menu>
              <Menu.Target>
                <Button>User</Button>
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
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
