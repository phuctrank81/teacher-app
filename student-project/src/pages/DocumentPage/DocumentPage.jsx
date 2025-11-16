import React, { useEffect, useState } from "react";
import { supabase } from '../../../supabaseClient'
import SupaBaseHeader from "../../component/supaBaseHeader";
import { Download, Play } from "lucide-react";
import "./document.css";

export default function DocumentPage() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    async function fetchDocs() {
      const { data, error } = await supabase.from("documents").select("*");
      if (!error) setDocs(data);
    }
    fetchDocs();
  }, []);

  return (
    <div>
      <SupaBaseHeader />

      <h2 className="doc-title-page">Tài liệu học tiếng Hàn</h2>

      <div className="doc-grid">
        {docs.map((item) => (
          <DocumentCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

// =========================
// Gộp DocumentCard vào đây
// =========================
function DocumentCard({ data }) {
  return (
    <div className="doc-card">
      <div className="doc-thumbnail">
        <img src={data.thumbnail_url} alt={data.title} />
      </div>

      <p className="doc-author">{data.author}</p>
      <p className="doc-title">{data.title}</p>

      <div className="doc-progress">
        <span>{data.progress}%</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${data.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="doc-actions">
        <a
          href={data.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-download"
        >
          Tải xuống <Download size={16} />
        </a>

        <button className="btn-learn">
          Học <Play size={16} />
        </button>
      </div>
    </div>
  );
}
