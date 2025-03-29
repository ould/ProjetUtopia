import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-action-selection',
    templateUrl: './action-selection.component.html',
    styleUrls: ['./action-selection.component.css'],
    standalone: false
})
export class ActionSelectionComponent implements OnInit {
  @Input() mission: any;
  actionDetails: any;

  ngOnInit(): void {
    if (this.mission) {
      // Get action details based on the event
      // This should ideally come from an API call
      this.actionDetails = {
        type: this.mission.actionType,
        min: this.mission.min,
        max: this.mission.max
      };
    }
  }
}