<template>
	<div class="dashboard-container" id="food-app">
	<div class="container" style="height:600px; overflow:auto">
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="name" label="菜名" width="180">
			</el-table-column>
			<el-table-column prop="image" label="图片" align="center">
				<template slot-scope="{ row }">
					<el-image style="width: auto; height: 40px; border:none;cursor: pointer;" :src="getImage(row.image)"
						>
						<div slot="error" class="image-slot">
							<img src="../../assets/noImg.png" style="width: auto; height: 40px; border:none;">
						</div>
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="dishFlavor" label="口味" >
			</el-table-column>
			<el-table-column prop="number" label="数量">
			</el-table-column>
			<el-table-column prop="amount" label="单价">
			</el-table-column>
		</el-table>
	</div>
 </div>
</template>

<script>
	import {
		queryOrderById
	} from '../../api/order.js'
	export default {
		data() {
			return {
				id: '',
				tableData: []
			}
		},
		created() {
			this.id = this.$route.params.id
			console.log(this.id)
			this.$parent.goBackFlag = true;
			
	 if(		 this.$route.params.type==1){
		 
		 			this.$parent.menuActived = '22'
	 }
	 else{
		 
		 			this.$parent.menuActived = '15'
	 }
			this.init()
		},
		methods: {
			async init() {
				await queryOrderById(this.id).then(res => {
					if (res.data.code == 1) {
						this.tableData = res.data.data
					}
				})
			},
			getImage(image) {
				console.log('图片获取被调用')
				console.log(image)
				return `/api/common/download?name=${image}`
			},
		}
	}
</script>

<style>
</style>
