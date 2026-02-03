// 03feb2026
import MainCard from 'ui-component/cards/MainCard';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import axios from 'axios';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';

export default function DaftarTindakLanjut() {
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const [form, setForm] = useState({
        judul: '',
        isi: '',
        file: null
    });

    // ================= FETCH DATA =================
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                'http://localhost:3000/api/task/disposisi/my',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ================= SUBMIT TINDAK LANJUT =================
    const handleSubmitTindakLanjut = async () => {
        if (!currentTask) return;

        const formData = new FormData();
        formData.append("judul_tindak_lanjut", form.judul);
        formData.append("isi_tindak_lanjut", form.isi);
        if (form.file) formData.append("file_tindak_lanjut", form.file);

        try {
            const res = await axios.patch(
                `http://localhost:3000/api/task/disposisi/${currentTask._id}/tindak-lanjut`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTasks(prev =>
                prev.map(t =>
                    t._id === res.data._id ? res.data : t
                )
            );

            setShowDialog(false);
            setCurrentTask(null);
            setForm({ judul: '', isi: '', file: null });
        } catch (err) {
            console.error(err);
        }
    };

    // ================= TABLE ACTION =================
    const aksiTemplate = (row) => (
        <Button
            label={row.judul_tindak_lanjut ? "Sudah Ditindaklanjuti" : "Isi Tindak Lanjut"}
            severity={row.judul_tindak_lanjut ? "success" : "primary"}
            onClick={() => {
                setCurrentTask(row);
                setForm({
                    judul: row.judul_tindak_lanjut || '',
                    isi: row.isi_tindak_lanjut || '',
                    file: null
                });
                setShowDialog(true);
            }}
        />
    );

    // ================= RENDER =================
    return (
        <div className="card h-full flex">
            <MainCard
                title="Daftar Tindak Lanjut"
                className="h-full w-full flex flex-column"
            >

                {/* ===== TABLE ===== */}
                <div className="flex-1">
                    <DataTable
                        value={tasks}
                        loading={loading}
                        paginator
                        rows={5}
                        stripedRows
                        showGridlines
                        responsiveLayout="scroll"
                        className="h-full border-round-lg"
                        emptyMessage={
                            <div className="empty-center">
                                <span className="font-medium">Belum ada arahan</span>
                            </div>
                        }
                    >
                        <Column
                            header="Arahan"
                            field="judul_arahan"
                            body={(row) => (
                                <span className="font-semibold text-primary">
                                    {row.judul_arahan}
                                </span>
                            )}
                        />

                        <Column
                            header="Isi Arahan"
                            body={(row) => (
                                <div
                                    className="text-600 isi-arahan"
                                    dangerouslySetInnerHTML={{ __html: row.isi_arahan }}
                                />
                            )}
                        />

                        <Column
                            header="Aksi"
                            body={aksiTemplate}
                            style={{ textAlign: 'center', width: '14rem' }}
                        />
                    </DataTable>

                </div>

                {/* ===== DIALOG ===== */}
                <Dialog
                    header="Tindak Lanjut Arahan"
                    visible={showDialog}
                    modal
                    className="fadein colorful-dialog"
                    style={{ width: '42rem' }}
                    onHide={() => setShowDialog(false)}
                >
                    {currentTask && (
                        <div className="flex flex-column gap-4">

                            {/* ARAHAN */}
                            <div className="arahan-box">
                                <span className="arahan-label">Arahan Admin</span>
                                <h4 className="mt-2 mb-2">{currentTask.judul_arahan}</h4>
                                <div
                                    className="text-700"
                                    dangerouslySetInnerHTML={{ __html: currentTask.isi_arahan }}
                                />
                            </div>

                            {/* JUDUL */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Judul Tindak Lanjut
                                </label>
                                <input
                                    className="p-inputtext w-full"
                                    placeholder="Contoh: Koordinasi lanjutan dengan tim"
                                    value={form.judul}
                                    onChange={(e) =>
                                        setForm({ ...form, judul: e.target.value })
                                    }
                                />
                            </div>

                            {/* ISI */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Isi Tindak Lanjut
                                </label>
                                <Editor
                                    value={form.isi}
                                    onTextChange={(e) =>
                                        setForm({ ...form, isi: e.htmlValue })
                                    }
                                    style={{ height: "200px" }}
                                />
                            </div>

                            {/* FILE */}
                            <div>
                                <label className="font-medium block mb-2">
                                    File Pendukung (PDF)
                                </label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="file-input"
                                    onChange={(e) =>
                                        setForm({ ...form, file: e.target.files[0] })
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    label="Simpan Tindak Lanjut"
                                    icon="pi pi-check"
                                    className="p-button-success"
                                    onClick={handleSubmitTindakLanjut}
                                />
                            </div>
                        </div>
                    )}
                </Dialog>

            </MainCard>
        </div>
    );

}
// 03feb2026