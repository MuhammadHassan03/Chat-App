import { Box, Container, Tabs, Text, TabList, Tab, TabPanels, TabPanel} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Login } from '../Components/Authentication/Login'
import { Signup } from '../Components/Authentication/Signup'
import {useDispatch, useSelector} from 'react-redux'
import { checkUserInfo } from '../Store/Slices/userSlice'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user.userInfo);
  console.log(userInfo);
  useEffect(()=>{
    dispatch(checkUserInfo());
    if(!userInfo){
      navigate("/");
    }
    else{
      navigate("/chats");
    }
  },[dispatch, userInfo, navigate]);
  

  return (
    <div>
      <Container minW={"xl"} centerContent>
        <Box
          display={"flex"}
          justifyContent="center"
          p={3}
          bg={"white"}
          w={"100%"}
          m={"40px 0 15px 0"}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Text fontFamily={"Roboto"} fontSize={"4xl"} color={"black"} >Chattable</Text>
        </Box>
        <Box
          display={"flex"}
          justifyContent="center"
          p={3}
          bg={"white"}
          minW={"100%"}
          m={"40px 0 15px 0"}
          borderRadius={"lg"}
          borderWidth={"1px"}>

          <Tabs minW={"100%"} variant='soft-rounded' color={"black"}>
            <TabList mb={"1em"}>
              <Tab width={"50%"}>Login</Tab>
              <Tab width={"50%"}>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login></Login>
              </TabPanel>
              <TabPanel>
                <Signup></Signup>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </Box>
      </Container>

    </div>
  )
}
