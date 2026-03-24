import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageList } from '../components/Sidebar/PageList';
import { UploadZone } from '../components/Upload/UploadZone';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-layout">
      <header className="home-header">
        <button className="btn btn-ghost" onClick={() => navigate('/')}>DocToPage</button>
      </header>

      <div className="home-content-container">
        <aside className="home-sidebar-wrapper">
          <PageList />
        </aside>

        <main className="home-main">
          <div className="home-upload-wrapper">
            <div className="home-hero-text">
              <h1 className="home-hero-h1">
                Create Pages from Docs
              </h1>
              <p className="home-hero-p">
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
