<template>
  <div>
    <my-header></my-header>
    <div class="main-container">
      <div class="content-history" style="padding: 0 20px;min-width: 1024px">
        <div class="position" style="margin-bottom: 20px;">
          <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/masterIndex/mastermain' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/masterIndex/masterbonus' }">收益管理</el-breadcrumb-item>
            <el-breadcrumb-item>本月提现申请</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="filter-con content-list">
          <table class="table">
            <thead>
            <tr>
              <td style="border: none;width: 20px"></td>
              <td>选择</td>
              <td>申请人</td>
              <td>提现金额</td>
              <td>提现申请日期</td>
              <td>处理日期</td>
              <td>提现方式</td>
              <td>提现状态</td>
              <td style="border: none;width: 20px"></td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(apply,index) in applyList">
              <td style="border: none;width: 20px"></td>
              <td v-if="apply.show_sign == '标记已提现'"><el-checkbox v-model="apply.mflag" @change="changeCheck(index)"></el-checkbox></td>
              <td v-else>已标记</td>
              <td>{{ apply.apply_user }}</td>
              <td>{{ apply.show_crash_fees }}</td>
              <td>{{ apply.apply_time }}</td>

              <td v-if="apply.show_sign == '标记已提现'" class="untreated">未处理</td>
              <td v-else>{{ apply.operate_time }}</td>

              <td v-if="apply.show_sign == '标记已提现'" class="untreated"></td>
              <td v-else>{{ apply.withdraw_way }}</td>

              <td v-if="apply.show_sign == '标记已提现'" class="have-withdrawal">标记已提现</td>
              <td v-else>{{ apply.show_sign }}</td>
              <td style="border: none;width: 20px"></td>
            </tr>
            </tbody>
          </table>
          <div class="widthdraw-pages">
            <el-checkbox v-model="checked" class="check-all" @change="checkAll">全选</el-checkbox>
            <div class="sign" @click="signApply">批量标记</div>
            <div class="page-num">
              <el-pagination
                background
                @current-change="changePage"
                layout="prev, pager, next"
                :page-size="applyPage.pageSize"
                :total="applyPage.totals">
              </el-pagination>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../common/headTitle.vue';
  import Vue from 'vue';

