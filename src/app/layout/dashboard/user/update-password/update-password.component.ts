import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  loginForm: any = {
    oldPassword: '',
    password: '',
    confirmPassword:'',
    // cbl:'Y'
};

@ViewChild('f') form:NgForm;
loading=false;
    user_id: string;
constructor(private router: Router, private httpService: DashboardService, private toastr: ToastrService) {
    this.user_id=localStorage.getItem('user_id')

 }

ngOnInit() {

 }

onLogin(loginForm: any) {
    this.loading=true;
    console.log(loginForm);
    let obj={
        oldPassword:loginForm.oldPassword,
        newPassword:loginForm.password,
        userId:this.user_id
    }
let encodeObj=this.httpService.UrlEncodeMaker(obj);

    this.httpService.updatePassword(encodeObj).subscribe((data:Response) => {
        const res: any = data;
        // alert(res.message)
        let alrtType=res.title;
        this.toastr.info(res.description,'Update Password')
        console.log(res);
        this.loading=false;
        this.form.reset();
        
        setTimeout(() => {
            alert('Please login again with new password')
        this.router.navigate(['/login']);
        }, 3000);
       

    }, error => {
        this.toastr.error(error.error.text, 'Update Password');
        console.log('error', error);
        this.loading=false;

        


    });
}

}
