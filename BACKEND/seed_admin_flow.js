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

const candidateData = [
    {
        fullname: "Vaishnavi Sharma",
        email: "student@example.com",
        phoneNumber: 9876543210,
        role: "student",
        profile: {
            bio: "Pre-final year Computer Science student passionate about Frontend development, React, and building intuitive user experiences.",
            headline: "Computer Science Undergraduate | Aspiring Frontend Engineer",
            college: "Delhi Technological University (DTU)",
            degree: "B.Tech in Computer Science & Engineering",
            graduationYear: "2025",
            cgpa: "8.9 / 10",
            location: "New Delhi, India",
            skills: ["React.js", "JavaScript", "TypeScript", "Tailwind CSS", "Redux Toolkit", "REST APIs", "Node.js", "Git"],
            github: "https://github.com/vaishnavisharma",
            linkedin: "https://linkedin.com/in/vaishnavisharma",
            portfolio: "https://vaishnavi.dev",
            profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Vaishnavi_Sharma_Resume.pdf",
            resumeUploadDate: "2026-09-18"
        }
    },
    {
        fullname: "Vaishnavi Lamkane",
        email: "lamkanevaishnavi7@gmail.com",
        phoneNumber: 9822334455,
        role: "student",
        profile: {
            bio: "Full Stack Web Developer proficient in MERN stack with proven experience building responsive, accessible web portals.",
            headline: "Computer Engineering Student | Full Stack Web Developer",
            college: "COEP Technological University",
            degree: "B.Tech in Information Technology",
            graduationYear: "2025",
            cgpa: "9.2 / 10",
            location: "Pune, Maharashtra",
            skills: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "TypeScript", "Tailwind CSS", "Redux Toolkit"],
            github: "https://github.com/lamkanevaishnavi",
            linkedin: "https://linkedin.com/in/vaishnavilamkane",
            profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Vaishnavi_Lamkane_Resume.pdf",
            resumeUploadDate: "2026-09-20"
        }
    },
    {
        fullname: "Aryan Verma",
        email: "aryan.verma@example.com",
        phoneNumber: 9812345678,
        role: "student",
        profile: {
            bio: "Passionate open-source contributor and frontend specialist focused on React performance, design systems, and Next.js apps.",
            headline: "Software Engineering Scholar | React & Next.js Specialist",
            college: "IIT Bombay",
            degree: "B.Tech in Computer Science",
            graduationYear: "2025",
            cgpa: "9.4 / 10",
            location: "Mumbai, Maharashtra",
            skills: ["React.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Web Performance", "Next.js", "GraphQL"],
            github: "https://github.com/aryanverma",
            linkedin: "https://linkedin.com/in/aryanverma",
            profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Aryan_Verma_Resume.pdf",
            resumeUploadDate: "2026-09-19"
        }
    },
    {
        fullname: "Ananya Patel",
        email: "ananya.patel@example.com",
        phoneNumber: 9834567890,
        role: "student",
        profile: {
            bio: "Backend enthusiast experienced in architecting microservices, high-throughput REST APIs, and caching layers.",
            headline: "Backend & Systems Engineer | Node.js, Express & Distributed Systems",
            college: "BITS Pilani",
            degree: "B.E. in Computer Science",
            graduationYear: "2025",
            cgpa: "8.7 / 10",
            location: "Hyderabad, Telangana",
            skills: ["Node.js", "Express.js", "MongoDB", "Redis", "Docker", "REST APIs", "React.js", "PostgreSQL"],
            github: "https://github.com/ananyapatel",
            linkedin: "https://linkedin.com/in/ananyapatel",
            profilePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Ananya_Patel_Resume.pdf",
            resumeUploadDate: "2026-09-17"
        }
    },
    {
        fullname: "Sneha Reddy",
        email: "sneha.reddy@example.com",
        phoneNumber: 9845678901,
        role: "student",
        profile: {
            bio: "Data Science scholar focused on predictive modelling, statistical inference, and deploying machine learning pipelines.",
            headline: "Data Science & ML Engineer | Python, Pandas, Scikit-Learn",
            college: "IIIT Hyderabad",
            degree: "B.Tech in Computer Science",
            graduationYear: "2025",
            cgpa: "9.1 / 10",
            location: "Hyderabad, Telangana",
            skills: ["Python", "Pandas", "Scikit-Learn", "SQL", "Machine Learning", "TensorFlow", "Data Analysis"],
            github: "https://github.com/snehareddy",
            linkedin: "https://linkedin.com/in/snehareddy",
            profilePhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Sneha_Reddy_Resume.pdf",
            resumeUploadDate: "2026-09-16"
        }
    },
    {
        fullname: "Dev Malhotra",
        email: "dev.malhotra@example.com",
        phoneNumber: 9856789012,
        role: "student",
        profile: {
            bio: "Backend developer keen on building low-latency messaging, event-driven architectures with Kafka and resilient relational schemas.",
            headline: "Distributed Systems & Cloud Engineer | Node.js, Kafka, PostgreSQL",
            college: "VIT Vellore",
            degree: "B.Tech in Information Technology",
            graduationYear: "2025",
            cgpa: "8.5 / 10",
            location: "Vellore, Tamil Nadu",
            skills: ["Node.js", "Express.js", "Kafka", "PostgreSQL", "MongoDB", "Docker", "Linux"],
            github: "https://github.com/devmalhotra",
            linkedin: "https://linkedin.com/in/devmalhotra",
            profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Dev_Malhotra_Resume.pdf",
            resumeUploadDate: "2026-09-15"
        }
    },
    {
        fullname: "Rohan Gupta",
        email: "rohan.gupta@example.com",
        phoneNumber: 9867890123,
        role: "student",
        profile: {
            bio: "Exploring foundational computer engineering concepts, algorithmic problem solving, and basic web development.",
            headline: "ECE Undergraduate exploring Software Development",
            college: "NIT Trichy",
            degree: "B.Tech in Electronics & Communication",
            graduationYear: "2026",
            cgpa: "7.8 / 10",
            location: "Tiruchirappalli, Tamil Nadu",
            skills: ["C++", "Python", "HTML", "CSS", "JavaScript", "SQL"],
            github: "https://github.com/rohangupta",
            linkedin: "https://linkedin.com/in/rohangupta",
            profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80",
            resume: "/uploads/resumes/sample_student_resume.pdf",
            resumeOriginalName: "Rohan_Gupta_Resume.pdf",
            resumeUploadDate: "2026-09-14"
        }
    }
];

