import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import axios from 'axios';

export default function DaftarNotifikasi() {

    const [notifikasi, setNotifikasi] = useState([]);
    const [loading, setLoading] = useState(true);

    // === STATE FORM === //
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState("");
    const [form, setForm] = useState({
        laporan: "",
    });
    const [selectedRow, setSelectedRow] = useState(null);
    const [errors, setErrors] = useState({});
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [laporanText, setLaporanText] = useState('');
    const token = localStorage.getItem('token');


    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/api/task/disposisi/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Error get tasks:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);


    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.laporan) newErrors.laporan = "Laporan wajib diisi.";

        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validation = validateForm();
        setErrors(validation);

        if (Object.keys(validation).length > 0) return;

        setNotifikasi(prev =>
            prev.map(item =>
                item.id === selectedRow.id
                    ? { ...item, isSubmitted: true, laporan: form.laporan }
                    : item
            )
        );

        setShowForm(false);
        setForm({ laporan: "" });
        setSelectedRow(null);

    };

    const detailBodyTemplate = (rowData) => {
        return (
            <Button
                type="button"
                icon="pi pi-search" severity='info' rounded
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setSelectedNotif(rowData);
                    setShowDetail(true);
                }}
            ></Button>
        );
    };

    // file body template for data table
    const fileBodyTemplate = (data) => {
        if (!data) return <span>-</span>;

        const url = `http://localhost:3000/${data}`;

        return (
            <Button
                label="Lihat"
                icon="pi pi-file"
                className="p-button-text p-button-sm"
                onClick={() => window.open(url, "_blank")}
            />
        );
    };

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

    const getLocalDateOnly = (isoString) => {
        const d = new Date(isoString);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // jam 00:00 WIB
    };

    const isLaporanAllowed = (row) => {
        const now = new Date();

        // Pakai tanggal lokal & jam_mulai lokal
        const localDate = getLocalDateOnly(row.tanggal);
        const startTime = new Date(row.jam_mulai);

        const start = new Date(
            localDate.getFullYear(),
            localDate.getMonth(),
            localDate.getDate(),
            startTime.getHours(),
            startTime.getMinutes(),
            startTime.getSeconds()
        );

        return now >= start;
    };

    const laporanActionTemplate = (row) => {
        console.log(row);

        const bolehLapor = isLaporanAllowed(row);

        return (
            <Button
                label={row.laporan ? 'Sudah Melaporkan' : 'Isi Laporan'}
                severity={row.laporan ? "success" : "primary"}
                onClick={() => {
                    setCurrentTask(row);
                    setLaporanText(row.laporan || '');
                    setShowDialog(true);
                }}
                disabled={!bolehLapor}   // HANYA disable kalau BELUM mulai
            />
        );
    };

    const handleSaveLaporan = async () => {
        if (!currentTask) return;
        try {
            const res = await axios.patch(
                `http://localhost:3000/api/task/disposisi/${currentTask._id}/laporan`,
                { laporan: laporanText },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const updated = res.data.disposisi;

            setTasks((prev) =>
                prev.map((t) => (t._id === updated._id ? updated : t))
            );

            setShowDialog(false);
            setCurrentTask(null);
            setLaporanText('');
        } catch (err) {
            console.error(
                'Error update laporan:',
                err.response?.data || err.message
            );
        }
    };

    return (
        <div className="card">
            <MainCard title="Daftar Notifikasi">


                <Dialog
                    header="Laporan Tugas"
                    visible={showDialog}
                    style={{ width: '30rem' }}
                    modal
                    onHide={() => setShowDialog(false)}
                >
                    {currentTask && (
                        <div className="flex flex-column gap-3">
                            <div>
                                <p>
                                    <strong>Nama Kegiatan:</strong> {currentTask.nama_kegiatan}
                                </p>
                                <p>
                                    <strong>Agenda:</strong> {currentTask.agenda_kegiatan}
                                </p>
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold">Isi Laporan</label>
                                <InputTextarea
                                    rows={5}
                                    className="w-full"
                                    value={laporanText}
                                    onChange={(e) => setLaporanText(e.target.value)}
                                    placeholder="Tuliskan laporan kegiatan di sini..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-3">
                                <Button
                                    label="Batal"
                                    className="p-button-text"
                                    onClick={() => setShowDialog(false)}
                                />
                                <Button label="Simpan" onClick={handleSaveLaporan} />
                            </div>
                        </div>
                    )}
                </Dialog>

                <Dialog
                    header="Detail Notifikasi"
                    visible={showDetail}
                    modal
                    style={{ width: "25rem" }}
                    onHide={() => setShowDetail(false)}
                >
                    {selectedNotif && (
                        <div className="flex flex-column gap-2">

                            <p><strong>Nama Kegiatan:</strong> {selectedNotif.nama_kegiatan}</p>
                            <p><strong>Tanggal:</strong> {formDate(selectedNotif.tanggal)}</p>
                            <p><strong>Jam Mulai:</strong> {formTime(selectedNotif.jam_mulai)}</p>
                            <p><strong>Jam Selesai:</strong> {formTime(selectedNotif.jam_selesai)}</p>
                            <p><strong>Tempat:</strong> {selectedNotif.tempat}</p>
                            <p><strong>File:</strong>{fileBodyTemplate(selectedNotif.file_path)}</p>
                            <p><strong>Catatan:</strong> {selectedNotif.catatan || "-"}</p>
                        </div>
                    )}
                </Dialog>

                <DataTable
                    value={tasks}
                    paginator
                    rows={5}
                    loading={loading}
                    dataKey="_id"
                    emptyMessage="Tidak ada data."
                >
                    <Column field="nama_kegiatan" header="Nama Kegiatan" style={{ minWidth: '10rem' }} />
                    <Column field="tanggal" header="Tanggal" body={(row) => formDate(row.tanggal)} style={{ minWidth: '10rem' }} />
                    <Column header="Jam" body={(row) => `${formTime(row.jam_mulai)} - ${formTime(row.jam_selesai)}`} style={{ minWidth: '10rem' }} />
                    <Column field="tempat" header="Tempat" style={{ minWidth: '12rem' }} />
                    <Column header="Detail" body={detailBodyTemplate} style={{ textAlign: 'left', width: '6rem' }} />
                    <Column header="Laporan" body={laporanActionTemplate} style={{ textAlign: 'center', width: '6rem' }} />
                </DataTable>

            </MainCard>
        </div>
    );
}
