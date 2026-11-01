import React, { useState } from 'react';
import { getLayanan, saveLayanan } from '../../lib/db';

const MEJA = [
  ['Meja Kecil', '1–2 orang'],
  ['Meja Standar', '3–4 orang'],
  ['Meja Keluarga', '5–6 orang'],
  ['Meja Besar', '7–8 orang'],
  ['Meja Grup', '9–10 orang'],
  ['Pesta / Event', '11+ orang'],
  ['VIP Room', 'Ruangan privat'],
];

function Switch({ checked, onChange, label }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      <span className="switch-track"><span className="switch-thumb" /></span>
    </label>
  );
}

export default function StafLayanan() {
  const [cfg, setCfg] = useState(() => getLayanan());
  const [saved, setSaved] = useState(false);

  const update = (next) => {
    setCfg(next);
    saveLayanan(next);
    setSaved(true);
  };
  const toggleMeja = (label, aktif) => {
    const set = new Set(cfg.mejaNonaktif);
    if (aktif) set.delete(label); else set.add(label);
    update({ ...cfg, mejaNonaktif: [...set] });
  };

  return (
    <div>
      <div className="page-title">
        <h1>Kelola Layanan</h1>
        <p>Atur apa yang tampil untuk pelanggan</p>
      </div>

      <div className="riwayat-section" style={{ maxWidth: 760 }}>
        {saved && <div className="flash-ok">✓ Pengaturan tersimpan</div>}

        <p className="section-eyebrow">Layanan utama</p>
        <div className="setting-list">
          <div className="setting-row">
            <div><strong>Antrian digital</strong><span>Pelanggan dapat mengambil nomor antrian</span></div>
            <Switch label="Antrian digital" checked={cfg.antrian} onChange={(v) => update({ ...cfg, antrian: v })} />
          </div>
          <div className="setting-row">
            <div><strong>Reservasi meja</strong><span>Pelanggan dapat membuat reservasi baru</span></div>
            <Switch label="Reservasi meja" checked={cfg.reservasi} onChange={(v) => update({ ...cfg, reservasi: v })} />
          </div>
        </div>

        <p className="section-eyebrow" style={{ marginTop: 36 }}>Jenis meja yang ditawarkan</p>
        <div className="setting-list">
          {MEJA.map(([label, ket]) => (
            <div className="setting-row" key={label}>
              <div><strong>{label}</strong><span>{ket}</span></div>
              <Switch
                label={label}
                checked={!cfg.mejaNonaktif.includes(label)}
                onChange={(v) => toggleMeja(label, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
