import { Box, Button, Input, List, ListItem, Typography } from "@mui/material";

import { useEffect, useState } from "react";
import Api, { IUser } from "../repositories";

export default function Home() {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [users, setUsers] = useState<Array<IUser>>([]);

  const api = new Api();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadUsers = async () => {
    const allusers = await api.users.listAllUsers();
    setUsers(allusers);
  };

  const onAddUser = async () => {
    if (name && email) {
      try {
        const newUser = await api.users.addUser({ email, name });
        if (newUser) {
          const newList = [...users, newUser];
          setUsers(newList);
        }
      } catch (error) {
        alert("Error");
        console.log(error);
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Box p={10}>
      <Box>
        <h1>Chats with friends</h1>
      </Box>
      <Box display={"flex"}>
        <Typography mr={3}>Name</Typography>
        <Input
          onChange={(e) => {
            setName(e.target.value);
          }}
          type={"text"}></Input>
      </Box>
      <Box display={"flex"} mt={3}>
        <Typography mr={3}>Email</Typography>
        <Input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type={"text"}></Input>
      </Box>

      <Box display={"flex"} mt={3}>
        <Button variant={"contained"} onClick={onAddUser}>
          Add User
        </Button>
      </Box>
      {/**User list here from db with link to user page */}
      <Box mt={3}>
        <List aria-label="basic-list">
          {users.map((u: IUser, i: number) => {
            return (
              <ListItem key={i}>
                <a href={`/user/${u.id}`}> {`${u.name} - ${u.email}`}</a>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
