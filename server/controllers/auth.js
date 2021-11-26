const { connect } = require('getstream')
const bcrypt = require('bcrypt')
const StreamChat = require('stream-chat').StreamChat
const crypto = require('crypto')

require('dotenv').config()

//can find all this values in stream dashboard and .env file
const api_key = process.env.STREAM_API_KEY
const api_secret = process.env.STREAM_API_SECRET
const app_id = process.env.STREAM_APP_ID

console.log("altaf 3")
//req means get data from the frontend and res means send data to the frontend
const signup = async (req, res) => {
    try{
        // console.log(req)
        console.log("Altaf 4")
        const { fullName, username, password, phoneNumber } = req.body //get/request all this data from the frontend

        const userId = crypto.randomBytes(16).toString('hex') //to make a random unique userId for each new user of 16 digit hexadecimal number 

        //connection to stream
        const serverClient = connect(api_key, api_secret, app_id) //we need all this values such as api_key and all to connect to our stream api

        const hashedPassword = await bcrypt.hash(password, 10) //turn plain password(that we get from the frontend through req.body) to hashed password 10 represent level of encryption

        //create token for user
        const token = serverClient.createUserToken(userId)

        //return all data to the frontend
        res.status(200).json({token, fullName, username, userId, hashedPassword, phoneNumber})

    }catch(error){
        console.log(error)
        res.status(500).json({message: error})
    }
};

const login = async (req, res) => {
    try{
        //getting data from the frontend using req.body
        const {username, password} = req.body

        //connectieng to the stream
        const serverClient = connect(api_key, api_secret, app_id)

        //creating new instance of a stram chat
        const client = StreamChat.getInstance(api_key, api_secret)

        //here we are not creating the username we are taking the username and quering/searching through the database to see if it matches
        //and the storing the data of that user in const {users}
        const {users} = await client.queryUsers({name: username})

        //if there are no users return user not found to the frontend
        if(!users.length){
            console.log('altaf pass')
            return res.status(400).json({message: 'User not found'})
        } 

        //else if the above if statement doesnot execute that means the user it there in the database
        //so after that we have to decrypt the encrypted password(when sign up the user) and see if it matches the
        //one with the user created the account with using bycrypt.compare
        const success = await bcrypt.compare(password, users[0].hashedPassword)
        console.log('altaf success')
        //create a new user token using same existing id
        const token = serverClient.createUserToken(users[0].id)

        //if the action is successful send data back to the frontend in json format
        if(success) {
            res.status(200).json({token, fullName: users[0].fullName, username, userId: users[0].id})
        } else { //else if the action is not successful that means password user entered doesnot matches with the password user created account with
            console.log("altaf incorrect password")
            res.status(500).json({message: 'Incorrect password'})
        }

    }catch(error){
        console.log("altaf error")
        console.log(error)
        res.status(500).json({message: error})
    }
};

module.exports = { signup, login }