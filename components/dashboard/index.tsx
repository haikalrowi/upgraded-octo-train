"use client";

import { userLogout } from "@/lib/action/user";
import route from "@/lib/route";
import {
  ActionIcon,
  Affix,
  Anchor,
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  ThemeIcon,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { Prisma } from "@prisma/client";
import {
  IconArrowsMaximize,
  IconCopyright,
  IconMoonFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = React.PropsWithChildren & {
  user: Prisma.UserGetPayload<{}>;
};

export default function Dashboard(props: Props) {
  const header_logo = (
    <ThemeIcon variant="transparent">
      <IconCopyright />
    </ThemeIcon>
  );
  const header_logout = async () => {
    await userLogout();
  };
  const [opened, { toggle }] = useDisclosure();
  const { toggleColorScheme } = useMantineColorScheme();
  const header = (
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
            {header_logo}
          </Anchor>
        </Group>
        <Group justify="center">
          <Anchor
            hiddenFrom="sm"
            component={Link}
            href={route.dashboard_home}
          >
            {header_logo}
          </Anchor>
        </Group>
        <Group justify="end">
          <ActionIcon
            visibleFrom="sm"
            variant="subtle"
            size="compact-sm"
            onClick={toggleColorScheme}
          >
            <IconMoonFilled />
          </ActionIcon>
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
              <Menu.Item onClick={header_logout}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
  const navbar_pathname = usePathname();
  const navbar = (
    <AppShell.Navbar p="md">
      <AppShell.Section
        component={ScrollArea}
        grow
      >
        {navbar_pathname.startsWith(route.dashboard_presentation_home) && (
          <>
            <NavLink
              component={Link}
              href={route.dashboard_presentation_create}
              label="Create"
              active={navbar_pathname.includes(
                route.dashboard_presentation_create,
              )}
              onClick={toggle}
            />
            <NavLink
              component={Link}
              href={route.dashboard_presentation_update}
              label="Update"
              active={navbar_pathname.includes(
                route.dashboard_presentation_update,
              )}
              onClick={toggle}
            />
          </>
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
  const main = <AppShell.Main>{props.children}</AppShell.Main>;
  const fullScreenState = useToggle();
  const toggleFullScreen = () => {
    fullScreenState[1](!fullScreenState[0]);
  };
  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 16 * 4 }}
        navbar={{
          width: 16 * 16,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        disabled={fullScreenState[0]}
      >
        {header}
        {navbar}
        {main}
      </AppShell>
      <Affix position={{ bottom: 16 * 1, right: 16 * 1 }}>
        <ActionIcon
          variant="subtle"
          size="compact-sm"
          onClick={toggleFullScreen}
        >
          <IconArrowsMaximize />
        </ActionIcon>
      </Affix>
    </>
  );
}
