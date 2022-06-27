

export default {
  namespaced: true,
    state: {
        loginName:''
      
    },
    //修改state的函数事件
    mutations: {
     setloginInfo(state,loginName){
         state.loginName=loginName;
     }
    },
   }
    
    
