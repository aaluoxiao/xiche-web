<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceSn">
        <el-input
          v-model="queryParams.deviceSn"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="加盟账号" prop="franchiseeAccount">
        <el-input
          v-model="queryParams.franchiseeAccount"
          placeholder="请输入加盟账号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="运营状态" prop="operatingStatus">
        <el-select v-model="queryParams.operatingStatus" placeholder="请选择运营状态" clearable>
          <el-option
            v-for="dict in device_operate_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="站点信息" prop="siteInfo">

        <el-select v-model="queryParams.siteInfo" placeholder="请选择站点信息" clearable>
          <el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.name"></el-option>

        </el-select>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['merchant:device:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['merchant:device:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['merchant:device:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['merchant:device:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="设备ID" align="center" prop="id" /> -->
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="设备类型" align="center" prop="deviceType" />
      <el-table-column label="设备编号" align="center" prop="deviceSn" />
      <!-- <el-table-column label="加盟账号" align="center" prop="franchiseeAccount" /> -->
      
      <el-table-column label="运营状态" align="center" prop="operatingStatus">
        <template #default="scope">
          <span :style="{ color: getStatusColor(scope.row.operatingStatus) }">
          <dict-tag :options="device_operate_status" :value="scope.row.operatingStatus"/>
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="投放时间" align="center" prop="deploymentTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.deploymentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="站点信息" align="center" prop="siteInfo" />
      <el-table-column label="设备状态" align="center" prop="deviceStatus">
        <template #default="scope">
          <span :style="{ color: getStatusColor(scope.row.deviceStatus) }">
            {{ scope.row.deviceStatus === 1 ? '工作中' : 
               scope.row.deviceStatus === 2 ? '空闲中' : 
               scope.row.deviceStatus === 3 ? '已停用' : '' }}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['merchant:device:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['merchant:device:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备列表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="deviceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceSn">
          <el-input v-model="form.deviceSn" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="加盟账号" prop="franchiseeAccount">
          <el-input v-model="form.franchiseeAccount" placeholder="请输入加盟账号" />
        </el-form-item>
        <el-form-item label="投放时间" prop="deploymentTime">
          <el-date-picker clearable
            v-model="form.deploymentTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择投放时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="运营状态" prop="operatingStatus">
          <el-radio-group v-model="form.operatingStatus">
            <el-radio
              v-for="dict in device_operate_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="站点信息" prop="siteInfo">
        <!-- <el-input
          v-model="queryParams.siteInfo"
          placeholder="请输入站点信息"
          clearable
          @keyup.enter="handleQuery"
        /> -->

        <el-select v-model="form.siteInfo" placeholder="请选择站点信息">
          <el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.name"></el-option>

        </el-select>

      </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Device">
import { listDevice, getDevice, delDevice, addDevice, updateDevice } from "@/api/merchant/device";
import { listStation} from "@/api/merchant/station";
import { loadAllParams } from "@/api/page";

const { proxy } = getCurrentInstance();
const { device_operate_status } = proxy.useDict('device_operate_status');

const deviceList = ref([]);
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
    deviceName: null,
    deviceType: null,
    deviceSn: null,
    franchiseeAccount: null,
    deploymentTime: null,
    operatingStatus: null,
    siteInfo: null,
    deviceStatus: null
  },
  rules: {
    deviceName: [
      { required: true, message: "设备名称不能为空", trigger: "blur" }
    ],
    franchiseeAccount: [
      { required: true, message: "加盟账号不能为空", trigger: "blur" }
    ],
  }
});





const { queryParams, form, rules } = toRefs(data);


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

/** 查询设备列表列表 */
function getList() {
  loading.value = true;
  listDevice(queryParams.value).then(response => {
    deviceList.value = response.rows;
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
    deviceName: null,
    deviceType: null,
    deviceSn: null,
    franchiseeAccount: null,
    deploymentTime: null,
    operatingStatus: null,
    createTime: null,
    updateTime: null,
    createOwner: null,
    updateOwner: null,
    remark: null,
    siteInfo: null,
    deviceStatus: null
  };
  proxy.resetForm("deviceRef");
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
  title.value = "添加设备列表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getDevice(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备列表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deviceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDevice(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDevice(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除设备列表编号为"' + _ids + '"的数据项？').then(function() {
    return delDevice(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('merchant/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}

/**
 * 获取站点列表
 */
const stationList = ref([]);
function getStationList() {
  listStation(loadAllParams).then(response => {
    stationList.value = response.rows;
  });
}
getStationList()
getList();
</script>
