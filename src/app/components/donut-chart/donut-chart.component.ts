import { Component, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.css'
})
export class DonutChartComponent implements AfterViewInit {
  @Input() title: string = 'Donut Chart';
  @ViewChild('chartCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
        datasets: [{
          data: [30, 25, 20, 15, 10],
          backgroundColor: ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'],
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 15, font: { size: 12 }, usePointStyle: true }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }
}
