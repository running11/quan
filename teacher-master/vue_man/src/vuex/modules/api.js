import {
  get,
  post
} from '../base';

//登录
export function getLogIn(params) {
  return post('user.login', params);
}
//登出
export function getLogOut(params) {
  return get('user.logout', params);
}
//收益
export function getBonus(params) {
	return get('earning.home',params);
}
//教师首页
export function getIndex(params) {
	return get('teacher.home',params);
}
//获取文章列表
export function getArticle(params) {
	return get('article.getlist',params);
}
//删除文章（逻辑删除）
export function deleteArticle(params) {
	return post('article.delete',params);
}
//教师介绍
export function getTeacher(params){
	return get('teacher.intro',params);
}
//文章详情
export function getArticleDetails(params){
	return get('article.detail',params);
}
//图片上传
export function getImgUp(params){
	return post('article.uploadCover',params);
}
//文章上下架
export function articleSale(params){
	return post('article.sale',params);
}
//获取文章评论
export function getComments(params){
	return get('article.getComments',params);
}
//添加评论
export function addComments(params){
	return post('article.addComment',params);
}
//评论上下架
export function commentSale(params){
	return post('article.commentSale',params);
}
//获取评论列表
export function getList(params){
	return get('article.getlist',params);
}
//获取管理员评论列表
export function getManageList(params){
  return get('article.getAllComments',params);
}
//获取管理员评论上下架
export function getUpdownList(params){
  return post('article.commentsSale',params);
}
//获取管理员一条评论
export function getOneComment(params){
  return get('article.getComment',params);
}
//教师管理首页
export function getAdhome(params){
	return get('teacher.adhome',params);
}
//教师保存
export function saveTeacher(params){
	return post('teacher.saveIntro',params);
}
//头部信息
export function getHead(params){
	return get('teacher.uinfo',params);
}
//获取教师列表
export function getTeacherList(params){
	return get('teacher.getlist',params);
}
//获取收益列表
export function getEarnList(params){
  return get('earning.getlist',params);
}
//获取提现记录
export function getDrawList(params){
  return get('earning.getDrawList',params);
}
//申请提现
export function getDrawApply(params){
  return get('draw.apply',params);
}
//教师收益管理员
export function getTeacherEarnings(params){
  return get('earning.getTeacherEarnings',params);
}
//提现申请管理员
export function getApply(params){
  return get('earning.getApply',params);
}
//提现标记管理员
export function dealApply(params){
  return post('earning.dealApply',params);
}

//获取广告列表
export function getAdvList(params){
	return get('Advertise.getlist',params);
}
//广告添加
export function getAdvAdd(params){
	return post('Advertise.add',params);
}
//广告上下架
export function advSale(params){
	return post('Advertise.sale',params);
}
//文章浏览趋势
export function getArticleViewTrend(params){
	return get('article.viewTrend',params);
}
//文章浏览趋势
export function getEarningTrend(params){
	return get('earning.getTrend',params);
}
//新增文章
export function addArticle(params){
	return post('article.add',params);
}
//广告顺序互换
export function changeAdv(params){
	return post('Advertise.change',params);
}
//日志
export function getLogList(params){
  return get('teacher.logs',params);
}
//预览
export function articlePreview(params){
  return post('article.preview',params);
}