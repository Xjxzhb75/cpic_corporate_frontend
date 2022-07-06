
import { getDeptByUserIdApi} from '../../api/department'
export default {
  namespaced: true,
    state: {
        loginName:'',
        deptList:[],   
    },
    //修改state的函数事件
    mutations: {
     getloginName(state){
       let loginName=sessionStorage.getItem('loginName')
       if(loginName){
        state.loginName=JSON.parse(loginName)
       }
     },
     getdeptList(state){
      let deptList =sessionStorage.getItem('deptList')
      if(deptList){
        state.deptList=JSON.parse(deptList)
      }
     },
     setloginInfo(state,loginName){
         state.loginName=loginName;
         sessionStorage.setItem('loginName',JSON.stringify(state.loginName))
     },
     setdeptList(state,list){
      state.deptList =list;
     }
    },
    actions:{
      async getDeptByUserId({ commit },parm){
        let {data:res} =await getDeptByUserIdApi(parm);
        commit('setdeptList',res.data)
        sessionStorage.setItem('deptList',JSON.stringify(res.data))
      }
    }
   }
    
    
