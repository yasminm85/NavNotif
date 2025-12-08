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
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';
import axios from 'axios';

export default function Disposisi() {
    const token = localStorage.getItem('token');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pegawaisel, setPegawai] = useState([]);
    const [selectedpegawai, setSelectedpegawai] = useState([]);
    const [selecteddivisi, setSelecteddivisi] = useState([]);
    const [selecteddirectorat, setSelecteddirectorat] = useState([]);
    const [itemOptions, setitemOptions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedNote, setSelectedNote] = useState("");
    const [selectedLaporan, setSelectedLaporan] = useState("");
    const [selectedData, setSelectedData] = useState(null);
    const [showView, setShowView] = useState(false);
    const [showLaporan, setShowLaporan] = useState(false);
    const [showDisposisi, setShowDisposisi] = useState([]);
    const [selectedNotifOptions, setSelectedNotifOptions] = useState([]);
    const [errors, setErrors] = useState({});
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


    // reminder notif
    const notifOptions = [
        { label: '1 jam sebelum kegiatan', value: 'REMINDER_1H' },
        { label: '30 menit sebelum kegiatan', value: 'REMINDER_30M' },
        { label: '2 menit sebelum kegiatan', value: 'REMINDER_2M' }
    ];

    // inisialisasi direktorat dan divisi
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


    // handle direktorat dropdown
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

    const handleChange = (field, value) => {

        // Kosyong kalau user hapus jam nya
        if (field === "jamSelesai") {
            if (!value) {
                setForm({ ...form, jamSelesai: "" });
                return;
            }
        }

        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: "" });
    };

    const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Validasi PDF
    if (file && file.type !== "application/pdf") {
        alert("File harus berupa PDF!");
        e.target.value = ""; 
        return;
    }

    // Jika valid
    handleChange("file", file);
};


    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateForm();
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        const pegawaiIds = selectedpegawai.map((p) => p._id);
        const direktoratIds = selecteddirectorat.map((d) => d.name);
        const divisiIds = selecteddivisi.map((d) => d.name);
        const formData = new FormData();

        // console.log('pegawai ID:', selectedpegawai);
        // console.log('direktorat ID:', direktoratIds);
        // console.log('divisi ID:', divisiIds);

        formData.append("nama_kegiatan", form.namakegiatan);
        formData.append("agenda_kegiatan", form.agenda);
        formData.append("nama_yang_dituju", JSON.stringify(pegawaiIds));
        formData.append("direktorat", JSON.stringify(direktoratIds));
        formData.append("divisi", JSON.stringify(divisiIds));
        formData.append("tanggal", form.tanggal);
        formData.append("jam_selesai", form.jamSelesai || "");

        formData.append("jam_mulai", form.jamMulai);
        formData.append("tempat", form.tempat);
        formData.append("catatan", form.catatan);
        formData.append("dresscode", form.dresscode);
        formData.append("reminder", form.reminder);

        if (form.file) {
            formData.append("file", form.file);
        } else {
            if (editMode && selectedData?.file_path) {
                formData.append("file_path", selectedData.file_path);
            }
        }

        formData.append(
            "notificationOptions",
            JSON.stringify(selectedNotifOptions) 
        );


        try {
            let response;
            if (editMode && selectedData?._id) {
                response = await axios.patch(
                    `http://localhost:3000/api/task/disposisi/${selectedData._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setShowDisposisi(prev =>
                    prev.map(item =>
                        item._id === selectedData._id ? response.data : item
                    )
                );

            } else {
                response = await axios.post(
                    'http://localhost:3000/api/task/disposisi',
                    formData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setShowDisposisi(prev => [...prev, response.data]);
            }

            // Reset form setelah submit
            setShowForm(false);
            setEditMode(false);
            setSelectedData(null);
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
                file: null,
                catatan: "",
                dresscode: "",
            });
            setSelectedpegawai([]);
            setSelecteddirectorat([]);
            setSelecteddivisi([]);
            setErrors({});

        } catch (error) {
            console.error("Error disposisi:", error.response?.data || error.message);
        }
    };


    // handle delete button
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

    // action view, edit, and delete
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
                        if (!rowData) return;

                        const pegawaiSelected = pegawaisel.filter(p =>
                            (rowData.nama_yang_dituju || []).some(id =>
                                id === p._id || id?._id === p._id
                            )
                        );

                        const direktoratSelected = directorat.filter(d =>
                            (rowData.direktorat || []).includes(d.name)
                        );

                        const divisiSelected = divisi.filter(d =>
                            (rowData.divisi || []).includes(d.name)
                        );

                        const selectedDirIds = direktoratSelected.map(d => d.id);
                        const filteredDivisiOptions = divisi.filter(div =>
                            selectedDirIds.includes(div.DirId)
                        );

                        // form set
                        setForm({
                            ...rowData,
                            namakegiatan: rowData.nama_kegiatan || "",
                            agenda: rowData.agenda_kegiatan || "",
                            tempat: rowData.tempat || "",
                            catatan: rowData.catatan || "",
                            dresscode: rowData.dresscode || "",
                            file_path: rowData.file_path || null,
                            tanggal: rowData.tanggal ? new Date(rowData.tanggal) : null,
                            jamMulai: rowData.jam_mulai ? new Date(rowData.jam_mulai) : null,
                            jamSelesai: rowData.jam_selesai && rowData.jam_selesai !== "" 
                            ? new Date(rowData.jam_selesai) 
                            : "",

                        });

                        setSelectedpegawai(pegawaiSelected);
                        setSelecteddirectorat(direktoratSelected);
                        setSelecteddivisi(divisiSelected);
                        setitemOptions(filteredDivisiOptions);

                        setSelectedData(rowData);
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

    // laporan body template for data table
    const laporanBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-book"
                    className="p-button-rounded p-button-info p-button-sm"
                    onClick={() => {
                        setSelectedLaporan(rowData.laporan);
                        setShowLaporan(true);
                    }}
                />
            </div>
        );
    };

    // catatan body template for data table
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

    // status body template for data table
    const statusBodyTemplate = (rowData) => {
        return (
            <i
                className={
                    rowData.status_notif
                        ? "pi pi-check-circle"
                        : "pi pi-times-circle"
                }
                style={{
                    fontSize: "1.3rem",
                    color: rowData.status_notif ? "green" : "red"
                }}
            ></i>
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

    // Highlight row logic
const rowClass = (rowData) => {
    console.log("row data:", rowData);
    if (!rowData) return "";

    const now = new Date();
    const mulai = rowData.jam_mulai ? new Date(rowData.jam_mulai) : null;

    const selesai = rowData.jam_selesai && rowData.jam_selesai.trim() !== ""
        ? new Date(rowData.jam_selesai)
        : null;

    // Jika laporan sudah dibuat → hijau
    if (rowData.laporan_status === "SUDAH") {
        return "completed-row";
    }

    // Normalisasi tanggal kegiatan
    const tanggalKegiatan = new Date(
        new Date(rowData.tanggal).getFullYear(),
        new Date(rowData.tanggal).getMonth(),
        new Date(rowData.tanggal).getDate()
    );

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    // === KONDISI 1: Tanggal sudah lewat & BELUM isi laporan → kuning
    if (tanggalKegiatan < today) {
        return "highlight-row";
    }

    // === KONDISI 2: Hari ini
    if (tanggalKegiatan.getTime() === today.getTime()) {
        // Belum mulai → tidak highlight
        if (mulai && now < mulai) return "";

        // Sedang berlangsung
        if (mulai && now >= mulai && (!selesai || now <= selesai)) {
            return "highlight-row";
        }

        // Sudah lewat jam selesai & belum isi laporan
        if (selesai && now > selesai) {
            return "highlight-row";
        }
    }

    return "";
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
                    
                    {/* File */}
                    <input
                        type="file"
                        className="w-full mb-3"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e)}
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

                    {/* Pengingat Notifikasi */}
                    <div className="mb-3">
                        <label className="block mb-1 font-semibold">
                            Atur Pengingat Notifikasi
                        </label>
                        <MultiSelect
                            placeholder="Pilih pengingat"
                            className="w-full"
                            value={selectedNotifOptions}
                            options={notifOptions}
                            display="chip"
                            onChange={(e) => setSelectedNotifOptions(e.value)}
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
                    <p>{selectedLaporan}</p>
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
                            <p><strong>Agenda Kegiatan:</strong> {selectedData.agenda_kegiatan}</p>
                            <p>
                                <strong>Nama Pegawai:</strong>{" "}
                                {Array.isArray(selectedData.nama_yang_dituju)
                                    ? selectedData.nama_yang_dituju.map((u) => u.name).join(", ")
                                    : "-"}
                            </p>

                            <p><strong>Direktorat:</strong> {selectedData.direktorat.join(', ')}</p>
                            <p><strong>Divisi:</strong> {selectedData.divisi.join(', ')}</p>
                            <p><strong>Tanggal:</strong> {formDate(selectedData.tanggal)}</p>
                            <p><strong>Jam Mulai:</strong> {formTime(selectedData.jam_mulai)}</p>
                            <p><strong>Jam Selesai:</strong> {formTime(selectedData.jam_selesai)}</p>
                            <p><strong>Tempat:</strong> {selectedData.tempat}</p>
                            <p><strong>Catatan:</strong> {selectedData.catatan || "-"}</p>
                            <p><strong>File:</strong>{fileBodyTemplate(selectedData.file_path)}</p>
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
                    {/*  Action */}
                    <Column header="Action" body={actionBodyTemplate} headerStyle={{ textAlign: "center", justifyContent: "center", display: "flex" }} style={{ width: "10rem" }} />
                </DataTable>

            </MainCard>
        </div>
    );
}

