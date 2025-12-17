import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Typography } from '@mui/material';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';
import axios from 'axios';

export default function DashboardEVP() {
    const token = localStorage.getItem('token');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedLaporan, setSelectedLaporan] = useState("");
    const [showLaporan, setShowLaporan] = useState(false);
    const [showDisposisi, setShowDisposisi] = useState([]);
    const [errors, setErrors] = useState({});
    const [laporanPath, setLaporanPath] = useState(null);
    const [laporanby, setLaporanBy] = useState("");
    const [komentarText, setKomentar] = useState("");
    const [pegawaisel, setPegawai] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);


    // get data pegawai
    const fetchPegawai = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/auth/getEmp', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setPegawai(res.data);
        } catch (err) {
            console.error('Gagal ambil data pegawai:', err);
        } finally {
            setLoading(false);
        }
    };

    //get all data disposisi
    const getDataDisposisi = async () => {
        try {
            setLoading(true);
            // console.log(token);
            const response = await axios.get('http://localhost:3000/api/task/disposisi', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDisposisi(response.data);
        } catch (error) {
            console.error("Error mengambil data disposisi", error)
        }
        setLoading(false)

    };

    useEffect(() => {
        fetchPegawai();
        getDataDisposisi();
    }, []);

    // laporan body template buat data table
    const laporanBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-book"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => {
                        setCurrentTask(rowData);
                        setSelectedLaporan(rowData.laporan);
                        setLaporanPath(rowData.laporan_file_path);
                        setLaporanBy(rowData.laporan_by);
                        setKomentar(rowData.komentar)
                        setShowLaporan(true);
                    }}
                />
            </div>
        );
    };

    const namaPegawaiTemplate = (rowData) => {
        if (Array.isArray(rowData) && rowData.length) {
            return rowData.map(u => u?.name).filter(Boolean).join(", ");
        }
        return "-";

    }


    // setting date 
    const formDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // setting time
    const formTime = (date) => {
        if (!date) return "Selesai";

        return new Date(date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSendComment = async () => {
        try {
            const res = await axios.patch(
                `http://localhost:3000/api/task/disposisi/${currentTask._id}/komentar`,
                { text: komentarText },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );


            const updated = res.data.disposisi;

            setShowDisposisi(prev =>
                prev.map(t => {
                    if (t._id !== updated._id) return t;
                    return {
                        ...t,        
                        ...updated, 
                    };
                })
            );

            setShowLaporan(false);
            setCurrentTask(null);
            setKomentar("");
        } catch (error) {
            console.error("Error Saat Mengirim Komentar", error)
        }
    }


    return (
        <div className="card">
            <MainCard title="Dashboard">

                {/* Laporan */}
                <Dialog
                    header="Laporan Disposisi"
                    visible={showLaporan}
                    modal
                    style={{ width: "25rem" }}
                    onHide={() => {
                        setShowLaporan(false)
                        setSelectedLaporan(null)
                    }}
                >
                    {selectedLaporan ? (
                        <><label className="block mb-2 font-semibold">Isi Laporan</label><InputTextarea value={selectedLaporan} disabled rows={5} cols={30} /></>
                    ) : (
                        <Typography color="error">Belum ada laporan yang ditulis.</Typography>
                    )}
                    {laporanPath ? (
                        <Button
                            label="Lihat File Laporan"
                            icon="pi pi-file"
                            className="p-button p-button-sm"
                            onClick={() => window.open(`http://localhost:3000/${laporanPath}`, "_blank")}
                        />
                    ) : (
                        <Typography color="error">Belum ada file laporan.</Typography>
                    )}
                    <Typography className='mt-3'>Ditulis Oleh: {laporanby?.name ?? "-"}</Typography>

                    <div className="mt-3">
                        <label className="block mb-2 font-semibold">Berikan Komentar atau Feedback</label>
                        <InputTextarea
                            rows={5}
                            className={`w-full ${errors.komentar ? "p-invalid" : ""}`}
                            value={komentarText || ""}
                            onChange={(e) => setKomentar(e.target.value)}
                            placeholder="Tuliskan komentar laporan di sini..."
                        />
                        <div className="flex justify-end mt-2">
                            <Button label="Kirim" onClick={handleSendComment} />
                        </div>
                    </div>
                </Dialog>

                {/* TABLE */}
                <DataTable
                    value={showDisposisi}
                    paginator rows={5}
                    loading={loading}
                    dataKey="_id"
                >
                    <Column field="nama_kegiatan" header="Nama Kegiatan" style={{ minWidth: '10rem' }} />
                    <Column header="Nama Pegawai" body={(row) => namaPegawaiTemplate(row.nama_yang_dituju)} style={{ minWidth: '10rem' }} />
                    <Column field="tanggal" header="Tanggal" body={(row) => formDate(row.tanggal)} style={{ minWidth: '10rem' }} />
                    <Column header="Jam" body={(row) => `${formTime(row.jam_mulai)} - ${formTime(row.jam_selesai)}`} style={{ minWidth: '10rem' }} />
                    <Column field="tempat" header="Tempat" style={{ minWidth: '8rem' }} />
                    <Column field="laporan" header="Laporan" body={laporanBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />
                    {/*  Action */}
                </DataTable>

            </MainCard>
        </div>
    );
}

