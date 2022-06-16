import http from '../http/request'

export function readFile(file){
    return new Promise(resolve =>{
        let reader =new FileReader();
        reader.readAsBinaryString(file);
        reader.onload= ev =>{
            resolve(ev.target.result);
        };
    });
}

export async function getbrowlistApi(parm){
    return await http.get("/api/datas/getbrowlist",parm)}


// export async function getexcellistApi(parm){
//         return await http.get("/api/datas/exceldown",parm)}