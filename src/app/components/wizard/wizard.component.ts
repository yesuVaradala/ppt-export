import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css'
})
export class WizardComponent {
  @Input() size: 'small' | 'medium' | 'large' | 'extra-large' = 'medium';
  @Input() title: string = 'Setup Wizard';
  
  currentStep: number = 1;
  totalSteps: number = 4;

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  get progress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
