<template>
  <div>
    <my-header></my-header>
    <div class="main-container">
      <div class="nav-container">
        <ul class="nav nav-stacked">
          <li v-for="nav in navArray" :key="nav.id" role="presentation" :class="{'active': nav.id == isSelect }" @click="changeNav(nav.id,nav.path)">
            <a href="javascript:void(0)"><img :src="isSelect === nav.id ? nav.aUrl : nav.dUrl" alt="" />{{nav.name}}</a>
          </li>
          <li>
            <a href="javascript:void(0)" id="cancelBonus"><img src="static/images/ic_menu_income_nor.png" alt="" />收益管理</a>
          </li>
        </ul>
      </div>
      <div class="right_container">
        <router-view/>
        <my-footer></my-footer>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from './common/headTitle.vue';
  import myFooter from './common/footContent.vue';

  import dIconMenu from 'static/images/ic_menu_home_nor.png';
  import aIconMenu from 'static/images/ic_menu_home_hig.png';

  import dIconTeacher from 'static/images/ic_menu_famous_nor.png';
  import aIconTeacher from 'static/images/ic_menu_famous_hig.png';

  import dIconArticle from 'static/images/ic_menu_article_nor.png';
  import aIconArticle from 'static/images/ic_menu_article_hig.png';

  import dIconIncome from 'static/images/ic_menu_income_nor.png';
  import aIconIncome from 'static/images/ic_menu_income_hig.png';

  import dIconComment from 'static/images/ic_menu_Comment_nor.png';
  import aIconComment from 'static/images/ic_menu_Comment_hig.png';

  import dIconAdvert from 'static/images/ic_menu_advert_nor.png';
  import aIconAdvert from 'static/images/ic_menu_advert__hig.png';

  import dIconJournal from 'static/images/ic_menu_journal_nor.png';
  import aIconJournal from 'static/images/ic_menu_journal_hig.png';

  export default {
    name: 'Index',
    data() {
      return {
        dIconMenu: dIconMenu,
        isSelect: 'masterindex',
        bonusman: 0,
        navArray: [
          {id: 'masterindex',name: '首页',path:'/masterIndex/mastermain',dUrl: dIconMenu,aUrl: aIconMenu},
          {id: 'masterteacher',name: '名师管理',path:'/masterIndex/masterteacher',dUrl: dIconTeacher,aUrl: aIconTeacher},
          {id: 'masterarticle',name: '文章管理',path:'/masterIndex/masterarticle',dUrl: dIconArticle,aUrl: aIconArticle},
          {id: 'mastercomment',name: '评论管理',path:'/masterIndex/mastercomment',dUrl: dIconComment,aUrl: aIconComment},
          {id: 'masteradv',name: '广告管理',path:'/masterIndex/masteradv',dUrl: dIconAdvert,aUrl: aIconAdvert},
          {id: 'masterlog',name: '日志管理',path:'/masterIndex/masterlog',dUrl: dIconJournal,aUrl: aIconJournal},
          // {id: 'masterbonus',name: '收益管理',dUrl: dIconIncome,aUrl: aIconIncome},

        ]
      }
    },
    created(){
//    console.log(this.$route)
      if(this.$route.fullPath === "/masterIndex/masterbonus") {
        this.isSelect = "masterbonus"
      }else if(this.$route.fullPath === "/masterIndex/masterarticle") {
         this.isSelect = "masterarticle"
      }else if(this.$route.fullPath === "/masterIndex/masterteacher") {
         this.isSelect = "masterteacher"
      }else if(this.$route.fullPath === "/masterIndex/masteradv") {
         this.isSelect = "masteradv"
      }else if(this.$route.fullPath === "/masterIndex/masterlog") {
        this.isSelect = "masterlog"
      }else if(this.$route.fullPath === "/masterIndex/masterlog") {
         this.isSelect = "mastercomment"
      }
    },
    methods: {
      logOut() {
        this.$confirm('此操作将推出登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });
        });
      },
      changeNav(navId,path) {
        this.$router.push({path:path});
        this.isSelect = navId;
      }
    },
    components:{
      myHeader,
      myFooter
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#cancelBonus{
  color: #adadad;
}
</style>
