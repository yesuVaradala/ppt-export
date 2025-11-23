import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-polar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './polar-chart.component.html',
  styleUrl: './polar-chart.component.css'
})
export class PolarChartComponent implements OnInit {
  slices: any[] = [];
  colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4'];

  ngOnInit() {
    const values = [30, 25, 35, 20, 28, 22];
    const angleStep = 360 / values.length;

    this.slices = values.map((val, i) => {
      const angle = i * angleStep;
      return {
        value: val,
        color: this.colors[i],
        path: this.createSlice(angle, angleStep, val)
      };
    });
  }

  createSlice(startAngle: number, angleSpan: number, radius: number) {
    const start = this.polar(startAngle, radius);
    const end = this.polar(startAngle + angleSpan, radius);
    return `M 50 50 L ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y} Z`;
  }

  polar(angle: number, radius: number) {
    const rad = (angle - 90) * Math.PI / 180;
    return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
  }
}
