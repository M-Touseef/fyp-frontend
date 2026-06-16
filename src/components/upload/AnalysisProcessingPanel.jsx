const statusStyles = {
  Completed: {
    row: 'border-emerald-300/20 bg-emerald-300/[.055]',
    icon: 'border-emerald-300/35 bg-emerald-300/15 text-emerald-200',
    text: 'text-emerald-200',
  },
  Processing: {
    row: 'border-cyan-300/30 bg-cyan-300/[.075] shadow-[0_0_34px_rgba(34,211,238,.08)]',
    icon: 'border-cyan-200/50 bg-cyan-300/20 text-cyan-100',
    text: 'text-cyan-100',
  },
  Pending: {
    row: 'border-white/[.07] bg-white/[.025]',
    icon: 'border-white/10 bg-white/[.035] text-slate-500',
    text: 'text-slate-500',
  },
  Failed: {
    row: 'border-red-300/25 bg-red-400/10',
    icon: 'border-red-300/35 bg-red-400/15 text-red-200',
    text: 'text-red-200',
  },
}

function getStepStatus(index, currentStep, failedStep) {
  if (failedStep === index) return 'Failed'
  if (index < currentStep) return 'Completed'
  if (index === currentStep) return 'Processing'
  return 'Pending'
}

function StepMarker({ status }) {
  if (status === 'Completed') return <span aria-hidden="true">✓</span>
  if (status === 'Failed') return <span aria-hidden="true">!</span>
  if (status === 'Processing') return <span className="size-2.5 animate-pulse rounded-full bg-current shadow-[0_0_12px_currentColor]" aria-hidden="true" />
  return <span className="size-2 rounded-full border border-current opacity-70" aria-hidden="true" />
}

export default function AnalysisProcessingPanel({ video, progress, currentStep, steps, currentMessage, failedStep = null }) {
  const safeProgress = Math.min(Math.max(Math.round(progress), 0), 100)
  const fileFormat = video?.name?.split('.').pop()?.toUpperCase() || 'MP4'
  const fileSize = video?.size ? `${(video.size / (1024 * 1024)).toFixed(1)} MB` : '24.6 MB'
  const activeStep = steps[currentStep] || steps[steps.length - 1]

  return (
    <section className="animate-[pulse_.45s_ease-out_1] rounded-[30px] border border-white/10 bg-white/[.045] p-6 shadow-[0_30px_90px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.06)] backdrop-blur-2xl max-sm:rounded-3xl max-sm:p-4" aria-labelledby="analysis-title">
      <div className="grid grid-cols-[minmax(0,1fr)_260px] gap-6 max-lg:grid-cols-1">
        <div>
          <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[.2em] text-cyan-200/85">
            <span className="size-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_#21d8ee]" />
            Live processing
          </div>
          <h2 className="mt-4 text-[clamp(32px,4.6vw,56px)] font-semibold leading-[1.03] tracking-[-.045em]" id="analysis-title">Analyzing Video</h2>
          <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-[#a9bac1]">
            The system is extracting frames, detecting faces, running the AI model, generating heatmaps, and preparing the final report.
          </p>
        </div>

        <div className="rounded-[24px] border border-cyan-300/15 bg-[#071116]/75 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-cyan-200/75">Uploaded Video</p>
          <h3 className="mt-3 truncate text-lg font-bold text-white">{video?.name || 'sample_video.mp4'}</h3>
          <div className="mt-4 grid gap-2 text-sm text-[#9fb3bb]">
            <span>Format: <strong className="font-semibold text-slate-100">{fileFormat}</strong></span>
            <span>Size: <strong className="font-semibold text-slate-100">{fileSize}</strong></span>
            <span>Status: <strong className="font-semibold text-cyan-100">Processing</strong></span>
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-[26px] border border-white/[.08] bg-[#071116]/72 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Progress: {safeProgress}%</p>
            <p className="mt-1 text-sm text-[#8ea2aa]">Currently: <span className="font-semibold text-cyan-100">{activeStep?.title}</span></p>
          </div>
          <p className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100">{currentMessage}</p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/10">
          <div className="h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#67e8f9,#34d399)] shadow-[0_0_22px_rgba(34,211,238,.35)] transition-[width] duration-500 ease-out" style={{ width: `${safeProgress}%` }} />
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2 max-md:grid-cols-2">
          {['Frame 01', 'Frame 02', 'Frame 03', 'Frame 04'].map((frame, index) => (
            <div className={`rounded-2xl border px-3 py-3 text-center text-xs font-bold transition-all duration-500 ${index <= currentStep % 4 ? 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100' : 'border-white/[.07] bg-white/[.025] text-slate-500'}`} key={frame}>
              {frame}
            </div>
          ))}
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep, failedStep)
          const styles = statusStyles[status]

          return (
            <li className={`grid grid-cols-[44px_minmax(0,1fr)_92px] gap-4 rounded-[22px] border p-4 transition-all duration-500 max-sm:grid-cols-[40px_minmax(0,1fr)] ${styles.row}`} key={step.title}>
              <span className={`grid size-11 place-items-center rounded-2xl border ${styles.icon}`}>
                {step.icon ? <img className="size-6" src={step.icon} alt="" aria-hidden="true" /> : <StepMarker status={status} />}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full text-xs font-black ${styles.icon}`}>
                    <StepMarker status={status} />
                  </span>
                  <strong className="truncate text-sm font-bold text-white">{step.title}</strong>
                </span>
                <span className="mt-1 block text-[13px] leading-5 text-[#8ea2aa]">{step.description}</span>
              </span>
              <span className={`self-start rounded-full border border-current/20 px-2.5 py-1 text-center text-[10px] font-bold uppercase tracking-[.08em] max-sm:col-span-2 ${styles.text}`}>{status}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
