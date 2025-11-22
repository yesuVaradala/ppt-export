import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-box-plot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './box-plot.component.html',
  styleUrl: './box-plot.component.css'
})
export class BoxPlotComponent implements OnInit {
  plots: any[] = [];

  ngOnInit() {
    ['Dataset 1', 'Dataset 2', 'Dataset 3'].forEach(label => {
      this.plots.push({
        label,
        min: Math.random() * 20,
        q1: Math.random() * 20 + 20,
        median: Math.random() * 20 + 40,
        q3: Math.random() * 20 + 60,
        max: Math.random() * 20 + 80
      });
    });
  }
}
