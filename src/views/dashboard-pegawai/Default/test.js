// src/pages/pegawai/NotifikasiPegawai.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

const formatDateTime = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  return d.toLocaleString('id-ID');
};

export default function NotifikasiPegawai() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = React.useRef(null);

  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'http://localhost:3000/api/notifications/my',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error('Error get notifications:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

//   const unreadCount = notifications.filter((n) => !n.isDone).length;
//   const doneCount = notifications.filter((n) => n.isDone).length;

  const statusBody = (row) => {
    if (row.isDone || row.status === 'Terbaca') {
      return <Tag value="Terbaca" severity="success" />;
    }
    return <Tag value="Belum Dibaca" severity="info" />;
  };

  const handleOke = async (notifId) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/notifications/${notifId}/done`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updated = res.data.notification;

      // update state lokal
      setNotifications((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );

      toastRef.current?.show({
        severity: 'success',
        summary: 'Berhasil',
        detail: 'Notifikasi ditandai selesai',
        life: 2000
      });
    } catch (err) {
      console.error('Error update notif:', err.response?.data || err.message);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Gagal',
        detail: 'Gagal update notifikasi',
        life: 3000
      });
    }
  };

  const actionBody = (row) => {
    if (row.isDone || row.status === 'Terbaca') {
      return <span className="text-sm text-gray-500">Sudah Oke</span>;
    }

    return (
      <Button
        label="Oke"
        size="small"
        className="p-button-text"
        onClick={() => handleOke(row._id)}
      />
    );
  };

  return (
    <div>
      <Toast ref={toastRef} />

      <h2>Notifikasi Saya</h2>

      {/* Card kecil jumlah notif */}
      <div className="flex gap-3 mb-3">
        <div className="p-3 border-round bg-blue-50">
          <div className="text-sm text-500">Belum Dibaca</div>
          <div className="text-2xl font-bold">{unreadCount}</div>
        </div>
        <div className="p-3 border-round bg-green-50">
          <div className="text-sm text-500">Sudah Dibaca</div>
          <div className="text-2xl font-bold">{doneCount}</div>
        </div>
      </div>

      <DataTable
        value={notifications}
        loading={loading}
        paginator
        rows={5}
        dataKey="_id"
      >
        <Column
          header="Nama Kegiatan"
          body={(row) => row.disposisi?.nama_kegiatan || '-'}
          style={{ minWidth: '12rem' }}
        />
        <Column
          header="Agenda"
          body={(row) => row.disposisi?.agenda_kegiatan || '-'}
        />
        <Column
          header="Tanggal"
          body={(row) => row.disposisi?.tanggal
            ? new Date(row.disposisi.tanggal).toLocaleDateString('id-ID')
            : '-'}
          style={{ minWidth: '8rem' }}
        />
        <Column header="Status" body={statusBody} style={{ minWidth: '8rem' }} />
        <Column
          header="Dibuat"
          body={(row) => formatDateTime(row.createdAt)}
          style={{ minWidth: '10rem' }}
        />
        <Column
          header="Action"
          body={actionBody}
          style={{ minWidth: '8rem' }}
        />
      </DataTable>
    </div>
  );
}


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
  notifications
    .filter(n => !n.isDone)   // notif belum dibaca
    .forEach(n => {
      toast.info(
        <NotifToast
          message={`Surat baru: ${n.disposisi?.nama_kegiatan}`}
          onOke={() => handleOke(n._id)}
        />,
        { autoClose: false }   // biar nggak hilang sendiri
      );
    });
}, [notifications]);

const handleOke = async (notifId) => {
  try {
    const res = await axios.patch(
      `http://localhost:3000/api/notifications/${notifId}/done`,
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


