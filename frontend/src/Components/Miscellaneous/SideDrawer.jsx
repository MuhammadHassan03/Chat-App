import React, { useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon, Search2Icon } from '@chakra-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { ProfileModel } from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { ChatLoading } from '../ChatLoading';
import { UserListItem } from '../User/UserListItem';
import { setSelectedChat, setChats } from '../../Store/Slices/ChatSlice';
import { Slide } from '@chakra-ui/react';
import { getSender } from '../../Config/chatLogics';
import { filterNofitification } from '../../Store/Slices/userSlice';

export const SideDrawer = () => {
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const user = useSelector(state => state.user.userInfo);
    const chats = useSelector(state => state.chat.chats);
    const notification = useSelector(state => state.user.notification);

    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const toast = useToast();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigator("/");
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter Something in Search Box.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top-left",
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get(`api/user?search=${search}`, config)
            setLoading(false);
            setSearchResult(data);
        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed to Load the Search Results",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.post("/api/chat", { userId }, config);
            if (!chats.find((c) => c._id === data._id)) dispatch(setChats(data));
            dispatch(setSelectedChat(data));
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: 'Error Fetching the Chat.',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            })
        }
    }
    return (
        <>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', backgroundColor: '#3B3E46' }}>
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" w="97%" p="10px 10px 10px 10px" backgroundColor={'#282B34'} borderRadius={'8px'} borderColor={'#23262F'} >

                    <Tooltip  _hover={{b: "#2F80ED"}}  label="Search Users To Chat" hasArrow placement='bottom-end'>
                        <Button backgroundColor={'£599AF1'} _hover={{backgroundColor : "#2F80ED"}} variant="ghost" onClick={onOpen}>
                            <Search2Icon color={'white'}/>
                            <Text color={'white'} display={{ base: "none", md: "flex" }} px="4" fontWeight={500}>
                                Search User
                            </Text>
                        </Button>
                    </Tooltip>


                    <Text color={'white'} fontSize="2xl" fontWeight={'thin'}>Chattable</Text>

                    <div>
                        <Menu>
                            <MenuButton p={1}>
                                
                                <BellIcon color={'white'} fontSize={'2xl'} m={1} />
                            </MenuButton>
                            <MenuList pl={2}>
                                {!notification.length && 'No New Messages'}
                                {notification.map((noti) => {
                                    <MenuItem key={noti._id} onClick={()=>{
                                        setSelectedChat(noti.chat);
                                        dispatch(filterNofitification(noti));
                                    }}>
                                        {noti.chat.isGroupChat?`New Message in ${noti.chat.chatName}`:`New Message From ${getSender(userInfo, noti.chat.users)}`}
                                    </MenuItem>
                                })}
                            </MenuList>
                        </Menu>
                        <Menu>
                            <MenuButton as={Button} _hover={{ backgroundColor: '#3B3E46' }} pt={1} pb={1} backgroundColor={'#3B3E46'} rightIcon={<ChevronDownIcon color={'white'} />}>
                                <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.picture} />
                            </MenuButton>
                            <MenuList>
                                <ProfileModel user={user}>
                                    <MenuItem>My Profile</MenuItem>
                                </ProfileModel>
                                <MenuDivider />
                                <MenuItem onClick={logoutHandler}>Log out</MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </Box>
            </div>

            <Slide in={isOpen} style={{ zIndex: 10 }}>
                <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
                        <DrawerBody>
                            <Box display={"flex"} pb={'2'}>
                                <Input placeholder='Search by Name or Email' mr={'2'} value={search} onChange={(e) => setSearch(e.target.value)} />
                                <Button
                                    onClick={handleSearch}
                                >Go</Button>
                            </Box>
                            {loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult?.map(user => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)} />
                                ))
                            )}
                            {loadingChat && <Spinner ml={'auto'} display={'flex'} />}
                        </DrawerBody>
                    </DrawerContent>

                </Drawer>
            </Slide>
        </>
    )
}
