export const DataServices = {
    async getCustomersMedium() {
        return [
            {
                id: 1,
                name: "Gultom",
                country: { name: "Indonesia", code: "id" },
                representative: { name: "Amy Elsner", image: "amyelsner.png" },
                status: "qualified",
                verified: true,
                date: "2025-11-18"
            },
        ];
    }
};
