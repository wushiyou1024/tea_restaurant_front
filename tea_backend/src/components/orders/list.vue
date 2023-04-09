<template>
	<div class="dashboard-container" id="member-app">
		<div class="container" style="height:600px; overflow:auto">
			<div class="tableBar">
				<el-input v-model="input" placeholder="请输入顾客手机号" style="width: 250px" clearable
					@keyup.enter.native="handleQuery">
					<i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer"
						@click="handleQuery"></i>
				</el-input>

			</div>
			<el-table :data="tableData" stripe class="tableBox">
				<el-table-column prop="number" label="订单号"></el-table-column>
				<el-table-column prop="orderTime" label="下单时间"></el-table-column>
				<el-table-column prop="remark" label="取单号"></el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column prop="amount" label="总金额"></el-table-column>

				<el-table-column label="订单状态">
					<template slot-scope="scope">
						{{ String(scope.row.status) === '1' ? '待制作' : (scope.row.status==2 ? '待派送' : (scope.row.status ==3 ? '派送中' : (scope.row.status== 4 ? '待取货' : '已完成'))) }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" class="blueBug" @click="deleteHandle(scope.row.number)"
							:class="{notAdmin:user !== 'admin'}">
							删除
						</el-button>
						<el-button type="text" size="small" class="delBut non" @click="statusHandle(scope.row)">
							{{'更改状态'}}
						</el-button>
						<el-button type="text" size="small" class="delBut non" @click="detail(scope.row)">
							{{'详情'}}
						</el-button>

					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="pageList" :page-sizes="[5,10, 20, 30, 40]" :page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="counts" :current-page.sync="page"
				@size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>



		</div>
		<el-dialog title="当前订单" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="订单状态" :label-width="formLabelWidth">
					<el-select v-model="form.region" placeholder="请选择订单状态" @change="changeStatus">
						<el-option v-for="(item,index) in status" :key='index' :label="item.label" :value="item.value">
						</el-option>

					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit()">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import {
		getTakeout
	} from '../../api/member.js'

	import {
		enableOrDisableEmployee
	} from '../../api/member.js'


	import {
		deleteOrder
	} from '../../api/member.js'

	import {
		editOrder
	} from '../../api/member.js'


	import {
		queryEmployeeById
	} from '../../api/member.js'


	export default {

		name: 'mindex',
		el: '#member-app',
		data() {
			return {
				input: '',
				counts: 0,
				page: 1,
				pageSize: 5,
				tableData: [],
				id: '',
				status: '',
				dialogTableVisible: false,
				dialogFormVisible: false,
				form: {

					region: '',
					number: '',
					value: ''
				},
				status: [{
						label: '待制作',
						value: '1'
					},
					{
						label: '待派送',
						value: '2'
					},
					{
						label: '派送中',
						value: '3'
					},
					{
						label: '待取货',
						value: '4'
					},
					{
						label: '已完成',
						value: '5'
					}
				],
				formLabelWidth: '120px'
			}
		},
		computed: {},
		created() {
			this.init()
			this.user = JSON.parse(localStorage.getItem('userInfo')).data.username
			console.log(this.user)
		},
		mounted() {},
		methods: {
			async init() {
				const params = {
					page: this.page,
					pageSize: this.pageSize,
					phone: this.input ? this.input : undefined
				}
				await getTakeout(params).then(res => {
					console.log(res.data)
					if (String(res.data.code) === '1') {

						this.tableData = res.data.data.records || []
						this.counts = res.data.data.total
					}
				}).catch(err => {
					console.log(111)
					this.$message.error('请求出错了：' + err)
				})
			},
			handleQuery() {
				this.page = 1;
				this.init();
			},
			submit() {
				// console.log(this.form.value)
				// console.log(this.form.number)
				editOrder({
					number: this.form.number,
					status: this.form.value
				}).then(res => {
					if (res.data.code == 1) {
						this.$message.success('状态更新成功！');

						this.dialogFormVisible = false
						this.init()
					}
				})
			},
			deleteHandle(id) {
				// console.log(id)
				this.$confirm('确认调整该账号的状态?', '提示', {
					'confirmButtonText': '确定',
					'cancelButtonText': '取消',
					'type': 'warning'
				}).then(() => {
					deleteOrder(
						id
					).then(res => {
						if (String(res.data.code) === '1') {
							this.$message.success('删除成功！')
							this.handleQuery()
						}
					})
				})
			},
			//状态修改
			statusHandle(row) {

				this.dialogFormVisible = true
				this.form.number = row.number
			},
			detail(row) {
				this.$router.push({
					path: '/order/detail',
					name: 'orderDetail',
					params: {
						id: row.number,
						type:1
					}
				})
			},
			changeStatus(value) {
				//             console.log(this.status.label)
				// console.log(this.status.value)
				console.log(value)
				this.form.value = value
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.init()
			},
			handleCurrentChange(val) {
				this.page = val
				this.init()
			}
		}
	}
</script>


<style scoped>
	@import '../../styles/common.css';
	@import '../../styles/page.css';

	#member-app .notAdmin::after {
		border: 0 !important;

	}
</style>
