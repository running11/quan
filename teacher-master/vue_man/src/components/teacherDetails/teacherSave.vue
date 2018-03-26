<template>
	<div class="content-container">
		<div class="tinstruction-container content">
			<div class="teacher-photo info-list">
				<div class="left pull-left">
					<h3>您的照片<span>此照片会显示在名师列表</span></h3>
					<p>请上传不小于200X200的照片，支持格式：jpg、png</p>
				</div>
				<div class="right pull-right upload-photo">
					<label>
						<input type="file" class="hidden">
						<img src="../../../static/images/65000275_p0.jpg" alt="">
					</label>
				</div>
				<div class="clearfix"></div>
			</div>
	
			<div class="teacher-info info-list">
				<h3>您的简介<span>此简介会显示在名师列表，不超过30字</span></h3>
				<div class="modify-btn">
					<img src="../../../static/images/ic_list_edit.png" alt="">
				</div>
				<p class="info-txt">
					做为一名教师，只有严爱相济，才可赢得学生的信赖，走进孩子们的心灵，才能在教书的同时育人。在管理班级琐碎繁冗的工作中，使我深深体会到：只有给学生的爱是发自内心的，才会让学生感受到爱，体会到被爱之乐，他们才会学着去爱别人。
				</p>
			</div>
	
			<div class="teacher-detail-info info-list">
				<h3>您的简介<span>请尽量详细介绍您的履历以供其他用户对您进行深入的了解</span></h3>
				<div class="modify-btn">
					<img src="../../../static/images/ic_list_edit.png" alt="">
				</div>
				<p class="info-txt">
					做为一名优秀教师，只有学会苦中多乐；只有立志从教，才会一生常乐！无论遇到什么样的班级，什么样的孩子，什么样的问题，相信我都能处理好，因为我有一颗热爱教育、热爱孩子的心，我自己是个有理想，有责任心的好老师，在我所选择的教育这条路上，我始终坚信我也会“收获教育之果实，享受教育之甘甜。”这就是我能立足于教育这一崇高事业之本。
				</p>
				<img class="info-img" src="../../../static/images/65687248_p1.jpg" alt="">
				<p class="info-txt">
					做为一名教师，只有严爱相济，才可赢得学生的信赖，走进孩子们的心灵，才能在教书的同时育人。在管理班级琐碎繁冗的工作中，使我深深体会到：只有给学生的爱是发自内心的，才会让学生感受到爱，体会到被爱之乐，他们才会学着去爱别人。
				</p>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'teacherSave',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
	.content-container{
		height: auto;
		padding-right: 20px;
	}
	.teacher-detail-info{
		.info-img{
			margin-top: 10px;
		}
	}
</style>
