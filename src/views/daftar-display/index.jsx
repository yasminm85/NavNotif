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
    const [pageTitle, setPageTitle] = useState("Agenda Keseluruhan");
    const rows = 5;
    const scrollSpeed = 3000;

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

        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);

        return data.filter(item => {
            const tanggal = new Date(item.tanggal);
            
            tanggal.setHours(0, 0, 0, 0);

            if (!(tanggal >= today && tanggal <= threeDaysLater)) {
                return false;
            }

            if (tanggal.getTime() !== today.getTime()) {
                return true;
            }

            let selesai = null;

            if (item.jam_selesai && !isNaN(Date.parse(item.jam_selesai))) {
                selesai = new Date(item.jam_selesai);
            }

            else if (typeof item.jam_selesai === "string" && item.jam_selesai.trim() !== "") {
                const jamFix = item.jam_selesai.replace(/\./g, ":");
                const [hh, mm] = jamFix.split(":");
                selesai = new Date(item.tanggal);
                selesai.setHours(hh || 0, mm || 0, 0, 0);
            }

            else {
                return true;
            }

            if (selesai < now) {
                return false;
            }

            return true;
        });
    };

    // ---------------------------- STATUS ROW ----------------------------
    const isOngoing = (item) => {
        const now = new Date();
        const start = new Date(item.jam_mulai);

        let end;
        if (item.jam_selesai && item.jam_selesai !== "Selesai") {
            end = new Date(item.jam_selesai);
        } else {

            end = new Date(item.jam_mulai);
            end.setHours(23, 59, 0, 0);
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
            const reminders = checkReminderActive(items);

            if (reminders.length > 0) {
                setPageTitle("AGENDA KEGIATAN HARI INI");
                setShowDisposisi(sortNormal(reminders));

               const newReminders = reminders.filter(r => !playedReminders.includes(r._id));

               newReminders.forEach(item => {
                    triggerAlarm(item);
                });

            } else {
                setPageTitle("AGENDA KEGIATAN ");
                setShowDisposisi(sortNormal(items));
            }

        } catch (err) {
            console.error("Error mengambil data disposisi", err);
        }
        setLoading(false);
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
