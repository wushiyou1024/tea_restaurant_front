<template>
	<div id="app">
		<!-- <login></login> -->
		<router-view></router-view>
	</div>
</template>

<script>
	import login from "./components/login.vue"

	export default {
		name: 'app',
		components: {
			"login": login
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
