<template>
	<div class="dashboard-container" id="member-app">
		<div class="container" style="height:600px; overflow:auto">
			<div class="tableBar">
				<el-input v-model="input" placeholder="请输入员工姓名" style="width: 250px" clearable
					@keyup.enter.native="handleQuery">
					<i slot="prefix" class="el-input__icon el-icon-search" style="cursor: pointer"
						@click="handleQuery"></i>
				</el-input>
				<el-button type="primary" @click="addMemberHandle('add')">
					+ 添加员工
				</el-button>
			</div>
			<el-table :data="tableData" stripe class="tableBox">
				<el-table-column prop="name" label="员工姓名"></el-table-column>
				<el-table-column prop="username" label="账号"></el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column label="账号状态">
					<template slot-scope="scope">
						{{ String(scope.row.status) === '0' ? '已禁用' : '正常' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="160" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" class="blueBug" @click="addMemberHandle(scope.row.id)"
							:class="{notAdmin:user !== 'admin'}">
							编辑
						</el-button>
						<el-button type="text" size="small" class="delBut non" @click="statusHandle(scope.row)"
							v-if="user === 'admin'">
							{{ scope.row.status == '1' ? '禁用' : '启用' }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="pageList" :page-sizes="[5,10, 20, 30, 40]" :page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper" :total="counts" :current-page.sync="page"
				@size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
		</div>
	</div>
</template>

<script>
	import {
		getMemberList
	} from '../../api/member.js'

	import {
		enableOrDisableEmployee
	} from '../../api/member.js'


	import {
		addEmployee
	} from '../../api/member.js'

	import {
		editEmployee
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
			}
		},
		computed: {},
		created() {
			this.init()
			this.user = JSON.parse(localStorage.getItem('userInfo')).data.username
			// console.log(this.user)
		},
		mounted() {},
		methods: {
			async init() {
				const params = {
					page: this.page,
					pageSize: this.pageSize,
					name: this.input ? this.input : undefined
				}
				await getMemberList(params).then(res => {
					// console.log(res.data)
					if (String(res.data.code) === '1') {

						this.tableData = res.data.data.records || []
						this.counts = res.data.data.total
					}
				}).catch(err => {
					// console.log(111)
					this.$message.error('请求出错了：' + err)
				})
			},
			handleQuery() {
				this.page = 1;
				this.init();
			},
			// 添加
			addMemberHandle(st) {
				if (st === 'add') {
					//进行路由
					this.$router.push({
						path: '/member/add'
					})

				} else {

					this.$router.push({
						path: '/member/add',
						name: 'madd',
						params: {
							id: st
						}
					})
				}
			},
			//状态修改
			statusHandle(row) {
				this.id = row.id
				this.status = row.status
				this.$confirm('确认调整该账号的状态?', '提示', {
					'confirmButtonText': '确定',
					'cancelButtonText': '取消',
					'type': 'warning'
				}).then(() => {
					enableOrDisableEmployee({
						'id': this.id,
						'status': !this.status ? 1 : 0
					}).then(res => {
						// console.log('enableOrDisableEmployee', res)
						if (String(res.data.code) === '1') {
							this.$message.success('账号状态更改成功！')
							this.handleQuery()
						}
					}).catch(err => {
						this.$message.error('请求出错了：' + err)
					})
				})
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
