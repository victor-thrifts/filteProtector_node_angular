import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  constructor(
    private userService: UserService,
    private message: NzMessageService,
  ) {}

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

  whetherEnable(user: User): void {
    user.Enable = user.Enable == 0 ? 1 : 0;
    this.userService.update(user).subscribe(
      data => {
        if(user.Enable == 1){
          this.message.success("禁用账号 " + user.Name + " 成功！",{nzDuration: 5000})
        }else{
          this.message.success("启用账号 " + user.Name + " 成功！",{nzDuration: 5000})
        }
      },
      error=> {this.message.error("设置失败！",{nzDuration: 5000})
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
