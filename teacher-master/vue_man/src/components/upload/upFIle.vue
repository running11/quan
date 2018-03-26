  <template>
  <div class="file_container">
    <div class="fileName1" :class="{'hidden': !fileloaded}">{{ filesName }}</div>
    <div :class="{'hidden': fileloaded}" v-if="!flags">
      <label>
        <div class="fileUpBtn" @click='choose1'>点击选择文件</div>
        <!-- <input id="myvideo" type="file" name="upvideo" style="display: none;" /> -->
         <input id="myfile" type="file" name="upfiles" style="display:none;" />
      </label>
    </div>
    <div id="filePopUp" v-if="fileShow == 1">
          <div id="filetop" :class="{'bheight' : isC}" ></div>
          <div class="mpro1" :class="{'theight' : isC,'hidden': utxt1}" >
            <div id="filemiddle"></div>
            <div class="overtxt1">已上传 {{ filePro }}</div>
            <div class="cancelUp1" @click='cancel'><img src="../../../static/images/ic_close_white.png" alt="" /></div>
          </div>
          <div id='videohash'></div>
    </div>

    <div class="videoBox" v-if="flags">
        <div class="point-info">
          <input type="button" value="删除附件" @click="reupload"/>
        </div>
     </div>

      <el-dialog
      title="无法上传"
      :visible.sync="delDialogVisible"
      width="480px"
      center
      id="del-dialog">
      <span class="text-center">文件大于50M 无法上传</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goback">我知道了</el-button>
      </span>
    </el-dialog>
           <el-dialog
                title="取消上传"
                :visible.sync="cancelUpFile"
                width="480px"
                :top = 'topValues'
                center
                id="del-dialog1">
                <span class="text-center">取消上传将消除目前的上传进度</span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="cancelUpFile = false">取 消</el-button>
                  <el-button type="primary" @click="sureCancelFile">取消上传</el-button>
                </span>
           </el-dialog>
  <!--  <div id='filehash' v-if='itemShow == 2'>
     <div id='upContent'>正在上传...</div>
   </div>
   <div id='delFile' v-if='itemShow == 3' @click='delFile'>
    <div class="fileName2">{{ filesName }}</div>
   删除附件
   </div> -->
</div>
</template>
<script type="text/javascript" src="../../assets/js/cos-js-sdk-v4.js"></script>
<script>
import $ from 'jquery'

