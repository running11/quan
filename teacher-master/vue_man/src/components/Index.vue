<template>
  <div>
    <my-header></my-header>
    <div class="main-container">
      <div class="nav-container">
        <ul class="nav nav-stacked">
          <li v-for="nav in navArray" :key="nav.id" role="presentation" :class="{'active': nav.id == isSelect}" @click="changeNav(nav.id,nav.path)" keep-alive>
            <a href="javascript:void(0)"><img :src="isSelect === nav.id ? nav.aUrl : nav.dUrl" alt="" />{{nav.name}}</a>

          <li role="presentation">
            <a href="javascript:void(0)" id="cancelBonus"><img src='static/images/ic_menu_income_nor.png' alt="" />收益管理</a></li>
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

  import dIconTeacher from 'static/images/ic_menu_teacher_nor.png';
  import aIconTeacher from 'static/images/ic_menu_teacher_hig.png';

  import dIconArticle from 'static/images/ic_menu_article_nor.png';
  import aIconArticle from 'static/images/ic_menu_article_hig.png';

  import dIconIncome from 'static/images/ic_menu_income_nor.png';
  import aIconIncome from 'static/images/ic_menu_income_hig.png';
  export default {
    name: 'Index',
    data() {
      return {
        dIconMenu: dIconMenu,
        isSelect: 'index',
        bonusman: 0,
        navArray: [
          {id: 'index',name: '首页',path:'/main',dUrl: dIconMenu,aUrl: aIconMenu},
          {id: 'teacher',name: '教师介绍',path:'/teacherintro',dUrl: dIconTeacher,aUrl: aIconTeacher},
          {id: 'article',name: '文章管理',path:'/articleman',dUrl: dIconArticle,aUrl: aIconArticle},
          // {id: 'income',name: '收益管理',path:'/bonusman',dUrl: dIconIncome,aUrl: aIconIncome}
        ]
      }
    },
    mounted(){
      if(this.$route.fullPath === "/bonusman") {
        this.isSelect = "income"
      }else if(this.$route.fullPath === "/articleman") {
         this.isSelect = "article"
      }else if(this.$route.fullPath === "/teacherintro") {
         this.isSelect = "teacher"
      }
    },
    methods: {
      changeNav(navId,path) {
        this.$router.push({path:path});
        this.isSelect = navId;
      }
    },
    watch: {
      isSelect: {
         handler:function(val,oldval){  
          console.log(val)
                }
      }
    },
    components:{
      myHeader,
      myFooter
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
#cancelBonus{
  color: #adadad;
}
</style>
