  <template>
	<div>
		<div class="content-container">
      <div class="mark" @click="removeMemu" :style="{display: displays}"></div>
			<div class ="content-top content">
				<div class="list ">
					<p><img src="../../images/ic_attention_degree.png" alt="">关注度</p>
					<h3>{{ item.followeds }}</h3>
				</div>
				<div class="list ">
					<p><img src="../../images/ic_reading_volume.png" alt="">文章阅读量</p>
					<h3>{{ item.views }}</h3>
				</div>
				<div class="list ">
					<p><img src="../../images/ic_total_incom.png" alt="">我的总收益</p>
					<h3>暂未开放</h3>
				</div>
			</div>
			<div class="content-articles content">
				<div class="article-top">
					<div class="left pull-left last-article">最近文章</div>
					<div class="dropdown right pull-right add-article">
						<div class="dropdown-toggle add-btn" @click="addBtn">新增</div>
						<div class="dropdown-menu add-article-type" role="menu" :style="{display: displays}">
							<h4>请选择文章类型</h4>
							<ul>
								<li class=" pull-left col-md-4" @click="addArticle('1')">
									<img src="../../images/btn_picture.png" alt="">
									<p>图文</p>
								</li>
								<li class=" pull-left col-md-4" @click="addArticle('3')">
									<img src="../../images/btn_video.png" alt="">
									<p>视频</p>
								</li>
								<li class=" pull-left col-md-4" @click="addArticle('2')">
									<img src="../../images/btn_voice.png" alt="">
									<p>语音</p>
								</li>
                <div class="clearfix"></div>
							</ul>
						</div>
					</div>
					<div class="clearfix"></div>
				</div>

				<div class="no-article" v-if="articleShow">
					<img src="static/images/img_blank.png" alt="">
					<p>还没写过文章呢，点击右上角新建文章创作吧</p>
				</div>
				<div v-else class="article-list had-article" >
					<div class="list" v-for="(items,index) in item.articles.rows" @click="goDetails(items.article_id)" :id= "items.article_id" >
						<div class="line">
							<div class="list-left pull-left list-img">
                <img v-if="items.cover==''" src="../../images/img_picture_default.png" alt="">
                <img v-if="items.cover!=''" :src="items.cover" alt="">
                <img src="static/images/ic_music.png" class="sign-btn video-btn" v-if="items.type == 2"/>
                <img src="static/images/ic_video.png" class="sign-btn video-btn" v-if="items.type == 3"/>
							</div>
							<div class="list-right pull-left list-info">
								<h4>{{items.title}}</h4>
								<div class="article-btns">
									<span class="modify" @click="changes(items.article_id, items.type)"></span>
									<span class="delete" @click="removes(items.article_id, index)" data-toggle="modal" data-target="#deleteArticle"></span>
								</div>
								<ul>
									<li class="comment pull-left">
										<img src="../../images/ic_list_comment.png" alt="">
										<span>{{ items.comments }}</span>
									</li>
									<li class="eye pull-left">
										<img src="../../images/ic_list_view.png" alt="">
										<span>{{ items.views }}</span>
									</li>
									<li class="star pull-left">
										<img src="../../images/ic_list_collection.png" alt="">
										<span>{{ items.collections }}</span>
									</li>
									<!-- <li class="share pull-left">
										<img src="../../images/ic_list_share.png" alt="">
										<span>{{ items.shares }}</span>
									</li> -->
                  <div class="clearfix"></div>
								</ul>

								<div class="b-btns">
									<!--<span class="a-type free">{{ items.charge }}</span>-->
									<!--<span class="a-shelves upper">{{ items.show_status }}</span>-->
									<!-- <span class="a-type" :class="items.charge == '免费文章'?'free':'sell'">{{ items.charge }}</span> -->
		              <span class="a-shelves noUp"  v-if="items.status==1">{{ items.show_status }}</span>
		              <span class="a-shelves upper"  v-if="items.status==2">{{ items.show_status }}</span>
		              <span class="a-shelves lower"  v-if="items.status==3">{{ items.show_status }}</span>
		              <span class="show-time pull-right" style="margin-right:24px;">{{ items.show_time }}</span>
								</div>
							</div>
							<div class="clearfix"></div>
						</div>
					</div>
					<div class="see-more">更多文章请点击左侧文章管理</div>
				</div>
			</div>
		</div>

		 <el-dialog
      title="确定要删除此文章吗"
      :visible.sync="delDialogVisible"
      width="480px"
      :top = 'topValue'
      center
      id="del-dialog">
      <span class="text-center">删除后无法回复，请慎重</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDel">确 定</el-button>
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

	</div>

