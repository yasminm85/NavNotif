import React, { useEffect, useState, useRef } from 'react';
import Grid from '@mui/material/Grid2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TotalNotifikasi from './TotalNotifikasi';
import TotalSelesai from './TotalSelesai';
import { gridSpacing } from 'store/constant';
import axios from 'axios';


// ==============================|| DASHBOARD PEGAWAI ||============================== //

export default function DashboardPegawai() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');
  const shownToastIds = useRef(new Set());


  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/notif/notification/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Error get notifications:', err.response?.data || err.message);
    }
  };

  fetchNotifications();
}, []);



  const NotifToast = ({ message, onOke }) => (
  <div>
    <p className="mb-2">{message}</p>
    <button
      onClick={onOke}
      style={{
        padding: '5px 12px',
        background: '#4caf50',
        border: 'none',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Oke
    </button>
  </div>
);

useEffect(() => {
  if (!Array.isArray(notifications)) return;

  notifications
    .filter((n) => !n.isDone)
    .forEach((n) => {
      if (shownToastIds.current.has(n._id)) return;
      shownToastIds.current.add(n._id);

      const kegiatan = n.disposisi?.nama_kegiatan || 'Surat tugas';

      if (n.notifType === 'ON_CREATE') {
        // notifikasi utama
        toast.info(
          <NotifToast
            message={`Surat baru: ${kegiatan}`}
            onOke={() => handleOke(n._id)}
          />,
          { autoClose: false }
        );
      } else if (n.notifType === 'REMINDER_1H') {
        toast.info(`Pengingat: ${kegiatan} dimulai 1 jam lagi`, {
          autoClose: 5000
        });
      } else if (n.notifType === 'REMINDER_30M') {
        toast.info(`Pengingat: ${kegiatan} dimulai 30 menit lagi`, {
          autoClose: 5000
        });
      } else if (n.notifType === 'REMINDER_2M') {
        toast.info(`Pengingat: ${kegiatan} dimulai 2 menit lagi`, {
          autoClose: 5000
        });
      }
    });
}, [notifications]);


// useEffect(() => {
//   notifications
//     .filter(n => !n.isDone)  
//     .forEach(n => {
//       toast.info(
//         <NotifToast
//           message={`Dispo Baru Masuk: ${n.disposisi?.nama_kegiatan}`}
//           onOke={() => handleOke(n._id)}
//         />,
//         { autoClose: false }   
//       );
//     });
// }, [notifications]);

const handleOke = async (notifId) => {
  try {
    const res = await axios.patch(
      `http://localhost:3000/api/notif/notifications/done/${notifId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const updatedNotif = res.data.notification;

    setNotifications(prev =>
      prev.map(n => (n._id === updatedNotif._id ? updatedNotif : n))
    );

    toast.dismiss(); 

    toast.success("Notifikasi ditandai selesai");

  } catch (err) {
    console.error("Error update notif:", err.response?.data || err.message);
    toast.error("Gagal menandai notifikasi");
  }
};

  return (
    <Grid container spacing={gridSpacing}>
      <ToastContainer position="top-right" />
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
            <TotalNotifikasi  />
          </Grid>
          <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
            <TotalSelesai  />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}
