import Header from '../components/layout/Header'
import FooterSection from '../components/sections/FooterSection'
import HeatmapRegionChips from '../components/results/HeatmapRegionChips'
import { analysisResult } from '../data/resultData'
import { downloadPdfReport } from '../utils/reportDownload'

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-[#05090c] font-['Manrope'] text-[#f4fbff] antialiased">
      <Header />
      <main className="relative overflow-hidden px-6 pb-20 pt-[128px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(34,211,238,.13),transparent_30%),linear-gradient(180deg,#05090c,#071116_50%,#03080b)]" aria-hidden="true" />
        <section className="relative mx-auto w-[min(980px,100%)] rounded-[30px] border border-white/10 bg-white/[.045] p-7 shadow-[0_32px_90px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl max-sm:p-5" aria-labelledby="report-title">
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.2em] text-cyan-200/85">
            <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#21d8ee]" />
            Report preview
          </div>
          <h1 className="mt-5 text-[clamp(34px,5vw,58px)] font-semibold leading-tight tracking-[-.045em]" id="report-title">PDF Analysis Report</h1>
          <p className="mt-4 max-w-[720px] text-base leading-7 text-[#a9bac1]">
            Preview the report content before downloading the final PDF for the analyzed video.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-5 max-md:grid-cols-1">
            {[
              ['Video', analysisResult.videoName],
              ['Final Prediction', analysisResult.finalPrediction],
              ['Fake Probability', `${analysisResult.fakeProbability}%`],
              ['Confidence Level', analysisResult.confidenceLevel],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/[.08] bg-[#071116]/72 p-4" key={label}>
                <p className="text-[11px] font-bold uppercase tracking-[.16em] text-slate-500">{label}</p>
                <p className="mt-2 text-xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <HeatmapRegionChips regions={analysisResult.affectedRegions} />
          </div>

          <p className="mt-5 rounded-[22px] border border-white/[.08] bg-white/[.035] p-5 text-[15px] leading-7 text-[#a9bac1]">{analysisResult.interpretation}</p>

          <div className="mt-6 flex flex-wrap justify-end gap-3 max-sm:grid">
            <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[.045] px-5 text-sm font-bold text-slate-100 transition-all duration-300 hover:border-cyan-300/35 hover:bg-cyan-300/10" href="/results">Back to Results</a>
            <button className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-5 text-sm font-extrabold text-[#021014] shadow-[0_16px_38px_rgba(34,211,238,.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-200" type="button" onClick={() => downloadPdfReport(analysisResult)}>Download PDF</button>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
