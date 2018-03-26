<template>
  <div class="content-container income">
    <el-row class="income-num  no-margin">
      <el-col :span="6">
        <div class="center-div">
          <div class="num-title">总收益</div>
          <div class="num-style text-left">¥&nbsp;{{ item.top.earnings_all }}</div>
          <div>
            <button @click="income('no')"><span>收益记录</span></button>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="center-div">
          <div class="num-title">已提现</div>
          <div class="num-style">¥&nbsp;{{ item.top.earnings_had_draw }}</div>
          <div>
            <button @click="withdraw">提现记录</button>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="total-income">
        <div class="center-div">
          <div class="num-title">本月总收益</div>
          <div class="num-style">¥&nbsp;{{item.top.month_earnings_all}}</div>
          <div>
            <button>收益记录</button>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="apply-money">
        <div class="center-div">
          <div class="num-title">本月申请提前</div>
          <div class="num-style">¥&nbsp;{{item.top.month_apply_draw}}</div>
          <div>
            <button @click="goToApply">已发放：¥&nbsp;{{item.top.month_had_draw}}</button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="income-echars">
      <div class="echars-head">
        <span class="echars-name">收益走势</span>
        <div class="pull-right">
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="changeDate">
          </el-date-picker>
        </div>
      </div>
      <div class="echars-content">
        <div id="myChart" style="width: 100%;height:330px;"></div>
      </div>
    </div>
    <div class="income-list ">
      <div class="echars-time">
        <el-select v-model="sortValue" placeholder="请选择" @change="changeSelect(1)">
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="income-tabs">
        <el-tab-pane label="文章收益" name="first" style="font-family: PingFangSC-Light;font-size: 16px;color: #AAAAAA;">
          <div class="article-list had-article">
            <div class="list" v-for="(items,index) in item.bottom.rows">
              <div class="list-left pull-left list-img">
                  <img v-if="items.cover==''" src="../../../images/img_picture_default.png" alt="">
                  <img v-if="items.cover!=''" :src="items.cover" alt="">
                  <img src="/static/images/ic_music.png" class="sign-btn video-btn" v-if="items.type == 2"/>
                  <img src="/static/images/ic_video.png" class="sign-btn video-btn" v-if="items.type == 3"/>
              </div>
              <div class="list-right pull-left list-info">
                <h4>{{items.title}}</h4>
                <div class="article-btns">
                </div>
                <ul>
                  <li class="comment pull-left">
                    <img src="../../../images/ic_list_comment.png" alt="">
                    <span>{{ items.comments }}</span>
                  </li>
                  <li class="eye pull-left">
                    <img src="../../../images/ic_list_view.png" alt="">
                    <span>{{ items.points }}</span>
                  </li>
                  <li class="star pull-left">
                    <img src="../../../images/ic_list_collection.png" alt="">
                    <span>{{ items.collections }}</span>
                  </li>
                  <li class="share pull-left">
                    <img src="../../../images/ic_list_share.png" alt="">
                    <span>{{ items.shares }}</span>
                  </li>
                </ul>
                <div class="clearfix"></div>
                <div class="b-btns">
                  <span class="price">{{ items.charge }}</span>
                  总收益：<span class="all-price">{{ items.earnings_all }}</span>
                  <button @click="income(items)">收益记录</button>
                  <span class="show-time pull-right">修改时间：{{ items.create_time }}</span>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <div class="page-num">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :page-size="item.bottom.pages.pageSize"
                :current-page="item.bottom.pages.page"
                :total="item.bottom.totals">
              </el-pagination>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="教师收益" name="second" style="font-family: PingFangSC-Light;font-size: 16px;color: #AAAAAA;">
          <div class="teacher-income-list">
            <div class="teacher-income-item" v-for="itemT in teacherBonus">
              <img :src="itemT.teacher_img" class="head"/>
              <div class="info">
                <div class="top">
                  <div class="name">{{itemT.teacher_name}}</div>
                  <div class="article">
                    <span>免费文章：{{itemT.nocharge_articles}}篇</span>
                    <span>收费文章：{{itemT.charge_articles}}篇</span>
                  </div>
                </div>
                <div class="bottom">
                  <div class="income-item">
                    总收益：<span>￥{{itemT.earnings}}</span>
                  </div>
                  <div class="income-item">
                    本月收益：<span>￥{{itemT.month_earnings}}</span>
                  </div>
                  <div class="income-item">
                    上月收益：<span>￥{{itemT.last_month_earnings}}</span>
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <div class="page-num">
              <el-pagination
                background
                @current-change="handleCurrentChangeSp"
                layout="prev, pager, next"
                :page-size="pagesTeach.pageSize"
                :current-page="pagesTeach.page"
                :total="pagesTeach.totals">
              </el-pagination>
            </div>
          </div>

        </el-tab-pane>

      </el-tabs>
    </div>

    <el-dialog
      title="提现规则"
      :visible.sync="ruleVisible"
      width="30%"
      center>
      <div class="rule-content"><span></span>每月1-10日可申请提现，10日前可更改申请金额。</div>
      <div class="rule-content"><span></span>单次提现金额不少于500，提现通过后与每月15日发放</div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="ruleVisible = false" class="rule-button">我知道了</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="申请提现"
      :visible.sync="withdrawVisible"
      width="30%"
      center>
      <div class="input-num">
        <input type="number" placeholder="请输入金额，如：500"><span>元</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="withdrawVisible = false" class="cancel-button">取消</el-button>
    <el-button type="primary" @click="drawApply" class="confirm-button">申请提现</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'bounsMan',
    data() {
      return {
        ruleVisible: false,
        activeName: 'first',
        withdrawVisible: false,
        item: {
          bottom: {
            pages: {
              "page": 1,
              "pageSize": 10,
              "pageAll": 1
            },
            rows: [],
            totals: 0
          },
          middle: {
            time: '',
            trend_key: [],
            trend_value: []
          },
          top: {
            draw: {},
            earnings_all: '',
            earnings_had_draw: '',
            earnings_remain: '',
            month_apply_draw: "",
            month_earnings_all: "",
            month_had_draw: ""
          }
        },
        sortOptions: [{
          value: '1',
          label: '收益从高到低'
        }, {
          value: '2',
          label: '收益从低到高'
        }],
        sortValue: '',
        pickerOptions: {
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
        dateValue: '',
        teacherBonus: '',
        pagesTeach: {page: 0, pageSize: 0, pageAll: 0, totals: 0}
      }
    },
    mounted() {
      // vuex 后台调取数据
      this.$store.dispatch('GET_BONUS')
        .then(res => {
          let data = res.data
          console.log(data)
          // 封装数据
          this.item.bottom.pages = data.bottom.pages;
          this.item.bottom.rows = data.bottom.rows;
          this.item.bottom.totals = data.bottom.totals;
          this.item.middle.time = data.middle.time;
          this.item.middle.trend_key = data.middle.trend_key;
          this.item.middle.trend_value = data.middle.trend_value;
          this.item.top.draw = data.top.draw;
          this.item.top.earnings_all = data.top.earnings_all
          this.item.top.earnings_had_draw = data.top.earnings_had_draw
          this.item.top.earnings_remain = data.top.earnings_remain
          this.item.top.month_apply_draw = data.top.month_apply_draw
          this.item.top.month_earnings_all = data.top.month_earnings_all
          this.item.top.month_had_draw = data.top.month_had_draw

          this.drawLine();
          this.selectTeachBonus(1);
        }).catch(err => {
        console.log(err)
      })
    },
    methods: {
      handleCurrentChange(val) {
        this.changeSelect(val);
      },
      income(item) {
        console.log(item);
        let aid = '';
        if (item != 'no') {
          aid = item.article_id
        }
        this.$router.push({
          name: 'incomedetails',
          params: {
            aid: aid,
          }
        })
      },
      withdraw() {
        this.$router.push({path: '/withdrawdetails'})
      },
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            boundaryGap: false,
            data: this.item.middle.trend_key
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'line',
            color: '#5895FF',
            areaStyle: {normal: {}},
            data: this.item.middle.trend_value
          }]
        });
      },
      changeDate() {
        console.log(this.dateValue);
        let obj = {
          time: '',
        }
        if (this.dateValue.length > 0) {
          obj.time = moment(this.dateValue[0]).format("YYYY/MM/DD") + '-' + moment(this.dateValue[1]).format("YYYY/MM/DD");
        }
        this.$store.dispatch('GET_MANAGE_LIST', obj)
          .then(res => {
            let data = res.data;
            this.item.middle.time = data.middle.time;
            this.item.middle.trend_key = data.middle.trend_key;
            this.item.middle.trend_value = data.middle.trend_value;
          }).catch(err => {
          console.log(err)
        })
      },
      changeSelect(item) {
        console.log(this.sortValue);
        var obj = {
          sort: this.sortValue,
          page: item
        }
        this.$store.dispatch('GET_ARTICLE', obj)
          .then(res => {
            let data = res.data;
            console.log(data);
            this.item.bottom.pages.page = parseInt(data.pages.page);
            this.item.bottom.pages.pageSize = parseInt(data.pages.pageSize);
            this.item.bottom.pages.pageAll = parseInt(data.pages.page);
            this.item.bottom.rows = data.rows;
            this.item.bottom.total = data.totals;
          }).catch(err => {
          console.log(err)
        })
      },
      drawApply() {
        withdrawVisible = false;
        let obj = {
          crash: this.withdrawVisible,
          cid: ''
        }
        this.$store.dispatch('GET_DRAWAPPLY', obj)
          .then(res => {
            let data = res.data;
            this.item.top.draw = data.draw;
          }).catch(err => {
          console.log(err)
        })
      },

      goToApply() {
        this.$router.push({path: '/adminWithdrawMoneyApply'})
      },

      selectTeachBonus(item) {
        let obj = {
          sort: this.sortValue,
          page: item
        }
        this.$store.dispatch('GET_TEACHEREARN', obj)
          .then(res => {
            let data = res.data;
            console.log(data);
            this.teacherBonus = data.rows;
            this.pagesTeach.page = parseInt(data.pages.page);
            this.pagesTeach.pageAll = parseInt(data.pages.pageAll);
            this.pagesTeach.pageSize = parseInt(data.pages.pageSize);
            this.pagesTeach.totals = parseInt(data.totals);


          }).catch(err => {
          console.log(err)
        })
      },
      handleCurrentChangeSp(val) {
        this.selectTeachBonus(val);
      },
      handleClick(tab, event) {
      },

    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .income {
    .no-padding {
      padding: 0;
    }
    .no-margin {
      margin: 0;
    }
    .income-num {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      height: 164px;
      min-width: 811px;
      margin-right: 20px;
      padding-top: 24px;
      .center-div {
        margin: 0 auto;
        width: 115px;
        height: 100%;
      }
      .num-title {
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #AAAAAA;
        letter-spacing: -0.39px;
        line-height: 16px;
        margin-top: 0;
      }
      .num-style {
        font-family: PingFangSC-Medium;
        font-size: 36px;
        color: #444444;
        letter-spacing: -0.87px;
        line-height: 36px;
        margin-top: 16px;
      }
      button {
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        height: 32px;
        width: 112px;
        margin-top: 16px;
      }
      button span {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #444444;
        letter-spacing: -0.39px;
        line-height: 16px;
      }
      .num-rule {
        cursor: pointer;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #5895FF;
        letter-spacing: -0.39px;
        line-height: 16px;
        margin-top: 16px;
        text-align: right;
        margin-right: 10px;
      }
      .withdraw-style {
        margin-top: 12px;
        margin-right: 10px;
        .want-withdraw {
          height: 32px;
          width: 132px;
          background: #5895FF;
          border-radius: 2px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: -0.39px;
            line-height: 16px;
          }
        }
        .will-withdraw {
          height: 32px;
          width: 168px;
          background: #FFFFFF;
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #444444;
            letter-spacing: -0.39px;
            line-height: 16px;
            img {
              height: 12px;
              width: 12px;
            }
          }
        }
        .already-withdraw {
          background: #4CBF4A;
          border-radius: 2px;
          height: 32px;
          width: 169px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: -0.39px;
            line-height: 16px;
          }
        }
      }
    }
    .income-echars {
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      height: 370px;
      min-width: 811px;
      margin-top: 20px;
      margin-right: 20px;
      .echars-head {
        height: 32px;
        width: 100%;
        padding: 0 26px 0 18px;
        margin-top: 16px;
        .pull-right {
          float: right;
          margin-right: 40px;
        }
        .echars-name {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 32px;
          display: inline-block;
          height: 32px;
        }
        .echars-time {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 16px;
          float: right;
          margin-right: 40px;
          text-align: right;
          position: relative;
          top: 40px;
        }
      }
      .echars-content {

      }
    }
    .income-list {
      .echars-time {
        font-family: PingFangSC-Light;
        font-size: 16px;
        color: #444444;
        letter-spacing: -0.39px;
        line-height: 16px;
        position: absolute;
        right: 0;
        z-index: 9;
        margin-right: 40px;
      }
      background: #FFFFFF;
      border: 1px solid #E5E5E5;
      //height: 164px;
      min-width: 811px;
      margin-top: 20px;
      margin-right: 20px;
      padding: 20px 20px;
      .income-list-head {
        height: 32px;
        width: 100%;
        padding: 0 26px 0 18px;
        margin-top: 16px;
        .echars-name {
          font-family: PingFangSC-Light;
          font-size: 16px;
          color: #444444;
          letter-spacing: -0.39px;
          line-height: 32px;
          display: inline-block;
          height: 32px;
        }

      }
      .had-article {
        position: relative;
        margin: 20px 20px 0 20px;
        .list {
          padding: 20px 0;
          border-bottom: 1px solid #E5E5E5;

          &:hover {
            background: #F4F8FF;

            .article-btns {
              display: block;
            }
          }
        }

        .list-img {
          img {
            width: 184px;
            height: 104px;
          }
        }
        .article-btns {
          position: absolute;
          right: 5px;
          top: 5px;
          display: none;
          span {
            display: inline-block;
            width: 22px;
            height: 22px;
            margin-right: 15px;
            cursor: pointer;
          }
          .modify {
            background: url('../../../images/ic_list_edit.png') center center no-repeat;
            background-size: 20px;
          }
          .delete {
            background: url('../../../images/ic_list_delete.png') center center no-repeat;
            background-size: 20px;
          }
        }
        .list-info {
          margin-left: 20px;
          font-size: 16px;
          height: 104px;
          position: absolute;
          left: 204px;
          right: 0;
          img {
            width: 18px;
            vertical-align: text-top;
          }
          h4 {
            color: #444444;
          }
          ul {
            margin-top: 12px;
            color: #AAAAAA;
            li {
              margin-right: 20px;
            }
          }

          .b-btns {
            position: absolute;
            bottom: 3px;
            left: 0;
            right: 0;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #AAAAAA;
            letter-spacing: -0.48px;
            line-height: 20px;
            .price {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              color: #FFB13D;
              letter-spacing: -0.34px;
              line-height: 14px;
            }
            .all-price {
              font-family: PingFangSC-Regular;
              font-size: 20px;
              color: #FFB13D;
              letter-spacing: -0.48px;
              line-height: 20px;
            }
            button {
              background: #FFFFFF;
              border: 1px solid #E5E5E5;
              border-radius: 2px;
              font-family: PingFangSC-Regular;
              font-size: 16px;
              color: #444444;
              letter-spacing: -0.39px;
              line-height: 16px;
              height: 32px;
              width: 112px;
            }
            span {
              display: inline-block;
              margin-right: 25px;
            }
            .show-time {
              float: right;
              color: #AAAAAA;
              font-size: 16px;
              margin: 0;
            }
          }
        }
      }
      .page-num {
        text-align: center;
        margin: 10px 0;
      }
    }
    .demo {
      position: relative;
    }
    .demo i {
      position: absolute;
      bottom: 10px;
      right: 24px;
      top: auto;
      cursor: pointer;
    }
    .rule-content {
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 24px;
      span {
        background: #5895FF;
        display: inline-block;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        margin-right: 15px;
        position: relative;
        top: -2px;
      }
    }
    .rule-button {
      background: #5895FF;
      border-radius: 2px;
      height: 32px;
      width: 196px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: -0.39px;
      line-height: 8px;
    }
    .el-dialog__body {

    }
    .input-num {
      font-family: PingFangSC-Light;
      font-size: 16px;
      color: #444444;
      letter-spacing: -0.39px;
      line-height: 24px;
      input {
        padding-left: 15px;
        padding-right: 30px;
        font-family: PingFangSC-Light;
        font-size: 16px;
        //color: #AAAAAA;
        letter-spacing: -0.39px;
        line-height: 16px;
        height: 44px;
        width: 90%;
        background: #FFFFFF;
        border: 1px solid #E5E5E5;
      }
      span {
        float: right;
        position: relative;
        top: -33px;
        left: -15px;
      }
    }
    .dialog-footer {
      border: none;
      text-align: center;
      button {
        height: 32px;
        width: 196px;
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
      .confirm-button {
        background: #5895FF;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: -0.39px;
        line-height: 8px;
      }
    }

  }

  .teacher-income-list {
    margin: 20px 20px 0 20px;
    .teacher-income-item {
      padding: 20px 0;
      border-bottom: 1px solid #E5E5E5;
      .head {
        float: left;
        width: 72px;
        height: 72px;
        border-radius: 50%;
      }
      .info {
        margin-left: 92px;
        .top {
          padding-bottom: 20px;
          overflow: hidden;
          .name {
            float: left;
            font-family: PingFangSC-Regular;
            font-size: 24px;
            color: #444444;
            letter-spacing: -0.58px;
            line-height: 44px;
          }
          .article {
            float: right;
            span {
              font-family: PingFangSC-Light;
              font-size: 16px;
              color: #AAAAAA;
              letter-spacing: -0.39px;
              line-height: 44px;
            }
          }
        }
        .bottom {
          overflow: hidden;
          .income-item {
            float: left;
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #AAAAAA;
            letter-spacing: -0.48px;
            line-height: 20px;
            margin-right: 20px;
            span {
              font-family: PingFangSC-Regular;
              font-size: 20px;
              color: #FFB13D;
              letter-spacing: -0.48px;
              line-height: 20px;
            }
          }
        }
      }
    }
  }

  .total-income {
    border-left: 1px solid #E5E5E5;
  }

  .income .income-num button {
    min-width: 140px;
  }
  .income .income-list .had-article .list .list-img{
    width: 184px;
    height: 104px;
    position:relative;
  }
  .income .income-list .had-article .list .list-img img.sign-btn{
     width:48px;
     height:48px;
     position:absolute;
     left:50%;
     top:50%;
     margin:-24px 0 0 -24px;
     cursor:pointer;
  }
  .el-tabs__item{
    font-family: PingFangSC-Light;
    font-size: 16px;
    color: #444444;
    letter-spacing: -0.39px;
    line-height: 16px;
  }
  .income-tabs .el-tabs__nav-wrap::after {
    display:none !important;
  }
</style>
