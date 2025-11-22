import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-funnel-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './funnel-chart.component.html',
  styleUrl: './funnel-chart.component.css'
})
export class FunnelChartComponent implements OnInit {
  stages: any[] = [];
  colors = ['#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb'];

  ngOnInit() {
    const labels = ['Awareness', 'Interest', 'Consideration', 'Intent', 'Purchase'];
    const values = [100, 75, 50, 30, 15];
    
    this.stages = labels.map((label, i) => ({
      label, value: values[i], width: values[i], color: this.colors[i]
    }));
  }
}
