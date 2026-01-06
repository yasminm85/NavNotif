// TVDisplayAdmin.js
// Copy file ini ke project React Anda

import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { FileUpload } from 'primereact/fileupload';
import { Chip } from 'primereact/chip';
import { Box, Typography, Paper } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Swal from 'sweetalert2';

// Import PrimeReact CSS - pastikan ini ada di index.js atau App.js
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function KelolaDisplay() {
    const token = localStorage.getItem('token');
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [media, setMedia] = useState([]);
    // ==================== MEDIA STATE ====================
    const [showMediaDialog, setShowMediaDialog] = useState(false);
    const [form, setForm] = useState({
        duration: "",
        file: null
    });

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/api/media/getAll-media', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedia(res.data);
        } catch (err) {
            console.error('Error get media:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    // ==================== AGENDA SETTINGS ====================

    const [agendaSettings, setAgendaSettings] = useState({
        enableRotation: true,
        modes: [
            {
                id: 'kegiatan',
                name: 'Agenda Kegiatan',
                enabled: true,
                duration: 120,
                description: 'Menampilkan agenda kegiatan 3 hari ke depan',
                icon: 'pi-calendar',
                color: '#2196F3'
            },
            {
                id: 'hari_ini',
                name: 'Agenda Hari Ini',
                enabled: true,
                duration: 120,
                description: 'Menampilkan agenda kegiatan hari ini',
                icon: 'pi-bell',
                color: '#FF9800'
            },
            {
                id: 'selesai',
                name: 'Agenda Selesai',
                enabled: true,
                duration: 120,
                description: 'Menampilkan agenda yang sudah selesai',
                icon: 'pi-check-circle',
                color: '#4CAF50'
            }
        ],
        alarmBeforeMinutes: 30
    });

    // ==================== GET AGENDA DURATION ====================
    const fetchAgendaDuration = async () => {
        try {
            const res = await axios.get(
                'http://localhost:3000/api/media/get-duration',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.data) return;

            setAgendaSettings(prev => ({
                ...prev,
                modes: prev.modes.map(mode => {
                    if (mode.id === 'kegiatan')
                        return { ...mode, duration: res.data.agenda_kegiatan_duration ?? mode.duration };
                    if (mode.id === 'hari_ini')
                        return { ...mode, duration: res.data.agenda_hariini_duration ?? mode.duration };
                    if (mode.id === 'selesai')
                        return { ...mode, duration: res.data.agenda_selesai ?? mode.duration };
                    return mode;
                })
            }));
        } catch (err) {
            console.error('Gagal ambil pengaturan agenda', err);
        }
    };

    const mediaTypes = [
        { label: 'Gambar (JPG, PNG, GIF)', value: 'image' },
        { label: 'Video (MP4, WebM)', value: 'video' }
    ];

    // ==================== MEDIA HANDLERS ====================
    const handleAddMedia = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("display_path", form.file);
        formData.append("duration", form.duration);
        // console.log(form.file);
        // console.log(form.duration);
        let response = await axios.post(
            "http://localhost:3000/api/media/create-media",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setMedia(prev => [...prev, response.data.display]);
        setShowMediaDialog(false);
    };

    const handleDeleteMedia = (id) => {
        Swal.fire({
            title: 'Apakah Yakin Dihapus?',
            text: "Tidak bisa akses data lagi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/media/delete-media/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire(
                        'Deleted!',
                        'Data Disposisi berhasil dihapus.',
                        'success'
                    );
                    setMedia((prev) => prev.filter((item) => item._id != id));
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'Gagal Mengahapus Disposisi.',
                        'error'
                    );
                }
            }
        });
    };

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleFileSelect = (e) => {
        const file = e.files[0];
        handleChange("file", file);
    };


    // ==================== AGENDA HANDLERS ====================
    const handleToggleMode = (modeId) => {
        setAgendaSettings({
            ...agendaSettings,
            modes: agendaSettings.modes.map(mode =>
                mode.id === modeId ? { ...mode, enabled: !mode.enabled } : mode
            )
        });
    };

    const handleModeDurationChange = (modeId, duration) => {
        setAgendaSettings({
            ...agendaSettings,
            modes: agendaSettings.modes.map(mode =>
                mode.id === modeId ? { ...mode, duration: parseInt(duration) } : mode
            )
        });
    };


    // ==================== SAVE AGENDA ====================
    const handleSaveAgendaSettings = async () => {
        try {
            const payload = {
                agenda_kegiatan_duration: agendaSettings.modes.find(m => m.id === 'kegiatan')?.duration,
                agenda_hariini_duration: agendaSettings.modes.find(m => m.id === 'hari_ini')?.duration,
                agenda_selesai: agendaSettings.modes.find(m => m.id === 'selesai')?.duration
            };

            await axios.post(
                'http://localhost:3000/api/media/create-duration',
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchAgendaDuration(); // 🔄 sync ulang dari DB

            alert('Pengaturan agenda berhasil disimpan');
        } catch (err) {
            console.error('Gagal menyimpan agenda', err);
            alert('Gagal menyimpan pengaturan agenda');
        }
    };


    // ==================== USE EFFECT ====================
    useEffect(() => {
        fetchMedia();              // media tetap
        fetchAgendaDuration();     // ⬅️ INI KUNCI NYA
    }, []);
    // ==================== TEMPLATE FUNCTIONS ====================
    const typeBodyTemplate = (rowData) => {
        const isImage = rowData.mimetype?.startsWith('image/');
        const isVideo = rowData.mimetype?.startsWith('video/');

        return (
            <Chip
                label={isImage ? 'Gambar' : 'Video'}
                icon={isImage ? 'pi pi-image' : 'pi pi-video'}
                style={{
                    backgroundColor: isImage ? '#E3F2FD' : '#FFF3E0',
                    color: isImage ? '#1976D2' : '#F57C00'
                }}
            />
        );
    };


    const durationBodyTemplate = (rowData) => {
        return (
            <span>
                <i className="pi pi-clock mr-2"></i>
                {rowData.duration} menit
            </span>
        );
    };



    const actionBodyTemplate = (rowData) => {
        console.log(rowData._id);
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger p-button-text"
                    onClick={() => handleDeleteMedia(rowData._id)}
                    tooltip="Hapus"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    // ==================== CALCULATIONS ====================
    const totalDuration = media.reduce((sum, item) => sum + item.duration, 0);
    const activeModes = agendaSettings.modes.filter(m => m.enabled);
    // const totalAgendaDuration = activeModes.reduce((sum, mode) => sum + mode.duration, 0);

    // ==================== RENDER ====================
    return (
        <Box sx={{ p: 3 }}>
            <MainCard title={
                <Typography variant="h3" component="div">
                    Dashboard Admin TV Display
                </Typography>
            }>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Kelola konten yang ditampilkan di layar TV
                </Typography>

                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    {/* Kelola Media */}
                    <TabPanel header="Kelola Media" leftIcon="pi pi-image mr-2">
                        {/* Summary Cards */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        <i className="pi pi-image mr-2"></i>
                                        Total Media
                                    </Typography>
                                    <Typography variant="h3" sx={{ mt: 1, color: '#1976D2' }}>
                                        {media.length}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        <i className="pi pi-clock mr-2"></i>
                                        Total Durasi
                                    </Typography>
                                    <Typography variant="h3" sx={{ mt: 1, color: '#388E3C' }}>
                                        {totalDuration} Menit
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        <i className="pi pi-replay mr-2"></i>
                                        1 Siklus
                                    </Typography>
                                    <Typography variant="h3" sx={{ mt: 1, color: '#7B1FA2' }}>
                                        {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Kelola Media Table */}
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="m-0">Daftar Media</h3>
                                <Button
                                    label="Tambah Media"
                                    icon="pi pi-plus"
                                    onClick={() => {
                                        setShowMediaDialog(true);
                                    }}
                                    className="p-button-success"
                                />
                            </div>

                            <DataTable
                                value={media}
                                paginator
                                rows={5}
                                dataKey="_id"
                                emptyMessage="Belum ada media yang ditambahkan"
                                stripedRows
                                showGridlines
                            >
                                <Column
                                    header="No"
                                    body={(data, options) => options.rowIndex + 1}
                                    style={{ width: '60px' }}
                                />
                                <Column field="filename" header="Nama File" />
                                <Column
                                    field="mimetype"
                                    header="Tipe"
                                    body={typeBodyTemplate}
                                    style={{ width: '150px' }}
                                />
                                <Column
                                    field="duration"
                                    header="Durasi"
                                    body={durationBodyTemplate}
                                    style={{ width: '150px' }}
                                />
                                <Column
                                    header="Aksi"
                                    body={actionBodyTemplate}
                                    style={{ width: '220px' }}
                                />
                            </DataTable>
                        </Card>
                    </TabPanel>

                    {/* ==================== TAB 2: PENGATURAN AGENDA ==================== */}
                    <TabPanel header="Pengaturan Agenda" leftIcon="pi pi-calendar mr-2">
                        {/* Summary Cards */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        <i className="pi pi-list mr-2"></i>
                                        Mode Aktif
                                    </Typography>
                                    <Typography variant="h3" sx={{ mt: 1, color: '#1976D2' }}>
                                        {activeModes.length}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        <i className="pi pi-clock mr-2"></i>
                                        Total Durasi Rotasi
                                    </Typography>
                                    <Typography variant="h3" sx={{ mt: 1, color: '#388E3C' }}>
                                        {/* {Math.floor(totalAgendaDuration / 60)}:{(totalAgendaDuration % 60).toString().padStart(2, '0')} */}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        <i className="pi pi-sync mr-2"></i>
                                        Rotasi Otomatis
                                    </Typography>
                                    <Typography variant="h3" sx={{ mt: 1, color: '#7B1FA2' }}>
                                        {agendaSettings.enableRotation ? 'ON' : 'OFF'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Rotation Toggle */}
                        <Card className="mb-3">
                            <div className="flex justify-content-between align-items-center">
                                <div>
                                    <h3 className="mb-2">Rotasi Tampilan Agenda</h3>
                                    <p className="text-secondary m-0">Display akan berganti otomatis sesuai durasi yang diatur</p>
                                </div>
                                <InputSwitch
                                    checked={agendaSettings.enableRotation}
                                    onChange={(e) => setAgendaSettings({ ...agendaSettings, enableRotation: e.value })}
                                />
                            </div>
                        </Card>

                        {/* Mode Settings */}
                        <Card className="mb-3">
                            <h3 className="mb-3">Mode Tampilan</h3>
                            {agendaSettings.modes.map((mode) => (
                                <Card
                                    key={mode.id}
                                    className="mb-3"
                                    style={{
                                        backgroundColor: mode.enabled ? '#f0f9ff' : '#f5f5f5',
                                        border: mode.enabled ? `2px solid ${mode.color}` : '1px solid #e0e0e0'
                                    }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={1}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                backgroundColor: mode.color + '20',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className={`pi ${mode.icon}`} style={{
                                                    fontSize: '1.5rem',
                                                    color: mode.color
                                                }}></i>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <Typography variant="h6" sx={{ mb: 1 }}>{mode.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {mode.description}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <div className="flex align-items-center gap-2">
                                                <i className="pi pi-clock" style={{ fontSize: '1rem' }}></i>
                                                <InputNumber
                                                    value={mode.duration}
                                                    onValueChange={(e) => handleModeDurationChange(mode.id, e.value)}
                                                    disabled={!mode.enabled}
                                                    min={30}
                                                    step={30}
                                                    suffix=" detik"
                                                    style={{ width: '150px' }}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={2} sx={{ textAlign: 'right' }}>
                                            <InputSwitch
                                                checked={mode.enabled}
                                                onChange={() => handleToggleMode(mode.id)}
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))}
                        </Card>

                        {/* Alarm Settings */}
                        <Card className="mb-3">
                            <h3 className="mb-3">
                                <i className="pi pi-bell mr-2"></i>
                                Pengaturan Alarm
                            </h3>
                            <div className="p-fluid" style={{ maxWidth: '500px' }}>
                                <div className="field">
                                    <label htmlFor="alarmBefore">Alarm Sebelum Kegiatan (menit)</label>
                                    <InputNumber
                                        id="alarmBefore"
                                        value={agendaSettings.alarmBeforeMinutes}
                                        onValueChange={(e) => setAgendaSettings({ ...agendaSettings, alarmBeforeMinutes: e.value })}
                                        min={5}
                                        step={5}
                                        suffix=" menit"
                                    />
                                    <small className="text-secondary">Alarm akan berbunyi X menit sebelum kegiatan dimulai</small>
                                </div>
                            </div>
                        </Card>

                        {/* Save Button */}
                        <Button
                            label="Simpan Pengaturan Agenda"
                            icon="pi pi-save"
                            onClick={handleSaveAgendaSettings}
                            className="p-button-success p-button-lg"
                        />
                    </TabPanel>
                </TabView>
            </MainCard>

            {/* Dialog atau Pop Up Tambah Media */}
            <Dialog
                header='Tambah Media Baru'
                visible={showMediaDialog}
                style={{ width: '500px' }}
                onHide={() => {
                    setShowMediaDialog(false);
                }}
                footer={
                    <div>
                        <Button
                            label="Batal"
                            icon="pi pi-times"
                            onClick={() => {
                                setShowMediaDialog(false);
                            }}
                            className="p-button-text"
                        />
                        <Button
                            label='Tambah'
                            icon="pi pi-check"
                            onClick={handleAddMedia}
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="duration">Durasi Tampilan (menit)</label>
                        <InputNumber
                            id="duration"
                            value={form.duration}
                            onChange={(e) => handleChange("duration", e.value)}
                            min={1}
                            placeholder="Contoh: 10"
                        />
                        <small className="text-secondary">Berapa lama media ini akan ditampilkan</small>
                    </div>


                    <div className="field">
                        <label>Upload File</label>
                        <FileUpload
                            mode="basic"
                            accept="image/*,video/*"
                            maxFileSize={50000000}
                            chooseLabel="Pilih File"
                            onSelect={(e) => handleFileSelect(e)}
                            auto={false}
                        />
                        <small className="text-secondary">Maksimal ukuran file: 50MB</small>
                    </div>
                </div>
            </Dialog>
            {/* End Dialog Tambah Media */}
        </Box>
    );
}