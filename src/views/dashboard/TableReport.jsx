import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function TableReport() {
  const [loading, setLoading] = useState(true);
  const [direktoratOptions, setDirektoratOptions] = useState([]);
  const [divisiMaster, setDivisiMaster] = useState([]); 
  const [raw, setRaw] = useState([]); 

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    direktoratId: { value: null, matchMode: FilterMatchMode.IN },
    divisiId: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const statuses = ['Belum Melaporkan', 'Sudah Melaporkan'];
  const getSeverity = (status) => (status === 'Sudah Melaporkan' ? 'success' : 'danger');

  useEffect(() => {
    let alive = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const resMaster = await axios.get('http://localhost:3000/api/task/disposisi/barchart', { headers });
        if (!alive) return;

        setDirektoratOptions(Array.isArray(resMaster.data?.direktoratOptions) ? resMaster.data.direktoratOptions : []);
        setDivisiMaster(Array.isArray(resMaster.data?.divisiOptions) ? resMaster.data.divisiOptions : []);

        const resTable = await axios.get('http://localhost:3000/api/task/disposisi/tablechart', { headers });
        if (!alive) return;

        setRaw(Array.isArray(resTable.data?.data) ? resTable.data.data : []);
      } catch (err) {
        console.error('Fetch TableReport error:', err);
        if (alive) {
          setDirektoratOptions([]);
          setDivisiMaster([]);
          setRaw([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      alive = false;
    };
  }, []);

  const direktoratMap = useMemo(
    () => Object.fromEntries((direktoratOptions || []).map((d) => [d.id, d.name])),
    [direktoratOptions]
  );

  const divisiMap = useMemo(() => {
    const normalized = (divisiMaster || []).map((v) => ({
      id: v.id ?? v._id,
      name: v.name,
      direktoratId: v.direktoratId ?? v.DirId
    }));
    return Object.fromEntries(normalized.map((v) => [v.id, v.name]));
  }, [divisiMaster]);

  const selectedDirektoratIds = filters?.direktoratId?.value || [];
  const divisiOptions = useMemo(() => {
    const base = (divisiMaster || []).map((v) => ({
      id: v.id ?? v._id,
      name: v.name,
      direktoratId: v.direktoratId ?? v.DirId
    }));

    if (!Array.isArray(selectedDirektoratIds) || selectedDirektoratIds.length === 0) return base;
    return base.filter((v) => selectedDirektoratIds.includes(v.direktoratId));
  }, [divisiMaster, selectedDirektoratIds]);

  const rows = useMemo(() => {
    return (raw || []).map((r) => {
      const total = Number(r.totalKegiatan ?? 0);
      const belum = Number(r.belumMelapor ?? 0);

      return {
        key: `${r.direktoratId}_${r.divisiId}`,
        direktoratId: r.direktoratId,
        divisiId: r.divisiId,
        direktoratName: direktoratMap[r.direktoratId] ?? r.direktoratId,
        divisiName: divisiMap[r.divisiId] ?? r.divisiId,
        totalKegiatan: total,
        status: belum > 0 ? 'Belum Melaporkan' : 'Sudah Melaporkan',
        belumMelapor: belum,
        sudahMelapor: Number(r.sudahMelapor ?? 0)
      };
    });
  }, [raw, direktoratMap, divisiMap]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, global: { ...prev.global, value } }));
    setGlobalFilterValue(value);
  };

  const header = (
    <div className="flex justify-content-end">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
      </IconField>
    </div>
  );

  // filter templates
  const direktoratFilter = (options) => (
    <MultiSelect
      value={options.value}
      options={direktoratOptions}
      optionLabel="name"
      optionValue="id"
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder="Pilih direktorat"
      className="p-column-filter"
      maxSelectedLabels={1}
      style={{ minWidth: '16rem' }}
    />
  );

  const statusFilter = (options) => (
    <Dropdown
      value={options.value}
      options={statuses}
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder="Pilih hasil pelaporan"
      className="p-column-filter"
      showClear
      style={{ minWidth: '14rem' }}
      itemTemplate={(opt) => <Tag value={opt} severity={getSeverity(opt)} />}
    />
  );

  const statusBody = (rowData) => <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;

  return (
    <div className="card">
      <DataTable
        value={rows}
        paginator
        rows={10}
        dataKey="key"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        header={header}
        emptyMessage="Data tidak ditemukan."
        globalFilterFields={['direktoratName', 'divisiName', 'status', 'direktoratId', 'divisiId']}
      >
        <Column
          header="Direktorat"
          field="direktoratId"
          body={(r) => r.direktoratName}
          filter
          filterField="direktoratId"
          showFilterMenu={false}
          filterElement={direktoratFilter}
          style={{ minWidth: '20rem' }}
        />

        <Column
          header="Divisi"
          field="divisiId"
          body={(r) => r.divisiName}
          style={{ minWidth: '18rem' }}
        />

        <Column field="totalKegiatan" header="Total Kegiatan" style={{ minWidth: '10rem' }} />

        <Column
          field="status"
          header="Hasil Pelaporan"
          body={statusBody}
          filter
          filterField="status"
          showFilterMenu={false}
          filterElement={statusFilter}
          style={{ minWidth: '16rem' }}
        />
      </DataTable>
    </div>
  );
}
