<template>
<div>
	<my-header></my-header>
  <div class="main">
  <div class="tinstruction-container">
    <div class="content">
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/masterIndex/mastermain' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/masterIndex/masterteacher' }">名师管理</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
<!--
      <div class="main">
        <div class="common photo-part">
          <div class="tips-content">
            <div class="title">您的照片<span>此照片会显示在名师列表</span></div>
            <div class="tips">请上传不小于200x200的照片，支持格式：jpg、png</div>
          </div>
          <div class="right pull-right upload-photo">
              <el-upload
                class="avatar-uploader"
                action="http://quan-dev.xiaoheiban.cn/api/?method=teacher.saveHeadImg"
                name="upfile"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="true" src="../../../../static/images/img_user_picture.png" alt="">
                <img v-else :src="tinfo.teacher_img" alt="">
                </el-upload>
          </div>
        </div>
        <div class="common desc-part">
          <div class="title">您的简介<span>此简介会显示在名师列表，不超过30字</span></div>
          <p v-html="teacher.brief"></p>
        </div>
        <div class="common record-part">
          <div class="title">您的简介<span>此简介会显示在名师列表，不超过30字</span></div>
          <p v-html="teacher.description"></p>

        </div>
      </div> -->

      <div class="tinstruction-container content no-instruction">
      <div class="teacher-photo info-list">
        <div class="line">
          <div class="left pull-left">
            <div class="title">您的照片<span>此照片会显示在名师列表</span></div>
            <p>请上传不小于200X200的照片，支持格式：jpg、png</p>
          </div>
          <div class="right pull-right upload-photo">
              <el-upload
                class="avatar-uploader"
                :action="saveHeadImg"
                name="upfile"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="!tinfo.teacher_img" src="../../../../static/images/img_user_picture.png" alt="">
                <img v-else :src="tinfo.teacher_img" alt="">
                </el-upload>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

      <!--简介-->
      <div v-if="tinfo.brief == ''" class="teacher-info info-list no-intro">
        <div class="line">
          <div class="title">您的简介<span>此简介会显示在名师列表，不超过30字</span></div>
          <input type="text" maxlength="30" placeholder="请输入您的简介，不超过30字" v-model="tinfo.brief" />
          <div class="save-info" @click='save_info1'>保存</div>
        </div>
      </div>
      <div v-else class="teacher-info info-list had-intro">
        <div class="line">
          <div class="title">您的简介<span>此简介会显示在名师列表，不超过30字</span></div>
          <div class="modify-btn" @click="modify(1)">
            <img src="../../../../static/images/ic_list_edit.png" alt="">
          </div>
          <p class="info-txt" v-if="!bmodify">
            {{ tinfo.brief }}
          </p>
          <div v-else class="">
            <input type="text" maxlength="30" v-model="tinfo.brief" />
            <div class="save-info" @click='save_info1'>保存</div>
          </div>
        </div>
      </div>

      <!--详细简介-->
      <div v-if="tinfo.description == ''" class="teacher-detail-info info-list no-intro">
        <div class="line">
          <div class="title">您的介绍<span>请尽量详细介绍您的履历以供其他用户对您进行深入的了解</span></div>
            <div class="quill-wrap">
              <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOptions">
              </quill-editor>
            </div>
          <div class="save-info" @click='save_info2'>保存</div>
        </div>
      </div>
      <div v-else class="teacher-info info-list had-intro">
        <div class="line">
          <div class="title">您的介绍<span>请尽量详细介绍您的履历以供其他用户对您进行深入的了解</span></div>
          <div class="modify-btn" @click="modify(2)">
            <img src="../../../../static/images/ic_list_edit.png" alt="">
          </div>
          <div class="info-txt ql-editor" v-if="!dmodify" v-html='tinfo.description'>
          </div>
          <div v-else class="editor-box">
            <div class="quill-wrap">
              <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOptions"
              >
              </quill-editor>
            </div>
            <div class="save-info" @click='save_info2'>保存</div>
          </div>
        </div>
      </div>
    </div>
    </div>

  </div>
  </div>

    <my-footer></my-footer>
</div>
</template>

<script>
import myHeader from './../../common/headTitle.vue';
import myFooter from './../../common/footContent.vue';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)

