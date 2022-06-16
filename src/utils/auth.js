import Cookies from 'js-cookie'
//定义token的key
const tokenKey = 'token';
//定义用户id的key
const userIdKey = 'userId';
const loginNamekey ='loginName'

//定义过期时间key
const expireTimeKey = 'expireTime'
//设置token到cookies里面
export function setToken(params) {
    return Cookies.set(tokenKey,params)
}
//从cookies里获取token
export function getToken() {
    return Cookies.get(tokenKey)
}
//从cookies里移除token
export function  removeToken() {
    return Cookies.remove(tokenKey)
}
//设置用户id到cookies里面
export function setUserId(params) {
    return Cookies.set(userIdKey,params)
}
//设置用户id到cookies里面
export function setloginName(params) {
    return Cookies.set(loginNamekey,params)
}
//获取用户id
export function getUserId() {
    return Cookies.get(userIdKey)
}
export function getloginName() {
    return Cookies.get(loginNamekey)
}

//移除用户id
export function removeUserId() {
    return Cookies.remove(userIdKey)
}
export function removeloginName() {
    return Cookies.remove(loginNamekey)
}
//清除sessionStorage
export function clearStorage() {
    return sessionStorage.clear();
}
//设置token过期时间
export function setTokenTime(params) {
    return Cookies.set(expireTimeKey,params)
}
//获取token过期时间
export function getTokenTime() {
    return Cookies.get(expireTimeKey)
}
//清空token过期时间
export function removeTokenTime() {
    return Cookies.set(expireTimeKey,0)
}


