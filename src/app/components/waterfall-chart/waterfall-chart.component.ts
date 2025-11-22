import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-waterfall-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waterfall-chart.component.html',
  styleUrl: './waterfall-chart.component.css'
})
export class WaterfallChartComponent implements OnInit {
  bars: any[] = [];

  ngOnInit() {
    const values = [50, 20, -15, 30, -10, 25];
    let running = 0;
    
    this.bars = values.map((val, i) => {
      const start = running;
      running += val;
      return {
        label: `Q${i + 1}`,
        value: val,
        start: Math.min(start, running),
        height: Math.abs(val),
        isPositive: val >= 0
      };
    });
  }
}
