import React from "react";
import ListItem, { ListItemType } from "../list_item/ListItem";

type ListProps = {
  data: ListItemType[];
};

const List: React.FC<ListProps> = ({ data }) => {
  const items = data.map((item, index) => (
    <ListItem key={index} props={{ ...item }} />
  ));

  return <div>{items}</div>;
};

export default List;
