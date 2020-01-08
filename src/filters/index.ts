import Vue from 'vue'


Vue.filter('truncate', (str: string): string => (str.length <= 180
  ? str
  : `${str.substr(0, 180).trim()}...`))
