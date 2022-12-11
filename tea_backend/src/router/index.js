import Vue from 'vue'
import Router from 'vue-router'

import login from '../components/login'
import index from '../components/index'
import test from '../components/test'
import mindex from '../components/member/index'
import add from '../components/member/add'
import clist from '../components/category/list'
import flist from '../components/food/list'
import fadd from '../components/food/add'
import combolist from '../components/combo/list'
import comboadd from '../components/combo/add'
Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			component: login
		},
		{
				path: '/login',
				component: login
			},
		{
			path: '/index',
			component: index,
			children: [{
					path: '/member/index',
					component: mindex
				}, {
					path: '/test',
					component: test
				},
				{
					path: '/member/add',

					name: 'madd',
					component: add
				},
				{
					path: '/category/list',
					component: clist
				},
				{
					path: '/food/list',
					component: flist
				}, {
					path: '/food/add',
					name: 'fadd',
					component: fadd
				},{
					path:'/combo/list',
					component:combolist
				},{
					path:'/combo/add',
					name:'comboadd',
					component:comboadd
				}
			]
		},





	]
})
