import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';

function parseReceiptText(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let amount = null;
  let description = '';

  // Try to find total/amount patterns (Romanian receipts)
  const totalPatterns = [
    /total\s*[:\-]?\s*(\d+[\.,]\d{2})/i,
    /suma\s*[:\-]?\s*(\d+[\.,]\d{2})/i,
    /plat[aă]\s*[:\-]?\s*(\d+[\.,]\d{2})/i,
    /amount\s*[:\-]?\s*(\d+[\.,]\d{2})/i,
    /valoare\s*[:\-]?\s*(\d+[\.,]\d{2})/i,
    /de\s*plat[aă]\s*[:\-]?\s*(\d+[\.,]\d{2})/i,
    /(\d+[\.,]\d{2})\s*(?:RON|LEI|ron|lei)/,
  ];

  for (const pattern of totalPatterns) {
    for (const line of lines) {
      const match = line.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(',', '.'));
        break;
      }
    }
    if (amount) break;
  }

  // If no total found, find the largest number
  if (!amount) {
    const allAmounts = [];
    for (const line of lines) {
      const matches = line.match(/(\d+[\.,]\d{2})/g);
      if (matches) {
        matches.forEach((m) => allAmounts.push(parseFloat(m.replace(',', '.'))));
      }
    }
    if (allAmounts.length > 0) {
      amount = Math.max(...allAmounts);
    }
  }

  // Try to find merchant/description from first meaningful lines
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.replace(/[^a-zA-ZăîșțâĂÎȘȚÂ\s]/g, '').trim();
    if (cleaned.length > 3 && cleaned.length < 60) {
      description = cleaned;
      break;
    }
  }

  return { amount, description };
}

export default function ReceiptScanner({ onResult, categories }) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState(categories[0]);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const processImage = async (file) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setScanning(true);
    setProgress(0);
    setScanResult(null);

    try {
      const result = await Tesseract.recognize(file, 'ron+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const parsed = parseReceiptText(result.data.text);
      setScanResult({
        rawText: result.data.text,
        ...parsed,
      });
      setEditName(parsed.description || '');
      setEditAmount(parsed.amount ? String(parsed.amount) : '');
    } catch (err) {
      console.error('OCR error:', err);
      setScanResult({ error: true });
    } finally {
      setScanning(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const handleConfirm = () => {
    if (!editAmount) return;
    onResult({
      name: editName || 'Cheltuială scanată',
      amount: parseFloat(editAmount),
      category: editCategory,
      hasReceipt: true,
      receiptImage: preview,
    });
    // Reset
    setPreview(null);
    setScanResult(null);
    setEditName('');
    setEditAmount('');
    setEditCategory(categories[0]);
  };

  const handleCancel = () => {
    setPreview(null);
    setScanResult(null);
    setEditName('');
    setEditAmount('');
  };

  return (
    <div className="scanner-wrap">
      {!preview ? (
        <div className="scan-options">
          <button
            className="scan-btn"
            onClick={() => cameraRef.current?.click()}
          >
            <span className="scan-icon">📸</span>
            <span className="scan-label">Fotografiază Bon</span>
            <span className="scan-sub">Deschide camera</span>
          </button>
          <button
            className="scan-btn"
            onClick={() => fileRef.current?.click()}
          >
            <span className="scan-icon">📄</span>
            <span className="scan-label">Încarcă Factură</span>
            <span className="scan-sub">PDF sau poză</span>
          </button>
          <button
            className="scan-btn"
            onClick={() => fileRef.current?.click()}
          >
            <span className="scan-icon">📱</span>
            <span className="scan-label">Screenshot Plată</span>
            <span className="scan-sub">Plată online</span>
          </button>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="scan-result">
          <div className="scan-preview-row">
            <img src={preview} alt="Receipt" className="scan-preview-img" />
            <div className="scan-data">
              {scanning ? (
                <div className="scan-progress">
                  <div className="scan-progress-label">
                    Se citește documentul...
                  </div>
                  <div className="scan-progress-bar-wrap">
                    <div
                      className="scan-progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="scan-progress-pct">{progress}%</div>
                </div>
              ) : scanResult?.error ? (
                <div className="scan-error">
                  Nu am putut citi documentul. Completează manual.
                </div>
              ) : (
                <div className="scan-extracted">
                  <div className="scan-extracted-label">
                    Extras din document:
                  </div>
                  <div className="form-row" style={{ flexWrap: 'wrap' }}>
                    <div className="form-group">
                      <label>Descriere</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Ce ai cumpărat?"
                      />
                    </div>
                    <div className="form-group" style={{ maxWidth: 140 }}>
                      <label>Sumă (RON)</label>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="form-group" style={{ maxWidth: 180 }}>
                      <label>Categorie</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="scan-actions">
                <button className="btn btn-primary" onClick={handleConfirm} disabled={scanning}>
                  Adaugă Cheltuială
                </button>
                <button className="btn btn-danger" onClick={handleCancel}>
                  Anulează
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
