<template>
    <div>
     <el-card class="box-card">
       <el-row :gutter="20">
        <el-col :span="5">
       <span class="demonstration"> 机构: </span>
         <el-select v-model="bankvisitdata.deptId" 
         placeholder="请选择机构"  
         size="mini"
         @change="newOpenOption"
        :disabled="selectdeptDisabled">
    <el-option
       v-for="item in optinProps"
       :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
    </el-select>
        </el-col>
        <el-col :span="5">
    <span class="demonstration"> 银行: </span>
     <el-select v-model="bankvisitdata.bankId" 
        placeholder="请选择银行"  
        size="mini"
        @change="newbankOption"
       :disabled="selectbankDisabled"
       >
    <el-option
      v-for="it in bankNameProps"
      :key="it.id"
      :label="it.bankName"
      :value="it.id">
    </el-option>
    </el-select>
   </el-col>
   <el-col :span="5">
    <span class="demonstration"> 支行: </span>
   <el-select v-model="bankvisitdata.branchId" 
        placeholder="请选择支行"  
        size="mini"
        @change="newbranchOption"
       :disabled="selectbranchDisabled"
       >
    <el-option
      v-for="it in branchNameProps"
      :key="it.id"
      :label="it.branchName"
      :value="it.id">
    </el-option>
    </el-select>
   </el-col>
       </el-row>
     </el-card>  
      <el-card class="box-card">
        <el-table :data="basicinfos" 
        :header-cell-style="{
    'background-color': '#E5EEFF'
    }"
        border stripe>
          <el-table-column 
            
            label="银行名称"
            >
          </el-table-column>
        </el-table>
        
      </el-card> 
     <el-card class="box-card">
 <el-collapse v-model="activeNames" accordion @change="handleChange">
  <el-collapse-item name="1">
     <template slot="title"><i class="el-icon-s-custom"></i>&emsp;人员情况</template> 
    <el-descriptions class="margin-top" :column="4" size="small" border >
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        行长
      </template>
      <!-- {{this.ruleForm.presidentname}} -->
      
         <el-input v-model="basicinfo.presidentname" placeholder="请输入行长姓名"   size="small" ></el-input>
     
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
     <el-input v-model="basicinfo.presidentmobile" placeholder="请输入行长手机号"   size="small" oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12' ></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-phone-outline"></i>
           电话号
      </template>
       <el-input v-model="basicinfo.presidentphone" placeholder="请输入行长电话号"   size="small" oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12'  ></el-input>
    </el-descriptions-item>
    <el-descriptions-item :content-class-name="mycontent">
      <template slot="label">
        <i class="el-icon-tickets"></i>
        备注
      </template>
      <el-input v-model="basicinfo.presidentrem" placeholder="请输入行长备注信息"   size="small" ></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        副行长
      </template>
       <el-input v-model="basicinfo.vicepresidentname" placeholder="请输入副行长姓名"   size="small"></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      <el-input v-model="basicinfo.vicepresidentmolile" 
                placeholder="请输入副行长手机号"   
                size="small" 
                oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12' ></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-phone-outline"></i>
           电话号
      </template>
       <el-input v-model="basicinfo.vicepresidentphone" 
                placeholder="请输入副行长电话号"   
                size="small" 
                oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12'
></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        备注
      </template>
     <el-input v-model="basicinfo.vicepresidentrem" placeholder="请输入副行长备注"   size="small"></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        信贷经理
      </template>
       <el-input v-model="basicinfo.creditManagername" placeholder="请输入信贷经理姓名"   size="small"></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      <el-input v-model="basicinfo.creditManagermobile" 
                placeholder="请输入信贷经理手机号"   
                size="small" 
                oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12'
></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-phone-outline"></i>
           电话号
      </template>
         <el-input v-model="basicinfo.creditManagerphone" 
                placeholder="请输入信贷经理电话号"   
                size="small" 
                oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12'
></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        备注
      </template>
      <el-input v-model="basicinfo.creditManagerrem" placeholder="请输入信贷经理备注"   size="small"></el-input>
    </el-descriptions-item>
   
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        客户经理
      </template>
       <el-input v-model="basicinfo.accountManagername" placeholder="请输入客户经理姓名"   size="small"></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      <el-input v-model="basicinfo.accountManagermobile" 
                placeholder="请输入客户经理电话号"   
                size="small" 
                oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12'
