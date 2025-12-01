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
import axios from 'axios';



export default function Disposisi() {
    const [loading, setLoading] = useState(true);
    const [pegawaisel, setPegawai] = useState([]);
    const [selectedpegawai, setSelectedpegawai] = useState([]);
    const [selecteddivisi, setSelecteddivisi] = useState([]);
    const [selecteddirectorat, setSelecteddirectorat] = useState([]);
    const [itemOptions, setitemOptions] = useState([]);
    const token = localStorage.getItem('token');
    // === STATE FORM === //
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedNote, setSelectedNote] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [showView, setShowView] = useState(false);
    const [showDisposisi, setShowDisposisi] = useState([]);
    const [selectedDisposisi, setSelectedDisposisi] = useState([]);
    const [form, setForm] = useState({
        namakegiatan: "",
        agenda: "",
        namayangdituju: "",
        direktorat: "",
        divisi: "",
        tanggal: null,
        jamMulai: "",
        jamSelesai: "",
        tempat: "",
        file: null,
        catatan: "",
        dresscode: ""
    });
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

    const getDataDisposisi = async () => {
        try {
            setLoading(true);
            console.log(token);
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


    const directorat = [
        { id: 'DU', name: 'Direktorat Utama' },
        { id: 'DK', name: 'Direktorat Keuangan dan Manajemen Risiko' },
        { id: 'DO', name: 'Direktorat Operasi' },
        { id: 'DT', name: 'Direktorat Teknik' },
        { id: 'DS', name: 'Direktorat Keselamatan Keamanan dan Standardisasi' },
        { id: 'DM', name: 'Direktorat SDM dan Umum' },

    ]

    const divisi = [
        { id: 'UI', name: 'Internal Audit', DirId: 'DU' },
        { id: 'CS', name: 'Corporate Secretary', DirId: 'DU' },
        { id: 'LS', name: 'Legal Compliance and Sustainability', DirId: 'DU' },
        { id: 'CE', name: 'Community of Expertise', DirId: 'DU' },
        { id: 'CG', name: 'Corporate Strategy', DirId: 'DK' },
        { id: 'AM', name: 'Accounting and Asset Management', DirId: 'DK' },
        { id: 'UI', name: 'Internal Audit', DirId: 'DK' },
        { id: 'TR', name: 'Transaction', DirId: 'DK' },
        { id: 'RM', name: 'Risk Management', DirId: 'DK' },
        { id: 'PMO', name: 'Project Management Office', DirId: 'DK' },
        { id: 'AN', name: 'Air Navigation Services Planning', DirId: 'DO' },
        { id: 'ANC', name: 'Air Navigation Control', DirId: 'DO' },
        { id: 'ANI', name: 'Air Navigation Information Management', DirId: 'DO' },
        { id: 'TS', name: 'Technology Solution', DirId: 'DT' },
        { id: 'IR', name: 'Infrastructure Readiness', DirId: 'DT' },
        { id: 'IT', name: 'Information Technology', DirId: 'DT' },
        { id: 'SS', name: 'Standard Security', DirId: 'DS' },
        { id: 'SO', name: 'Safety Operation', DirId: 'DS' },
        { id: 'HC', name: 'Human Capital Planning', DirId: 'DM' },
        { id: 'HCS', name: 'Human Capital Services', DirId: 'DM' },
        { id: 'CSE', name: 'Corporate Services', DirId: 'DM' },
        { id: 'LKM', name: 'Learning and Knowledge Management', DirId: 'DM' },
    ]


    const onDirektoratChange = (e) => {
        const selectedDir = e.value;
        setSelecteddirectorat(selectedDir);

        const selectedDirCode = selectedDir.map((d) => d.id);
        const filteredDivisis = divisi.filter((div) =>
            selectedDirCode.includes(div.DirId)
        );

        setitemOptions(filteredDivisis);

        setSelecteddivisi([]);
    };


    const [errors, setErrors] = useState({});


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateForm();
        setErrors(validation);

        if (Object.keys(validation).length > 0) return;

        console.log('selectedpegawai:', selectedpegawai);
        console.log('selecteddirectorat:', selecteddirectorat);
        console.log('selecteddivisi:', selecteddivisi);

        const pegawaiIds = selectedpegawai.map((p) => p._id);

        const direktoratIds = selecteddirectorat.map((d) => d._id || d.id);
        const divisiIds = selecteddivisi.map((d) => d._id || d.id);
        const formData = new FormData();

        formData.append("nama_kegiatan", form.namakegiatan);
        formData.append("agenda_kegiatan", form.agenda);
        formData.append("nama_yang_dituju", JSON.stringify(pegawaiIds));
        formData.append("direktorat", JSON.stringify(direktoratIds));
        formData.append("divisi", JSON.stringify(divisiIds));
        formData.append("tanggal", form.tanggal);
        formData.append("jam_mulai", formatTime(form.jamMulai));
        formData.append("jam_selesai", jamSelesaiFormatted);
        formData.append("tempat", form.tempat);
        formData.append("catatan", form.catatan);
        formData.append("dresscode", form.dresscode);


        if (form.file) {
            formData.append("file", form.file);
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/api/task/disposisi',
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log(response.data);
            setShowForm(false);
            setForm({
                namakegiatan: "",
                agenda: "",
                namayangdituju: "",
                direktorat: "",
                divisi: "",
                tanggal: null,
                jamMulai: "",
                jamSelesai: "",
                tempat: "",
                file: "",
                catatan: "",
                dresscode: "",
            });
            setErrors({});
            getDataDisposisi();
        } catch (error) {
            console.error(
                'Error disposisi:',
                error.response?.data || error.message || error
            );
        }
    };


    // === DELETE === //
    const handleDelete = async (id) => {
        const hapusPop = (window.confirm(`Yakin hapus data?`));
        if (!hapusPop) return;

        try {
            await axios.delete(`http://localhost:3000/api/task/disposisi/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            setShowDisposisi((prev) => prev.filter((item) => item._id != id));
        } catch (error) {
            console.error("Gagal Hapus Disposisi", error.response?.data || error.message)
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
                    onClick={() => handleDelete(rowData._id)}
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

    const fileBodyTemplate = (rowData) => {
        if (!rowData.file_path) return <span>-</span>;

        const url = `http://localhost:3000/${rowData.file_path}`;

        return (
            <Button
                label="Lihat"
                icon="pi pi-file"
                className="p-button-text p-button-sm"
                onClick={() => window.open(url, "_blank")}
            />
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

    const formDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formTime = (date) => {
        if (!date) return "Selesai";

        return new Date(date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
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
                                namayangdituju: "",
                                direktorat: "",
                                divisi: "",
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
                            options={pegawaisel}
                            optionLabel='email'
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
                            onChange={onDirektoratChange}
                        />
                        {errors.direktorat && <small className="p-error">{errors.direktorat}</small>}
                    </div>

                    {/* Divisi */}
                    <div className="mb-3">
                        <MultiSelect
                            className="w-full"
                            value={selecteddivisi}
                            options={itemOptions}
                            optionLabel='name'
                            display='chip'
                            onChange={(e) => setSelecteddivisi(e.value)}
                            placeholder={
                                selecteddirectorat ? "Divisi" : "Pilihlah Direktorat Dahulu"
                            }

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
                    onHide={() => {
                        setShowDetail(false)
                        setSelectedData(null)
                    }}
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

                            <p><strong>Nama Kegiatan:</strong> {selectedData.nama_kegiatan}</p>
                            <p><strong>Agenda Kegiatan:</strong> {selectedData.agenda}</p>
                            <p><strong>Nama Pegawai:</strong></p>
                            <ul>
                                {(selectedData.nama_yang_dituju || []).map((p, i) => (
                                    <li key={i}>{p.email}</li>
                                ))}
                            </ul>
                            <p><strong>Direktorat:</strong> {selectedData.direktorat}</p>
                            <p><strong>Divisi:</strong> {selectedData.divisi}</p>
                            <p><strong>Tanggal:</strong> {selectedData.tanggal}</p>
                            <p><strong>Jam Mulai:</strong> {selectedData.jam_mulai}</p>
                            <p><strong>Jam Selesai:</strong> {selectedData.jam_selesai}</p>
                            <p><strong>Tempat:</strong> {selectedData.tempat}</p>
                            <p><strong>Catatan:</strong> {selectedData.catatan || "-"}</p>
                            <p><strong>Dresscode:</strong> {selectedData.dresscode || "-"}</p>

                        </div>
                    )}
                </Dialog>

                {/* TABLE */}
                <DataTable
                    value={showDisposisi}
                    paginator rows={5}
                    loading={loading}
                    dataKey="_id"
                    rowClassName={rowClass}
                >
                    <Column field="status" header="Status" bodyClassName="text-center" style={{ minWidth: '5rem' }} headerStyle={{ textAlign: "center", justifyContent: "center", display: "flex" }} body={statusBodyTemplate} />
                    <Column field="nama_kegiatan" header="Nama Kegiatan" style={{ minWidth: '10rem' }} />
                    <Column field="tanggal" header="Tanggal" body={(row) => formDate(row.tanggal)} style={{ minWidth: '10rem' }} />
                    <Column header="Jam" body={(row) => `${formTime(row.jam_mulai)} - ${formTime(row.jam_selesai)}`} style={{ minWidth: '10rem' }} />
                    <Column field="tempat" header="Tempat" style={{ minWidth: '8rem' }} />
                    <Column field="laporan" header="Laporan" body={laporanBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />
                    <Column header="Catatan" body={catatanBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />
                    <Column header="File" body={fileBodyTemplate} style={{ minWidth: '8rem', textAlign: 'center' }} />

                    {/* === ACTION === */}
                    <Column header="Action" body={actionBodyTemplate} headerStyle={{ textAlign: "center", justifyContent: "center", display: "flex" }} style={{ width: "10rem" }} />
                </DataTable>

            </MainCard>
        </div>
    );
}

