
module.exports = {
  login(u,p){
    let request = require('sync-request');
    let FormData = require('sync-request/lib/FormData')
    let data = new FormData.FormData()
    data.append('username',u)
    data.append('password',p)
    let res = request('POST', 'http://squirrelzoo.com/wp-json/squirrel_shop/v1/user/login',{
      form:data
    });
    res = JSON.parse(new String(res.getBody()))
    if (res.code === 200){
      return res.data.token
    }
    return null
  },
  getList(token){
    let request = require('sync-request');
    let FormData = require('sync-request/lib/FormData')
    let data = new FormData.FormData()
    data.append('page','1')
    data.append('page_size','10')
    let res = request('GET', 'http://squirrelzoo.com/wp-json/squirrel_shop/v1/bitvision/page',{
      form:data,
      headers: {
        'Authorization': token,
      },
    });
    res = JSON.parse(new String(res.getBody()))
    if (res.code === 200){
      return res.data.list
    }
    return []
  },
  getDetail(token,id){

  }
}