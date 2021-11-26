const express = require('express')
const cors = require('cors')

// I’ll try my best to explain this. Generally speaking:
// GET requests are for when just want to retrieve a page. (get the contents of a page)
// POST requests are for transferring data.
//When you submit your password to a website or upload an image to a website, you are using a POST request.
// When you set app.post for a route, you are telling the code that the route in question can only accept POST requests.

const authRoutes = require("./routes/auth.js")

const app = express();
const PORT = process.env.PORT || 5000

require('dotenv').config()

//we cannot paste all values here because we want to secure it
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID

//this is out twilio account which will allow us to make twilio request
const twilioClient = require('twilio')(accountSid, authToken)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

//here we are going to set up one more route using webhooks, stream is going to 
//trigger a specific end point on our server and then we're going to send the message
//end point is
app.post('/', (req, res) => {
    //receive data from stream
    const {message, user: sender, type, members} = req.body

    //if the event is the creation of a new message
    if(type === 'message.new') {
        //loop over all the menbers that belongs to chat the message was sent to
        members
            //we dont want to send message to ourselves
            .filter((member) => member.user_id !== sender.id) //will filter ourselve out from sending message to ourselves
            .forEach(({user}) => {
            //only send sms if the user is not online
            if(!user.online) {
                twilioClient.messages.create({
                    //this is going to give them the message to their sms
                    body: `You have a new message from ${message.user.fullName} - ${message.txt}`,
                    messagingServiceSid: messagingServiceSid,
                    //who do we want to sent our message to 
                    to: user.phoneNumber
                })
                    .then(() => console.log('Message sent!'))
                    .catch((err) => console.log(err))
            }
        })

        //if everything goes rights
        return res.status(200).send('Message sent!')

    }
    //if its not a new mwssage or another kind of event
    return res.status(200).send('Not a new message request')

})

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))