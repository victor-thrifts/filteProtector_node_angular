import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  isVisible = false;
  remark = "";
  user: User;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAll()
    .subscribe(users => this.users = users.slice(1, 20));
  }

  delete(user: User): void {
    this.userService.delete(user)
        .subscribe(() => {
          this.users = this.users.filter(h => h !== user);
        });
  }

  showModal(user: User): void {
    this.user = user;
    this.isVisible = true;
    this.remark = "";
  }

  handleCancel(): void {
    this.isVisible = false
    document.getElementById("dis").style.display = "none";
  }

  handleOk(): void {
    if(this.remark == undefined || this.remark == ""){
      document.getElementById("dis").style.display = "";
      return
    }
    console.log(this.user);
    document.getElementById("dis").style.display = "none";
    this.isVisible = false;
  }
}
