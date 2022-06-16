<template>
  <el-main>
    <el-form
      :model="searchPrm"
      ref="form"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="部门名称">
        <el-input v-model="searchPrm.searchName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search">查询</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="add"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
     :height="tableHeight"
      :data="tableList"
      border
      stripe
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="机构名称"> </el-table-column>
      <el-table-column prop="deptCode" label="机构编码"> </el-table-column>
      <el-table-column prop="deptPhone" label="机构电话"> </el-table-column>
      <el-table-column prop="deptAddress" label="机构地址"> </el-table-column>
      <el-table-column prop="orderNum" label="序号"> </el-table-column>
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit-outline"
            type="primary"
            size="small"
            @click="editHandler(scope.row)"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-close"
            type="danger"
            size="small"
            @click="deleteHandler(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addDeptModel"
          ref="addDeptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="parentName" label="上级部门">
            <el-input v-model="addDeptModel.parentName"
            @click.native="selectParent"
            ></el-input>
          </el-form-item>
          <el-form-item prop="name" label="机构名称">
            <el-input v-model="addDeptModel.name"></el-input>
          </el-form-item>
          <el-form-item label="机构编码">
            <el-input v-model="addDeptModel.deptCode"></el-input>
          </el-form-item>
          <el-form-item label="机构电话">
            <el-input v-model="addDeptModel.deptPhone"></el-input>
          </el-form-item>
          <el-form-item label="机构经理">
            <el-input v-model="addDeptModel.manager"></el-input>
          </el-form-item>
          <el-form-item label="机构地址">
            <el-input v-model="addDeptModel.deptAddress"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="addDeptModel.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <sys-dialog
    :title="parentDialog.title"
      :height="parentDialog.height"
      :width="parentDialog.width"
      :visible="parentDialog.visible"
      @onClose="parentOnClose"
      @onConfirm="parentOnConfirm"
    >
    <div slot="content">
       <el-tree
          ref="parentTree"
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
        <div class="customer-tree-node" slot-scope="{ node, data }">
            <div>
              <!-- 如果没有下级，就是最好一层 -->
              <span v-if="data.children.length == 0">
                <i style="margin-right: 3px" class="el-icon-document" />
              </span>
              <!-- 有下级，需要判断是展开还是关闭 -->
              <span v-else @click.stop="openBtn(data)">
                <i
                  v-if="data.open"
                  style="margin-right: 3px"
                  class="el-icon-document-add"
                />
                <i
                  v-else
                  style="margin-right: 3px"
                  class="el-icon-document-remove"
                />
              </span>
              <!-- 树节点的名称 -->
              <span>{{ node.label }}</span>
            </div>
          </div>
       </el-tree>
    </div>
    </sys-dialog>
  </el-main>
</template>

<script>
  import { getDeptListApi,getParentTreeApi,addSaveApi,
  editSaveApi,deleteDeptApi} from "../../../api/department";
  import SysDialog from "../../../components/SysDialog";
  export default {
    components: {
      SysDialog,
    },
    data() {
      return {
        //表格的高度
      tableHeight: 0,
        defaultProps: {
        children: "children",
        label: "name", //树的名字，跟后端字段对应
      },
        //上级机构弹窗属性
        parentDialog: {
        title: "",
        height: 450,
        width: 300,
        visible: false,
      },
        //表单验证规则
        rules: {
          parentName: [
            {
              required: true,
              trigger: "change",
              message: "请选择上级部门",
            },
          ],
          name: [
            {
              required: true,
              trigger: "change",
              message: "请填写部门名称",
            },
          ],
        },
        //新增表单数据域
        addDeptModel: {
          editType: "", //0 表示新增 1： 编辑
          id: "",
          pid: "",
          parentName: "",
          manager: "",
          deptAddress: "",
          deptPhone: "",
          name: "",
          deptCode: "",
          orderNum: "",
        },
        //表格数据
        tableList: [],
        treeList:[],
        //查询数据域
        searchPrm: {
          searchName: "",
        },
        //新增对话框属性
        addDialog: {
          title: "",
          height: 210,
          width: 620,
          visible: false,
        },
      };
    },
    created() {
      this.getDeptList();
    },
    mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 250;
    });
  },
    methods: {
      //树节点加号和减号的点击事件
      openBtn(data){
         data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
      },
      //上级部门树节点点击事件
      handleNodeClick(data){
        console.log(data);
      this.addDeptModel.pid = data.id;
      this.addDeptModel.parentName = data.name;
      },
      //选择上级机构事件
      async selectParent() {
        //获取上级部门树数据
        let {data:res} =await getParentTreeApi();
        if (res && res.code == 200) {
        this.treeList = res.data;
        }
        this.parentDialog.title = "选择上级机构";

        this.parentDialog.visible = true;
      },
      //获取部门列表
      async getDeptList() {
        //将getdeptlist取回的数据，重命名为res
        let { data: res } = await getDeptListApi();
        this.tableList = res.data;
      },
      //编辑事件
      editHandler(row) {
        //清空表单
      this.$resetForm("addDeptForm", this.addDeptModel);
      //把要编辑的数据复制到表单数据域
      this.$objCoppy(row, this.addDeptModel);
      //设置弹框显示
      this.addDeptModel.editType = "1";
      this.addDialog.title = "编辑部门";
      this.addDialog.visible = true;
      },
      async deleteHandler(row) {
       let cofirm = await this.$message.confirm("确定删除该数据吗?");
      if (cofirm) {
        let parm = {
          id: row.id,
        };
        let { data: res } = await deleteDeptApi(parm);
        if (res && res.code == 200) {
          this.$message.success(res.msg);
          //刷新数据列表
          this.getDeptList();
        }
      }
      },
      //上级机构关闭事件
      parentOnClose(){
       this.parentDialog.visible = false;
      },
      //上级机构选择确认事件
    parentOnConfirm() {
      this.parentDialog.visible = false;
    },
      add() {
        //清空表单数据
        this.$resetForm("addDeptForm",this.addDeptModel);
        this.addDialog.title = "新增部门";
        this.addDialog.visible = true;
        this.addDeptModel.editType = "0";
      },
      //新增部门对话框取消事件
      onClose() {
        this.addDialog.visible = false;
      },
      //新增机构对话框确认事件
      onConfirm() {
        this.$refs.addDeptForm.validate(async(vailid) => {
          if (vailid) {
           // let { data: res } = await addSaveApi(this.addDeptModel);
          let res = null;
          if (this.addDeptModel.editType == "0") {
            res = await addSaveApi(this.addDeptModel);
          } else {
            res = await editSaveApi(this.addDeptModel);
          }
          //如果新增成功
          if (res && res.data.code == 200) {
            this.$message.success(res.data.msg);
            //新增成功刷新列表
            this.getDeptList();
            this.addDialog.visible = false;
          }
        }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  // 子集像右偏移 给数线留出距离
  .el-tree-node__children {
    padding-left: 20px;
  }
  //这是竖线
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  //这自定义的线 的公共部分
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  // 竖线
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  //去掉elementui自带的展开按钮  一个向下的按钮,打开时向右
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  //每一行的高度
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
//去掉最上级的before  after 即是去电最上层的连接线
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>