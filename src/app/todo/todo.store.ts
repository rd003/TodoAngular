import { Component, Injectable } from "@angular/core";
import { TodoModel } from "./todo.model";
import { HttpErrorResponse } from "@angular/common/http";
import { ComponentStore } from "@ngrx/component-store";

interface TodoState {
  todos: readonly TodoModel[];
  loading: boolean;
  error: HttpErrorResponse | null;
}

@Injectable()
export class TodoStore extends ComponentStore<TodoState> {}
