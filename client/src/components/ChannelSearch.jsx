import React, {useState, useEffect} from 'react';
import { useChatContext } from 'stream-chat-react';

import {SearchIcon} from "../assets/SearchIcon";
import { ResultsDropdown } from './';

const ChannelSearch = ({setToggleContainer}) => {

    //we have to use chatContext to get the info of active channels
    const {client, setActiveChannel} = useChatContext()
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)

    //we need to know which are the currently active team channels
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    useEffect(() => {
        if(!query) {
            //clearing teamChannels and directChannels
            setTeamChannels([])
            setDirectChannels([])
        }
    }, [query]) //call the function every time query changes 

    const getChannels = async(text) => {
        try{
            //TODO: fetch Channels

            //querying the channels
            const channelResponse = client.queryChannels({
                type: 'team',
                name: {$autocomplete: text}, //to autocomplete all the user names
                members: {$in: [client.userID]} //members includes out own user id
            });

            //queriyng the users 
            const userResponse = client.queryUsers({
                id: {$ne: client.userID}, //will exclude our current user id(coz we dont want to find ourselves on the search)
                name: {$autocomplete: text} //to get all the other names
            })

            //we have to put channelReposne and userResponse into a promise at all 
            //because we want to start fetching them at the same time

            //to get channels and the users at the same time and wont simultaneously
            const[channels, {users}] = await Promise.all([channelResponse, userResponse])

            //if the channels exits
            if(channels.length) {
                setTeamChannels(channels)
            }

            if(users.length) {
                setDirectChannels(users)
            }

        }catch(error) {
            setQuery('')
        }
    }

    const onSearch = (event) => {
        event.preventDefault();
        setLoading(true);
        setQuery(event.target.value)
        getChannels(event.target.value)
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel)
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon/>
                </div>
                <input 
                    type="text"
                    className="channel-search__input__text"
                    placeholder="Search"
                    value={query}
                    onChange={onSearch}        
                />
            </div>
            {query && (
                <ResultsDropdown //will contains info about all the channels and users
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    )
}

export default ChannelSearch
