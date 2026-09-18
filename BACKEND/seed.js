import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import dns from "dns";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

dotenv.config();

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI is missing from .env");
            process.exit(1);
        }

        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        // Clear existing data
        console.log("Cleaning existing collections...");
        await Application.deleteMany({});
        await Job.deleteMany({});
        await Company.deleteMany({});
        await User.deleteMany({ email: { $in: ["recruiter@example.com", "student@example.com"] } });

        const hashedPassword = await bcrypt.hash("123456", 10);

        // 1. Create Recruiter
        console.log("Creating Recruiter user...");
        const recruiter = await User.create({
            fullname: "Priya Mehta",
            email: "recruiter@example.com",
            phoneNumber: 9811122334,
            password: hashedPassword,
            role: "recruiter",
            profile: {
                bio: "Senior Technical Talent Partner managing early-career software engineering recruitment.",
                headline: "Senior Talent Acquisition Partner | Technical Recruiter",
                location: "Bangalore, India",
                profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80"
            }
        });

        // 2. Create Candidate / Student
        console.log("Creating Student user...");
        const student = await User.create({
            fullname: "Vaishnavi Sharma",
            email: "student@example.com",
            phoneNumber: 9876543210,
            password: hashedPassword,
            role: "student",
            profile: {
                bio: "Pre-final year Computer Science student passionate about Frontend development, React, and building intuitive user experiences.",
                headline: "Computer Science Undergraduate | Aspiring Full Stack Developer",
                college: "Delhi Technological University (DTU)",
                degree: "B.Tech in Computer Science & Engineering",
                graduationYear: "2025",
                cgpa: "8.9 / 10",
                location: "New Delhi, India",
                skills: ["React.js", "JavaScript", "TypeScript", "Tailwind CSS", "Node.js", "Redux Toolkit", "Git", "REST APIs"],
                github: "https://github.com/vaishnavisharma",
                linkedin: "https://linkedin.com/in/vaishnavisharma",
                portfolio: "https://vaishnavi.dev",
                profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80",
                resume: "http://localhost:8000/uploads/resumes/sample_student_resume.pdf",
                resumeOriginalName: "Vaishnavi_Sharma_Resume.pdf",
                resumeUploadDate: "2026-09-18"
            }
        });

        // 3. Create Companies
        console.log("Creating Verified Companies...");
        const razorpay = await Company.create({
            name: "Razorpay",
            description: "Razorpay is India's leading fintech unicorn building payment infrastructure and banking solutions for online commerce.",
            website: "https://razorpay.com",
            location: "Bangalore, Karnataka",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-razorpay-logo-icon-download-in-svg-png-gif-file-formats--payment-gateway-brand-social-media-pack-logos-icons-4560373.png",
            userId: recruiter._id
        });

        const zomato = await Company.create({
            name: "Zomato",
            description: "Zomato is India's leading food delivery and restaurant discovery technology network.",
            website: "https://zomato.com",
            location: "Gurugram, Haryana",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-zomato-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560378.png",
            userId: recruiter._id
        });

        const swiggy = await Company.create({
            name: "Swiggy",
            description: "Swiggy powers on-demand food delivery, Instamart quick commerce, and dining solutions across 500+ Indian cities.",
            website: "https://swiggy.com",
            location: "Bangalore, Karnataka",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-swiggy-logo-icon-download-in-svg-png-gif-file-formats--food-brand-social-media-pack-logos-icons-4560376.png",
            userId: recruiter._id
        });

        // 4. Create Jobs
        console.log("Creating Job Postings...");
        const job1 = await Job.create({
            title: "Frontend Engineering Intern (React & Next.js)",
            description: "Build delightful merchant checkouts, payment UI widgets, and dashboard micro-frontends with high performance and accessibility.",
            requirements: ["React.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Web Performance"],
            salary: 6,
            location: "Bangalore",
            jobType: "Internship",
            experience: 0,
            position: 3,
            company: razorpay._id,
            created_by: recruiter._id,
            eligibility: "Open to 2025/2026 CS/IT graduates. Strong hands-on experience in React.",
            perks: ["PPO opportunity", "Flexible hybrid policy", "Health insurance", "Wellness stipend"],
            responsibilities: [
                "Implement scalable React components for the checkout design system",
                "Optimize client-side bundle size and Core Web Vitals",
                "Participate in code reviews with senior staff engineers"
            ]
        });

        const job2 = await Job.create({
            title: "Full Stack Software Engineer",
            description: "Develop high-throughput microservices and interactive customer portals across consumer food ordering and delivery logistics.",
            requirements: ["Node.js", "React.js", "MongoDB", "Express.js", "Redis", "Docker"],
            salary: 14,
            location: "Gurugram",
            jobType: "Full Time",
            experience: 1,
            position: 2,
            company: zomato._id,
            created_by: recruiter._id,
            eligibility: "0-2 years of software engineering experience with Node.js and React.",
            perks: ["Competitive ESOPs", "Catered gourmet lunch", "Flexible work hours"],
            responsibilities: [
                "Design scalable RESTful and GraphQL APIs",
                "Integrate real-time socket events for order lifecycle tracking",
                "Maintain 99.99% uptime on customer facing services"
            ]
        });

        const job3 = await Job.create({
            title: "Backend API Developer (Node.js & Microservices)",
            description: "Architect high-concurrency order dispatch systems and warehouse inventory sync APIs powering Instamart quick commerce.",
            requirements: ["Node.js", "Express.js", "Kafka", "MongoDB", "PostgreSQL"],
            salary: 18,
            location: "Bangalore",
            jobType: "Full Time",
            experience: 2,
            position: 4,
            company: swiggy._id,
            created_by: recruiter._id,
            eligibility: "B.Tech/BE in CS or related field. Solid knowledge of data structures and distributed systems.",
            perks: ["Remote hybrid flexibility", "Annual learning allowance", "Full medical coverage"],
            responsibilities: [
                "Build low-latency dispatch and tracking services",
                "Implement caching strategies with Redis",
                "Collaborate with mobile and frontend engineering teams"
            ]
        });

        const job4 = await Job.create({
            title: "Data Science & ML Intern",
            description: "Train real-time recommendation and route optimization models using large scale delivery telemetry and user ordering patterns.",
            requirements: ["Python", "Pandas", "Scikit-Learn", "SQL", "Machine Learning"],
            salary: 5,
            location: "Remote",
            jobType: "Internship",
            experience: 0,
            position: 2,
            company: zomato._id,
            created_by: recruiter._id,
            eligibility: "Undergraduates or postgraduates with strong background in ML, Python, and probability.",
            perks: ["Remote stipend", "Mentorship from Principal Data Scientists", "Certificate"],
            responsibilities: [
                "Analyze user engagement datasets",
                "Build baseline prediction models for delivery times",
                "Document findings and experiment results"
            ]
        });

        // 5. Create a sample application
        console.log("Submitting initial application for student...");
        const sampleApp = await Application.create({
            job: job1._id,
            applicant: student._id,
            status: "pending"
        });

        job1.applications.push(sampleApp._id);
        await job1.save();

        console.log("\n============================================");
        console.log("Database seeded successfully!");
        console.log("============================================");
        console.log("Recruiter Account:");
        console.log("  Email:    recruiter@example.com");
        console.log("  Password: 123456");
        console.log("--------------------------------------------");
        console.log("Candidate / Student Account:");
        console.log("  Email:    student@example.com");
        console.log("  Password: 123456");
        console.log("============================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
