import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

@Component({
  selector: 'app-export-demo',
  templateUrl: './export-demo.component.html',
  styleUrls: ['./export-demo.component.css']
})
export class ExportDemoComponent {
  isGenerating = false;

  async downloadWidgets() {
    this.isGenerating = true;
    const widgetItems = document.querySelectorAll('.demo-widget');
    const zip = new JSZip();

    for (let i = 0; i < widgetItems.length; i++) {
      const widget = widgetItems[i] as HTMLElement;
      const canvas = await html2canvas(widget, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        scale: 2
      });
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const base64 = dataUrl.split(',')[1];
      zip.file(`widget-${i + 1}.png`, base64, {base64: true});
    }

    zip.generateAsync({type: 'blob'}).then((blob: Blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'demo-widgets.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      this.isGenerating = false;
    });
  }
}