</template>

<script>
 import newsE from '../UEditor/newDitor.vue'
export default {
  name: 'Main',
  data () {
    return {
    	displays:"none",
    	flag:0,
    	free:false,
      articleShow: false,
      code: 0,
      topValue: '',
      item:{
        articles: {
          pages: {},
          rows: [],
          totals: ''
        },
        earnings: '',
        followeds: '0',
        views: '0',
      },
      article_id: '',
      delDialogVisible: false,
      unableDelDialogVisible: false
    }
  },
  mounted(){
    console.log(window)
    //弹框位置
     this.topValue = ((window.document.documentElement.clientHeight) - 201)/2 + 'px'
     console.log(this.topValue)
     // vuex 后台调取数据
       this.$store.dispatch('GET_INDEX')
         .then(res => {
          let data = res.data
          console.log(data);
        if(res.code === "4001"){
            console.log(1111)
            window.location.href = '#/login'
        }
        // 封装数据
        if(data.articles.rows.length > 0){
//        console.log(data)
          this.item.articles.pages = data.articles.pages;
          this.item.articles.rows = data.articles.rows.slice(0,3);
          this.item.articles.totals = data.articles.totals;
          this.item.earnings = data.earnings;
          this.item.followeds = data.followeds;
          this.item.views = data.views;
        }else{
          this.articleShow = true;
          this.item.earnings = data.earnings;
          this.item.followeds = data.followeds;
        }
       }).catch(err => {
         console.log(err)
       })

  },
  methods:{
    go(){
      this.$router.push({path:"/login"})
    },
  	//点击新增
  	addBtn(){
  		if(this.displays === "none"){
           this.displays = "block"
  		}else if(this.displays === "block"){
  			this.displays = "none"
  		}
  	},
    removeMemu(){
         this.displays = "none"
    },
  	goDetails(id){
  		this.$router.push({path:'/articleDetails', query: {article_id: id}})
  	},
  	changes(value1, value2,item){
      if(value2 === "1"){
        item = '1'
        this.$router.push({path:'/addArticle', query:{article_id: value1, article_type: value2}})
        localStorage.removeItem('goType');
        localStorage.setItem('goType',item);
        localStorage.removeItem('orgin');
      }else if(value2 === '2'){
        item = '2'
        this.$router.push({path:'/addArticle', query:{article_id: value1, article_type: value2}})
        localStorage.removeItem('goType');
        localStorage.setItem('goType',item);
        localStorage.removeItem('orgin');
      }else if(value2 === '3'){
        item = '3'
        this.$router.push({path:'/addArticle', query:{article_id: value1, article_type: value2}})
        localStorage.removeItem('goType');
        localStorage.setItem('goType',item);
        localStorage.removeItem('orgin');
      }

//     console.log(value1);
//     console.log(value2);
       event.stopPropagation();
  	},
    updata() {
       this.$store.dispatch('GET_INDEX')
         .then(res => {
          let data = res.data
          console.log(data);
        if(data.articles.rows.length > 0){
//        console.log(data)
          this.item.articles.rows = data.articles.rows.slice(0,3);
        }else{
          this.articleShow = true;
        }
       }).catch(err => {
         console.log(err)
       })
    },
  	removes(deleteId, index){
      this.deleteId = deleteId;
      this.deleteIndex = index;

      let free = this.item.articles.rows[index].charge
      if(free != '免费文章'){
        this.unableDelDialogVisible = true;
      }else{
         let obj = {
          aid : deleteId
         }
        this.$store.dispatch('DELETE_ARTICLE', obj)
        .then(res => {
         this.delDialogVisible = true;
        }).catch( err => {
          console.log(err)
        })
      }
      event.stopPropagation();
  	},
  	sureDel(){
  	 this.delDialogVisible = false
     this.updata()
  	},
    addArticle(item){
       this.$router.push({path:'/addArticle'})
       localStorage.removeItem('goType');
       localStorage.setItem('goType',item);
       localStorage.removeItem('orgin');
       localStorage.setItem('orgin','articleMan');

       localStorage.removeItem('orginArticleDetails');
       localStorage.removeItem('newArticle');
       localStorage.setItem('newArticle','newArticle');
    }
  },
  component: {
    newsE
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-container {
  height: 100%;
}
.content-container .content {
  min-width: 810px;
}
.content-container .content-top {
  background: #FFF;
  text-align: center;
  overflow: hidden;
  height: 151px;
  border: 1px solid #E5E5E5;
}
.content-container .content-top div {
  float: left;
  width: 33%;
  text-align: center;
  margin-top: 43px;
}
.content-container .mark{
    position: absolute;
    z-index: 100;
    top: 0px;
    left: 0px;
    display: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
}
.content-container .content-top .list img {
  width: 18px;
  vertical-align: top;
  margin-right: 10px;
}
.content-container .content-top .list p {
  font-family: PingFangSC-Light;
  font-size: 16px;
  color: #AAAAAA;
  letter-spacing: -0.39px;
  line-height: 16px;
}
.content-container .content-top .list h3 {
  font-family: PingFangSC-Medium;
  font-size: 36px;
  color: #444444;
  letter-spacing: -0.87px;
  line-height: 36px;
}
.content-container .content-articles {
  padding: 0px;
  padding-bottom: 0;
  background: #FFF;
  margin-right: 20px;
  border: 1px solid #E5E5E5;
  margin-top: 20px;
  position: relative;
}
.content-container .content-articles .left {
  font-family: PingFangSC-Light;
  font-size: 16px;
  color: #444444;
  letter-spacing: -0.39px;
  line-height: 16px;
}
.content-container .content-articles .right {
  width: 112px;
  height: 32px;
  background: #5895FF;
  border-radius: 2px;
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #FFFFFF;
  letter-spacing: -0.39px;
  line-height: 32px;
  cursor:pointer;
}
.content-container .content-articles .add-article-type {
  color: #444444;
  text-align: center;
  width: 320px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  margin-top: 10px;
  display: none;
  z-index: 10000;
  position: absolute;
  background-color: #fff;
  top: 55px;
  right: 18px;
  padding-bottom:15px;
}
.content-container .content-articles .add-article-type h4 {
  line-height: 30px;
  margin-top: 10px;
}
.content-container .content-articles .add-article-type ul {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}
.content-container .content-articles .add-article-type ul li {
  margin-left: 25px;
  cursor: pointer;
}
.content-container .content-articles .add-article-type img {
  width: 72px;
}
.content-container .content-articles .no-article {
  padding-bottom: 120px;
  text-align: center;
}
.content-container .content-articles .no-article img {
  width: 260px;
}
.content-container .content-articles .no-article p {
  font-size: 16px;
  color: #AAAAAA;
  margin-top: 15px;
}
.content-container .content-articles .had-article {
  position: relative;
  margin-bottom: 0;
}
.content-container .content-articles .had-article .list {
  padding: 20px 20px 0 20px;
  border-bottom: none;
}
.content-container .content-articles .had-article .list .line {
	padding-bottom: 20px;
	border-bottom: 1px solid #e5e5e5;
}
.add-btn:hover .add-article-type{
	display: block;
}
.content-container .content-articles .had-article .list:hover {
  background: #F4F8FF;
}
.content-container .content-articles .had-article .list:hover .line{
	border-bottom: 1px solid #F4F8FF;
}
.content-container .content-articles .had-article .list:hover .article-btns {
  display: block;
}
.content-container .content-articles .had-article .list-img img {
  width: 184px;
  height: 104px;
}
.content-container .content-articles .had-article .article-btns {
  position: absolute;
  right: 5px;
  top: 5px;
  display: none;
}
.content-container .content-articles .had-article .article-btns span {
  display: inline-block;
  width: 22px;
  height: 22px;
  margin-right: 15px;
  cursor: pointer;
}
.content-container .content-articles .had-article .article-btns .modify {
  background: url('../../images/ic_list_edit.png') center center no-repeat;
  background-size: 20px;
}
.content-container .content-articles .had-article .article-btns .delete {
  background: url('../../images/ic_list_delete.png') center center no-repeat;
  background-size: 20px;
}
.content-container .content-articles .had-article .list-info {
  margin-left: 20px;
  font-size: 16px;
  height: 104px;
  position: absolute;
  left: 204px;
  right: 0;
}
.content-container .content-articles .had-article .list-info img {
  width: 18px;
  vertical-align: text-top;
}
.content-container .content-articles .had-article .list-info h4 {
  color: #444444;
}
.content-container .content-articles .had-article .list-info ul {
  margin-top: 12px;
  color: #AAAAAA;
}
.content-container .content-articles .had-article .list-info ul li {
  margin-right: 20px;
  height:18px;
  overflow:hidden;
}
.content-container .content-articles .had-article .list-info ul li img{
  float:left;
  margin-right:7px;
}
.content-container .content-articles .had-article .list-info li span {
  float:left;
  height:18px;
  font-family: PingFangSC-Light;
  font-size: 16px;
  color: #AAAAAA;
  letter-spacing: -0.39px;
  line-height: 18px;
}
.content-container .content-articles .had-article .list-info .b-btns {
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  font-size: 14px;
  line-height: 34px;
}
.content-container .content-articles .had-article .list-info .b-btns span {
  display: inline-block;
  margin-right: 25px;
}
.content-container .content-articles .had-article .list-info .b-btns .show-time {
  color: #AAAAAA;
  font-size: 16px;
  margin: 0;
  margin-right: 20px;
}
.content-container .content-articles .see-more {
  text-align: center;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
  font-family: PingFangSC-Light;
  font-size: 16px;
  color: #AAAAAA;
  letter-spacing: -0.39px;
}
.b-btns .a-type.free {
  color: #FD6080;
}
.b-btns .a-type.sell {
  color: #FFB13D;
}
.b-btns .a-shelves.upper {
  color: #4CBF4A;
  cursor:default;
}
.b-btns .a-shelves.lower {
  color: #F92424;
  cursor:default;
}
.b-btns .a-shelves.noUp {
  color: #5895FF;
  cursor:default;
}
#deleteArticle .modal-body {
  line-height: 26px;
}
.main-footer {
  color: #AAAAAA;
  position: static;
  background: #F6F6F6;
  padding-bottom: 30px;
}
.article-top{
	margin-top: 0px;
	line-height: 30px;
	padding: 20px 20px 0 20px;
  height:48px;
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
  .content-container .content-articles .had-article .list-img{
    width: 184px;
    height: 104px;
    position:relative;
  }
  .content-container .content-articles .had-article .list-img img.sign-btn{
     width:48px;
     height:48px;
     position:absolute;
     left:50%;
     top:50%;
     margin:-24px 0 0 -24px;
     cursor:pointer;
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
</style>
<style>
  #del-dialog .el-dialog__headerbtn .el-dialog__close{
     display:none;
  }
  #del-dialog .el-dialog__title{
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #444444;
    letter-spacing: -0.48px;
    line-height: 20px;
  }
  #del-dialog .el-dialog__footer{
    padding:10px 20px 30px;
  }
</style>

