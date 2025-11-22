import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.css'
})
export class AreaChartComponent implements OnInit {
  @Input() title: string = 'Area Chart';
  points: any[] = [];
  pathData: string = '';
  areaPath: string = '';

  ngOnInit() {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.points = labels.map((label, i) => ({
      x: (i / (labels.length - 1)) * 100,
      y: Math.random() * 70 + 10,
      label
    }));
    this.createPaths();
  }

  createPaths() {
    const linePath = this.points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${100 - p.y}`
    ).join(' ');
    
    this.pathData = linePath;
    this.areaPath = `${linePath} L 100 100 L 0 100 Z`;
  }
}
