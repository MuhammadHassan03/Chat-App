import { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast()
    const history = useNavigate();

    const handleClick = ()=>{
        setShow(!show)
    };
    const loginHandler = async ()=>{
        setLoading(true);
        if (!email || !password) {
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
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const {data} = await axios.post("/api/user/login", {email, password}, config);
            toast({
                title: 'Login Successfull.',
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
        <div>
            <VStack display="flex" alignItems="center" justifyContent="center" spacing={"5px"} color={"black"}>
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
                <Button
                    colorScheme='blue'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={loginHandler}
                    isLoading={loading}
                >
                    Login
                </Button>
                <Button
                    variant={"solid"}
                    colorScheme='red'
                    width={"100%"}
                    style={{ marginTop: 15 }}
                    onClick={()=>{
                        setEmail("guest@example.com")
                        setPassword("123456")
                    }}
                    
                >
                    Get Guest User Credientals
                </Button>
            </VStack>
        </div>
    )
}
