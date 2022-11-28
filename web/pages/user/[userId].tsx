import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { websocketClient } from "../../clients/websocket";
import Api, { ApiMessage, IChatRoom, IUser } from "../../repositories";
import CommentIcon from "@mui/icons-material/Comment";

export default function User() {
  const router = useRouter();
  const { userId } = router.query;
  const [roomName, setRoomName] = useState<string>();
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [room, setRoom] = useState<IChatRoom>();
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<Array<IUser>>([]);
  const [messageText, setMessageText] = useState<string>();
  const [isGroupChat, setIsGroupChat] = useState<boolean>();
  const [selectedUser, setSelectedUser] = useState<string>();
  const [roomAttendees, setRoomAttendees] = useState<IUser[]>([]);
  const [roomMessages, setRoomMessages] = useState<ApiMessage[]>([]);

  const api = new Api();

  const loadUsers = async () => {
    const allusers = await api.users.listAllUsers();
    setUsers(allusers);
  };
  const loadRooms = async (userId: string) => {
    const rms = await api.chatRooms.listRoomsByUser(userId);
    setRooms(rms);
  };
  const handleGroupChat = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsGroupChat(event.target.checked);
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    const at = event.target.value as string;
    setSelectedUser(at);

    if (roomAttendees.find((i) => i.id === at)) {
      return;
    }

    const su = users.find((u) => u.id === at);
    const ats: IUser[] = [];
    if (su) {
      ats.push(su);
    }
    if (user && !roomAttendees.find((i) => i.id === user?.id)) {
      ats.push(user);
    }

    if (ats.length) {
      setRoomAttendees(ats);
    }
  };

  const initWebsocket = () => {
    if (room) {
      const wsc = websocketClient();
      wsc.subscribe(room.id);
      wsc.onServerMessage((data: ApiMessage) => {
        // add to list
        setRoomMessages([...roomMessages, data]);
      });
    }
  };

  const startChat = async () => {
    if (!roomAttendees.length) {
      alert("Select a user first");
      return;
    }

    if (isGroupChat) {
      // create new
      // start chat with at least 3
      if (roomAttendees.length < 3) {
        alert("Select at least 3 users for a group chat");
        return;
      }
    } else {
      if (roomAttendees.length < 2) {
        alert("Select at least 2 users for a chat");
        return;
      }
    }
    try {
      const chatRoom = await api.chatRooms.addChatRoom(roomAttendees.map((a) => a.id));
      setRoom(chatRoom);
      setRooms([...rooms, chatRoom]);
      setRoomName(`Chat room ${rooms.length + 1}`);
      initWebsocket();
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const showChatRoom = async (roomId: string) => {
    try {
      const chatRoom = await api.chatRooms.getRoom(roomId);
      // set attendees
      const attendeeds = users.filter((u) => chatRoom.attendees.includes(u.id));
      setRoomAttendees(attendeeds);

      setRoom(chatRoom);
      initWebsocket();
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const loadUser = useCallback(async (userId: string) => {
    const u = await api.users.getUserById(userId);
    if (u) {
      setUser(u);
    }
  }, []);

  useEffect(() => {
    if (router.isReady && typeof userId === "string") {
      loadUser(userId);
      loadUsers();
      loadRooms(userId);
    }
  }, [router.isReady, userId]);

  return (
    <Box p={10}>
      <Box>
        <h1>Welcome back {user?.name}</h1>
      </Box>
      <Box display={"flex"} mb={5}>
        <Box mr={5}>
          <Button onClick={startChat} variant={"contained"}>
            Start a Chat
          </Button>
        </Box>
        <FormGroup>
          <FormControlLabel control={<Checkbox onChange={handleGroupChat} />} label="Group Chat" />
        </FormGroup>
        <Box width={300}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Users</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedUser}
              label="User"
              onChange={handleSelectChange}>
              {users
                .filter((u) => u.id !== user?.id)
                .map((u, i) => (
                  <MenuItem key={i} value={u.id}>{`${u.name} - ${u.email}`}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
        <Box display={"flex"} width={"30%"} flexDirection={"column"} borderRight={"1px solid grey"}>
          <Box borderBottom={"1px solid grey"}>
            <Typography variant="h4">Rooms</Typography>
          </Box>

          <Box>
            <List sx={{ width: "100%", maxWidth: 300, bgcolor: "background.paper" }}>
              {rooms.map((r, i) => {
                const rn = `Chat room ${i + 1}`;
                const labelId = `checkbox-list-label-${i}`;
                return (
                  <ListItem
                    key={"k"}
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments">
                        <CommentIcon />
                      </IconButton>
                    }
                    disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={() => {
                        showChatRoom(r.id);
                        setRoomName(rn);
                      }}
                      dense>
                      <ListItemText id={labelId} primary={rn} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>

        <Box display={"flex"} width={"70%"} flexDirection={"column"} pl={2}>
          <Box>
            <Typography variant="h4">{roomName || "Chat"}</Typography>{" "}
            <Typography>{`Users in room :  ${roomAttendees.map((u) => u.name).join(", ")}`}</Typography>
          </Box>

          {room && (
            <Box display={"flex"} flexDirection={"column"}>
              <Box display={"flex"} height={250} border={"1px solid #DEDEDE"} borderRadius={2}>
                <Stack direction="column" width={1} p={1}>
                  <Item>Item 1</Item>
                </Stack>
              </Box>
              <Box display={"flex"} my={3} minHeight={100} width={1} flexDirection={"row"}>
                <>
                  <Editor
                    apiKey="rga2rmxsusyyum6rg2ibpgredq9yxsoq6n7worm2emsaiyp1"
                    init={{
                      skin: "borderless",
                      icons: "small",
                      menubar: false,
                      toolbar_location: "bottom",
                      plugins: "autoresize link lists emoticons image",
                      autoresize_bottom_margin: 0,
                      max_height: 500,
                      width: "100%",
                      placeholder: "Enter message . . .",
                      toolbar:
                        "bold italic strikethrough link numlist bullist blockquote emoticons image | mySendButton",
                      setup: (editor) => {
                        editor.ui.registry.addButton("mySendButton", {
                          tooltip: "Send Message",
                          text: "Send",
                          onAction: () => {
                            const txt = editor.getContent();
                            if (txt) {
                              setMessageText(txt);
                              editor.resetContent();
                            }
                          },
                        });
                      },
                    }}
                  />
                </>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1A2027",
  alignItems: "stretch",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: "#fff",
}));
