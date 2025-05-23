const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const client = new MongoClient(uri);

const dbName = 'mern_app';
const collectionName = 'users';

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);
    const users = db.collection(collectionName);

   
    await users.insertMany([
      { name: "John Doe", email: "john@example.com", age: 30, role: "admin" },
      { name: "Jane Smith", email: "jane@example.com", age: 25, role: "user" },
      { name: "Bob Brown", email: "bob@example.com", age: 28, role: "moderator" }
    ]);
    console.log("📝 Sample users inserted");


    console.log("\n📋 All Users:");
    console.log(await users.find().toArray());

    console.log("\n🔍 Users with age > 25 or role = 'admin':");
    console.log(await users.find({
      $or: [{ age: { $gt: 25 } }, { role: "admin" }]
    }).toArray());

    console.log("\n🎯 Projecting name and email only:");
    console.log(await users.find({}, { projection: { name: 1, email: 1, _id: 0 } }).toArray());

    console.log("\n📊 Sorted by age descending:");
    console.log(await users.find().sort({ age: -1 }).toArray());

    console.log("\n📄 Paginated (limit 2, skip 1):");
    console.log(await users.find().skip(1).limit(2).toArray());

   
    console.log("\n✏️ Updating Jane's role to admin...");
    await users.updateOne({ name: "Jane Smith" }, { $set: { role: "admin" } });

    console.log("⏫ Increasing age of all users by 1...");
    await users.updateMany({}, { $inc: { age: 1 } });

    console.log("\n✅ Updated Users:");
    console.log(await users.find().toArray());

    // 4. DELETE:
    console.log("\n🗑 Deleting Bob Brown...");
    await users.deleteOne({ name: "Bob Brown" });

    console.log("🧹 Deleting users with age > 50 (if any)...");
    await users.deleteMany({ age: { $gt: 50 } });

    console.log("\n🧾 Remaining Users:");
    console.log(await users.find().toArray());

   

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
    console.log('🔚 Connection closed');
  }
}

run();
