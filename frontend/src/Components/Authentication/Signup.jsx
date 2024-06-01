
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [picture, setPicture] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const history = useNavigate();


    const handleClick = () => {
        setShow(!show)
    };

    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "chattable_app");
            data.append("cloud_name", "dki7jcbnk");
            fetch("https://api.cloudinary.com/v1_1/dki7jcbnk/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    setPicture(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    console.log("Picture", picture);
                    setLoading(false)
                })
        }
        else {
            toast({
                title: 'Please Select an Image.',
                status: 'warning',
                duration: 9000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please Fill All Fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: 'Passwords Do Not Match!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const { data } = await axios.post("/api/user/", { name, email, password, picture }, config);
            console.log(data);
            toast({
                title: 'Registeration Successfull.',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: "bottom",
            })
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history("/chats");
        } catch (error) {
            toast({
                title: 'Error Occurred',
                description: error.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false);
        }
    }

    return (
        <VStack spacing={"5px"} color={"black"}>
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name' value={name} onChange={(e) => { setName(e.target.value) }} />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} value={password} placeholder='Enter Your password' onChange={(e) => { setPassword(e.target.value) }} />
                    <InputRightElement width={"4.5rem"}>
                        <Button onClick={handleClick} h={"1.75rem"} size={"sm"} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel> 
                <InputGroup>
                    <Input type={show ? "text" : "password"} value={confirmPassword} placeholder='Enter Your Confirm password' onChange={(e) => { setConfirmPassword(e.target.value) }} />
                    <InputRightElement width={"4.5rem"}>
                        <Button onClick={handleClick} h={"1.75rem"} size={"sm"} >{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' isRequired>
                <FormLabel>Upload Your Picture</FormLabel>
                <InputGroup>
                    <Input type='file' p={1.5} accept='image/*' onChange={(e) => { postDetails(e.target.files[0]) }} />
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                width={"100%"}
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}
