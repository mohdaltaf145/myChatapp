import React from 'react'
import {Channel, useChatContext, MessageTeam} from 'stream-chat-react';

import {ChannelInner, CreateChannel, EditChannel} from './';


const ChannelContainer = ({isCreating, setIsCreating, isEditing, setIsEditing, createType}) => {

    //get information about a specific channel
    const { channel } = useChatContext(); //will give information about current specific channel

    //to check user creating that new channel then we have to show a message or dashboard for creating that channel
    if(isCreating) {
        return(
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating} />
            </div>
        )
    }
    //another state 
    if(isEditing) {
        return(
            <div className="channel__container">
                <EditChannel setIsEditing={setIsEditing}/>
            </div>
        )
    }

    //this happens when we just created a chat and we have no messages yet so we want to display something there
    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history.</p>
            <p className="channel-empty__second">Send messages, attachements, links, emojis, and more!</p>
        </div>
    )
    
    return (
        <div className="channel__container">
            <Channel
                EmptyStateIndicator={EmptyState}

                //will display all the messages that user had send
                Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />} 
            >
                <ChannelInner setIsEditing={setIsEditing}/>
            </Channel>
        </div>
    )
}

export default ChannelContainer
