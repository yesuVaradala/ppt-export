import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-chart.component.html',
  styleUrl: './radar-chart.component.css'
})
export class RadarChartComponent implements OnInit {
  points: string = '';
  labels: any[] = [];

  ngOnInit() {
    const categories = ['Speed', 'Power', 'Defense', 'Agility', 'Intelligence'];
    const values = categories.map(() => Math.random() * 40 + 10);
    const angleStep = 360 / categories.length;
    
    this.points = values.map((val, i) => {
      const angle = (i * angleStep - 90) * Math.PI / 180;
      const x = 50 + val * Math.cos(angle);
      const y = 50 + val * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');

    this.labels = categories.map((cat, i) => {
      const angle = (i * angleStep - 90) * Math.PI / 180;
      return {
        text: cat,
        x: 50 + 55 * Math.cos(angle),
        y: 50 + 55 * Math.sin(angle)
      };
    });
  }
}
