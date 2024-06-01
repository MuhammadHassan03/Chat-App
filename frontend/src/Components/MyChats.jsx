import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getChats, setSelectedChat } from '../Store/Slices/ChatSlice';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../Config/chatLogics';
import { GroupChatModel } from './Miscellaneous/GroupChatModel';
import { ChatLoading } from './ChatLoading';

export const MyChats = () => {
  const dispatch = useDispatch();
  const [loggedUser, setLoggedUser] = useState();
  const user = useSelector(state => state.user.userInfo);
  const chats = useSelector(state => state.chat.chats);
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const { data } = await axios.get("/api/chat", config)
      dispatch(getChats(data));
    }
    catch (error) {
      toast({
        title: 'Error Occured!',
        description: "Failed to Load Chat",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])
  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="#282B34"
    width={{ base: "100%", md: "31%" }}
    borderRadius="8px"
    >

      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display={'flex'}
        width={"100%"}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Text color={'white'}>Inbox</Text>
        <GroupChatModel>
          <Button
            display={'flex'}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            bgColor={'#599AF1'}
            color={'white'}
            rightIcon={<AddIcon />}>
            Group Chat
          </Button>
        </GroupChatModel>
      </Box>
      <Box
        display={'flex'}
        flexDir={'column'}
        p={3}
        width={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => {
              return <Box
                onClick={() => dispatch(setSelectedChat(chat))}
                cursor="pointer"
                bg={selectedChat === chat ? "#3B3E46" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}>
                <Text>{!chat.isGroupChat ? (getSender(loggedUser, chat.users)) : (chat.chatName)}</Text>
              </Box>
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}
