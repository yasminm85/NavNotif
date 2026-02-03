// 03feb2026
import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { Divider } from 'primereact/divider';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';
import Swal from 'sweetalert2';
import axios from 'axios';


export default function TindakLanjut() {
    const token = localStorage.getItem('token');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pegawaisel, setPegawai] = useState([]);
    const [selectedpegawai, setSelectedpegawai] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [showDisposisi, setShowDisposisi] = useState([]);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({

        namayangdituju: "",
        judulArahan: "",
        isiArahan: "",
        file1: null,
        file2: null
    });
    const validateForm = () => {
        let newErrors = {};
        if (!selectedpegawai || selectedpegawai.length === 0)
            newErrors.namayangdituju = "Personil wajib dipilih";
        if (!form.judulArahan)
            newErrors.judulArahan = "Judul arahan wajib diisi";
        if (!form.isiArahan)
            newErrors.isiArahan = "Isi arahan wajib diisi";
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

    const fetchSeed = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/task/disposisi/barchart", {
            headers: { Authorization: `Bearer ${token}` }
        });

        setDirektorat(res.data?.direktoratOptions || []);
        setDivisi(res.data?.divisiOptions || []);
    };


    useEffect(() => {
        fetchPegawai();
        getDataDisposisi();
        fetchSeed();
    }, []);

    const handleFileChange = (field, e) => {
        const file = e.target.files[0];
        if (file && file.type !== "application/pdf") {
            Swal.fire("Error", "File harus PDF", "error");
            return;
        }
        setForm(prev => ({ ...prev, [field]: file }));
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateForm();
        setErrors(validation);
        if (Object.keys(validation).length > 0) return;

        const pegawaiIds = selectedpegawai.map((p) => p._id);
        const formData = new FormData();

        formData.append("judul_arahan", form.judulArahan);
        formData.append("isi_arahan", form.isiArahan);
        formData.append("nama_yang_dituju", JSON.stringify(pegawaiIds));

        if (form.file1) formData.append("file1", form.file1);
        if (form.file2) formData.append("file2", form.file2);

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
                namayangdituju: "",
                direktorat: "",
                divisi: "",
                ruangan: "",
                tempat: "",
                file: null,

            });
            setSelectedpegawai([]);
            setSelecteddirektorat([]);
            setSelecteddivisi([]);
            setErrors({});

        } catch (error) {
            console.error("Error disposisi:", error.response?.data || error.message);
        }
    };

    const nomorBodyTemplate = (rowData, options) => {
        return options.rowIndex + 1;
    };

    const personilBodyTemplate = (rowData) => {
        if (!rowData.nama_yang_dituju || rowData.nama_yang_dituju.length === 0) {
            return <span>-</span>;
        }

        // kalau backend kirim object
        if (typeof rowData.nama_yang_dituju[0] === "object") {
            return rowData.nama_yang_dituju.map(p => p.name).join(", ");
        }

        // fallback kalau cuma ID
        const names = pegawaisel
            .filter(p => rowData.nama_yang_dituju.includes(p._id))
            .map(p => p.name);

        return names.join(", ");
    };

    const arahanBodyTemplate = (rowData) => {
        return (
            <span className="font-medium">
                {rowData.judul_arahan || "-"}
            </span>
        );
    };

    const tindakLanjutBodyTemplate = (rowData) => {
        return (
            <span className="text-600">
                {rowData.judul_tindak_lanjut || "-"}
            </span>
        );
    };

    return (
        <>
            {/* ===== MAIN CARD ===== */}
            <div className="card h-full flex">
                <MainCard
                    title="Tindak Lanjut"
                    className="h-full w-full flex flex-column"
                >
                    {/* ===== HEADER ===== */}
                    <div className="flex justify-content-between align-items-center mb-3">
                        <span className="text-lg font-semibold">
                            Daftar Tindak Lanjut
                        </span>

                        <Button
                            label="Buat Tindak Lanjut"
                            icon="pi pi-plus"
                            className="p-button-primary"
                            onClick={() => {
                                console.log("BUTTON CLICKED");
                                setEditMode(false);
                                setSelectedData(null);
                                setErrors({});
                                setForm({
                                    judulArahan: "",
                                    isiArahan: "",
                                    file1: null,
                                    file2: null
                                });
                                setSelectedpegawai([]);
                                setShowForm(true);
                            }}
                        />
                    </div>

                    {/* TABLE */}
                    {/* ===== TABLE ===== */}
                    <div className="flex-1 overflow-auto">
                        <DataTable
                            value={showDisposisi}
                            paginator
                            rows={10}
                            loading={loading}
                            dataKey="_id"
                            responsiveLayout="scroll"
                            stripedRows
                            showGridlines
                            className="h-full border-round-lg"
                            emptyMessage={
                                <div className="empty-center">
                                    <span className="font-medium">
                                        Belum ada arahan
                                    </span>
                                </div>
                            }
                        >
                            <Column header="No" body={nomorBodyTemplate} style={{ width: "4rem" }} />
                            <Column header="Personil yang Dituju" body={personilBodyTemplate} />
                            <Column header="Arahan" body={arahanBodyTemplate} />
                            <Column header="Tindak Lanjut" body={tindakLanjutBodyTemplate} />
                        </DataTable>
                    </div>
                </MainCard>
            </div>

            {/* ===== DIALOG FORM (WAJIB DI LUAR CARD) ===== */}
            <Dialog
                header="Buat Tindak Lanjut"
                visible={showForm}
                modal
                className="fadein colorful-dialog"
                style={{ width: "52rem" }}
                appendTo={document.body}
                onHide={() => setShowForm(false)}
            >


                <div className="p-fluid">

                    {/* PERSONIL */}
                    <div className="mb-4">
                        <label className="font-medium mb-2 block">
                            Personil Tujuan <span className="text-red-500">*</span>
                        </label>
                        <MultiSelect
                            value={selectedpegawai}
                            options={pegawaisel}
                            optionLabel="name"
                            display="chip"
                            placeholder="Pilih personil"
                            className="w-full"
                            onChange={(e) => setSelectedpegawai(e.value)}
                        />
                        {errors.namayangdituju && (
                            <small className="p-error">{errors.namayangdituju}</small>
                        )}
                    </div>

                    <Divider />

                    {/* JUDUL */}
                    <div className="mb-3">
                        <label className="font-medium mb-2 block">
                            Judul Arahan <span className="text-red-500">*</span>
                        </label>
                        <InputText
                            value={form.judulArahan}
                            onChange={(e) => handleChange("judulArahan", e.target.value)}
                            placeholder="Contoh: Tindak lanjut laporan"
                        />
                        {errors.judulArahan && (
                            <small className="p-error">{errors.judulArahan}</small>
                        )}
                    </div>

                    {/* ISI */}
                    <div className="mb-3">
                        <label className="font-medium mb-2 block">
                            Isi Arahan <span className="text-red-500">*</span>
                        </label>
                        <InputTextarea
                            rows={6}
                            autoResize
                            value={form.isiArahan}
                            onChange={(e) => handleChange("isiArahan", e.target.value)}
                            placeholder="Tuliskan arahan secara jelas..."
                        />
                        {errors.isiArahan && (
                            <small className="p-error">{errors.isiArahan}</small>
                        )}
                    </div>

                    <Divider />

                    {/* FILE */}
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <input type="file" accept="application/pdf" onChange={(e) => handleFileChange("file1", e)} />
                        </div>
                        <div className="col-12 md:col-6">
                            <input type="file" accept="application/pdf" onChange={(e) => handleFileChange("file2", e)} />
                        </div>
                    </div>

                    <Button
                        label="Submit"
                        className="w-full mt-4"
                        onClick={handleSubmit}
                    />
                </div>
            </Dialog>
        </>
    );

}

// 03feb2026
