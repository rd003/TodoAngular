import { Component, Injectable, inject } from "@angular/core";
import { TodoModel } from "./todo.model";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from "@ngrx/component-store";
import { TodoService } from "./todo.service";
import { exhaustMap, switchMap, tap } from "rxjs";
import { trigger } from "@angular/animations";

interface TodoState {
  todos: readonly TodoModel[];
  loading: boolean;
  error: HttpErrorResponse | null;
}

@Injectable()
export class TodoStore
  extends ComponentStore<TodoState>
  implements OnStoreInit, OnStateInit
{
  private todoService = inject(TodoService);

  constructor() {
    super({
      todos: [],
      loading: false,
      error: null,
    });
  }
  ngrxOnStateInit() {
    this.loadTodos();
  }
  ngrxOnStoreInit() {}
  //selectors
  private readonly todos$ = this.select((s) => s.todos);
  private readonly loading$ = this.select((s) => s.loading);
  private readonly error$ = this.select((s) => s.error);

  // ViewModels
  readonly vm$ = this.select({
    todos: this.todos$,
    loading: this.loading$,
    error: this.error$,
  });

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse) => ({
      ...state,
      error,
      loading: false,
    })
  );

  private readonly setLoading = this.updater((state) => ({
    ...state,
    loading: true,
  }));

  private readonly addTodos = this.updater((state, todos: TodoModel[]) => ({
    ...state,
    todos,
    loading: false,
  }));

  private readonly addTodoItem = this.updater((state, todoItem: TodoModel) => ({
    ...state,
    loading: false,
    todos: [...state.todos, todoItem],
  }));

  private readonly updateTodoItem = this.updater(
    (state, todoItem: TodoModel) => ({
      ...state,
      loading: false,
      todos: state.todos.map((t) => (t.id === todoItem.id ? todoItem : t)),
    })
  );

  private readonly deleteTodoItem = this.updater((state, id: number) => ({
    ...state,
    loading: false,
    todos: state.todos.filter((t) => t.id !== id),
  }));

  //effects
  readonly loadTodos = this.effect<void>((trigger$) => {
    return trigger$.pipe(
      tap((_) => this.setLoading()),
      exhaustMap(() =>
        this.todoService.getTodos().pipe(
          tapResponse(
            (todos: TodoModel[]) => this.addTodos(todos),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    );
  });

  readonly addTodo = this.effect<TodoModel>((trigger$) => {
    return trigger$.pipe(
      tap((_) => this.setLoading()),
      switchMap((todoItem) =>
        this.todoService.addTodo(todoItem).pipe(
          tapResponse(
            (todoItemAdded: TodoModel) => this.addTodoItem(todoItemAdded),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    );
  });
}
