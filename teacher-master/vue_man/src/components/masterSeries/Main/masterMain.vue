<template>

<div class="content-container income">
        <div class="income-echars" style="height: auto;">
            <div class="echars-head">
                <span class="echars-name">文章浏览量</span>
                <div class="pull-right">
                    <el-select v-model="priceValue" placeholder="收费类型" class="condition-item price-select" @change="getArticleView">
                      <el-option
                        v-for="item in priceOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="typeValue" placeholder="文章类型" class="condition-item type-select" @change="getArticleView">
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="pull-right">
                      <el-date-picker
                        v-model="dateValue1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getArticleView"
                        :picker-options="pickerOptions1">
                      </el-date-picker>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="echars-content">
                <div class="">
                    <div id="main" style="width: 100%;height:330px;"></div>
                </div>
            </div>
        </div>

        <div class="echars-content">
            <div class="left-container echarts-container pull-left">
                <h3>文章类型占比</h3>
                <div id="donuts-left" class="donuts" style="width: 80%;height: 224px;"></div>
            </div>
            <div class="right-container echarts-container pull-right">
                <h3>文章收费占比</h3>
                <div id="donuts-right" class="donuts" style="width: 80%;height: 224px;"></div>
            </div>
            <div class="clearfix"></div>
        </div>

        <div class="income-echars" style="height: auto;">
            <div class="echars-head">
                <span class="echars-name">收益走势</span>
                <div class="pull-right">
                    <el-select v-model="teacherValue" placeholder="请选择教师" class="condition-item teacher-select" @change="getEarningTrend">
                      <el-option
                        v-for="item in teacherOptions"
                        :key="item.uid"
                        :label="item.teacher_name"
                        :value="item.uid">
                      </el-option>
                    </el-select>
                    <div class="pull-right">
                      <el-date-picker
                        v-model="dateValue2"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="getEarningTrend"
                        :picker-options="pickerOptions2">
                      </el-date-picker>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="echars-content">
                <div class="line2-container">
                    <div id="line2" style="width: 100%;height:330px;"></div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import moment from 'moment';

