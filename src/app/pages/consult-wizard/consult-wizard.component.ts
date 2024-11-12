import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Patient } from '../../Model/patient';
import { Exam } from '../../Model/exam';
import { Medic } from '../../Model/medic';
import { Specialty } from '../../Model/specialty';
import { map, Observable } from 'rxjs';
import { SpecialtyService } from '../../services/specialty.service';
import { PatientService } from '../../services/patient.service';
import { ExamService } from '../../services/exam.service';
import { MedicService } from '../../services/medic.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { ConsultDetails } from '../../Model/consultDetails';
import { MatStepper } from '@angular/material/stepper';
import { Consult } from '../../Model/consult';
import { format, formatISO } from 'date-fns';
import { ConsultListExamDTOI } from '../../Model/consultListExamDTOI';
import { ConsultService } from '../../services/consult.service';






@Component({
  selector: 'app-consult-wizard',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe, CommonModule, NgClass],
  templateUrl: './consult-wizard.component.html',
  styleUrl: './consult-wizard.component.css'
})
export class ConsultWizardComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  patients: Patient[];
  exams: Exam[];
  medics: Medic[];
  specialties$: Observable<Specialty[]>;
  examsFiltered$: Observable<Exam[]>

  examControl: FormControl = new FormControl();
  consultArray: number[] = [];

  minDate: Date = new Date();
  details: ConsultDetails[] = [];
  examsSelected: Exam[] = [];
  medicSelected: Medic;

  consultSelected:  number;
  @ViewChild('stepper') stepper: MatStepper;



  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private specialtyService: SpecialtyService,
    private examService: ExamService,
    private medicService: MedicService,
    private consultService: ConsultService,
    private _snackBar: MatSnackBar
  ){}


  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      patient: [new FormControl(), Validators.required],
      specialty: [new FormControl(), Validators.required],
      consultDate: [new FormControl(new Date()), Validators.required],
      exam: [this.examControl, Validators.required],
      diagnosis: new FormControl('', Validators.required),
      treatment: new FormControl('', Validators.required),
    });

    this.secondFormGroup = this.formBuilder.group({

    });

    this.loadInitialData();
    this.examsFiltered$ = this.examControl.valueChanges.pipe(map(val => this.filterExam(val)));

    for (let i = 1; i <= 100; i++) {
      this.consultArray.push(i);
    }

    
  }

  loadInitialData(){
    this.patientService.findAll().subscribe(data => this.patients = data);
    this.specialties$ =  this.specialtyService.findAll();
    this.examService.findAll().subscribe(data => this.exams = data);
    this.medicService.findAll().subscribe(data => this.medics = data);
  }

  getDate(e: any){
    console.log(e.value);
  }

  addDetail(){
    const det = new ConsultDetails();
    det.diagnosis = this.firstFormGroup.value['diagnosis'];
    det.treatment = this.firstFormGroup.value['treatment'];

    this.details.push(det);
  }

  removeDetail(index: number){
    this.details.splice(index, 1);
  }

  filterExam(val : any){

    if (val?.idExam > 0 ){
      return this.exams.filter(el => 
        el.nameExam.toLowerCase().includes(val.nameExam.toLowerCase()) || el.descriptionExam.toLowerCase().includes(val.descriptionExam.toLowerCase())
      )      
    }
    else{
      return this.exams.filter(el => 
        el.nameExam.toLowerCase().includes(val?.toLowerCase()) || el.descriptionExam.toLowerCase().includes(val?.toLowerCase())
      )
    }
  }

  showExam(val: any){
    return val ?  `${val.nameExam}` : val;
  }

  addExam(){
    const tmpExam = this.firstFormGroup.value['exam'].value;
    if (tmpExam != null){
      this.examsSelected.push(tmpExam);
    }else{
      this._snackBar.open("Please select an examn", 'INFO', {duration: 2000});
    }

  }

  selectMedic(m: Medic){
    this.medicSelected = m;
   }

   selectConsult(n: number){
    this.consultSelected = n;

   }
   nextManualStep(){
    if (this.consultSelected > 0){
      this.stepper.next();
    }
    else{
      this._snackBar.open('Please select a consult number', 'INFO', {duration: 200});
    }
   }

   get f(){
    return this.firstFormGroup.controls;
   }

   save(){
      const consult = new Consult();
      consult.patient = this.firstFormGroup.value['patient'];
      consult.specialty = this.firstFormGroup.value['specialty'];
      consult.medic = this.medicSelected;
      consult.details = this.details;
      consult.numConsult = `C${this.consultSelected}`;
      consult.consultDate =  format(this.firstFormGroup.value['consultDate'], "yyyy-MM-dd'T'HH:mm:ss");
      //consult.consultDate =  "2024-11-11T19:47:55";

      const dto: ConsultListExamDTOI = {
        consult: consult,
        lstExam: this.examsSelected
      };

      this.consultService.saveTransactional(dto).subscribe( () => {
        this._snackBar.open('CREATED!', 'INFO', {duration: 2000});

        setTimeout(() => {
          this.cleanControls();
          
        }, 2000);
      })
      console.log(consult);
   }

   
   cleanControls(){
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();
        this.stepper.reset();
        this.details= [];
        this.examsSelected = [];
        this.consultSelected = 0;
        this.medicSelected = null;
   }



}

