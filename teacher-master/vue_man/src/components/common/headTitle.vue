<template>
  <div class="top-container">
    <div class="top-logo"><h2>教师圈后台管理系统</h2></div>
    <div class="top-right">
      <ul>
        <li class="user" data-toggle="modal" data-target="#exitModal">
          <el-button type="text" @click="logOut">
            <img class="header" :src="teacher_img !== '' ? teacher_img : '../../images/img_profile_photo.png'" alt="">
            <span class="name">{{ teacher_name }}</span>
            <img class="icon-drow" src="../../images/ic_user_down.png" alt="">
          </el-button>
        </li>
      </ul>
    </div>
    <div class="clearfix"></div>

    <el-dialog
        title="退出登录"
        :visible.sync="exitDialogVisible"
        width="480px"
        center
        :top='topValue'
        id="exit-dialog">
        <div class="text-center">确定要退出登录吗?</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="exitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sureExit">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'headTitle',
    data() {
      return {
         teacher_name: '',
         teacher_img: '',
         topValue: '',
         exitDialogVisible:false
      }
    },
    mounted() {
      this.topValue =  '252px'
      this.$store.dispatch('GET_HEAD',{})
       .then(res => {
        console.log(12121212)
        console.log(res)
         if(res.code === "4001"){
            this.$message('请先登录');
            window.location.href = '/mp/index.html#/login'
        }
        let data = res.data
        this.teacher_img = data.img
        this.teacher_name = data.name
       })

    },
    methods: {
      logOut() {
        this.exitDialogVisible = true;
      },
      sureExit(){
        this.$store.dispatch('GET_LOGOUT',{})
          .then(res => {
          console.log(res)
          this.exitDialogVisible = false;
          if (res.status == 1){
            window.location.href = "/mp/index.html#/login"
            this.$message({
            type: 'success',
            message: '退出成功!',
          });
          }
        })
      }

    },

  }
</script>

<style scoped lang="scss">
  .top-container {
    .name {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: -0.39px;
      line-height: 16px;
    }
  }


  #exit-dialog .text-center{
    text-align:center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
  #exit-dialog .dialog-footer{
      text-align: center;
  }
  .dialog-footer button{
      height: 32px;
      width: 196px;
      line-height:8px;
  }
  .cancel-button {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 8px;
  }
  .dialog-footer .el-button--primary{
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    color: #444444;
  }
  .dialog-footer .el-button--primary:hover{
     color: #409EFF;
     border-color:#c6e2ff;
     background-color:#ecf5ff;
  }
  .top-logo h2{
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #FFFFFF;
    letter-spacing: -0.58px;
    line-height: 64px;
  }
  .top-container .top-right .user{
    padding-right:41px;
  }
</style>
<style>
   #exit-dialog .el-dialog__header{
    line-height:16px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
    padding:32px 20px 7px;
    text-align:center;
    text-indent:10px;
  }
  .el-dialog__footer{
    padding: 10px 20px 32px;
  }
  #exit-dialog .el-dialog--center .el-dialog__body{
    padding: 25px 15px 10px;
  }
   #exit-dialog .dialog-footer{
    margin-left:-25px;
  }
  #exit-dialog .el-dialog__headerbtn .el-dialog__close{
    display:none;
  }
  #exit-dialog .el-dialog__footer{
    padding:10px 20px;
  }
</style>
