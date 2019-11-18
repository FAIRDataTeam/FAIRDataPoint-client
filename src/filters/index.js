import Vue from 'vue'

Vue.filter('truncate', str => (str.length <= 180
  ? str
  : `${str.substr(0, 180).trim()}...`))
