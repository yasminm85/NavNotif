import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataNotifikasi } from './DataNotifikasi';
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

    const token = localStorage.getItem('token');

    useEffect(() => {
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

        fetchTasks();
    }, []);


    useEffect(() => {
        DataNotifikasi.getNotifikasiMedium().then((data) => {
            setNotifikasi(data || []);
            setLoading(false);
        });
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

    const laporanBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-content-end mb-3">
                <Button
                    label={rowData.isSubmitted ? "Sudah Melaporkan" : "Buat Laporan"}
                    severity={rowData.isSubmitted ? "success" : "primary"}
                    onClick={() => {
                        setSelectedRow(rowData);
                        setShowForm(true);
                        setErrors({});
                    }}
                    disabled={rowData.isSubmitted}
                />

            </div>
        );
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


    const footer = (
        <Button label="Submit" className="w-full" onClick={handleSubmit} />
    );

    return (
        <div className="card">
            <MainCard title="Daftar Notifikasi">

                <Dialog
                    header="Form Laporan"
                    visible={showForm}
                    modal
                    style={{ width: "30rem" }}
                    onHide={() => setShowForm(false)}
                    footer={footer}
                >
                    <div className="mb-3">
                        <InputTextarea
                            placeholder="Tulis Laporan *"
                            className="w-full"
                            rows={3}
                            value={form.laporan}
                            onChange={(e) => handleChange("laporan", e.target.value)}
                        />
                        {errors.laporan && <small className="p-error">{errors.laporan}</small>}
                    </div>

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

                            <p><strong>Nama Kegiatan:</strong> {selectedNotif.namakegiatan}</p>
                            <p><strong>Tanggal:</strong> {selectedNotif.tanggal}</p>
                            <p><strong>Jam:</strong> {selectedNotif.jam}</p>
                            <p><strong>Tempat:</strong> {selectedNotif.tempat}</p>
                            <p><strong>File:</strong> {selectedNotif.file}</p>
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
                    <Column field="tanggal" header="Tanggal" style={{ minWidth: '10rem' }} />
                    <Column field="jam" header="Jam" style={{ minWidth: '10rem' }} />
                    <Column field="tempat" header="Tempat" style={{ minWidth: '12rem' }} />
                    <Column header="Detail" body={detailBodyTemplate} style={{ textAlign: 'left', width: '6rem' }} />
                    <Column header="Laporan" body={laporanBodyTemplate} style={{ textAlign: 'center', width: '6rem' }} />
                </DataTable>

            </MainCard>
        </div>
    );
}
