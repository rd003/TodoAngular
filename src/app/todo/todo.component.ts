import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { TodoStore } from "./todo.store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { TodoModel } from "./todo.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: `app-todo`,
  imports: [
    NgIf,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatButtonModule,
    NgFor,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  standalone: true,
  template: `
    <div class="main-container">
      <h1>Todo Items</h1>

      <div class="list-container" *ngIf="vm$ | async as vm">
        <mat-spinner [diameter]="20" color="blue" *ngIf="vm.loading">
        </mat-spinner>

        <ng-container *ngIf="vm.error; else noError">{{
          vm.error
        }}</ng-container>
        <ng-template #noError>
          <ul class="todo-list">
            <li
              class="list-item"
              *ngFor="let todoItem of vm.todos; trackBy: trackById"
            >
              <input
                type="checkbox"
                [checked]="todoItem.isCompleted"
                (click)="toggleCompletion(todoItem)"
              />
              <span
                [style]="{
                  'text-decoration': todoItem.isCompleted
                    ? ' line-through'
                    : 'none'
                }"
                >{{ todoItem.description }}</span
              >
              <button
                type="button"
                matButton
                mat-raised-button
                color="warn"
                (click)="deleteTodoItem(todoItem.id)"
              >
                X
              </button>
            </li>
          </ul>
        </ng-template>
      </div>
      <form class="form-container" [formGroup]="todoForm" (ngSubmit)="onPost()">
        <mat-form-field appearance="outline">
          <input matInput formControlName="description" />
        </mat-form-field>
        <button
          class="submit-button"
          [disabled]="todoForm.invalid"
          mat-raised-button
          color="primary"
        >
          Add
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .main-container {
        padding: 20px 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100vh;
      }

      .list-container {
        flex: 1;
      }

      .todo-list {
        list-style: none;
      }

      .list-item {
        display: flex;
        gap: 10px;
        font-size: 26px;
        align-items: center;
        height: 100%;
        padding: 2px 0px;
      }

      .form-container {
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
        justify-content: center;
      }

      mat-form-field {
        width: 700px;
      }

      .submit-button {
        font-size: 19px;
        line-height: 3vw !important;
        padding: 10px !important;
      }

      input[type="checkbox"] {
        /* Double-sized Checkboxes */
        -ms-transform: scale(2); /* IE */
        -moz-transform: scale(2); /* FF */
        -webkit-transform: scale(2); /* Safari and Chrome */
        -o-transform: scale(2); /* Opera */
        transform: scale(2);
        padding: 10px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(TodoStore)],
})
export class TodoComponent {
  todoStore = inject(TodoStore);
  fb = inject(FormBuilder);
  vm$ = this.todoStore.vm$;

  todoForm: FormGroup = this.fb.group({
    id: [0],
    description: ["", Validators.required],
    isCompleted: [false],
  });

  trackById(index: number, todoItem: TodoModel) {
    return todoItem.id;
  }

  onPost() {
    const todo: TodoModel = Object.assign(this.todoForm.value);
    this.todoStore.addTodo(todo);
    this.todoForm.reset();
  }

  toggleCompletion(todoItem: TodoModel) {
    todoItem.isCompleted = !todoItem.isCompleted;
    this.todoStore.updateTodo(todoItem);
    // do something
  }

  deleteTodoItem(id: number) {
    if (window.confirm("Are you sure to delete this item??")) {
      this.todoStore.deleteTodo(id);
    }
  }
}
