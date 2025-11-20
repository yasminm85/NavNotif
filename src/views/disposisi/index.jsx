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
import { DataDisposisi } from './DataDisposisi';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';


export default function Disposisi() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // === STATE FORM === //
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedNote, setSelectedNote] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [showView, setShowView] = useState(false);
    const [form, setForm] = useState({
        id: null,
        status: "",
        namakegiatan: "",
        agenda: "",
        namayangdituju: "",
        direktorat:"",
        divisi:"",
        tanggal: null,
        jamMulai: "",
        jamSelesai: "",
        tempat: "",
        file: null,
        catatan: "",
    });

    const [selectedpegawai, setSelectedpegawai] = useState('');
    const pegawai = [
        { name: 'Lorem1', code: 'YA' },
        { name: 'Lorem2', code: 'PU' },
        { name: 'Lorem3', code: 'LDN' },
        { name: 'Lorem4', code: 'IST' },
        { name: 'Lorem5', code: 'PRS' }
    ]

    const [selecteddirectorat, setSelecteddirectorat] = useState('');
    const directorat = [
        { name: 'Lorem1', code: 'YA' },
        { name: 'Lorem2', code: 'PU' },
        { name: 'Lorem3', code: 'LDN' },
        { name: 'Lorem4', code: 'IST' },
        { name: 'Lorem5', code: 'PRS' }
    ]

    const [selecteddivisi, setSelecteddivisi] = useState('');
    const divisi = [
        { name: 'Lorem1', code: 'YA' },
        { name: 'Lorem2', code: 'PU' },
        { name: 'Lorem3', code: 'LDN' },
        { name: 'Lorem4', code: 'IST' },
        { name: 'Lorem5', code: 'PRS' }
    ]

    const [errors, setErrors] = useState({});

    // GET DATA
    useEffect(() => {
        DataDisposisi.getCustomersMedium().then((data) => {
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
        if (!selectedpegawai || selectedpegawai.length === 0)
            newErrors.namayangdituju = "Nama yang dituju wajib diisi.";
        if (!selecteddirectorat || selecteddirectorat.length === 0)
            newErrors.direktorat = "Direktorat wajib diisi.";
        if (!selecteddivisi || selecteddivisi.length === 0)
            newErrors.divisi = "Divisi wajib diisi.";
        if (!form.tanggal) newErrors.tanggal = "Tanggal wajib diisi.";
        if (!form.jamMulai) newErrors.jamMulai = "Jam mulai wajib diisi.";
        if (!form.tempat) newErrors.tempat = "Tempat wajib diisi.";
        return newErrors;
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <i
                className={
                    rowData.status
                        ? "pi pi-check-circle"
                        : "pi pi-times-circle"
                }
                style={{
                    fontSize: "1.3rem",
                    color: rowData.status ? "green" : "red"
                }}
            ></i>
        );
    };

    const handleSubmit = () => {
        const validation = validateForm();
        setErrors(validation);

        if (Object.keys(validation).length > 0) return;

        if (editMode) {
            const formatTime = (date) => {
                if (!date) return "";
                const h = date.getHours().toString().padStart(2, "0");
                const m = date.getMinutes().toString().padStart(2, "0");
                return `${h}.${m}`;
            };

            // UPDATE DATA
            const jamMulaiFormatted = formatTime(form.jamMulai);
            const jamSelesaiFormatted = form.jamSelesai ? formatTime(form.jamSelesai) : null;

            const jamFinal = jamSelesaiFormatted
                ? `${jamMulaiFormatted} - ${jamSelesaiFormatted}`
                : `${jamMulaiFormatted} - selesai`;

            const updated = customers.map((item) =>
                item.id === form.id
                    ? {
                        ...item,
                        status: form.status,
                        namakegiatan: form.namakegiatan,
                        agenda: form.agenda,
                        tanggal: form.tanggal?.toLocaleDateString("id-ID"),
                        tanggalRaw: form.tanggal,
                        jam: jamFinal,
                        jamMulai: jamMulaiFormatted,
                        jamSelesai: jamSelesaiFormatted ? jamSelesaiFormatted : "selesai",
                        tempat: form.tempat,
                        file: form.file?.name || item.file,
                        fileRaw: form.file || item.fileRaw,
                        pegawai: selectedpegawai,
                        catatan: form.catatan
                    }
                    : item
            );
            setCustomers(updated);
        } else {

            // ADD NEW DATA
            const formatTime = (date) => {
                if (!date) return "";
                const h = date.getHours().toString().padStart(2, "0");
                const m = date.getMinutes().toString().padStart(2, "0");
                return `${h}.${m}`;
            };

                const jamMulaiFormatted = formatTime(form.jamMulai);
                const jamSelesaiFormatted = form.jamSelesai ? formatTime(form.jamSelesai) : null;

                const jamFinal = jamSelesaiFormatted
                    ? `${jamMulaiFormatted} - ${jamSelesaiFormatted}`
                    : `${jamMulaiFormatted} - selesai`;


            const newData = {
                id: Date.now(),
                status: form.status,
                namakegiatan: form.namakegiatan,
                agenda: form.agenda,
                tanggal: form.tanggal?.toLocaleDateString("id-ID"),
                tanggalRaw: form.tanggal,  // simpan juga Date asli
                jam: jamFinal,
                jamMulai: jamMulaiFormatted,
                jamSelesai: jamSelesaiFormatted ? jamSelesaiFormatted : "selesai",
                tempat: form.tempat,
                file: form.file ? form.file.name : "-",
                fileRaw: form.file,        // simpan file asli
                pegawai: selectedpegawai,  // simpan pegawai yang dipilih
                catatan: form.catatan
            };

            setCustomers([...customers, newData]);
        }

        // reset
        setShowForm(false);
        setForm({
            id: null,
            namakegiatan: "",
            agenda: "",
            tanggal: null,
            jamMulai: "",
            jamSelesai: "",
            tempat: "",
            file: null,
            catatan: "",
            dresscode: "",
        });
        setErrors({});
        setEditMode(false);
    };

    // === DELETE === //
    const handleDelete = (row) => {
        if (window.confirm(`Yakin hapus data: ${row.namakegiatan}?`)) {
            setCustomers(customers.filter(item => item.id !== row.id));
        }
    };

    // === ACTION BUTTONS === //
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">

                {/* VIEW */}
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => {
                        setSelectedData(rowData);
                        setShowView(true);
                    }}
                />

                {/* EDIT */}
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-warning p-button-sm"
                    onClick={() => {
                        setForm({
                            ...rowData,
                            tanggal: new Date(),
                            jamMulai: rowData.jam?.split(" - ")[0] || "",
                            jamSelesai: rowData.jam?.split(" - ")[1] || "",
                        });
                        setEditMode(true);
                        setShowForm(true);
                    }}
                />

                {/* DELETE */}
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm"
                    onClick={() => handleDelete(rowData)}
                />
            </div>
        );
    };

    const laporanBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">

                {/* LAPORAN */}
                <Button
                    icon="pi pi-book"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => {
                        setSelectedData(rowData);  //belum diganti by view laporan
                        setShowView(true);
                    }}
                />
            </div>
        );
    };

    {/* CATATAN */ }
    const catatanBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pen-to-square"
                    className="p-button-rounded p-button-secondary p-button-sm"
                    onClick={() => {
                        setSelectedNote(rowData.catatan);
                        setShowDetail(true);
                    }}
                />
            </div>
        );
    };

    const rowClass = (rowData) => {
            if (rowData.tempat === "Auditorium") {
                return 'highlight-row';
            }
            if (rowData.tempat === 'Gedung') {
                return 'out-of-stock-row';
            }
            return ''; 
        };

    const footer = (
        <Button label="Submit" className="w-full" onClick={handleSubmit} />
    );

    return (

        <div className="card">
            <MainCard title="Disposisi">
                <div className="flex justify-content-end mb-3">
                    <Button
                        label="Buat Disposisi"
                        onClick={() => {
                            setShowForm(true);
                            setEditMode(false);
                            setErrors({});

                            // RESET FORM
                            setForm({
                                id: null,
                                status: "",
                                namakegiatan: "",
                                agenda: "",
                                tanggal: null,
                                jamMulai: "",
                                jamSelesai: "",
                                tempat: "",
                                file: null,
                                catatan: "",
                                dresscode: "",
                            });

                            // RESET MULTISELECT
                            setSelectedpegawai([]);
                            setSelecteddirectorat([]);
                            setSelecteddivisi([]);
                        }}
                    />
                </div>
                
                {/* FORM */}
                <Dialog
                    header={editMode ? "Edit Disposisi" : "Form Disposisi"}
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

                    {/* Nama yang dituju */}
                    <div className="mb-3">
                        <MultiSelect
                            placeholder="Nama yang dituju *"
                            className="w-full"
                            value={selectedpegawai}
                            options={pegawai}
                            optionLabel='name'
                            display='chip'
                            onChange={(e) => setSelectedpegawai(e.value)}
                        />
                        {errors.namayangdituju && <small className="p-error">{errors.namayangdituju}</small>}
                    </div>

                    {/* Direktorat */}
                    <div className="mb-3">
                        <MultiSelect
                            placeholder="Direktorat *"
                            className="w-full"
                            value={selecteddirectorat}
                            options={directorat}
                            optionLabel='name'
                            display='chip'
                            onChange={(e) => setSelecteddirectorat(e.value)}
                        />
                        {errors.direktorat && <small className="p-error">{errors.direktorat}</small>}
                    </div>

                    {/* Divisi */}
                    <div className="mb-3">
                        <MultiSelect
                            placeholder="Divisi *"
                            className="w-full"
                            value={selecteddivisi}
                            options={divisi}
                            optionLabel='name'
                            display='chip'
                            onChange={(e) => setSelecteddivisi(e.value)}
                        />
                        {errors.divisi && <small className="p-error">{errors.divisi}</small>}
                    </div>

                    {/* Tanggal */}
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

                    {/* Jam Mulai */}
                    <div className="flex gap-2 mb-2">
                        <div className="p-inputgroup w-1/2">
                            <Calendar
                                placeholder="Jam Mulai *"
                                className={errors.jamMulai ? "p-invalid" : ""}
                                icon={() => <i className="pi pi-clock" />}
                                value={form.jamMulai}
                                onChange={(e) => handleChange("jamMulai", e.target.value)}
                                showIcon timeOnly
                            />
                        </div>

                        {/* Jam Selesai */}
                        <div className="p-inputgroup w-1/2">
                            <Calendar
                                placeholder="Jam Selesai "
                                icon={() => <i className="pi pi-clock" />}
                                value={form.jamSelesai}
                                onChange={(e) => handleChange("jamSelesai", e.target.value)}
                                showIcon timeOnly
                            />
                        </div>
                    </div>
                    {errors.jamMulai && <small className="p-error">{errors.jamMulai}</small>}

                    {/* Tempat */}
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

                    {/* Catatan */}
                    <InputTextarea
                        placeholder="Catatan"
                        className="w-full"
                        rows={3}
                        value={form.catatan}
                        onChange={(e) => handleChange("catatan", e.target.value)}
                    />

                    {/* Dresscode */}
                    <div className='mt-3 mb-3'>
                        <InputText
                            placeholder="Dresscode"
                            className="w-full mb-3"
                            rows={3}
                            value={form.dresscode}
                            onChange={(e) => handleChange("dresscode", e.target.value)}
                        />
                    </div>
                </Dialog>

                {/* DETAIL */}
                <Dialog
                    header="Catatan Disposisi"
                    visible={showDetail}
                    modal
                    style={{ width: "25rem" }}
                    onHide={() => setShowDetail(false)}
                >
                    <p>{selectedNote}</p>
                </Dialog>

                {/* VIEW DETAIL LENGKAP */}
                <Dialog
                    header="Detail Disposisi"
                    visible={showView}
                    modal
                    style={{ width: "30rem" }}
                    onHide={() => setShowView(false)}
                >
                    {selectedData && (
                        <div className="flex flex-column gap-2">
                            
                            <p><strong>Status:</strong> {selectedData.status || "-"}</p>
                            <p><strong>Nama Kegiatan:</strong> {selectedData.namakegiatan}</p>
                            <p><strong>Agenda Kegiatan:</strong> {selectedData.agenda}</p>
                            <p><strong>Nama Pegawai:</strong></p>
                            <ul>
                                {(selectedData.pegawai || []).map((p, i) => (
                                    <li key={i}>{p.name}</li>
                                ))}
                            </ul>
                            <p><strong>Direktorat:</strong> {selectedData.directorat}</p>
                            <p><strong>Divisi:</strong> {selectedData.divisi}</p>
                            <p><strong>Tanggal:</strong> {selectedData.tanggal}</p>
                            <p><strong>Jam Mulai:</strong> {selectedData.jamMulai}</p>
                            <p><strong>Jam Selesai:</strong> {selectedData.jamSelesai}</p>
                            <p><strong>Tempat:</strong> {selectedData.tempat}</p>
                            <p><strong>File:</strong> {selectedData.file}</p>
                            <p><strong>Catatan:</strong> {selectedData.catatan || "-"}</p>

                        </div>
                    )}
                </Dialog>

                {/* TABLE */}
                <DataTable
                    value={customers}
                    paginator rows={5}
                    loading={loading}
                    dataKey="id"
                    rowClassName={rowClass}
                >
                    <Column field="status" header="Status" bodyClassName="text-center" style={{ minWidth: '5rem' }} headerStyle={{ textAlign: "center", justifyContent: "center", display: "flex" }} body={statusBodyTemplate} />
                    <Column field="namakegiatan" header="Nama Kegiatan" style={{ minWidth: '10rem' }} />
                    <Column field="tanggal" header="Tanggal" style={{ minWidth: '10rem' }} />
                    <Column field="jam" header="Jam" style={{ minWidth: '10rem' }} />
                    <Column field="tempat" header="Tempat" style={{ minWidth: '8rem' }} />
                    <Column field="laporan" header="Laporan" body={laporanBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />
                    <Column header="Catatan" body={catatanBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />

                    {/* === ACTION === */}
                    <Column header="Action" body={actionBodyTemplate} headerStyle={{ textAlign: "center", justifyContent: "center", display: "flex" }} style={{ width: "10rem" }} />
                </DataTable>

            </MainCard>
        </div>
    );
}