export default {
  name: 'files',
  data () {
    return {
      filesName: '',
      buckets: 'quan',
      appid: '1252817547',
      cancelUpFile: false,
      region: 'sh',
      topValues:'',
      lastTaskId: '',
      delDialogVisible: false,
      filePro: '',
      fileSec: '',
      myFolders: '/file/',
      taskId : 0,
      media_urls: '',
      size : 0,
      sizeM : 0,
      base : 1024*1024,
      start : 0,
      end : 0,
      cos: {},
      flags: false,
      result: {},
      upData: {},
      fileShow: 0,
      isC: false,
      percentage: 0,
      fileloaded: false,
      utxt1: true,
      transfers: ''
    }
  },
  mounted() {
    this.topValues = ((window.document.documentElement.clientHeight) - 201)/2 + 'px'
    console.log(1121221)
    let that = this
      var cos = new CosCloud({
          appid: that.appid, // APPID 必填参数
          bucket: that.buckets, // bucketName 必填参数
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
  //成功回调
    successCallBacks(result){
      $('#filehash').text('')
      console.log(result);
      this.flags = true;
      this.fileShow = 0;
      this.upData = result;
      this.media_urls = result.data.access_url;
      console.log(this.upData)
    },
   // 错误回调
    errorCallBacks(result) {
      result = result || {};
      console.log('request error:', result && result.message);
      console.log(result.responseText || 'error');
    },
    taskReadys(taskId) {
       this.lastTaskId = taskId;
    },
    getUrl() {
      return (!this.flags ? '' : this.media_urls)
    },
    getName() {
      return (!this.flags ? '' : this.filesName)
    },
    getSize(){
      return (!this.flags ? '' : this.size)
    },
    choose1(e) {
      console.log(1111)
      let that = this;
      $('#myfile').off('change').on('change', function (e) {
        console.log(2222)
      that.isC= true;
      var files = e.target.files[0];
      that.filesName = files.name;

      that.size = files.size;
      that.sizeM = (that.size/that.base).toFixed(2);

      var fileSize = parseInt(that.sizeM)
      console.log(fileSize)
      if(fileSize > 50){
        that.fileloaded = false;
        that.flags = false;
        that.fileShow = 0;
        that.delDialogVisible = true;
         return false;
      }
      //修改file.name 唯一
      var ext = files.name.split('.');
      var fileNames = new Date().getTime()+'.'+ext[ext.length-1];
  //      console.log(fileName);return false;
     // 分片上传直接调用uploadFile方法，内部会判断是否需要分片
     // 分片上传过程可能会有 op=upload_slice_list 的 POST 请求返回 404，不会影响上传：https://github.com/tencentyun/cos-js-sdk-v4/issues/16
     that.taskId = that.cos.uploadFile(that.successCallBacks, that.errorCallBacks, that.progressCallBacks, that.buckets, that.myFolders + fileNames, files, 0, that.taskReadys);//insertOnly==0 表示允许覆盖文件 1表示不允许
      return false;
        });
  },
    progressCallBacks(curr, sha1) {
         this.fileloaded = true;
         this.fileShow = 1;
         console.log('curr-----'+curr);
         console.log(sha1)

         var sha1CheckProgress1 = ((sha1 * 100).toFixed(2) || 100) + '%';
           if(sha1CheckProgress1 =='100.00%' || sha1CheckProgress1=='100%'){
               this.utxt1 = false;
               $('#filehash').remove();
               var uploadProgress1 = ((curr || 0) * 100).toFixed(2) + '%';
               if(uploadProgress1 =='0.00%'){
                  this.start=new Date().getTime();
                   console.log(this.start);
               }else{
                   this.end = new Date().getTime();
                   var filediffer1 = this.end - this.start;  //毫秒
                   var fileuploaded1 = (this.size * (curr || 0)/this.base).toFixed(2);//已上传大小
                   var uploadProgress1 = ((curr || 0) * 100).toFixed(2) + '%';//已上传进度
                   var filespeed1 = (fileuploaded1*1000/filediffer1).toFixed(1);
                   var fileleftStr1 = '已上传:'+fileuploaded1+'M/'+this.sizeM+'M'+'&nbsp;&nbsp;&nbsp;'+'当前上传速度：'+filespeed1+'MB/S';
                   var filerightStr1 = uploadProgress1 =='100.00%'?'':'剩余 '+parseInt((this.size/this.base - fileuploaded1)/filespeed1,10)+' 秒';

                   $('.fileleft').html(fileleftStr1);
                   $('.fileright').html(filerightStr1);

                   this.filePro = uploadProgress1;
                   this.fileSec = filerightStr1;
                   $('#filemiddle').css({width:uploadProgress1});
               }
           }else{
                $('#filehash').text('正在检测hash值：'+sha1CheckProgress1);

           }

            if(curr == 1){
              $('.cancelUp').remove();
              console.log('该文件已存在')
              this.filePro = "100%"
              console.log($('#filemiddle') )
              $('#filemiddle').css({width:'100%'});
              console.log("==========")
              this.flags = true;
              this.fileShow = 0;
              $(".fileName1").css("color","#5895FF");
            }

    },
    //取消按钮
    cancel() { 
       this.cancelUpFile = true
    },
    delFile() {
     this.flags = false;
     this.fileloaded = false;
    },
    goback() {
      this.delDialogVisible = false ;

    },
    sureCancelFile() {
      this.cos.cancelTask(this.lastTaskId);
      this.flags = false;
      this.fileloaded = false;
      this.fileShow = 0;
      this.media_urls = '';
      this.filesName = '';
      this.size = '';
    },
    reupload() {
      this.cos.cancelTask(this.lastTaskId);
      this.flags = false;
      this.fileloaded = false;
      this.fileShow = 0;
      this.media_urls = '';
      this.filesName = '';
      this.size = '';
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .file_container{
  position: relative;
 }
 #filePopUp{
    display:block;
    border-radius:5px;
    margin-top:-20px;
  }
 #filetop{
   /*height:30px;*/
   font-size:16px;
   font-weight:bold;
   line-height:30px;
   /*background: #E5E5E5;*/
   }
  .bheight{
    height:20px;
  }
  #filemiddle{
      height:30px;
      line-height: 30px;
      text-indent: 15px;
      width:0%;
      background-color:#2FB3FE;
      position: absolute;
      top: 0;
      left: 0;
  }
  #filebottom{
      margin-top:10px;
      /*height:20px;*/
      /*font-size:12px;*/
      color: #aaa;;
  }
  .theight{
    height:30px;
  }
  #filebottom .left{
      float:left;
  }
  #filebottom .right{
      float:right;
  }
  .fileBox{
    /*position: absolute;
    top: 5px;
    right: 10px*/
    padding: 0 30px;
    overflow:hidden;
    position:relative;
  }
  .fileBox video{
    float:left;
  }
  .fileBox .point-info{
    margin-left:340px;
  }
  .fileBox .point-info p{
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #AAAAAA;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
  .fileBox .point-info input{
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
    right:30px;
    cursor:pointer;
  }

  .fileUpBtn{
    width: 280px;
    height: 32px;
    line-height: 32px;
    border:1px solid #dcdfe6;
    border-radius: 2px;
    color: #606266;
    text-align: center;
    font-size: 16px;
    margin: auto;
    margin-top: 10px;
  }
  .uploadRule{
    color: #aaa;
    line-height: 24px;
    text-align: center;
    margin-top: 20px;
  }
  .fileName{
    font-size: 24px;
    text-indent: 20px;
    line-height: 30px;
    margin-top: 60px;
  }
  .mpro1{
    background: #E5E5E5;
    position: relative;
  }
  .overtxt1,.overplus1,.cancelUp1{
    position: absolute;
    height:30px;
    line-height: 30px;
    top: 0;
    right: 10px;
    font-size: 14px;
    color: #444;
  }
  .overtxt1{
    left: 0;
    text-indent: 15px;
  color: #fff;
  }
  .cancel{
    right: 10px;
    z-index: 1000;
  }
  .cancelUp1 img{
    width: 10px;
    height: 10px;
    vertical-align:middle;
    cursor:pointer;
  }
  .transfer1{
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
 .file_container .fileName1{
   font-family: PingFangSC-Regular;
   font-size: 16px;
   width: 280px;
   color: #444444;
   letter-spacing: -0.39px;
   line-height: 16px;
   padding:12px 0 8px;
   word-break: break-all;
   overflow:hidden;
 }
 .file_container .point-info input{
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
 }
</style>
<style scoped>
  
  #del-dialog1{
  text-align: center;
}
 #del-dialog1 .el-dialog__header{
    height:24px;
    line-height:24px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
  }
  #del-dialog1 .el-dialog--center .el-dialog__body{
    padding: 25px 15px 10px;
  }
  #del-dialog1 .dialog-footer{
    margin-left:-25px;
  }
  #del-dialog1 .el-dialog__headerbtn .el-dialog__close{
    display:none;
  }
  #del-dialog1 .el-dialog__footer{
    padding:10px 20px;
  }
  #del-dialog1 .text-center{
    text-align:center;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 24px;
  }
 #del-dialog1 .dialog-footer{
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
