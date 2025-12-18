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
            const start = new Date(item.jam_mulai);

            const reminderStart = new Date(start);
            reminderStart.setMinutes(reminderStart.getMinutes() - 30); 

            const reminderEnd = new Date(reminderStart);
            reminderEnd.setMinutes(reminderEnd.getMinutes() + 10);

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

            if (!item.tanggal) {
                return { ...item, isSelesai: false };
            }

            const agendaDate = new Date(item.tanggal);
            agendaDate.setHours(0, 0, 0, 0);

            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            // 🔴 TANGGAL SUDAH LEWAT
            if (agendaDate < today) {
                selesai = true;
            }

            // 🟡 TANGGAL HARI INI → CEK JAM SELESAI
            else if (agendaDate.getTime() === today.getTime()) {

                // ada jam_selesai valid
                if (
                    item.jam_selesai &&
                    item.jam_selesai !== "-" &&
                    item.jam_selesai.toLowerCase() !== "selesai"
                ) {
                    const [hh, mm] = item.jam_selesai.replace(/\./g, ":").split(":").map(Number);
                    const end = new Date(item.tanggal);
                    end.setHours(hh, mm, 0, 0);

                    selesai = now > end;
                }

                // jam_selesai kosong → selesai akhir hari
                else {
                    const endOfDay = new Date(item.tanggal);
                    endOfDay.setHours(23, 59, 59, 999);
                    selesai = now > endOfDay;
                }
            }

            return {
                ...item,
                isSelesai: selesai
            };
        });
    };

    // ---------------------------- STATUS ROW ----------------------------
    const isOngoing = (item) => {
        if (!item.tanggal || !item.jam_mulai) return false;

        const now = new Date();

            const itemDate = new Date(item.tanggal); // <<< GANTI DI SINI
        if (!itemDate) return false;

        // START
        const [sh, sm] = item.jam_mulai.replace(/\./g, ":").split(":").map(Number);
        const start = new Date(item.tanggal);
        start.setHours(sh, sm, 0, 0);

        // END
        let end;
        if (
            item.jam_selesai &&
            item.jam_selesai !== "-" &&
            item.jam_selesai.toLowerCase() !== "selesai"
        ) {
            const [eh, em] = item.jam_selesai.replace(/\./g, ":").split(":").map(Number);
            end = new Date(item.tanggal);
            end.setHours(eh, em, 0, 0);
        } else {
            end = new Date(item.tanggal);
            end.setHours(23, 59, 59, 999);
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

     const getFinishedItems = (items) => {
        const now = new Date();
        return items.filter(item => {
            let selesai;

            if (item.jam_selesai && !isNaN(Date.parse(item.jam_selesai))) {
                selesai = new Date(item.jam_selesai);
            } else {
                selesai = new Date(item.jam_mulai);
                selesai.setHours(23, 59, 0, 0);
            }

            return selesai < now;
        });
    };

    const getItemsValid = (items) => {
        const now = new Date();
        return items.filter(item => {
            const start = new Date(item.jam_mulai);

            let selesai;
            if (item.jam_selesai && !isNaN(Date.parse(item.jam_selesai))) {
                selesai = new Date(item.jam_selesai);
            } else {
                selesai = new Date(item.jam_mulai);
                selesai.setHours(23, 59, 0, 0);
            }

            return selesai >= now;
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
            const reminders = checkReminderActive(items);

            const itemsValid = getItemsValid(items);
            const finished = getFinishedItems(items);

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
                // setHasActiveReminder(true);
                // setMode(MODE.TODAY);
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
        if (mode === MODE.TODAY) {
            setPageTitle("AGENDA KEGIATAN HARI INI");
            // showDisposisi SUDAH di-set dari reminders
            return;
        }

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
                    // ================== AGENDA SELESAI ==================
                    if (mode === MODE.SELESAI) {
                        if (row.laporan_status === "SUDAH") {
                            return "row-laporan-sudah";   // 🟢 Hijau
                        }
                        return "row-laporan-belum";       // 🟡 Kuning
                    }

                    const now = new Date();
                        const start = new Date(row.jam_mulai);
                        const reminderStart = new Date(start);
                        reminderStart.setMinutes(reminderStart.getMinutes() - 30);
                        const reminderEnd = new Date(reminderStart);
                        reminderEnd.setMinutes(reminderEnd.getMinutes() + 10);

                        if (isOngoing(row)) return "row-ongoing"; // biru
                        if (now >= reminderStart && now < reminderEnd) return "row-reminder"; // hijau
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
