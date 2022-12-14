<template>
	<view class="container" style="padding:20rpx;">
		<view style="padding-bottom: 100rpx;">
			<view class="bg-white">
				<view class="section">
					<!-- store info begin -->
					<list-cell :hover="false">
						<view class="w-100 d-flex align-items-center">
							<view class="d-flex flex-column w-60">
								<view class="w-100 font-size-lg text-color-base text-truncate mb-10">
									{{ '台江万达店' }}
								</view>
								<view class="w-100 d-flex align-items-center overflow-hidden">
									<image src="/static/images/order/location.png" class="flex-shrink-0"
										style="width: 30rpx; height: 30rpx;"></image>
									<view class="text-truncate font-size-sm text-color-assist">{{ '福州市台江区万达广场' }}
									</view>
								</view>
							</view>
							<view class="d-flex justify-content-end align-items-center w-40">
								<image src="/static/images/order/mobile.png"
									style="width: 60rpx; height: 60rpx;margin-right: 30rpx;"></image>
								<image src="/static/images/order/navigation.png" style="width: 60rpx; height: 60rpx;">
								</image>
							</view>
						</view>
					</list-cell>
					<!-- store info end -->
					<!-- goods begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column position-relative" style="margin-bottom: -40rpx;">
							<view class="w-100 d-flex align-items-center mb-40"
								v-for="(good, index) in order.ordersList" :key="index">
								<view class="d-flex flex-column w-60 overflow-hidden">
									<view class="font-size-lg text-color-base mb-10 text-truncate">{{ good.name }}
									</view>
									<view class="font-size-sm text-color-assist text-truncate">{{ good.dishFlavor }}
									</view>
								</view>
								<view class="d-flex w-40 align-items-center justify-content-between pl-30">
									<view class="font-size-base text-color-base">x{{ good.number }}</view>
									<view class="font-size-base text-color-base font-weight-bold">￥{{ good.amount }}
									</view>
								</view>
							</view>
						</view>
					</list-cell>
					<!-- goods end -->
				</view>
				<view class="section">
					<!-- payment and amount begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>支付方式</view>
								<view class="font-weight-bold">{{ order.payMethod ==1 ? '微信' : '支付宝' }}</view>
							</view>
							<view class="pay-cell">
								<view>金额总计</view>
								<view class="font-weight-bold">￥{{ order.amount }}</view>
							</view>
						</view>
					</list-cell>
					<!-- payment and amount end -->
				</view>
				<view class="section">
					<!-- order info begin -->
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>下单时间</view>
								<view class="font-weight-bold">{{ order.orderTime }}</view>
							</view>
							<view class="pay-cell" v-if="order.address!=null">
								<view>收货地址</view>
								<view class="font-weight-bold" style=" overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;">{{ order.address }}</view>
							</view>
							<view class="pay-cell" v-if="order.address!=null">
								<view>收货人</view>
								<view class="font-weight-bold">{{order.consignee+" "+order.phone}}</view>
							</view>
							<view class="pay-cell">
								<view>订单号</view>
								<view class="font-weight-bold">{{ order.number }}</view>
							</view>
						</view>
					</list-cell>
					<!-- order info end -->
				</view>
				<!-- order other info begin -->
				<list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
					<view class="w-100 d-flex flex-column">
						<view class="pay-cell" v-if="order.remark!=''&&order.remark!=null">
							<view style="font-size: 50rpx;">取单号</view>
							<view class="font-weight-bold" style="font-size: 60rpx;">{{ order.remark }}</view>
						</view>
					</view>
				</list-cell>
				<!-- order other info end -->
			</view>

		</view>
		<view class="btn-box">
			<view class="item" v-if="order.invoice_status > 0"><button type="primary">查看发票</button></view>
			<view class="item"><button type="primary" plain @tap="review">去评价</button></view>
			<view class="item"><button type="primary">再来一单</button></view>
		</view>
	</view>
</template>

<script>
	import Orders from '@/api/orders';
	import listCell from '@/components/list-cell/list-cell';

	export default {
		components: {
			listCell
		},
		data() {
			return {
				order: {}
			};
		},
		onLoad({
			id
		}) {
			// console.log(id)
			this.getDetail(id)
			// this.order = Orders.find(item => item.id == id);
		},
		methods: {
			async getDetail(id) {
				const res = await this.$myRequet({
					url: '/order/getDetail',
					method: 'get',
					data: {
						orderid: id
					}
				})
				if (res.data.code == 1) {
					this.order = res.data.data
				}
			},
			review() {
				
				uni.navigateTo({
					url: '/pages/review/review' 
				})
			},
			goToInvoice() {
				uni.navigateTo({
					url: '/pages/invoice/invoice'
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	@mixin arch {
		content: "";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: -15rpx;
		z-index: 10;
		border-radius: 100%;
	}

	.section {
		position: relative;

		&::before {
			@include arch;
			left: -15rpx;
		}

		&::after {
			@include arch;
			right: -15rpx;
		}
	}

	.pay-cell {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: $font-size-base;
		color: $text-color-base;
		margin-bottom: 40rpx;

		&:nth-last-child(1) {
			margin-bottom: 0;
		}
	}

	.invote-box {
		position: absolute;
		width: 100%;
		left: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 30rpx;
			height: 30rpx;
		}
	}

	.btn-box {
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		z-index: 11;

		.item {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 10rpx;
			flex: 1;
			flex-shrink: 0;

			button {
				width: 100%;
				border-radius: 50rem !important;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0;
			}
		}
	}
</style>