></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-phone-outline"></i>
           电话号
      </template>
         <el-input v-model="basicinfo.accountManagerphone" 
                placeholder="请输入客户经理电话号"   
                size="small" 
                oninput="value=value.replace(/[^\d]/g,'')"
                maxLength='12'
></el-input>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        备注
      </template>
       <el-input v-model="basicinfo.accountManagerrem" placeholder="请输入客户经理备注"   size="small"></el-input>
    </el-descriptions-item>
    </el-descriptions>
   </el-collapse-item>
  <el-collapse-item  name="2">
    <template slot="title"><i class="el-icon-s-comment"></i>&emsp;信贷资源</template>
     <el-descriptions class="margin-top" :column="2" size="small" border >
    <el-descriptions-item >
      <template slot="label">
        {{basicinfo.creditscaletotalyear+'年信贷规模总量'}}
      </template>
       <el-input v-model="basicinfo.creditscaletotal" placeholder="请输入信贷规模总量"   size="small" ><template slot="append"> 万元</template>
</el-input>
    </el-descriptions-item>
     <el-descriptions-item >
      <template slot="label">
        {{basicinfo.creditscaletotallastyear+'年信贷规模总量'}}
      </template>
        <el-input v-model="basicinfo.lastcreditscaletotal" placeholder="请输入信贷规模总量"   size="small" ><template slot="append">万元</template></el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        {{basicinfo.creditscaletotalyear+'年固定资产信贷规模'}}
      </template>
       <el-input v-model="basicinfo.fixedassetscreadit" placeholder="请输入固定资产信贷规模"   size="small" ><template slot="append"> 万元</template>
</el-input>
    </el-descriptions-item>
     <el-descriptions-item >
      <template slot="label">
        {{basicinfo.creditscaletotallastyear+'年固定资产信贷规模'}}
      </template>
        <el-input v-model="basicinfo.lastfixedassetscreadit" placeholder="请输入固定资产信贷规模"   size="small" ><template slot="append">万元</template></el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        {{basicinfo.creditscaletotalyear+'年信用贷款规模'}}
      </template>
       <el-input v-model="basicinfo.creditloanscale" placeholder="请输入信用贷款规模"   size="small" ><template slot="append"> 万元</template>
