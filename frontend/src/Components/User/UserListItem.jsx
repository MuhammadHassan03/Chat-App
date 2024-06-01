import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'

export const UserListItem = ({ handleFunction }) => {
    const user = useSelector(state=>state.user.userInfo)
    return (
        <>
            <Box
            onClick={handleFunction}
            cursor={'pointer'}
            bg={"#E8E8E8"}
            _hover={{
                background: "#38B2AC",
                color: "white",
            }}
            width={"100%"}
            display={"flex"}
            alignItems={'center'}
            color={'white'}
            px={3}
            py={2}
            mb={2}
            borderRadius={"lg"}>
                <Avatar
                mr={2}
                size={'md'}
                cursor={'pointer'}
                name={user.name}
                src={user.picture}/>
                <Box>
                    <Text color={'black'}>{user.name}</Text>
                    <Text color={'black'} fontSize={'xs'}>
                        <b>Email : </b>
                        {user.email}
                    </Text>
                </Box>
            </Box>
        </>
    )
}
