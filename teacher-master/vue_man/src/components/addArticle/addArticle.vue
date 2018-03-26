<template>
<div>
    <my-header></my-header>
    <div class="main-container add-article">
        <div class="content-history">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" v-if="userType == 2">
                <el-breadcrumb-item :to="{ path: '/'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleman'}"  v-if="orgin == 'articleMan'">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="newArticle == 'newArticle'">新增文章</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleDetails' , query:{article_id: article_id}}"  v-if="orginArticleDetails == 'articleDetails'">文章详情</el-breadcrumb-item>
                <el-breadcrumb-item v-if="orginArticleDetails == 'articleDetails'">编辑文章</el-breadcrumb-item>
            </el-breadcrumb>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb" v-if="userType == 1">
                <el-breadcrumb-item :to="{ path: '/masterIndex/mastermain'}">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/masterIndex/masterarticle'}">文章管理</el-breadcrumb-item>
                <el-breadcrumb-item>文章详情</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="tip-addarticle">
                为保障用户体验，晓黑板教师圈平台严禁恶意营销以及诱导分享朋友圈，严禁发布色情低俗、暴力血腥、政治谣言等各类违反法律法规及相关政策规定的信息。一旦发现，我们将严厉打击和处理。
            </div>
            <div class="article-all">
                <!--article-detail-->
                <div class="article-detail">
                    <div class="article-title">文章标题</div>
                    <input type="text" ref="articleTitle" placeholder="请在这里添加标题，不多于20字" maxlength="20" class="title" v-model="tinfo.title">
                    <div class="article-img">文章封面</div>
                    <div class="article-tip-img">不小于300X200像素图片，支持JPG、PNG格式</div>
                    <div class="label-img">
                           <el-upload
                              class="avatar-uploader"
                              :action="upLoadArticleImg"
                              name="upfile"
                              :show-file-list="false"
                              :on-success="handleAvatarSuccess"
                              :before-upload="beforeAvatarUpload">
                              <img v-if="upImg.url" :src="upImg.url" class="avatar">
                              <i v-else class="el-icon-plus avatar-uploader-icon" style="width:280px;height:158px;position:relative;"></i>
                            </el-upload>
                    </div>
                    <div class="article-price" >观看文章价格</div>
                    <el-select v-model="defaultValue" placeholder="请选择" class="price-select">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <div>
                      <div class='upFile'>附件</div>
                      <div v-show="attachmentName != ''">
                        <div class='fileTitle'>{{ attachmentName }}</div>
                        <div class="delFile" @click="reupload"><p>删除附件</p></div>
                      </div>
                      <div v-show="attachmentName == ''">
                        <upLoadFile ref="upLoadFile"></upLoadFile>
                      </div>
                       <div class="article-tip-img">附件大小不超过50MB</div>
                    </div>
                </div>
                <!--article-detail-->
                <!--article-edit-->
                <div class="article-edit">
                    <div class="editor-container">
                        <div class="common-item" v-if="addTypes === '2' ">
                          <div v-show="mediaType == 2">
                             <div class="exist-box">
                              <h2>{{ filesName }}</h2>
                               <audio :src="media_url" width="325px" controls></audio>
                              <div class="point-info">
                                <input type="button" value="重新上传" @click="reup" class="reupload"/>
                              </div>
                            </div>
                          </div>
                          <div v-show='mediaType == 1'>
                           <upLoadAudio ref="upLoad1"></upLoadAudio>
                         </div>
                        </div>

                        <div class="common-item" v-if="addTypes === '3' ">
                          <div v-show="mediaType == 2">
                             <div class="exist-box">
                              <h2>{{ filesName }}</h2>
                               <video :src="media_url" width="325px" controls></video>
                              <div class="point-info">
                                <input type="button" value="重新上传" @click="reup" class="reupload"/>
                              </div>
                            </div>
                          </div>
                          <div v-show="mediaType == 1">
                            <upLoadVideo ref="upLoad2"></upLoadVideo>
                         </div>
                       </div>
                        <div class="editor-box">
                          <div class="quill-wrap">
                            <quill-editor
                              v-model="content"
                              ref="myQuillEditor"
                              :options="editorOptions"
                            >
                            </quill-editor>
                          </div>
                            <div class="button-edit-box">
                                <div class="button-edit">
                                    <button class="keep-button" @click="saveArticle">保存</button>
                                    <button class="preview-button" @click="preview">预览</button>
                                </div>
                                <div class="note-text">发布文章即表示同意<span @click='agreement'>晓黑板著作协议</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--article-edit-->
            </div>
        </div>
    </div>
 

    <el-dialog
        title="文章详情"
        :visible.sync="flag"
        width="375px"
        center
        id="article-details-dialog">
        <div class="text-center">
            <div class="audio-box" v-if="addTypes == 2 && previewInfo.media_url != ''">
                <img :src="upImg.url">
                <audio :src="previewInfo.media_url"  controls="controls" style="display:block;object-fit:fill;margin-top:-7px;"></audio>
            </div>
            <div class="video-box" v-if="addTypes == 3 && previewInfo.media_url != ''">
                <video :src="previewInfo.media_url" width="325px" controls="controls" :poster="upImg.url" style="display:block;object-fit:fill"></video>
            </div>

            <div class="title">{{previewInfo.title}}</div>
            <div class="info">
                <div class="name">
                    <img :src="previewInfo.teacher_img"/>
                    <span>{{previewInfo.teacher_name}}</span>
                </div>
                <div class="time">{{previewInfo.create_time}}</div>
            </div>
            <div class="article-details ql-editor" v-html="previewInfo.content">
                <!--<div class="buy">2018/12/22&nbsp;&nbsp;已购</div>-->
            </div>

             <div class="attachment" style="" v-if="previewInfo.attachment_name !== ''">
              <div class="pull-left" style="display:inline-block;">
                <img src="../../images/attachment.jpeg">
              </div>
               <div class="pull-left attachment_right" style="display:inline-block;">
                  <span>附件: {{ previewInfo.attachment_name }}</span>
               </div>
             </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible">取 消</el-button>
        <el-button type="primary" @click="previewDialogVisible">确 定</el-button>
        </span>
    </el-dialog>
    
     <el-dialog
        title="晓黑板著作协议"
        :visible.sync="agreements"
        width="800px"
        center
        id="article-details-dialog">
        <div class="text-center ql-editor">
            <p>欢迎您使用上海晓信信息科技有限公司提供的晓黑板教师圈平台服务！</p><p>《晓黑板教师圈用户协议》（以下简称“本协议”）是由您（以下称为“用户”）与上海晓信信息科技有限公司（以下称为“晓信科技”或“晓信”）之间关于您使用晓黑板教师圈平台服务所订立的协议。</p><p><strong>1.&nbsp;特别提示</strong></p><p>晓信科技同意按照本协议的规定及其不时发布的操作规则提供基于互联网的相关服务(以下称"网络服务")，为获得发布服务，用户同意本协议的全部条款并按照页面上的提示完成全部的发布操作。用户在操作过程中点击"发布"按钮即表示用户已经详细阅读了本协议的内容，同意遵守本协议的约定。用户不应再以不了解本协议内容为由拒绝履行本协议。<strong>晓黑板教师圈平台有权对本协议随时进行修改与更新，并在相关后台公告修改、新增、删除的内容，而不另行对用户进行个别通知。</strong>修改后的服务协议一旦在页面上公布即有效代替原来的服务协议。请用户随时造访查看本协议的最新版本。用户在使用晓黑板教师圈平台提供的各项服务之前，应仔细阅读本服务协议，如用户不同意本服务协议及/或随时对其的修改，用户可以主动取消晓黑板教师圈提供的服务。</p><p><strong>2.&nbsp;服务内容</strong></p><p>2.1 晓黑板教师圈平台包括但不限于晓黑板APP、晓黑板PC端（www.xiaoheiban.cn）及晓黑板web端等软件，其服务的具体内容由晓黑板教师圈平台根据实际情况提供，包括但不仅限于查看和发表文字、视频、图片、语音等。晓黑板教师圈平台保留随时变更、中断或终止部分或全部网络服务的权利。</p><p>2.2 用户自主提供优质原创内容（内容形式包括但不限于文字、视频、图片、语音等），点击“发布”按钮后提交由晓黑板教师圈平台审核，内容要符合原创、优质、合法等原则。发布后内容的著作权归属于用户本人，内容信息的知识版权归晓信科技所有，任何媒体、网站或个人在转载使用时必须注明“文章来源：晓黑板教师圈”，违者本公司将依法追究责任。</p><p>2.3 用户所发布的内容，均属用户本人原创，晓黑板教师圈平台有权进行审核，审核通过后确认发布。如用户发布的内容违法或侵权，晓黑板教师圈平台将立即删除该内容，同时保留追究法律责任的权利。</p><p><strong>3.&nbsp;使用规则</strong></p><p>3.1&nbsp;用户应使用晓黑板软件接受晓黑板教师圈平台网络服务。</p><p>3.2&nbsp;用户在申请使用晓黑板教师圈平台提供的网络服务时，必须向晓黑板教师圈平台申请注册并提供真实、完整、有效的个人资料，依据相关法律规定和本协议约定对所提供的信息承担相应的法律责任。如个人资料有任何变动，必须及时更新。如因资料提供不准确或所提供的资料已变更而未更新而导致晓黑板教师圈平台无法为用户提供或进一步提供服务，晓黑板教师圈平台不因此承担任何责任。</p><p>3.2&nbsp;用户需自行注册晓黑板账号，注册成功后，用户有义务妥善保管其账号及密码，并正确、安全地使用其账号及密码，并对登录后所持账号产生的行为依法享有权利和承担责任。</p><p>3.3&nbsp;用户发现其账号或密码被他人非法使用或有使用异常的情况，应立即通知晓黑板教师圈平台，并提交该帐号为本人所有的有关证明，以便申请暂停该帐号的登录和使用；因此而造成的损失，晓黑板教师圈平台不承担赔偿责任。</p><p><strong>3.4&nbsp;用户在使用晓黑板教师圈平台网络服务过程中，必须遵循以下原则：</strong></p><p><strong>（1）遵守中国有关的法律和法规；</strong></p><p><strong>（2）遵守所有与网络服务有关的网络协议、规定和程序；</strong></p><p><strong>（3）不得为任何非法目的而使用网络服务系统；</strong></p><p><strong>（4）不得利用晓黑板教师圈平台网络服务系统进行任何可能对互联网的正常运转造成不利影响的行为；</strong></p><p><strong>（5）不得利用晓黑板教师圈平台网络服务系统传输任何骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料；</strong></p><p><strong>（6）不得未经晓黑板教师圈平台授权利用其提供的网络服务以任何方式收集任何其它用户的信息，包括但不限于用户的个人身份信息和通讯信息；</strong></p><p><strong>（7）不得利用晓黑板教师圈平台服务系统进行任何不利于晓黑板教师圈平台及其关联公司的行为；</strong></p><p><strong>（8）就晓黑板教师圈平台及合作商业伙伴的服务、产品、业务咨询应采取相应机构提供的沟通渠道，不得在公众场合发布有关晓黑板教师圈平台及相关服务的负面宣传。</strong></p><p>3.5关于用户提现的特别提示：</p><p>（1）晓黑板教师圈平台将有权决定晓黑板教师圈平台服务的资费标准和收费方式，晓黑板教师圈平台可能会就不同的服务制定不同的资费标准和收费方式，也可能按照晓黑板教师圈平台所提供的服务的不同阶段确定不同的资费标准和收费方式；另外，晓黑板教师圈平台也可能不时地修改晓黑板教师圈平台的资费政策。</p><p>（2）<strong>在使用晓黑板教师圈平台提现系统时，用户必须仔细确认自己的帐号，若因为用户自身输入帐号错误、操作不当或不了解提现方式等因素造成提错帐号、错选账号等情形而损害自身权益，不得因此要求晓黑板教师圈平台作任何补偿或赔偿。</strong></p><p>3.6用户使用根据本协议获得的用户账号和密码登录晓黑板教师圈平台或接受其他晓信科技提供的服务项目时，应遵守该平台或服务项目的相关服务协议及使用守则，用户登录上述平台或接受上述服务项目时即视为对相关服务协议及使用守则的接受。</p><p><strong>5.&nbsp;隐私保护</strong></p><p>在不透露单个用户隐私资料的前提下，晓黑板教师圈平台有权对整个用户数据库进行技术分析并对已进行分析、整理后的用户数据库进行商业上的利用。尽管晓黑板教师圈平台对用户的隐私权保护做了极大的努力，但是仍然不能保证现有的安全技术措施使用户的内容信息等不受任何形式的损失。</p><p>6.&nbsp;<strong>服务变更、中断或终止</strong></p><p>6.1&nbsp;鉴于网络服务的特殊性，用户同意晓黑板教师圈平台有权根据业务发展情况随时变更、中断或终止部分或全部的网络服务，无需对任何用户或任何第三方承担任何责任。如因系统维护或升级的需要而需暂停网络服务，晓黑板教师圈平台将尽可能事先进行通告。</p><p>6.2&nbsp;<strong>如发生下列任何一种情形，晓黑板教师圈平台有权随时中断或终止向用户提供本协议项下的网络服务且不承担任何责任：</strong></p><p><strong>（1）有违反本服务协议的行为；&nbsp;</strong></p><p><strong>（2）滥用所享受的权利；&nbsp;</strong></p><p><strong>（3）提供虚假注册信息；&nbsp;</strong></p><p><strong>（4）通过不正当手段使用晓黑板教师圈平台提供的网络服务；&nbsp;</strong></p><p><strong>（5）有损晓黑板教师圈平台及其权利人、关系企业或合作对象的权益和其他用户合法权益的行为；&nbsp;</strong></p><p><strong>（6）违反中国的法律、法规；&nbsp;</strong></p><p><strong>（7）违背社会风俗和社会道德的行为；&nbsp;</strong></p><p><strong>（8）其他违反晓黑板教师圈平台相关规定的行为。</strong></p><p>6.3&nbsp;除前款所述情形外，晓黑板教师圈平台同时保留在不事先通知用户的情况下随时中断或终止部分或全部网络服务的权利，对于所有服务的中断或终止而造成的任何损失，晓黑板教师圈平台无需对用户或任何第三方承担任何责任。</p><p>7.&nbsp;<strong>其他规定</strong></p><p>7.1&nbsp;本协议构成双方对本协议之约定事项及其他有关事宜的完整协议，除本协议规定的之外，未赋予本协议各方其他权利。</p><p>7.2&nbsp;如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p><p>7.3&nbsp;晓黑板教师圈平台保留对本协议条款、产品和服务以及晓信科技所提供的产品和服务的相关官方网站的最终解释权。&nbsp;</p>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="agreements = false">取 消</el-button>
        <el-button type="primary" @click="agreements = false">确 定</el-button>
        </span>
    </el-dialog>
   <my-footer></my-footer>
