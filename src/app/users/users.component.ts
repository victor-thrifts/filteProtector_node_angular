import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private modalService: NzModalService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAll()
    .subscribe(users => this.users = users.slice(1, 20));
  }

  delete(user: User): void {
    this.userService.delete(user.rowid)
        .subscribe(() => {
          this.users = this.users.filter(h => h !== user);
        });
  }

  showDeleteConfirm(user: User): void {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '请确认是否删除!',
      nzOnOk: () => console.log(user),
    });
  }

}
