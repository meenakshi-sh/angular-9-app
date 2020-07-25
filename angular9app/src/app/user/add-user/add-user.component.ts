import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  userform: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    // password not required in edit mode
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.userform = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', passwordValidators],
      address: ['', Validators.required],
    });

    if (!this.isAddMode) {
      this.userService
        .getById(this.id)
        .pipe(first())
        .subscribe((x) => {
          this.f.name.setValue(x.name);
          this.f.email.setValue(x.email);
          this.f.address.setValue(x.address);
        });
    }
  }

  // convenience getter for easy access to userform fields
  get f() {
    return this.userform.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if userform is invalid
    if (this.userform.invalid) {
      return;
    }

    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  private createUser() {
    this.userService
      .addUser(this.userform.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['user']);
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  private updateUser() {
    this.userService
      .update(this.id, this.userform.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        (error) => {
          this.loading = false;
        }
      );
  }
}
