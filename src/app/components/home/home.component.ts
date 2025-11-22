// Reusable helper for PPT export
export async function exportWidgetsToPPT(widgetSelectors: string[]) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  const slideW = 10; // pptxgen default width in inches for 16x9
  const slideH = 5.625; // pptxgen default height in inches for 16x9

  for (const selector of widgetSelectors) {
    const widget = document.querySelector(selector) as HTMLElement;
    if (!widget) continue;

    let imageData: string | undefined;
    // Canvas widget: use native toDataURL for sharpness
    const canvasEl = widget.querySelector('canvas');
    if (canvasEl && canvasEl instanceof HTMLCanvasElement) {
      imageData = canvasEl.toDataURL('image/png', 1.0);
    } else {
      // HTML/SVG widget: use html2canvas
      const canvas = await html2canvas(widget, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        backgroundColor: '#fff'
      });
      imageData = canvas.toDataURL('image/png', 1.0);
    }

    if (imageData) {
      // Proportional layout: fit image to slide, maintain aspect ratio
      const slide = pptx.addSlide();
  // slideW and slideH already defined above

      // Get widget aspect ratio
      const img = new Image();
      img.src = imageData;
      await new Promise(resolve => { img.onload = resolve; });

      let w = slideW * 0.8;
      let h = (img.height / img.width) * w;
      if (h > slideH * 0.7) {
        h = slideH * 0.7;
        w = (img.width / img.height) * h;
      }
      const x = (slideW - w) / 2;
      const y = (slideH - h) / 2;

      slide.addImage({ data: imageData, x, y, w, h });
    }
  }

  pptx.writeFile({ fileName: 'dashboard_export.pptx' });
}
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
import JSZip from 'jszip';

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
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
  isGenerating = false;

  async downloadData() {
    // Example: select all widgets with class 'chart-item'
    const widgetSelectors = Array.from(document.querySelectorAll('.chart-item')).map((el, i) => `.chart-item:nth-of-type(${i+1})`);
    await exportWidgetsToPPT(widgetSelectors);
  }
}
