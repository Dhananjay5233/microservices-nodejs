const Counter = require('../models/Counter');

const getNextUserId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'userId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `SP${counter.seq}`;
};

module.exports = getNextUserId;