"use client";

import { userLogout } from "@/lib/action/user";
import route from "@/lib/route";
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
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Dashboard({
  children,
  ...props
}: React.PropsWithChildren & { user: Prisma.UserGetPayload<{}> }) {
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
          grow
        >
          <Group>
            <Burger
              hiddenFrom="sm"
              size="sm"
              opened={opened}
              onClick={toggle}
            />
            <Anchor
              visibleFrom="sm"
              component={Link}
              href={route.dashboard_home}
            >
              Logo
            </Anchor>
          </Group>
          <Group justify="center">
            <Anchor
              hiddenFrom="sm"
              component={Link}
              href={route.dashboard_home}
            >
              Logo
            </Anchor>
          </Group>
          <Group justify="end">
            <Button
              visibleFrom="sm"
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
                  <Avatar
                    name={props.user.name}
                    color="initials"
                  />
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
          {pathname.startsWith(route.dashboard_presentation_home) && (
            <>
              <NavLink
                component={Link}
                href={route.dashboard_presentation_create}
                label="Create"
                active={pathname === route.dashboard_presentation_create}
                onClick={toggle}
              />
              <NavLink
                component={Link}
                href={route.dashboard_presentation_update}
                label="Update"
                active={pathname === route.dashboard_presentation_update}
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
