import MainCard from 'ui-component/cards/MainCard';
import React, { useState } from 'react';
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

export default function DaftarTindakLanjut() {
    // ================= DUMMY DATA =================
    const [tasks, setTasks] = useState([
        {
            _id: '1',
            judul_arahan: 'Koordinasi dengan Tim IT',
            isi_arahan: '<p>Mohon lakukan koordinasi terkait update sistem.</p>',
            judul_tindak_lanjut: '',
            isi_tindak_lanjut: ''
        },
        {
            _id: '2',
            judul_arahan: 'Laporan Evaluasi Bulanan',
            isi_arahan: '<p>Susun laporan evaluasi bulan Januari.</p>',
            judul_tindak_lanjut: 'Laporan disusun',
            isi_tindak_lanjut: '<p>Laporan sudah dibuat dan dikirim.</p>'
        }
    ]);

    const [showDialog, setShowDialog] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const [form, setForm] = useState({
        judul: '',
        isi: '',
        file: null
    });

    // ================= SIMPAN (UI ONLY) =================
    const handleSubmitTindakLanjut = () => {
        if (!currentTask) return;

        setTasks(prev =>
            prev.map(t =>
                t._id === currentTask._id
                    ? {
                          ...t,
                          judul_tindak_lanjut: form.judul,
                          isi_tindak_lanjut: form.isi
                      }
                    : t
            )
        );

        setShowDialog(false);
        setCurrentTask(null);
        setForm({ judul: '', isi: '', file: null });
    };

    // ================= TABLE ACTION =================
    const aksiTemplate = (row) => (
        <Button
            label={row.judul_tindak_lanjut ? 'Sudah Ditindaklanjuti' : 'Isi Tindak Lanjut'}
            severity={row.judul_tindak_lanjut ? 'success' : 'primary'}
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
                        paginator
                        rows={5}
                        stripedRows
                        showGridlines
                        responsiveLayout="scroll"
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

                {/* ===== DIALOG ===== */}
                <Dialog
                    header="Tindak Lanjut Arahan"
                    visible={showDialog}
                    modal
                    style={{ width: '42rem' }}
                    onHide={() => setShowDialog(false)}
                >
                    {currentTask && (
                        <div className="flex flex-column gap-4">

                            {/* ARAHAN */}
                            <div className="arahan-box">
                                <span className="font-medium">Arahan Admin</span>
                                <h4 className="mt-2">{currentTask.judul_arahan}</h4>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: currentTask.isi_arahan
                                    }}
                                />
                            </div>

                            {/* JUDUL */}
                            <div>
                                <label className="font-medium block mb-2">
                                    Judul Tindak Lanjut
                                </label>
                                <input
                                    className="p-inputtext w-full"
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
                                    style={{ height: '200px' }}
                                />
                            </div>

                            {/* FILE (UI ONLY) */}
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
