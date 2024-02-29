import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { TodoStore } from "./todo.store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { TodoModel } from "./todo.model";

@Component({
  selector: `app-todo`,
  imports: [
    NgIf,
    AsyncPipe,
    MatProgressSpinnerModule,
    NgFor,
    ReactiveFormsModule,
  ],
  standalone: true,
  template: `
    <div
      class="main-container"
      style="padding:20px 10px;display: flex;flex-direction:column"
    >
      <h1>Todo Items</h1>

      <div class="list-container" *ngIf="vm$ | async as vm">
        <mat-spinner [diameter]="20" color="blue" *ngIf="vm.loading">
        </mat-spinner>

        <ng-container *ngIf="vm.error; else noError">{{
          vm.error
        }}</ng-container>
        <ng-template #noError>
          <ul>
            <li *ngFor="let todoItem of vm.todos; trackBy: trackById">
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
              <button type="button" (click)="deleteTodoItem(todoItem.id)">
                ❌
              </button>
            </li>
          </ul>
        </ng-template>
      </div>
      <div
        class="form-container"
        style="display:flex;gap:10px;align-items:center;"
      >
        <form [formGroup]="todoForm" (ngSubmit)="onPost()">
          <input type="text" formControlName="description" />
          <button [disabled]="todoForm.invalid">Add</button>
        </form>
      </div>
    </div>
  `,
  styles: [``],
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
    }
  }
}
