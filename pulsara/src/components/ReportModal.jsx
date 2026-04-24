'use client';
import { useState, useRef } from 'react';
import { LIME, EXAM_C, ASGN_C, LBL, INP, LIME_BTN } from '@/lib/constants';
import { saveReport } from '@/lib/storage';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export default function ReportModal({ myUser, onClose }) {
  const [category, setCategory] = useState('BUG');
  const [desc, setDesc] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const fileRef = useRef();

  const CATS = ['BUG', 'WRONG INFO', 'UI ISSUE', 'SUGGESTION', 'OTHER'];
  const catColor = { BUG: EXAM_C, 'WRONG INFO': '#f0a500', 'UI ISSUE': ASGN_C, SUGGESTION: LIME, OTHER: 'var(--muted2)' };

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      setSubmitError('Screenshot must be under 5 MB.');
      e.target.value = '';
      return;
    }
    setSubmitError('');
    setScreenshotName(f.name);
    const reader = new FileReader();
    reader.onload = ev => setScreenshotPreview(ev.target.result);
    reader.readAsDataURL(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!desc.trim()) return;
    const report = { id: Date.now(), category, desc: desc.trim(), screenshotName, author: myUser || 'anonymous', time: new Date().toLocaleString(), status: 'open' };
    try {
      await saveReport(report);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); onClose(); }, 2000);
    } catch (err) {
      console.error('saveReport error:', err);
      setSubmitError('Failed to submit. Please try again.');
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', animation: 'fadeIn .2s ease' }}>
      <div style={{
        width: '100%', maxWidth: 360, background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14,
        boxShadow: '0 16px 48px rgba(0,0,0,.6)', animation: 'popIn .2s ease', overflow: 'hidden', position: 'relative',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: EXAM_C, letterSpacing: '.08em' }}>REPORT A BUG</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', cursor: 'pointer', transition: 'all .15s' }}>✕</button>
        </div>

        {submitted ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', animation: 'fadeIn .2s ease' }}>
            <div style={{ fontSize: 26, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: LIME }}>Report submitted. Thank you!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ ...LBL, fontSize: 11 }}>Category</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {CATS.map(c => {
                  const active = category === c;
                  const cc = catColor[c] || 'var(--muted)';
                  return (
                    <button key={c} type="button" onClick={() => setCategory(c)} style={{
                      fontFamily: 'var(--mono)', fontSize: 10, padding: '4px 10px', borderRadius: 5, cursor: 'pointer', fontWeight: 700, letterSpacing: '.05em',
                      background: active ? `${cc}18` : 'var(--s2)', border: `1px solid ${active ? cc : 'var(--border)'}`,
                      color: active ? cc : 'var(--muted)', transition: 'all .12s',
                    }}>{c}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={{ ...LBL, fontSize: 11 }}>Description <span style={{ color: LIME }}>*</span></label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue clearly…" rows={4} required style={{ ...INP, fontSize: 13, resize: 'vertical', lineHeight: 1.5 }} onFocus={e => e.target.style.borderColor = LIME} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ ...LBL, fontSize: 11 }}>Screenshot <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span></label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              <button type="button" onClick={() => fileRef.current.click()} style={{
                width: '100%', background: 'var(--s2)', border: '1px dashed var(--border2)', borderRadius: 7,
                padding: '10px 14px', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11,
                cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s',
              }} onMouseEnter={e => e.currentTarget.style.borderColor = LIME} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
                {screenshotName ? `🖼️ ${screenshotName}` : '+ Attach screenshot'}
              </button>
              {screenshotPreview && (
                <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', maxHeight: 100 }}>
                  <img src={screenshotPreview} alt="preview" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
            {submitError && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--danger)', marginTop: -6 }}>{submitError}</div>
            )}
            <button type="submit" style={{ ...LIME_BTN, padding: '11px', fontSize: 11, marginTop: 4 }}>SUBMIT REPORT →</button>
          </form>
        )}
      </div>
    </div>
  );
}
