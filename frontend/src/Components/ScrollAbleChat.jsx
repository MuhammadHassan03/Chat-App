import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../Config/chatLogics';
import { useSelector } from 'react-redux';
import { Avatar, Tooltip } from '@chakra-ui/react';

export const ScrollAbleChat = ({messages}) => {
    const userInfo = useSelector(state => state.user.userInfo);

    return (
        <>
            <ScrollableFeed>
                {messages && messages.map((m, i) => {
                    return <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, userInfo._id)
                        || isLastMessage(messages, i , userInfo._id)) 
                        && (
                            <Tooltip label={m.sender.name} placement='bottom-start'hasArrow>
                                <Avatar 
                                mt={"7px"}
                                mr={1}
                                size={"sm"}
                                cursor={'pointer'}
                                name={m.sender.name}
                                src={m.sender.picture}/ >
                            </Tooltip>
                        )}
                        <span style={{
                            backgroundColor : `${
                                m.sender._id === userInfo._id ? "#AAFFFF" : "#FFFFFF"
                            }`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, userInfo._id),
                            marginTop: isSameUser(messages, m, i ,userInfo._id) ? 3: 10,
                            }}>
                            {m.content}
                        </span>
                    </div>
                })}
            </ScrollableFeed>
        </>
    )
}
