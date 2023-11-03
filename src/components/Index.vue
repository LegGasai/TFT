<template>
  <div class="container">

    <div class="champion-box">
      <el-row justify="space-around">
        <el-upload
            class="upload-demo"
            ref="uploadChampion"
            action="#"
            :on-change="handleChangeChampion"
            :auto-upload="false"
            :limit="1"
            accept=".json,.JSON"
            :show-file-list="false"
        >
          <el-button size="small">导入英雄数据</el-button>
        </el-upload>
        <el-upload
            class="upload-demo"
            ref="uploadItem"
            action="#"
            :on-change="handleChangeItem"
            :auto-upload="false"
            :limit="1"
            accept=".json,.JSON"
            :show-file-list="false"
        >
          <el-button size="small">导入装备数据</el-button>
        </el-upload>

      </el-row>
      <el-divider/>
      <el-row>
        <el-col :span="12">
          <el-row justify="space-around">
            <el-col :span="10">
              <div>
                <el-button size="small" @click="openChampionDialog=true">切换英雄</el-button>
              </div>

            </el-col>
            <el-col :span="8">
              <el-select v-model="level"  placeholder="选择星级" size="small" width="100px" @change="updateChampionInfo">
                <el-option
                    v-for="item in levelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>

            </el-col>
          </el-row>
          <el-row justify="center">
            <div class="champion-icon">
              <el-tooltip
                  v-if="champion"
                  class="box-item"
                  effect="dark"
                  :content="champion.abilityDescription"
                  placement="top"
              >
                <img v-if="champion" class="champion-pic" :src="champion.icon" :style="getAvatarStyle(champion.cost)"/>
              </el-tooltip>

              <div>
                {{champion==undefined?"":champion.name}}
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12">
          属性
          <el-divider/>
          <ul class="info-list" v-if="champion">
            <li>
              <img src="https://rerollcdn.com/ui/icon-hp.svg" style="width: 14px;display: inline-block">
              生命值 : <el-text tag="b" size="large">{{champion.health}}</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-ad.svg" style="width: 14px;display: inline-block">
              攻击 : <el-text tag="b" size="large">{{champion.damage}}</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-ar.svg" style="width: 14px;display: inline-block">
              护甲 : <el-text tag="b" size="large">{{champion.armor}}</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-mr.svg" style="width: 14px;display: inline-block">
              魔抗 : <el-text tag="b" size="large">{{champion.mr}}</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-as.svg" style="width: 14px;display: inline-block">
              攻速 : <el-text tag="b" size="large">{{champion.initialAtkSpeed}}</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-cr.svg" style="width: 14px;display: inline-block">
              暴击率 : <el-text tag="b" size="large">{{champion.critRate*100}}%</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-ap.svg" style="width: 14px;display: inline-block;color: black">
              攻击范围 : <el-text tag="b" size="large">{{champion.range}}</el-text>
            </li>
            <li>
              <img src="https://rerollcdn.com/ui/icon-mana.svg" style="width: 14px;display: inline-block">
              法力值 : <el-text tag="b" size="large">{{champion.initialMana}}/{{champion.mana}}</el-text>
            </li>

          </ul>
        </el-col>
      </el-row>
      <el-divider/>
      <div class="itempick-box">
        <div class="item-single-box">
          <el-tag
              class="mx-1"
              effect="dark"
              size="large"
              type="info"
          >出装1</el-tag>
          <div v-for="(index) in 3" class="item-box">
            <div @click="pickItem(0,index-1)">
              <el-tooltip
                  v-if="itemsPick1[index-1]"
                  class="box-item"
                  effect="dark"
                  :content="itemsPick1[index-1].description"
                  placement="top"
              >
                <img v-if="itemsPick1[index-1]" :src="itemsPick1[index-1].icon" class="item-avatar" />
              </el-tooltip>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </div>

          </div>
        </div>
        <div class="item-single-box">
          <el-tag
              class="mx-1"
              effect="dark"
              size="large"
              type="info"
          >出装2</el-tag>
          <div v-for="(index) in 3" class="item-box">
            <div @click="pickItem(1,index-1)">
              <el-tooltip
                  v-if="itemsPick2[index-1]"
                  class="box-item"
                  effect="dark"
                  :content="itemsPick2[index-1].description"
                  placement="top"
              >
                <img v-if="itemsPick2[index-1]" :src="itemsPick2[index-1].icon" class="item-avatar" />
              </el-tooltip>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </div>

          </div>
        </div>
        <div class="item-single-box">
          <el-tag
              class="mx-1"
              effect="dark"
              size="large"
              type="info"
          >出装3</el-tag>
          <div v-for="(index) in 3" class="item-box">
            <div @click="pickItem(2,index-1)">
              <el-tooltip
                  v-if="itemsPick3[index-1]"
                  class="box-item"
                  effect="dark"
                  :content="itemsPick3[index-1].description"
                  placement="top"
              >
                <img v-if="itemsPick3[index-1]" :src="itemsPick3[index-1].icon" class="item-avatar" />
              </el-tooltip>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </div>

          </div>
        </div>

      </div>

    </div>
    <div class="simulation-box">
      <div class="chart-box">
        <e-charts-chart v-if="chartOptions" :options="chartOptions" />
      </div>
      <div class="target-box">
        <div>
          目标护甲:
          <el-input-number
              v-model="targetArmor"
              :min="0"
              :max="1000"
              :step="10"
              controls-position="right"
              size="default"
          />
        </div>
        <div>
          目标魔抗:
          <el-input-number
              v-model="targetMr"
              :min="0"
              :max="1000"
              :step="10"
              controls-position="right"
              size="default"
          />
        </div>
      </div>
      <div class="btn-box">
        <el-button @click="startSimulation" size="large">开始模拟</el-button>
        <el-button @click="abilitySimulation" size="large">仅技能</el-button>
        <el-button @click="clearItems" size="large">清空装备</el-button>
      </div>

    </div>


    <el-dialog title="选择英雄" v-model="openChampionDialog" append-to-body width="1000px">
      <el-radio-group v-model="cost" size="large" >
        <el-radio-button :label="void 0" >全部</el-radio-button>
        <el-radio-button :label="1" >一费卡</el-radio-button>
        <el-radio-button :label="2" >二费卡</el-radio-button>
        <el-radio-button :label="3" >三费卡</el-radio-button>
        <el-radio-button :label="4" >四费卡</el-radio-button>
        <el-radio-button :label="5" >五费卡</el-radio-button>
      </el-radio-group>
      <el-divider></el-divider>
      <el-empty v-if="championsListShow.length==0" description="请先导入英雄数据">
        <el-upload
            class="upload-demo"
            ref="uploadChampion"
            action="#"
            :on-change="handleChangeChampion"
            :auto-upload="false"
            :limit="1"
            accept=".json,.JSON"
            :show-file-list="false"
        >
          <el-button size="default" type="primary">导入英雄数据</el-button>
        </el-upload>
      </el-empty>
      <div class="champion-list-box" v-else>
        <div v-for="(champion,index) in championsListShow" :key="champion.id" class="champion-single" >

          <img :src="champion.icon" class="champion-avatar" :style="getAvatarStyle(champion.cost)" @click="pickChampion(champion.id)">

          <div>
            {{champion.name.split(" ")[1]}}
          </div>

        </div>
      </div>
    </el-dialog>
    <el-dialog title="选择装备" v-model="openItemDialog" append-to-body width="1000px">
      <el-radio-group v-model="itemType" size="large">
        <el-radio-button v-for="(itemType,index) in itemTypeList" :key="itemType.value" :label="itemType.value">{{itemType.label}}</el-radio-button>
      </el-radio-group>
      <el-divider></el-divider>
      <el-empty v-if="itemsListShow.length==0" description="请先导入装备数据">
        <el-upload
            class="upload-demo"
            ref="uploadItem"
            action="#"
            :on-change="handleChangeItem"
            :auto-upload="false"
            :limit="1"
            accept=".json,.JSON"
            :show-file-list="false"
        >
          <el-button size="default" type="primary">导入装备数据</el-button>
        </el-upload>
      </el-empty>
      <div class="champion-list-box" v-else>
        <div v-for="(item,index) in itemsListShow" :key="item.id" class="champion-single" >
          <el-tooltip
              class="box-item"
              effect="dark"
              :content="item.description"
              placement="top"
          >
            <img :src="item.icon" class="item-list-avatar" @click="confirmItem(item)">
          </el-tooltip>

          <div>
            {{item.name}}
          </div>

        </div>
      </div>
    </el-dialog>
  </div>

