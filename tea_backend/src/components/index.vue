<template>
	<div class="app" id="app">
		<div class="app-wrapper openSidebar clearfix">
			<!-- sidebar -->
			<div class="sidebar-container">
				<div class="logo">
					<!-- <img src="images/logo.png" width="122.5" alt="" /> -->
					<img src="../assets/login/logo.png" alt="" style="width: 117px; height: 32px" />
				</div>

				<el-scrollbar wrap-class="scrollbar-wrapper">
					<el-menu :unique-opened="false" :collapse-transition="false" background-color="#343744"
						text-color="#bfcbd9" active-text-color="#f4f4f5">
						<div v-for="item in menuList" :key="item.id">

							<el-submenu :index="item.id" v-if="item.children && item.children.length>0">
								<template slot="title">
									<i :class="item.icon"></i>
									<span>
										{{item.name}}
									</span>
								</template>
								<el-menu-item v-for="sub in item.children" :index="sub.id" :key="sub.id"
									@click="menuHandle(sub,false)">
									<i :class="sub.icon"></i>
									<span slot="title">
										{{sub.name}}
									</span>
								</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="item.id" @click="menuHandle(item,false)">
								<!-- <i class="iconfont" :class="item.icon"></i> -->
								<i class="el-icon-location"></i>
								<span slot="title">{{item.name}}</span>
							</el-menu-item>

						</div>

					</el-menu>

				</el-scrollbar>
			</div>
			<div class="main-container">
				<!-- <navbar /> -->
				<div class="navbar">
					<div class="head-lable" style="display: flex;">
						<span v-if="goBackFlag" class="goBack" @click="goBack()"><img
								src="../assets/icon/btn_back@2x.png" alt="" /> 返回</span>
						<span>{{headTitle}}</span>
					</div>
					<div class="right-menu">
						<div class="avatar-wrapper">{{ userInfo.data.name }}</div>
						<!-- <div class="logout" @click="logout">退出</div> -->
						<img src="../assets/icon/btn_close@2x.png" class="outLogin" alt="退出" @click="logout" />
					</div>
				</div>
				<div class="app-main" v-loading="loading">
					<div class="divTmp" v-show="loading"></div>
					<router-view></router-view>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import {
		logoutApi
	} from '../api/login.js'

	export default {
		name: 'index',
		data() {
			return {
				path: "ws://localhost:8080/webSocket",
				socket: "",
				defAct: '/member/index',
				menuActived: '2',
				userInfo: {},
				menuList: [{
						id: '1',
						name: '门店管理',
						icon: 'el-icon-location',
						children: [{
								id: '2',
								name: '员工管理',
								path: '/member/index',
								icon: 'el-icon-user-solid'
							},
							{
								id: '3',
								name: '分类管理',
								path: '/category/list',
								icon: 'el-icon-menu'
							},
							{
								id: '4',
								name: '菜品管理',
								path: '/food/list',
								icon: 'el-icon-tableware'
							},
							{
								id: '5',
								name: '套餐管理',
								path: '/combo/list',
								icon: 'el-icon-fork-spoon'
							},
						]
					},


					{
						id: '6',
						name: '订单明细',
						path: '/order/list',
						icon: 'el-icon-goods',
						children: [{
							id: '15',
							name: '外卖订单',
							path: '/order/takeout',
							icon: 'el-icon-shopping-cart-2'
						}, {
							id: '22',
							name: '自取订单',
							path: '/order/list',
							icon: 'el-icon-s-order'
						}, ]
					}
					//   ],
					// },
				],
				iframeUrl: '/member/index',
				headTitle: '员工管理',
				goBackFlag: false,
				loading: true,
				timer: null
			}
		},
		computed: {},
		created() {

			const userInfo = window.localStorage.getItem('userInfo')

			if (userInfo) {
				this.userInfo = JSON.parse(userInfo)

			}
			// console.log(this.userInfo)
			this.closeLoading()
			this.init()
		},
		beforeDestroy() {
			this.timer = null
			clearTimeout(this.timer)
		},
		mounted() {
			window.menuHandle = this.menuHandle
		},
		methods: {
			logout() {
				logoutApi().then((res) => {
					if (res.data.code === 1) {
						localStorage.removeItem('userInfo')
						this.$router.push('/login')
					}
				})
			},
			goBack() {
				// window.location.href = 'javascript:history.go(-1)'
				console.log(this.menuActived)
				var menu = {}
				if (this.menuActived < 6) {
					// console.log("你是天才")
					//  console.log(this.menuList[0])
					menu = this.menuList[0].children.find(item => item.id === this.menuActived);

				} else {
					// console.log("你是天天才")
					// console.log(this.menuList[1])
					menu = this.menuList[1].children.find(item => item.id === this.menuActived);

				}

				console.log(menu)
				// this.goBackFlag = false
				// this.headTitle = menu.name
				this.menuHandle(menu, false)
			},
			menuHandle(item, goBackFlag) {
				// console.log(item)
				// console.log("天才")
				this.loading = true
				// this.menuActived = item.id
				// console.log(item.path)
				this.$router.push(item.path)
				this.headTitle = item.name
				this.goBackFlag = goBackFlag
				this.closeLoading()
			},
			closeLoading() {
				this.timer = null
				this.timer = setTimeout(() => {
					this.loading = false
				}, 1000)
			},
			// websocket测试
			init: function() {

				console.log(this.path)
				if (typeof(WebSocket) === "undefined") {
					alert("您的浏览器不支持socket")
				} else {
					// 实例化socket
					this.socket = new WebSocket(this.path)
					// 监听socket连接
					this.socket.onopen = this.open
					// 监听socket错误信息
					this.socket.onerror = this.error
					// 监听socket消息
					this.socket.onmessage = this.getMessage
				}
			},
			open: function() {
				console.log("socket连接成功")
			},
			error: function() {
				console.log("连接错误")
			},
			getMessage: function(msg) {
				console.log(msg.data)
				var audio = new Audio();
				audio.src = "http://localhost:8080/music/welcome.mp3"
				audio.play()

				this.$notify({
					title: '提醒',
					message: '您有一条新订单请及时处理',
					 type: 'warning'
				});
			},
			send: function() {
				let code = 4
				this.socket.send(code)
			},
			close: function() {
				console.log("socket已经关闭")
			},
			destroyed() {
				// 销毁监听
				this.socket.onclose = this.close
			}
		}
	}
</script>


<style scoped>
	@import '../styles/index.css';
	@import '../styles/common.css'

	.body {
		min-width: 1366px;
	}

	.app-main {
		height: calc(100% - 64px);
	}

	.app-main .divTmp {
		width: 100%;
		height: 100%;
	}
</style>
