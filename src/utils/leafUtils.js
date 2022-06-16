//循环菜单，判断是否是末级
export default function leafUtils() {
    const setLeaf = (arr) =>{
        if(arr && arr.length >0){
            for(let i =0;i < arr.length;i++){
                //如果长度大于0，说明还有下级；就不是末级
                if(arr[i].children && arr[i].children.length > 0){
                    arr[i].open = false;
                    setLeaf(arr[i].children)
                }else{
                    arr[i].open = true;
                }
            }
        }
        return arr
    }
    return{
        setLeaf
    }
}