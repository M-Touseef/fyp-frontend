import Header from '../components/layout/Header'
import FooterSection from '../components/sections/FooterSection'

const processingSteps = ['Frame extraction', 'Face detection', 'AI prediction', 'Heatmap generation', 'PDF report']

export default function ProcessingPage() {
  return (
    <div className="min-h-screen bg-[#05090c] font-['Manrope'] text-[#f4fbff] antialiased">
      <Header />
      <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,.16),transparent_30%),linear-gradient(180deg,#05090c,#071116_52%,#03080b)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(33,216,238,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(33,216,238,.06)_1px,transparent_1px)] bg-[size:62px_62px] opacity-25" aria-hidden="true" />

        <section className="relative w-[min(820px,100%)] rounded-[30px] border border-white/10 bg-white/[.045] p-8 text-center shadow-[0_32px_90px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl max-sm:p-5" aria-labelledby="processing-title">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl border border-cyan-300/25 bg-cyan-300/[.07]">
            <span className="size-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-200" />
          </div>
          <h1 className="mt-7 text-[clamp(32px,5vw,52px)] font-semibold leading-tight tracking-[-.04em]" id="processing-title">Preparing Analysis</h1>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-7 text-[#a9bac1]">
            The uploaded video is being prepared for forensic analysis. Frame extraction, facial crops, heatmaps, and report assets are queued next.
          </p>
          <div className="mt-8 grid grid-cols-5 gap-2 max-md:grid-cols-1">
            {processingSteps.map((step, index) => (
              <div className="rounded-2xl border border-white/[.07] bg-[#071116]/72 px-3 py-4 text-xs font-bold text-slate-200" key={step}>
                <span className="mb-2 inline-grid size-6 place-items-center rounded-full bg-cyan-300 text-[11px] font-black text-[#021014]">{index + 1}</span>
                <span className="block">{step}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}
