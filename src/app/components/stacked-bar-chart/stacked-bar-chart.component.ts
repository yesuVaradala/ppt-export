import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stacked-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stacked-bar-chart.component.html',
  styleUrl: './stacked-bar-chart.component.css'
})
export class StackedBarChartComponent implements OnInit {
  @Input() title: string = 'Stacked Bar Chart';
  bars: any[] = [];

  ngOnInit() {
    const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
    this.bars = labels.map(label => ({
      label,
      segments: [
        { value: Math.random() * 30 + 20, color: '#1976d2' },
        { value: Math.random() * 30 + 20, color: '#4caf50' },
        { value: Math.random() * 30 + 20, color: '#ff9800' }
      ]
    }));
  }
}
