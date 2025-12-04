/**
 * ExportDashboardService Usage Guide
 * ----------------------------------
 *
 * This service provides a plug-and-play method to export dashboard widgets to a PPTX file.
 *
 * How to Use:
 * 1. Import and inject ExportDashboardService in your Angular component:
 *      import { ExportDashboardService } from 'src/app/services/export-dashboard.service';
 *      constructor(private exportService: ExportDashboardService) {}
 *
 * 2. Add an export button to your template:
 *      <button (click)="exportDashboard()">Export Dashboard</button>
 *
 * 3. In your component, call the service method:
 *      exportDashboard() {
 *        this.exportService.exportToPPT(['.chart-item', '.polar-svg'], 'My Dashboard');
 *      }
 *
 *    - Pass an array of CSS selectors for widgets you want to export.
 *    - Optionally pass a custom title for the PPTX file.
 *
 * Features:
 * - Handles canvas, SVG, and HTML widgets automatically.
 * - Adds a title slide with export date.
 * - Works in any Angular project—just import and use.
 *
 * Advanced:
 * - You can customize selectors, title, and PPTX layout as needed.
 * - For more widgets, add their selectors to the array.
 *
 * Troubleshooting:
 * - Ensure widgets are visible in the DOM before export.
 * - For merge conflicts or git issues, see GIT_COMMANDS.md.
 *
 * For questions, ask your team lead or see the official Angular and Git documentation.
 */
import { Injectable } from '@angular/core';
import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class ExportDashboardService {
  /**
   * Export widgets to PPTX file.
   * @param widgetSelectors Array of CSS selectors for widgets to export
   * @param title Title for the PPTX (optional)
   */
  async exportToPPT(widgetSelectors: string[], title: string = 'Dashboard Export') {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    // Add title slide
    const titleSlide = pptx.addSlide();
    titleSlide.addText(title, { x: 1.5, y: 1.5, w: 7, h: 1.2, fontSize: 32, bold: true, align: 'center', color: '363636', fontFace: 'Arial' });
    titleSlide.addText(`Exported on ${new Date().toLocaleDateString()}`, { x: 1.5, y: 2.8, w: 7, h: 0.7, fontSize: 18, align: 'center', color: '666666', fontFace: 'Arial' });
    // Export widgets
    for (const selector of widgetSelectors) {
      const widget = document.querySelector(selector) as HTMLElement;
      if (!widget) continue;
      let imageData: string | undefined;
      const canvasEl = widget.querySelector('canvas');
      const svgEl = widget.querySelector('svg');
      if (svgEl) {
        // SVG export
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new window.Image();
        img.src = url;
        await new Promise(resolve => { img.onload = resolve; });
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = svgEl.clientWidth || 400;
        tempCanvas.height = svgEl.clientHeight || 300;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          imageData = tempCanvas.toDataURL('image/png', 1.0);
        }
        URL.revokeObjectURL(url);
      } else if (canvasEl && canvasEl instanceof HTMLCanvasElement) {
        imageData = canvasEl.toDataURL('image/png', 1.0);
      } else {
        // html2canvas fallback
        const originalBg = widget.style.background;
        widget.style.background = '#fff';
        const overlays = widget.querySelectorAll('.overlay, .tooltip, .mask');
        overlays.forEach(el => (el as HTMLElement).style.display = 'none');
        const canvas = await html2canvas(widget, {
          useCORS: true,
          allowTaint: false,
          scale: 2,
          backgroundColor: '#fff'
        });
        imageData = canvas.toDataURL('image/png', 1.0);
        widget.style.background = originalBg;
        overlays.forEach(el => (el as HTMLElement).style.display = '');
      }
      if (imageData) {
        const slide = pptx.addSlide();
        slide.addImage({ data: imageData, x: 0.5, y: 0.5, w: 9, h: 4.5 });
      }
    }
    pptx.writeFile({ fileName: 'dashboard_export.pptx' });
  }

  /**
   * Export widgets to PDF file (16:9 landscape).
   * @param widgetSelectors Array of CSS selectors for widgets to export
   * @param title Title for the PDF (optional)
   */
  async exportToPDF(widgetSelectors: string[], title: string = 'Dashboard Export') {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 167] // 16:9 aspect ratio
    });

    const pageW = 297;
    const pageH = 167;

    // Add title page
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, pageW / 2, pageH / 2 - 10, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Exported on ${new Date().toLocaleDateString()}`, pageW / 2, pageH / 2 + 10, { align: 'center' });

    // Export widgets
    for (const selector of widgetSelectors) {
      const widget = document.querySelector(selector) as HTMLElement;
      if (!widget) continue;

      let imageData: string | undefined;
      const canvasEl = widget.querySelector('canvas');
      const svgEl = widget.querySelector('svg');

      if (svgEl) {
        // SVG export
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new window.Image();
        img.src = url;
        await new Promise(resolve => { img.onload = resolve; });
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = svgEl.clientWidth || 400;
        tempCanvas.height = svgEl.clientHeight || 300;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          imageData = tempCanvas.toDataURL('image/png', 1.0);
        }
        URL.revokeObjectURL(url);
      } else if (canvasEl && canvasEl instanceof HTMLCanvasElement) {
        imageData = canvasEl.toDataURL('image/png', 1.0);
      } else {
        // html2canvas fallback
        const originalBg = widget.style.background;
        widget.style.background = '#fff';
        const overlays = widget.querySelectorAll('.overlay, .tooltip, .mask');
        overlays.forEach(el => (el as HTMLElement).style.display = 'none');
        const canvas = await html2canvas(widget, {
          useCORS: true,
          allowTaint: false,
          scale: 2,
          backgroundColor: '#fff'
        });
        imageData = canvas.toDataURL('image/png', 1.0);
        widget.style.background = originalBg;
        overlays.forEach(el => (el as HTMLElement).style.display = '');
      }

      if (imageData) {
        pdf.addPage();
        // Center image on page with margins
        const margin = 13; // ~0.5 inch margin
        const imgW = pageW - (margin * 2);
        const imgH = pageH - (margin * 2);
        pdf.addImage(imageData, 'PNG', margin, margin, imgW, imgH);
      }
    }

    pdf.save('dashboard_export.pdf');
  }
}

/**
 * Usage Example:
 *
 * 1. Inject ExportDashboardService in your component:
 *    constructor(private exportService: ExportDashboardService) {}
 *
 * 2. Call exportToPPT when button is clicked:
 *    this.exportService.exportToPPT(['.chart-item', '.polar-svg'], 'My Dashboard');
 *
 * 3. Call exportToPDF for PDF export:
 *    this.exportService.exportToPDF(['.chart-item', '.polar-svg'], 'My Dashboard');
 *
 *  - Pass an array of widget selectors to export.
 *  - Optionally pass a custom title for the PPTX/PDF.
 */
