import React, { useState } from 'react';
import { getMessageDateOrTime } from '../../../utils/helper';
// Import Styles
//import '../../../assets/style/chatDrawer.scss';
// Import Icons
import { Send } from '@material-ui/icons';

function ChatBox(props: any) {
    const [chatText, setChatText] = useState('');

    const handleChatText = (event: any) => {
        const { value } = event.target;
        setChatText(value);
    }

    const handleSendText = (event: any) => {
        if (!(chatText.length > 0)) return;
        if (event.type === 'keyup' && (event as React.KeyboardEvent).key !== 'Enter') {
            return;
        }
        const messageDetails = {
            message: {
                message: chatText,
                timestamp: new Date()
            },
            userData: { ...props.myDetails }
        }
        props.socketInstance.boradcastMessage(messageDetails);
        setChatText('');
    }

    return (
        <React.Fragment>
            {/* <Drawer className="chat-drawer" anchor={'right'} open={props.chatToggle} onClose={props.closeDrawer}> */}
            <div className='chat-div'>
                <div className="chat-head-wrapper pd_10">
                    <div className="chat-header">
                        <h3 className="char-header-text">Live Chat</h3>
                    </div>
                </div>
                <div className="chat-drawer-list pd_10">
                    {
                        props.messages?.map((chatDetails: any) => {
                            const { userData, message } = chatDetails;
                            return (
                                <div className="message-container">
                                    <div className={`message-wrapper ${!userData.userID ? 'message-wrapper-right' : ''}`}>
                                        <div className="message-title-wrapper">
                                            <h5 className="message-name">{userData?.name}</h5>
                                            <span className="message-timestamp">{getMessageDateOrTime(message.timestamp)}</span>
                                        </div>
                                        <p className="actual-message">{message.message}</p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {/* <List className="chat-drawer-list">
                    
                </List> */}
                <div className="chat-drawer-input-wrapper pd_10" onKeyUp={handleSendText}>
                    <input
                        className="chat-drawer-input"
                        onChange={handleChatText}
                        value={chatText}
                        placeholder="Type Here"
                    />
                    <Send onClick={handleSendText} />
                </div>
            </div>
            {/* </Drawer> */}
        </React.Fragment>
    )
}

export default ChatBox;