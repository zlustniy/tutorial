import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from './models/user';
import {UserService} from './services/user.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'usersdd';
  //типы шаблонов
  @ViewChild('readOnlyTemplate', {static: false}) readOnlyTemplate: TemplateRef<any> | undefined;
  @ViewChild('editTemplate', {static: false}) editTemplate: TemplateRef<any> | undefined;

  editedUser: User | null = null;
  users: Array<User>;
  isNewRecord: boolean = false;
  statusMessage: string = "";

  constructor(private serv: UserService) {
    this.users = new Array<User>();
  }

  ngOnInit() {
    this.loadUsers();
  }

  //загрузка пользователей
  private loadUsers() {
    this.serv.getUsers().subscribe((data: Array<User>) => {
      this.users = data;
    });
  }

  // добавление пользователя
  addUser() {
    this.editedUser = new User("", "", 0);
    this.users.push(this.editedUser);
    this.isNewRecord = true;
  }

  // редактирование пользователя
  editUser(user: User) {
    this.editedUser = new User(user._id, user.name, user.age);
  }

  // загружаем один из двух шаблонов
  loadTemplate(user: User) {
    if (this.editedUser && this.editedUser._id === user._id) {
      return this.editTemplate;
    } else {
      return this.readOnlyTemplate;
    }
  }

  // сохраняем пользователя
  saveUser() {
    if (this.isNewRecord) {
      // добавляем пользователя
      this.serv.createUser(this.editedUser as User).subscribe(_ => {
        this.statusMessage = 'Данные успешно добавлены',
          this.loadUsers();
      });
      this.isNewRecord = false;
      this.editedUser = null;
    } else {
      // изменяем пользователя
      this.serv.updateUser(this.editedUser as User).subscribe(_ => {
        this.statusMessage = 'Данные успешно обновлены',
          this.loadUsers();
      });
      this.editedUser = null;
    }
  }

  // отмена редактирования
  cancel() {
    // если отмена при добавлении, удаляем последнюю запись
    if (this.isNewRecord) {
      this.users.pop();
      this.isNewRecord = false;
    }
    this.editedUser = null;
  }

  // удаление пользователя
  deleteUser(user: User) {
    this.serv.deleteUser(user._id).subscribe(_ => {
      this.statusMessage = 'Данные успешно удалены',
        this.loadUsers();
    });
  }
}
