export const DataNotifikasi = {
    async getNotifikasiMedium() {
        return [
            {
                id: 1,
                namakegiatan: "Perkumpulan...",
                tanggal: "20-11-2025",
                jam: "13.30 - 15.30",
                file: "file_1",
                fileUrl: "#",
                tempat: "Auditorium",
                catatan: "Catatan 1",
                isSubmitted: false
            },
            {
                id: 2,
                namakegiatan: "Perkumpulan...",
                tanggal: "29-07-2025",
                jam: "15.30 - 15.50",
                file: "file_2",
                fileUrl: "#",
                tempat: "Gedung Support",
                catatan: "Catatan 2",
                isSubmitted: false
            }
        ];
    }
};
