<template>
<div class='audio_container'>
    <div class="fileName" :class="{'hidden': !uploaded}">{{ fileName }}</div>
    <div :class="{'hidden': uploaded}" v-if="!flag">
      <div class="newAudio">
        <p class="uploadRule">支持mp3、ogg、wav格式，文件大小不大于200M</p>
          <div class="uploadBtn" @click='chooseAudio'>上传音频</div>
          <form id="upform">
          <input id="myaudio" type="file" name="upaudio" style="display: none;" />
         </form>
      </div>
      </div>
      <div id="popup" v-if="audioShow == 1">
          <div id="audiotop" :class="{'bheight' : isB}"></div>
          <div class="mpro" :class="{'theight' : isB,'hidden': utxt}" v-show="hashing == 1">
            <div id="audiomiddle"></div>
            <div class="overtxt">已上传 {{ uploadPro }}</div>
            <div class="overplus">{{ uploadSec }}</div>
            <div class="cancelUp" @click='cancel'><img src="../../../static/images/ic_close_white.png" alt="" /></div>
          </div>
          <div id='audiohash' v-show="hashing == 0"></div>
          <div id="audiobottom" :class="{'theight' : isB}" v-show="hashing == 1"><span class="left"></span><span class="transfer">{{ transfer }}</span></div>
      </div>
      <div class="audioBox" v-if="flag">
        <audio width="380" controls>
          <source :src="media_url" type="audio/mp3">
        </audio>
        <div class="point-info">
          <input type="button" value="重新上传" @click="reupload"/>
        </div>
      </div>
  <!--<button id="cancelTask" @click='cancel'>取消</button>-->
             <el-dialog
                  title="无法上传"
                  :visible.sync="delDialogVisible1"
                  width="480px"
                  center
                  id="del-dialog">
                  <span class="text-center">文件大于200M 无法上传</span>
                  <span slot="footer" class="dialog-footer">
                  <el-button @click="goback">我知道了</el-button>
                  </span>
              </el-dialog>
              <el-dialog
                title="取消上传"
                :visible.sync="cancelUp"
                width="480px"
                :top = 'topValue'
                center
                id="del-dialog2">
                <span class="text-center">取消上传将消除目前的上传进度</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelUp = false">取 消</el-button>
                  <el-button type="primary" @click="sureCancel">取消上传</el-button>
                </span>
               </el-dialog>
</div>
</template>

<script type="text/javascript" src="../../assets/js/cos-js-sdk-v4.js"></script>
<script>
import $ from 'jquery'

