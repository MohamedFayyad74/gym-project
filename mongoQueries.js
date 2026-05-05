import mongoose from "mongoose";
import Member from "./models/Member.js";
import Membership from "./models/Membership.js";

const MONGO_URI =
  "mongodb+srv://fyadmhmd403_db_user:142536@gym.t43tevf.mongodb.net/?appName=GYM";

const printSection = (title) => {
  console.log(`\n${"=".repeat(20)} ${title} ${"=".repeat(20)}`);
};

const getNextMemberId = async () => {
  const lastMember = await Member.findOne({ id: { $type: "number" } })
    .sort({ id: -1 })
    .lean();

  return lastMember && typeof lastMember.id === "number"
    ? lastMember.id + 1
    : 1;
};

export const runMongoQueries = async () => {
  let createdMemberId = null;

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    // CRUD Operations: Create a new member document in the Members collection.
    printSection("CRUD - CREATE");
    const nextMemberId = await getNextMemberId();
    const demoMemberData = {
      id: nextMemberId,
      full_name: "Demo Member",
      phone_number: `0100${String(nextMemberId).padStart(6, "0")}`,
      age: 28,
      gender: "Male",
      status: "Active",
      joined_at: new Date(),
      qr_code_id: `QR_DEMO_${nextMemberId}`
    };

    const createdMember = await Member.create(demoMemberData);
    createdMemberId = createdMember.id;
    console.log("Created member:", createdMember.toObject());

    // CRUD Operations: Read member documents from the Members collection.
    printSection("CRUD - READ");
    const allMembers = await Member.find().lean();
    console.log("All members:", allMembers);

    // CRUD Operations: Update an existing member document.
    printSection("CRUD - UPDATE");
    const updatedMember = await Member.findOneAndUpdate(
      { id: createdMemberId },
      {
        $set: {
          full_name: "Updated Demo Member",
          status: "Expired"
        }
      },
      { new: true }
    ).lean();
    console.log("Updated member:", updatedMember);

    // Projection: Fetch only selected fields instead of full documents.
    printSection("PROJECTION");
    const projectedMembers = await Member.find(
      {},
      { _id: 0, full_name: 1, phone_number: 1 }
    ).lean();
    console.log("Projected members:", projectedMembers);

    // Sorting: Order members by joined_at in descending order.
    printSection("SORTING");
    const sortedMembers = await Member.find().sort({ joined_at: -1 }).lean();
    console.log("Members sorted by joined_at descending:", sortedMembers);

    // Pagination: Use skip and limit to fetch a specific page of results.
    printSection("PAGINATION");
    const page = 1;
    const limit = 5;
    const paginatedMembers = await Member.find()
      .sort({ joined_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    console.log(`Members page ${page} with limit ${limit}:`, paginatedMembers);

    // Aggregation Pipeline: Group memberships by plan_id and count how many records belong to each plan.
    printSection("AGGREGATION PIPELINE");
    const membershipsPerPlan = await Membership.aggregate([
      {
        $group: {
          _id: "$plan_id",
          total_memberships: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          plan_id: "$_id",
          total_memberships: 1
        }
      },
      { $sort: { plan_id: 1 } }
    ]);
    console.log("Membership count per plan:", membershipsPerPlan);

    // Lookup: Join memberships with members using membership.member_id -> member._id.
    printSection("LOOKUP");
    const membershipsWithMembers = await Membership.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "member_id",
          foreignField: "_id",
          as: "member_details"
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          member_id: 1,
          plan_id: 1,
          payment_status: 1,
          member_details: {
            $map: {
              input: "$member_details",
              as: "member",
              in: {
                id: "$$member.id",
                full_name: "$$member.full_name",
                phone_number: "$$member.phone_number",
                status: "$$member.status"
              }
            }
          }
        }
      }
    ]);
    console.log("Memberships joined with members:", membershipsWithMembers);

    // Count: Count the total number of member documents.
    printSection("COUNT");
    const totalMembers = await Member.countDocuments();
    console.log("Total members:", totalMembers);

    // CRUD Operations: Delete the demo member created earlier.
    printSection("CRUD - DELETE");
    const deletedMember = await Member.findOneAndDelete({ id: createdMemberId }).lean();
    console.log("Deleted member:", deletedMember);

    await mongoose.connection.close();
    console.log("\nMongoDB connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error while running MongoDB queries:", error.message);

    if (createdMemberId !== null) {
      try {
        await Member.findOneAndDelete({ id: createdMemberId });
      } catch (cleanupError) {
        console.error("Cleanup error after failure:", cleanupError.message);
      }
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed after error.");
    }

    process.exit(1);
  }
};

runMongoQueries();
