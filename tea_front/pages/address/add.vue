<template>
	<view class="container">
		<view class="form-box">
			<view class="form">
				<list-cell :hover="false">
					<view class="form-input">
						<view class="label">收货人</view>
						<input class="input" placeholder="请输入收货人" v-model="form.consignee"
							placeholder-class="text-color-assist" />
					</view>
				</list-cell>
				<list-cell :hover="false">
					<view class="form-input">
						<view class="label">性别</view>
						<view class="radio-group">
							<view class="radio" :class="{'checked': form.sex==1}" style="margin-right: 10rpx;"
								@tap="form.sex=1">先生</view>
							<view class="radio" :class="{'checked': form.sex==0}" @tap="form.sex=0">女士</view>
						</view>
					</view>
				</list-cell>
				<list-cell :hover="false">
					<view class="form-input">
						<view class="label">联系方式</view>
						<input class="input" placeholder="请输入收货人联系方式" v-model="form.phone"
							placeholder-class="text-color-assist" />
					</view>
				</list-cell>
				<list-cell :hover="false">
					<view class="form-input">
						<view class="label">收货地址</view>
						<input class="input" placeholder="请选择收货地址" v-model="form.detail"
							placeholder-class="text-color-assist" />
					</view>
				</list-cell>
				<list-cell :hover="false">
					<view class="form-input">
						<view class="label">标签</view>
						<input class="input" placeholder="请标记地址标签" v-model="form.label"
							placeholder-class="text-color-assist" />
					</view>
				</list-cell>
			</view>
			<view class="btn-section">
				<button type="primary" size="default" @tap="save">保存</button>
			</view>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'

	export default {
		components: {
			listCell
		},
		data() {
			return {
				edit: 0,
				form: {
					id: 0,
					consignee: '',
					sex: 0,
					phone: '',
					detail: '',
					label: '',
					userId: 1
				}
			}
		},
		async onLoad({
			id,
			userid
		}) {
			// console.log(id)

			//为了方便演示，这里用本地缓存
			if (id) {
				// this.form = this.$store.state.addresses.find(item => item.id == id)
				this.getAddress(id)
				this.edit = 1
			}
			else{
			this.form.userId=userid	
						// console.log(this.userId)
			}
		
		},
		methods: {

			async getAddress(id) {
				const res = await this.$myRequet({
					url: '/addressBook',
					method: 'get',
					data: {
						id: id
					}

				})
				this.form = res.data.data
				// console.log(this.form.sex)
			},

			async save() {
				console.log(this.form.sex)
				//调用保存接口

				if (this.edit == 1) {
					const res = await this.$myRequet({
						url: '/addressBook',
						method: 'PUT',
						data: {
							id: this.form.id,
							consignee: this.form.consignee,
							sex: this.form.sex,
							phone: this.form.phone,
							detail: this.form.detail,
							label: this.form.label,
							userId: this.form.userId
						}
					})
					if (res.data.code == 1) {
						uni.navigateBack()
					}
				} else {
					const res = await this.$myRequet({
						url: '/addressBook',
						method: 'post',
						data: {
							id: this.form.id,
							consignee: this.form.consignee,
							sex: this.form.sex,
							phone: this.form.phone,
							detail: this.form.detail,
							label: this.form.label,
							userId: this.form.userId
						}
					})
					if (res.data.code == 1) {
						uni.navigateBack()
					}
				}
				// console.log(res.data)


			}
		}
	}
</script>

<style lang="scss" scoped>
	.form-box {
		width: 100%;
		height: 100%;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		color: $text-color-base;

		.form-input {
			display: flex;
			align-items: center;
			width: 100%;
		}

		.label {
			width: 200rpx;
			font-size: $font-size-lg;
			color: $text-color-base;
			font-weight: 500;
		}

		.input {
			flex: 1;
			display: flex;
			align-items: center;
		}

		.radio-group {
			display: flex;
			justify-content: flex-start;

			.radio {
				padding: 10rpx 30rpx;
				border-radius: 6rpx;
				border: 2rpx solid $text-color-assist;
				color: $text-color-assist;
				font-size: $font-size-base;

				&.checked {
					background-color: $color-primary;
					color: $text-color-white;
					border: 2rpx solid $color-primary;
				}
			}
		}

		.btn-section {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;

			button {
				font-size: $font-size-base;
				height: 90rpx;
				border-radius: 50rem !important;
				width: 85%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