export default {
  name: 'videos',
  data () {
    return {
      bucket: 'quan',
      appid: '1252817547',
      region: 'sh',
      lastTaskId: '',
      topValue: '',
      myFolder: '/audio/',
      cancelUp: false,
      cancelflag: false,
      hashing: 1,
      taskId : 0,
      size : 0,
      sizeM : 0,
      base : 1024*1024,
      start : 0,
      end : 0,
      cos: {},
      flag: false,
      delDialogVisible1: false,
      result: {},
      media_url: '',
      percentage: 0,
      isB: false,
      uploaded: false,
      fileName: '',
      uploadPro: '0',
      uploadSec: '',
      utxt: true,
      audioShow: 0,
      transfer: ''
    }
  },
  mounted() {
    this.topValue  = ((window.document.documentElement.clientHeight) - 201)/2 + 'px'
    let that = this
      var cos = new CosCloud({
          appid: that.appid, // APPID 必填参数
          bucket: that.bucket, // bucketName 必填参数
          region: that.region, // 地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
          getAppSign: function (callback) {//获取签名 必填参数
              $.get('http://quan-dev.xiaoheiban.cn/api/upload/getSign',function(xhr){
                  console.log(111)
                  callback(xhr.data.authorization);

              },'json');
          },
          getAppSignOnce: function (callback) {//单次签名，参考上面的注释即可

          }
      });
      this.cos = cos
    console.log(this.cos)
    console.log($)
  },
  methods: {
    //视频成功回调
    successCallBack(result){
      console.log(result);
      this.media_url = result.data.access_url
    },
    //错误回调
    errorCallBack(result) {
      result = result || {};
      console.log('request error:', result && result.message);
      console.log(result.responseText || 'error');
    },
    taskReady(taskId) {
       this.lastTaskId = taskId;
    },
    getUrl() {
      return (!this.flag ? '' : this.media_url)
    },
    getName() {
      return (!this.flag ? '' : this.fileName)
    },
    getSize(){
      return (!this.flag ? '' : this.size)
    },
    goback() {
       this.delDialogVisible1 = false ;
     },
    chooseAudio(e) {
        if(this.cancelflag == true){
         this.uploaded = false;
         this.flag = false;
         this.audioShow = 0 ;
         this.cancelflag = false;
       }
        let that = this
        $('#myaudio').off('change').on('change', function (e) {
        that.isB = true;
        var file = e.target.files[0];
        that.fileName = file.name;
          console.log(file.type)
          that.size = file.size;
          that.sizeM = (that.size/that.base).toFixed(2);
          console.log(that.sizeM);

      //    if(file.type !== 'audio/mp3' && file.type !== 'audio/ogg' && file.type !== 'audio/x-wav'){
      //   that.$message.error('音频格式错误');
      //   return false;
      // }

          if(that.sizeM > 200){
             that.uploaded = false;
             that.flag = false
             that.delDialogVisible1 = true;
             return false;
          }

          //修改file.name 唯一
          var ext = file.name.split('.');
          var fileName = new Date().getTime()+'.'+ext[ext.length-1];
//      console.log(fileName);return false;
       // 分片上传直接调用uploadFile方法，内部会判断是否需要分片
       // 分片上传过程可能会有 op=upload_slice_list 的 POST 请求返回 404，不会影响上传：https://github.com/tencentyun/cos-js-sdk-v4/issues/16
       that.taskId = that.cos.uploadFile(that.successCallBack, that.errorCallBack, that.progressCallBack, that.bucket, that.myFolder + fileName, file, 0, that.taskReady);//insertOnly==0 表示允许覆盖文件 1表示不允许
         $('#upform')[0].reset();
          return false;
        });
         setTimeout(function () {
              $('#myaudio').click();
          }, 0);
          return false;
    },
    progressCallBack(curr, sha1) {

     if(this.cancelflag == true){
         this.uploaded = false;
         this.flag = false;
         this.audioShow = 0 ;
         console.log("取消后走吗")
         $('#upform')[0].reset();
         return false;
       }else{
         this.uploaded = true;
         this.audioShow = 1;
       }

      console.log(sha1)
       /*if(curr == 1){
          console.log('该文件已存在')
          this.transfer = '该文件已存在，正在转换中，请稍后，不要关闭此页';
         }
         return false;*/

         var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + '%';
           if(sha1CheckProgress =='100.00%' || sha1CheckProgress=='100%'){
              this.utxt = false;
               $('#audiohash').remove();

              this.hashing = 1;
               var uploadProgress = ((curr || 0) * 100).toFixed(2) + '%';
               if(uploadProgress=='0.00%'){
                  this.start=new Date().getTime();
//                 console.log(this.start);
               }else{
                   this.end = new Date().getTime();
                   var differ = this.end - this.start;  //毫秒
                   var uploaded = (this.size * (curr || 0)/this.base).toFixed(2);//已上传大小
                   var uploadProgress = ((curr || 0) * 100).toFixed(2) + '%';//已上传进度
                   var speed = (uploaded*1000/differ).toFixed(1);
                   var leftStr = '已上传：'+uploaded+'M/'+this.sizeM+'M'+'&nbsp;&nbsp;&nbsp;'+'当前上传速度：'+speed+'MB/S';
                   var rightStr = uploadProgress=='100.00%'?'':'剩余 '+parseInt((this.size/this.base - uploaded)/speed,10)+' 秒';
                   $('.left').html(leftStr);
                   $('.right').html(rightStr);

                   this.uploadPro = uploadProgress;
                   this.uploadSec = rightStr;
                   $('#audiomiddle').css({width:uploadProgress});
               }

           }else{
             this.hashing = 0;
                $('#audiohash').text('正在检测文件：'+sha1CheckProgress);

           }
            if(curr == 1){
                $('.cancelUp').remove();
                this.hashing = 1;
                $('#audiomiddle').css({width:"100%"});
    //           console.log('转码');
                $('.left').html('已上传：' + this.sizeM+'M'+'&nbsp;&nbsp;&nbsp;');
                this.uploadPro = "100%";
                this.transfer = '上传已完成';
                let that = this;
               let timer =  setInterval(function(){
                  console.log("==========")
                  that.flag = true;
                  that.audioShow = 0;
                    clearInterval(timer)
                },2000)
            }
    },
    cancel() {
       this.cancelUp = true ;
    },
    sureCancel(){
       this.cancelUp= false;
       this.cos.cancelTask(this.lastTaskId);
       this.flag = false;
       this.uploaded = false;
       this.audioShow = 0;
       this.cancelflag = true
       return false
    },
    reupload(){
      this.flag = false;
      this.uploaded = false;
      this.audioShow = 0;
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .video_container{
  position: relative;
 }
 #popup{
        display:block;
        padding:0px 20px;
        border-radius:5px;
        /*margin-top:20px;*/
      }
 #audiotop{

       /*height:30px;*/
       font-size:16px;
       font-weight:bold;
       line-height:30px;
       /*background: #E5E5E5;*/
       }
  .bheight{
    height:20px;
  }
  #audiomiddle{
      height:30px;
      line-height: 30px;
      text-indent: 15px;
      width:0%;
      background-color:#2FB3FE;
      position: absolute;
      top: 0;
      left: 0;
  }
  #audiobottom{
      margin-top:10px;
      /*height:20px;*/
      /*font-size:12px;*/
      color: #aaa;;
  }
  .theight{
    height:30px;
  }
  #audiobottom .left{
      float:left;
  }
  #audiobottom .right{
      float:right;
  }
  .audioBox{
    /*position: absolute;
    top: 5px;
    right: 10px*/
    padding: 0 30px;
    overflow:hidden;
    position:relative;
    margin-top:20px;
  }
  .audioBox video{
    float:left;
  }
  .audioBox .point-info{
    margin-left:340px;
  }
  .audioBox .point-info p{
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #AAAAAA;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
  .audioBox .point-info input{
    width:112px;
    height:32px;
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 2px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 32px;
    text-align:center;
    position:absolute;
    bottom:0;
    right:20px;
    cursor:pointer;
  }

  .uploadBtn{
    float:right;
    width: 112px;
    height: 32px;
    line-height: 32px;
    border-radius: 2px;
    background: #5895FF;
    color: #fff;
    text-align: center;
    font-family: PingFangSC-Regular;
    letter-spacing: -0.39px;
    font-size: 16px;
    margin: auto;
    margin: 60px 30px 0 0;
  }
  .newAudio{
    overflow:hidden;
  }

 .newAudio .uploadRule{
    float:left;
    width:320px;
    padding:45px 0 10px 30px;
   font-family: PingFangSC-Regular;
   font-size: 16px;
   color: #AAAAAA;
   letter-spacing: -0.39px;
   line-height: 24px;
  }
  .fileName{
    font-size: 24px;
    text-indent: 20px;
    line-height: 30px;
    margin-top: 70px;
  }
  .mpro{
    background: #E5E5E5;
    position: relative;
  }
  .overtxt,.overplus,.cancelUp{
    position: absolute;
    height:30px;
    line-height: 30px;
    top: 0;
    right: 25px;
    font-size: 14px;
    color: #444;
  }
  .overtxt{
    left: 0;
    text-indent: 15px;
    color: #fff;
  }
  .cancelUp{
    z-index: 1000;
    right: 10px;
  }
  .cancelUp img{
    width: 10px;
  }
  .transfer{
    color: #4CBF4A;
    text-indent: 15px;
  }
  #del-dialog{
  text-align: center;
}
#del-dialog .text-center{
  text-align: center;
}
#del-dialog .dialog-footer .el-button--default{
  width: 200px;
  background-color: #5895FF;
  color: #ffffff;
}
  .text-center{
    display:block;
    width:90%;
    margin:0 auto;
    text-align:center;
  }
</style>
<style scoped>
  
  #del-dialog2{
  text-align: center;
}
 #del-dialog2 .el-dialog__header{
    height:24px;
    line-height:24px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
  }
  #del-dialog2 .el-dialog--center .el-dialog__body{
    padding: 25px 15px 10px;
  }
  #del-dialog2 .dialog-footer{
    margin-left:-25px;
  }
  #del-dialog2 .el-dialog__headerbtn .el-dialog__close{
    display:none;
  }
  #del-dialog2 .el-dialog__footer{
    padding:10px 20px;
  }
  #del-dialog2 .text-center{
    text-align:center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
 #del-dialog2 .dialog-footer{
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
</style>
