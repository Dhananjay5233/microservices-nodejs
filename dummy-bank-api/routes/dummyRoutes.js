const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { txnId, amount, userId } = req.body;
  console.log(`Received transaction for ${userId}, txnId: ${txnId}, amount: ${amount}`);
  
  // Simulate delay or logging if needed
  return res.status(200).json({ status: 'acknowledged' });
});

module.exports = router;