export default {
  name: 'adminTeacher',
  data () {
    return {
      delDialogVisible: false,
      unableDelDialogVisible: false,
      teacher : {},
      saveHeadImg: '',
      teacher_id: '',
      imageUrl: '',
      imgDataUrl: '',
      flag1: false,
      flag2: false,
      bmodify: false,
      dmodify: false,
      tinfo: {},
      content: '',
           editorOptions: {
                placeholder: '请输入正文内容',
           modules: {
            ImageExtend: {
              loading: true,
              name: 'upfile',
              action: this.global.quillUpLoad,
              response: (res) => {

                console.log(res);
                return res.data.url
              }
            },
            toolbar: {
              container: [
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block'],

                            [{'header': 1}, {'header': 2}],               // custom button values
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
                            [{'direction': 'rtl'}],                         // text direction

                            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],

                            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
                            [{'font': []}],
                            [{'align': []}],
                            ['link', 'image']//去除video即可
                        ],
              handlers: {
                'image': function () {
                  QuillWatch.emit(this.quill.id)
                }
              }
            }
          }
      }
    }
  },
  mounted(){
    this.saveHeadImg = this.global.upLoadTeacherImg+this.$route.query.uid;
    this.teacher_id = this.$route.query.uid
    let obj =
    {
      teacher_id : this.teacher_id
    };
    this.$store.dispatch('GET_TEACHER', obj).then(res => {
      let result = res.data;
      console.log(res)
      let _this = this;
    console.log(JSON.stringify(result));
      this.tinfo = result.teacher;
      this.content = this.tinfo.description;
    }).catch(err => {
        console.log(err)
    })
  },
  methods:{
    modify(type){
      let _this = this;
      if(type == 1){
        _this.bmodify = ! _this.flag1;
      }else{
        _this.dmodify =  ! _this.flag2;
      }
    },
  beforeAvatarUpload(file) {
    console.log(file)
      const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
      }
      return isJPG ;
    },
  //保存头像
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(file)
        console.log(res)
        if(res.code != 200){
          this.$message(res.info);
        }else{
          this.$message(res.info);
      console.log(res)
      console.log(res.data.url)
          this.tinfo.teacher_img = res.data.url
        }
    },
    saveTinfo(obj){
      console.log(obj)
      this.$store.dispatch('SAVE_TEACHER',obj).then(res => {
        console.log(res)
        let result = res.data;
            let _this = this
        if(result.status == 1){
         _this.$message.success('保存成功')
            _this.$router.go(0)
        }
      }).catch(err => {
          console.log(err)
      })
    },
    save_info1() {
     if(this.tinfo.brief.length > 30) {
        this.$message.error('长度超过30')
        return
      }
      let obj = {
        brief: this.tinfo.brief,
        teacher_id: this.$route.query.uid
      }
      this.saveTinfo(obj)
    },
    save_info2() {
    let obj = {
      description: this.content,
      teacher_id: this.$route.query.uid
    }
    this.saveTinfo(obj)
    }
  },
   computed: {
      editor() {
          return this.$refs.myTextEditor.quillEditor;
      }
   },
  components: {
      quillEditor,
      myHeader,
      myFooter
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .main{
    padding:24px 32px 16px;
    background: #F6F6F6;
  }
  .tinstruction-container{
    min-width:810px;
    padding:0;
    background:none;
    .breadcrumb{
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 16px;
      padding-bottom:20px;
    }
    .main{
      padding:0 20px 20px;
      background-color:#FFFFFF;
      border:1px solid #E5E5E5;
      .common{
        padding:20px 0;
        border-bottom:1px solid #E5E5E5;
        .title{
          height:28px;
          font-family: PingFangSC-Light;
          font-size: 24px;
          color: #444444;
          letter-spacing: -0.58px;
          line-height: 28px;
          padding-bottom:10px;
          span{
            display:inline-block;
            font-family: PingFangSC-Light;
            font-size: 16px;
            color: #AAAAAA;
            letter-spacing: -0.39px;
            line-height: 28px;
            margin-left:10px;
            vertical-align:top;
          }
        }
        p{
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 24px;
          img{
            max-width:100%;
            height:auto;
            margin:5px 0;
          }
        }
      }
      .common:last-child{
        border-bottom:none;
      }
      .photo-part{
        overflow:hidden;
        img{
          float:right;
          width:224px;
          height:224px;
        }
        .tips-content{
          margin-right:240px;
          .title{
            height:28px;
            font-family: PingFangSC-Light;
            font-size: 24px;
            color: #444444;
            letter-spacing: -0.58px;
            line-height: 28px;
            span{
              display:inline-block;
              font-family: PingFangSC-Light;
              font-size: 16px;
              color: #AAAAAA;
              letter-spacing: -0.39px;
              line-height: 28px;
              margin-left:10px;
              vertical-align:top;
            }
          }
          .tips{
            padding:20px 0;
            font-family: PingFangSC-Light;
            font-size: 16px;
            color: #444444;
            letter-spacing: -0.39px;
            line-height: 24px;
          }
        }
      }
    }
  }

  .upload-photo{
    float:right;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 224px;
    height: 224px;
    line-height: 224px;
    text-align: center;
  }
  .avatar {
    width: 224px;
    height: 224px;
    display: block;
  }
  .tinstruction-container .info-list{
    padding:0 20px;
    border-bottom:none;
  }
  .tinstruction-container .info-list .line{
    padding:20px 0;
    border-bottom:1px solid #F4F8FF;
  }
  .no-instruction{
    background-color:#FFFFFF;
  }
  .tinstruction-container .info-list:hover .line{
		border-bottom:1px solid #F4F8FF;
  	}
</style>
<style>
.info-list .ql-editor{
  padding:12px 15px 0;
}
</style>
