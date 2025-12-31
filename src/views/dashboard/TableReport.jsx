import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import axios from 'axios';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


const TableReport = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

  const fetchReport = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/task/disposisi/report-table');
      setData(res.data.data || []);
    } catch (err) {
      console.error('Error fetch report table:', err);
      setData([]);
    }
  };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.select) {
        inputRef.current.select();
      }
    }

    fetchReport();
  }, [editingCell]);

  const toggleDirektorat = (dirId) => {
    setData(data.map(d =>
      d.id === dirId ? { ...d, expanded: !d.expanded } : d
    ));
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsData = [
      [
        "No",
        "Direktorat / Divisi",
        "Total Kegiatan",
        "Mengikuti",
        "",
        "Belum Mengikuti"
      ],
      [
        "",
        "",
        "",
        "Sudah Melaporkan",
        "Belum Melaporkan",
        ""
      ]
    ];

    filteredData.forEach((dir, i) => {
      const dirTotal = dir.divisi.reduce((s, d) => s + d.totalKegiatan, 0);
      const dirSudah = dir.divisi.reduce((s, d) => s + d.sudahMelaporkan, 0);
      const dirBelum = dir.divisi.reduce((s, d) => s + d.belumMelaporkan, 0);
      const dirBelumIkut = dir.divisi.reduce((s, d) => s + d.belumMengikuti, 0);

      wsData.push([
        i + 1,
        dir.direktorat,
        dirTotal,
        dirSudah,
        dirBelum,
        dirBelumIkut
      ]);

      dir.divisi.forEach(div => {
        wsData.push([
          "",
          `   ${div.nama}`,
          div.totalKegiatan,
          div.sudahMelaporkan,
          div.belumMelaporkan,
          div.belumMengikuti
        ]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, 
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, 
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, 
      { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } }, 
      { s: { r: 0, c: 5 }, e: { r: 1, c: 5 } }  
    ];

    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "374151" } },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }
    };

    ["A1", "B1", "C1", "D1", "F1", "D2", "E2"].forEach(cell => {
      if (ws[cell]) ws[cell].s = headerStyle;
    });

    ws["!cols"] = [
      { wch: 5 },
      { wch: 35 },
      { wch: 18 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Laporan Kegiatan");
    const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });

    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "laporan-kegiatan.xlsx"
    );
  };


  const handleEditComplete = () => {
    if (editingCell) {
      const { type, dirId, divisiId, field } = editingCell;

      if (type === 'direktorat') {
        setData(data.map(d =>
          d.id === dirId ? { ...d, direktorat: editValue } : d
        ));
      } else if (type === 'divisi') {
        setData(data.map(d => {
          if (d.id === dirId) {
            return {
              ...d,
              divisi: d.divisi.map(div => {
                if (div.id === divisiId) {
                  const newDiv = { ...div };
                  if (field === 'nama') {
                    newDiv[field] = editValue;
                  } else {
                    newDiv[field] = Number(editValue) || 0;
                  }
                  return newDiv;
                }
                return div;
              })
            };
          }
          return d;
        }));
      }

      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEditComplete();
      } else if (e.key === 'Escape') {
        setEditingCell(null);
        setEditValue('');
      }
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.map(dir => ({
      ...dir,
      divisi: dir.divisi.filter(div =>
        dir.direktorat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        div.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(dir =>
      dir.direktorat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dir.divisi.length > 0
    );
  }, [data, searchTerm]);

  const getTotalStats = () => {
    let totalKegiatan = 0;
    let totalSudahMelaporkan = 0;
    let totalBelumMelaporkan = 0;
    let totalBelumMengikuti = 0;

    data.forEach(dir => {
      dir.divisi.forEach(div => {
        totalKegiatan += div.totalKegiatan;
        totalSudahMelaporkan += div.sudahMelaporkan;
        totalBelumMelaporkan += div.belumMelaporkan;
        totalBelumMengikuti += div.belumMengikuti;
      });
    });

    return { totalKegiatan, totalSudahMelaporkan, totalBelumMelaporkan, totalBelumMengikuti };
  };

  const stats = getTotalStats();

  return (
    <div className="card" style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }} onKeyDown={handleKeyDown} tabIndex={0}>
      <style>{`
        .excel-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        .excel-table th,
        .excel-table td {
          border: 1px solid #d1d5db;
          padding: 12px 16px;
        }
        .excel-table thead th {
          background-color: #374151;
          color: white;
          font-weight: 600;
          text-align: center;
        }
        .direktorat-row {
          background-color: #dbeafe;
          font-weight: 600;
        }
        .direktorat-row:hover {
          background-color: #bfdbfe;
        }
        .divisi-row:hover {
          background-color: #f9fafb;
        }
        .cell-selected {
          box-shadow: inset 0 0 0 2px #3b82f6;
          background-color: #eff6ff;
        }
        .cell-editable {
          cursor: cell;
        }
        .edit-input {
          width: 100%;
          padding: 4px 8px;
          border: 2px solid #3b82f6;
          border-radius: 4px;
        }
        .edit-input:focus {
          outline: none;
        }
      `}</style>

      {/* Toolbar */}
      <div className="card" style={{ padding: '12px', marginBottom: '0', borderBottom: '1px solid #d1d5db' }}>
        <div className="flex justify-content-between align-items-center">
          <div className="flex gap-2">
            <Button
              label="Export Excel"
              icon="pi pi-download"
              onClick={handleExportExcel}
              severity="success"
              size="small"
            />
          </div>

          <div className="flex align-items-center gap-4">
            <div className="flex gap-3" style={{ fontSize: '14px' }}>
              <div className="flex gap-2 align-items-center">
                <span style={{ color: '#6b7280' }}>Total Kegiatan:</span>
                <strong>{stats.totalKegiatan}</strong>
              </div>
              <div className="flex gap-2 align-items-center">
                <span style={{ color: '#6b7280' }}>Sudah Melaporkan:</span>
                <strong style={{ color: '#15803d' }}>{stats.totalSudahMelaporkan}</strong>
              </div>
              <div className="flex gap-2 align-items-center">
                <span style={{ color: '#6b7280' }}>Belum Melaporkan:</span>
                <strong style={{ color: '#ca8a04' }}>{stats.totalBelumMelaporkan}</strong>
              </div>
              <div className="flex gap-2 align-items-center">
                <span style={{ color: '#6b7280' }}>Belum Mengikuti:</span>
                <strong style={{ color: '#dc2626' }}>{stats.totalBelumMengikuti}</strong>
              </div>
            </div>

            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari direktorat atau divisi..."
                style={{ width: '320px' }}
              />
            </IconField>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="excel-table">
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            {/* Main Header Row */}
            <tr>
              <th rowSpan="2" style={{ width: '64px' }}>No</th>
              <th rowSpan="2">Direktorat</th>
              <th rowSpan="2" style={{ width: '128px' }}>Total Kegiatan</th>
              <th colSpan="2">Mengikuti</th>
              <th rowSpan="2" style={{ width: '128px' }}>Belum Mengikuti</th>
            </tr>
            {/* Sub Header Row */}
            <tr>
              <th style={{ width: '128px' }}>Sudah Melaporkan</th>
              <th style={{ width: '128px' }}>Belum Melaporkan</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((dir, dirIndex) => {
              const dirTotal = dir.divisi.reduce((sum, div) => sum + div.totalKegiatan, 0);
              const dirSudahMelaporkan = dir.divisi.reduce((sum, div) => sum + div.sudahMelaporkan, 0);
              const dirBelumMelaporkan = dir.divisi.reduce((sum, div) => sum + div.belumMelaporkan, 0);
              const dirBelumMengikuti = dir.divisi.reduce((sum, div) => sum + div.belumMengikuti, 0);

              return (
                <React.Fragment key={dir.id}>
                  {/* Direktorat Row */}
                  <tr className="direktorat-row">
                    <td style={{ textAlign: 'center' }}>{dirIndex + 1}</td>
                    <td>
                      <div className="flex align-items-center gap-2">
                        <Button
                          icon={dir.expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'}
                          className="p-button-text p-button-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDirektorat(dir.id);
                          }}
                          style={{ padding: '4px' }}
                        />

                        <span style={{ color: '#1e40af' }}>{dir.direktorat}</span>

                      </div>
                    </td>
                    <td style={{ textAlign: 'center', backgroundColor: '#f3f4f6' }}>
                      <strong>{dirTotal}</strong>
                    </td>
                    <td style={{ textAlign: 'center', backgroundColor: '#dcfce7', color: '#15803d' }}>
                      <strong>{dirSudahMelaporkan}</strong>
                    </td>
                    <td style={{ textAlign: 'center', backgroundColor: '#fef3c7', color: '#ca8a04' }}>
                      <strong>{dirBelumMelaporkan}</strong>
                    </td>
                    <td style={{ textAlign: 'center', backgroundColor: '#fee2e2', color: '#dc2626' }}>
                      <strong>{dirBelumMengikuti}</strong>
                    </td>
                  </tr>

                  {/* Divisi Rows */}
                  {dir.expanded && dir.divisi.map((div, divIndex) => (
                    <tr key={div.id} className="divisi-row">
                      <td style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                      </td>
                      <td>
                        <span>{div.nama}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 500 }}>{div.totalKegiatan}</span>
                      </td>
                      <td
                        style={{ textAlign: 'center' }}
                      >
                        <span style={{ color: '#15803d', fontWeight: 500 }}>{div.sudahMelaporkan}</span>

                      </td>
                      <td
                        style={{ textAlign: 'center' }}
                      >
                        <span style={{ color: '#ca8a04', fontWeight: 500 }}>{div.belumMelaporkan}</span>
                      </td>
                      <td
                        style={{ textAlign: 'center' }}
                      >
                        <span style={{ color: '#dc2626', fontWeight: 500 }}>{div.belumMengikuti}</span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="card" style={{ padding: '8px 16px', marginTop: '0', borderTop: '1px solid #d1d5db', fontSize: '14px', color: '#6b7280' }}>
        <div className="flex justify-content-between align-items-center">
          <span>
            Total: {filteredData.length} Direktorat, {filteredData.reduce((sum, d) => sum + d.divisi.length, 0)} Divisi
          </span>
        </div>
      </div>
    </div>
  );
};

export default TableReport;