import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candlestick-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candlestick-chart.component.html',
  styleUrl: './candlestick-chart.component.css'
})
export class CandlestickChartComponent implements OnInit {
  candles: any[] = [];

  ngOnInit() {
    for (let i = 0; i < 10; i++) {
      const open = Math.random() * 50 + 25;
      const close = Math.random() * 50 + 25;
      const high = Math.max(open, close) + Math.random() * 15;
      const low = Math.min(open, close) - Math.random() * 15;

      this.candles.push({
        open, close, high, low,
        isUp: close > open,
        bodyBottom: Math.min(open, close),
        bodyHeight: Math.abs(close - open)
      });
    }
  }
}