</template>


<script setup>
import { ElMessage } from 'element-plus';
import { ref ,getCurrentInstance,toRaw,computed} from 'vue';
import { getChampionInfo,getSimulation,getAbilitySimulation} from '../api/champion'
import EChartsChart from './EChartsChart.vue';
import {levels} from '../api/level'
import {itemTypes} from '../api/itemType'
const { proxy } = getCurrentInstance();

defineProps({

})
const row = ref();
const col = ref();
const openChampionDialog = ref(false);
const openItemDialog = ref(false);
const count = ref(0)
const cost = ref();
const itemType = ref();

const itemsList = ref([])
const championsList = ref([])

const itemsListShow = computed(()=>{
  if (itemType.value!=undefined){
    return itemsList.value.filter((item)=>{
      return item.type === itemType.value
    })
  }else {
    return [...itemsList.value]
  }
})

const championsListShow = computed(()=>{
  if(cost.value){
    return championsList.value.filter((item)=>{
      return item.cost === cost.value;
    })
  }else{
    return [...championsList.value];
  }
})

const levelList = ref([])
const itemTypeList = ref([])
const level = ref(1);
const championId = ref();
const champion = ref();
const itemsPick1 = ref([undefined,undefined,undefined])
const itemsPick2 = ref([undefined,undefined,undefined])
const itemsPick3 = ref([undefined,undefined,undefined])
const simulationList1= ref();
const simulationList2= ref();
const simulationList3= ref();
const abilityDamageMap1= ref();
const abilityDamageMap2= ref();
const abilityDamageMap3= ref();
const chartOptions = ref();
const targetArmor = ref(0);
const targetMr = ref(0);

