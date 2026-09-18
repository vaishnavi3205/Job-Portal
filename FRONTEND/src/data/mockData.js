// Rich mock dataset for Student / Candidate and Recruiter / Admin portals

export const initialStudentUser = {
    _id: "student_usr_01",
    fullname: "Vaishnavi Sharma",
    email: "vaishnavi.sharma@example.com",
    phoneNumber: "+91 98765 43210",
    role: "student",
    profile: {
        bio: "Pre-final year Computer Science student passionate about Frontend development, React, and building intuitive user experiences. Looking for full-time & internship roles.",
        headline: "Computer Science Undergraduate | Aspiring Full Stack Developer",
        college: "Delhi Technological University (DTU)",
        degree: "B.Tech in Computer Science & Engineering",
        graduationYear: "2025",
        cgpa: "8.9 / 10",
        location: "New Delhi, India",
        skills: ["React.js", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "Node.js", "HTML5/CSS3", "Redux Toolkit", "Git & GitHub", "REST APIs"],
        github: "https://github.com/vaishnavisharma",
        linkedin: "https://linkedin.com/in/vaishnavisharma",
        portfolio: "https://vaishnavi.dev",
        resume: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        resumeOriginalName: "Vaishnavi_Sharma_Resume_2025.pdf",
        resumeUploadDate: "2026-08-20",
        profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80"
    }
};

export const initialRecruiterUser = {
    _id: "recruiter_usr_01",
    fullname: "Priya Mehta",
    email: "priya.mehta@recruiter.com",
    phoneNumber: "+91 98111 22334",
    role: "recruiter",
    profile: {
        bio: "Senior Technical Talent Partner managing university hiring, early-career software engineering recruitment, and campus partnerships across high-growth startups.",
        headline: "Senior Talent Acquisition Partner | Technical Recruiter",
        company: "comp_01", // Razorpay
        location: "Bangalore, India",
        profilePhoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80"
    }
};

export const mockCompanies = [
    {
        _id: "comp_01",
        name: "Razorpay",
        description: "Razorpay is India's leading fintech company powering payments and banking infrastructure for online businesses.",
        website: "https://razorpay.com",
        location: "Bangalore, Karnataka",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-razorpay-logo-icon-download-in-svg-png-gif-file-formats--payment-gateway-brand-social-media-pack-logos-icons-4560373.png",
        userId: "recruiter_usr_01",
        createdAt: "2026-01-15T10:00:00.000Z"
    },
    {
        _id: "comp_02",
        name: "Zomato",
        description: "Zomato connects millions of customers with top dining, food delivery, and quick commerce services.",
        website: "https://zomato.com",
        location: "Gurugram, Haryana",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-zomato-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560378.png",
        userId: "recruiter_usr_01",
        createdAt: "2026-02-01T10:00:00.000Z"
    },
    {
        _id: "comp_03",
        name: "Swiggy",
        description: "Swiggy is India's premier convenience commerce platform delivering food, groceries, and essentials.",
        website: "https://swiggy.com",
        location: "Pune, Maharashtra",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-swiggy-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560377.png",
        userId: "recruiter_usr_01",
        createdAt: "2026-02-10T10:00:00.000Z"
    },
    {
        _id: "comp_04",
        name: "Microsoft",
        description: "Microsoft creates platforms and tools powered by AI to deliver innovative solutions across global cloud and productivity.",
        website: "https://microsoft.com",
        location: "Hyderabad, Telangana",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-microsoft-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560375.png",
        userId: "recruiter_usr_01",
        createdAt: "2026-02-15T10:00:00.000Z"
    },
    {
        _id: "comp_05",
        name: "Groww",
        description: "Groww is an intuitive financial platform providing seamless investing in mutual funds, stocks, and digital gold.",
        website: "https://groww.in",
        location: "Bangalore, Karnataka",
        logo: "https://groww.in/groww-logo-270.png",
        userId: "recruiter_usr_01",
        createdAt: "2026-03-01T10:00:00.000Z"
    },
    {
        _id: "comp_06",
        name: "CRED",
        description: "CRED is a high-trust reward community for creditworthy individuals offering premium financial products.",
        website: "https://cred.club",
        location: "Mumbai, Maharashtra",
        logo: "https://cdn.iconscout.com/icon/free/png-256/free-cred-logo-icon-download-in-svg-png-gif-file-formats--brand-social-media-pack-logos-icons-4560376.png",
        userId: "recruiter_usr_01",
        createdAt: "2026-03-05T10:00:00.000Z"
    }
];

