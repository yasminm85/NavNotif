

// Notification Pop Up
const getNotifPop = async (req, res) => {
    try {
        const { id } = req.params;
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}