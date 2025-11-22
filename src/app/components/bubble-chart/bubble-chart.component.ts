import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bubble-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble-chart.component.html',
  styleUrl: './bubble-chart.component.css'
})
export class BubbleChartComponent implements OnInit {
  bubbles: any[] = [];
  colors = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  ngOnInit() {
    for (let i = 0; i < 15; i++) {
      this.bubbles.push({
        x: Math.random() * 85 + 5,
        y: Math.random() * 85 + 5,
        size: Math.random() * 10 + 3,
        color: this.colors[i % this.colors.length]
      });
    }
  }
}
