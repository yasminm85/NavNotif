
import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { DataServices } from './DataServices';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


export default function TableReport() {
    const [bidang, setBidang] = useState(null);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        bidang: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [bidangs] = useState([
        { name: 'IT' },
        { name: 'Audit' },
        { name: 'Corporate' },
        { name: 'Safety' },
        { name: 'Legal' },
        { name: 'Secretary' },
        { name: 'Tata Usaha' },
        { name: 'SDM' },
    ]);
    const [statuses] = useState(['Belum Melaporkan', 'Sudah Melaporkan']);

    const getSeverity = (status) => {
        switch (status) {
            case 'Belum Melaporkan':
                return 'danger';

            case 'Sudah Melaporkan':
                return 'success';
        }
    };

    useEffect(() => {
        DataServices.getBidangMedium().then((data) => {
            setBidang(getBidang(data));
            setLoading(false);
        });
    }, []);

    const getBidang = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);

            return d;
        });
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };



    const representativeBodyTemplate = (rowData) => {
        const bidang = rowData.bidang;

        return (
            <div className="flex align-items-center gap-2">
                <span>{bidang.name}</span>
            </div>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.name}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const verifiedBodyTemplate = (rowData) => {
        return <i className={classNames('pi', { 'true-icon pi-check-circle': rowData.verified, 'false-icon pi-times-circle': !rowData.verified })}></i>;
    };

    const representativeRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={bidangs}
                itemTemplate={representativesItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="name"
                placeholder="Pilih bidang"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '14rem' }}
            />
        );
    };

    const statusRowFilterTemplate = (options) => {
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Pilih Hasil Pelaporan" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
        );
    };

    // const verifiedRowFilterTemplate = (options) => {
    //     return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    // };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable value={bidang} paginator rows={5} dataKey="id" filters={filters} filterDisplay="row" loading={loading}
                globalFilterFields={['jmlkegiatan', 'bidang.name', 'hasilpelaporan']} header={header} emptyMessage="No customers found.">
                <Column header="Bidang" filterField="bidang" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
                    body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
                <Column field="jmlkegiatan" header="Jumlah Kegiatan"  />
                <Column field="status" header="Hasil Pelaporan" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            </DataTable>
        </div>
    );
}
