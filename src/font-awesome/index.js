import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import * as far from '@fortawesome/free-regular-svg-icons'
import * as fas from '@fortawesome/free-solid-svg-icons'

library.add([
  far.faTrashAlt,
  fas.faChevronDown,
  fas.faChevronRight,
  fas.faCog,
  fas.faDownload,
  fas.faEllipsisV,
  fas.faExternalLinkAlt,
  fas.faProjectDiagram,
  fas.faSearch,
  fas.faSignInAlt,
  fas.faSignOutAlt,
  fas.faSpinner,
  fas.faUserEdit,
  fas.faUserFriends,
  fas.faUserPlus,
  fas.faUserSlash,
])

Vue.component('fa', FontAwesomeIcon)
