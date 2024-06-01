import { ViewIcon } from '@chakra-ui/icons'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, IconButton, useDisclosure, Button, useStatStyles, useToast, Box, FormControl, Input, Spinner, } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedChat } from '../../Store/Slices/ChatSlice'
import { useState } from 'react'
import { UserBadgeItem } from '../User/UserBadgeItem'
import axios from 'axios'
import { fetchAgain } from '../../Store/Slices/ChatSlice';
import { UserListItem } from '../User/UserListItem'

export const UpdateGroupChatModel = (fetchMessages) => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const userInfo = useSelector(state => state.user.userInfo);

    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const handleAddUser = async(user1) => {
        if(selectedChat.user.find((u) => u._id === user1._id)){
            toast({
                title: 'User Already is in Group1',
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
            return ;
        }
        if(selectedChat.groupAdmin._id === userInfo._id){
            toast({
                title: "Only Admin can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }
        try{
            setLoading(true);
                const config = {
                  headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                  }
                }
                const { data } = await axios.put("/api/chat/addtogroup",{
                    chatId :selectedChat._id,
                    userId: user1._id,
                }, config)
                
                setSelectedChat(data);
                dispatch(fetchAgain(userInfo));
                setLoading(false);
        }catch(error){
            toast({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }
    }
    const handleRemove = async(user1) => {
        console.log("removing");
        if(selectedChat.groupAdmin._id !== userInfo._id && user1._id === userInfo._id){
            toast({
                title: "Only Admin can Remove Someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })

        }
        try{
            setLoading(true);
                const config = {
                  headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                  }
                }
                const { data } = await axios.put("/api/chat/removeFromGroup",{
                    chatId :selectedChat._id,
                    userId: user1._id,
                }, config)
                
                dispatch(fetchAgain(userInfo));
                dispatch(setSelectedChat());
                onClose();
                fetchMessages();
                setLoading(false);
        }catch(error){
            console.log(error.message);
            toast({
                title: "Error Occured!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }
    }    
    const handleRename = async() => {
        if(!groupChatName) return;
        try{    
            
            setRenameLoading(true);
            const config = {
                headers : {
                    Authorization : `Bearer ${userInfo.token}`
                }
            }

            const {data} = await axios.put('/api/chat/renameGroup', {
                chatId : selectedChat._id,
                chatName : groupChatName,
            }, config);

            setSelectedChat(data);
            onClose();
            dispatch(fetchAgain(userInfo));
            setRenameLoading(false);

        }catch(error){
            toast({
                title: 'Error Occured.',
                description: "Error Occured While Updating the Group Name",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            })
        }
    }
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


    const toast = useToast();
    return (
        <>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'2xl'}
                        display={'flex'}
                        justifyContent={'center'}>
                        {selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={'flex'} width={'100%'} flexWrap={'wrap'} pb={3}>
                            {selectedChat.users.map((user) => {
                                return <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                            })}
                        </Box>
                        <FormControl display={'flex'}>
                            <Input 
                            placeholder='Chat Name'
                            mb={3}
                            value={groupChatName}
                            onChange={(e)=>setGroupChatName(e.target.value)}/>
                            <Button
                            varient='solid'
                            colorScheme='teal'
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users e.g John, Mark' mb={3} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading ? <Spinner size={'md'}></Spinner> : (
                            searchResult?.slice(0.4).map(user =>
                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />)
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={()=>handleRemove(userInfo)}>
                            Leave Group
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
