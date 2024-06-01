import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, useToast, FormControl, Input, Spinner, Box, } from '@chakra-ui/react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChats } from '../../Store/Slices/ChatSlice';
import axios from 'axios';
import { UserListItem } from '../User/UserListItem';
import { UserBadgeItem } from '../User/UserBadgeItem';

export const GroupChatModel = ({ children }) => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const userInfo = useSelector(state => state.user.userInfo);
    const chats = useSelector(state => state.chat.chats);

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                }
            }
            const { data } = await axios.get(`/api/user/?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);

        }
        catch (error) {
            toast({
                title: 'Error Occured!',
                description: "Failed To Load the Search Results.",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }
    const handleSubmit = async() => {
        if(!groupChatName || !selectedUsers){
            toast({
                title: 'Please Fill All The fields.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "top",
              })
              return;
        }
        try{
            const config = {
                headers: {
                    Authorization : `Bearer ${userInfo.token}`,
                }
            }
            const {data} = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config);
            dispatch(setChats(data));
            onClose();
            toast({
                title: 'New Group Chat Created Sucessfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              })
        }
        catch(error){
            toast({
                title: 'Failed To Create a Group Chat',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
              })
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User Already Added.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
    }


    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"30px"}
                        fontWeight={500}
                        display={'flex'}
                        justifyContent={'center'}>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
                        <FormControl>
                            <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users e.g John, Mark' mb={3} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box display={'flex'} flexWrap={'wrap'} width={"100%"} >
                            {selectedUsers.map((user) => (
                                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                            ))}
                        </Box>
                        {loading ? <Spinner ></Spinner> : (
                            searchResult?.slice(0.4).map(user =>
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />)
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
