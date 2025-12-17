// project imports
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './appDisplay.css';
import alarmSound from './alarm-sound.mp3';

export default function Disposisi() {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [showDisposisi, setShowDisposisi] = useState([]);
    const [pageTitle, setPageTitle] = useState("AGENDA KEGIATAN");

    const rows = 5;
    const scrollSpeed = 3000;
    const MODE = {
        TODAY: 'TODAY',
        KEGIATAN: 'KEGIATAN',
        SELESAI: 'SELESAI'
    };

    const [mode, setMode] = useState(MODE.KEGIATAN);

    const [agendaKegiatan, setAgendaKegiatan] = useState([]);
    const [agendaSelesai, setAgendaSelesai] = useState([]);
    const [hasActiveReminder, setHasActiveReminder] = useState(false);

    // ---------------------------- CHECK REMINDER ----------------------------
const checkReminderActive = (items) => {
    const now = new Date();
    const activeReminders = [];

    items.forEach(item => {
        if (!item.jam_mulai || !item.tanggal) return;

        const [hh, mm] = item.jam_mulai.replace(/\./g, ":").split(":");
        const start = new Date(item.tanggal);
        start.setHours(Number(hh), Number(mm), 0, 0);

        const reminderStart = new Date(start);
        reminderStart.setMinutes(reminderStart.getMinutes() - 30);

        const reminderEnd = new Date(start); // sampai jam_mulai

        if (now >= reminderStart && now < reminderEnd) {
            activeReminders.push(item);
        }
    });

    return activeReminders;
};


    // ---------------------------- FILTER VALID ITEMS ----------------------------
    const filterValidItems = (data) => {
        const now = new Date();

        return data.map(item => {
            let selesai = false;

            if (item.jam_selesai) {
                const endTime = new Date(item.jam_selesai);
                const hh = endTime.getHours();
                const mm = endTime.getMinutes();

                const end = new Date(item.tanggal);
                end.setHours(hh, mm, 0, 0);

                selesai = end.getTime() < now.getTime();
            }

            else if (item.jam_selesai && item.tanggal) {
                const jamFix = item.jam_selesai.replace(/\./g, ":");
                const [hh, mm] = jamFix.split(":");

                const tanggalFix = new Date(item.tanggal);
                tanggalFix.setHours(0, 0, 0, 0);

                const end = new Date(tanggalFix);
                end.setHours(Number(hh), Number(mm), 0, 0);

                selesai = end.getTime() < now.getTime();
            }

            return {
                ...item,
                isSelesai: selesai
            };
        });
    };

    // ---------------------------- STATUS ROW ----------------------------
    const isOngoing = (item) => {
        const now = new Date();

        const startFix = item.jam_mulai.replace(/\./g, ":");
        const [sh, sm] = startFix.split(":");

        const start = new Date(item.tanggal);
        start.setHours(sh, sm, 0, 0);

        let end;
        if (item.jam_selesai && item.jam_selesai !== "Selesai") {
            const endFix = item.jam_selesai.replace(/\./g, ":");
            const [eh, em] = endFix.split(":");

            end = new Date(item.tanggal);
            end.setHours(eh, em, 0, 0);
        } else {
            end = new Date(item.tanggal);
            end.setHours(23, 59, 59, 0);
        }

        return now >= start && now <= end;
    };

    // ---------------------------- ALARM AUDIO ----------------------------
    const [playedReminders, setPlayedReminders] = useState([]);
    const [alarmHistory, setAlarmHistory] = useState({});

    const playAlarmSound = () => {
        const audio = new Audio(alarmSound);

        audio.play().catch(err => console.log("Audio play error:", err));

        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 10000);
    };

    const triggerAlarm = (item) => {

        const now = new Date();
        const lastPlayed = alarmHistory[item._id];

        if (lastPlayed && (now - new Date(lastPlayed) < 10 * 60 * 1000)) {
            return; 
        }

        playAlarmSound();

        setAlarmHistory(prev => ({
            ...prev,
            [item._id]: now
        }));

        setPlayedReminders(prev => {
            const updated = [...prev, item._id];
            localStorage.setItem("playedReminders", JSON.stringify(updated));
            return updated;
        });

    };

    // ---------------------------- GET DATA ----------------------------
    const getDataDisposisi = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                'http://localhost:3000/api/task/disposisi',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const items = filterValidItems(response.data);
            console.table(
                items.map(i => ({
                    kegiatan: i.nama_kegiatan,
                    tanggal: i.tanggal,
                    jam_selesai: i.jam_selesai,
                    isSelesai: i.isSelesai
                }))
            );

            const reminders = checkReminderActive(items);

            const kegiatan = items.filter(item => {
                if (item.isSelesai) return false;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const threeDaysLater = new Date(today);
                threeDaysLater.setDate(today.getDate() + 3);

                const tanggal = new Date(item.tanggal);
                tanggal.setHours(0, 0, 0, 0);

                return tanggal >= today && tanggal <= threeDaysLater;
            });

            const selesai = items.filter(i => i.isSelesai);

            setAgendaKegiatan(sortNormal(kegiatan));
            setAgendaSelesai(sortNormal(selesai));

            if (reminders.length > 0) {
                setHasActiveReminder(true);
                setMode(MODE.TODAY);
                setPageTitle("AGENDA KEGIATAN HARI INI");
                setShowDisposisi(sortNormal(reminders));

                const newReminders = reminders.filter(
                    r => !playedReminders.includes(r._id)
                );
                newReminders.forEach(item => triggerAlarm(item));

                return;
            }

            // ❗️JIKA TIDAK ADA REMINDER
            setHasActiveReminder(false);


            if (mode === MODE.TODAY) {
                setMode(MODE.KEGIATAN);
            }

        } catch (err) {
            console.error("Error mengambil data disposisi", err);
        } finally {
            setLoading(false);
        }
    };

    // ---------------------------- FORMATTER ----------------------------
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

    // ---------------------------- AUTO SCROLL ----------------------------
    useEffect(() => {
        if (!showDisposisi || showDisposisi.length <= rows) return;

        const interval = setInterval(() => {
            setShowDisposisi(prev => {
                if (!prev || prev.length <= rows) return prev;
                const list = [...prev];
                const firstItem = list.shift();
                list.push(firstItem);
                return list;
            });
        }, scrollSpeed);

        return () => clearInterval(interval);
    }, [showDisposisi]);

    // ---------------------------- AUTO UPDATE DATA ----------------------------
    useEffect(() => {
        const saved = localStorage.getItem("playedReminders");
        if (saved) {
            setPlayedReminders(JSON.parse(saved));
        }

        getDataDisposisi(); 
        const interval = setInterval(() => {
            getDataDisposisi(); 
        }, 10000); 

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (mode === MODE.TODAY) return;

        const duration =
            mode === MODE.KEGIATAN
                ? 2 * 60 * 1000   
                : 2 * 60 * 1000; 

        const timer = setTimeout(() => {
            setMode(prev =>
                prev === MODE.KEGIATAN ? MODE.SELESAI : MODE.KEGIATAN
            );
        }, duration);

        return () => clearTimeout(timer);
    }, [mode]);

    useEffect(() => {
        if (mode === MODE.KEGIATAN) {
            setPageTitle("AGENDA KEGIATAN");
            setShowDisposisi(agendaKegiatan);
        }

        if (mode === MODE.SELESAI) {
            setPageTitle("AGENDA SELESAI");
            setShowDisposisi(agendaSelesai);
        }
    }, [mode, agendaKegiatan, agendaSelesai]);

    // ---------------------------- SORT NORMAL ----------------------------
    const sortNormal = (items) => {
        return items.sort((a, b) => new Date(a.jam_mulai) - new Date(b.jam_mulai));
    };

    // ---------------------------- RENDER ----------------------------
    return (
        <div className="card">
            <MainCard title={
                <span style={{ textAlign: 'center', display: 'block', fontSize: '24px', fontWeight: 'bold' }}>
                    {pageTitle}
                </span>
            }>
                <DataTable
                    value={showDisposisi}
                    loading={loading}   
                    rows={rows}
                    paginator={false}
                    scrollable
                    scrollHeight="430px"
                    dataKey="_id"
                    rowClassName={(row) => {
                        // AGENDA SELESAI
                        if (mode === MODE.SELESAI) {
                            if (row.laporan_isi === true || row.status_laporan === "SUDAH") {
                                return "row-laporan-sudah"; // hijau
                            }
                            return "row-laporan-belum"; // kuning
                        }

                        if (isOngoing(row)) return "row-ongoing";

                        const now = new Date();
                        if (row.jam_mulai) {
                            const startFix = row.jam_mulai.replace(/\./g, ":");
                            const [hh, mm] = startFix.split(":");

                            const start = new Date(row.tanggal);
                            start.setHours(hh, mm, 0, 0);

                            const reminderStart = new Date(start);
                            reminderStart.setMinutes(reminderStart.getMinutes() - 30);

                            const reminderEnd = new Date(reminderStart);
                            reminderEnd.setMinutes(reminderEnd.getMinutes() + 10);

                            if (now >= reminderStart && now < reminderEnd) {
                                return "row-reminder";
                            }
                        }

                        return "";
                    }}

                >
                    <Column field="nama_kegiatan" header="Nama Kegiatan" />
                    <Column
                        header="Nama Pegawai"
                        body={(row) =>
                            row.nama_yang_dituju && row.nama_yang_dituju.length > 0
                                ? row.nama_yang_dituju.map(p => p.name).join(", ")
                                : "-"
                        }
                    />
                    <Column field="tanggal" header="Tanggal" body={(row) => formDate(row.tanggal)} />
                    <Column header="Jam" body={(row) => `${formTime(row.jam_mulai)} - ${formTime(row.jam_selesai)}`} />
                    <Column field="tempat" header="Tempat" />
                </DataTable>
            </MainCard>
        </div>
    );  
}
