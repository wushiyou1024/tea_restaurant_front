<template>
	<view class="container d-flex flex-column">
		<view class="flex-fill form">
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">昵称</view>
					<view class="input flex-fill">
						<input type="text" placeholder="请填写昵称" placeholder-class="text-color-assist font-size-base"
							v-model="member.name">
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">手机号码</view>
					<view class="input flex-fill">
						<input type="text" v-model="member.phone" disabled>
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">性别</view>
					<view class="input flex-fill">
						<view class="radio-group">
							<view class="radio" :class="{'checked': member.sex == '1'}" style="margin-right: 10rpx;"
								@tap="member.sex=1">先生</view>
							<view class="radio" :class="{'checked': member.sex == '2'}" @tap="member.sex=2">女士</view>
						</view>
					</view>
				</view>
			</list-cell>

		</view>
		<view class="btn-box d-flex align-items-center just-content-center">
			<button type="primary" class="save-btn" @tap="save">保存</button>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell'
	import {
		mapMutations
	} from 'vuex'

	export default {
		components: {
			listCell
		},
		data() {

			return {
				member: {},

			}
		},
		computed: {

		},
		onLoad() {

			this.getUser();

		},
		methods: {
			...mapMutations(['SET_MEMBER']),
			async getUser() {
				const res = await this.$myRequet({
					url: '/user/getUser',
					method: 'post',
					data: {
						phone: this.$store.state.member.mobilePhone
					}
				});

				this.member = res.data.data;
				// this.SET_MEMBER(this.member)
				console.log(this.member)
			},
			save() {
				// const member = Object.assign(this.$store.state.member, this.member)
				// this.$store.commit('SET_MEMBER', member)
				const res = this.$myRequet({
					url: '/user/save',
					method: 'post',
					data: {
						name: this.member.name,
						sex: this.member.sex,
						phone: this.member.phone
					}
				});
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.container {
		padding: 20rpx 30rpx;
	}

	.form {
		border-radius: 8rpx;
	}

	.form-input {
		.label {
			width: 160rpx;
			font-size: $font-size-base;
			color: $text-color-base;
		}

		.input {}

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
	}

	.btn-box {
		height: calc((100vh - 40rpx) / 2);
	}

	.save-btn {
		width: 90%;
		border-radius: 50rem !important;
		font-size: $font-size-lg;
	}
</style>
