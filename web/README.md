Q4 Goal

Chat app

- single chat room
- group chat room

- Websocket + fireStore
- include emojies
- is typings... feature

- workflow
  1- create a user on the webapp page (at least 2)
  2- user1 selects user2, a roomId is generated and saved in DB + wsc subscribed to this roomId. The roomId will be use for the communication channel between user1 and user2  
  3- create a group chat a roomId is generated and saved in DB + wsc subscribed to WS. Add users to the group, each user wsc will subscribe to the group roomId

--- an admin page to create users + list of created users
--- on a user click, open a user personal page
------ a button to create a single chat
---------- clicking create chat, the list of other users appears for selection
---------- a room is created on the page (textbox + messages list above)
---------- If the selected user had previoully a chat with current user, display the conversation historic saved into DB

------ a button to create a group chat
------ on a user click, open a user personal page
--------- a button to create a single chat
------------- clicking create chat, the list of other users appears for selection
------------- a room is created on the page (textbox + messages list above)
------------- If the selected users had previoully a chat with current user, display the conversation historic saved into DB

Demo

- open 4 web windows
- 3 for user different users
- 1 for the group chat
