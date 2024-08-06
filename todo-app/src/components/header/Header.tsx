import { useState } from "react";
import {
  Container,
  Group,
  Burger,
  Text,
  Stack,
  Collapse,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";
import pb from "../../pocketbase";
import { useNavigate } from "react-router-dom";
import { MouseEvent } from "../../types";
import { ThemeToggle } from "../theme_toggle/ThemeToggle";

const links = [
  { link: "/about", label: "Features" },
  { link: "/pricing", label: "Pricing" },
  { link: "/learn", label: "Learn" },
  { link: "/community", label: "Community" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const navigate = useNavigate();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  const handleLogout = (event: MouseEvent) => {
    event.preventDefault();
    pb.authStore.clear();
    navigate("/login");
  };

  return (
    <div className={classes.header}>
      {/*<header className={classes.header}>*/}
      <Container size="md" className={classes.inner}>
        <Text>Todo App</Text>

        <Group gap={5} visibleFrom="xs" justify="space-between">
          {items}
        </Group>

        <Group>
          <ThemeToggle />

          <Button
            color="red"
            size="sm"
            visibleFrom="xs"
            onClick={(e) => handleLogout(e)}
          >
            Logout
          </Button>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
      </Container>

      <Collapse in={opened} hiddenFrom="xs" className={classes.collapse}>
        <Stack
          h={300}
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="flex-start"
          gap="sm"
        >
          {items}
          <Button
            color="red"
            size="sm"
            className={classes.logout}
            onClick={(e) => handleLogout(e)}
          >
            Logout
          </Button>
        </Stack>
      </Collapse>
      {/*</heade*/}
    </div>
  );
}
