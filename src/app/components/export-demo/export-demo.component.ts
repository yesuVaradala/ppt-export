import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-export-demo',
  templateUrl: './export-demo.component.html',
  styleUrls: ['./export-demo.component.css']
})
export class ExportDemoComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: any = null;
  private scriptsLoaded = false;

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.loadScripts();
      this.initChart();
    } catch (err) {
      console.error('Failed loading scripts', err);
    }
  }

  ngOnDestroy(): void {
    if (this.chart && this.chart.destroy) {
      this.chart.destroy();
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // avoid adding duplicate script tags
      const existing = Array.from(document.getElementsByTagName('script')).find(s => s.src === src);
      if (existing) {
        if ((existing as any).loaded) { resolve(); return; }
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', (e) => reject(e));
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => { (s as any).loaded = true; resolve(); };
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  private async loadScripts(): Promise<void> {
    if (this.scriptsLoaded) return;
    await Promise.all([
      this.loadScript('https://cdn.jsdelivr.net/npm/chart.js'),
      this.loadScript('https://cdn.jsdelivr.net/npm/pptxgenjs@3.10.0/dist/pptxgen.bundle.js')
    ]);
    this.scriptsLoaded = true;
  }

  private initChart(): void {
    const Chart = (window as any).Chart;
    if (!Chart) {
      console.error('Chart.js not available');
      return;
    }
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
    const data = {
      labels,
      datasets: [{
        label: 'Sample Series',
        data: this.randomData(),
        borderColor: '#0078d4',
        backgroundColor: 'rgba(0,120,212,0.08)',
        tension: 0.3,
        fill: true,
      }]
    };
    const config = {
      type: 'line',
      data,
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } }
      }
    };
    this.chart = new Chart(ctx, config);
  }

  private randomData(): number[] {
    return Array.from({length: 8}, () => Math.floor(Math.random() * 100) + 10);
  }

  randomizeData(): void {
    if (!this.chart) return;
    this.chart.data.datasets[0].data = this.randomData();
    this.chart.update();
  }

  downloadPng(): void {
    const canvas = this.chartCanvas.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'chart.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async exportPptx(): Promise<void> {
    try {
      const canvas = this.chartCanvas.nativeElement;
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      const PptxGenJS = (window as any).PptxGenJS;
      if (!PptxGenJS) throw new Error('PptxGenJS not available');
      const pptx = new PptxGenJS();
      const slide = pptx.addSlide();
      slide.addText('Chart Export', { x:0.5, y:0.3, fontSize:18, bold:true });
      slide.addImage({ data: 'data:image/png;base64,' + base64, x:0.5, y:1, w:9, h:5 });
      await pptx.writeFile({ fileName: 'chart-export.pptx' });
    } catch (err) {
      const message = (err && (err as any).message) ? (err as any).message : String(err);
      alert('PPTX export failed: ' + message);
      console.error(err);
    }
  }
}