</div>
</template>
<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import {quillEditor, Quill} from 'vue-quill-editor';
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module';
Quill.register('modules/ImageExtend', ImageExtend);

import myHeader from './../common/headTitle.vue';
import upLoadAudio from '../upLoad/upAudio.vue';
import upLoadVideo from '../upLoad/upVideo.vue';
import upLoadFile from '../upLoad/upFile.vue';
import myFooter from '../common/footContent.vue';
export default {
  name: 'AddArticle',
  data () {
    return {
        tinfo: {},
        mediaType: 0,
        upImgUrl: '',
        agreements: false,
        upImg:{
          name: '',
          prevname: '',
          url: ''
        },
        value: '',
        upfile: '',
        userType: 0,
        articleTitle: '',
        imageUrl: '',
        upLoadArticleImg: this.global.upLoadArticleImg,
        options: [{
          value: '0',
          label: '免费'
        }],
        defaultValue:'',//默认选中免费
        addTypes: '',
        article_id: '',
        newArticle:'',
        orgin:'',
        orginArticleDetails:'',
        filesName: '',
        media_url: '',
        media: '',
        media_name: '',
        media_size: '',
        mediaSize: '',
        attachmentName : '',
        attachmentUrl: '',
        attachmentSize: '',
        attachment_url: '',
        attachment_name: '',
        attachment_size: '',
        content: '',
        editorOption: {
            // something config
        },
        flag: false,
        previewInfo:{},
        editorOptions: {
                placeholder: '请输入正文内容',
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
   created(){
    console.log(this.$route.query)
    let goType = localStorage.getItem('goType');
    this.addTypes = goType;
    console.log(goType)
  },
  mounted(){
      this.defaultValue = this.options[0].label;
    //通过本地存储取得type
    console.log(this.upImgUrl)
    this.userType = localStorage.getItem('userType');
    let goType = localStorage.getItem('goType');
    this.addTypes = goType;
    this.newArticle = localStorage.getItem('newArticle');
    this.orgin = localStorage.getItem('orgin');
    this.orginArticleDetails = localStorage.getItem('orginArticleDetails');
    this.show = true;

    //获取数据 如果是从编辑页面进入的话
    if(this.$route.query.article_id){
      this.article_id = this.$route.query.article_id;
      let that = this;
      let obj = {
          aid: this.article_id
        }
     that.$store.dispatch('GET_ARTICLE_DETAILS',obj)
        .then(res => {
          if(res.code != 200){
            this.$message.error(res.info);
            }
          console.log(res)
          this.tinfo = res.data;
          this.filesName = res.data.media_name;
          this.media_url = res.data.media_url;
          this.mediaSize = res.data.media_size;
          this.content = res.data.content;
          this.upImg.url = res.data.cover;

          this.attachmentName = res.data.attachment_name;
          this.attachmentUrl = res.data.attachment_url;
          this.attachmentSize = res.data.attachment_size;
          //重新上传
          this.change(this.media_url)
           }).catch( err =>{
            console.log(err)
        })
    } else {
      //新增文章
     this.mediaType = 1;
    };
    console.log(this.media_url)

  },
  computed: {
     upImgUrl() {
      return this.$store.state.upLoadUrlTest
     }
  },
  methods: {
    // 有媒体文件的时候，选择重新上传
    change(a){
      if(a == ""){
        this.mediaType = 1
      }else{
        this.mediaType = 2
      }
    },
    reup() {
       this.mediaType = 1
    },
    //保存按钮
    saveArticle() {
      console.log(this.addTypes)
      let contents = this.content;
      if(this.addTypes == "2"){
        this.media = this.$refs.upLoad1.getUrl() ? this.$refs.upLoad1.getUrl(): "";
        this.media_name = this.$refs.upLoad1.getName() ? this.$refs.upLoad1.getName(): "";
        this.media_size = this.$refs.upLoad1.getSize() ? this.$refs.upLoad1.getSize(): "";
      }else if(this.addTypes == "3"){
        this.media = this.$refs.upLoad2.getUrl() ? this.$refs.upLoad2.getUrl() : "";
        this.media_name = this.$refs.upLoad2.getName() ? this.$refs.upLoad2.getName(): "";
        this.media_size = this.$refs.upLoad2.getSize() ? this.$refs.upLoad2.getSize(): "";
      }

      this.attachment_url = this.$refs.upLoadFile.getUrl() ;
      this.attachment_name = this.$refs.upLoadFile.getName() ;
      this.attachment_size = this.$refs.upLoadFile.getSize() ;

      console.log(contents)
      console.log(this.media)
     // 添加文章
          let obj2 = {
            title : this.$refs.articleTitle.value,
            content : contents,
            cover : this.upImg.url,
            media_url : this.media == '' ? this.media_url : this.media,
            media_name: this.media_name == '' ? this.filesName : this.media_name,
            media_size: this.media_size == '' ?this.mediaSize :  this.media_size,
            type: localStorage.getItem('goType'),
            point: this.value,
            aid: this.article_id,
            attachment_url: this.attachment_url == '' ? this.attachmentUrl : this.attachment_url, 
            attachment_name: this.attachment_name == '' ? this.attachmentName : this.attachment_name,
            attachment_size: this.attachment_size == '' ? this.attachmentSize : this.attachment_size
          }
          if(obj2.content == ''){
              this.$message.error('内容不能为空');
              return;
          }
          if(obj2.title == ''){
              this.$message.error('标题不能为空');
              return;
          }
          if(obj2.cover == ''){
              this.$message.error('图片不能为空');
              return;
          }
          if(this.addTypes != "1" && obj2.media_url == ''){
             this.$message.error('音频/视频不能为空');
              return;
          }
          console.log(obj2)
       this.$store.dispatch('ADD_ARTICLE', obj2)
       .then(res => {
            console.log(res)
            this.$message.success('保存成功')
            this.$router.push({path:'/articleMan'})
       }).catch(err => {
        console.log(err)
       })
  },
  //上传成功回调
  handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(res);
        if(res.code != 200){
          this.$message(res.info);
        }else{
          this.$message(res.info);
		      console.log(file)
          console.log(res)
          this.upImg.name = res.data.name;
          this.upImg.prevname = res.data.prevname;
          this.upImg.url = res.data.url;
        }
    },
    //上传前文件检测
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'||file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        console.log(file)

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG 格式!');
        }
        return isJPG ;
      },
    //重新上传附件
    reupload() {
      console.log('aha')
      this.attachmentName = '';
      console.log("11111111")
    },
    //预览功能
    preview(){
       let contents = this.content;
       console.log(this.addTypes)
       if(this.addTypes == "2"){
        this.media = this.$refs.upLoad1.getUrl() ;
        this.media_name = this.$refs.upLoad1.getName() ;
        this.media_size = this.$refs.upLoad1.getSize() ;
       }else if(this.addTypes == "3"){
        this.media = this.$refs.upLoad2.getUrl();
        this.media_name = this.$refs.upLoad2.getName() ;
        this.media_size = this.$refs.upLoad2.getSize() ;
       }
        let obj3 = {
            title : this.$refs.articleTitle.value,
            content : contents,
            cover : this.upImg.url,
            media_url : this.media == '' ? this.media_url : this.media,
            media_name: this.media_name == '' ? this.filesName : this.media_name,
            media_size: this.media_size == ''? this.mediaSize: this.media_size,
            attachment_name: this.attachment_name,
            type: this.addTypes,
            point: this.value,
            preview: 1,
            aid: this.article_id
         }
         if(obj3.content == ''){
              this.$message.error('内容不能为空');
              return;
          }
          if(obj3.title == ''){
              this.$message.error('标题不能为空');
              return;
          }
          if(obj3.cover == ''){
              this.$message.error('图片不能为空');
              return;
          }
          if(this.addTypes != "1" && obj3.media_url == ''){
             this.$message.error('音频/视频不能为空');
              return;
          }
          this.flag = true;
         console.log(obj3)
         this.$store.dispatch('ARTICLE_PREVIEW', obj3)
        .then(res => {
          console.log(res)
               console.log(res.data.data)
              if(res.data.code != 200){
              this.$message.error(res.info);
              }
            this.previewInfo = res.data.data;
            console.log(111111111)
            console.log(this.previewInfo);
        }).catch(err => {
            console.log(err)
        })
    },
    previewDialogVisible(){
        this.flag =false;
    },
    goDetails(){
      let id = this.$route.query.article_id
      console.log(id)
      this.$router.push({path:'/articleDetails', query: {article_id: id}});
    },
    imgHandler(state) {
        let fileClick = this.container.querySelector('button.ql-image');
    },
    agreement (){
      this.agreements = true;
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
    upLoadAudio,
    upLoadVideo,
    upLoadFile,
    myFooter
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .main-container *{
        box-sizing:border-box;
    }
    .content-history{
        padding: 0 20px;
        min-width: 1024px
    }
    .breadcrumb{
      margin-bottom:15px;
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 16px;
    }
    .price-select{
        margin-top:10px;
        width:280px;
        height:44px;
    }
    .article-all .article-detail .article-tip-img{
        margin-bottom:8px;
    }
    .article-edit .common-item{
       width:100%;
       /*height:224px;*/
       border: 1px solid #E5E5E5;
       background: #FFFFFF;
       margin-bottom:20px;
       padding-bottom: 30px;
    }
    .fileTitle {
      color: #5895FF;
      margin-bottom: 8px;
      margin-top: 5px;
    }
    .delFile {
      border: 1px solid #E5E5E5;
      width: 112px;
      height: 32px;
      text-align: center;
      line-height: 32px; 
    }
    .editor-box{
        background:#ffffff;
        border: 1px solid #E5E5E5;
    }
    .button-edit-box{
        padding:0 20px 20px;
    }
    .keep-button{
        border:none;
    }
    .article-all .button-edit{
        border-top:none;
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
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 100%;
      height: 100%
      }
    .article-details-dialog .el-dialog--center .el-dialog__body{
        padding: 25px 15px 30px;
     }
    .text-center .video-box{
        margin-bottom:20px;
    }
    .text-center .audio-box{
      margin-bottom:20px;
    }
    .text-center .audio-box img{
      width: 100%;
      height: 150px
    }
    .text-center .audio-box audio{
      width: 100%;
    }
    .text-center .title{
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #000000;
        letter-spacing: -0.48px;
        line-height: 24px;
        margin-bottom:20px;
    }
    .text-center .info{
        margin-bottom:5px;
        height:28px;
        overflow:hidden;
    }
    .text-center .info .name{
        float:left;
    }
    .text-center .info .name img{
        width:28px;
        height:28px;
        border-radius:50%;
        margin-right:2px;
    }
    .text-center .info .name span{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #222222;
        letter-spacing: -0.34px;
        line-height: 28px;
        vertical-align:top;
    }
    .text-center .info .time{
        float:right;
        font-family: PingFangSC-Light;
        font-size: 14px;
        color: #AAAAAA;
        letter-spacing: -0.34px;
        line-height: 28px;
    }
    .text-center .article-details p{
        font-family: PingFangSC-Light;
        font-size: 17px;
        color: #000000;
        letter-spacing: 0;
        line-height: 25px;
        margin-bottom:15px;
    }
    .text-center .article-details img{
        display:block;
        max-width:100%;
        margin-bottom:15px;
    }
    .text-center .article-details .buy{
       font-family: PingFangSC-Light;
       font-size: 14px;
       color: #AAAAAA;
       letter-spacing: -0.34px;
       line-height: 14px;
       text-align:right;
    }
     #article-details-dialog .dialog-footer{
        text-align: center;
    }
    .dialog-footer button{
        height: 32px;
        width: 120px;
        line-height:8px;
    }
    .dialog-footer .el-button+.el-button{
       background-color:#5895FF;
       border-color:#5895FF;
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
    .article-all .article-detail{
        height:auto;
    }
    .upload-demo11{
      float: left;
    }
    .el-icon-plus:before{
        position: absolute;
        top:50%;
        left:50%;
        margin:-89px 0 0 -27px;
    }
    .exist-box{
        padding:20px 20px 0;
    }
    .exist-box h2{
        font-family: PingFangSC-Regular;
        font-size: 24px;
        color: #444444;
        letter-spacing: -0.58px;
        line-height: 24px;
        padding-bottom:15px;
    }
    .exist-box .reupload{
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
        margin-top:20px;
        cursor:pointer;
    }
  .quill-wrap .ql-toolbar.ql-snow .ql-video{
      display:  none;
  }
  .attachment{
    background-color:#EFEFEF; 
    height: 44px;
    overflow: hidden;
  }
  .attachment img{
    width: 44px;
  }
  .attachment_right{
    width: 260px;
    margin-left: 5px;
  }
  .attachment_right span{
    width: 260px;
   display:  inline-block;
   height: 44px;
   line-height: 44px;
   text-overflow: ellipsis; 
   white-space: nowrap; 
   overflow: hidden;
  }
</style>
<style >
    .text-center .article-details img{
        max-width:100%;
        margin-bottom:2px;
    }
    .ql-editor{
     padding-bottom: 0px; 
    }
    .avatar-uploader .avatar-uploader-icon{
        font-size: 52px;
        color: #AAAAAA;
    }
    .price-select .el-select-dropdown__item{
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #444444;
        letter-spacing: -0.39px;
        line-height: 16px;
    }
</style>
