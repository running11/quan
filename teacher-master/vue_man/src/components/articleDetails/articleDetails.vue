<template>
<div>
	<my-header></my-header>
  <div class="main-container">
    <div class="content-container" style="margin-left: 0;">
      <div class="artinfo-container content">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>文章详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!--article-detailed-->
        <div class="article-detailed detailed pull-left">
          <div class="title-box">
            <div class="state">
              <span class="del-article" @click="delArticle">删除文章</span>
              <span @click='goToEdit'>编辑</span>
            </div>
            <h2>{{ item.title }}</h2>
            <div class="clearfix"></div>
          </div>
          <h5><span>{{ item.create_time }}</span><span>文章价格：{{ item.money }}</span></h5>
          <div class="video-box" v-if="articleType == 2 && item.media_url != ''">
              <audio :src="item.media_url" width="380px" controls></audio>
          </div>
          <div class="video-box" v-if="articleType == 3 && item.media_url != ''">
              <video :src="item.media_url" width="380px" controls="controls"></video>
          </div>

          <div class="detailed-txt ql-editor" v-html="item.content">

          </div>
        </div>
        <!--article-detailed-->
        <!--comment-list-->
        <div class="comment-detailed detailed pull-right">
					<div class="top">
						<div class="title pull-left">评论管理</div>
						<el-button type="text" @click="speakDialogVisible = true" class="teacher-btn pull-right">发言</el-button>
						<div class="clearfix"></div>
					</div>

					<div class="comment-list">
						<div class="clist"  v-for = "(items,index) in item.comments.rows">
							<div class="clist-txt">
								<span class="bTxt">{{ items.user_user }}</span>
								<span>：{{ items.content}}</span>
							</div>
							<div class="clist-bottom">
								<div class="clist-time pull-left">{{ items.create_time }}</div>
								<div class="clist-btns pull-right b-btns">
									<span class="txt a-shelves upper" @click="articleSale(index)" v-if="items.show_status == '已上架'">{{ items.show_status }}</span>
                  <span class="txt a-shelves noUp" @click="articleSale(index)" v-if="items.show_status == '未上架'">{{ items.show_status }}</span>
                  <span class="txt a-shelves lower" @click="articleSale(index)" v-if="items.show_status == '已下架'">{{ items.show_status }}</span>
									<span class="reply"  data-toggle="modal" @click="replys(index)" data-target="#replyModal">回复</span>
								</div>
								<div class="clearfix"></div>
							</div>
						</div>
						<div class="csee-more" v-if = "item.comments.rows.length >= 10 && item.comments.totals > 10" @click = 'loadMore'>查看后10条</div>
					</div>
				</div>
        <!--comment-list-->
        <div class="clearfix"></div>
      </div>
    </div>
  </div>

  <el-dialog
    :visible.sync="speakDialogVisible"
    width="480px"
    :top = 'topValue'
    center
    id="speak-dialog">
    <textarea class="speak-textarea" ref ='articleComments'></textarea>
    <div slot="footer" class="dialog-footer">
      <el-button @click="speakDialogVisible = false" class="cancel-button">取消</el-button>
      <el-button type="primary" @click="confirm" class="confirm-button">发布评论</el-button>
    </div>
  </el-dialog>

    <el-dialog
    :visible.sync="reply"
    width="480px"
    :top = 'topValue'
    center
    id="speak-dialog">
    <textarea class="speak-textarea" ref = 'replys'></textarea>
    <div slot="footer" class="dialog-footer">
      <el-button @click="reply = false" class="cancel-button">取消</el-button>
      <el-button type="primary" @click="replyConfirm" class="confirm-button">发布评论</el-button>
    </div>
  </el-dialog>

  <el-dialog
    title="确定要删除此文章吗"
    :visible.sync="delDialogVisible"
    width="480px"
    :top = 'topValue'
    center
    id="del-dialog">
    <span class="text-center">删除后无法恢复，请慎重</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="delDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="sureDel">确定</el-button>
    </span>
  </el-dialog>

  <el-dialog
    title="已有用户购买此文章，无法删除"
    :visible.sync="unableDelDialogVisible"
    width="480px"
    :top = 'topValue'
    center
    id="unable-del-dialog">
    <span class="text-center">为了保障用户权益，要删除文章请使用私聊中的晓客服联系教师圈管理员</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="unableDelDialogVisible = false">我知道了</el-button>
    </span>
  </el-dialog>

  <my-footer></my-footer>
