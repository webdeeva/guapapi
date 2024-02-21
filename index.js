const express = require('express');
const { Web3 } = require('web3');
const app = express();
const PORT = 3000;

// Initialize Web3 with your GuapcoinX node URL
const web3 = new Web3('https://rpc-mainnet.guapcoinx.com');

// Endpoint to fetch transactions for a specified address
app.get('/transactions/:address', async (req, res) => {
    const { address } = req.params;
    const latest = await web3.eth.getBlockNumber();
    const transactions = [];

    // Scan the latest 100 blocks (adjust as needed)
    for (let i = 0; i < 100; i++) {
        const block = await web3.eth.getBlock(latest - i, true);
        block.transactions.forEach(tx => {
            if (tx.from === address || tx.to === address) {
                transactions.push(tx);
            }
        });
    }

    res.json(transactions);
});

// Endpoint to fetch the balance of an address
app.get('/balance/:address', async (req, res) => {
    const { address } = req.params;
    
    try {
        const balanceWei = await web3.eth.getBalance(address);
        const balance = web3.utils.fromWei(balanceWei, 'ether'); // Convert balance to GuapcoinX units
        res.json({
            address: address,
            balance: balance
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching balance');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