const addChampionAttr = ref({
  healthAddition: 0,
  damageAddition: 0.0,
  atkSpeedAddition:0.0,
  atkSpeed:0,
  abilityPowerAddition:0.0,
  abilityPhysicalDamage:0.0,
  abilityMagicDamage:0,
  abilityRealDamage:0,
  abilityCrit:0,
  sunder:0.0,
  shred:0.0,
  itemList:[],
})

// async function getSimulation(championId,level,itemIds,targetArmor,targetMr){
//   return await proxy.$http.get("/champion/getSimulation",{
//     params:{
//       championId: championId,
//       level: level,
//       itemIds: itemIds+"",
//       targetArmor: targetArmor,
//       targetMr: targetMr
//     }
//   })
// }
// async function getAbilityDamage(championId,level,itemIds,targetArmor,targetMr){
//   return await proxy.$http.get("/champion/getAbilitySimulation",{
//     params:{
//       championId: championId,
//       level: level,
//       itemIds: itemIds+"",
//       targetArmor: targetArmor,
//       targetMr: targetMr
//     }
//   })
// }

function handleChangeChampion(file,fileList){
  const fileReader = new FileReader();
  fileReader.readAsText(file.raw, "UTF-8");
  fileReader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    championsList.value = data
    championsListShow.value = data
    ElMessage({
      message: '导入成功！',
      type: 'success',
    })
  };
}
function handleChangeItem(file,fileList){
  const fileReader = new FileReader();
  fileReader.readAsText(file.raw, "UTF-8");
  fileReader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    itemsList.value = data
    itemsListShow.value = data
    ElMessage({
      message: '导入成功！',
      type: 'success',
    })
  };
}
function getItemType(){
    itemTypeList.value=itemTypes;
}
function getLevel(){
  levelList.value = levels;
}

function getAvatarStyle(cost){
  if (cost === 5) {
    return { border: '3px solid #b89d27' };
  } else if (cost === 4) {
    return { border: '3px solid #893088' };
  } else if (cost === 3) {
    return { border: '3px solid #12407c' };
  } else if (cost === 2) {
    return { border: '3px solid #156831' };
  } else if (cost === 1) {
    return { border: '3px solid #213042' };
  } else {
    return {}; // Default style
  }
}

function updateChampionInfo(){
  let championPick = getChampionById(championId.value)
  getChampionInfo(championPick,level.value)
  champion.value = championPick
}

