import * as api from './api';
import * as types from '../types'

const state = {
  upLoadUrlTest: "1111111"
}

const getters = {}

const mutations = {}

const actions = {
  //用户登录
  [types.GET_LOGIN](context, params) {
    return new Promise((resolve, reject) => {
      api.getLogIn(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //用户登出
  [types.GET_LOGOUT](context, params) {
    return new Promise((resolve, reject) => {
      api.getLogOut(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //收益管理
  [types.GET_BONUS](context, params) {
    return new Promise((resolve, reject) => {
      api.getBonus(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //教师首页
  [types.GET_INDEX](context, params) {
    return new Promise((resolve, reject) => {
      api.getIndex(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  [types.GET_ARTICLE](context, params) {
    return new Promise((resolve, reject) => {
      api.getArticle(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //删除文章
  [types.DELETE_ARTICLE](context, params) {
    return new Promise((resolve, reject) => {
      api.deleteArticle(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //教师介绍
  [types.GET_TEACHER](context, params) {
    return new Promise((resolve, reject) => {
      api.getTeacher(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //教师保存
  [types.SAVE_TEACHER](context, params) {
    return new Promise((resolve, reject) => {
      api.saveTeacher(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //文章详情
  [types.GET_ARTICLE_DETAILS](context, params) {
    return new Promise((resolve, reject) => {
      api.getArticleDetails(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //文章上下架
   [types.ARTICLE_SALE](context, params) {
    return new Promise((resolve, reject) => {
      api.articleSale(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //图片上传
  [types.IMG_UP](context, params) {
    return new Promise((resolve, reject) => {
      api.getImgUp(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取文章详情
  [types.ARTICLE_COMMENTS](context, params) {
    return new Promise((resolve, reject) => {
      api.getComments(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //添加评论
  [types.ADD_COMMENTS](context, params) {
    return new Promise((resolve, reject) => {
      api.addComments(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //评论上下架
  [types.COMMENT_SALE](context, params) {
    return new Promise((resolve, reject) => {
      api.commentSale(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取评论列表
  [types.GET_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取管理员评论列表
  [types.GET_MANAGE_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getManageList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取管理员评论上下架
  [types.GET_UPDOWN_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getUpdownList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取管理员一条评论
  [types.GET_ONE_COMMENT](context, params) {
    return new Promise((resolve, reject) => {
      api.getOneComment(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取后台管理首页
  [types.GET_ADHOME](context, params) {
    return new Promise((resolve, reject) => {
      api.getAdhome(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取头部信息
  [types.GET_HEAD](context, params) {
    return new Promise((resolve, reject) => {
      api.getHead(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取教师列表
  [types.GET_TEACHERLIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getTeacherList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取收益列表
  [types.GET_EARN_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getEarnList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取广告列表
  [types.GET_ADV_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getAdvList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //获取提现列表
  [types.GET_DRAW_LIST](context, params) {
    return new Promise((resolve, reject) => {
      api.getDrawList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },  //广告添加保存
  [types.GET_ADV_ADD](context, params) {
    return new Promise((resolve, reject) => {
      api.getAdvAdd(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //申请提现
  [types.GET_DRAWAPPLY](context, params) {
    return new Promise((resolve, reject) => {
      api.getDrawApply(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //教师收益管理员
  [types.GET_TEACHEREARN](context, params) {
    return new Promise((resolve, reject) => {
      api.getTeacherEarnings(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //提现申请管理员
  [types.GET_APPLY](context, params) {
    return new Promise((resolve, reject) => {
      api.getApply(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //提现标记管理员
  [types.DEAL_APPLY](context, params) {
    return new Promise((resolve, reject) => {
      api.dealApply(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },  //广告上下架
  [types.ADV_SALE](context, params) {
    return new Promise((resolve, reject) => {
      api.advSale(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //筛选文章浏览趋势
  [types.GETARTICLEVIEWTREND](context, params) {
    return new Promise((resolve, reject) => {
      api.getArticleViewTrend(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //筛选收益趋势
  [types.GETEARNINGTREND](context, params) {
    return new Promise((resolve, reject) => {
      api.getEarningTrend(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //新增文章
  [types.ADD_ARTICLE](context, params) {
    return new Promise((resolve, reject) => {
      api.addArticle(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //广告顺序互换
  [types.CHANGE_ADV](context, params) {
    return new Promise((resolve, reject) => {
      api.changeAdv(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //日志
  [types.TERCHER_LOGS](context, params) {
    return new Promise((resolve, reject) => {
      api.getLogList(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
  //预览
  [types.ARTICLE_PREVIEW](context, params) {
    return new Promise((resolve, reject) => {
      api.articlePreview(params).then((data) => {
        resolve(data);
      }).catch((err) => {
        resolve(err);
      });
    });
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
