const {MongoClient, ObjectId} = require('mongodb');

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Connect to MongoDB
client.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

module.exports.newChat = async () => {
    const db = client.db('data');
    const chats = db.collection('chats');

    const {insertedId} = await chats.insertOne({
        messages: [],
        createdAt: new Date()
    })

    return insertedId.toString();
}

module.exports.getChats = async (chatId) => {
    const db = client.db('data');
    const chats = db.collection('chats');

    const response = await chats.findOne({_id: new ObjectId(chatId)});
    console.log(response.messages);
    return response.messages;
}

module.exports.postChats = async (chatId, user, bot) => {
    const db = client.db('data');
    const chats = db.collection('chats');

    await chats.updateOne({_id: new ObjectId(chatId)}, {$push: {messages: {$each: [
        {role: 'user', content: user},
        {role: 'assistant', content: bot}
    ]}}});
}

module.exports.client = client;
module.exports.closeMongo = client.close;
