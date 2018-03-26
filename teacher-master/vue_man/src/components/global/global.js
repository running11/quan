
const baseUrl = 'http://quan-dev.xiaoheiban.cn'

// const baseUrl = 'http://192.168.3.8/'
//名师
// const token = 'auth_token=ZThkYTJxdEU1Vm1LWmRlUHNDWUxtV1ZhUUU0cU1nUURhaTUrNnUrdHlya3BRV0pja3lYWmYyMDlYeFNIanBXTE92NDdHNmpCZmlQbTdZQWZ4MXM=&'
//管理员
const token = 'auth_token=ZGU1ZXJ2NDMrS2lJekN4Q2duWExlNXMvdVNjbGFZcHVTa1dLN2JlUFljM013b1FVVmcvQ081UWRIRzgzMU12YjhleXNWdTRjNFBrZlhzNA==&'

//const token = ''

export default {
	quillUpLoad: baseUrl + '/api/?method=upload.image',
	upLoadTeacherImg: baseUrl +  '/api/?'+token+'method=teacher.saveHeadImg',
	upLoadArticleImg: baseUrl + '/api/?'+token+'method=article.uploadCover',
	upLoadAdvImg: baseUrl + '/api/?'+token+'method=advertise.saveCover'
}