function pickChampion(id){
  championId.value = id;
  const championPick = getChampionById(id)
  updateChampionInfo();
  openChampionDialog.value = false;
}
function getItemById(id){
  let itemPick = itemsList.value.find((item)=>{
    return item.id === id
  })
  return itemPick
}
function getChampionById(id){
  let championPick = championsList.value.find((item)=>{
    return item.id === id
  })
  championPick = {...championPick,...addChampionAttr.value};
  return championPick
}
/*记录装备位置*/
function pickItem(r,c){
  row.value = r;
  col.value = c;
  openItemDialog.value=true;
}
/*回填装备*/
function confirmItem(item){
  if (row.value==0){
    itemsPick1.value[col.value]=item;
  }else if (row.value==1){
    itemsPick2.value[col.value]=item;
  }else if (row.value==2){
    itemsPick3.value[col.value]=item;
  }
  openItemDialog.value=false;
}
function abilitySimulation(){
  chartOptions.value = undefined;
  if (championId.value&&level.value){
    let _champion1 = {...getChampionById(championId.value)}
    let _champion2 =  {...getChampionById(championId.value)}
    let _champion3 = {...getChampionById(championId.value)}
    const _itemsPick1 = []
    itemsPick1.value.forEach((item)=>{
      if (item){
        _itemsPick1.push(toRaw(item))
      }
    })
    const _itemsPick2 = []
    itemsPick2.value.forEach((item)=>{
      if (item){
        _itemsPick2.push(toRaw(item))
      }
    })
    const _itemsPick3 = []
    itemsPick3.value.forEach((item)=>{
      if (item){
        _itemsPick3.push(toRaw(item))
      }
    })

    const simulation1=getAbilitySimulation(_champion1,level.value,_itemsPick1,targetArmor.value,targetMr.value)
    const simulation2=getAbilitySimulation(_champion2,level.value,_itemsPick2,targetArmor.value,targetMr.value)
    const simulation3=getAbilitySimulation(_champion3,level.value,_itemsPick3,targetArmor.value,targetMr.value)


    abilityDamageMap1.value=simulation1
    abilityDamageMap2.value=simulation2
    abilityDamageMap3.value=simulation3
    drawChartAbility();

  }else{
    ElMessage({
      message: '请选择英雄和星级',
      type: 'warning',
    })
  }
}
function startSimulation(){
  chartOptions.value = undefined;
  if (championId.value&&level.value){
    if (champion.value.isSimulation==0){
      ElMessage({
        message: '该英雄不支持伤害模拟',
        type: 'warning',
      })
      return
    }
    let _champion1 = {...getChampionById(championId.value)}
    let _champion2 =  {...getChampionById(championId.value)}
    let _champion3 = {...getChampionById(championId.value)}
    const _itemsPick1 = []
    itemsPick1.value.forEach((item)=>{
      if (item){
        _itemsPick1.push(toRaw(item))
      }
    })
    const _itemsPick2 = []
    itemsPick2.value.forEach((item)=>{
      if (item){
        _itemsPick2.push(toRaw(item))
      }
    })
    const _itemsPick3 = []
    itemsPick3.value.forEach((item)=>{
      if (item){
        _itemsPick3.push(toRaw(item))
      }
    })

    const simulation1=getSimulation(_champion1,level.value,_itemsPick1,targetArmor.value,targetMr.value)
    const simulation2=getSimulation(_champion2,level.value,_itemsPick2,targetArmor.value,targetMr.value)
    const simulation3=getSimulation(_champion3,level.value,_itemsPick3,targetArmor.value,targetMr.value)

    simulationList1.value=simulation1;
    simulationList2.value=simulation2;
    simulationList3.value=simulation3;
    drawChart();
  }else{
    ElMessage({
      message: '请选择英雄和星级',
      type: 'warning',
    })
  }

}
/**生成伤害图**/
function drawChart(){
  chartOptions.value = undefined;
  const xList = []
  for(var i =0;i<=30;i++){
    xList.push(i);
  }
  const pointList1 = []
  const pointList2 = []
  const pointList3 = []
  for(var i=0;i<simulationList1.value["timestamp"].length;i++){
    pointList1.push([simulationList1.value["timestamp"][i],simulationList1.value["totalDamageList"][i]]);
  }
  for(var i=0;i<simulationList2.value["timestamp"].length;i++){
    pointList2.push([simulationList2.value["timestamp"][i],simulationList2.value["totalDamageList"][i]]);
  }
  for(var i=0;i<simulationList3.value["timestamp"].length;i++){
    pointList3.push([simulationList3.value["timestamp"][i],simulationList3.value["totalDamageList"][i]]);
  }
  chartOptions.value={
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    title: {
      text: `${champion.value.name}-${level.value}星级-出装伤害对比图`,
      x:'center',
      y:'top',
    },
    legend:{
      x:'center',
      y:'bottom',
      data:["出装1","出装2","出装3"]
    },
    xAxis: {
      type: 'value',
      data: xList
    },
    yAxis: {
      type: 'value'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      {
        name: '出装1',
        type: 'line',
        data: pointList1
      },
      {
        name: '出装2',
        type: 'line',
        data: pointList2
      },
      {
        name: '出装3',
        type: 'line',
        data: pointList3
      },
    ]
  }
}
/**生成技能伤害图**/
function drawChartAbility(){
  chartOptions.value = undefined;
  const pickDamage1 = [abilityDamageMap1.value.totalDamage,abilityDamageMap1.value.physicalDamage,abilityDamageMap1.value.magicDamage,abilityDamageMap1.value.realDamage];
  const pickDamage2 = [abilityDamageMap2.value.totalDamage,abilityDamageMap2.value.physicalDamage,abilityDamageMap2.value.magicDamage,abilityDamageMap2.value.realDamage];
  const pickDamage3 = [abilityDamageMap3.value.totalDamage,abilityDamageMap3.value.physicalDamage,abilityDamageMap3.value.magicDamage,abilityDamageMap3.value.realDamage];
  chartOptions.value = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    title: {
      text: `${champion.value.name}-${level.value}星级-技能伤害对比图`,
      x:'center',
      y:'top',
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    legend: {
      x:'center',
      y:'bottom',
      data: ['出装1', '出装2', '出装3']
    },
    xAxis: {
      type: 'category',
      data: ['总伤害','物理伤害', '魔法伤害', '真实伤害',] ,// x坐标序列
      axisLabel: {
        color: function (value, index) {
          // 根据索引设置不同的颜色
          if (index === 0) {
            return 'black'; // 总伤害蓝色
          } else if (index === 1) {
            return 'red'; // 物理伤害红色
          } else if (index === 2) {
            return 'blue'; // 魔法伤害绿色
          } else if (index === 3) {
            return 'grey'; // 真实伤害白色
          }
        }
      }
    },
    yAxis: {
      type: 'value'
    },
    series:[
      { name:'出装1',
        data: pickDamage1,
        type: 'bar',
        label: {
          show: true, // 显示标签
          position: 'top' // 标签位置
        },

      },
      { name:'出装2',
        data: pickDamage2,
        type: 'bar',
        label: {
          show: true, // 显示标签
          position: 'top' // 标签位置
        },
      },
      { name:'出装3',
        data: pickDamage3,
        type: 'bar',
        label: {
          show: true, // 显示标签
          position: 'top' // 标签位置
        },
      }
    ]
  }

}
/**清除所选装备**/
function clearItems(){
  itemsPick1.value = [undefined,undefined,undefined]
  itemsPick2.value = [undefined,undefined,undefined]
  itemsPick3.value = [undefined,undefined,undefined]
}
getLevel()
getItemType()
</script>

