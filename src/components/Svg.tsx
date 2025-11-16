import { useEffect, useState } from "react";

interface SvgProps {
  filename: string;
  className?: string;
}

export default function Svg({ filename, className }: SvgProps) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const APP_URL = import.meta.env.VITE_APP_URL;

    async function getSvg() {
      try {
        const response = await fetch(`${APP_URL}/svgs/${filename}.svg`);
        if (!response.ok) return;

        let html = await response.text();

        // --- parse the SVG and add/merge classes ---
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        if (svgEl) {
          const existing = svgEl.getAttribute("class") || "";
          const merged = `${existing} ${className || ""}`.trim();
          svgEl.setAttribute("class", merged);
          html = svgEl.outerHTML; // replace with updated SVG
        }

        setSvg(html);
      } catch (e) {
        console.error("Failed to load SVG:", e);
      }
    }

    getSvg();
  }, [filename, className]);

  return <span dangerouslySetInnerHTML={{ __html: svg }} />;
}
