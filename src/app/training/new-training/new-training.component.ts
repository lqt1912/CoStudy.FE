import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Exercise } from '../excercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  newTrainingForm: FormGroup;
  selectedExercise: string = "";
  excercises: Exercise[];
  exercisesSubcription: Subscription;

  isLoadingSubs: Subscription;
  isLoading: boolean = false;
  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnDestroy(): void {
    if (this.exercisesSubcription) {
      this.exercisesSubcription.unsubscribe();
    }
    if (this.isLoadingSubs) {
      this.isLoadingSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.isLoadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.exercisesSubcription = this.trainingService.exercisesChanged.subscribe(
      exs => {
        this.excercises = exs
      }
    );
    this.trainingService.getAvailableExercises();
    this.newTrainingForm = new FormGroup(
      {
        exercise: new FormControl("", {
          validators: [Validators.required]
        })
      }
    )
  }

  fetchAgain() {
    this.trainingService.getAvailableExercises();
  }
  onStartTraining() {
    this.trainingService.startExercise(this.selectedExercise);
  }

}
