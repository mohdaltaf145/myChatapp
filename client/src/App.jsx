import React, {useState} from 'react';
import {StreamChat} from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies from 'universal-cookie';

import {ChannelContainer, ChannelListContainer, Auth} from './components';

import 'stream-chat-react/dist/css/index.css';
import './App.css';


//get values from cookies to use it in auth
const cookies = new Cookies() 
const apiKey = 'f49x2r6p4832';
const authToken = cookies.get("token")

const client = StreamChat.getInstance(apiKey);

console.log("altaf App")
if(authToken) {
    //create a user connect it and get all of his messages
    console.log("altaf app token")
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'), 
        phoneNumber: cookies.get('phoneNumber'),
    }, authToken)
}

const App = () => {
    //create a state field
    const [createType, setCreateType] = useState('')  
    //is user currently creating a new chat room
    const [isCreating, setIsCreating] = useState(false)  
    const [isEditing, setIsEditing] = useState(false)  

    if(!authToken) return <Auth/>

    return (
        <div className="app__wrapper">
            <Chat client={client} theme="team light">
                <ChannelListContainer
                    isCreating={isCreating}
                    setCreateType={setCreateType}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                />
                <ChannelContainer
                    isCreating={isCreating}
                    isEditing={isEditing}
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    createType={createType}
                />
            </Chat>
        </div>
    );
}

export default App;
