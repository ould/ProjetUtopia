import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActionService } from '../services/action.service';

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.css']
})
export class CalendrierComponent implements OnInit {
  missions: any[] = [];
  filteredMissions: any[] = [];
  selectedDate: NgbDateStruct | null = null;
  selectedMission: any;
  
  
  
  constructor(private actionService: ActionService) {
  }
  
  ngOnInit(): void {
    this.actionService.getMissions().subscribe(data => {
      this.missions = data.missions;
    });
    let date=new Date();
    this.selectedDate =  {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    this.filterMissionsByDate(this.selectedDate)
  }

  filterMissionsByDate(date: NgbDateStruct): void {
    const selectedDateString = `${date.year}-${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}`;
    this.filteredMissions = this.missions.filter(mission => mission.date === selectedDateString);
    this.selectedMission = null;  
  }

  onMissionSelected(mission: any): void {
    this.selectedMission = mission;
  }



  
}