</el-input>
    </el-descriptions-item>
     <el-descriptions-item >
      <template slot="label">
        {{basicinfo.creditscaletotallastyear+'年信用贷款规模'}}
      </template>
        <el-input v-model="basicinfo.lastcreditloanscale" placeholder="请输入信用贷款规模"   size="small" ><template slot="append">万元</template></el-input>
    </el-descriptions-item>
     </el-descriptions>
  </el-collapse-item>
  <el-collapse-item  name="3">
    <template slot="title"><i class="el-icon-s-management"></i>&emsp;信贷客户的主要构成分类</template>
      <el-descriptions class="margin-top" :column="2" size="small" border >
    <el-descriptions-item >
        <template slot="label">
        <i class="el-icon-money"></i>
       大型企业信用贷款
      </template>
       <el-input v-model="basicinfo.bigcreditloan" placeholder="请输入大型企业信用贷款"   size="small" ><template slot="append"> 万元</template>
       </el-input>
    </el-descriptions-item>
     <el-descriptions-item >
        <template slot="label">
        <i class="el-icon-money"></i>
       大型企业抵押贷款
      </template>
       <el-input v-model="basicinfo.bigmortgage" placeholder="请输入大型企业贷款贷款"   size="small" ><template slot="append"> 万元</template>
       </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
        <template slot="label">
        <i class="el-icon-money"></i>
       小型企业信用贷款
      </template>
       <el-input v-model="basicinfo.smallcreditloan" placeholder="请输入小型企业信用贷款"   size="small" ><template slot="append"> 万元</template>
       </el-input>
    </el-descriptions-item>
     <el-descriptions-item >
        <template slot="label">
        <i class="el-icon-money"></i>
       小型企业抵押贷款
      </template>
       <el-input v-model="basicinfo.smallmortgage" placeholder="请输入小型企业贷款贷款"   size="small" ><template slot="append"> 万元</template>
       </el-input>
    </el-descriptions-item>
      </el-descriptions>
  </el-collapse-item>
  <el-collapse-item  name="4">
     <template slot="title"><i class="el-icon-s-marketing"></i>&emsp;重要信贷客户信息</template>
      <el-descriptions class="margin-top" :column="3" size="small" border >
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第一客户名称
      </template>
       <el-input v-model="basicinfo.firstloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第一客户贷款规模
      </template>
       <el-input v-model="basicinfo.firstloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第一客户客户经理
      </template>
       <el-input v-model="basicinfo.firstloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item>
     <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第一客户名称
      </template>
       <el-input v-model="basicinfo.firstloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第一客户贷款规模
      </template>
       <el-input v-model="basicinfo.firstloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第一客户客户经理
      </template>
       <el-input v-model="basicinfo.firstloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第二客户名称
      </template>
       <el-input v-model="basicinfo.secondloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第二客户贷款规模
      </template>
       <el-input v-model="basicinfo.secondloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第二客户客户经理
      </template>
       <el-input v-model="basicinfo.secondloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第三客户名称
      </template>
       <el-input v-model="basicinfo.thirdloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第三客户贷款规模
      </template>
       <el-input v-model="basicinfo.thirdloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第三客户客户经理
      </template>
       <el-input v-model="basicinfo.thirdloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第四客户名称
      </template>
       <el-input v-model="basicinfo.fourloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第四客户贷款规模
      </template>
       <el-input v-model="basicinfo.fourloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第四客户客户经理
      </template>
       <el-input v-model="basicinfo.fourloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第五客户名称
      </template>
       <el-input v-model="basicinfo.fifloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第五客户贷款规模
      </template>
       <el-input v-model="basicinfo.fifloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第五客户客户经理
      </template>
       <el-input v-model="basicinfo.fifloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item>
     <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第六客户名称
      </template>
       <el-input v-model="basicinfo.sixloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第六客户贷款规模
      </template>
       <el-input v-model="basicinfo.sixloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第六客户客户经理
      </template>
       <el-input v-model="basicinfo.sixloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item>
     <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第七客户名称
      </template>
       <el-input v-model="basicinfo.sevenloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第七客户贷款规模
      </template>
       <el-input v-model="basicinfo.sevenloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第七客户客户经理
      </template>
       <el-input v-model="basicinfo.sevenloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第八客户名称
      </template>
       <el-input v-model="basicinfo.eightloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第八客户贷款规模
      </template>
       <el-input v-model="basicinfo.eightloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第八客户客户经理
      </template>
       <el-input v-model="basicinfo.eightloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第九客户名称
      </template>
       <el-input v-model="basicinfo.nineloancustomer" placeholder="请输入客户名称"   size="small" >
     </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第九客户贷款规模
      </template>
       <el-input v-model="basicinfo.nineloancustomerscale" placeholder="请输入客户贷款规模"   size="small" ><template slot="append"> 万元</template>
      </el-input>
    </el-descriptions-item>
    <el-descriptions-item >
      <template slot="label">
        <i class="el-icon-user"></i>
        第九客户客户经理
      </template>
       <el-input v-model="basicinfo.nineloancustomermanager" placeholder="请输入客户经理"   size="small" >
      </el-input>
    </el-descriptions-item> 
     
      </el-descriptions>
  </el-collapse-item> 
</el-collapse>       
     </el-card> 
    </div>
</template>

