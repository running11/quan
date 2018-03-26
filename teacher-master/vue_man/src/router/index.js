import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Main from '@/components/main/Main'
import Teacher from '@/components/main/teacherIntro'
import ArticleMan from '@/components/main/articleMan'
import BonusMan from '@/components/main/bonusMan'

import MainImg from '@/components/mainDetails/newImg'
import MainVideo from '@/components/mainDetails/newVideo'
import MainAudio from '@/components/mainDetails/newAudio'


import ArticleDetails from '@/components/articleDetails/articleDetails'

import IncomeDetails from '@/components/bounsDetails/incomeDetails'
import WithdrawDetails from '@/components/bounsDetails/withdrawDetails'

import AddArticle from '@/components/addArticle/addArticle'
// 管理员
import MasterIndex from '@/components/masterIndex'

import MasterMain from '@/components/masterSeries/Main/masterMain'
import MasterTeacher from '@/components/masterSeries/Main/masterTeacher'
import MasterArticle from '@/components/masterSeries/Main/masterArticle'
import MasterComment from '@/components/masterSeries/Main/masterComment'
import MasterBonus from '@/components/masterSeries/Main/masterBonus'
import MasterAdv from '@/components/masterSeries/Main/masterAdv'
import MasterLog from '@/components/masterSeries/Main/masterLog'


//跳转

import AdminArticle from '@/components/masterSeries/masterDetails/adminArticle'
import AdminIncome from '@/components/masterSeries/masterDetails/adminIncome'
import AdminWithdraw from '@/components/masterSeries/masterDetails/adminWithdraw'
import Adminmonth from '@/components/masterSeries/masterDetails/adminmonth'
import AdminAddAdv from '@/components/masterSeries/masterDetails/adminAddAdv'
import AdminTeacher from '@/components/masterSeries/masterDetails/adminTeacher'
import AdminWithdrawMoneyApply from '@/components/masterSeries/masterDetails/adminWithdrawMoneyApply'

Vue.use(Router)

export default new Router({
  mode:'hash',
  routes: [
    {
      path:'/',
      name:'index',
      component: Index,
      redirect:'/main',
      children:[{
        path:'main',
        name:'main',
        component:Main
      },
      {
        path:'/teacherintro',
        name:'teacherintro',
        component:Teacher
      },
      {
        path:'/articleman',
        name:'articleman',
        component:ArticleMan
      },
      {
        path:'/bonusman',
        name:'bonusman',
        component:BonusMan
      }]
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
    	path:'/login',
    	name:'Login',
    	component:Login
    },
    {
      path:'/mainimg',
      name:'mainimg',
      component:MainImg
    },
    {
      path:'/mainvideo',
      name:'mainvideo',
      component:MainVideo
    },
    {
      path:'/mainaudio',
      name:'mainaudio',
      component:MainAudio
    },
    {
      path:'/articleDetails',
      name:'articleDetails',
      component:ArticleDetails
    },
    {
      path:'/incomedetails',
      name:'incomedetails',
      component:IncomeDetails
    },
    {
      path:'/withdrawdetails',
      name:'withdrawdetails',
      component:WithdrawDetails
    },
    {
      path:'/addArticle',
      name:'addArticle',
      component:AddArticle
    },
    //master 路由
    {
      path:'/masterIndex',
      name:'masterIndex',
      component:MasterIndex,
      redirect:'/masterIndex/mastermain',
      children:[{
        path:'mastermain',
        name:'mastermain',
        component:MasterMain
      },
      {
        path:'masterteacher',
        name:'masterteacher',
        component:MasterTeacher
      },
      {
        path:'masterarticle',
        name:'masterarticle',
        component:MasterArticle
      },
      {
        path:'mastercomment',
        name:'mastercomment',
        component:MasterComment
      },
        {
          path:'Masterlog',
          name:'Masterlog',
          component:MasterLog
        },
      {
        path:'masterbonus',
        name:'masterbonus',
        component:MasterBonus
      },
      {
        path:'masteradv',
        name:'masteradv',
        component:MasterAdv
      }]
    },
    {
        path:'/adminarticle',
        name:'adminarticle',
        component:AdminArticle
    },
    {
        path:'/adminincome',
        name:'adminincome',
        component:AdminIncome
    },
    {
        path:'/adminwithdraw',
        name:'adminwithdraw',
        component:AdminWithdraw
    },
    {
        path:'/adminmonth',
        name:'adminmonth',
        component:Adminmonth
    },
    {
        path:'/adminaddadv',
        name:'adminaddadv',
        component:AdminAddAdv
    },
    {
        path:'/adminteacher',
        name:'adminteacher',
        component:AdminTeacher
    },
    {
        path:'/adminWithdrawMoneyApply',
        name:'adminWithdrawMoneyApply',
        component:AdminWithdrawMoneyApply
    }
  ]
})
