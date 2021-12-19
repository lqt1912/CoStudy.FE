import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  ongoingTraining = false;
  excerciseSubcription: Subscription = new Subscription();

  constructor(private trainingService: TrainingService) { }
  ngOnDestroy(): void {
    if (this.excerciseSubcription) {
      this.excerciseSubcription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.excerciseSubcription = this.trainingService.excerciseChanged.subscribe(ex => {
      if (ex) {
        this.ongoingTraining = true;
      } else { this.ongoingTraining = false; }
    })
  }

}
