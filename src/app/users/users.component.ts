import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { UserService } from '../_services';
import { NzModalService } from 'ng-zorro-antd/modal';
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
  array:any[] = [];

  constructor(
    private userService: UserService,
    private modalService: NzModalService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAll()
    .subscribe(users => {
      this.users = users.slice(1, 20)
      this.users.forEach(user =>{
        let name = sessionStorage.getItem(user.Name);
        name != null ? this.array.push(user.Name) : null;
      })
    });
  }

  delete(user: User): void {
    this.userService.delete(user)
        .subscribe(() => {
          this.users = this.users.filter(h => h !== user);
        });
  }

  whetherEnable(flag: string,user: User): void {
    if(flag == '解锁' || flag == '锁定')
      user.Lock = user.Lock == 0 ? 1 : 0;
    else
      user.Enable = user.Enable == 0 ? 1 : 0;
    this.userService.whetherEnable(flag,user).subscribe(
      data => {
          this.message.success(flag + "账号 " + user.Name + " 成功！",{nzDuration: 5000})
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
    document.getElementById("dis").style.display = "none";
    this.isVisible = false;
  }

  showConfirm(user,msg): void {
    let mes = "请确认是否"+msg+"账号 " + user.Name + "?";
    this.modalService.confirm({
      nzTitle: '<i>'+ mes +'</i>',
      nzOnOk: () => {
        this.whetherEnable(msg,user);
      }
    });
  }

}
