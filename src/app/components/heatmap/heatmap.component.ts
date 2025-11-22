import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.css'
})
export class HeatmapComponent implements OnInit {
  cells: any[] = [];

  ngOnInit() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['6am', '12pm', '6pm'];
    
    days.forEach((day, i) => {
      hours.forEach((hour, j) => {
        this.cells.push({
          day, hour, value: Math.random(),
          color: this.getColor(Math.random())
        });
      });
    });
  }

  getColor(val: number) {
    const intensity = Math.floor(val * 255);
    return `rgb(25, ${118 + intensity / 3}, ${210 - intensity / 2})`;
  }
}
