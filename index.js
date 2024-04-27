const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://lbhav2:Avlhv%40977@cluster0.mmqjmac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const server = http.createServer(async (req, res) => {
    console.log(req.url);
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(content);
        });
    } else if (req.url === '/api') {
        try {
            await client.connect();
            const results = await findsomedata(client);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        } catch (err) {
            console.error("Failed to retrieve data from MongoDB", err);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end("Internal Server Error");
        } finally {
            await client.close();
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("Not Found");
    }
});

async function findsomedata(client) {
    const cursor = client.db("Mobiles").collection("Mobiles").find({});
    const results = await cursor.toArray();
    console.log(results); // Log data to console for verification
    return results;
}

server.listen(2912, () => console.log('Server running on port 2912'));
