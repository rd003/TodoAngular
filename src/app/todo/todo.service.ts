import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { TodoModel } from "./todo.model";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
@Injectable({ providedIn: "root" })
export class TodoService {
  private http = inject(HttpClient);
  private url = environment.BASE_URL + "/todos";

  addTodo(todoItem: TodoModel): Observable<TodoModel> {
    return this.http.post<TodoModel>(this.url, todoItem);
  }

  getTodos(): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(this.url);
  }
}