export default {
  name: 'adminWithdrawMoneyApply',
  data () {
    return {
    	checkedCrash: [],
    	checked: false,
    	dateValue: '',
    	applyList: {},
    	applyPage: {},
    }
  },
  components: {
    myHeader
  },
  mounted(){
  	this.$nextTick(function () {
      this.loadList();
  	})
  },
  methods:{
  	loadList(val){
  		let obj = {
	        time: '',
//	        pageSize: 1,
	        page: val
	    }
	  	let _this = this;
	    if (this.dateValue.length > 0) {
	        obj.time = moment(this.dateValue[0]).format("YYYY/MM/DD") + '-' + moment(this.dateValue[1]).format("YYYY/MM/DD");
	    }
		this.$store.dispatch('GET_APPLY', obj)
		    .then(res => {
//		      console.log(JSON.stringify(res));
		      let data = res.data;
		      _this.applyPage = data.pages;
		      _this.applyPage.totals = data.totals;
		      _this.applyList = data.rows;
		      var len = _this.applyList.length;
		      for(var i=0; i<len; i++){
		      	_this.applyList[i].mflag = false;
		      }
		    }).catch(err => {
		    console.log(err)
		})
  	},
	changeCheck(index) {
        Vue.set(this.applyList, index, {
          'mflag': this.applyList[index].mflag,
          'crash_id': this.applyList[index].crash_id,
          'uid': this.applyList[index].uid,
          'crash': this.applyList[index].crash,
          'crash_points': this.applyList[index].crash_points,
          'apply_time': this.applyList[index].apply_time,
          'operate_time': this.applyList[index].operate_time,
          'withdraw_way': this.applyList[index].withdraw_way,
          'status': this.applyList[index].status,
          'show_operate_time': this.applyList[index].show_operate_time,
          'show_crash_fees': this.applyList[index].show_crash_fees,
          'apply_user': this.applyList[index].apply_user,
          'show_sign': this.applyList[index].show_sign
        })
        let len = this.applyList.length;
        let clen = 0;
        for(var i=0;i<len;i++){
	      if(this.applyList[i].mflag == true){
	        clen ++;
	      }
	    }
        if(clen == len){
        	this.checked = true;
        }else{
        	this.checked = false;
        }
    },
	  checkAll() {
	    var len = this.applyList.length;
	    if(this.checked){
	      for(var index=0; index<len; index++){
	        Vue.set(this.applyList, index, {
	          'mflag': true,
	          'crash_id': this.applyList[index].crash_id,
	          'uid': this.applyList[index].uid,
	          'crash': this.applyList[index].crash,
	          'crash_points': this.applyList[index].crash_points,
	          'apply_time': this.applyList[index].apply_time,
	          'operate_time': this.applyList[index].operate_time,
	          'withdraw_way': this.applyList[index].withdraw_way,
	          'status': this.applyList[index].status,
	          'show_operate_time': this.applyList[index].show_operate_time,
	          'show_crash_fees': this.applyList[index].show_crash_fees,
	          'apply_user': this.applyList[index].apply_user,
	          'show_sign': this.applyList[index].show_sign
	        })
	      }
	    }else{
	      for(var index=0; index<len; index++){
	        Vue.set(this.applyList, index, {
	          'mflag': false,
	          'crash_id': this.applyList[index].crash_id,
	          'uid': this.applyList[index].uid,
	          'crash': this.applyList[index].crash,
	          'crash_points': this.applyList[index].crash_points,
	          'apply_time': this.applyList[index].apply_time,
	          'operate_time': this.applyList[index].operate_time,
	          'withdraw_way': this.applyList[index].withdraw_way,
	          'status': this.applyList[index].status,
	          'show_operate_time': this.applyList[index].show_operate_time,
	          'show_crash_fees': this.applyList[index].show_crash_fees,
	          'apply_user': this.applyList[index].apply_user,
	          'show_sign': this.applyList[index].show_sign
	        })
	      }
	    }
	  },
	  signApply() {
	    let _this = this;
	    let obj = {};
	
	    let list = '';
	    let len = this.applyList.length;
	
	    for(var i=0;i<len;i++){
	      if(this.applyList[i].mflag == true){
	        list += this.applyList[i].crash_id + ',';
	      }
	    }
	    list = list.substr(0,list.length-1);
	    obj.list = list;
	
	    this.$store.dispatch('DEAL_APPLY',obj).then (result => {
	//	  	console.log(JSON.stringify(result));
	  	let data = result.data;
	  	if(data.code == '200'){
			_this.loadList();
			_this.checked = false;
	  	}
	  })
	},
    changePage(val) {
    	this.loadList(val);
    }
  }
}
</script>

<style scoped lang="scss">
  .breadcrumb{
    font-size:16px;
  }
  .content-list{
    .table{
      width: 100%;table-layout:fixed;
      thead{
        background: #FAFAFA;
        td{
          height:44px;
          font-family: PingFangSC-Light;
          font-size: 14px;
          color: #444444;
          letter-spacing: -0.34px;
          line-height:44px;
          text-align:center;
        }
      }
      tbody{
        tr{
          width:100%;
          td{
            height:60px;
            font-family: PingFangSC-Light;
            font-size: 16px;
            color: #444444;
            letter-spacing: -0.39px;
            line-height:60px;
            text-align:center;
          }
          .untreated{
            color: #F92424;
          }
          .have-withdrawal{
            color: #5895FF;
          }
        }

      }
    }
    .widthdraw-pages{
      overflow:hidden;
      padding:20px 0;
      .check-all{
        float:left;
        margin:0 40px;
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #444444;
        letter-spacing: -0.39px;
        line-height:28px;
      }
      .sign{
        float:left;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #5895FF;
        letter-spacing: -0.39px;
        line-height:28px;
        margin-right:40px;
        cursor: pointer;
      }
      .page-num{
        float:right;
        padding-right:20px;
      }
    }
  }

</style>
