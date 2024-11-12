import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../Model/exam';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-exam-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './exam-edit.component.html',
  styleUrl: './exam-edit.component.css'
})
export class ExamEditComponent  implements OnInit {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route:ActivatedRoute, 
    private router: Router,
    private examService: ExamService
  ){}
 
 
 
 
  ngOnInit(): void {
    this.form = new FormGroup({
      idExam: new FormControl(0),
      name: new FormControl('', [Validators.required, Validators.minLength(3)] ),
      description: new FormControl('', [Validators.required, Validators.minLength(3)] ),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }


  initForm(){
    if (this.isEdit) {
      this.examService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idSpecialty: new FormControl(data.idExam),
          name: new FormControl(data.nameExam, [Validators.required, Validators.minLength(3)]),
          description: new FormControl(data.descriptionExam, [Validators.required, Validators.minLength(3)]),
        });
      });
    }
  }


  operate() {
    if (this.form.invalid) { return;}

    const exam: Exam = new Exam();
    exam.idExam = this.form.value['idExam'];
    exam.nameExam = this.form.value['name'];
    exam.descriptionExam = this.form.value['description'];
   

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      this.examService.update(this.id, exam).subscribe(() => {
        this.examService.findAll().subscribe((data) => {
         this.examService.setExamChange(data);
          this.examService.setMessageChange('UPDATED!');
        });
      });
    } else {
      //INSERT
      this.examService
        .save(exam)
        .pipe(switchMap(() => this.examService.findAll()))
        .subscribe((data) => {
          this.examService.setExamChange(data);
          this.examService.setMessageChange('CREATED!');
        });
    }
    this.router.navigate(['/pages/exam']);
  }


  get f(){
    return this.form.controls;
  }

}
