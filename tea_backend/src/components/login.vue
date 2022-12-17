<template>
	<div class="login" id="login-app">
		<div class="login-box">
			<img src="../assets/login/login-l.png" alt="">
			<div class="login-form">
				<el-form ref="loginForm" :model="loginForm" :rules="loginRules">
					<div class="login-form-title">
						<img src="../assets/login/logo.png" style="width:139px;height:42px;" alt="" />
					</div>
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"
							maxlength="20" prefix-icon="iconfont icon-user" />
					</el-form-item>
					<el-form-item prop="password">
						<el-input v-model="loginForm.password" type="password" placeholder="密码"
							prefix-icon="iconfont icon-lock" maxlength="20" @keyup.enter.native="handleLogin" />
					</el-form-item>
					<el-form-item style="width:100%;">
						<el-button :loading="loading" class="login-btn" size="medium" type="primary" style="width:100%;"
							@click.native.prevent="handleLogin">
							<span v-if="!loading">登录</span>
							<span v-else>登录中...</span>
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>




<script>
	import {
		loginApi
	} from '../api/login.js'

	export default {
		name: 'login',
		el: '#login-app',
		data() {
			return {
				
				loginForm: {
					username: 'admin',
					password: '123456'
				},
				loading: false
			}
		},
		computed: {
			loginRules() {
				const validateUsername = (rule, value, callback) => {
					if (value.length < 1) {
						callback(new Error('请输入用户名'))
					} else {
						callback()
					}
				}
				const validatePassword = (rule, value, callback) => {
					if (value.length < 6) {
						callback(new Error('密码必须在6位以上'))
					} else {
						callback()
					}
				}
				return {
					
					'username': [{
						'validator': validateUsername,
						'trigger': 'blur'
					}],
					'password': [{
						'validator': validatePassword,
						'trigger': 'blur'
					}],
	
				}
			}
		},
		created() {},
		methods: {
			async handleLogin() {
				this.$refs.loginForm.validate(async (valid) => {
					if (valid) {
						this.loading = true
						let res = await loginApi(this.loginForm)

						if (String(res.data.code) === '1') {
							console.log("11")
							
							localStorage.setItem('userInfo', JSON.stringify(res.data))
							//进行路由
							this.$router.push({
								path: '/member/index'
							})


						} else {
							console.log("222")
							this.$message.error(res.data.msg)
							this.loading = false
						}
					}
				})
			},
			
		}

	}
</script>

<style scoped>
	/* @import '../styles/common.css'; */
	@import '../styles/login.css';
</style>
