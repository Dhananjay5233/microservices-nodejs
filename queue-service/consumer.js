const amqp = require('amqplib');
const axios = require('axios');
const mongoose = require('mongoose');
const walletSchema = require('./models/Wallet');
const Transaction = require('./models/Transaction');
const connectUserDB = require('./utils/connectUserDB');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to Transaction DB');
});

const consume = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertQueue('transaction_queue');

    console.log("Listening to RabbitMQ queue 'transaction_queue'...");

    channel.consume('transaction_queue', async (msg) => {
      const txn = JSON.parse(msg.content.toString());
      console.log('Consuming transaction:', txn._id);

      const { userId, updatedBalance, amount, serviceCharge, gst, _id } = txn;
      const total = amount + serviceCharge + gst;

      try {
        const userDB = await connectUserDB(userId);
        const Wallet = userDB.model('Wallet', walletSchema);
        const wallet = await Wallet.findOne({ userId });

        wallet.balance = +(wallet.balance - total).toFixed(2);
        await wallet.save();

        await axios.post(process.env.DUMMY_BANK_API, {
          txnId: _id,
          amount,
          userId
        });

        await Transaction.findByIdAndUpdate(_id, { status: 'awaited' });

        channel.ack(msg);
      } catch (err) {
        console.error('Processing error:', err.message);
      }
    });
  } catch (err) {
    console.error("RabbitMQ connection failed:", err.message);
  }
};

(async () => {
  await consume();
})();
