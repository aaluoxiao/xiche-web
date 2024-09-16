<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="加盟账号" prop="franchiseeAccount">
        <el-input v-model="queryParams.franchiseeAccount" placeholder="请输入加盟账号" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input v-model="queryParams.contactName" placeholder="请输入联系人" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="联系电话" prop="contactPhone">
        <el-input v-model="queryParams.contactPhone" placeholder="请输入联系电话" clearable @keyup.enter="handleQuery" />
      </el-form-item> -->
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入公司名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="公司地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入公司地址" clearable @keyup.enter="handleQuery" />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd"
          v-hasPermi="['merchant:franchisee:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['merchant:franchisee:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['merchant:franchisee:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['merchant:franchisee:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="franchiseeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="加盟商ID" align="center" prop="id" /> -->
      <el-table-column label="加盟账号" align="center" prop="franchiseeAccount" />
      <el-table-column label="联系人" align="center" prop="contactName" />
      <el-table-column label="联系电话" align="center" prop="contactPhone" />
      <el-table-column label="公司名称" align="center" prop="name" />
      <el-table-column label="公司地址" align="center" prop="address" />
      <el-table-column label="设备数量" align="center" prop="equipmentCount">
        <template #default="scope">
          <span v-if="scope.row.equipmentCount > 0" @click="handleClick(scope.row.franchiseeAccount)"
            :style="{ cursor: 'pointer', color: 'blue' }">
            {{ scope.row.equipmentCount }}
          </span>
          <span v-else :style="{ color: 'inherit' }">
            {{ scope.row.equipmentCount }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['merchant:franchisee:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['merchant:franchisee:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改加盟列表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="franchiseeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="加盟账号" prop="franchiseeAccount" v-if="!form.id">
          <el-input v-model="form.franchiseeAccount" placeholder="请输入加盟账号" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 设备列表 -->
    <el-dialog title="设备列表" v-model="franchiseeRefOpen" width="80%" append-to-body>
      <el-table :data="vmList">
        <el-table-column label="设备名称" align="center" prop="deviceName" />
        <el-table-column label="设备类型" align="center" prop="deviceType" />
        <el-table-column label="设备编号" align="center" prop="deviceSn" />
        <el-table-column label="投放时间" align="center" prop="deploymentTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.deploymentTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="运营状态" align="center" prop="operatingStatus">
          <template #default="scope">
            <dict-tag :options="device_operate_status" :value="scope.row.operatingStatus" />
          </template>
        </el-table-column> -->
        <el-table-column label="设备状态" align="center" prop="deviceStatus">
          <template #default="scope">
            <span :style="{ color: getStatusColor(scope.row.deviceStatus) }">
              {{ scope.row.deviceStatus === 1 ? '工作中' : '' }}
              {{ scope.row.deviceStatus === 2 ? '空闲中' : '' }}
              {{ scope.row.deviceStatus === 3 ? '已停用' : '' }}
            </span>
            <!-- <dict-tag :options="device_status" :value="scope.row.deviceStatus"/> -->
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script setup name="Franchisee">
import { listFranchisee, getFranchisee, delFranchisee, addFranchisee, updateFranchisee } from "@/api/merchant/franchisee";
import { listDevice } from "@/api/merchant/device";
import { ref } from "vue";



const { proxy } = getCurrentInstance();
const { device_operate_status } = proxy.useDict('device_operate_status');

const franchiseeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    franchiseeAccount: null,
    contactName: null,
    contactPhone: null,
    name: null,
    address: null,
  },
  rules: {
    franchiseeAccount: [
      { required: true, message: "加盟账号不能为空", trigger: "blur" }
    ],
  }
});

function getStatusColor(status) {
  switch (status) {
    case '已停用':
      return 'red';

    case 1:
      return 'green';
    case 2:
      return 'black';
    case 3:
      return 'red';
    default:
      return 'black'; // 默认颜色
  }
}


const franchiseeRefOpen = ref(false);
const vmList = ref([]);

function handleClick(franchiseeAccount) {
  console.log(franchiseeAccount);
  // this.$router.push({ name: 'device', params: { franchiseeAccount } });

  listDevice({ franchiseeAccount }).then(response => {
    // franchiseeList.value = response.rows;
    vmList.value = response.rows;
    console.log(vmList);
    franchiseeRefOpen.value = true;


  })
}

const { queryParams, form, rules } = toRefs(data);

/** 查询加盟列表列表 */
function getList() {
  loading.value = true;
  listFranchisee(queryParams.value).then(response => {
    franchiseeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    franchiseeAccount: null,
    contactName: null,
    contactPhone: null,
    name: null,
    address: null,
    equipmentCount: null,
    createTime: null,
    updateTime: null,
    createOwner: null,
    updateOwner: null,
    remark: null
  };
  proxy.resetForm("franchiseeRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加加盟列表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFranchisee(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改加盟人信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["franchiseeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFranchisee(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFranchisee(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  console.log("test" + JSON.stringify(row))
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除加盟列表编号为"' + _ids + '"的数据项？').then(function () {
    return delFranchisee(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('merchant/franchisee/export', {
    ...queryParams.value
  }, `franchisee_${new Date().getTime()}.xlsx`)
}

getList();
</script>
