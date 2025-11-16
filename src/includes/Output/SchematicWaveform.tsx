import  { useRef, useEffect, useState } from "react";

export default function SchematicWaveform({ signals = [], timescale = "?" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const zoomLabelRef = useRef(null);
  const emptyRef = useRef(null);
  const timescaleLabelRef = useRef(null);

  const [zoom, setZoom] = useState(1);

  // --- Render waveform on every zoom or signal change ---
  useEffect(() => {
    drawWaveform();
  }, [signals, zoom]);

  // --- Draw waveform ---
  function drawWaveform() {
    const canvas:any = canvasRef.current;
    const container:any = containerRef.current;
    const empty:any = emptyRef.current;

    const ctx = canvas.getContext("2d");
    const padding = 20;
    const rowHeight = 50;
    const leftMargin = 140;

    if (!signals.length) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    const baseWidth = Math.max(300, container.clientWidth - padding * 2);
    const drawWidth = Math.max(1, (baseWidth - leftMargin - padding) * zoom);
    const width = leftMargin + drawWidth + padding;
    const height = signals.length * rowHeight + padding * 2;

    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);

    ctx.font = "12px 'Fira Code', monospace";
    ctx.fillStyle = "#e5e9f0";

    // find max time
    const maxTime = Math.max(
      1,
      ...signals.map((sig:any) => {
        const last = sig.transitions?.[sig.transitions.length - 1] || { time: 0 };
        return Number(last.time) || 0;
      })
    );

    const scale = drawWidth / maxTime;

    signals.forEach((signal:any, index:any) => {
      const baseY = padding + index * rowHeight + rowHeight / 2;
      ctx.fillStyle = "#e5e9f0";
      ctx.fillText(signal.name, 10, baseY + 4);

      const transitions = signal.transitions?.map((t:any) => ({
        time: Number(t.time) || 0,
        value: String(t.value || "x"),
      })) || [];

      if (!transitions.length) return;

      let lastTime = transitions[0].time;
      let lastValue = transitions[0].value;

      const amplitude = 15;

      const levelForValue = (val:any) =>
        val === "1" ? baseY - amplitude :
        val === "0" ? baseY + amplitude :
        baseY;

      ctx.strokeStyle = "#89d5ff";
      ctx.lineWidth = 2;

      const drawSegment = (start:any, end:any, value:any, nextValue:any) => {
        const x1 = leftMargin + start * scale;
        const x2 = leftMargin + end * scale;
        const level = levelForValue(value);

        ctx.beginPath();
        ctx.moveTo(x1, level);
        ctx.lineTo(x2, level);
        ctx.stroke();

        if (nextValue !== undefined && nextValue !== value) {
          ctx.beginPath();
          ctx.moveTo(x2, level);
          ctx.lineTo(x2, levelForValue(nextValue));
          ctx.stroke();
        }

        if (signal.size > 1 || /[^01]/.test(value)) {
          ctx.fillStyle = "#f5f5f5";
          ctx.fillText(value, x1 + 4, baseY - amplitude - 4);
          ctx.fillStyle = "#e5e9f0";
        }
      };

      for (let i = 1; i < transitions.length; i++) {
        drawSegment(lastTime, transitions[i].time, lastValue, transitions[i].value);
        lastValue = transitions[i].value;
        lastTime = transitions[i].time;
      }

      drawSegment(lastTime, maxTime, lastValue, null);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftMargin, baseY + amplitude);
      ctx.lineTo(width - padding, baseY + amplitude);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(leftMargin, baseY - amplitude);
      ctx.lineTo(width - padding, baseY - amplitude);
      ctx.stroke();
    });

    ctx.fillStyle = "#7f8ca3";
    ctx.fillText(`Timescale: ${timescale}`, leftMargin, height - 8);
  }

  // --- Zoom Controls ---
  const adjustZoom = (delta:any) => {
    setZoom((z) => Math.max(0.25, Math.min(4, z + delta)));
  };

  const resetZoom = () => setZoom(1);

  return (
    <div className="w-full">
      <div className="waveform-toolbar flex gap-2 items-center text-white mb-2">
        <button onClick={() => adjustZoom(-0.25)}>-</button>
        <button onClick={() => adjustZoom(+0.25)}>+</button>
        <button onClick={resetZoom}>Reset</button>
        <span ref={zoomLabelRef}>{Math.round(zoom * 100)}%</span>
        <span ref={timescaleLabelRef}>Timescale: {timescale}</span>
      </div>

      <div
        id="waveform-container"
        className="waveform-container bg-black p-2 relative"
        ref={containerRef}
      >
        <canvas ref={canvasRef} width="800" height="400" />
        <div
          ref={emptyRef}
          className="waveform-empty text-gray-500 absolute top-1/2 left-1/2 -translate-x-1/2"
        >
          Run a simulation to view waveforms.
        </div>
      </div>
    </div>
  );
}
