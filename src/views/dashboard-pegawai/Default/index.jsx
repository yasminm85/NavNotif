import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// project imports
import TotalNotifikasi from './TotalNotifikasi';
import TotalSelesai from './TotalSelesai';
import { gridSpacing } from 'store/constant';

// assets

// ==============================|| DASHBOARD PEGAWAI ||============================== //

export default function DashboardPegawai() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    toast.info("Notifikasi Baru Masuk!"); 

  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <ToastContainer autoClose={false}/>
      <Grid size={12}>
        <Grid container spacing={gridSpacing}>
          <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
            <TotalNotifikasi isLoading={isLoading} />
          </Grid>
          <Grid size={{ lg: 6, md: 6, sm: 6, xs: 12 }}>
            <TotalSelesai isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

    </Grid>
  );
}
