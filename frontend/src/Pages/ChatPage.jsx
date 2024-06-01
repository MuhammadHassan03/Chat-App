import { useSelector, useDispatch } from "react-redux"
import { SideDrawer } from "../Components/Miscellaneous/SideDrawer";
import { MyChats } from "../Components/MyChats";
import { ChatBox } from "../Components/ChatBox";
import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
import { checkUserInfo } from "../Store/Slices/userSlice";


export const ChatPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(checkUserInfo());
    }, [])
    const user = useSelector(state => state.user.userInfo);
    return (
        <div 
        style={{ width: "100%" }}
        >
            {user && <SideDrawer />}
            <Box
                d="flex"
                justifyContent={"space-between"}
                w={"100%"}
                height={"88vh"}
                padding={"10px"}
            >
                <Box  display="flex" justifyContent="space-between" width="100%" 
                height="88vh" 
                p="10px">
                    {user && <MyChats />}
                    {user && <ChatBox />}
                </Box>
            </Box>
        </div>
    )
}