export const mockJobs = [
    {
        _id: "job_01",
        title: "Frontend Developer Intern",
        description: "We are looking for an ambitious Frontend Developer Intern to join our engineering team. You will work closely with senior engineers to build responsive, accessible, and fast web applications using React, modern JavaScript, and Tailwind CSS. Ideal for students with strong foundational skills and keen eye for design.",
        requirements: ["React.js", "JavaScript", "HTML/CSS", "Tailwind CSS", "Git"],
        salary: 6, // 6 LPA
        experience: 0,
        location: "Bangalore (Hybrid)",
        jobType: "Internship",
        position: 4,
        company: mockCompanies[0],
        companyId: "comp_01",
        created_by: "recruiter_usr_01",
        responsibilities: [
            "Develop modern user interfaces using React and modern component libraries",
            "Collaborate with UI/UX designers to translate Figma designs into pixel-perfect code",
            "Write clean, reusable, and testable code",
            "Participate in daily standups and agile sprint reviews"
        ],
        perks: [
            "Certificate of Internship & Letter of Recommendation",
            "Pre-Placement Offer (PPO) opportunity for top performers",
            "Flexible work hours & hybrid environment",
            "Monthly wellness and learning allowances"
        ],
        eligibility: "Students graduating in 2025 or 2026 (B.Tech / BCA / MCA / B.Sc CS). Strong fundamentals in web technologies.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        applications: [
            {
                _id: "app_01",
                applicant: initialStudentUser,
                status: "shortlisted",
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    },
    {
        _id: "job_02",
        title: "Graduate Software Engineer",
        description: "Join our core platform engineering team as a Graduate Software Engineer. You will contribute to high-scale microservices, design scalable APIs, and participate in architecting reliable backend and frontend systems.",
        requirements: ["Node.js", "Express", "MongoDB", "React.js", "Data Structures"],
        salary: 14,
        experience: 0,
        location: "Gurugram / Delhi NCR",
        jobType: "Full Time",
        position: 8,
        company: mockCompanies[1],
        companyId: "comp_02",
        created_by: "recruiter_usr_01",
        responsibilities: [
            "Build and scale backend microservices serving millions of requests per minute",
            "Optimize database queries and ensure system high availability",
            "Write unit and integration tests to ensure code reliability",
            "Contribute to internal developer tools and automation"
        ],
        perks: [
            "Competitive compensation + comprehensive health insurance",
            "Generous meal coupons and office perks",
            "Fast-track mentorship from industry veterans",
            "Annual learning & conference sponsorship"
        ],
        eligibility: "Final year students or recent graduates in Computer Science, IT or related branches with solid DSA skills.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        applications: [
            {
                _id: "app_02",
                applicant: initialStudentUser,
                status: "pending",
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
            }
        ]
    },
    {
        _id: "job_03",
        title: "Junior Full Stack Developer",
        description: "Looking for an energetic Junior Full Stack Developer to build end-to-end features. You will handle both frontend UI states and backend business logic using MERN stack.",
        requirements: ["MongoDB", "Express.js", "React.js", "Node.js", "Redux", "REST APIs"],
        salary: 9,
        experience: 1,
        location: "Pune",
        jobType: "Full Time",
        position: 3,
        company: mockCompanies[2],
        companyId: "comp_03",
        created_by: "recruiter_usr_01",
        responsibilities: [
            "Build interactive frontend views using React and Redux",
            "Develop RESTful endpoints using Node and Express",
            "Debug issues across the full application stack",
            "Work closely with product managers to implement user stories"
        ],
        perks: [
            "Hybrid work policy (2 days office, 3 days remote)",
            "Health & wellness benefits",
            "Regular hackathons and innovation sprints"
        ],
        eligibility: "0-1 years of experience or strong student project portfolio demonstrating full stack abilities.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        applications: []
    },
    {
        _id: "job_04",
        title: "Data Science & AI Intern",
        description: "Exciting internship opportunity for students passionate about Machine Learning, predictive modeling, and data analytics. You will work on real customer behavioral datasets and NLP pipelines.",
        requirements: ["Python", "Pandas", "Scikit-Learn", "SQL", "Data Visualization"],
        salary: 8,
        experience: 0,
        location: "Hyderabad",
        jobType: "Internship",
        position: 2,
        company: mockCompanies[3],
        companyId: "comp_04",
        created_by: "recruiter_usr_01",
        responsibilities: [
            "Perform exploratory data analysis on real-world datasets",
            "Develop and evaluate machine learning models for classification and forecasting",
            "Present data-driven insights to product stakeholders",
            "Collaborate on production ML model deployments"
        ],
        perks: [
            "High stipend + relocation assistance",
            "1-on-1 mentorship with Principal AI Researchers",
            "Access to world-class cloud computing resources"
        ],
        eligibility: "Current undergraduate or master's students with strong math, statistics, and Python foundation.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        applications: []
    },
    {
        _id: "job_05",
        title: "React.js Developer - Entry Level",
        description: "Join our consumer applications team to craft hyper-responsive web experiences. You will write clean modular components, optimize rendering speeds, and integrate state-of-the-art animations.",
        requirements: ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "CSS Animations"],
        salary: 11,
        experience: 0,
        location: "Remote",
        jobType: "Full Time",
        position: 5,
        company: mockCompanies[4],
        companyId: "comp_05",
        created_by: "recruiter_usr_01",
        responsibilities: [
            "Build reusable UI component systems using TypeScript and Tailwind CSS",
            "Integrate WebSocket feeds for real-time market updates",
            "Ensure cross-browser compatibility and responsive layouts on mobile & desktop",
            "Optimize bundle size and Core Web Vitals"
        ],
        perks: [
            "100% remote work flexibility from anywhere in India",
            "Home office setup reimbursement (up to ₹30,000)",
            "Generous ESOP grants for full-time employees"
        ],
        eligibility: "Open to freshers and 2024/2025 graduates with active GitHub repositories or live web projects.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        applications: []
    },
    {
        _id: "job_06",
        title: "Associate Product Manager Intern",
        description: "Ideal for student candidates who enjoy bridging the gap between engineering, design, and user psychology. Help define product roadmaps, conduct user interviews, and analyze feature metrics.",
        requirements: ["Product Thinking", "Wireframing", "SQL / Analytics", "User Research", "Communication"],
        salary: 7,
        experience: 0,
        location: "Mumbai",
        jobType: "Internship",
        position: 2,
        company: mockCompanies[5],
        companyId: "comp_06",
        created_by: "recruiter_usr_01",
        responsibilities: [
            "Conduct qualitative user research and identify student user friction points",
            "Draft Product Requirement Documents (PRDs) for new features",
            "Analyze funnel conversion metrics using SQL and product analytics tools",
            "Work with cross-functional engineering and design squads"
        ],
        perks: [
            "Stipend + full clubhouse access and perks",
            "Direct interaction with leadership team",
            "High conversion rate to full-time APM roles"
        ],
        eligibility: "Graduating batch of 2025/2026. Prior leadership in college clubs or startup hackathons is a big plus.",
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        applications: []
    }
];

export const initialAppliedJobs = [
    {
        _id: "app_01",
        job: mockJobs[0],
        status: "shortlisted",
        applicant: initialStudentUser,
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        feedback: "Resume screened successfully. Shortlisted for Technical Assessment."
    },
    {
        _id: "app_02",
        job: mockJobs[1],
        status: "pending",
        applicant: initialStudentUser,
        appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        feedback: "Application submitted. Under review by campus recruitment team."
    }
];

export const initialSavedJobIds = ["job_03", "job_05"];
