import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}


function App() {
  const [error, setError] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectCount, setSelectCount] = useState<number>(0);

  const fetchArtworks = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

const response = await axios.get(
  `https://api.allorigins.win/raw?url=https://api.artic.edu/api/v1/artworks?page=${page}`
);



      setArtworks(response.data.data);
      setTotalRecords(response.data.pagination.total);
    } catch (err) {
      setError("Failed to load artworks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [currentPage]);

  const handleSelectFirstN = () => {
    if (!Number.isInteger(selectCount) || selectCount <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    const newSelectedIds = new Set(selectedIds);

    const limit = Math.min(selectCount, artworks.length);
    const rowsToSelect = artworks.slice(0, limit);

    rowsToSelect.forEach((row) => {
      newSelectedIds.add(row.id);
    });

    setSelectedIds(newSelectedIds);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    flex: 1
  };

  const cardNumber: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "5px"
  };

  return (
    <div
      style={{
        padding: "30px",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        minHeight: "100vh"
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "25px", color: "white" }}>
        <h1 style={{ margin: 0 }}>🎨 Art Institute Dashboard</h1>
        <p>Server-side pagination with persistent row selection</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>
        <div style={cardStyle}>
          <h3>Total Records</h3>
          <p style={cardNumber}>{totalRecords}</p>
        </div>

        <div style={cardStyle}>
          <h3>Selected Rows</h3>
          <p style={cardNumber}>{selectedIds.size}</p>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >
        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "6px"
            }}
          >
            {error}
          </div>
        )}

        {/* Custom Selection */}
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <input
            type="number"
            value={selectCount}
            onChange={(e) => setSelectCount(Number(e.target.value))}
            placeholder="Select first N rows"
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "180px"
            }}
          />

          <button
            onClick={handleSelectFirstN}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#3b82f6",
              color: "white",
              cursor: "pointer"
            }}
          >
            Apply
          </button>

          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        </div>

        <DataTable
          value={artworks}
          paginator
          rows={12}
          totalRecords={totalRecords}
          lazy
          loading={loading}
          dataKey="id"
          emptyMessage="No artworks found."
          selectionMode="multiple"
          selection={artworks.filter((a) => selectedIds.has(a.id))}
          onSelectionChange={(e) => {
            const selectedRows = e.value as Artwork[];
            const newSelectedIds = new Set(selectedIds);

            selectedRows.forEach((row) => {
              newSelectedIds.add(row.id);
            });

            artworks.forEach((row) => {
              if (!selectedRows.some((s) => s.id === row.id)) {
                newSelectedIds.delete(row.id);
              }
            });

            setSelectedIds(newSelectedIds);
          }}
          onPage={(e) => {
            setCurrentPage((e.page ?? 0) + 1);
          }}
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Origin" />
          <Column field="artist_display" header="Artist" />
          <Column field="date_start" header="Start Year" />
          <Column field="date_end" header="End Year" />
        </DataTable>
      </div>
    </div>
  );
}

export default App;