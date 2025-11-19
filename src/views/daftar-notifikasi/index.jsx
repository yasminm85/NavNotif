// project imports
import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataSurat } from './DataSurat';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';


export default function SuratTugas() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // === STATE FORM === //
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedNote, setSelectedNote] = useState("");
    const [form, setForm] = useState({
        namakegiatan: "",
        tanggal: null,
        jamMulai: "",
        jamSelesai: "",
        tempat: "",
        file: null,
        catatan: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        DataSurat.getCustomersMedium().then((data) => {
            setCustomers(data || []);
            setLoading(false);
        });
    }, []);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!form.namakegiatan) newErrors.namakegiatan = "Nama kegiatan wajib diisi.";
        if (!form.agenda) newErrors.agenda = "Agenda wajib diisi.";
        if (!form.tanggal) newErrors.tanggal = "Tanggal wajib diisi.";
        if (!form.jamMulai) newErrors.jamMulai = "Jam mulai wajib diisi.";
        if (!form.jamSelesai) newErrors.jamSelesai = "Jam selesai wajib diisi.";
        if (!form.tempat) newErrors.tempat = "Tempat wajib diisi.";

        return newErrors;
    };

    const handleSubmit = () => {
        const validation = validateForm();
        setErrors(validation);

        if (Object.keys(validation).length > 0) return;

        const newData = {
            id: customers.length + 1,
            namakegiatan: form.namakegiatan,
            agenda: form.agenda,
            tanggal: form.tanggal?.toLocaleDateString("id-ID"),
            jam: `${form.jamMulai} - ${form.jamSelesai}`,
            tempat: form.tempat,
            file: form.file?.name || "-",
            fileUrl: "#",
            catatan: form.catatan
        };

        setCustomers([...customers, newData]);

        // reset form
        setShowForm(false);
        setForm({
            namakegiatan: "",
            agenda: "",
            tanggal: null,
            jamMulai: "",
            jamSelesai: "",
            tempat: "",
            file: null,
            catatan: "",
        });
        setErrors({});
    };

    const fileBodyTemplate = (rowData) => {
        return (
            <a href={rowData.fileUrl} target="_blank" rel="noopener noreferrer">
                {rowData.file}
            </a>
        );
    };

    const catatanBodyTemplate = (rowData) => {
        return (
            <i
                className="pi pi-eye"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    setSelectedNote(rowData.catatan);
                    setShowDetail(true);
                }}
            ></i>
        );
    };

    const footer = (
        <Button label="Submit" className="w-full" onClick={handleSubmit} />
    );

        return (
            <div className="card">
                <MainCard title="Daftar Notifikasi">

                    <div className="flex justify-content-end mb-3">
                        <Button
                            label="Buat Laporan"
                            onClick={() => {
                                setShowForm(true);
                                setErrors({});
                            }}
                        />
                    </div>

                <Dialog
                    header="Form Laporan"
                    visible={showForm}
                    modal
                    style={{ width: "30rem" }}
                    onHide={() => setShowForm(false)}
                    footer={footer}
                >
                    {/* Nama Kegiatan */}
                    <div className="mb-3">
                        <InputText
                            placeholder="Nama kegiatan *"
                            className={`w-full ${errors.namakegiatan ? "p-invalid" : ""}`}
                            value={form.namakegiatan}
                            onChange={(e) => handleChange("namakegiatan", e.target.value)}
                        />
                        {errors.namakegiatan && <small className="p-error">{errors.namakegiatan}</small>}
                    </div>

                    {/* Agenda */}
                    <div className="mb-3">
                        <InputText
                            placeholder="Agenda kegiatan *"
                            className={`w-full ${errors.agenda ? "p-invalid" : ""}`}
                            value={form.agenda}
                            onChange={(e) => handleChange("agenda", e.target.value)}
                        />
                        {errors.agenda && <small className="p-error">{errors.agenda}</small>}
                    </div>

                    <div className="mb-3">
                        <Calendar
                            placeholder="Tanggal *"
                            className={`w-full ${errors.tanggal ? "p-invalid" : ""}`}
                            showIcon
                            value={form.tanggal}
                            onChange={(e) => handleChange("tanggal", e.value)}
                        />
                        {errors.tanggal && <small className="p-error">{errors.tanggal}</small>}
                    </div>

                    <div className="flex gap-2 mb-2">
                        <div className="p-inputgroup w-1/2">
                            <Calendar
                                placeholder="Jam Mulai *"
                                className={errors.jamMulai ? "p-invalid" : ""}
                                showIcon timeOnly  
                                icon={() => <i className="pi pi-clock" />} 
                                value={form.jamMulai}
                                onChange={(e) => handleChange("jamMulai", e.target.value)}
                            />
                        </div>

                        <div className="p-inputgroup w-1/2">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-clock"></i>
                            </span>
                            <Calendar showTime={true} timeOnly={true}
                                placeholder="Jam Selesai *"
                                className={errors.jamSelesai ? "p-invalid" : ""}
                                value={form.jamSelesai}
                                onChange={(e) => handleChange("jamSelesai", e.target.value)}
                            />
                        </div>
                    </div>

                    {errors.jamMulai && <small className="p-error">{errors.jamMulai}</small>}
                    {errors.jamSelesai && <small className="p-error">{errors.jamSelesai}</small>}

                    <div className="mt-3 mb-3">
                        <InputText
                            placeholder="Tempat *"
                            className={`w-full ${errors.tempat ? "p-invalid" : ""}`}
                            value={form.tempat}
                            onChange={(e) => handleChange("tempat", e.target.value)}
                        />
                        {errors.tempat && <small className="p-error">{errors.tempat}</small>}
                    </div>

                    <input
                        type="file"
                        className="w-full mb-3"
                        onChange={(e) => handleChange("file", e.target.files[0])}
                    />

                    <InputTextarea
                        placeholder="Catatan"
                        className="w-full"
                        rows={3}
                        value={form.catatan}
                        onChange={(e) => handleChange("catatan", e.target.value)}
                    />

                    <InputText
                        placeholder="Dresscode"
                        className="w-full mb-3"
                        value={form.nama}
                        // onChange={(e) => handleChange("namakegiatan", e.target.value)}
                    />
                </Dialog>

                <Dialog
                    header="Catatan Surat Tugas"
                    visible={showDetail}
                    modal
                    style={{ width: "25rem" }}
                    onHide={() => setShowDetail(false)}
                >
                    <p>{selectedNote}</p>
                </Dialog>

                <DataTable
                    value={customers}
                    paginator
                    rows={5}
                    loading={loading}
                    dataKey="id"
                    emptyMessage="Tidak ada data."
                >
                    <Column field="namakegiatan" header="Nama Kegiatan" style={{ minWidth: '10rem' }} />
                    <Column field="tanggal" header="Tanggal" style={{ minWidth: '10rem' }} />
                    <Column field="jam" header="Jam" style={{ minWidth: '10rem' }} />
                    <Column header="File" body={fileBodyTemplate} style={{ minWidth: '8rem' }} />
                    <Column field="tempat" header="Tempat" style={{ minWidth: '12rem' }} />
                    <Column header="Catatan" body={catatanBodyTemplate} style={{ textAlign: 'center', width: '6rem' }} />
                </DataTable>

            </MainCard>
        </div>
    );
}
