import { Box } from '@chakra-ui/react';
import React from 'react'
import { useSelector } from 'react-redux'
import { SingleChat } from './SingleChat';

export const ChatBox = () => {

  const selectedChat = useSelector(state => state.chat.selectedChat);

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems={'center'}
      flexDir={'column'}
      p={3}
      width={{base : '100%', md: '68%'}}
      borderRadius={'8px'}
      backgroundColor={'#282B34'}
    >
      <SingleChat/>
    </Box>
  )
}
