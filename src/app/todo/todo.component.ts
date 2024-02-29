import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { TodoStore } from "./todo.store";
import { AsyncPipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { tap } from "rxjs";

@Component({
  selector: `app-todo`,
  imports: [NgIf, AsyncPipe, MatProgressSpinnerModule, NgFor],
  standalone: true,
  template: `
    <h1>Todo Items</h1>
    <div *ngIf="vm$ | async as vm">
      <mat-spinner [diameter]="20" color="blue" *ngIf="vm.loading">
      </mat-spinner>

      <ng-container *ngIf="vm.error; else noError">{{ vm.error }}</ng-container>
      <ng-template #noError>
        <ul>
          <li *ngFor="let todoItem of vm.todos">
            <input type="checkbox" [value]="todoItem.isCompleted" />
            {{ todoItem.description }}
          </li>
        </ul>
      </ng-template>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(TodoStore)],
})
export class TodoComponent {
  todoStore = inject(TodoStore);
  vm$ = this.todoStore.vm$;
}