export default {
  name: 'HelloWorld',
  data () {
    return {
        priceOptions: [{
          value: '0',
          label: '免费'
       }],
       priceValue: '',
       typeOptions: [{
          value: '1',
          label: '图文'
        }, {
          value: '2',
          label: '语音'
        },{
          value: '3',
          label: '视频'
       }],
       typeValue: '',
       teacherOptions: [{
          uid: '',
          teacher_name: '全部教师'
       }],
       teacherValue: '',
       item:{
          bottom: {
            teachers: [],
            trend: {},
          },
          middle: {
            left: [],
            right: [],
          },
          top: {},
        },
         sortValue: '',
         pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateValue1: [],
        dateValue2:[],
        defaultDateValue1:[],
        defaultDateValue2:[],
        spData:[],
        spData2:[]
    }
  },
  mounted(){
     //调取数据
     this.$store.dispatch('GET_ADHOME',{})
     .then(res => {
      if(res.code != 200){
          this.$message.error(res.info);
          }
      console.log(res.data)
      this.item.bottom.teachers = res.data.bottom.teachers
      this.item.bottom.trend = res.data.bottom.trend
      this.item.middle.left = res.data.middle.left
      this.item.middle.right = res.data.middle.right
      this.item.top = res.data.top
      this.spData = this.item.middle.left
      this.spData2 = this.item.middle.right

      for(var i=0;i<this.spData.length;i++){
      this.spData[i].icon = 'square'
      }
      for(var i=0; i<this.spData2.length;i++){
        this.spData2[i].icon = 'square'
      }


      this.defaultDateValue1 = res.data.top.time.split("-")
      this.dateValue1.push(new Date(Date.parse(this.defaultDateValue1[0].replace(/-/g,  "/"))),new Date(Date.parse(this.defaultDateValue1[1].replace(/-/g,  "/"))))

      Array.prototype.push.apply(this.teacherOptions,res.data.bottom.teachers)
      console.log(this.teacherOptions)
      this.defaultDateValue2 = res.data.bottom.trend.time.split("-")
      this.dateValue2.push(new Date(Date.parse(this.defaultDateValue2[0].replace(/-/g,  "/"))),new Date(Date.parse(this.defaultDateValue2[1].replace(/-/g,  "/"))))
      this.drawLine()
     })

  },
  methods:{
      drawLine() {
      let myChart = this.$echarts.init(document.getElementById('main'));
      let myChart2 = this.$echarts.init(document.getElementById('line2'));
      let myDonuts1 = this.$echarts.init(document.getElementById('donuts-left'));
      let myDonuts2 = this.$echarts.init(document.getElementById('donuts-right'));

      myChart.setOption({
        tooltip : {
          trigger: 'axis',
        },
        xAxis: {
          boundaryGap : false,
          data: this.item.top.trend_key,
          nameTextStyle: {
            nameTextStyle: "#444444" ,
          }
        },
        yAxis: {
          axisLine: false
        },
        series: [{
          name: '',
          type: 'line',
          color:'rgb(221, 233, 255)',
          lineStyle: {
            color: '#5895FF'
          },
          areaStyle: {
            normal: {}
          },
          data: this.item.top.trend_value
        }]
        });

      myChart2.setOption({
        tooltip : {
          trigger: 'axis',
        },
        xAxis: {
          boundaryGap : false,
          data: this.item.bottom.trend.trend_key,
           nameTextStyle: {
            nameTextStyle: "#444444" ,
          }
        },
        yAxis: {
          axisLine: false
        },
        series: [{
          name: '',
          type: 'line',
           color:'rgb(221, 233, 255)',
          lineStyle: {
            color: '#5895FF'
          },
          areaStyle: {normal: {}},
          data: this.item.bottom.trend.trend_value
        }]
        });

      myDonuts1.setOption({
         legend: {
                orient: 'center',
                x: 'right',
                y: 'center',
                // backgroundColor:
                /*itemWidth: '12',
                itemHeight: '12'*/
                 textStyle : {
                  fontSize : 14,
                  lineHeight: 14,
                  fontWeight: 'lighter',
                  padding:[10,0,10,0],
                  fontFamily:'PingFangSC-Light'
                 },
                 data:this.spData

            },
            color: ['#5895FF','#FD6080','#FFB13D'],
            series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'lighter',
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:this.item.middle.left
            }
        ]
        });


      myDonuts2.setOption({
         legend: {
                orient: 'center',
                x: 'right',
                y: 'center',
                // backgroundColor:
                /*itemWidth: '12',
                itemHeight: '12'*/
                 textStyle : {
                  fontSize : 14,
                  lineHeight: 14,
                  fontWeight: 'lighter',
                  padding:[10,0,10,0],
                  fontFamily:'PingFangSC-Light', 
                },
                data:this.spData2
                },
            color: ['#5895FF','#FD6080','#FFB13D'],
            series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                center: ['35%', '50%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'lighter'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:this.item.middle.right
            }
        ]
        });
     },
    getArticleView(){
      let filterTime = null;
      if(this.dateValue1){
        filterTime = moment(this.dateValue1[0]).format("YYYY/MM/DD")+'-'+moment(this.dateValue1[1]).format("YYYY/MM/DD")
      }
      let obj = {
        is_charge:this.priceValue,
        type:this.typeValue,
        time:filterTime
      }

      this.$store.dispatch('GETARTICLEVIEWTREND', obj)
      .then(res => {
        //console.log(res.data)
        this.item.top = res.data
        this.drawLine()
      }).catch( err => {
        console.log(err)
      })
    },
    getEarningTrend(){
      let filterEarningTime = null;
      if(this.dateValue2){
        filterEarningTime = moment(this.dateValue2[0]).format("YYYY/MM/DD")+'-'+moment(this.dateValue2[1]).format("YYYY/MM/DD")
      }
      let obj = {
        teacher_id:this.teacherValue,
        time:filterEarningTime
      }
      console.log(obj)
      this.$store.dispatch('GETEARNINGTREND', obj)
      .then(res => {
        //console.log(res.data)
        this.item.bottom.trend = res.data
        this.drawLine()
      }).catch( err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-container{
  min-width:810px;
  margin-top:-20px;
}
.echars-content > *{
  box-sizing: border-box;
}
.echars-content .echarts-container{
  width:49%;
}
.echars-content .echarts-container{
  width:49%;
}
.top-container {
  width: 100%;
  min-width: 1024px;
  background: #5895FF;
  color: #FFF;
  height: 64px;
  line-height: 64px;
  text-indent: 30px;
}
.top-container .top-logo {
  float: left;
  font-size: 24px;
}
.top-container .top-right {
  float: right;
  font-size: 16px;
}
.top-container .top-right ul,
.top-container .top-right li {
  list-style: none;
}
.top-container .top-right li {
  float: left;
}
.top-container .top-right .user {
  cursor: pointer;
  padding-right: 30px;
}
.top-container .top-right .user img.header {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 15px;
}
.top-container .top-right .user img.icon-drow {
  width: 10px;
  vertical-align: middle;
}
.btn-modal .modal-footer .tbtn {
  background: #FFFFFF;
  border: 1px solid #E5E5E5;
  border-radius: 2px;
  color: #444444;
}
.btn-modal .modal-footer .cancel {
  float: left;
}
.btn-modal .modal-footer .sure {
  float: right;
}
.main-container {
  background: #F6F6F6;
  padding-top: 30px;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  padding-bottom: 60px;
}
.nav-container {
  width: 150px;
  float: left;
}
.nav-container .nav a {
  color: #444444;
  height: 48px;
  line-height: 48px;
  padding: 0;
}
.nav-container .nav li {
  text-indent: 15px;
  margin-top: 15px;
}
.nav-container .nav li:first-child {
  margin-top: 0;
}
.nav-container .nav li img {
  width: 18px;
  vertical-align: text-top;
  margin-right: 20px;
}
.nav-container .nav li.active a {
  color: #5895FF;
}
.nav-container .nav li.active:after {
  content: '';
  width: 4px;
  height: 36px;
  background: #5895FF;
  position: absolute;
  right: 0;
  top: 5px;
}
.content-container {
  height: 100%;
  margin-left: 172px;
}
.content-container .content {
  min-width: 810px;
}
.content-container .content-top {
  min-width: 810px;
  background: #FFF;
  text-align: center;
  overflow: hidden;
  margin-right: 20px;
  height: 153px;
  border: 1px solid #E5E5E5;
}
.content-container .content-top div {
  float: left;
  width: 33%;
  text-align: center;
  margin-top: 43px;
}
.content-container .content-top .list img {
  width: 18px;
  vertical-align: top;
  margin-right: 10px;
}
.content-container .content-top .list p {
  font-size: 16px;
  color: #AAAAAA;
}
.content-container .content-top .list h3 {
  font-size: 36px;
  color: #444444;
  margin-top: 15px;
}
.content-container .content-articles {
  padding: 20px;
  min-width: 810px;
  background: #FFF;
  margin-right: 20px;
  border: 1px solid #E5E5E5;
  margin-top: 20px;
}
.content-container .content-articles .left {
  font-size: 16px;
  color: #444444;
}
.content-container .content-articles .right {
  width: 110px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background: #5895FF;
  border-radius: 2px;
  text-align: center;
}
.content-container .content-articles .add-article-type {
  color: #444444;
  text-align: center;
  width: 320px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
  margin-top: 10px;
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
  cursor: pointer;
}
.content-container .content-articles .add-article-type img {
  width: 72px;
}
.content-container .content-articles .article-list {
  margin-bottom: 50px;
}
.content-container .content-articles .no-article {
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
  padding: 20px 0;
  border-bottom: 1px solid #E5E5E5;
}
.content-container .content-articles .had-article .list:hover {
  background: #F4F8FF;
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
}
.content-container .content-articles .had-article .list-info .b-btns {
  position: absolute;
  bottom: 3px;
  left: 0;
  right: 0;
  font-size: 14px;
}
.content-container .content-articles .had-article .list-info .b-btns span {
  display: inline-block;
  margin-right: 25px;
}
.content-container .content-articles .had-article .list-info .b-btns .show-time {
  float: right;
  color: #AAAAAA;
  font-size: 16px;
  margin: 0;
}
.content-container .content-articles .see-more {
  font-size: 16px;
  color: #AAAAAA;
  text-align: center;
  height: 50px;
  line-height: 50px;
  margin-top: 10px;
}
.a-type.free {
  color: #FD6080;
}
.a-type.sell {
  color: #FFB13D;
}
.a-shelves {
  cursor: pointer;
}
.upper {
  color: #4CBF4A;
}
.lower {
  color: #F92424;
}
.noUp {
  color: #5895FF;
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
/* 教师介绍 */
.tinstruction-container {
  background: #fff;
  padding: 20px;
}
.tinstruction-container .info-list {
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom: 1px solid #E5E5E5;
  position: relative;
}
.tinstruction-container .info-list:hover {
  background: #F4F8FF;
}
.tinstruction-container .info-list:hover .modify-btn {
  display: block;
}
.tinstruction-container .info-list h3 {
  font-size: 24px;
  color: #444444;
  line-height: 24px;
}
.tinstruction-container .info-list h3 span {
  font-size: 16px;
  color: #AAAAAA;
  line-height: 24px;
  margin-left: 15px;
}
.tinstruction-container .info-list .save-info {
  width: 112px;
  height: 32px;
  line-height: 32px;
  background: #5895FF;
  border-radius: 2px;
  color: #FFF;
  text-align: center;
  margin-top: 15px;
}
.tinstruction-container .info-list .modify-btn {
  position: absolute;
  right: 10px;
  top: 5px;
  display: none;
  cursor: pointer;
}
.tinstruction-container .info-list .modify-btn img {
  width: 20px;
}
.tinstruction-container .info-list .info-txt {
  font-size: 16px;
  color: #444444;
  line-height: 24px;
  margin-top: 10px;
}
.tinstruction-container .info-list .info-img {
  max-height: 200px;
}
.tinstruction-container .teacher-photo p {
  font-size: 16px;
  color: #444444;
  margin-top: 20px;
}
.tinstruction-container .teacher-photo .upload-photo {
  width: 224px;
  height: 224px;
  overflow: hidden;
}
.tinstruction-container .teacher-photo .upload-photo img {
  width: 100%;
}
.tinstruction-container .teacher-info input {
  width: 100%;
  height: 42px;
  line-height: 42px;
  border: 1px solid #E5E5E5;
  text-indent: 15px;
  margin-top: 20px;
}
.condition-item{
  float:left;
  width:108px;
  margin-right:10px;
}
.teacher-select{
  width:120px;
}
</style>
