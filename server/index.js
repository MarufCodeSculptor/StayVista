const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8000;

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  console.log(token);
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.6mzg5rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const roomsCollections = client.db("stayVista").collection("rooms");
    const usersCollections = client.db("stayVista").collection("users");

    // auth related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "365d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });
    // Logout
    app.get("/logout", async (req, res) => {
      try {
        res
          .clearCookie("token", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .send({ success: true });
        console.log("Logout successful");
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // save a user to datebase
    app.put("/user", async (req, res) => {
      const user = req.body;
      const query = {
        email: user?.email,
      };
      // check the user is exist or not
      const userExist = await usersCollections.findOne(query);
      if (userExist  && user.role !== 'requested' ) return;

     
      const options = {
        upsert: true,
      };

     

      const result = await usersCollections.updateOne(
        query,
        { $set: { ...user, timestamp: Date.now() } },
        options
      );

      console.log(result, "the user posting resuls ");
      res.send(result);
    });
    //  getting all rooms data:
    app.get("/rooms", async (req, res) => {
      const category = req.query.category;
      let query = {};

      if (category && category !== "null") query = { category };

      const result = await roomsCollections.find(query).toArray();

      res.send(result);
    });

    // getting single rooms data:

    app.get("/room/:id", async (req, res) => {
      console.log("backend hitted");
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollections.findOne(query);
      res.send(result);
    });

    // posting room data = >
    app.post("/room", async (req, res) => {
      const roomData = req.body;
      const result = await roomsCollections.insertOne(roomData);
      res.send(result);
    });
    // getting my-listing data
    app.get("/my-listings/:email", async (req, res) => {
      // email from params.email
      const email = req.params.email;
      const query = { "host.email": email };
      const result = await roomsCollections.find(query).toArray();
      res.send(result);
    });
    // removing rooms by user
    app.delete("/room/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from StayVista Server..");
});

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`);
});
