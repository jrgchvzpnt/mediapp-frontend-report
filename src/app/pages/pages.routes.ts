import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { MedicComponent } from './medic/medic.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { ExamComponent } from './exam/exam.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit/specialty-edit.component';
import { ExamEditComponent } from './exam/exam-edit/exam-edit.component';
import { ConsultDetails } from '../Model/consultDetails';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { SearchComponent } from './search/search.component';

export const pageRoutes: Routes = [
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      { path: 'new', component: PatientEditComponent },
      { path: 'edit/:id', component: PatientEditComponent },
    ],
  },
  { path: 'medic', component: MedicComponent, },
  {
    path: 'specialty', component: SpecialtyComponent,
    children: [
      { path: 'new', component: SpecialtyEditComponent },
      { path: 'edit/:id', component: SpecialtyEditComponent },
    ]
  },
  {
    path: 'exam', component: ExamComponent,

    children: [
      { path: 'new', component: ExamEditComponent },
      { path: 'edit/:id', component: ExamEditComponent },
    ]
  },
  { path: 'consult-wizard', component: ConsultWizardComponent, },
  { path: 'search', component: SearchComponent, },

];
