const Disposisi = require('../models/disposisi.model')

//get all disposisi
const getDisposisi = async (req, res) => {
    try {
        const disposisi = await Disposisi.find({});
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//get disposisi specific
const getDisposisis = async (req, res) => {
    try {
        const { id } = req.params;
        const disposisi = await Disposisi.findById(id);
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//create new disposisi
const createDisposisi = async (req, res) => {
    try {
        const disposisi = await Disposisi.create(req.body);
        res.status(200).json(disposisi);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//upate disposisi
const updateDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        const disposisi = await Disposisi.findByIdAndUpdate(id, req.body);

        if(!disposisi) {
            return res.status(404).json({message: "Data tidak ditemukan"});
        }
        const updatedDisposisi = await Disposisi.findById(id);
        res.status(200).json(updateDisposisi);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//delete disposisi
const deleteDisposisi = async (req, res) => {
    try {
        const { id } = req.params;

        const disposisi = await Disposisi.findByIdAndDelete(id);

        if(!disposisi) {
            return res.status(404).json({message: "Data not found"});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}



module.exports = {
    getDisposisi,
    getDisposisis,
    createDisposisi,
    updateDisposisi,
    deleteDisposisi
};