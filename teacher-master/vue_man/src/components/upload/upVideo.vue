<template>
<div class='video_container'>
    <div class="fileName" :class="{'hidden': !uploaded}">{{ fileName }}</div>
	  <div :class="{'hidden': uploaded}" v-if="!flag">
	  	  <div class="uploadBtn" @click='choose'>选择视频</div>
        <form id = 'upform'>
		    <input id="myvideo" type="file" name="upvideo" style="display: none;" />
        </form>
        <p class="uploadRule">支持mp4、mov、avi格式，文件大小不大于1G</p>
    </div>
      <div id="popup" v-if="videoShow == 1">
          <div id="videotop" :class="{'bheight' : isB}"></div>
          <div class="mpro" :class="{'theight' : isB,'hidden': utxt}" v-show="hashing == 1">
            <div id="videomiddle"></div>
            <div class="overtxt">已上传 {{ uploadPro }}</div>
            <div class="overplus">{{ uploadSec }}</div>
            <div class="cancelUp" @click='cancel'><img src="../../../static/images/ic_close_white.png" alt="" /></div>
          </div>
          <div id='videohash'></div>
          <div id="videobottom" :class="{'theight' : isB}" v-show="hashing == 1"><span class="left"></span><span class="transfer">{{ transfer }}</span></div>
      </div>
      <div class="videoBox" v-if="flag">
        <video width="320" controls="controls">
          <source :src="media_url" type="video/mp4">
        </video>
        <div class="point-info">
          <p>视频已上传成功，您可点击视频观看，请确保视频无误</p>
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
            <span class="text-center">文件大于1G 无法上传</span>
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
      cancelUp: false,
      lastTaskId: 0,
      hashing: 1,
      myFolder: '/video/',
      topValue: '',
      cancelflag: false,
      delDialogVisible1:false,
      taskId : 0,
      size : 0,
      sizeM : 0,
      base : 1024*1024,
      start : 0,
      end : 0,
      cos: {},
      flag: false,
      result: {},
      media_url: '',
      percentage: 0,
      isB: false,
      uploaded: false,
      fileName: '',
      uploadPro: '0',
      uploadSec: '',
      utxt: true,
      videoShow: 0,
      transfer: ''
    }
  },
  mounted() {
    this.topValue = ((window.document.documentElement.clientHeight) - 201)/2 + 'px'
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
      let url = 'http://quan-dev.xiaoheiban.cn/api/upload/getTrans?vid=' + result.data.vid +'&access_url='+result.data.access_url;
     //定时监测转码状态
      let interval = setInterval(carInfoInterval,10000)
       var self = this;

         function carInfoInterval(){
          self.axios.get(url)
	      .then(res => {
	      	console.log(res)
	      	if(res.data.code == 200){
           this.transfer = '转码成功';
		       console.log(res.data.data.media_url);
		       self.media_url = res.data.data.media_url;
		       self.flag = true;
           self.videoShow = 0;
		        window.clearInterval(interval);
	      	}
	      })
         }
         carInfoInterval();
    },
    goback() {
        this.delDialogVisible1 = false ;
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
    choose(e) {
      if(this.cancelflag == true){
         this.uploaded = false;
         this.flag = false;
         this.videoShow = 0 ;
         this.cancelflag = false;
         $('#upform')[0].reset();
       }
        let that = this
        $('#myvideo').off('change').on('change', function (e) {
        that.isB = true;
        var file = e.target.files[0];
        that.fileName = file.name;
          console.log(file.type)
          that.size = file.size;
          that.sizeM = (that.size/that.base).toFixed(2);
          console.log(that.sizeM);

       // if(file.type !== 'video/mp4' && file.type !== 'video/quicktime' && file.type !== 'video/x-msvideo'){
       //  that.$message.error('视频格式错误');
       //  return false;
       //   }

          if(that.sizeM > 1000){
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
              $('#myvideo').click();
          }, 0);
          return false;
    },
    progressCallBack(curr, sha1) {
      console.log('curr:'+curr);
      if(this.cancelflag == true){
         this.uploaded = false;
         this.flag = false;
         this.videoShow = 0 ;
         // this.cancelflag = false;
         console.log("取消后走吗")
         $('#upform')[0].reset();
         return false;
       }else{
         this.uploaded = true;
         this.videoShow = 1;
       }
      console.log('取消后又走了吗')
      
    	//console.log('curr-----'+curr);
         var sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + '%';
           if((sha1CheckProgress =='100.00%' || sha1CheckProgress=='100%' ) && (this.cancelflag == false)){
              this.hashing = 1;
           	  this.utxt = false;
               $('#videohash').remove();
               //console.log(1111111111)
               var uploadProgress = ((curr || 0) * 100).toFixed(2) + '%';
               if(uploadProgress=='0.00%'){
                  this.start=new Date().getTime();
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
                   $('#videomiddle').css({width:uploadProgress});
               }

           }else{
                 this.hashing = 0;
                 console.log(sha1CheckProgress)
                $('#videohash').text('正在检测文件：'+sha1CheckProgress);
           }
          if(curr == 1){
             $('.cancelUp').remove();
             this.hashing = 1;
              $('#videomiddle').css({width:"100%"});
              this.uploadPro = '100%';
              $('.left').html('已上传：' + this.sizeM+'M'+'&nbsp;&nbsp;&nbsp;');
              this.transfer = '上传已完成，正在转换中，请稍后，不要关闭此页';
            }
    },
    cancel() {
      this.cancelUp = true;
    },
    sureCancel() {
      this.cos.cancelTask(this.lastTaskId);
       this.cancelUp = false
       this.videoShow = 0;
       this.flag = false;
       this.uploaded = false;
       this.cancelflag = true
       return false
    },
    reupload(){
      this.flag = false;
      this.uploaded = false;
      this.videoShow = 0;
    }
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
 #videotop{

       /*height:30px;*/
       font-size:16px;
       font-weight:bold;
       line-height:30px;
       /*background: #E5E5E5;*/
       }
	.bheight{
		height:20px;
	}
  #videomiddle{
      height:30px;
      line-height: 30px;
      text-indent: 15px;
      width:0%;
      background-color:#2FB3FE;
	    position: absolute;
	    top: 0;
	    left: 0;
  }
  #videobottom{
      margin-top:10px;
      /*height:20px;*/
      /*font-size:12px;*/
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #AAAAAA;
      letter-spacing: -0.39px;
      line-height: 16px;
  }
  .theight{
  	height:30px;
  }
  #videobottom .left{
      float:left;
  }
  #videobottom .right{
      float:right;
  }
  .videoBox{
  	/*position: absolute;
  	top: 5px;
  	right: 10px*/
  	padding: 0 20px;
    overflow:hidden;
    position:relative;
    margin-top:10px;
  }
  .videoBox video{
    float:left;
  }
  .videoBox .point-info{
    margin-left:340px;
  }
  .videoBox .point-info p{
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #AAAAAA;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
  .videoBox .point-info input{
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
    right:25px;
    cursor:pointer;
  }

  .uploadBtn{
  	width: 320px;
  	height: 32px;
  	line-height: 32px;
  	border-radius: 2px;
  	background: #5895FF;
  	color: #fff;
  	text-align: center;
  	font-size: 16px;
  	margin: auto;
  	margin-top: 80px;
  }
  .uploadRule{
  	color: #aaa;
  	line-height: 24px;
  	text-align: center;
  	margin-top: 20px;
  }
  .fileName{
  	text-indent: 20px;
  	margin-top: 60px;
    font-family: PingFangSC-Regular;
    font-size: 24px;
    color: #444444;
    letter-spacing: -0.58px;
    line-height: 30px;
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
  	right: 10px;
    z-index: 1000;
  }
  .cancelUp img{
  	width: 10px;
  }
  .transfer{
  	text-indent: 15px;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #4CBF4A;
    letter-spacing: -0.39px;
    line-height: 16px;
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