<style scoped>

.container{

  width: 95%;
  height: 97%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;

}
.champion-box{
  border: 2px solid red;
  border-radius: 25px;
  width: 50%;
  margin: 20px;
  padding: 10px;

}
.simulation-box{
  border: 2px solid red;
  border-radius: 25px;
  width: 50%;
  margin: 20px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.champion-icon{
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 90%;
  height: 30vh;
  align-items: center;
}
.champion-pic{
  height: 150px;
  width: 150px;
  border-radius: 50%;
}
.champion-list-box{
  overflow: auto;
  width: 100%;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content:flex-start;
}
.champion-single{
  width: 12.5%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.champion-avatar{
  cursor: pointer;
  margin: 15px;
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}
.item-list-avatar{
  cursor: pointer;
  margin: 15px;
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.info-list{
  list-style: none;
  padding-left: 5px;
}
.info-list li{
  margin-bottom: 5px;
}
.itempick-box{

  height: 35%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.item-single-box{
  height: 30%;

  display: flex;
  justify-content: space-around;
  align-items: center;
}
.item-box{

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.avatar-uploader-icon {
  border: 1px dashed var(--el-border-color);
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
.item-avatar{
  width: 60px;
  height: 60px;
}
.chart-box{

  height: 70%;

}
.target-box{

  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px;
  padding: 10px;
}
.btn-box{

  display: flex;
  justify-content: space-around;
  margin: 10px;
  padding: 10px;
}

</style>
