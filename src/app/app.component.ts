import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    TableModule,
    Select,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  registrationForm: FormGroup;
  users: Array<{ firstName: string; lastName: string; email: string; university: string }> = [];
  universities = [
    { label: 'Harvard University', value: 'Harvard University' },
    { label: 'Stanford University', value: 'Stanford University' },
    { label: 'MIT', value: 'MIT' },
    { label: 'Oxford University', value: 'Oxford University' },
    { label: 'Cambridge University', value: 'Cambridge University' },
    { label: 'Yale University', value: 'Yale University' },
    { label: 'Princeton University', value: 'Princeton University' }
  ];


  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      university: ['', [Validators.required]]
    });
  }

  onSubmit() {
    let email = this.registrationForm.value.email;
    let userEmails = this.users.map(user => user.email)
    if (email) {
      let domain = email.split('@')[1];
      if (domain !== 'mail.com') {
        this.registrationForm.get('email')?.setErrors({invalidDomain: true})
      } else {
        this.registrationForm.get('email')?.setErrors(null); 
        if (userEmails.includes(email)) {
          this.registrationForm.get('email')?.setErrors({duplicateEmail: true})
         } else {
          this.registrationForm.get('email')?.setErrors(null)
         }
      }
   }

    if (this.registrationForm.valid) {
      this.users.push(this.registrationForm.value);
      console.log('User added:', this.registrationForm.value);
      console.log('All users:', this.users);
      this.registrationForm.reset();
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }


  onDelete(index: number) {
    console.log(this.users[index].email)
    this.users = this.users.splice(0, index)
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    // console.log(field?.errors)
    if (field?.touched && field?.invalid) {
      if (field.errors?.['required']) {
        return 'This field is required';
      }
      if (field.errors?.['minlength']) {
        return 'Minimum length is 2 characters';
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email';
      }
      if (field.errors?.['invalidDomain']) {
        return 'Email domain must be mail.com';
      }
      if (field.errors?.['duplicateEmail']) {
        return 'Email already exists'
      }
    }
    return '';
  }
}
