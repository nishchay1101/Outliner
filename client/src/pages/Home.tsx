import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageList } from '../components/Sidebar/PageList';
import { UploadZone } from '../components/Upload/UploadZone';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10, 10, 15, 0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>DocToPage</button>
      </header>

      <div style={{ flex: '1 1 0', display: 'flex', overflow: 'hidden' }}>
        <aside style={{ height: '100%', display: 'flex' }}>
          <PageList />
        </aside>

        <main style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', padding: '2rem' }}>
          <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--sans)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                Create Pages from Docs
              </h1>
              <p style={{ fontFamily: 'var(--body)', fontSize: '1.1rem', color: 'var(--text-dim)' }}>
                Upload your lecture or document (.docx) to generate a beautiful, interactive learning page instantly.
              </p>
            </div>
            <UploadZone />
          </div>
        </main>
      </div>
    </div>
  );
}
