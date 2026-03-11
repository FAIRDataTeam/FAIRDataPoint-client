import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import * as far from '@fortawesome/free-regular-svg-icons'
import * as fas from '@fortawesome/free-solid-svg-icons'
import type { App } from 'vue'

library.add(far.faTrashAlt)
library.add(fas.faAngleDoubleDown)
library.add(fas.faAngleDown)
library.add(fas.faAngleDoubleLeft)
library.add(fas.faAngleDoubleRight)
library.add(fas.faAngleDoubleUp)
library.add(fas.faAngleLeft)
library.add(fas.faAngleRight)
library.add(far.faCheckSquare)
library.add(fas.faChevronDown)
library.add(fas.faChevronRight)
library.add(fas.faChevronUp)
library.add(fas.faCog)
library.add(fas.faCogs)
library.add(fas.faDownload)
library.add(fas.faEdit)
library.add(fas.faEllipsisV)
library.add(fas.faExternalLinkAlt)
library.add(fas.faFileExport)
library.add(fas.faInfoCircle)
library.add(fas.faKey)
library.add(fas.faPlus)
library.add(fas.faProjectDiagram)
library.add(fas.faSearch)
library.add(fas.faSignInAlt)
library.add(fas.faSignOutAlt)
library.add(fas.faSitemap)
library.add(fas.faShapes)
library.add(fas.faSpinner)
library.add(far.faSquare)
library.add(fas.faSyncAlt)
library.add(fas.faTimes)
library.add(fas.faTrash)
library.add(fas.faUserEdit)
library.add(fas.faUserFriends)
library.add(fas.faUserPlus)
library.add(fas.faUserSlash)

export const registerFontAwesome = (app: App) => {
  app.component('Fa', FontAwesomeIcon)
}
