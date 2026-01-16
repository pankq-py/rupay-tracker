// src/components/ExportBtn.jsx
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const ExportBtn = ({ data, filename }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    FileSaver.saveAs(new Blob([buf]), `${filename}.xlsx`);
  };

  return (
    <button onClick={exportToExcel} className="export-btn">
      📊 Export to Excel
    </button>
  );
};

export default ExportBtn;
