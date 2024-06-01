import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAgain, setSelectedChat } from '../Store/Slices/ChatSlice';
import { Box, Flex, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../Config/chatLogics';
import { ProfileModel } from './Miscellaneous/ProfileModel';
import { UpdateGroupChatModel } from './Miscellaneous/UpdateGroupChatModel';
import axios from 'axios';
import '../style.css';
import { ScrollAbleChat } from './ScrollAbleChat';
import io from 'socket.io-client';
import { setNotifications } from '../Store/Slices/userSlice';

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

export const SingleChat = () => {
    const dispatch = useDispatch();
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const userInfo = useSelector(state => state.user.userInfo);
    const notification = useSelector(state => state.user.notification);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessages, setNewMessages] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const toast = useToast();

    useEffect(()=>{
        socket = io(ENDPOINT);
        socket.emit("setup", userInfo);
        socket.on("connected", ()=>setSocketConnected(true));
        socket.on('typing', ()=>setIsTyping(true));
        socket.on('stop typing', ()=>setIsTyping(false));

    }, [])

    const fetchMessages = async()=>{
        if(!selectedChat){
            return;
        }
        try{
            setLoading(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                }
              }
              const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

              setMessages(data);
              setLoading(false);
              socket.emit('join chat', selectedChat._id);
              console.log(messages);
        }
        catch(error){
            toast({
                title: "Error Occured!",
                description : "Error Fetching Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }
    };

    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(()=>{
        socket.on('Message Recieved', (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notification.inclludes(newMessageRecieved)){
                    dispatch(setNotifications(newMessageRecieved));
                    dispatch(fetchAgain(!fetchAgain));
                }

            } 
            else{
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })
    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessages) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    }
                }
                
                setNewMessages("");
                const { data } = await axios.post("/api/message/",{
                    content : newMessages,
                    chatId : selectedChat._id,
                }, config);
                console.log(data);
                socket.emit('New Message', data);   
                setMessages([...messages, data]); 
                
            }
            catch(error){
                toast({
                    title: "Error Occured!",
                    description : "Failed to Send The Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
        }
    }
    const typingHandler = (e) => {
        setNewMessages(e.target.value);
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timeLength = 2000;

        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timeLength && typing){
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timeLength)

    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: '23px', md: '20px' }}
                        pb={3}
                        px={2}
                        width={'100%'}
                        display={'flex'}
                        justifyContent={{ base: 'space-between' }}
                        alignItems={'center'}
                        color={'white'}
                    >
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            icon={<ArrowBackIcon />}
                            onClick={() => dispatch(setSelectedChat(''))}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(userInfo, selectedChat.users)}
                                <ProfileModel user={getSenderFull(userInfo, selectedChat.users)}></ProfileModel>
                            </>
                        )
                            :
                            (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModel fetchMessages={fetchMessages} />
                                </>
                            )}

                    </Text>
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'flex-end'}
                        p={3}
                        backgroundColor={"#3B3E46"}
                        backgroundPosition={'center'}
                        backgroundRepeat={'no-repeat'}
                        backgroundSize={'cover'}
                        width={"100%"}
                        height={"100%"}
                        borderRadius={"8px"}
                        overflowY={'hidden'}
                    >
                        {loading ? (<Spinner size={'xl'} width={20} height={20} alignSelf={'center'} margin={'auto'} color='white' />) : (
                            
                            <>
                                <div className='messages'>
                                    <ScrollAbleChat messages={messages}/>
                                </div>
                            </>
                        )}
                        <FormControl isRequired mt={3} onKeyDown={sendMessage}>
                            {isTyping ? <div style={{color: "white"}}>Typing...</div> : (null)}
                            <Input varient="filled" bg={"#282B34"} color={'white'} placeholder='Enter a Message' onChange={typingHandler} value={newMessages} />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
                    <Text fontSize={'3xl'} pb={3} color={'white'}>
                        Click on The User To Start Chatting
                    </Text>
                </Box>
            )}
        </>
    )
}
