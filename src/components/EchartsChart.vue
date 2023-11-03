<template>
  <div ref="chart" class="echarts-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EChartsChart',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null
    };
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.chartInstance.setOption(this.options);
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  //数据变化，重新渲染图表
  methods:{
    drawCharts() {
      this.chartInstance.clear()
      this.chartInstance.setOption(this.options)
    },
  },
  watch: {
    options: {
      handler(oldVal, newVal) {
        this.drawCharts()
      },
      deep: true,
    },
  },
};
</script>

<style>
.echarts-chart {
  width: 100%;
  height: 100%;
}
</style>