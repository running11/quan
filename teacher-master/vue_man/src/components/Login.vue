<template>
   <div class='logoBody'>
   	<div class="login-container">
			<div class="login-logo">教师圈后台管理系统</div>
			<div class="login-input">
				<div class="user input">
					<img src="../images/ic_login_user.png" alt="">
					<input type="text" placeholder="请输入晓黑板账号" ref="userName" />
				</div>
				<div class="password input">
					<img src="../images/ic_login_password.png" alt="">
					<input type="password" placeholder="请输入登录密码" ref="passWord" />
				</div>

				<div class="login-btn" data-toggle="modal" data-target="#loginError" @click="login">
					 <el-button type="text" >登录     测试版本号v1.0.0.1</el-button>
				</div>
				<div class="forget-pwd" data-toggle="modal" @click="forgetPwd" data-target="#forgetPassword">忘记密码</div>
        <div @click = "haha"></div>
			</div>
		</div>
		<div class="footer">
			<p>上海晓信信息科技有限公司版权所有 沪ICP备15021070</p>
			<p>客服电话：400-820-1227</p>
		</div>

     <el-dialog
      title="无法登录"
      :visible.sync="delDialogVisible"
      width="480px"
      :top="topValue"
      center
      id="del-dialog">
      <span class="text-center">{{logInfo}}</span>
      <span slot="footer"  class="dialog-footer">
        <el-button @click="delDialogVisible = false">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="忘记密码"
      :visible.sync="delDialogVisible1"
      width="480px"
      :top="topValue"
      center
      id="del-dialog">
      <span class="text-center">请使用晓黑板APP找回密码</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible1 = false">我知道了</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>

export default {
  name: 'Index',
  data () {
    return {
      userName: '' ,
      passWord: '' ,
      errorFlag: false ,
      errorInfo: false ,
      delDialogVisible: false,
      delDialogVisible1: false,
      logInfo: '',
      topValue: ''
    }
  },
  mounted() {
    console.log(((this.$el.clientHeight) - 250)/2)
    this.topValue = ((this.$el.clientHeight) - 250)/2 + 'px'
  },
  methods:{
    // 登录
     login(){
      let userName = this.$refs.userName.value
      let passWord = this.$refs.passWord.value
      let obj ={
           username : userName,
           password : passWord
         }
         //vuex调用登录接口
         this.$store.dispatch('GET_LOGIN', obj).then(res => {
            var data = res.data;
            if(data.status === 0 ){
               this.delDialogVisible = true;
               this.logInfo = data.info;
           }else if(data.status === 1){
            if(data.data.user.type == "2" ){
              // this.$router.push({path:'/'});
              localStorage.removeItem('userType');
              localStorage.setItem('userType',2);
            }else if(data.data.user.type == "1"){
              this.$router.push({path:'/masterIndex'});
              localStorage.removeItem('userType');
              localStorage.setItem('userType',1);
            }
          }
        }) .catch(err => {
            console.log(err)
          })
      },
     forgetPwd(){
       this.delDialogVisible1 = true;
       this.axios.post('http://quan-dev.xiaoheiban.cn/admin/index/demo2')
       .then(res => {
        console.log(res)
       })
     }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.logoBody {
  background: #5895FF;
  width: 100%;
}
#el-dialog{
color: #444444 ;
}
.login-container {
  width: 390px;
  position: absolute;
  left: 50%;
  margin-left: -195px;
  top: 50%;
  margin-top: -245px;
  text-align: center;
}
.login-container .login-logo {
  font-family: PingFangSC-Medium;
  font-size: 36px;
  color: #FFFFFF;
  letter-spacing: -0.87px;
}
.login-container .login-input {
  padding-top: 10px;
  margin-top: 35px;
  background: #FFF;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  height: 295px;
}
.login-container .login-input .input {
  width: 330px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #E5E5E5;
  margin: auto;
  margin-top: 30px;
  text-align: left;
}
.login-container .login-input .input img {
  width: 20px;
  margin-left: 10px;
  vertical-align: text-top;
}
.login-container .login-input .input input {
  width: 250px;
  height: 40px;
  line-height: 40px;
  padding: 0;
  margin-left: 10px;
  border: none;
  text-align: center;
  vertical-align: top;
  font-family: PingFangSC-Light;
  font-size: 16px;
  color: #444444;
  letter-spacing: -0.39px;
}
.login-container .login-input .login-btn {
  width: 330px;
  height: 44px;
  line-height: 44px;
  margin: auto;
  background: #5895FF;
  border-radius: 2px;
  color: #FFF;
  margin-top: 30px;
  cursor: pointer;
}
.login-container .login-input .login-btn .el-button--text{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: -0.39px;
}
.login-container .login-input .forget-pwd {
  width: 330px;
  margin: auto;
  text-align: right;
  margin-top: 17px;
  cursor: pointer;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #5895FF;
  letter-spacing: -0.39px;
  line-height: 16px;
}

.teacher-modal {
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
}
.teacher-modal .modal-dialog {
  width: 480px;
  height: 200px;
  text-align: center;
}
.teacher-modal .modal-content {
  border-radius: 0;
}
.teacher-modal .modal-header {
  border-bottom: none;
  font-size: 20px;
  color: #444444;
}
.teacher-modal .modal-body {
  font-size: 16px;
  color: #444444;
}
.teacher-modal .modal-footer {
  border-top: none;
  text-align: center;
}
.teacher-modal .modal-footer .close-btn {
  width: 196px;
  margin: auto;
  height: 32px;
  line-height: 32px;
  color: #FFF;
  background: #5895FF;
  border: none;
  border-radius: 2px;
  font-size: 16px;
  cursor: pointer;
}
.footer {
  position: fixed;
  width: 100%;
  bottom: 20px;
  text-align: center;
  color: #FFF;
  font-size: 12px;
  line-height: 18px;
}
#del-dialog{
  text-align: center;
}
#del-dialog .text-center{
  text-align: center;
}
#del-dialog .dialog-footer .el-button--default{
  width: 196px;
  height:32px;
  background-color: #5895FF;
  border-radius: 2px;
  outline:none;
  border:none;
}

 .text-center{
    display:block;
    width:90%;
    margin:0 auto;
    text-align:center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 16px;
  }
-webkit-input-placeholder { /* WebKit browsers */
  color: #AAAAAA;
}
-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color: #AAAAAA;
}
-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #AAAAAA;
}
-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #AAAAAA;
}

</style>
<style>
  #del-dialog .el-dialog__close{
    display:none;
  }
  .el-dialog__header{
    padding:32px 20px 7px;
  }
  .el-dialog__title{
    display:block;
    height:20px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
    line-height: 20px;
    text-indent:10px;
  }
  .el-dialog__footer{
    padding: 10px 20px 32px;
  }
  #del-dialog .el-button{
    padding:0;
  }
  #del-dialog .dialog-footer .el-button--default span{
  display:inline-block;
  height:32px;
  font-family: PingFangSC-Regular;
  font-size: 15px;
  color: #FFFFFF;
  letter-spacing: -0.39px;
  line-height: 32px;
  vertical-align:top;
}
</style>
