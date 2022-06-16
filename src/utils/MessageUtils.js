import { Message, MessageBox } from 'element-ui';
var MessageUtils = {
    //成功提示信息
    success(text = '操作成功！') {
        Message({
            message: text,
            type: 'success',
            duration: 3 * 1000
        })
    },
    //错误提示信息
    error(text = '操作失败！') {
        Message({
            message: text,
            type: 'error',
            duration: 3 * 1000
        })
    },
    //成功提示信息
    info(text = '操作成功！') {
        Message({
            message: text,
            type: 'info',
            duration: 3 * 1000
        })
    },
    //警告提示信息
    warning(text = '警告信息') {
        Message({
            message: text,
            type: 'warning',
            duration: 3 * 1000
        })
    },
    //确定提示框
    confirm(text) {
        return new Promise((resolve, reject) => {
            MessageBox.confirm(text, '系统提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                resolve(true)
            }).catch(() => {
                Message.warning('已取消')
                reject(false); 
            })
        }).catch(() => {

        })
    }
}
export default MessageUtils;