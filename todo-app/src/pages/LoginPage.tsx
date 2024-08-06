import { useEffect, useState } from "react";
import pb from "../pocketbase";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  PasswordInput,
  TextInput,
  Container,
  Title,
  Text,
  Anchor,
  Paper,
  Group,
  Checkbox,
} from "@mantine/core";
import classes from "./LoginPage.module.css";
import { useForm } from "@mantine/form";
import { FormEvent } from "../types";

const LoginPage = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 2 ? "Username is too short (3)" : null,
      password: (value) =>
        value.length < 5 ? "Password is too short (6)" : null,
    },
  });
  const navigate = useNavigate();
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = async (
    values: {
      username: string;
      password: string;
    },
    event: FormEvent | undefined
  ) => {
    event?.preventDefault();
    // FIX: Authentication is not working on mobile device through exposed network
    pb.collection("users")
      .authWithPassword(values.username, values.password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isloading) return <div>Loading...</div>;

  if (pb.authStore.isValid) return <Navigate to="/" />;

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <form
        onSubmit={form.onSubmit((values, event) => handleSubmit(values, event))}
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="Your Username"
            key={form.key("username")}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            key={form.key("password")}
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default LoginPage;
