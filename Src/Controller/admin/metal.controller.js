import Material from "../../models/material.model.js";
import Product from "../../models/product.model.js";
import Variant from "../../models/variant.model.js";


export const getMetalsPage = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { isDeleted: false };
        if (search && search.trim() !== '') {
            query.name = { $regex: search, $options: 'i' };
        }

        const metals = await Material.find(query).sort({ createdAt: -1 });

        console.log("metals", metals);

        const metalData = await Promise.all(metals.map(async (metal) => {
            const productIds = await Variant.distinct("productId", { metal: metal.name });
            const productCount = productIds.length || 0;
            console.log(`productCount for ${metal.name}`, productCount);
            return {
                _id: metal._id,
                name: metal.name,
                color: metal.color,
                productCount: productCount
            };
        }));

        res.render("admin/metals-page", {
            title: "Manage Metals",
            layout: "layouts/auth",
            activePage: "metal",
            metals: metalData,
            search: search || ""
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ADD METAL
export const addMetal = async (req, res) => {
    try {
        const { name, color } = req.body;
        if (!name || !color) {
            return res.status(400).json({ success: false, message: "Name and Color are required." });
        }

        const exactNameRegex = new RegExp(`^${name}$`, 'i');
        const existingMetal = await Material.findOne({ name: exactNameRegex });

        if (existingMetal) {
            if (existingMetal.isDeleted) {
                existingMetal.isDeleted = false;
                existingMetal.color = color;
                existingMetal.name = name.charAt(0).toUpperCase() + name.slice(1);
                await existingMetal.save();
                return res.status(200).json({ success: true, message: "Metal restored.", metal: existingMetal });
            } else {
                return res.status(400).json({ success: false, message: "Metal already exists." });
            }
        }

        const newMetal = new Material({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            color
        });
        await newMetal.save();

        res.status(201).json({ success: true, message: "Metal added successfully.", metal: newMetal });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// EDIT METAL
export const editMetal = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;

        const metal = await Material.findById(id);
        if (!metal) return res.status(404).json({ success: false, message: "Metal not found." });

        if (name && name.toLowerCase() !== metal.name.toLowerCase()) {
            const exactNameRegex = new RegExp(`^${name}$`, 'i');
            const exists = await Material.findOne({ name: exactNameRegex, _id: { $ne: id } });
            if (exists) return res.status(400).json({ success: false, message: "A metal with this name already exists." });
            metal.name = name.charAt(0).toUpperCase() + name.slice(1);
        }

        if (color) metal.color = color;

        await metal.save();
        res.status(200).json({ success: true, message: "Metal updated successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// SOFT DELETE
export const softDeleteMetal = async (req, res) => {
    try {
        const { id } = req.params;
        const metal = await Material.findById(id);

        if (!metal) return res.status(404).json({ success: false, message: "Metal not found." });

        metal.isDeleted = true;
        await metal.save();

        res.status(200).json({ success: true, message: "Metal deleted successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
