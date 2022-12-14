<template>
	<view class="container">
		<view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
               
				<view v-if="orders.length<1" class="d-flex w-100 h-100 flex-column just-content-center align-items-center">
					<image src="/static/images/loading.gif" class="drinks-img"></image>
					<view class="tips d-flex flex-column align-items-center font-size-base text-color-assist">
						<view>您还没有点单</view>
						<view>快去犒劳一下自己吧~</view>
					</view>
					<button type="primary" class="drink-btn" size="default" @tap="menu">去点餐</button>
				</view>
			<view class="order-item" v-for="(item, index) in orders" :key="index" style="margin-bottom: 30rpx;"
				@tap="detail(item.number)">
				<list-cell :hover="false">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column" style="width: 70%;">
							<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;">
								{{ item.address==null ? '自取订单' : item.address }}
							</view>
							<view class="font-size-sm text-color-assist">订单编号：{{ item.number }}</view>
						</view>
						<view class="font-size-lg text-color-primary" style="width: 30;">
							{{ item.status==1 ? '待制作' : (item.status==2 ? '待派送' : (item.status ==3 ? '派送中' : (item.status == 4 ? '待取货' : '已完成'))) }}
						</view>
					</view>
				</list-cell>
				<list-cell :hover="false" last>
					<view class="w-100 d-flex flex-column">
						<view class="w-100 text-truncate font-size-lg text-color-base" style="margin-bottom: 20rpx;">
							{{ item.ordersList==null ? '未登录' : orderGoodsName(item.ordersList) }}
						</view>
						<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 30rpx;">
							<view class="font-size-sm text-color-assist">
								{{ item.orderTime }}
							</view>
							<view class="d-flex font-size-sm text-color-base align-items-center">
								<view style="margin-right: 10rpx;">
									共{{ item.ordersList==null ? '未登录' : orderGoodsCount(item.ordersList) }}件商品，实付
								</view>
								<view class="font-size-lg">￥{{ item.amount }}</view>
							</view>
						</view>
						<view class="d-flex align-items-center justify-content-end">

							<view>
								<button type="primary" plain size="mini" @tap.stop="review(item)"
									v-if="item.status==5">去评价</button>
							</view>
						</view>
					</view>
				</list-cell>
			</view>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'
	import {
		mapState,

	} from 'vuex'
	export default {
		components: {
			listCell
		},
		data() {
			return {
				page: 1,
				pageSize: 5,
				orders: []
			}
		},
		computed: {
			...mapState(['member']),

			orderGoodsName() {
				return (goods) => {
					let arr = []
					goods.forEach(good => arr.push(good.name + '*' + good.number))
					return arr.join('，')
				}
			},
			orderGoodsCount() {
				return (goods) => {
					let count = 0
					for (var i = 0; i < goods.length; i++) {
						count = count + goods[i].number
					}
					return count
				}
			}
		},
		onShow() {
			
			
			if (!this.$store.getters.isLogin) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			}
			this.getOrders(false)
		},

		async onLoad() {


		},
		async onReachBottom() {
			await this.getOrders(false)
		},
		async onPullDownRefresh() {
			await this.getOrders(true)
		},
		methods: {
			menu() {
				uni.switchTab({
					url: '/pages/menu/menu'
				})
			},
			async getOrders(isRefresh = false) {
				console.log("被调用")
				uni.showLoading({
					title: '加载中'
				})

				const res = await this.$myRequet({
					url: '/order/getByUser',
					method: 'get',
					data: {
						userid: this.member.customerId
					}
				});
				let orders = {}
				console.log(res.data)
				if (res.data.code == 1) {
					orders = res.data.data
					console.log(orders)

					if (isRefresh) {
						this.orders = []
						this.page = 1
					}
					orders = orders.slice(this.pageSize * (this.page - 1), this.pageSize * this.page)
					if (orders.length) {
						this.orders = this.orders.concat(orders)
						this.page += 1
					}
				}

				uni.hideLoading()
			},
			detail(id) {
				uni.navigateTo({
					url: '/pages/orders/detail?id=' + id
				})
			},
			review(order) {
				const date = order.completed_time.split(' ')[0]
				uni.navigateTo({
					url: '/pages/review/review?storename=' + order.store.name + '&typeCate=' + order.typeCate +
						'&date=' + date
				})
			},
			goToInvoice() {
				uni.navigateTo({
					// url: '/pages/invoice/invoice'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
