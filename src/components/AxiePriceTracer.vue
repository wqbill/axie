<template>
  <v-row>
    <template v-for="axie in axies">
      <v-col cols="2" v-if="axie" :key="axie.index">
        <v-card elevation="2">
          <a :href="axie.href">
            <v-img :src="axie.src"></v-img>
          </a>
          <v-divider></v-divider>
          {{ axie.tag }}
          <v-divider></v-divider>
          AVG:{{ axie.avg }}
          <v-divider></v-divider>
          CUR:{{ axie.currentPrices[0] / 1e18 }}
          <v-divider></v-divider>
          2ND:{{ axie.currentPrices[1] / 1e18 }}
          <v-divider></v-divider>
          3RD:{{ axie.currentPrices[2] / 1e18 }}
          <v-divider></v-divider>
          4TH:{{ axie.currentPrices[3] / 1e18 }}
          <v-divider></v-divider>
          5TH:{{ axie.currentPrices[4] / 1e18 }}
          <v-divider></v-divider>
          DIFF:{{ axie.diff }}%
          <v-divider></v-divider>
          TOTAL:{{ axie.total }}
          <div :id="axie.configId"></div>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
// import {Decimal} from "decimal";

import Vue from "vue";

export default {
  name: 'AxiePriceTracer',

  data: () => ({
    first: 0,
    axies: [],
    ws: "ws://localhost/ws",
    socket: null,
    map: null,
    threshold: [0.085, 0.085, 0.1275],
    configDatetimeMap: new Map(),
    connecting: false,
    websocketData: '123',
    option: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category',
        data: ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: true
        }
      },
      series: [{
        data: null,
        type: 'line',
        smooth: true
      }],
    },
  }),
  mounted() {
    this.openSocket();
  },
  methods: {
    openSocket() {
      let _vue = Vue;
      // let _ECharts = ECharts;
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log('websocket not supported')
      } else {
        this.socket = new WebSocket(this.ws);
        this.socket.onopen = function () {
          console.log("websocket open");
          // 保证重连后也会提醒
          this.map = new Map();
        };
        this.socket.onmessage = function (msg) {
          let jsonData = _this.tryParse(msg.data);
          if (!jsonData) return;
          _this.websocketData = jsonData;
          let configId = parseInt(jsonData.data.configId);
          let axie = {
            configId: jsonData.data.configId,
            src: jsonData.data.axies[0].image,
            href: "https://marketplace.axieinfinity.com/axie/" + jsonData.data.axies[0].id,
            tag: jsonData.data.tag,
            avg: jsonData.data.avgPrices[11],
            currentPrices: [jsonData.data.axies[0].auction.currentPrice, jsonData.data.axies[1].auction.currentPrice, jsonData.data.axies[2].auction.currentPrice, jsonData.data.axies[3].auction.currentPrice, jsonData.data.axies[4].auction.currentPrice],
            diff: Math.round((1 - (jsonData.data.axies[0].auction.currentPrice / 1e18) / jsonData.data.avgPrices[11]) * 10000) / 100,
            total: jsonData.data.total,
          };
          let currentAxie = _this.axies[configId];
          if (currentAxie) {
            // 避免闪屏
            _vue.set(currentAxie, 'configId', axie.configId);
            if (currentAxie.src !== axie.src)
              _vue.set(currentAxie, 'src', axie.src);
            _vue.set(currentAxie, 'href', axie.href);
            _vue.set(currentAxie, 'tag', axie.tag);
            _vue.set(currentAxie, 'avg', axie.avg);
            _vue.set(currentAxie, 'currentPrices', axie.currentPrices);
            _vue.set(currentAxie, 'diff', axie.diff);
            _vue.set(currentAxie, 'total', axie.total);
          } else
            _vue.set(_this.axies, configId, axie);
          // if (!_this.configDatetimeMap.get(configId) || new Date() - _this.configDatetimeMap.get(configId) > 60000) {
          //   let chart = _this.$echarts.init(document.getElementById(configId));
          //   _this.option.series[0].data = jsonData.data.avgPrices
          //   _this.option && chart.setOption(_this.option)
          //   _this.configDatetimeMap.set(configId, new Date())
          // }
        };
        this.socket.onclose = function () {
          console.log("websocket close");
          if (this.connecting) return;
          this.connecting = true;
          let _this = this;
          setTimeout(function () {
            this.openSocket();
            _this.connecting = false;
          }, 5 * 1000);
        };
        this.socket.onerror = function () {
          console.log("websocket error");
          if (this.connecting) return;
          this.connecting = true;
          let _this = this;
          setTimeout(function () {
            this.openSocket();
            _this.connecting = false;
          }, 5 * 1000);
        }
      }
    },
    tryParse(str) {
      if (typeof str == 'string') {
        try {
          return JSON.parse(str);
        } catch (e) {
          return false;
        }
      }
      return false;
    }
  }
}

</script>