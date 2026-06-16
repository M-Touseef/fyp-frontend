import { useMemo } from 'react'
import Header from '../components/layout/Header'
import FooterSection from '../components/sections/FooterSection'

function readStoredResult() {
  try {
    return JSON.parse(window.sessionStorage.getItem('analysisResult') || 'null')
  } catch {
    return null
  }
}

export default function ResultsPage() {
  const result = useMemo(readStoredResult, [])

  return (
    <div className="min-h-screen bg-[#05090c] font-['Manrope'] text-[#f4fbff] antialiased">
      <Header />
      <main className="relative overflow-hidden px-6 pb-20 pt-[128px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,.14),transparent_30%),linear-gradient(180deg,#05090c,#071116_50%,#03080b)]" aria-hidden="true" />
        <section className="relative mx-auto w-[min(980px,100%)] rounded-[30px] border border-white/10 bg-white/[.045] p-7 shadow-[0_32px_90px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl max-sm:p-5" aria-labelledby="results-title">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.2em] text-emerald-200/90">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,.85)]" />
            Analysis complete
          </div>
          <h1 className="mt-5 text-[clamp(34px,5vw,58px)] font-semibold leading-tight tracking-[-.045em]" id="results-title">Results Ready</h1>
          <p className="mt-4 max-w-[680px] text-base leading-7 text-[#a9bac1]">
            The video has been processed through frame extraction, face detection, AI prediction, heatmap generation, and report preparation.
          </p>

          <div className="mt-8 grid grid-cols-[minmax(0,1fr)_220px] gap-5 max-md:grid-cols-1">
            <div className="rounded-[24px] border border-white/[.08] bg-[#071116]/72 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[.16em] text-cyan-200/75">Video</p>
              <h2 className="mt-3 truncate text-xl font-bold text-white">{result?.videoName || 'Uploaded video'}</h2>
              <div className="mt-4 grid gap-2 text-sm text-[#9fb3bb]">
                <span>Format: <strong className="font-semibold text-slate-100">{result?.format || 'MP4'}</strong></span>
                <span>Size: <strong className="font-semibold text-slate-100">{result?.size || '24.6 MB'}</strong></span>
                <span>Status: <strong className="font-semibold text-emerald-200">Report prepared</strong></span>
              </div>
            </div>

            <div className="grid place-items-center rounded-[24px] border border-emerald-300/20 bg-emerald-300/[.06] p-5 text-center">
              <span className="text-5xl font-semibold tracking-[-.05em] text-emerald-100">{result?.confidence || 87}%</span>
              <span className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-emerald-200/75">Confidence score</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-4 max-md:grid-cols-1">
            {['Frame comparisons generated', 'Grad-CAM heatmaps ready', 'PDF report ready'].map((item) => (
              <div className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4 text-sm font-bold text-slate-100" key={item}>
                <span className="mr-2 text-emerald-200">✓</span>
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
