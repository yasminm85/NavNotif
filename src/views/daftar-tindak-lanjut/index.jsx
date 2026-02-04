import MainCard from 'ui-component/cards/MainCard';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';
import axios from 'axios';

export default function DaftarTindakLanjut() {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const [form, setForm] = useState({
        judulTindakLanjut: '',
        isiTindakLanjut: '',
        file: null
    });

    const fetchTindakLanjut = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/api/tindaklanjut/get-arahan', {
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
        fetchTindakLanjut();
    }, []);

    const handleSubmitTindakLanjut = async () => {
        if (!currentTask) return;

        const formData = new FormData();

        if (form.file) formData.append("file_tindaklanjut", form.file);
        formData.append("judul_tindaklanjut", form.judulTindakLanjut);
        formData.append("isi_tindaklanjut", form.isiTindakLanjut);

        try {
            const res = await axios.patch(
                `http://localhost:3000/api/tindaklanjut/update/${currentTask._id}/tindaklanjut`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setTasks(prev =>
                prev.map(t =>
                    t._id === currentTask._id
                        ? {
                            ...t,
                            judul_tindak_lanjut: form.judulTindakLanjut,
                            isi_tindak_lanjut: form.isiTindakLanjut
                        }
                        : t
                )
            );

            setShowDialog(false);
            setCurrentTask(null);
            setForm({ judulTindakLanjut: '', isiTindakLanjut: '', file: null });
        } catch (error) {

        }
    };

    const aksiTemplate = (row) => (
        <Button
            label={row.judul_tindaklanjut ? 'Sudah Ditindaklanjuti' : 'Isi Tindak Lanjut'}
            severity={row.judul_tindaklanjut ? 'success' : 'primary'}
            onClick={() => {
                setCurrentTask(row);
                setForm({
                    judulTindakLanjut: row.judul_tindaklanjut || '',
                    isiTindakLanjut: row.isi_tindaklanjut || '',
                    file: null
                });
                setShowDialog(true);
            }}
        />
    );

    return (
        <div className="card h-full flex">
            <MainCard
                title="Daftar Tindak Lanjut"
                className="h-full w-full flex flex-column"
            >
                <div className="flex-1">
                    <DataTable
                        value={tasks}
                        paginator
                        rows={5}
                        stripedRows
                        showGridlines
                        className="h-full border-round-lg"
                        emptyMessage="Belum ada arahan"
                    >
                        <Column
                            header="Arahan"
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
                                    className="text-600"
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

                <Dialog
                    header="Tindak Lanjut Arahan"
                    visible={showDialog}
                    modal
                    style={{ width: '42rem' }}
                    onHide={() => setShowDialog(false)}
                >
                    {currentTask && (
                        <div className="flex flex-column gap-4">

                            <div className="arahan-box">
                                <span className="font-medium">Arahan Admin</span>
                                <h4 className="mt-2">{currentTask.judul_arahan}</h4>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: currentTask.isi_arahan
                                    }}
                                />
                            </div>

                            <div>
                                <label className="font-medium block mb-2">
                                    Judul Tindak Lanjut
                                </label>
                                <input
                                    className="p-inputtext w-full"
                                    value={form.judulTindakLanjut}
                                    onChange={(e) =>
                                        setForm({ ...form, judulTindakLanjut: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="font-medium block mb-2">
                                    Isi Tindak Lanjut
                                </label>
                                <Editor
                                    value={form.isiTindakLanjut}
                                    onTextChange={(e) =>
                                        setForm({ ...form, isiTindakLanjut: e.htmlValue })
                                    }
                                    style={{ height: '200px' }}
                                />
                            </div>

                            <div>
                                <label className="font-medium block mb-2">
                                    File Pendukung
                                </label>
                                <input
                                    type="file"
                                    className="file-input"
                                    onChange={(e) =>
                                        setForm({ ...form, file: e.target.files[0] })
                                    }
                                />
                            </div>

                            <div className="flex justify-end">
                                {currentTask.isTindakLanjut == true ? (
                                    <Button
                                        label="Kembali"
                                        icon="pi pi-arrow-left"
                                        className="p-button-danger"
                                        onClick={() => setShowDialog(false)}
                                    />
                                ) : (
                                    <Button
                                        label="Simpan Tindak Lanjut"
                                        type='submit'
                                        icon="pi pi-check"
                                        className="p-button-success"
                                        onClick={handleSubmitTindakLanjut}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </Dialog>
            </MainCard>
        </div>
    );
}

