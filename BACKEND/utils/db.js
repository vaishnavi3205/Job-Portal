import mongoose from "mongoose";
import dns from "dns";

try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
    // ignore if not permitted
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully");
    } catch (error) {
        console.log("mongodb connection error:", error?.message || error);
    }
};
export default connectDB;