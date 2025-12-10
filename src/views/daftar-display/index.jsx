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

export default function Disposisi() {
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [showDisposisi, setShowDisposisi] = useState([]);
    const [activeReminderItem, setActiveReminderItem] = useState(null);
    const rows = 5; 
    const scrollSpeed = 3000; 
    const [pageTitle, setPageTitle] = useState("Agenda Keseluruhan");

    // ---------------------------- CHECK REMINDER ----------------------------
    const checkReminderActive = (items) => {
        const now = new Date();
        let reminderItem = null;

        items.forEach(item => {
            const start = new Date(item.jam_mulai);

            const reminderStart = new Date(start);
            reminderStart.setMinutes(reminderStart.getMinutes() - 30); // mulai 30 menit sebelum

            const reminderEnd = new Date(reminderStart);
            reminderEnd.setMinutes(reminderEnd.getMinutes() + 10); // tampil selama 10 menit

            if (now >= reminderStart && now < reminderEnd) {
                reminderItem = item;
            }
        });

        return reminderItem;
    };

    // ---------------------------- FILTER VALID ITEMS ----------------------------
    const filterValidItems = (data) => {
    const now = new Date();
    const today = new Date(now.toDateString());
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    return data.filter(item => {
        const start = new Date(item.jam_mulai);
        const tanggal = new Date(item.tanggal);

        let end = null;
        if (item.jam_selesai && item.jam_selesai !== "Selesai") {
            end = new Date(item.jam_selesai);
        } else {
            end = new Date(tanggal); 
            end.setHours(23, 59, 0, 0); 
        }

        if (end < now) return false;

        if (tanggal < today && end < now) return false;

        if (start <= now && end >= now) return true;

        if (tanggal >= today && tanggal <= threeDaysLater) return true;

        return false;
    });
};


    // ---------------------------- STATUS ROW ----------------------------
    const isOngoing = (item) => {
        const now = new Date();
        const start = new Date(item.jam_mulai);
        const end = new Date(item.jam_selesai);
        return now >= start && now <= end;
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
            const reminder = checkReminderActive(items);

            if (reminder) {
                setActiveReminderItem(reminder);
                setPageTitle("Agenda Kegiatan Hari Ini");
                setShowDisposisi([reminder]);
            } else {
                setActiveReminderItem(null);
                setPageTitle("Agenda Keseluruhan");
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
        getDataDisposisi(); // load pertama
        const interval = setInterval(() => {
            getDataDisposisi(); // update reminder / display normal
        }, 10000); // cek tiap 10 detik

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
            </span>}>
                <DataTable
                    value={showDisposisi}
                    loading={loading}
                    rows={rows}
                    paginator={false}        
                    scrollable
                    scrollHeight="430px"    
                    dataKey="_id"
                    rowClassName={(row) => {
                        if (isOngoing(row)) return "row-ongoing"; // biru
                        if (activeReminderItem && row._id === activeReminderItem._id) return "row-reminder"; // hijau
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
