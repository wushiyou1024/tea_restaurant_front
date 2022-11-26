const BASE_URL='http://localhost:8080'

export const myRequet = (options)=>{
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL+options.url,
			method:options.method,
			data:options.data,
			success:(res)=>{
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}
