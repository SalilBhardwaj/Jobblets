const mongoose = require("mongoose");
const Job = require("../models/job");

const createJob = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const formData = req.body?.formData || req.body || {};

    const errors = [];
    if (!formData.title || !String(formData.title).trim())
      errors.push("title is required");
    if (!formData.category) errors.push("category is required");
    if (
      !formData.description ||
      String(formData.description).trim().length < 50
    )
      errors.push("description is required and must be at least 50 characters");
    if (!formData.budget && formData.budget !== 0)
      errors.push("budget is required");
    if (!formData.location || !String(formData.location).trim())
      errors.push("location is required");
    if (!formData.pincode || !String(formData.pincode).trim())
      errors.push("pincode is required");
    if (!formData.startDate) errors.push("startDate is required");

    if (errors.length)
      return res.status(400).json({ message: "Invalid input", errors });

    const startDate = new Date(formData.startDate);
    if (Number.isNaN(startDate.getTime()))
      return res.status(400).json({ message: "Invalid startDate" });

    let endDate = null;
    if (formData.endDate) {
      const ed = new Date(formData.endDate);
      if (Number.isNaN(ed.getTime()))
        return res.status(400).json({ message: "Invalid endDate" });
      endDate = ed;
    }

    // Parse coordinates if provided (expect latitude & longitude in formData)
    const latitudeProvided =
      formData.latitude !== undefined && formData.latitude !== "";
    const longitudeProvided =
      formData.longitude !== undefined && formData.longitude !== "";
    const rawLon = longitudeProvided ? Number(formData.longitude) : 0;
    const rawLat = latitudeProvided ? Number(formData.latitude) : 0;
    const lon = Number.isFinite(rawLon) ? rawLon : 0;
    const lat = Number.isFinite(rawLat) ? rawLat : 0;

    // Build job document
    const jobPayload = {
      createdBy: req.user.id,
      title: String(formData.title).trim(),
      description: String(formData.description).trim(),
      // Accept category as string or array
      category: Array.isArray(formData.category)
        ? formData.category
        : [formData.category],
      budget: formData.budget,
      address: {
        address: formData.location ?? "",
        pincode: String(formData.pincode),
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
      start_date: startDate,
      end_date: endDate,
      urgency: formData.urgency || "normal",
      shift_preference:
        formData.timePreference || formData.shift_preference || "flexible",
      notes: formData.requirements || formData.notes || "",
    };

    // Create and save
    const created = await Job.create(jobPayload);

    // Return created job (sanitized)
    const jobResponse = {
      id: created._id,
      title: created.title,
      description: created.description,
      category: created.category,
      budget: created.budget,
      address: created.address,
      start_date: created.start_date,
      end_date: created.end_date,
      urgency: created.urgency,
      shift_preference: created.shift_preference,
      notes: created.notes,
      createdAt: created.createdAt,
    };

    return res.status(201).json({ job: jobResponse });
  } catch (err) {
    console.error("createJob error:", err);
    // Handle Mongoose validation errors
    if (err && err.name === "ValidationError") {
      const details = Object.keys(err.errors || {}).map(
        (k) => err.errors[k].message
      );
      return res.status(400).json({ message: "Validation failed", details });
    }
    return res
      .status(500)
      .json({ message: err?.message || "Internal Server Error" });
  }
};

const searchJobs = async (req, res) => {
  try {
    const {
      category,
      location,
      budget_min,
      budget_max,
      urgency,
      status = "open",
    } = req.query;

    // Build search query
    const query = { status };

    if (category) query.category = { $in: category.split(",") };
    if (location)
      query["address.address"] = { $regex: location, $options: "i" };
    if (budget_min || budget_max) {
      query.budget = {};
      if (budget_min) query.budget.$gte = Number(budget_min);
      if (budget_max) query.budget.$lte = Number(budget_max);
    }
    if (urgency) query.urgency = urgency;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-active_bids -hired_worker");

    return res.json({ jobs, count: jobs.length });
  } catch (err) {
    console.error("searchJobs error:", err);
    return res
      .status(500)
      .json({ message: err?.message || "Internal Server Error" });
  }
};

const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(id).populate(
      "createdBy",
      "name email phone role profileImage address -_id"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobDetails = {
      id: job._id,
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      address: job.address,
      start_date: job.start_date,
      end_date: job.end_date,
      urgency: job.urgency,
      shift_preference: job.shift_preference,
      notes: job.notes,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      postedBy: job.createdBy,
      active_bids: job.active_bids,
      hired_worker: job.hired_worker,
    };

    return res.json({ job: jobDetails });
  } catch (err) {
    console.error("getJobDetails error:", err);
    return res
      .status(500)
      .json({ message: err?.message || "Internal Server Error" });
  }
};

const getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const jobs = await Job.find({
      category: { $in: [category] },
      status: "open",
    })
      .sort({ createdAt: -1 })
      .select("-active_bids -hired_worker");

    return res.json({ jobs, count: jobs.length, category });
  } catch (err) {
    console.error("getJobsByCategory error:", err);
    return res
      .status(500)
      .json({ message: err?.message || "Internal Server Error" });
  }
};

module.exports = { createJob, searchJobs, getJobDetails, getJobsByCategory };
