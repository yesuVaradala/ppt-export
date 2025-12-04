import { Component } from '@angular/core';
import { ChartWidgetComponent } from '../chart-widget/chart-widget.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { DonutChartComponent } from '../donut-chart/donut-chart.component';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { StackedBarChartComponent } from '../stacked-bar-chart/stacked-bar-chart.component';
import { ScatterPlotComponent } from '../scatter-plot/scatter-plot.component';
import { BubbleChartComponent } from '../bubble-chart/bubble-chart.component';
import { RadarChartComponent } from '../radar-chart/radar-chart.component';
import { PolarChartComponent } from '../polar-chart/polar-chart.component';
import { HeatmapComponent } from '../heatmap/heatmap.component';
import { HistogramComponent } from '../histogram/histogram.component';
import { WaterfallChartComponent } from '../waterfall-chart/waterfall-chart.component';
import { FunnelChartComponent } from '../funnel-chart/funnel-chart.component';
import { TreemapComponent } from '../treemap/treemap.component';
import { BoxPlotComponent } from '../box-plot/box-plot.component';
import { CandlestickChartComponent } from '../candlestick-chart/candlestick-chart.component';
import pptxgen from 'pptxgenjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChartWidgetComponent,
    LineChartComponent,
    PieChartComponent,
    DonutChartComponent,
    AreaChartComponent,
    StackedBarChartComponent,
    ScatterPlotComponent,
    BubbleChartComponent,
    RadarChartComponent,
    PolarChartComponent,
    HeatmapComponent,
    HistogramComponent,
    WaterfallChartComponent,
    FunnelChartComponent,
    TreemapComponent,
    BoxPlotComponent,
    CandlestickChartComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isGenerating = false;

  async downloadData() {
    const widgetSelectors = Array.from(document.querySelectorAll('.chart-item')).map((el, i) => `.chart-item:nth-of-type(${i+1})`);
    await this.exportWidgetsToPPT(widgetSelectors);
  }

  async exportWidgetsToPPT(widgetSelectors: string[]) {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    const slideW = 10;
    const slideH = 5.625;
    const widgets: Array<{el: HTMLElement, rect: DOMRect, imageData: string, width: number, height: number}> = [];

    // Add a single title slide at the start
    const titleSlide = pptx.addSlide();
    titleSlide.addText('Complete Chart Library', {
      x: 1.5, y: 1.5, w: 7, h: 1.2,
      fontSize: 32, bold: true, align: 'center', color: '363636', fontFace: 'Arial'
    });
    titleSlide.addText(`Exported on ${new Date().toLocaleDateString()}`, {
      x: 1.5, y: 2.8, w: 7, h: 0.7,
      fontSize: 18, align: 'center', color: '666666', fontFace: 'Arial'
    });
    for (const selector of widgetSelectors) {
      const widget = document.querySelector(selector) as HTMLElement;
      if (!widget) continue;
      let imageData: string | undefined;
      const canvasEl = widget.querySelector('canvas');
      const svgEl = widget.querySelector('.polar-svg');
      if (svgEl) {
        // Polar Area chart as SVG: render SVG to canvas with white background
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
        // For non-canvas widgets, use html2canvas and set only widget background to white
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
        const rect = widget.getBoundingClientRect();
        const img = new window.Image();
        img.src = imageData;
        await new Promise(resolve => { img.onload = resolve; });
        widgets.push({ el: widget, rect, imageData, width: img.width, height: img.height });
      }
    }
    // Group widgets by row using their top position
    const rowThreshold = 30;
    let rows: Array<Array<typeof widgets[0]>> = [];
    let currentRow: Array<typeof widgets[0]> = [];
    let lastTop: number|null = null;
    for (const w of widgets) {
      if (lastTop === null || Math.abs(w.rect.top - lastTop) < rowThreshold) {
        currentRow.push(w);
        lastTop = w.rect.top;
      } else {
        rows.push(currentRow);
        currentRow = [w];
        lastTop = w.rect.top;
      }
    }
    if (currentRow.length) rows.push(currentRow);
    // Place rows on slides, matching browser layout
    const widgetPadding = 0.2;
    const rowPadding = 0.3;
    const maxRowsPerSlide = 2;
    let slideRows: Array<Array<Array<typeof widgets[0]>>> = [];
    for (let i = 0; i < rows.length; i += maxRowsPerSlide) {
      slideRows.push(rows.slice(i, i + maxRowsPerSlide));
    }
    for (const slideRowGroup of slideRows) {
      const slide = pptx.addSlide();
      const totalRowCount = slideRowGroup.length;
      let y = rowPadding;
      for (const row of slideRowGroup) {
        const widgetsInRow = row.length;
        const widgetW = (slideW - (widgetsInRow + 1) * widgetPadding) / widgetsInRow;
        const widgetH = (slideH - (totalRowCount + 1) * rowPadding) / totalRowCount;
        for (let col = 0; col < row.length; col++) {
          const w = row[col];
          let x = widgetPadding + col * (widgetW + widgetPadding);
          const aspect = w.width / w.height;
          let finalW = widgetW, finalH = widgetH;
          if (finalW / finalH > aspect) finalW = finalH * aspect;
          else finalH = finalW / aspect;
          x += (widgetW - finalW) / 2;
          let yCell = y + (widgetH - finalH) / 2;
          slide.addImage({ data: w.imageData, x, y: yCell, w: finalW, h: finalH });
        }
        y += widgetH + rowPadding;
      }
    }
    pptx.writeFile({ fileName: 'dashboard_export.pptx' });
  }

  async downloadPDF() {
    const widgetSelectors = Array.from(document.querySelectorAll('.chart-item')).map((el, i) => `.chart-item:nth-of-type(${i+1})`);
    await this.exportWidgetsToPDF(widgetSelectors);
  }

  async exportWidgetsToPDF(widgetSelectors: string[]) {
    // PDF in landscape 16:9 format (297mm x 167mm ~ A4 landscape proportions for 16:9)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [297, 167] // 16:9 aspect ratio in landscape
    });

    const pageW = 297;
    const pageH = 167;
    let isFirstPage = true;

    // Add title page
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Complete Chart Library', pageW / 2, pageH / 2 - 10, { align: 'center' });
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Exported on ${new Date().toLocaleDateString()}`, pageW / 2, pageH / 2 + 10, { align: 'center' });

    // Collect all widget images
    const widgets: Array<{el: HTMLElement, rect: DOMRect, imageData: string, width: number, height: number}> = [];

    for (const selector of widgetSelectors) {
      const widget = document.querySelector(selector) as HTMLElement;
      if (!widget) continue;

      let imageData: string | undefined;
      const canvasEl = widget.querySelector('canvas');
      const svgEl = widget.querySelector('.polar-svg');

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
        const rect = widget.getBoundingClientRect();
        const img = new window.Image();
        img.src = imageData;
        await new Promise(resolve => { img.onload = resolve; });
        widgets.push({ el: widget, rect, imageData, width: img.width, height: img.height });
      }
    }

    // Group widgets by row
    const rowThreshold = 30;
    let rows: Array<Array<typeof widgets[0]>> = [];
    let currentRow: Array<typeof widgets[0]> = [];
    let lastTop: number|null = null;

    for (const w of widgets) {
      if (lastTop === null || Math.abs(w.rect.top - lastTop) < rowThreshold) {
        currentRow.push(w);
        lastTop = w.rect.top;
      } else {
        rows.push(currentRow);
        currentRow = [w];
        lastTop = w.rect.top;
      }
    }
    if (currentRow.length) rows.push(currentRow);

    // Place rows on PDF pages
    const widgetPadding = 5;
    const rowPadding = 8;
    const maxRowsPerPage = 2;

    let pageRows: Array<Array<Array<typeof widgets[0]>>> = [];
    for (let i = 0; i < rows.length; i += maxRowsPerPage) {
      pageRows.push(rows.slice(i, i + maxRowsPerPage));
    }

    for (const pageRowGroup of pageRows) {
      if (!isFirstPage) {
        pdf.addPage();
      } else {
        pdf.addPage();
      }
      isFirstPage = false;

      const totalRowCount = pageRowGroup.length;
      let y = rowPadding;

      for (const row of pageRowGroup) {
        const widgetsInRow = row.length;
        const widgetW = (pageW - (widgetsInRow + 1) * widgetPadding) / widgetsInRow;
        const widgetH = (pageH - (totalRowCount + 1) * rowPadding) / totalRowCount;

        for (let col = 0; col < row.length; col++) {
          const w = row[col];
          let x = widgetPadding + col * (widgetW + widgetPadding);
          const aspect = w.width / w.height;
          let finalW = widgetW, finalH = widgetH;

          if (finalW / finalH > aspect) finalW = finalH * aspect;
          else finalH = finalW / aspect;

          x += (widgetW - finalW) / 2;
          let yCell = y + (widgetH - finalH) / 2;

          pdf.addImage(w.imageData, 'PNG', x, yCell, finalW, finalH);
        }
        y += widgetH + rowPadding;
      }
    }

    pdf.save('dashboard_export.pdf');
  }
}
