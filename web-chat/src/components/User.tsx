import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
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
import parse from "html-react-parser";
// import { Editor } from "@tinymce/tinymce-react";

import React, { useCallback, useEffect, useState } from "react";
import { IOnUserTyping, websocketClient } from "../clients/websocket";
import Api, { ApiMessage, IChatRoom, IUser } from "../repositories";
import CommentIcon from "@mui/icons-material/Comment";
import { useParams } from "react-router-dom";

export default function User() {
  const params = useParams();
  const { userId } = params;
  const [roomName, setRoomName] = useState<string>();
  const [rooms, setRooms] = useState<IChatRoom[]>([]);
  const [room, setRoom] = useState<IChatRoom>();
  const [user, setUser] = useState<IUser>();
  const [users, setUsers] = useState<Array<IUser>>([]);

  const [selectedUser, setSelectedUser] = useState<string>();
  const [roomAttendees, setRoomAttendees] = useState<IUser[]>([]);
  const [roomMessages, setRoomMessages] = useState<ApiMessage[]>([]);
  const [textMessage, setTextMessage] = useState<string>("");
  const [currentTyping, setCurrentTyping] = useState<IOnUserTyping | null>();

  const wsc = websocketClient();
  const api = new Api();

  const loadUsers = async () => {
    const allusers = await api.users.listAllUsers();
    setUsers(allusers);
  };
  const loadRooms = async (userId: string) => {
    const rms = await api.chatRooms.listRoomsByUser(userId);
    setRooms(rms);
  };
  const loadRoomMessages = async (roomId: string) => {
    const messages = await api.messages.listMessageByRoomId(roomId);
    setRoomMessages(messages);
  };
  // const resetChat = () => {
  //   setRoomAttendees([]);
  // };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const at = event.target.value as string;
    setSelectedUser(at);

    if (roomAttendees.find((i) => i.id === at)) {
      return;
    }

    const su = users.find((u) => u.id === at);
    const ats: IUser[] = [...roomAttendees];
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

  const initWebsocket = (roomId: string) => {
    wsc.subscribe(roomId);
    wsc.onServerMessage((data: ApiMessage[]) => {
      setRoomMessages(data);
    });

    wsc.onUserTypingMessage((data: IOnUserTyping) => {
      if (data.email === user?.email) {
        return;
      }

      setCurrentTyping(data.clear ? undefined : data);
    });
  };

  const handleInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setTextMessage(value);

    if (!user || !room) {
      return;
    }
    wsc.onTyping({ roomId: room.id, email: user.email, name: user.name });
  };

  const startChat = async () => {
    if (!roomAttendees.length) {
      alert("Select a user first");
      return;
    }

    if (roomAttendees.length < 2) {
      alert("Select at least 2 users for a chat");
      return;
    }

    try {
      const chatRoom = await api.chatRooms.addChatRoom(roomAttendees.map((a) => a.id));
      setRoom(chatRoom);
      setRooms([...rooms, chatRoom]);
      setRoomName(`Chat room ${rooms.length + 1}`);
      initWebsocket(chatRoom.id);
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
      await loadRoomMessages(chatRoom.id);
      initWebsocket(chatRoom.id);
    } catch (error) {
      console.log(error);
      alert("error");
    }
  };

  const sendMessage = async () => {
    if (!textMessage) {
      if (room && user && !textMessage) {
        wsc.onTyping({ roomId: room?.id, email: user?.email, name: user?.name, clear: true });
      }
      return;
    }
    if (!user || !room) {
      return;
    }
    try {
      await api.messages.createMessage({
        authorId: user.id,
        text: textMessage,
        roomId: room.id,
      });
      setTextMessage("");
      wsc.onTyping({ roomId: room.id, email: user.email, name: user.name, clear: true });
    } catch (error) {
      console.log(error);
      alert("ERROR");
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
    if (userId) {
      loadUser(userId);
      loadUsers();
      loadRooms(userId);
    }
  }, [userId]);

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

        <Box width={300}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Users</InputLabel>
            <Select
              disabled={!!room}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedUser}
              label="User"
              onChange={handleSelectChange}>
              {users
                .filter((u) => !roomAttendees.map((x) => x.id).includes(u.id) && u.id !== user?.id)
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
                    key={i}
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
          {roomAttendees.length > 0 && (
            <Box>
              <Typography variant="h4">{roomName || "Chat"}</Typography>{" "}
              <Typography>{`Users in room :  ${roomAttendees.map((u) => u.name).join(", ")}`}</Typography>
            </Box>
          )}

          {room && (
            <Box display={"flex"} flexDirection={"column"}>
              <Box display={"flex"} height={250} border={"1px solid #DEDEDE"} borderRadius={2} overflow={"scroll"}>
                <Stack direction="column" width={1} p={1}>
                  {roomMessages.map((m, i) => {
                    return (
                      <Box key={`b-${i}`} width={1} textAlign={m.author.id !== user?.id ? "left" : "right"}>
                        <Typography variant={"subtitle1"}>{`${m.author.name} | ${m.time}`} </Typography>
                        <Item key={i}> {parse(m.text)} </Item>
                      </Box>
                    );
                  })}
                  {currentTyping && (
                    <Box width={1} textAlign={"left"} mt={3}>
                      <Typography variant={"body2"}>
                        <i title={`${currentTyping.name} | ${currentTyping.email}`}>
                          {`${currentTyping.name} is typing...`}
                        </i>
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Box display={"flex"} my={3} width={1}>
                <form
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "30px",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}>
                  <input
                    style={{
                      display: "flex",
                      width: "100%",
                      height: "30px",
                    }}
                    type="text"
                    placeholder="Message..."
                    value={textMessage}
                    onChange={(e) => handleInputText(e)}
                  />
                </form>
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

  color: "#fff",
}));
