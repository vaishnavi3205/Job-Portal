import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        // Check company name
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Check if company already exists
        let company = await Company.findOne({
            name: companyName
        });

        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        // Create company
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.log("Register Company Error:", error);

        // Handle duplicate company error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


export const getCompany = async (req, res) => {
    try {
        const userId = req.id //logged in user id
        const companies = await Company.find({ userId });
        return res.status(200).json({
            companies: companies || [],
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company found.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        const updateData = { name, description, website, location };

        if (file) {
            const cloudUrl = await uploadToCloudinary(file.path, "companies");
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            updateData.logo = cloudUrl || `${baseUrl}/uploads/companies/${file.filename}`;
        }

        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to update this company.",
                success: false
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });

        return res.status(200).json({
            message: "Company information updated successfully.",
            company: updatedCompany,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


// DELETE COMPANY
export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        if (company.userId.toString() !== req.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this company.",
                success: false
            });
        }

        // Clean up all jobs and applications associated with this company
        const companyJobs = await Job.find({ company: id });
        const jobIds = companyJobs.map(j => j._id);
        if (jobIds.length > 0) {
            await Application.deleteMany({ job: { $in: jobIds } });
            await Job.deleteMany({ company: id });
        }

        await Company.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Company and its associated listings deleted successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};