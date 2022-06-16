<template>
  <el-main style="padding: 0px 20px">
    <el-form style="margin-bottom: 0px">
      <el-form-item style="margin-bottom: 15px">
        <el-button
          v-if="hasPerm('sys:menu:add')"
          icon="el-icon-plus"
          size="small"
          type="primary"
          @click="addMenu"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      :height="tableHeight"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
      :data="menuList"
      border
      stripe
    >
      <el-table-column prop="label" label="菜单名称"> </el-table-column>
      <el-table-column align="center" prop="type" label="菜单类型">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type == '0'">目录</el-tag>
          <el-tag type="warning" size="small" v-if="scope.row.type == '1'"
            >菜单</el-tag
          >
          <el-tag type="success" size="small" v-if="scope.row.type == '2'"
            >按钮</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称"> </el-table-column>
      <el-table-column prop="path" label="路由地址"> </el-table-column>
      <el-table-column prop="url" label="组件路径"> </el-table-column>
      <el-table-column prop="code" label="权限字段"> </el-table-column>
      <el-table-column align="center" width="240" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="hasPerm('sys:menu:edit')"
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editMenu(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="hasPerm('sys:menu:delete')"
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteMenu(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增权限弹框 -->
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
          :model="addMenuModel"
          ref="addMenuForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item prop="type" label="菜单类型">
            <el-radio-group v-model="addMenuModel.type">
              <el-radio :label="'0'">目录</el-radio>
              <el-radio :label="'1'">菜单</el-radio>
              <el-radio :label="'2'">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="parentName" label="上级菜单">
            <el-input
              @click.native="selectParent"
              v-model="addMenuModel.parentName"
              placeholder="请选择上级菜单"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item prop="label" label="菜单名称">
            <el-input
              v-model="addMenuModel.label"
              placeholder="请填写菜单名称"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="addMenuModel.type != '2'" label="菜单图标">
            <el-input
              v-model="addMenuModel.icon"
              placeholder="请填写菜单图标"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="name"
            v-if="addMenuModel.type == '1'"
            label="路由名称"
          >
            <el-input
              v-model="addMenuModel.name"
              placeholder="请填写路由名称"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="path"
            v-if="addMenuModel.type != '2'"
            label="路由地址"
          >
            <el-input
              v-model="addMenuModel.path"
              placeholder="请填写路由地址"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="url"
            v-if="addMenuModel.type == '1'"
            label="组件路径"
          >
            <el-input
              v-model="addMenuModel.url"
              placeholder="请填写组件路径"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限字段">
            <el-input
              v-model="addMenuModel.code"
              placeholder="请填写权限字段"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限备注">
            <el-input
              v-model="addMenuModel.remark"
              placeholder="请填写权限备注"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限序号">
            <el-input-number
              v-model="addMenuModel.orderNum"
              placeholder="请填写权限序号"
              size="small"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 选择上级菜单 -->
    <sys-dialog
      :title="parentDialo.title"
      :height="parentDialo.height"
      :width="parentDialo.width"
      :visible="parentDialo.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="parmentList"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          empty-text="暂无数据"
          :show-checkbox="false"
          :highlight-current="true"
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
  </el-main>
</template>

<script>
import {
  getMenuListApi,
  getParentMenu,
  addMenuApi,
  editMenuApi,
  deleteMenuApi,
} from "../../../api/menu";
import SysDialog from "../../../components/SysDialog.vue";

export default {
  //注册组件
  components: { SysDialog },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      //上级菜单弹框属性
      parentDialo: {
        title: "选择上级菜单",
        height: 400,
        width: 280,
        visible: false,
      },
      //表单验证规则
      rules: {
        type: [
          {
            required: true,
            trigger: "change",
            message: "请选择菜单类型",
          },
        ],
        parentName: [
          {
            required: true,
            trigger: "change",
            message: "请选择上级菜单",
          },
        ],
        label: [
          {
            required: true,
            trigger: "change",
            message: "请填写菜单名称",
          },
        ],
        name: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由名称",
          },
        ],
        path: [
          {
            required: true,
            trigger: "change",
            message: "请填写路由路径",
          },
        ],
        url: [
          {
            required: true,
            trigger: "change",
            message: "请填写组件路径",
          },
        ],
      },
      //新增或编辑表单数据域
      addMenuModel: {
        editType: "", // 0 新增 1：编辑
        parentId: "",
        id: "",
        label: "",
        type: "",
        parentName: "",
        icon: "",
        name: "",
        path: "",
        url: "",
        code: "",
        remark: "",
        orderNum: "",
      },
      //新增或编辑弹框属性
      addDialog: {
        title: "",
        height: 310,
        width: 610,
        visible: false,
      },
      //表格高度
      tableHeight: 0,
      //菜单数据列表
      menuList: [],
      parmentList: [],
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    //树节点加号和减号的点击事件
    openBtn(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
    //上级菜单点击事件
    handleNodeClick(data) {
      console.log(data);
      this.addMenuModel.parentId = data.id;
      this.addMenuModel.parentName = data.label;
      console.log(this.addMenuModel);
    },
    //选择上级菜单确认事件
    onParentConfirm() {
      this.parentDialo.visible = false;
    },
    //取消上级菜单选择
    onParentClose() {
      this.parentDialo.visible = false;
    },
    //选择上级菜单
    async selectParent() {
      let { data: res } = await getParentMenu();
      console.log(res);
      if (res && res.code == 200) {
        this.parmentList = res.data;
      }
      console.log(this.parmentList);
      this.parentDialo.visible = true;
    },
    //新增或编辑确认事件
    onConfirm() {
      this.$refs.addMenuForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          if (this.addMenuModel.editType == "0") {
            //新增
            res = await addMenuApi(this.addMenuModel);
          } else {
            //编辑
            res = await editMenuApi(this.addMenuModel);
          }

          if (res.data && res.data.code == 200) {
            //刷新数据列表
            this.getMenuList();
            this.$message.success(res.data.msg);
            this.addDialog.visible = false;
          }
        }
      });
    },
    //新增获取编辑取消
    onClose() {
      this.addDialog.visible = false;
    },
    //新增按钮
    addMenu() {
       //清空表单
      this.$resetForm("addMenuForm", this.addMenuModel);
      this.addDialog.title = "新增权限";
      this.addDialog.visible = true;
      //设为编辑状态
      this.addMenuModel.editType = "0";
    },
    //删除按钮
    async deleteMenu(row) {
      console.log(row);
      let confirm = await this.$message.confirm("确定删除该数据吗?");
      if (confirm) {
        let parm = {
          id: row.id,
        };
        let { data: res } = await deleteMenuApi(parm);
        if (res && res.code == 200) {
          //刷新列表
          this.getMenuList();
          this.$message.success(res.msg);
        }
      }
    },
    //编辑按钮
    editMenu(row) {
      // console.log(row);
      //清空表单
      this.$resetForm("addMenuForm", this.addMenuModel);
      //把当前编辑的数据复制到表单数据域
      this.$objCoppy(row, this.addMenuModel);
      //设为编辑状态
      this.addMenuModel.editType = "1";
      //设置弹框属性
      this.addDialog.title = "编辑权限";
      this.addDialog.visible = true;
      console.log(this.addMenuModel);
    },
    //获取菜单数据
    async getMenuList() {
      let { data: res } = await getMenuListApi();
      if (res && res.code == 200) {
        this.menuList = res.data;
        console.log(this.menuList);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 230;
    });
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