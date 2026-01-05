// TVDisplayAdmin.js
// Copy file ini ke project React Anda

import React, { useState } from 'react';
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
import { Box, Grid, Typography, Paper } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// Import PrimeReact CSS - pastikan ini ada di index.js atau App.js
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function TVDisplayAdmin() {
    const [activeIndex, setActiveIndex] = useState(0);
    
    // ==================== MEDIA STATE ====================
    const [media, setMedia] = useState([
        { id: 1, type: 'image', name: 'banner-1.jpg', url: '/placeholder-image.jpg', duration: 10 },
        { id: 2, type: 'video', name: 'promo.mp4', url: '/placeholder-video.mp4', duration: 15 },
        { id: 3, type: 'image', name: 'info-grafis.png', url: '/placeholder-image.jpg', duration: 8 }
    ]);
    const [showMediaDialog, setShowMediaDialog] = useState(false);
    const [editingMedia, setEditingMedia] = useState(null);
    const [newMedia, setNewMedia] = useState({
        type: 'image',
        name: '',
        duration: 5,
        file: null
    });

    // ==================== AGENDA SETTINGS STATE ====================
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

    const mediaTypes = [
        { label: 'Gambar (JPG, PNG, GIF)', value: 'image' },
        { label: 'Video (MP4, WebM)', value: 'video' }
    ];

    // ==================== MEDIA HANDLERS ====================
    const handleAddMedia = () => {
        if (newMedia.name && newMedia.duration) {
            const mediaItem = {
                id: Date.now(),
                type: newMedia.type,
                name: newMedia.name,
                url: newMedia.type === 'image' ? '/placeholder-image.jpg' : '/placeholder-video.mp4',
                duration: parseInt(newMedia.duration),
                file: newMedia.file
            };
            setMedia([...media, mediaItem]);
            
            // TODO: Upload file ke server
            // if (newMedia.file) {
            //     const formData = new FormData();
            //     formData.append('file', newMedia.file);
            //     formData.append('type', newMedia.type);
            //     formData.append('duration', newMedia.duration);
            //     axios.post('/api/media/upload', formData);
            // }
            
            resetMediaForm();
            setShowMediaDialog(false);
        }
    };

    const handleEditMedia = (item) => {
        setEditingMedia(item);
        setNewMedia({
            type: item.type,
            name: item.name,
            duration: item.duration,
            file: null
        });
        setShowMediaDialog(true);
    };

    const handleUpdateMedia = () => {
        if (editingMedia && newMedia.name && newMedia.duration) {
            setMedia(media.map(m => 
                m.id === editingMedia.id 
                    ? { ...m, name: newMedia.name, duration: parseInt(newMedia.duration) }
                    : m
            ));
            
            // TODO: Update media di server
            // axios.put(`/api/media/${editingMedia.id}`, {
            //     name: newMedia.name,
            //     duration: newMedia.duration
            // });
            
            resetMediaForm();
            setShowMediaDialog(false);
        }
    };

    const handleDeleteMedia = (id) => {
        if (window.confirm('Yakin ingin menghapus media ini?')) {
            setMedia(media.filter(m => m.id !== id));
            
            // TODO: Delete media dari server
            // axios.delete(`/api/media/${id}`);
        }
    };

    const resetMediaForm = () => {
        setEditingMedia(null);
        setNewMedia({ type: 'image', name: '', duration: 5, file: null });
    };

    const moveMediaUp = (rowData) => {
        const index = media.findIndex(m => m.id === rowData.id);
        if (index > 0) {
            const newMedia = [...media];
            [newMedia[index - 1], newMedia[index]] = [newMedia[index], newMedia[index - 1]];
            setMedia(newMedia);
            
            // TODO: Update urutan di server
            // axios.put('/api/media/reorder', { media: newMedia });
        }
    };

    const moveMediaDown = (rowData) => {
        const index = media.findIndex(m => m.id === rowData.id);
        if (index < media.length - 1) {
            const newMedia = [...media];
            [newMedia[index], newMedia[index + 1]] = [newMedia[index + 1], newMedia[index]];
            setMedia(newMedia);
            
            // TODO: Update urutan di server
            // axios.put('/api/media/reorder', { media: newMedia });
        }
    };

    const handleFileSelect = (e) => {
        if (e.files && e.files[0]) {
            setNewMedia({
                ...newMedia,
                file: e.files[0],
                name: e.files[0].name
            });
        }
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

    const handleSaveAgendaSettings = () => {
        console.log('Saving agenda settings:', agendaSettings);
        
        // TODO: Implement API call to save settings
        // axios.put('/api/agenda-settings', agendaSettings)
        //     .then(response => {
        //         alert('Pengaturan agenda berhasil disimpan!');
        //     })
        //     .catch(error => {
        //         alert('Gagal menyimpan pengaturan!');
        //     });
        
        alert('Pengaturan agenda berhasil disimpan!');
    };

    // ==================== TEMPLATE FUNCTIONS ====================
    const typeBodyTemplate = (rowData) => {
        return (
            <Chip 
                label={rowData.type === 'image' ? 'Gambar' : 'Video'} 
                icon={rowData.type === 'image' ? 'pi pi-image' : 'pi pi-video'}
                style={{ 
                    backgroundColor: rowData.type === 'image' ? '#E3F2FD' : '#FFF3E0',
                    color: rowData.type === 'image' ? '#1976D2' : '#F57C00'
                }}
            />
        );
    };

    const durationBodyTemplate = (rowData) => {
        return (
            <span>
                <i className="pi pi-clock mr-2"></i>
                {rowData.duration} detik
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => {
        const index = media.findIndex(m => m.id === rowData.id);
        return (
            <div className="flex gap-2">
                <Button 
                    icon="pi pi-arrow-up" 
                    className="p-button-sm p-button-text p-button-secondary"
                    onClick={() => moveMediaUp(rowData)}
                    disabled={index === 0}
                    tooltip="Pindah ke atas"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button 
                    icon="pi pi-arrow-down" 
                    className="p-button-sm p-button-text p-button-secondary"
                    onClick={() => moveMediaDown(rowData)}
                    disabled={index === media.length - 1}
                    tooltip="Pindah ke bawah"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-sm p-button-info p-button-text"
                    onClick={() => handleEditMedia(rowData)}
                    tooltip="Edit"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-sm p-button-danger p-button-text"
                    onClick={() => handleDeleteMedia(rowData.id)}
                    tooltip="Hapus"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    // ==================== CALCULATIONS ====================
    const totalDuration = media.reduce((sum, item) => sum + item.duration, 0);
    const activeModes = agendaSettings.modes.filter(m => m.enabled);
    const totalAgendaDuration = activeModes.reduce((sum, mode) => sum + mode.duration, 0);

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
                    {/* ==================== TAB 1: KELOLA MEDIA ==================== */}
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
                                        {totalDuration} detik
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

                        {/* Media Table */}
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="m-0">Daftar Media</h3>
                                <Button 
                                    label="Tambah Media" 
                                    icon="pi pi-plus" 
                                    onClick={() => {
                                        resetMediaForm();
                                        setShowMediaDialog(true);
                                    }}
                                    className="p-button-success"
                                />
                            </div>

                            <DataTable 
                                value={media} 
                                dataKey="id"
                                emptyMessage="Belum ada media yang ditambahkan"
                                stripedRows
                                showGridlines
                            >
                                <Column 
                                    header="#" 
                                    body={(data, options) => options.rowIndex + 1}
                                    style={{ width: '60px' }}
                                />
                                <Column field="name" header="Nama File" />
                                <Column 
                                    field="type" 
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
                                        {Math.floor(totalAgendaDuration / 60)}:{(totalAgendaDuration % 60).toString().padStart(2, '0')}
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
                                    onChange={(e) => setAgendaSettings({...agendaSettings, enableRotation: e.value})}
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
                                        onValueChange={(e) => setAgendaSettings({...agendaSettings, alarmBeforeMinutes: e.value})}
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

            {/* ==================== DIALOG ADD/EDIT MEDIA ==================== */}
            <Dialog
                header={editingMedia ? 'Edit Media' : 'Tambah Media Baru'}
                visible={showMediaDialog}
                style={{ width: '500px' }}
                onHide={() => {
                    setShowMediaDialog(false);
                    resetMediaForm();
                }}
                footer={
                    <div>
                        <Button 
                            label="Batal" 
                            icon="pi pi-times" 
                            onClick={() => {
                                setShowMediaDialog(false);
                                resetMediaForm();
                            }}
                            className="p-button-text"
                        />
                        <Button 
                            label={editingMedia ? 'Update' : 'Tambah'} 
                            icon="pi pi-check" 
                            onClick={editingMedia ? handleUpdateMedia : handleAddMedia}
                            disabled={!newMedia.name || !newMedia.duration}
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="type">Tipe Media</label>
                        <Dropdown
                            id="type"
                            value={newMedia.type}
                            options={mediaTypes}
                            onChange={(e) => setNewMedia({...newMedia, type: e.value})}
                            disabled={editingMedia !== null}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="duration">Durasi Tampilan (detik)</label>
                        <InputNumber
                            id="duration"
                            value={newMedia.duration}
                            onValueChange={(e) => setNewMedia({...newMedia, duration: e.value})}
                            min={1}
                            placeholder="Contoh: 10"
                        />
                        <small className="text-secondary">Berapa lama media ini akan ditampilkan</small>
                    </div>

                    {!editingMedia && (
                        <div className="field">
                            <label>Upload File</label>
                            <FileUpload
                                mode="basic"
                                name="file"
                                accept="image/*,video/*"
                                maxFileSize={50000000}
                                chooseLabel="Pilih File"
                                onSelect={handleFileSelect}
                                auto={false}
                            />
                            <small className="text-secondary">Maksimal ukuran file: 50MB</small>
                        </div>
                    )}
                </div>
            </Dialog>
        </Box>
    );
}