</div>

</template>

<script>
import myHeader from './../common/headTitle.vue';
import myFooter from './../common/footContent.vue';
import $ from  "jquery"
export default {
  name: 'articleAudio',
  data () {
    return {
      speakDialogVisible:false,
      reply: false,
      topValue: '',
      nums : 0,
      item:{
        content: '',
        create_time: '',
        money: '',
        points: '',
        title: '',
        comments: {
          pages: {},
          rows: [],
          totals: 0
        },
        media_url:''
      },
      delDialogVisible: false,
      unableDelDialogVisible: false,
      articleType:''
    }
  },
  created(){

  },
  mounted(){
    this.topValue = ((window.document.documentElement.clientHeight) - 280)/2 + 'px'
    //文章详情
    this.article_id = this.$route.query.article_id;
    this.articleType = this.$route.query.article_type;
    console.log(this.article_id)
    let obj1 ={
        aid: this.article_id
    }
    this.$store.dispatch('GET_ARTICLE_DETAILS', obj1)
    .then(res => {
      if(res.code != 200){
          this.$message.error(res.info);
        }
        let data = res.data
        this.item.content = data.content
        this.item.create_time = data.create_time
        this.item.money = data.money
        this.item.points = data.points
        this.item.title = data.title
        this.item.comments.rows = data.comments.rows
        this.item.comments.totals = data.comments.totals
        this.item.comments.pages = data.comments.pages
        this.item.media_url = data.media_url
        console.log(data)
    }).catch( err =>{
        console.log(err)
    });

    //文章评论详情
  },
  methods:{
    //编辑，去详情页
    goToEdit(){
      let id = this.$route.query.article_id
      this.$router.push({path:'/addArticle', query: {article_id: id}});
      localStorage.removeItem('orgin');
      localStorage.removeItem('orginArticleDetails');
      localStorage.setItem('orginArticleDetails','articleDetails');
      localStorage.removeItem('newArticle');
    },
    //删除文章
    delArticle(e){
      if(this.item.money != '免费文章') {
        this.unableDelDialogVisible = true;
      }else{
        this.delDialogVisible = true;
      }
    },
    sureDel(){
      let obj = {
        aid : this.article_id
      }

      this.$store.dispatch('DELETE_ARTICLE', obj)
      .then(res => {
        this.$router.go(-1)
      }).catch( err => {
        console.log(err)
      })
    },
    confirm() {
      $(".speak-textarea").html("");
      this.speakDialogVisible = false
      let obj = {
         aid: this.article_id,
         content: this.$refs.articleComments.value
      }
      this.$store.dispatch('ADD_COMMENTS', obj)
      .then(res => {
           this.updataComment();

      })
    },
    //打开回复框
    replys(index) {
         this.reply = true;
         this.nums = index
    },
    //回复确定
    replyConfirm() {
        let index =  this.nums
        $(".speak-textarea").html("");
        this.reply = false;
        let obj = {
         aid: this.article_id,
         content: this.$refs.replys.value,
         cid: this.item.comments.rows[index].comment_id,
         to_uid: this.item.comments.rows[index].read_uid
      }
      this.$store.dispatch('ADD_COMMENTS', obj)
      .then(res => {
        console.log(res)
        this.$refs.replys.value = ''
        this.updataComment();
      })
    },
   //  动态添加评论
    updataComment() {
      let obj2= {
        aid: this.article_id
      };
      this.$store.dispatch('ARTICLE_COMMENTS', obj2)
      .then(res => {
        console.log(res)
        this.item.comments.rows = res.data.rows
        this.item.comments.totals = res.data.totals
      }).catch(err => {
        console.log(err)
      })
    },
    //查看更多
    loadMore() {
       this.item.comments.pages.page = this.item.comments.pages.page +1
       let addpage = this.item.comments.pages.page
       let obj2= {
          aid: this.article_id,
          page: addpage
        };
      this.$store.dispatch('ARTICLE_COMMENTS', obj2)
      .then(res => {
        console.log(res)
        this.item.comments.rows = res.data.rows;
        this.item.comments.totals = res.data.totals;
      }).catch(err => {
        console.log(err)
      })
    },
    //评论上下架
    articleSale(index) {
      console.log(index)
      let obj = {
        aid : this.article_id,
        cid : this.item.comments.rows[index].comment_id,
      }
      console.log(obj)
      this.$store.dispatch('COMMENT_SALE' ,obj)
      .then(res => {
        console.log(res)
        this.updataComment();

      })
    }
  },
  components:{
    myHeader,
    myFooter
  },
  watch: {
     "item.comments.rows" : function (val, oldVal) {
      console.log('new: %s, old: %s', val, oldVal)
     }
   }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .breadcrumb{
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 16px;
  }
  .detailed{
    box-sizing: border-box;
  }
  .csee-more{
    cursor:pointer;
  }
  .teacher-btn{
    width: 112px;
    height: 32px;
    line-height:6px;
    background: #5895FF;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: -0.39px;
  }
  #speak-dialog .el-dialog__close{
    display:none;
  }
  .speak-textarea{
    width:96%;
    padding:10px 2%;
    height:72px;
    border:1px solid #E5E5E5;
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    line-height: 24px;
  }
  #speak-dialog .dialog-footer{
    text-align: center;
  }
  .dialog-footer button{
    height: 32px;
    width: 196px;
    line-height:6px;
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
  #del-dialog .dialog-footer .el-button--primary{
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    color: #444444;
  }
  #del-dialog .dialog-footer .el-button--primary:hover{
     color: #409EFF;
     border-color:#c6e2ff;
     background-color:#ecf5ff;
  }
  .title-box .state{
    float:right;
    margin-top: -4px;
  }
  .title-box .state span{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #5895FF;
    letter-spacing: -0.39px;
    line-height:28px;
    cursor:pointer;
  }
  .title-box .state span.del-article{
    margin-right:24px;
  }
  .title-box h2{
    line-height:28px;
  }
  .el-message-box__btns{
    text-align:center;
  }
  .el-message-box__message p{
    text-align:center;
  }
  .el-button--small{
    width:120px;
  }
  #del-dialog .el-dialog--center .el-dialog__body{
    text-align:center;
  }
  .clist-bottom{
    margin-top:8px;
  }
  .text-center{
    display:block;
    width:90%;
    margin:0 auto;
    text-align:center;
  }
  .video-box{
    margin:15px 0;
  }
</style>
<style>
  .detailed-txt img{
    display:block;
    max-width:100%;
    margin:5px 0;
  }
  #speak-dialog .el-dialog__headerbtn .el-dialog__close{
    display:none;
  }
  #speak-dialog .el-dialog__header{
    padding:0 20px;
  }
  #speak-dialog .el-dialog--center .el-dialog__body{
    padding:20px 16px 10px;
  }
  #speak-dialog .el-dialog__footer{
    padding:10px 16px 24px;
  }
  #speak-dialog .el-button+.el-button{
    margin-left: 13px;
  }
  #speak-dialog .el-button--primary{
    background-color: #5895FF;
    border-color: #5895FF;
  }
  #del-dialog .el-dialog__header{
    padding:28px 20px 4px;
  }
  #del-dialog .el-dialog__headerbtn{
    display:none;
  }
  #del-dialog .el-dialog--center .el-dialog__body{
    padding:25px 25px 25px;
  }
</style>
