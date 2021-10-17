
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
import { Exercise } from "./excercise.model";

@Injectable()
export class TrainingService {

    private availableExercises: Exercise[] = []
    private runningExercise: Exercise;
    excerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();

    finishedExercisesChanged = new Subject<Exercise[]>();
    private finishedExercises: Exercise[] = [];
    private firebaseSubs: Subscription[] = [];


    constructor(private firestore: AngularFirestore,
        private uiService: UIService) {

    }

    getAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
        this.firebaseSubs.push(this.firestore.collection('availableExercises')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map(doc => {
                    let data = doc.payload.doc.data() as Exercise;
                    return {
                        id: doc.payload.doc.id,
                        name: data.name,
                        duration: data.duration,
                        calories: data.calories
                    }
                })
            })).subscribe((exs: Exercise[]) => {
                this.uiService.loadingStateChanged.next(false);
                this.availableExercises = exs;
                console.log(this.availableExercises)
                this.exercisesChanged.next([...this.availableExercises])
            }, error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar('Fetch exercises failed. Please try again later. ', "", 3000)
                this.exercisesChanged.next(undefined);
            }));
    }

    startExercise(selectedId: string) {
        console.log(selectedId);
        const selectedExercise = this.availableExercises.find(x => x.id === selectedId)!;
        this.runningExercise = selectedExercise;
        this.excerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
        this.runningExercise = null as any;
        this.excerciseChanged.next(null as any);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'canceled',
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100)
        });
        this.runningExercise = null as any;
        this.excerciseChanged.next(null as any);
    }
    getRunningExercise() {
        return { ...this.runningExercise }
    }
    getCompleteOrCancel() {
        this.firebaseSubs.push(this.firestore.collection('finishedExercises')
            .valueChanges()
            .subscribe(x => {
                let data = x as Exercise[];
                this.finishedExercisesChanged.next(data);
            }));
    }

    private addDataToDatabase(exercise: Exercise) {
        this.firestore.collection('finishedExercises').add(exercise);
    }

    cancelSubcription() {
        this.firebaseSubs.forEach(sub => {
            sub.unsubscribe();
        })
    }
}