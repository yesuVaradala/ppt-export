import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scatter-plot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scatter-plot.component.html',
  styleUrl: './scatter-plot.component.css'
})
export class ScatterPlotComponent implements OnInit {
  @Input() title: string = 'Scatter Plot';
  points: any[] = [];

  ngOnInit() {
    for (let i = 0; i < 30; i++) {
      this.points.push({
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        size: Math.random() * 3 + 2
      });
    }
  }
}
