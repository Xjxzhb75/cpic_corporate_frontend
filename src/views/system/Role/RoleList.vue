<template>
  <el-main>
    <el-form
      :model="parms"
      ref="searchform"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item label="角色名称">
        <el-input v-model="parms.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="searchBtn" icon="el-icon-search">查询</el-button>
        <el-button
          @click="resetBtn"
          style="color: #ff7670"
          icon="el-icon-delete"
          >重置</el-button
        >
        <el-button
          v-if="hasPerm('sys:role:add')"
          icon="el-icon-plus"
          type="primary"
          @click="addRole"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table :height="tableHeight" :data="roleList" border stripe>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column width="290" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('sys:role:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editRole(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="hasPerm('sys:role:assign')"
            icon="el-icon-setting"
            type="primary"
            size="small"
            @click="assignRole(scope.row)"
            >分配权限</el-button
          >
          <el-button
            v-if="hasPerm('sys:role:delete')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteRole(scope.row)"
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
      :total="parms.total"
      background
    >
    </el-pagination>
    <!-- 新增或编辑弹框 -->
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
          :model="addRoleModel"
          ref="addroleform"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="name" label="角色名称">
            <el-input v-model="addRoleModel.name"></el-input>
          </el-form-item>
          <el-form-item label="角色备注">
            <el-input v-model="addRoleModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 分配权限弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :width="assignDialog.width"
      :height="assignDialog.height"
      :visible="assignDialog.visible"
      @onClose="assignClose"
      @onConfirm="assignConfirm"
    >
      <div slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          empty-text="暂无数据"
          :show-checkbox="true"
          :highlight-current="true"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { getUserId } from "../../../utils/auth";
import {
  getRoleListApi,
  addRoleApi,
  editRoleApi,
  deleteRoleApi,
  getAssignTreeApi,
  assignSaveApi,
} from "../../../api/role";
import SysDialog from "../../../components/SysDialog";
import leafUtils from "../../../utils/leafUtils";
export default {
  //注册组件
  components: {
    SysDialog,
  },
  data() {
    return {
      //配置树的属性
      defaultProps: {
        children: "children",
        label: "label",
      },
      //权限树的数据域
      assignTreeData: [],
      //角色id
      roleId: "",
      //分配权限弹框属性
      assignDialog: {
        title: "",
        width: 300,
        height: 450,
        visible: false,
      },
      //表单验证规则
      rules: {
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写角色名称",
          },
        ],
      },
      //新增或编辑弹框数据域
      addRoleModel: {
        id: "",
        editType: "", //0 ：新增 1：编辑
        name: "",
        remark: "",
        createUser: "", //d当前登录用户id
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 150,
        width: 610,
        visible: false,
      },
      //表格高度
      tableHeight: 0,
      //角色列表数据域
      roleList: [],
      //分页查询数据域
      parms: {
        name: "",
        userId: "",
        currentPage: 1, //第几页
        pageSize: 10, //每页查询几条数据
        total: 0, // 总条数
      },
    };
  },
  created() {
    this.getRoleList();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 290;
    });
  },
  methods: {
    //权限树的节点点击事件
    handleNodeClick(data) {
      console.log(data);
    },
    //分配权限提交
    async assignConfirm() {
      // let ids = this.$refs.assignTree.getCheckedKeys();
      // let idss = this.$refs.assignTree.getHalfCheckedKeys();
      let ids = this.$refs.assignTree
        .getCheckedKeys()
        .concat(this.$refs.assignTree.getHalfCheckedKeys());
      console.log(ids);
      if (ids.length == 0) {
        this.$message.warning("请勾选权限！");
        return;
      }
      let parm = {
        roleId: this.roleId,
        list: ids,
      };
      let { data: res } = await assignSaveApi(parm);
      if (res && res.code == 200) {
        this.assignDialog.visible = false;
        this.$message.success(res.msg);
      }
      // console.log(idss)
      //this.assignDialog.visible = false;
    },
    //分配权限取消
    assignClose() {
      this.assignDialog.visible = false;
    },
    //分配权限按钮
    async assignRole(row) {
      let that = this;
      this.roleId = row.id;
      //获取分配权限树数据
      let parm = {
        userId: getUserId(),
        roleId: row.id,
      };
      let { data: res } = await getAssignTreeApi(parm);
      if (res && res.code == 200) {
        //当前要分配的角色拥有的权限
        let selectIds = res.data.checkList;
        //当前用户所拥有的所有权限
        let listmenu = res.data.listmenu;
        //处理末级
        let { setLeaf } = leafUtils();
        let newMenuList = setLeaf(listmenu);
        this.assignTreeData = newMenuList;
        that.$nextTick(() => {
          let nodes = that.$refs.assignTree.children;
          this.setChild(nodes, selectIds, that);
        });
      }
      console.log(res);
      this.assignDialog.visible = true;
      this.assignDialog.title = "为【" + row.name + "】分配权限";
    },
    setChild(nodes, selectIds, that) {
      let childNodes = nodes;
      if (childNodes && childNodes.length > 0) {
        for (let i = 0; i < childNodes.length; i++) {
          let node = that.$refs.assignTree.getNode(childNodes[i]);
          if (selectIds && selectIds.length > 0) {
            for (let h = 0; h < selectIds.length; h++) {
              if (selectIds[h] == childNodes[i].id) {
                if (childNodes[i].open) {
                  that.$refs.assignTree.setChecked(node, true);
                  break;
                }
              }
            }
          }
          if (childNodes[i].children.length > 0) {
            that.setChild(childNodes[i].children, selectIds, that);
          }
          console.log(node);
        }
      }
    },
    //新增或编辑弹框确认事件
    onConfirm() {
      this.$refs.addroleform.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addRoleModel.editType == "0") {
            //新增
            this.addRoleModel.createUser = getUserId();
            res = await addRoleApi(this.addRoleModel);
          } else {
            //编辑
            res = await editRoleApi(this.addRoleModel);
          }
          if (res && res.data.code == 200) {
            this.$message.success(res.data.msg);
            //刷新列表
            this.getRoleList();
            this.addDialog.visible = false;
          }
        }
      });
    },
    //新增或编辑弹框取消
    onClose() {
      this.addDialog.visible = false;
    },
    //重置
    resetBtn() {
      this.parms.name = "";
      this.parms.currentPage = 1;
      this.getRoleList(this.parms);
    },
    //查询按钮
    searchBtn() {
      this.parms.currentPage = 1;
      this.getRoleList(this.parms);
    },
    //新增按钮
    addRole() {
      //清空表单
      this.$resetForm("addroleform", this.addRoleModel);
      this.addDialog.title = "新增角色";
      this.addDialog.visible = true;
      this.addRoleModel.editType = "0";
    },
    //页数改变时触发
    currentChange(val) {
      console.log("当前页");
      console.log(val);
      this.parms.currentPage = val;
      this.getRoleList(this.parms);
    },
    //页容量改变时触发
    sizeChange(val) {
      console.log("页容量");
      console.log(val);
      this.parms.currentPage = 1;
      this.parms.pageSize = val;
      this.getRoleList(this.parms);
    },
    //删除按钮
    async deleteRole(row) {
      let parm = {
        id: row.id,
      };
      let confirm = await this.$message.confirm("确定删除该数据吗？");
      if (confirm) {
        let { data: res } = await deleteRoleApi(parm);
        if (res && res.code == 200) {
          //刷新列表
          this.getRoleList();
          this.$message.success(res.msg);
        }
      }
    },
    //编辑按钮
    editRole(row) {
      //清空表单数据
      this.$resetForm("addroleform", this.addRoleModel);
      //设置标识
      this.addRoleModel.editType = "1";
      //设置弹框属性
      this.addDialog.title = "编辑角色";
      this.addDialog.visible = true;
      //把当前行数据复制到表单数据域回显
      this.$objCoppy(row, this.addRoleModel);
    },
    //获取角色列表数据
    async getRoleList() {
      this.parms.userId = getUserId();
      let { data: res } = await getRoleListApi(this.parms);
      console.log(res);
      if (res && res.code == 200) {
        this.roleList = res.data.records;
        this.parms.total = res.data.total;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>