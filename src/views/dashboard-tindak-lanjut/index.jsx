import MainCard from 'ui-component/cards/MainCard';
import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './app.css';

export default function DashboardTindakLanjutEVP() {
    const [data] = useState([
        {
            id: 1,
            personil: ['Andi Wijaya', 'Siti Aminah'],
            arahan: 'Koordinasi dengan tim IT terkait update sistem',
            arahan_file: 'arahan-evp-it.pdf',
            judul_tindak_lanjut: 'Koordinasi dan Persiapan Sistem',
            tindak_lanjut_text: 'Koordinasi telah dilakukan dan sistem siap digunakan',
            tindak_lanjut_file: 'laporan-koordinasi.pdf'
        },
        {
            id: 2,
            personil: ['Budi Santoso'],
            arahan: 'Susun laporan evaluasi bulanan',
            arahan_file: '',
            judul_tindak_lanjut: '',
            tindak_lanjut_text: '',
            tindak_lanjut_file: ''
        }
    ]);


    const [selected, setSelected] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showLegend, setShowLegend] = useState(true);

    // ================= ROW HIGHLIGHT =================
    const rowClassName = (row) => ({
        'row-done': row.judul_tindak_lanjut,
        'row-pending': !row.judul_tindak_lanjut
    });

    return (
        <div className="card h-full">
            <MainCard title="Dashboard Tindak Lanjut EVP"
                className="h-full flex flex-column"
            >
                <div className="flex justify-content-between align-items-center mb-2">
                    <span className="text-sm text-600 font-medium">
                        Status Tindak Lanjut
                    </span>

                    <Button
                        label={showLegend ? 'Sembunyikan' : 'Tampilkan'}
                        icon={showLegend ? 'pi pi-chevron-up' : 'pi pi-chevron-down'}
                        className="p-button-text p-button-sm"
                        onClick={() => setShowLegend(!showLegend)}
                    />
                </div>

                {showLegend && (
                    <div className="flex justify-content-end mb-2 gap-3 text-sm text-600">
                        <div className="flex align-items-center gap-2">
                            <span className="status-dot status-done"></span>
                            <span>Sudah ada tindak lanjut</span>
                        </div>

                        <div className="flex align-items-center gap-2">
                            <span className="status-dot status-pending"></span>
                            <span>Belum ada tindak lanjut</span>
                        </div>
                    </div>
                )}

                {/* TABLE CONTAINER — WAJIB */}
                <div className="flex-1 overflow-hidden">
                    <DataTable
                        value={data}
                        paginator
                        rows={5}
                        stripedRows
                        rowHover
                        rowClassName={rowClassName}
                        onRowClick={(e) => {
                            setSelected(e.data);
                            setShowDetail(true);
                        }}
                        scrollable
                        scrollHeight="flex"
                        emptyMessage="Belum ada tindak lanjut"
                    >

                        <Column
                            header="No"
                            body={(_, opt) => opt.rowIndex + 1}
                            style={{ width: '4rem' }}
                        />

                        <Column
                            header="Personil yang Ditugaskan"
                            body={(row) => row.personil.join(', ')}
                            style={{ minWidth: '18rem' }}
                        />

                        <Column
                            header="Arahan"
                            field="arahan"
                            style={{ minWidth: '22rem' }}
                        />

                        <Column
                            header="Judul Tindak Lanjut"
                            body={(row) =>
                                row.judul_tindak_lanjut ? (
                                    <span className="judul-tindak-lanjut">
                                        {row.judul_tindak_lanjut}
                                    </span>
                                ) : null
                            }
                            style={{ minWidth: '18rem' }}
                        />
                    </DataTable>
                </div>

                {/* ===== POPUP DETAIL ===== */}
                <Dialog
                    visible={showDetail}
                    modal
                    className="detail-dialog"
                    onHide={() => setShowDetail(false)}
                    header={
                        <div className="dialog-header">
                            <i className="pi pi-clipboard mr-2" />
                            Detail Tindak Lanjut
                        </div>
                    }
                >
                    {selected && (
                        <div className="detail-wrapper">

                            {/* PERSONIL */}
                            <div className="detail-section personil">
                                <div className="detail-card-title">
                                    <i className="pi pi-users mr-2" />
                                    Personil
                                </div>
                                <div className="detail-card-content">
                                    {selected.personil.join(', ')}
                                </div>
                            </div>

                            {/* ARAHAN */}
                            <div className="detail-section arahan">
                                <div className="detail-card-title">
                                    <i className="pi pi-directions mr-2" />
                                    Arahan EVP
                                </div>
                                <div className="detail-card-content">
                                    {selected.arahan}
                                </div>
                            </div>

                            {/* DOKUMEN ARAHAN */}
                            <div className="detail-section dokumen">
                                <div className="detail-card-title">
                                    <i className="pi pi-file mr-2" />
                                    Dokumen Arahan
                                </div>

                                {selected.arahan_file ? (
                                    <div
                                        className="file-card"
                                        onClick={() =>
                                            window.open(
                                                `/dummy/${selected.arahan_file}`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        <i className="pi pi-file-pdf file-icon" />
                                        <div className="file-info">
                                            <span className="file-name">
                                                {selected.arahan_file}
                                            </span>
                                            <span className="file-action">
                                                Klik untuk membuka dokumen
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="detail-empty">
                                        Tidak ada dokumen arahan
                                    </div>
                                )}
                            </div>

                            {/* TINDAK LANJUT */}
                            <div className="detail-section tinjut">
                                <div className="detail-card-title">
                                    <i className="pi pi-check-circle mr-2" />
                                    Tindak Lanjut Pegawai
                                </div>

                                {selected.judul_tindak_lanjut ? (
                                    <>
                                        <div className="tindaklanjut-title">
                                            {selected.judul_tindak_lanjut}
                                        </div>

                                        {selected.tindak_lanjut_text ? (
                                            <div className="detail-card-content">
                                                {selected.tindak_lanjut_text}
                                            </div>
                                        ) : (
                                            <div className="detail-empty">
                                                Tidak ada keterangan tertulis
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="detail-empty">
                                        Belum ada tindak lanjut dari pegawai
                                    </div>
                                )}
                            </div>

                            {/* FILE TINDAK LANJUT */}
                            {selected.tindak_lanjut_file && (
                                <div className="detail-section dokumen tinjut">
                                    <div className="detail-card-title">
                                        <i className="pi pi-paperclip mr-2" />
                                        Dokumen Tindak Lanjut
                                    </div>

                                    <div
                                        className="file-card"
                                        onClick={() =>
                                            window.open(
                                                `/dummy/${selected.tindak_lanjut_file}`,
                                                '_blank'
                                            )
                                        }
                                    >
                                        <i className="pi pi-file-pdf file-icon" />
                                        <div className="file-info">
                                            <span className="file-name">
                                                {selected.tindak_lanjut_file}
                                            </span>
                                            <span className="file-action">
                                                Klik untuk membuka
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Dialog>


            </MainCard>
        </div>
    );
}
