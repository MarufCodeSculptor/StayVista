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
  console.log("come to verify token");
  const token = req.cookies?.token;
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

const logger = (req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toLocaleString("en-GB", { hour12: false });
  const reset = "\x1b[0m";
  const yellow = "\x1b[33m";
  const cyan = "\x1b[36m";
  const magenta = "\x1b[35m";
  console.log(
    `${yellow}[${timestamp}]${reset} ${cyan}${method}${reset} ${magenta}${url}${reset}`
  );
  next();
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

    const verifyAdmin = async (req, res, next) => {
      const user = req.user;
      console.log("come to verifyAdmin", user);
      const userExist = await usersCollections.findOne({ email: user.email });

      if (!userExist || userExist.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }

      console.log("going to next");
      next();
    };

    const verifyHost = async (req, res, next) => {
      const user = req.user;
      console.log("come to verifyHost", user);
      const userExist = await usersCollections.findOne({ email: user.email });

      if (!userExist || userExist.role !== "host") {
        return res.status(403).send({ message: "forbidden access" });
      }
      console.log("going to next");
      next();
    };

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
    app.put("/user", logger, async (req, res) => {
      const user = req.body;
      const query = {
        email: user?.email,
      };
      // check the user is exist or not
      const userExist = await usersCollections.findOne(query);

      if (userExist) {
        if (user.status === userExist.status) {
          console.log("caught as duplicate");
          return res.send(userExist);
        } else {
          console.log("cought as without requested");

          if (
            user.status === "requested" &&
            userExist.status === "Verified" &&
            userExist.role === "host"
          ) {
            return res.send(userExist);
          } else {
            if (user.status !== "requested") return res.send(userExist);
          }
        }
      }

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

    app.put("/user-role/:email", logger, async (req, res) => {
      console.log(req.params.email, "the user posting");
      const email = req.body.email;
      const data = req.body;

      console.log(data);
      const query = { email };
      const options = { upsert: true };
      const result = await usersCollections.updateOne(
        query,
        { $set: { ...data, timestamp: Date.now() } },
        options
      );
      res.send(result);
    });

    // getting all users data: Admin routes
    app.get("/users", logger, verifyToken, verifyAdmin, async (req, res) => {
      const result = await usersCollections.find({}).toArray();
      res.send(result);
    });

    // getting user's personal role data:
    app.get("/user-role/:email", logger, verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await usersCollections.findOne(query);
      res.send(result);
    });
    // rooom create
    app.post("/room", logger, verifyToken, verifyHost, async (req, res) => {
      const roomData = req.body;
      const result = await roomsCollections.insertOne(roomData);
      res.send(result);
    });
    //  room read
    app.get("/rooms", logger, async (req, res) => {
      const category = req.query.category;
      let query = {};

      if (category && category !== "null") query = { category };

      const result = await roomsCollections.find(query).toArray();

      res.send(result);
    });
    //room read for host 
    app.get(
      "/my-listings/:email",
      logger,
      verifyToken,
      verifyHost,
      async (req, res) => {
        // email from params.email
        const email = req.params.email;
        const query = { "host.email": email };
        const result = await roomsCollections.find(query).toArray();
        res.send(result);
      }
    );

    // room read single
    app.get("/room/:id", logger, async (req, res) => {
      console.log("backend hitted");
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roomsCollections.findOne(query);
      res.send(result);
    });
// room updates:



app.put('/room/:id',logger,verifyToken,verifyHost,async(req,res)=>{
  const id = req.params.id;
  const roomData = req.body;
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const result = await roomsCollections.updateOne(query, { $set: roomData }, options);
  res.send(result);
})
    // removing rooms by user
    app.delete("/room/:id", logger, verifyToken, async (req, res) => {
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
  console.log(`StayVista Server is running on port ${port}`);
});
