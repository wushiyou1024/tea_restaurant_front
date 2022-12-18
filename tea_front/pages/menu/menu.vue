<template>
	<view class="container" v-if="!loading">
		<view class="main" v-if="goods.length">
			<view class="nav">
				<view class="header">
					<view class="left" v-if="orderType == 'takein'">
						<view class="store-name">
							<text>{{ store.name }}</text>
							<view class="iconfont iconarrow-right"></view>
						</view>
						<view class="store-location">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;"
								class="mr-10"></image>
							<text>距离您 {{ store.distance_text }}</text>
						</view>
					</view>
					<view class="left overflow-hidden" v-else>
						<view class="d-flex align-items-center overflow-hidden">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;"
								class="mr-10"></image>
							<view class="font-size-extra-lg text-color-base font-weight-bold text-truncate">
								{{ address.detail }}
							</view>
						</view>
						<view class="font-size-sm text-color-assist overflow-hidden text-truncate">
							由<text class="text-color-base" style="margin: 0 10rpx">{{ store.name }}</text>配送
						</view>
					</view>
					<view class="right">
						<view class="dinein" :class="{active: orderType == 'takein'}" @tap="SET_ORDER_TYPE('takein')">
							<text>自取</text>
						</view>
						<view class="takeout" :class="{active: orderType == 'takeout'}" @tap="takout">
							<text>外卖</text>
						</view>
					</view>
				</view>
				<view class="coupon">
					<text class="title">"霸气mini卡"超级购券活动，赶紧去购买</text>
					<view class="iconfont iconarrow-right"></view>
				</view>
			</view>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view class="menu" :id="`menu-${item.id}`" :class="{'current': item.id == currentCateId}"
							v-for="(item, index) in indexCategory" :key="index" @tap="handleMenuTap(item.id,item.type)">
							<text>{{ item.name }}</text>
							<!-- <view class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</view> -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list begin -->
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop"
					@scroll="handleGoodsScroll">
					<view class="wrapper">
						<swiper class="ads" id="ads" autoplay :interval="3000" indicator-dots>
							<swiper-item v-for="(item, index) in ads" :key='index'>
								<image :src="item.image"></image>
							</swiper-item>
						</swiper>
						<view class="list">
							<!-- category begin -->
							<view class="category" v-for="(item, index) in currentGoods" :key="index" :id="item.id">
								<view class="title">
									<text>{{ item.name }}</text>
									<!-- 	<image :src="item.icon" class="icon"></image> -->
								</view>
								<view class="items">
									<!-- 商品 begin -->
									<view class="good">
										<image :src="'http://192.168.0.108:8080/common/download?name='+item.image"
											class="image" @tap="showGoodDetailModal(item, good)">
										</image>
										<view class="right">
											<text class="name">{{ item.name }}</text>
											<text class="tips">{{ item.description }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ item.price}}</text>
												<view class="btn-group" v-if="item.flavors && item.flavors.length!=0">
													<button type="primary" class="btn property_btn" hover-class="none"
														size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(item.id)">
														{{ goodCartNum(item.id) }}
													</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(item.id)" plain
														class="btn reduce_btn" size="mini" hover-class="none"
														@tap="handleReduceFromCart(item, good)">
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(item.id)">
														{{ goodCartNum(item.id) }}
													</view>
													<button type="primary" class="btn add_btn" size="min"
														hover-class="none" @tap="handleAddToCart(item, item, 1)">
														<view class="iconfont iconadd-select"></view>
													</button>
												</view>
											</view>
										</view>
									</view>
									<!-- 商品 end -->
								</view>
							</view>
							<!-- category end -->
						</view>
					</view>
				</scroll-view>
				<!-- goods list end -->
			</view>
			<!-- content end -->
			<!-- 购物车栏 begin -->
			<view class="cart-box" v-if="cart.length > 0">
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ getCartGoodsNumber }}</view>
				</view>
				<view class="price">￥{{ getCartGoodsPrice }}</view>
				<button type="primary" class="pay-btn" @tap="toPay" :disabled="disabledPay">
					{{ disabledPay ? `差${spread}元起送` : '去结算' }}
				</button>
			</view>
			<!-- 购物车栏 end -->
		</view>
		<!-- 商品详情模态框 begin -->
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" width="90%" custom
			padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="good.image" :src="'http://192.168.0.108:8080/common/download?name='+good.image" class="image">
				</image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.name }}</view>
						<view class="tips">{{ good.description }}</view>
					</view>
					<view class="properties">
						<view class="property" v-for="(item, index) in good.flavors" :key="index">
							<view class="title">
								<text class="name">{{ item.name }}</text>
								<!-- <view class="desc" v-if="item.desc">({{ item.desc }})</view> -->
							</view>
							<view class="values">
								<!-- 11月25 -->
								<view class="value" v-for="(value, key) in item.values   " :key="key"
									:class="{'default': value.is_default}" @tap="changePropertyDefault(index, key)">
									{{ value.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">￥{{ good.price}}</view>
					<view class="props">
						{{ getGoodSelectedProps(good) }}
					</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" @tap="handlePropertyReduce">
						<view class="iconfont iconsami-select"></view>
					</button>
					<view class="number">{{ good.number }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" @tap="handlePropertyAdd">
						<view class="iconfont iconadd-select"></view>
					</button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal">
				<view>加入购物车</view>
			</view>
		</modal>
		<!-- 商品详情模态框 end -->
		<!-- 购物车详情popup -->
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template slot="content">
				<view class="top">
					<text @tap="handleCartClear">清空</text>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cart" :key="index">
							<view class="left">
								<view class="name">{{ item.name }}</view>
								<view class="props">{{ item.dishFlavor }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.amount }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none"
									@tap="handleCartItemReduce(index)">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">{{ item.number }}</view>
								<button type="primary" class="btn" size="min" hover-class="none"
									@tap="handleCartItemAdd(index)">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
						<view class="item" v-if="orderType == 'takeout' && store.packing_fee">
							<view class="left">
								<view class="name">包装费</view>
							</view>
							<view class="center">
								<text>￥{{ parseFloat(store.packing_fee) }}</text>
							</view>
							<view class="right invisible">
								<button type="default" plain size="mini" class="btn" hover-class="none">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">1</view>
								<button type="primary" class="btn" size="min" hover-class="none">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup-layer>
		<!-- 购物车详情popup -->
	</view>
	<view class="loading" v-else>
		<image src="/static/images/loading.gif"></image>
	</view>
</template>

<script>
	import modal from '@/components/modal/modal'
	import popupLayer from '@/components/popup-layer/popup-layer'
	import {
		mapState,
		mapMutations,
		mapActions,
		mapGetters
	} from 'vuex'

	export default {
		components: {
			modal,
			popupLayer
		},
		data() {
			return {
				defaultflag: 0,
				goods: [], //所有商品
				indexCategory: [],
				ads: [{
						image: 'https://img-shop.qmimg.cn/s23107/2020/04/27/4ebdb582a5185358c4.jpg?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://images.qmai.cn/s23107/2020/05/08/c25de6ef72d2890630.png?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://img-shop.qmimg.cn/s23107/2020/04/10/add546c1b1561f880d.jpg?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://images.qmai.cn/s23107/2020/04/30/b3af19e0de8ed42f61.jpg?imageView2/2/w/600/h/600'
					},
					{
						image: 'https://img-shop.qmimg.cn/s23107/2020/04/17/8aeb78516d63864420.jpg?imageView2/2/w/600/h/600'
					}
				],
				loading: true,
				currentCateId: 1397844263642378242, //默认分类

				cateScrollTop: 0,
				menuScrollIntoView: '',
				cart: [], //购物车
				goodDetailModalVisible: false, //是否饮品详情模态框
				good: {}, //当前饮品
				category: {}, //当前饮品所在分类
				cartPopupVisible: false,
				sizeCalcState: false,
				currentGoods: [],
				obj: {},
				test: [],

			}
		},

		async onLoad() {
			await this.init()

		},
		onShow() {

			this.getCart()

		},
		computed: {

			...mapState(['member']),
			...mapState(['orderType', 'address', 'store']),
			...mapGetters(['isLogin']),
			goodCartNum() {
				// console.log(this.cart)

				//计算单个饮品添加到购物车的数量
				return (id) => this.cart.reduce((acc, cur) => {
					// console.log(id)
					if (cur.dishId === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
			},
			menuCartNum() {
				return (id) => this.cart.reduce((acc, cur) => {
					if (cur.cate_id === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
			},
			getCartGoodsNumber() { //计算购物车总数
				return this.cart.reduce((acc, cur) => acc + cur.number, 0)
			},
			getCartGoodsPrice() { //计算购物车总价
				return this.cart.reduce((acc, cur) => acc + cur.number * (cur.amount), 0)
			},
			disabledPay() { //是否达到起送价
				return this.orderType == 'takeout' && (this.getCartGoodsPrice < this.store.min_price) ? true : false
			},
			spread() { //差多少元起送
				if (this.orderType != 'takeout') return
				return parseFloat((this.store.min_price - this.getCartGoodsPrice).toFixed(2))
			}
		},
		methods: {
			...mapMutations(['SET_ORDER_TYPE']),
			...mapActions(['getStore']),


			async getCart() {
				const res = await this.$myRequet({
					url: '/shoppingCart/list',
					method: 'get',
					data: {
						userid: this.member.customerId
					}
				})
				if (res.data.code == 1) {
					this.cart = res.data.data
				}

				console.log(this.cart)
			},

			async init() { //页面初始化
				this.loading = true
				await this.getStore()
				var id = '1397844263642378242'

				await this.getGoodsByCategory(id)
				// this.currentGoods=[...this.currentGoods,]	
				const res = await this.$myRequet({
					url: '/category/list',
					method: 'get'
				})
				this.indexCategory = [...this.indexCategory, ...res.data.data]

				// console.log(res.data.data)
				this.goods = await this.$api('goods')
				this.loading = false

				// this.cart = uni.getStorageSync('cart') || []
				// console.log(this.cart);
			},
			takout() {
				if (this.orderType == 'takeout') return

				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
				}

				uni.navigateTo({
					url: '/pages/address/address?is_choose=true'
				})
			},
			handleMenuTap(id, type) { //点击菜单项事件
				// if (!this.sizeCalcState) {
				// 	this.calcSize()
				// }
				if (type === 1) {
					this.getGoodsByCategory(id)
				} else {
					this.getsetmealByCategory(id)
				}
				this.currentCateId = id


				// this.$nextTick(() => this.cateScrollTop = this.goods.find(item => item.id == id).top)
			},
			async getsetmealByCategory(id) {


				const res = await this.$myRequet({
					url: '/setmeal/list?categoryId=' + id + '&status=1',
					method: 'get'
				})

				this.currentGoods = res.data.data;

			},
			async getGoodsByCategory(id) {


				const res = await this.$myRequet({
					url: '/dish/list?categoryId=' + id + '&status=1'
				})

				this.currentGoods = res.data.data;
			},
			handleGoodsScroll({
				detail
			}) { //商品列表滚动事件
				if (!this.sizeCalcState) {
					this.calcSize()
				}
				const {
					scrollTop
				} = detail
				let tabs = this.goods.filter(item => item.top <= scrollTop).reverse()
				if (tabs.length > 0) {
					this.currentCateId = tabs[0].id
				}
			},
			calcSize() {
				// let h = 10

				// let view = uni.createSelectorQuery().select('#ads')
				// view.fields({
				// 	size: true
				// }, data => {
				// 	h += Math.floor(data.height)
				// }).exec()

				// this.goods.forEach(item => {
				// 	let view = uni.createSelectorQuery().select(`#cate-${item.id}`)
				// 	view.fields({
				// 		size: true
				// 	}, data => {
				// 		item.top = h
				// 		h += data.height
				// 		item.bottom = h
				// 	}).exec()
				// })
				// this.sizeCalcState = true
			},
			async handleAddToCart(cate, good, num) { //添加到购物车
				// console.log("----------------------")

				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
				}
				console.log(good)
				const index = this.cart.findIndex(item => {
					if (good.use_property) {
						return (item.id === good.id) && (item.props_text === good.props_text)
					} else {
						return item.id === good.id
					}
				})
				if (index > -1) {
					this.cart[index].number += num
				} else {
					// this.cart.push({
					// 	id: good.id,
					// 	cate_id: cate.id,
					// 	name: good.name,
					// 	price: good.price,
					// 	number: num,
					// 	image: good.images,
					// 	use_property: good.use_property,
					// 	props_text: good.props_text,
					// 	props: good.props
					// })

					const res = await this.$myRequet({
						url: '/shoppingCart/add',
						method: 'post',
						data: {
							name: good.name,
							image: good.image,
							userId: this.member.customerId,
							dishId: good.id,

							dishFlavor: good.props_text,
							number: num,
							amount: good.price
						}
					})
					// console.log(res.data)
					if (res.data.code == 1) {

						var flag = 1;
						for (var i = 0; i < this.cart.length; i++) {
							if ((this.cart[i].dishId == good.id) || (this.cart[i].setmealId == good.id)) {
								this.cart[i].number = this.cart[i].number + 1;
								flag = 0;
								break;
							}
						}
						if (flag == 1) {
							this.cart.push({
						 	name: good.name,
								image: good.image,
								userId: this.member.customerId,
								dishId: good.id,

								dishFlavor: good.props_text,
								number: num,
								amount: good.price
							})
						}
						// console.log("success")
					}
					// console.log(this.cart)
				}
			},
			handleReduceFromCart(item, good) {
				const index = this.cart.findIndex(item => item.id === good.id)
				this.cart[index].number -= 1
				if (this.cart[index].number <= 0) {
					this.cart.splice(index, 1)
				}
			},
			showGoodDetailModal(item, good) {

				this.good = JSON.parse(JSON.stringify({
					...item,
					number: 1
				}))
				// console.log("初始化了good")
				// console.log(this.good)
				for (var i = 0; i < this.good.flavors.length; i++) {
					var arr = JSON.parse(this.good.flavors[i].value)

					var list = []
					var values = []
					for (var j = 0; j < arr.length; j++) {
						const obj = {
							is_default: 0,
							value: arr[j]
						};
						this.obj = obj
						list.push(this.obj)
					}
					this.good.flavors[i].values = list

				}

				// console.log(this.good.flavors)

				this.category = JSON.parse(JSON.stringify(item))
				this.goodDetailModalVisible = true
			},
			closeGoodDetailModal() { //关闭饮品详情模态框
				this.goodDetailModalVisible = false
				this.category = {}
				this.good = {}
			},
			changePropertyDefault(index, key) { //改变默认属性值
				this.good.flavors[index].values.forEach(value => this.$set(value, 'is_default', 0))
				// console.log(this.good)
				// console.log(good.property)
				this.good.flavors[index].values[key].is_default = 1
				this.good.number = 1

				// //             this.test=good
				// // for(var i =0;i<this.test.flavors.length;i++){
				// //  this.test.flavors[i].flag=value
				// //  console.log(this.test.flavors[i].flag)
				// // }
				// console.log(good)
				// this.test = JSON.parse(good.flavors[0].value)
				// console.log(this.test == value)
				// // item.dishFlavor=value
				// // console.log(item.dishFlavor==value)
			},
			getGoodSelectedProps(good, type = 'text') { //计算当前饮品所选属性
				if (good.flavors) {
					// console.log(good.flavors)
					let props = []
					good.flavors.forEach(({
						values
					}) => {
						values.forEach(value => {
							if (value.is_default) {
								props.push(type === 'text' ? value.value : value.id)
							}
						})
					})
					return type === 'text' ? props.join('，') : props
				}
				// console.log("000000000000")
				return ''
			},
			handlePropertyAdd() {
				this.good.number += 1
			},
			handlePropertyReduce() {
				if (this.good.number === 1) return
				this.good.number -= 1
			},
			handleAddToCartInModal() {
				const product = Object.assign({}, this.good, {
					props_text: this.getGoodSelectedProps(this.good),
					props: this.getGoodSelectedProps(this.good, 'id')
				})

				this.handleAddToCart(this.category, product, this.good.number)
				this.closeGoodDetailModal()
			},
			openCartPopup() { //打开/关闭购物车列表popup
				this.cartPopupVisible = !this.cartPopupVisible
			},
			handleCartClear() { //清空购物车
				uni.showModal({
					title: '提示',
					content: '确定清空购物车么',
					success: ({
						confirm
					}) => {
						if (confirm) {

							this.cartPopupVisible = false
							// console.log(this.member.customerId)
							this.$myRequet({
								url: '/shoppingCart/clean',
								method: 'DELETE',
								data: {
									userId: this.member.customerId
								}
							})
							this.cart = []
						}
					}
				})
			},
			handleCartItemAdd(index) {
				this.cart[index].number += 1
			},
			handleCartItemReduce(index) {
				if (this.cart[index].number === 1) {
					this.cart.splice(index, 1)
				} else {
					this.cart[index].number -= 1
				}
				if (!this.cart.length) {
					this.cartPopupVisible = false
				}
			},
			toPay() {
				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
				}

				uni.showLoading({
					title: '加载中'
				})
				uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)))

				uni.navigateTo({
					url: '/pages/pay/pay'
				})
				uni.hideLoading()
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import '~@/pages/menu/menu.scss';
</style>
