import { useMemo } from 'react'
import Header from '../components/layout/Header'
import FooterSection from '../components/sections/FooterSection'
import HeatmapRegionChips from '../components/results/HeatmapRegionChips'
import PDFReportCard from '../components/results/PDFReportCard'
import ResultInterpretation from '../components/results/ResultInterpretation'
import ResultSummaryBanner from '../components/results/ResultSummaryBanner'
import ScoreCard from '../components/results/ScoreCard'
import SuspiciousFrameCard from '../components/results/SuspiciousFrameCard'
import { analysisResult as fallbackResult } from '../data/resultData'
import { downloadPdfReport } from '../utils/reportDownload'

function readStoredResult() {
  try {
    return JSON.parse(window.sessionStorage.getItem('analysisResult') || 'null')
  } catch {
    return null
  }
}

function buildResult() {
  const stored = readStoredResult()
  if (!stored) return fallbackResult

  return {
    ...fallbackResult,
    videoName: stored.videoName || fallbackResult.videoName,
    fakeProbability: stored.confidence || fallbackResult.fakeProbability,
    authenticityScore: Math.max(0, 100 - (stored.confidence || fallbackResult.fakeProbability)),
  }
}

export default function ResultsPage() {
  const result = useMemo(buildResult, [])
  const scoreCards = [
    { label: 'Fake Probability', value: result.fakeProbability, suffix: '%', tone: 'red' },
    { label: 'Authenticity Score', value: result.authenticityScore, suffix: '%', tone: 'emerald' },
    { label: 'Frames Analyzed', value: result.framesAnalyzed, tone: 'cyan' },
    { label: 'Faces Detected', value: result.facesDetected, tone: 'cyan' },
    { label: 'Confidence Level', value: result.confidenceLevel, tone: 'amber' },
    { label: 'PDF Report', value: result.reportStatus, tone: 'slate' },
  ]

  return (
    <div className="min-h-screen bg-[#05090c] font-['Manrope'] text-[#f4fbff] antialiased">
      <Header />
      <main className="relative overflow-hidden pt-[122px] max-md:pt-[104px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(34,211,238,.13),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(248,113,113,.1),transparent_24%),linear-gradient(180deg,#05090c_0%,#071116_44%,#03080b_100%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(33,216,238,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(33,216,238,.05)_1px,transparent_1px)] bg-[size:62px_62px] opacity-30 [mask-image:linear-gradient(180deg,#000,transparent_82%)]" aria-hidden="true" />

        <section className="relative mx-auto w-[min(1240px,calc(100%-48px))] pb-20 max-md:w-[min(680px,calc(100%-30px))]" aria-labelledby="results-title">
          <div className="animate-[pulse_.55s_ease-out_1]">
            <div className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.2em] text-cyan-200/85">
              <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#21d8ee]" />
              Detection dashboard
            </div>
            <h1 className="text-[clamp(38px,5vw,64px)] font-semibold leading-[1.02] tracking-[-.045em]" id="results-title">Analysis Result</h1>
            <p className="mt-5 max-w-[820px] text-[clamp(15px,1.5vw,18px)] leading-7 text-[#a9bac1]">
              The uploaded video has been analyzed using frame-level detection, AI classification, and Grad-CAM heatmap explainability.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2">Video: {result.videoName}</span>
              <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2">Analysis Date: {result.analysisDate}</span>
              <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-2">Frames Analyzed: {result.framesAnalyzed}</span>
            </div>
          </div>

          <div className="mt-10">
            <ResultSummaryBanner result={result} />
          </div>

          <div className="mt-6 grid grid-cols-6 gap-4 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {scoreCards.map((card, index) => (
              <ScoreCard delay={index * 90} key={card.label} {...card} />
            ))}
          </div>

          <div className="mt-6">
            <ResultInterpretation interpretation={result.interpretation} />
          </div>

          <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,.05)]" aria-labelledby="frames-title">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-[-.03em] text-white" id="frames-title">Most Suspicious Frames</h2>
                <p className="mt-2 text-sm text-[#8ea2aa]">A focused preview of the frames that most influenced the prediction.</p>
              </div>
              <a className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[.08] px-5 text-sm font-bold text-cyan-100 transition-all duration-300 hover:border-cyan-200/45 hover:bg-cyan-300/12" href="/frames">
                View All Frames
              </a>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
              {result.suspiciousFrames.slice(0, 4).map((frame) => (
                <SuspiciousFrameCard frame={frame} key={frame.frameNumber} />
              ))}
            </div>
          </section>

          <div className="mt-6 grid grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] gap-6 max-lg:grid-cols-1">
            <HeatmapRegionChips regions={result.affectedRegions} />
            <PDFReportCard onDownload={() => downloadPdfReport(result)} />
          </div>

          <div className="mt-7 flex flex-wrap justify-end gap-3 max-sm:grid max-sm:grid-cols-1">
            <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[.045] px-5 text-sm font-bold text-slate-100 transition-all duration-300 hover:border-cyan-300/35 hover:bg-cyan-300/10" href="/frames">View Frame Analysis</a>
            <a className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[.045] px-5 text-sm font-bold text-slate-100 transition-all duration-300 hover:border-cyan-300/35 hover:bg-cyan-300/10" href="/report">Preview PDF Report</a>
            <button className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/[.08] px-5 text-sm font-bold text-cyan-100 transition-all duration-300 hover:bg-cyan-300/12" type="button" onClick={() => downloadPdfReport(result)}>Download PDF Report</button>
            <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-5 text-sm font-extrabold text-[#021014] shadow-[0_16px_38px_rgba(34,211,238,.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-200" href="/upload">Analyze Another Video</a>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
