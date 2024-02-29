import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { provideComponentStore } from "@ngrx/component-store";
import { TodoStore } from "./todo.store";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { tap } from "rxjs";

@Component({
  selector: `app-todo`,
  imports: [NgIf, AsyncPipe, JsonPipe, MatProgressSpinnerModule],
  standalone: true,
  template: `
    <div *ngIf="vm$ | async as vm">
      <mat-spinner [diameter]="20" color="blue" *ngIf="vm.loading">
      </mat-spinner>

      <ng-container *ngIf="vm.error; else noError">{{ vm.error }}</ng-container>
      <ng-template #noError>
        {{ vm.todos | json }}
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
  constructor() {
    this.vm$.pipe(
      tap((a) => {
        console.log(a.todos);
      })
    );
  }
}
