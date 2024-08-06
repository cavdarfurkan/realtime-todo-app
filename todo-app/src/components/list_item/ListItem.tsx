import classes from "./ListItem.module.css";
import { ActionIcon, Checkbox, Modal, ScrollArea, Text } from "@mantine/core";
import pb from "../../pocketbase";
import { IconTrash } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export type ListItemType = {
  id: string;
  text: string;
  author: string;
  isCompleted: boolean;
};

type ListItemProps = {
  props: ListItemType;
};

const ListItem: React.FC<ListItemProps> = ({ props }) => {
  const [modalOpened, { open, close }] = useDisclosure(false);

  const handleCheckbox = async () => {
    await pb.collection("todos").update(props.id, {
      isCompleted: !props.isCompleted,
    });
  };

  const deleteItem = async () => {
    await pb.collection("todos").delete(props.id);
  };

  return (
    <div className={classes.item}>
      <Checkbox
        checked={props.isCompleted}
        onChange={handleCheckbox}
        tabIndex={-1}
        size="md"
        mr="xl"
        styles={{ input: { cursor: "pointer" } }}
        aria-hidden
      />

      <div style={{ marginRight: "auto" }}>
        <Text lineClamp={2} onClick={open} className={classes.text}>
          {props.text}
        </Text>
        <Modal
          opened={modalOpened}
          onClose={close}
          size="auto"
          withCloseButton={false}
          scrollAreaComponent={ScrollArea.Autosize}
        >
          {props.text}
        </Modal>
        <Text c="dimmed" size="sm">
          {props.author}{" "}
        </Text>
      </div>

      <div>
        <ActionIcon
          variant="subtle"
          color="rgba(255, 15, 15, 1)"
          size="lg"
          aria-label="Delete"
          onClick={deleteItem}
        >
          <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </div>
    </div>
  );
};

export default ListItem;
