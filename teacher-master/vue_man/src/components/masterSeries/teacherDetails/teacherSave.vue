<template>
	<div class="content-container" style="padding-right: 20px;">
		<div class="tinstruction-container content no-instruction">
			<div class="teacher-photo info-list">
				<div class="line">
					<div class="left pull-left">
						<h3>您的照片<span>此照片会显示在名师列表</span></h3>
						<p>请上传不小于200X200的照片，支持格式：jpg、png</p>
					</div>
					<div class="right pull-right upload-photo">
							<el-upload
								class="avatar-uploader"
								action="http://quan-dev.xiaoheiban.cn/api/?auth_token=YWRmNVFUZGFZbzBkcUJWMWxhVWtaQVd4ZmFtRnFRMHZuUXM4K1psbmVjK3ZUbnFmRzAxR2VLSS81NGxsalQwMGRmeWxzVyszL293dzByYw==&method=teacher.saveHeadImg"	
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
					<h3>您的简介<span>此简介会显示在名师列表，不超过30字</span></h3>
					<input type="text" maxlength="30" placeholder="请输入您的简介，不超过30字" v-model="tinfo.brief" />
					<div class="save-info" @click='save_info1'>保存</div>
				</div>
			</div>
			<div v-else class="teacher-info info-list had-intro">
				<div class="line">
					<h3>您的简介<span>此简介会显示在名师列表，不超过30字</span></h3>
					<div class="modify-btn" @click="modify(1)">
						<img src="../../../../static/images/ic_list_edit.png" alt="">
					</div>
					<p class="info-txt" v-if="!bmodify">
						{{ tinfo.brief }}
					</p>
					<div v-else class="">
						<input type="text ql-editor" maxlength="30" v-model="tinfo.brief" />
						<div class="save-info" @click='save_info1'>保存</div>
					</div>
				</div>
			</div>
	
			<!--详细简介-->
			<div v-if="tinfo.description == ''" class="teacher-detail-info info-list no-intro">
				<div class="line">
					<h3>您的介绍<span>请尽量详细介绍您的履历以供其他用户对您进行深入的了解</span></h3>
					<template><UE text="" ref="ueBox"></UE></template>  
					<div class="save-info" @click='save_info2'>保存</div>
				</div>
			</div>
			<div v-else class="teacher-info info-list had-intro">
				<div class="line">
					<h3>您的介绍<span>请尽量详细介绍您的履历以供其他用户对您进行深入的了解</span></h3>
					<div class="modify-btn" @click="modify(2)">
						<img src="../../../../static/images/ic_list_edit.png" alt="">
					</div>
					<div class="info-txt" v-if="!dmodify" v-html='tinfo.description'>
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
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)



export default {
  name: 'teacherIntro',
  data () {
    return {
    	imageUrl: '',
    	imgDataUrl: '',
    	saveHeadImg:'',
    	flag1: false,
    	flag2: false,
    	bmodify: false,
    	dmodify: false,
    	tinfo: {},
    	content: '',
        editorOptions: {
            modules: {
            ImageExtend: {
              loading: true,
              name: 'upfile',
              action: 'http://quan-dev.xiaoheiban.cn/api/upload/image',
              response: (res) => {

                console.log(res);
                return res.data.url
              }
            },
            toolbar: {
              container: container,
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
  	this.saveHeadImg = 'http://quan-dev.xiaoheiban.cn/api/?auth_token=YWRmNVFUZGFZbzBkcUJWMWxhVWtaQVd4ZmFtRnFRMHZuUXM4K1psbmVjK3ZUbnFmRzAxR2VLSS81NGxsalQwMGRmeWxzVyszL293dzByYw==&teacher_id=1&method=teacher.saveHeadImg';

  	this.$store.dispatch('GET_TEACHER').then(res => {
  		if(res.code != 200){
          this.$message.error(res.info);
          }
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
  	  quillEditor
  }
}
</script>

<style lang="less">
	#editor{
		margin-top: 15px;
	}
	.tinstruction-container 
	{	
		&.no-instruction{
			.no-intro:hover{
				background: none;
			}
		}
	}
	.tinstruction-container .had-intro:hover {
	  background: #F4F8FF;
	}
	.tinstruction-container .had-intro:hover .modify-btn {
	  display: block;
	}
	.upload-photo{
		float:right;
	}
	.avatar-uploader .el-upload {
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
	.tinstruction-container .teacher-photo .upload-photo img{
		width: 224px;
		height: 224px;
	}
	.tinstruction-container .info-list .modify-btn{
		top:18px;
		right:20px;
	}
	.tinstruction-container{
    	padding:0;
  	}
  	.tinstruction-container .info-list{
    	padding:0 20px;
		border-bottom:none;
  	}
	.tinstruction-container .info-list .line{
		padding:20px 0;
		border-bottom:1px solid #E5E5E5;
  	}
	.tinstruction-container .info-list:last-child .line{
		border-bottom:none;
  	}
	.tinstruction-container .info-list:hover .line{
		border-bottom:1px solid #F4F8FF;
	}
	.editor-box{
		margin-top:15px;
	}
</style>