const seedAdminFlow = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected successfully.");

        const defaultHash = await bcrypt.hash("123456", 10);

        // 1. Ensure/Update candidate accounts with rich profiles
        console.log("Setting up candidate students with complete academic & skill profiles...");
        const studentMap = {};

        for (const cand of candidateData) {
            let user = await User.findOne({ email: cand.email });
            if (!user) {
                user = await User.create({
                    ...cand,
                    password: defaultHash
                });
            } else {
                user.fullname = cand.fullname;
                user.phoneNumber = cand.phoneNumber;
                user.role = "student";
                user.profile = {
                    ...user.profile,
                    ...cand.profile
                };
                await user.save();
            }
            studentMap[cand.email] = user;
        }

        // Helper: Find or create company safely by name
        const getOrCreateCompany = async (name, companyData, userId) => {
            let comp = await Company.findOne({ name });
            if (!comp) {
                comp = await Company.create({
                    ...companyData,
                    name,
                    userId
                });
            }
            return comp;
        };

        // Helper: Create/update job and assign applications
        const setupJobAndApplicants = async (recruiterUser, companyDoc, jobDef, applicants) => {
            let job = await Job.findOne({ title: jobDef.title, created_by: recruiterUser._id });
            if (!job) {
                job = await Job.create({
                    ...jobDef,
                    company: companyDoc._id,
                    created_by: recruiterUser._id,
                    applications: []
                });
            } else {
                Object.assign(job, jobDef);
                job.company = companyDoc._id;
                await job.save();
            }

            for (const item of applicants) {
                const student = studentMap[item.email];
                if (!student) continue;

                let app = await Application.findOne({ job: job._id, applicant: student._id });
                if (!app) {
                    app = await Application.create({
                        job: job._id,
                        applicant: student._id,
                        status: item.status
                    });
                } else {
                    app.status = item.status;
                    await app.save();
                }

                if (!job.applications.some(id => id.toString() === app._id.toString())) {
                    job.applications.push(app._id);
                }
            }
            await job.save();
            console.log(`  ✓ [${recruiterUser.email}] Job "${job.title}" has ${job.applications.length} applicants.`);
        };

        // 2. Setup Recruiter 1: recruiter@example.com (Priya Mehta)
        console.log("\nSetting up jobs for Recruiter: recruiter@example.com...");
        let recruiter1 = await User.findOne({ email: "recruiter@example.com" });
        if (!recruiter1) {
            recruiter1 = await User.create({
                fullname: "Priya Mehta",
                email: "recruiter@example.com",
                phoneNumber: 9811122334,
                password: defaultHash,
                role: "recruiter",
                profile: {
                    bio: "Senior Technical Talent Partner managing early-career software engineering recruitment.",
                    headline: "Senior Talent Acquisition Partner | Technical Recruiter",
                    location: "Bangalore, India",
                    profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80"
                }
            });
        }

        const razorpay = await getOrCreateCompany("Razorpay", {
            description: "Razorpay is India's leading fintech unicorn building payment infrastructure and banking solutions.",
            website: "https://razorpay.com",
            location: "Bangalore, Karnataka",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-razorpay-logo-icon-download-in-svg-png-gif-file-formats--payment-gateway-brand-social-media-pack-logos-icons-4560373.png"
        }, recruiter1._id);

        const zomato = await getOrCreateCompany("Zomato", {
            description: "Zomato is India's leading food delivery and restaurant discovery technology network.",
            website: "https://zomato.com",
            location: "Gurugram, Haryana",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-zomato-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560378.png"
        }, recruiter1._id);

        const swiggy = await getOrCreateCompany("Swiggy", {
            description: "Swiggy powers on-demand food delivery, Instamart quick commerce, and dining solutions across 500+ Indian cities.",
            website: "https://swiggy.com",
            location: "Bangalore, Karnataka",
            logo: "https://cdn.iconscout.com/icon/free/png-256/free-swiggy-logo-icon-download-in-svg-png-gif-file-formats--food-brand-social-media-pack-logos-icons-4560376.png"
        }, recruiter1._id);

        // Job 1 (Frontend): Aryan (accepted), Vaishnavi Sharma (pending), Vaishnavi Lamkane (accepted), Rohan (rejected)
        await setupJobAndApplicants(recruiter1, razorpay, {
            title: "Frontend Engineering Intern (React & Next.js)",
            description: "Build delightful merchant checkouts, payment UI widgets, and dashboard micro-frontends with high performance and accessibility.",
            requirements: ["React.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Web Performance"],
            salary: 6,
            location: "Bangalore",
            jobType: "Internship",
            experience: 0,
            position: 3,
            eligibility: "Open to 2025/2026 CS/IT graduates. Strong hands-on experience in React.",
            perks: ["PPO opportunity", "Flexible hybrid policy", "Health insurance", "Wellness stipend"],
            responsibilities: [
                "Implement scalable React components for the checkout design system",
                "Optimize client-side bundle size and Core Web Vitals",
                "Participate in code reviews with senior staff engineers"
            ]
        }, [
            { email: "aryan.verma@example.com", status: "accepted" },
            { email: "student@example.com", status: "pending" },
            { email: "lamkanevaishnavi7@gmail.com", status: "accepted" },
            { email: "rohan.gupta@example.com", status: "rejected" }
        ]);

        // Job 2 (Full Stack): Ananya (accepted), Vaishnavi Sharma (accepted), Aryan (pending), Sneha (rejected)
        await setupJobAndApplicants(recruiter1, zomato, {
            title: "Full Stack Software Engineer",
            description: "Develop high-throughput microservices and interactive customer portals across consumer food ordering and delivery logistics.",
            requirements: ["Node.js", "React.js", "MongoDB", "Express.js", "Redis", "Docker"],
            salary: 14,
            location: "Gurugram",
            jobType: "Full Time",
            experience: 1,
            position: 2,
            eligibility: "0-2 years of software engineering experience with Node.js and React.",
            perks: ["Competitive ESOPs", "Catered gourmet lunch", "Flexible work hours"],
            responsibilities: [
                "Design scalable RESTful and GraphQL APIs",
                "Integrate real-time socket events for order lifecycle tracking",
                "Maintain 99.99% uptime on customer facing services"
            ]
        }, [
            { email: "ananya.patel@example.com", status: "accepted" },
            { email: "student@example.com", status: "accepted" },
            { email: "aryan.verma@example.com", status: "pending" },
            { email: "sneha.reddy@example.com", status: "rejected" }
        ]);

        // Job 3 (Backend): Dev (accepted), Vaishnavi Lamkane (pending), Vaishnavi Sharma (rejected), Rohan (rejected)
        await setupJobAndApplicants(recruiter1, swiggy, {
            title: "Backend API Developer (Node.js & Microservices)",
            description: "Architect high-concurrency order dispatch systems and warehouse inventory sync APIs powering Instamart quick commerce.",
            requirements: ["Node.js", "Express.js", "Kafka", "MongoDB", "PostgreSQL"],
            salary: 18,
            location: "Bangalore",
            jobType: "Full Time",
            experience: 2,
            position: 4,
            eligibility: "B.Tech/BE in CS or related field. Solid knowledge of data structures and distributed systems.",
            perks: ["Remote hybrid flexibility", "Annual learning allowance", "Full medical coverage"],
            responsibilities: [
                "Build low-latency dispatch and tracking services",
                "Implement caching strategies with Redis",
                "Collaborate with mobile and frontend engineering teams"
            ]
        }, [
            { email: "dev.malhotra@example.com", status: "accepted" },
            { email: "lamkanevaishnavi7@gmail.com", status: "pending" },
            { email: "student@example.com", status: "rejected" },
            { email: "rohan.gupta@example.com", status: "rejected" }
        ]);

        // Job 4 (Data Science): Sneha (accepted), Rohan (pending), Dev (rejected)
        await setupJobAndApplicants(recruiter1, zomato, {
            title: "Data Science & ML Intern",
            description: "Train real-time recommendation and route optimization models using large scale delivery telemetry and user ordering patterns.",
            requirements: ["Python", "Pandas", "Scikit-Learn", "SQL", "Machine Learning"],
            salary: 5,
            location: "Remote",
            jobType: "Internship",
            experience: 0,
            position: 2,
            eligibility: "Undergraduates or postgraduates with strong background in ML, Python, and probability.",
            perks: ["Remote stipend", "Mentorship from Principal Data Scientists", "Certificate"],
            responsibilities: [
                "Analyze user engagement datasets",
                "Build baseline prediction models for delivery times",
                "Document findings and experiment results"
            ]
        }, [
            { email: "sneha.reddy@example.com", status: "accepted" },
            { email: "rohan.gupta@example.com", status: "pending" },
            { email: "dev.malhotra@example.com", status: "rejected" }
        ]);

        // 3. Setup Recruiter 2: ved@gmail.com (if exists) so any session on ved@gmail.com also works
        const recruiter2 = await User.findOne({ email: "ved@gmail.com" });
        if (recruiter2) {
            console.log("\nSetting up jobs for Recruiter: ved@gmail.com...");
            const microsoft = await getOrCreateCompany("Microsoft India", {
                description: "Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.",
                website: "https://microsoft.com",
                location: "Hyderabad, Telangana",
                logo: "https://cdn.iconscout.com/icon/free/png-256/free-microsoft-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560370.png"
            }, recruiter2._id);

            const flipkart = await getOrCreateCompany("Flipkart", {
                description: "Flipkart is India's homegrown e-commerce marketplace leading innovation across retail logistics.",
                website: "https://flipkart.com",
                location: "Bangalore, Karnataka",
                logo: "https://cdn.iconscout.com/icon/free/png-256/free-flipkart-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560368.png"
            }, recruiter2._id);

            await setupJobAndApplicants(recruiter2, microsoft, {
                title: "Cloud & DevOps Engineer Intern",
                description: "Build automated CI/CD pipelines, containerize microservices with Kubernetes, and monitor Azure cloud workloads.",
                requirements: ["Docker", "Kubernetes", "Linux", "Python", "CI/CD"],
                salary: 8,
                location: "Hyderabad",
                jobType: "Internship",
                experience: 0,
                position: 2,
                eligibility: "Pre-final / Final year engineering students with cloud exposure.",
                perks: ["Azure certifications sponsored", "Free transport", "Gym membership"],
                responsibilities: [
                    "Maintain Kubernetes cluster deployments",
                    "Automate infrastructure provisioning using Terraform",
                    "Monitor latency and telemetry alerts"
                ]
            }, [
                { email: "dev.malhotra@example.com", status: "accepted" },
                { email: "lamkanevaishnavi7@gmail.com", status: "pending" },
                { email: "student@example.com", status: "rejected" }
            ]);

            await setupJobAndApplicants(recruiter2, flipkart, {
                title: "React Native Mobile Developer",
                description: "Craft fluid, responsive cross-platform iOS and Android checkout experiences for millions of shoppers.",
                requirements: ["React.js", "React Native", "TypeScript", "Redux Toolkit", "Mobile Performance"],
                salary: 16,
                location: "Bangalore",
                jobType: "Full Time",
                experience: 1,
                position: 3,
                eligibility: "1+ years of building and shipping production React Native applications.",
                perks: ["Competitive pay", "Health insurance", "Annual Flipkart shopping credits"],
                responsibilities: [
                    "Develop native UI components and bridge interfaces",
                    "Optimize app startup time and 60fps animations",
                    "Collaborate with product designers"
                ]
            }, [
                { email: "aryan.verma@example.com", status: "accepted" },
                { email: "lamkanevaishnavi7@gmail.com", status: "accepted" },
                { email: "student@example.com", status: "pending" },
                { email: "rohan.gupta@example.com", status: "rejected" }
            ]);
        }

        console.log("\n=======================================================");
        console.log("✓ All dummy data successfully seeded & linked!");
        console.log("=======================================================");
        console.log("\n1. Recruiter View (/admin/jobs):");
        console.log("   - Log in as: recruiter@example.com (pw: 123456) or ved@gmail.com");
        console.log("   - Each job shows 3-4 candidate applicants.");
        console.log("   - Click 'View Applicants' to see Candidate Details, CGPAs, 100%/80%/20% Skill Matches, Resumes, and the 'Decision' dropdown (Accepted, Pending, Rejected).");
        console.log("\n2. Student Dashboard View (/profile):");
        console.log("   - Log in as: student@example.com (pw: 123456) or lamkanevaishnavi7@gmail.com");
        console.log("   - Student dashboard now has varied application statuses:");
        console.log("     * 1+ Accepted / Shortlisted (Green)");
        console.log("     * 1+ Pending / Under Review (Amber)");
        console.log("     * 1+ Not Selected / Rejected (Red)");
        console.log("   - Filter pills (All, Under Review, Shortlisted, Not Selected) are all populated.");
        console.log("   - Expandable timeline stepper shows multi-step progression.");
        console.log("=======================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Error seeding dummy data:", err);
        process.exit(1);
    }
};

seedAdminFlow();
