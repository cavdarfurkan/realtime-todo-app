import {
  ActionIcon,
  AppShell,
  Container,
  rem,
  Textarea,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import List from "./components/list/List";
import { ListItemType } from "./components/list_item/ListItem";
import { getHotkeyHandler, useListState } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import pb from "./pocketbase";

function App() {
  const model = pb.authStore.model;

  const [value, setValue] = useState("");
  const [state, handlers] = useListState<ListItemType>();

  // Fetch todos and set state
  const fetchTodos = useCallback(async () => {
    try {
      const todos = await pb.collection("todos").getFullList();
      const formattedTodos = todos.map(
        (todo): ListItemType => ({
          id: todo.id,
          text: todo.text,
          author: todo.author,
          isCompleted: todo.isCompleted,
        })
      );
      handlers.setState(formattedTodos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  }, []);

  /**
   * Adds item to the list state
   *
   * @param {ListItemType} item
   * @returns {void}
   */
  const addItem = useCallback(
    (item: ListItemType) => {
      handlers.append(item);
    },
    [handlers]
  );

  /**
   * Updates item in the list state
   *
   * @param {ListItemType} updatedItem
   * @returns {void}
   */
  const updateItem = useCallback(
    (updatedItem: ListItemType) => {
      const itemIndex = state.findIndex((item) => item.id === updatedItem.id);

      if (itemIndex !== -1) {
        handlers.setItemProp(itemIndex, "isCompleted", updatedItem.isCompleted);
      } else {
        console.error(`Item with ID ${updatedItem.id} not found.`);
      }
    },
    [handlers, state]
  );

  /**
   * Removes item in the list state
   *
   * @param {ListItemType} removedItem
   * @returns {void}
   */
  const removeItem = useCallback(
    (removedItem: ListItemType) => {
      const itemIndex = state.findIndex((item) => item.id === removedItem.id);

      handlers.remove(itemIndex);
    },
    [handlers, state]
  );

  // Initial fetch on component mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  /**
   * Subscribe to 'todos' collection on pocketbase when component mounts
   * Unsubscribe when component unmounts
   */
  useEffect(() => {
    pb.collection("todos").subscribe("*", function (e) {
      const item: ListItemType = {
        id: e.record.id,
        text: e.record.text,
        author: e.record.author,
        isCompleted: e.record.isCompleted,
      };

      switch (e.action) {
        case "create":
          addItem(item);
          break;
        case "update":
          updateItem(item);
          break;
        case "delete":
          removeItem(item);
          break;
        default:
          console.log("Unimplemented action:", e.action);
          break;
      }
    });

    return () => {
      pb.collection("todos").unsubscribe("*");
    };
  }, [addItem, removeItem, updateItem]);

  /**
   * Saves item to pocketbase, then subscription is triggered for 'create'
   *
   * @param {React.MouseEvent | React.KeyboardEvent} event
   * @param {ListItemType} item
   * @returns {Promise<void>}
   */
  const saveItem = async (
    event: React.MouseEvent | React.KeyboardEvent,
    item: ListItemType
  ): Promise<void> => {
    event.preventDefault();

    const data = {
      text: item.text,
      author: item.author,
      user: model?.id,
      isCompleted: item.isCompleted,
    };

    await pb.collection("todos").create(data);
    setValue("");
  };

  return (
    <AppShell
      header={{ height: 60, offset: true }}
      footer={{ height: 60, offset: true }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main my={16}>
        <Container>
          <Title>Welcome {model?.username}</Title>

          <List data={state} />
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={getHotkeyHandler([
              [
                "mod+Enter",
                (e) =>
                  saveItem(e, {
                    id: "",
                    text: value,
                    author: model?.username,
                    isCompleted: false,
                  }),
              ],
            ])}
            radius="md"
            size="lg"
            placeholder="Enter a todo"
            autosize
            maxRows={3}
            rightSectionWidth={64}
            rightSection={
              <ActionIcon
                size={32}
                radius="md"
                variant="filled"
                onClick={(e) =>
                  saveItem(e, {
                    id: "",
                    text: value,
                    author: model?.username,
                    isCompleted: false,
                  })
                }
              >
                <IconArrowRight
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              </ActionIcon>
            }
          />
        </Container>
      </AppShell.Main>

      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
