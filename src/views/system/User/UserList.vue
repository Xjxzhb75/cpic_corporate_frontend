<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 左侧部门树 -->
    <el-aside
      width="200px"
      style="
        background: #fff;
        border-right: 1px solid #dfe6ec;
        padding: 10px 0px 0px 0px;
      "
    >
      <el-tree
        style="font-size: 14px"
        ref="leftTree"
        :data="deptList"
        node-key="id"
        :props="defaultProps"
        :show-checkbox="false"
        :highlight-current="true"
        :expand-on-click-node="false"
        default-expand-all
        @node-click="nodeClick"
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
                class="iconfont icon-jia"
              />
              <i v-else style="margin-right: 3px" class="iconfont icon-jian" />
            </span>
            <!-- 树节点的名称 -->
            <span>{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>
    <!-- 右侧用户列表 -->
    <el-main>
      <el-form
        :model="searchform"
        ref="searchform"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item label="用户名">
          <el-input v-model="searchform.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search">查询</el-button>
          <el-button style="color: #ff7670" icon="el-icon-delete"
            >重置</el-button
          >
          <el-button
            v-if="hasPerm('sys:user:add')"
            icon="el-icon-plus"
            type="primary"
            @click="addUser"
            >新增</el-button
          >
        </el-form-item>
      </el-form>

      <el-table :height="tableHeight" :data="tableList" border stripe>
        <el-table-column prop="loginName" label="用户名"></el-table-column>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" width="290" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="hasPerm('sys:user:edit')"
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editUser(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="hasPerm('sys:user:assign')"
              type="primary"
              icon="el-icon-setting"
              size="small"
              @click="assignUser(scope.row)"
              >分配角色</el-button
            >
            <el-button
              v-if="hasPerm('sys:user:delete')"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="parms.currentPage"
        :page-sizes="[10, 20, 40, 80, 100]"
        :page-size="parms.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-main>
    <!-- 新增或编辑弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="addClose"
      @onConfirm="addConfrim"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="deptName" label="所属部门">
            <el-input
              @click.native="selectDept"
              v-model="addModel.deptName"
            ></el-input>
          </el-form-item>
          <el-form-item prop="loginName" label="姓名">
            <el-input v-model="addModel.loginName"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="电话">
            <el-input v-model="addModel.mobile"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="addModel.nickName"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="addModel.email"></el-input>
          </el-form-item>
          <el-form-item prop="username" label="登录名">
            <el-input v-model="addModel.username"></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            label="登录密码"
          >
            <el-input type="password" v-model="addModel.password"></el-input>
          </el-form-item>
          <el-form-item prop="sex" label="性别">
            <el-radio-group v-model="addModel.sex">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="isAdmin" label-width="100px" label="是否管理员">
            <el-radio-group v-model="addModel.isAdmin">
               <el-radio :label="'1'">是</el-radio>
              <el-radio :label="'0'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 上级部门弹框 -->
    <sys-dialog
      :title="parentDialog.title"
      :height="parentDialog.height"
      :width="parentDialog.width"
      :visible="parentDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parentList"
          node-key="id"
          :props="parentProps"
          default-expand-all
          :show-checkbox="false"
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="selectParentNode"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <div>
              <!-- 如果没有下级，就是最好一层 -->
              <span v-if="data.children.length == 0">
                <i style="margin-right: 3px" class="el-icon-document" />
              </span>
              <!-- 有下级，需要判断是展开还是关闭 -->
              <span v-else @click.stop="openParentBtn(data)">
                <i
                  v-if="data.open"
                  style="margin-right: 3px"
                  class="iconfont icon-jia"
                />
                <i
                  v-else
                  style="margin-right: 3px"
                  class="iconfont icon-jian"
                />
              </span>
              <!-- 树节点的名称 -->
              <span>{{ node.label }}</span>
            </div>
          </div>
        </el-tree>
      </div>
    </sys-dialog>
    <!-- 分配角色弹框 -->
    <sys-dialog
      :title="assignRoleDialog.title"
      :height="assignRoleDialog.height"
      :width="assignRoleDialog.width"
      :visible="assignRoleDialog.visible"
      @onClose="assignRoleClose"
      @onConfirm="assignRoleConfirm"
    >
      <div slot="content">
        <el-table :height="assignTableHieght" :data="assignList" border stripe>
          <el-table-column width="50" label="选择">
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.row.id"
                @change="getCurrentRow(scope.row)"
              >
                {{ "" }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
          <el-table-column prop="remark" label="角色备注"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="assignSizeChange"
          @current-change="assignCurrentChange"
          :current-page.sync="assignParm.currentPage"
          :page-sizes="[10, 40, 80, 100]"
          :page-size="assignParm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="assignParm.total"
          background
        >
        </el-pagination>
      </div>
    </sys-dialog>
  </el-container>
</template>

<script>
import SysDialog from "../../../components/SysDialog";
import { getUserId } from "../../../utils/auth";
import { getDeptListApi } from "../../../api/department";
import {
  getUserListApi,
  addUserApi,
  editUserApi,
  deleteUserApi,
  getRolistForAssignApi,
  getRoleIdByUserIdApi,
  assignSaveApi,
} from "../../../api/user";
export default {
  //注册组件
  components: {
    SysDialog,
  },
  data() {
    return {
      //角色分配选择参数
      selectAssingParm: {
        roleId: "",
        userId: "",
      },
      //分配角色表格高度
      assignTableHieght: 0,

      //角色表格列表单选按钮数据
      radio: "",
      assignList: [],
      //分配角色列表分页数据
      assignParm: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        userId: "",
      },
      //分配角色弹框属性
      assignRoleDialog: {
        title: "",
        height: 400,
        width: 800,
        visible: false,
      },
      selectNode: {
        id: "",
        name: "",
      },
      //上级部门树属性绑定
      parentProps: {
        children: "children",
        label: "name",
      },
      //上级部门数据域
      parentList: [],
      //上级部门弹框属性
      parentDialog: {
        title: "选择上级部门",
        height: 450,
        width: 300,
        visible: false,
      },
      //表单验证规则
      rules: {
        deptName: [
          {
            required: true,
            trigger: "change",
            message: "请选择上级部门",
          },
        ],
        loginName: [
          {
            required: true,
            trigger: "change",
            message: "请填写姓名",
          },
        ],
        mobile: [
          {
            required: true,
            trigger: "change",
            message: "请填写电话",
          },
        ],
        username: [
          {
            required: true,
            trigger: "change",
            message: "请填写登录名",
          },
        ],
        password: [
          {
            required: true,
            trigger: "change",
            message: "请填写登录密码",
          },
        ],
        sex: [
          {
            required: true,
            trigger: "change",
            message: "请选择性别",
          },
        ],
        isAdmin: [
          {
            required: true,
            trigger: "change",
            message: "请选择是否是管理员",
          },
        ],
      },
      //新增或编辑表单数据域
      addModel: {
        id: "",
        editType: "", // 0:新增 1：编辑
        deptId: "",
        deptName: "",
        loginName: "",
        mobile: "",
        email: "",
        username: "",
        password: "",
        sex: "",
        isAdmin:"",
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 270,
        width: 620,
        visible: false,
      },
      //用户表格高度
      tableHeight: 0,
      //搜索框数据域
      searchform: {
        name: "",
      },
      //右侧用户列表数据域
      tableList: [],
      total: 0,
      //分页参数
      parms: {
        deptId: "",
        currentPage: 1,
        pageSize: 10,
      },
      //容器的高度
      containerHeight: 0,
      //左侧树组件属性绑定
      defaultProps: {
        children: "children",
        label: "name",
      },
      //左侧部门树数据域
      deptList: [],
    };
  },
  created() {
    this.getDeptList();
  },
  mounted() {
    this.$nextTick(() => {
      this.containerHeight = window.innerHeight - 160;
      this.tableHeight = window.innerHeight - 290;
      this.assignTableHieght = window.innerHeight - 620;
    });
  },
  methods: {
    //角色表格的页数改变时触发
    assignCurrentChange(val) {
      this.assignParm.currentPage = val;
      this.getAssignRoleList(this.assignParm);
    },
    //角色pageSize改变的时候触发
    assignSizeChange(val) {
      this.assignParm.pageSize = val;
      this.getAssignRoleList(this.assignParm);
    },
    //表格单选按钮事件
    getCurrentRow(row) {
      console.log(row);
      this.selectAssingParm.roleId = row.id;
      console.log(this.selectAssingParm);
    },
    //分配角色按钮
    async assignUser(row) {
      this.selectAssingParm.userId = "";
      this.selectAssingParm.roleId = "";
      this.radio = "";
      //设置分配角色弹框属性
      this.selectAssingParm.userId = row.id;
      this.assignRoleDialog.title = "为【" + row.loginName + "】分配角色";
      this.assignRoleDialog.visible = true;
      this.assignParm.userId = getUserId();
      //查询当前用户的所有角色
      this.getAssignRoleList(this.assignParm);
      //回显被分配的用户的角色
      let parm = {
        userId: row.id,
      };
      let { data: res } = await getRoleIdByUserIdApi(parm);
       console.log(res)
      if (res.code == 200 && res.data) {
        this.radio = res.data.roleId;
        this.selectAssingParm.roleId = res.data.roleId;
      }
    },
    async getAssignRoleList(parm) {
      let { data: res } = await getRolistForAssignApi(parm);
      console.log(res);
      if (res.code == 200) {
        this.assignList = res.data.records;
        this.assignParm.total = res.data.total;
        console.log(this.assignParm);
      }
    },
    //分配角色确认事件
    async assignRoleConfirm() {
      if (!this.selectAssingParm.roleId) {
        this.$message.warning("请选择角色！");
        return;
      }
      let { data: res } = await assignSaveApi(this.selectAssingParm);
      if (res && res.code == 200) {
        this.$message.success(res.msg);
        this.assignRoleDialog.visible = false;
      }
    },
    //分配角色取消
    assignRoleClose() {
      this.assignRoleDialog.visible = false;
    },
    //上级部门树节点加号和减号的点击事件
    openParentBtn(data) {
      console.log("222");
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
    //上级部门节点点击事件
    selectParentNode(data) {
      console.log("1111");
      console.log(data);
      this.selectNode.id = data.id;
      this.selectNode.name = data.name;
    },
    //选择上级部门确认事件
    onParentConfirm() {
      this.addModel.deptId = this.selectNode.id;
      this.addModel.deptName = this.selectNode.name;
      this.parentDialog.visible = false;
    },
    //选择上级部门取消事件
    onParentClose() {
      this.parentDialog.visible = false;
    },
    //选择上级部门点击事件
    async selectDept() {
      this.selectNode.id = "";
      this.selectNode.name = "";
      let { data: res } = await getDeptListApi();
      if (res && res.code == 200) {
        this.parentList = res.data;
      }
      this.parentDialog.visible = true;
    },
    //新增或编辑确认事件
    addConfrim() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addModel.editType == "0") {
            //新增
            res = await addUserApi(this.addModel);
          } else {
            res = await editUserApi(this.addModel);
          }
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            //刷新数据列表
            this.getUserList();
            this.addDialog.visible = false;
          }
        }
      });
    },
    //新增或编辑取消事件
    addClose() {
      this.addDialog.visible = false;
    },
    //新增按钮
    addUser() {
      //清空表单数据域
      this.$resetForm("addForm", this.addModel);
      //设置标识 0：新增 1：编辑
      this.addModel.editType = "0";
      //设置弹框属性
      this.addDialog.title = "新增用户";
      this.addDialog.visible = true;
    },
    currentChange(val) {
      this.parms.currentPage = val;
      this.getUserList();
    },
    //页容量改变时触发
    sizeChange(val) {
      this.parms.pageSize = val;
      this.parms.currentPage = 1;
      this.getUserList();
    },
    //删除按钮
    async deleteUser(row) {
      //提示信息
      let confirm = await this.$message.confirm("确定删除该数据吗？");
      //确定删除
      if (confirm) {
        let parm = {
          userId: row.id,
        };
        let { data: res } = await deleteUserApi(parm);
        if (res.code == 200) {
          this.$message.success(res.msg);
          //刷新数据列表
          this.getUserList();
        }
      }
    },

    //编辑按钮
    editUser(row) {
      //清空表单
      this.$resetForm("addForm", this.addModel);
      //设置编辑状态
      this.addModel.editType = "1";
      //设置弹框属性
      this.addDialog.title = "编辑用户";
      this.addDialog.visible = true;
      //把要编辑的数据回显到页面
      this.$objCoppy(row, this.addModel);
    },
    //获取用户列表
    async getUserList() {
      let { data: res } = await getUserListApi(this.parms);
      if (res && res.code == 200) {
        this.tableList = res.data.records;
        this.total = res.data.total;
      }
      console.log(res);
    },
    //加减号图标点击事件
    openBtn(data) {
      console.log(data);
      data.open = !data.open;
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open;
    },
    //左侧部门树节点点击事件
    nodeClick(data) {
      this.parms.deptId = data.id;
      this.getUserList();
    },
    //获取左侧部门树数据
    async getDeptList() {
      let { data: res } = await getDeptListApi();
      if (res && res.code == 200) {
        this.deptList = res.data;
        //设置树节点点击
        this.$nextTick(() => {
          const firstNode = document.querySelector(".el-tree-node");
          firstNode.click();
        });
      }
      console.log(res);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-aside ::v-deep .el-tree {
  // 将每一行的设置为相对定位 方便后面before after 使用绝对定位来固定位置
  .el-tree-node {
    position: relative;
    // padding-left: 10px;
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
    border-left: 1px solid #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  //横线
  .el-tree-node:after {
    border-top: 1px solid #d9d9d9;
    height: 20px;
    top: 14px;
    width: 12px;
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
.el-aside ::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}

.el-dialog__wrapper ::v-deep .el-tree {
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
.el-dialog__wrapper ::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>