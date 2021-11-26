import React,{ useEffect, useState } from 'react'
import {Avatar, useChatContext} from 'stream-chat-react'

import { InviteIcon } from '../assets'

const ListContainer = ({children}) => {
    return(
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}


const UserItem = ({user, setSelectedUsers}) => {

    const [selected, setSelected] = useState(false)

    const handleSelect = () => {
        if(selected) {
            //basically here we are keeping all of the selected user so far but removing the one that we have clicked right now
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        }else {
            //else add one more selected user
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])    
        }

        setSelected((prevSelected) => !prevSelected)
    }

    return(
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
            {selected ? <InviteIcon/> : <div className="user-item__invite-empty"/>}
            
        </div>
    )
}



const UserList = ({setSelectedUsers}) => {

    //get client or user
    const {client} = useChatContext()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [listEmpty, setListEmpty] = useState(false)

    const [error, setError] = useState(false)

    //useEffect calls when something changes or this page reloads
    useEffect(() => {
        //function to get the users 
        const getUsers = async () => {
            if(loading) return;
            setLoading(true)

            //for querying users from useChatChannel Context
            try {
                //will allows us to query all users based on specific parameter
                const response = await client.queryUsers(
                    {id: {$ne: client.userID}}, //basically we are excluding the querying of users foe the user with the current id(we dont want to find ourselves their because we are thr one adding the other users)
                    {id: 1}, //just the way to sort specific things
                    {limit: 8} //to limit user to 8 only
                );
                
                //to check if we have anything in the response
                if(response.users.length) {
                    setUsers(response.users)
                }else {
                    setListEmpty(true)
                }
                
            } catch (error) {
                setError(true)
            }
            setLoading(false)
        }
        //if we are connected call getUsers function to get the users
        if(client) getUsers()
    }, [])


    if(error) {
        return(
            <ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return(
            <ListContainer>
                <div className="user-list__message">
                    No users found.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading users...
            </div> : (
                // map over the users
                users?.map((user, i) => (
                    <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers}/>
                ))
            )}
        </ListContainer>
    )

}


export default UserList