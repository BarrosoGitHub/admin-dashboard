<template>
  <div class="bg-modal-color-gradient rounded-2xl shadow-sm border border-color transition-all duration-30 hover:shadow-lg overflow-hidden">
    <div class="p-6 pb-8">
      <h3 class="text-lg font-semibold text-color">{{ title }}</h3>
      <p class="text-sm text-gray-400 mt-1">{{ subtitle }}</p>
    </div>
    <div class="overflow-hidden">
      <apexchart 
        type="area" 
        height="210" 
        :options="chartOptions" 
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const apexchart = VueApexCharts;

const props = defineProps({
  title: {
    type: String,
    default: 'Balance Overview'
  },
  subtitle: {
    type: String,
    default: 'This Year Sales'
  },
  data: {
    type: Array,
    default: () => [85, 100, 75, 90, 85, 80, 87]
  },
  labels: {
    type: Array,
    default: () => []
  },
  color: {
    type: String,
    default: '#794dff'
  }
});

const series = computed(() => [{
  name: 'series2',
  data: props.data
}]);

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 210,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    background: 'transparent',
    sparkline: {
      enabled: true
    },
    offsetX: 0,
    offsetY: 1,
    animations: {
      enabled: true
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2,
    colors: [props.color]
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: ['rgba(188, 166, 255, 0.5)'],
      inverseColors: false,
      opacityFrom: 0.65,
      opacityTo: 0.5,
      stops: [0, 100]
    }
  },
  colors: [props.color],
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false,
    min: 0
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
  tooltip: {
    enabled: true,
    theme: 'light',
    x: {
      show: true,
      format: 'dd/MM/yy HH:mm'
    }
  },
  legend: {
    show: false
  }
}));
</script>