<script>
import {   getUserId} from "../../../utils/auth"
import { getDeptByUserIdApi } from "../../../api/department"
import{getBankNameListApi,getBranchNameListApi} from "../../../api/outlets"
    export default {
    data(){
        return{
            selectdeptDisabled:false,
            selectbankDisabled:true,
            selectbranchDisabled:true,
            mycontent:{'min-width': '450px'},
            bankvisitdata:[],
            bankNameProps:[],
            branchNameProps:[],
            optinProps:[],
             activeNames: ['1'],
             basicinfos:[],
             basicinfo: {
              branchId:'',
              presidentname:'',
              presidentmobile:'',
              presidentphone:'',
              presidentrem:'',
              vicepresidentname:'',
              vicepresidentmolile:'',
              vicepresidentphone:'',
              vicepresidentrem:'',
              creditManagername:'',
              creditManagermobile:'',
              creditManagerphone:'',
              creditManagerrem:'',
              accountManagername:'',
              accountManagermobile:'',
              accountManagerphone:'',
              accountManagerrem:'',
              creditscaletotal:'',//信贷总量
              lastcreditscaletotal:'',//上年信贷总量
              creditscaletotalyear:new Date().getFullYear(),
              creditscaletotallastyear:new Date().getFullYear()-1,
              fixedassetscreadit:'',//固定资产贷款规模
              lastfixedassetscreadit:'',//固定资产贷款
              creditloanscale:'',//信用贷款规模
              lastcreditloanscale:'',//信用贷款规模
              smallcreditloan:'',//小型企业信用贷款
              smallmortgage:'',//小型企业抵押贷款
              bigcreditloan:'',//大型企业信用贷款
              bigmortgage:'',//大型企业抵押贷款
              firstloancustomer:'',//第一贷款客户
              firstloancustomerscale:'',//第一贷款客户规模
              firstloancustomermanager:'',//第一贷款客户经理
              secondloancustomer:'',//第一贷款客户
              secondloancustomerscale:'',//第一贷款客户规模
              secondloancustomermanager:'',//第一贷款客户经理
              thirdloancustomer:'',//第一贷款客户
              thirdloancustomerscale:'',//第一贷款客户规模
              thirdloancustomermanager:'',//第一贷款客户经理
              fourloancustomer:'',//第一贷款客户
              fourloancustomerscale:'',//第一贷款客户规模
              fourloancustomermanager:'',//第一贷款客户经理
              fifloancustomer:'',//第一贷款客户
              fifloancustomerscale:'',//第一贷款客户规模
              fifloancustomermanager:'',//第一贷款客户经理
              sixloancustomer:'',//第一贷款客户
              sixloancustomerscale:'',//第一贷款客户规模
              sixloancustomermanager:'',//第一贷款客户经理
              sevenloancustomer:'',//第一贷款客户
              sevenloancustomerscale:'',//第一贷款客户规模
              sevenloancustomermanager:'',//第一贷款客户经理
              eightloancustomer:'',//第一贷款客户
              eightloancustomerscale:'',//第一贷款客户规模
              eightloancustomermanager:'',//第一贷款客户经理
              nineloancustomer:'',//第一贷款客户
              nineloancustomerscale:'',//第一贷款客户规模
              nineloancustomermanager:'',//第一贷款客户经理
             
        }
        }
    },
     computed: {
       
        
       },
     
    created(){
    this.userDeptinfo();
    },
    methods:{
        async userDeptinfo(){
        let parm={
            userId:getUserId()
            
        }
        let {data:res}= await getDeptByUserIdApi(parm);
        if (res.code == 200){
          this.optinProps=res.data
          }
        },
       async newOpenOption(deptId){
         this.selectdeptDisabled=!this.selectdeptDisabled;
         this.selectbankDisabled=!this.selectbankDisabled;
         let parm={
            deptId
        }
        let {data:res}= await getBankNameListApi(parm);
            if(res.code==200){
                this.bankNameProps=res.data
            }
        },
        async newbankOption(bankId){
            this.selectbankDisabled=!this.selectbankDisabled;
            this.selectbranchDisabled=!this.selectbranchDisabled;
           let parm={
            bankId
           }
           let{data:res}= await getBranchNameListApi(parm);
          if(res.code ==200){
            console.log(res.data);
            this.branchNameProps=res.data
          }
        },
         newbranchOption(){
           this.selectbranchDisabled=!this.selectbranchDisabled;
           },
         handleChange(val) {
        console.log(val);
      }
        }
    }   
    
</script>

<style lang="scss" scoped>
.text{
    font-size: 12px;
}
.box-card {
    margin-left: 15px;
    margin-top:15px;
    width: 98%;
  }
  .demonstration{
     margin-right: 15px;
}


</style>