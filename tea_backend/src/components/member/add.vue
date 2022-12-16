<template>
	<div class="addBrand-container" id="member-add-app">
		<div class="container">
			<el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="false" label-width="180px"
				class="demo-ruleForm">
				<el-form-item label="账号:" prop="username">
					<el-input v-model="ruleForm.username" placeholder="请输入账号" maxlength="20" style="float: left;"/>
				</el-form-item>
				<el-form-item label="员工姓名:" prop="name">
					<el-input v-model="ruleForm.name" placeholder="请输入员工姓名" maxlength="20" style="float: left;"/>
				</el-form-item>

				<el-form-item label="手机号:" prop="phone">
					<el-input v-model="ruleForm.phone" placeholder="请输入手机号" maxlength="20" style="float: left;"/>
				</el-form-item>
				<el-form-item label="性别:" prop="sex">
					<el-radio-group v-model="ruleForm.sex" style="float: left;">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="身份证号:" prop="idNumber">
					<el-input v-model="ruleForm.idNumber" placeholder="请输入身份证号" maxlength="20" style="float: left;"/>
				</el-form-item>
				<div class="subBox address">
					<el-form-item>
						<el-button @click="goBack()">
							取消
						</el-button>
						<el-button type="primary" @click="submitForm('ruleForm', false)">
							保存
						</el-button>
						<el-button v-if="actionType == 'add'" type="primary" class="continue"
							@click="submitForm('ruleForm', true)">
							保存并继续添加
						</el-button>
					</el-form-item>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
	import {
		queryEmployeeById
	} from '../../api/member.js'
	import {
		validate
	} from '../../api/validate.js'

	import {
		checkUserName
	} from '../../api/validate.js'


	import {
		checkName
	} from '../../api/validate.js'


	import {
		checkPhone
	} from '../../api/validate.js'


	import {
		validID
	} from '../../api/validate.js'

	import {
		addEmployee
	} from '../../api/member.js'
	import {
		editEmployee
	} from '../../api/member.js'
	export default {
		name: 'add',
		el: '#member-add-app',
		data() {
			return {
				id: '',
				actionType: '',
				ruleForm: {
					'name': '',
					'phone': '',
					'sex': '男',
					'idNumber': '',
					username: ''
				}
			}
		},
		computed: {
			rules() {
				return {
					//账号
					username: [{
						required: true,
						'validator': checkUserName,
						trigger: 'blur'
					}],
					//姓名
					name: [{
						required: true,
						'validator': checkName,
						'trigger': 'blur'
					}],
					'phone': [{
						'required': true,
						'validator': checkPhone,
						'trigger': 'blur'
					}],
					'idNumber': [{
						'required': true,
						'validator': validID,
						'trigger': 'blur'
					}]
				}
			}
		},
		created() {
			this.$parent.menuActived='2'
			this.id = this.$route.params.id
			console.log(this.id)
			this.actionType = this.id ? 'edit' : 'add'
			this.$parent.goBackFlag = true;
			if (this.id) {
				this.init()
			}
		},
		mounted() {},
		methods: {
			async init() {

				// console.log(this.$parent.goBackFlag)
				queryEmployeeById(this.id).then(res => {
					console.log(res)
					if (String(res.data.code) === '1') {
						console.log(res.data)
						this.ruleForm = res.data.data
						this.ruleForm.sex = res.data.data.sex === '0' ? '女' : '男'
						// this.ruleForm.password = ''
					} else {
						this.$message.error(res.msg || '操作失败')
					}
				})
			},
			submitForm(formName, st) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.actionType === 'add') {
							const params = {
								...this.ruleForm,
								sex: this.ruleForm.sex === '女' ? '0' : '1'
							}
							addEmployee(params).then(res => {
								if (res.data.code === 1) {
									this.$message.success('员工添加成功！')
									if (!st) {
										this.goBack()
									} else {
										this.ruleForm = {
											username: '',
											'name': '',
											'phone': '',
											// 'password': '',
											// 'rePassword': '',/
											'sex': '男',
											'idNumber': ''
										}
									}
								} else {
									this.$message.error(res.msg || '操作失败')
								}
							}).catch(err => {
								this.$message.error('请求出错了：' + err)
							})
						} else {
							const params = {
								...this.ruleForm,
								sex: this.ruleForm.sex === '女' ? '0' : '1'
							}
							editEmployee(params).then(res => {
								if (res.data.code === 1) {
									this.$message.success('员工信息修改成功！')
									this.goBack()
								} else {
									this.$message.error(res.msg || '操作失败')
								}
							}).catch(err => {
								this.$message.error('请求出错了：' + err)
							})
						}
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			goBack() {
				this.$parent.goBackFlag=false;
				this.$router.push({
					path: '/member/index'
				})
			}
		}
	}
</script>

<style scoped>
	/* @import '../../styles/elmentui/index.css'; */
	@import '../../styles/common.css';
	@import '../../styles/page.css';
</style>
