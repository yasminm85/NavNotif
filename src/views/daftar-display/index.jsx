// project imports
import React, { useState, useEffect, useRef } from 'react';
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
    const playedRemindersRef = useRef([]);
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
    const [agendaSelesaiFilter, setAgendaSelesaiFilter] = useState({
        startDate: null,
        endDate: null
    });

    // ---------------------------- CHECK REMINDER ----------------------------
    const checkReminderActive = (items) => {
        const now = new Date();
        const activeReminders = [];

        items.forEach(item => {
            const start = new Date(item.jam_mulai);
            if (isNaN(start.getTime())) return;

            const reminderStart = new Date(start);
            reminderStart.setMinutes(reminderStart.getMinutes() - 30);

            const reminderEnd = new Date(start);
            reminderEnd.setMinutes(reminderEnd.getMinutes() - 25);

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
            if (!item.tanggal) return { ...item, isSelesai: false };

            const getValidDate = (val, baseDate) => {
                if (!val || val === "-" || val.toLowerCase() === "selesai") return null;
                const d = new Date(val);
                if (!isNaN(d.getTime())) return d;
                return null;
            };

            const agendaDate = new Date(item.tanggal);
            agendaDate.setHours(0, 0, 0, 0);
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            if (agendaDate < today) {
                selesai = true;
            }
            else if (agendaDate.getTime() === today.getTime()) {
                const endTime = getValidDate(item.jam_selesai, item.tanggal) ||
                    getValidDate(item.jam_mulai, item.tanggal);

                if (endTime) {
                    selesai = now > endTime;
                }
            }
            return { ...item, isSelesai: selesai };
        });
    };

    // ---------------------------- STATUS ROW ----------------------------
    const isOngoing = (item) => {
        if (!item.tanggal || !item.jam_mulai) return false;
        const now = new Date();

        const getValidDate = (val, baseDate, takeFirst = true) => {
            if (!val || val === "-" || val.toLowerCase() === "selesai") return null;
            const d = new Date(val);
            if (!isNaN(d.getTime())) return d;

            try {
                const partsStr = val.split('-');
                const timePart = takeFirst ? partsStr[0].trim() : partsStr[partsStr.length - 1].trim();
                const parts = timePart.replace(/\./g, ":").split(":");
                const finalDate = new Date(baseDate);
                finalDate.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
                return finalDate;
            } catch (e) { return null; }
        };

        const start = getValidDate(item.jam_mulai, item.tanggal, true);
        const end = getValidDate(item.jam_selesai, item.tanggal, false) ||
            getValidDate(item.jam_mulai, item.tanggal, false);

        if (!start || !end) return false;
        return now >= start && now <= end;
    };

    // ---------------------------- ALARM AUDIO ----------------------------
    const [playedReminders, setPlayedReminders] = useState([]);

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

        if (playedRemindersRef.current.includes(item._id)) {
            return;
        }

        playAlarmSound();

        playedRemindersRef.current.push(item._id);

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

            );

            const items = filterValidItems(response.data);

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

            const selesai = items.filter(item => {
                if (!item.isSelesai) return false;
                if (!agendaSelesaiFilter.startDate || !agendaSelesaiFilter.endDate) return false;

                const tgl = new Date(item.tanggal);
                tgl.setHours(0, 0, 0, 0);

                return (
                    tgl >= agendaSelesaiFilter.startDate &&
                    tgl <= agendaSelesaiFilter.endDate
                );
            });


            setAgendaKegiatan(sortNormal(kegiatan));
            setAgendaSelesai(sortNormal(selesai));

            if (reminders.length > 0) {
                setMode(MODE.TODAY);
                setPageTitle("AGENDA KEGIATAN HARI INI");
                setShowDisposisi(sortNormal(reminders));

                const newReminders = reminders.filter(
                    r => !playedReminders.includes(r._id)
                );
                newReminders.forEach(item => triggerAlarm(item));
                // return; 
            } else {
                setHasActiveReminder(false);

                // ⬇️ INI KUNCI NYA
                setMode(prevMode => {
                    if (prevMode === MODE.TODAY) {
                        setPageTitle("AGENDA KEGIATAN");
                        setShowDisposisi(sortNormal(kegiatan));
                        return MODE.KEGIATAN;
                    }
                    return prevMode;
                });
            }


        } catch (err) {
            console.error("Error mengambil data disposisi", err);
        } finally {
            setLoading(false);
        }
    };

    // ===================== AMBIL FILTER DARI KELOLA DISPLAY =====================
    const getDisplayDuration = async () => {
        try {
            const res = await axios.get(
                'http://localhost:3000/api/media/get-duration'
            );

            if (!res.data?.agenda_selesai_start || !res.data?.agenda_selesai_end) return;

            const start = new Date(res.data.agenda_selesai_start);
            const end = new Date(res.data.agenda_selesai_end);

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);

            setAgendaSelesaiFilter({ startDate: start, endDate: end });

        } catch (err) {
            console.error('Gagal ambil filter agenda selesai', err);
        }
    };

    // ===================== INIT =====================
    useEffect(() => {
        getDisplayDuration();
    }, []);

    // 🔑 AMBIL DATA SETELAH FILTER SIAP
    useEffect(() => {
        if (!agendaSelesaiFilter.startDate) return;

        getDataDisposisi();
        const interval = setInterval(getDataDisposisi, 10000);

        return () => clearInterval(interval);
    }, [agendaSelesaiFilter]);


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
                        if (mode === MODE.SELESAI) {
                            return row.laporan_status === "SUDAH" ? "row-laporan-sudah" : "row-laporan-belum";
                        }

                        const now = new Date();
                        const agendaDate = new Date(row.tanggal);

                        if (agendaDate.toDateString() !== now.toDateString()) {
                            return "";
                        }

                        const startTimeStr = row.jam_mulai?.split('-')[0].trim().replace(/\./g, ":");
                        if (startTimeStr) {
                            try {
                                const start = new Date(row.jam_mulai);

                                const reminderStart = new Date(start.getTime());
                                reminderStart.setMinutes(reminderStart.getMinutes() - 30);
                                const reminderEnd = new Date(reminderStart);
                                reminderEnd.setMinutes(reminderEnd.getMinutes() + 5);

                                if (now >= reminderStart && now < reminderEnd) {
                                    return "row-reminder";
                                }
                            } catch (e) { }
                        }

                        if (isOngoing(row)) return "row-ongoing";

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
