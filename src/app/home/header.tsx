"use client";
import { useState } from "react";
import {
  IconAlignBoxLeftTop,
  IconChevronDown,
  IconLogout,
} from "@tabler/icons-react";
import cx from "clsx";
import {
  Avatar,
  Burger,
  Container,
  Group,
  Menu,
  Tabs,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import classes from "./Header.module.css";
import { useRouter } from "next/navigation";
import { GetInTouch } from "./popup";

interface HeaderType {
  setSessionSelected: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  admin: boolean;
}

export function Header({ setSessionSelected, name, admin }: HeaderType) {
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);

  const tabs = ["Tasks", "Completed Tasks"];
  const tabsAdmin = ["Tasks", "Completed Tasks", "Users"];
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const router = useRouter();
  const items = admin
    ? tabsAdmin.map((tab) => (
        <Tabs.Tab value={tab} key={tab} onClick={() => setSessionSelected(tab)}>
          {tab}
        </Tabs.Tab>
      ))
    : tabs.map((tab) => (
        <Tabs.Tab value={tab} key={tab} onClick={() => setSessionSelected(tab)}>
          {tab}
        </Tabs.Tab>
      ));
  function logout() {
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("userId", "");
    router.replace("/login");
    console.log("loged out");
  }
  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          <Title order={1}>Task Enginer</Title>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: "pop-top-right" }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, {
                  [classes.userActive]: userMenuOpened,
                })}
              >
                <Group gap={7}>
                  <Avatar alt={name} radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {name}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>

              <Menu.Item
                onClick={logout}
                leftSection={<IconLogout size={16} stroke={1.5} />}
              >
                Logout
              </Menu.Item>
              {admin === true ? (
                <>
                  <Menu.Item
                    onClick={() => setShowAddUser(true)}
                    leftSection={<Avatar alt={name} radius="xl" size={20} />}
                  >
                    New User
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => setShowAddTask(true)}
                    leftSection={
                      <IconAlignBoxLeftTop stroke={2} radius="xl" size={20} />
                    }
                  >
                    New Task
                  </Menu.Item>
                </>
              ) : null}

              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>
      {showAddUser && (
        <GetInTouch Popup={"Adduser"} setPopup={setShowAddUser} />
      )}
      {showAddTask && (
        <GetInTouch Popup={"Addtask"} setPopup={setShowAddTask} />
      )}
    </div>
  );
}
